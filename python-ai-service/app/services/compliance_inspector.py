import cv2
import numpy as np
from dataclasses import dataclass
from typing import Optional, Tuple, Dict, Any
from PIL import Image
from app.services.compliance_score import calculate_composite_score

# --- Rules (approximate heuristics) ---

# Passport-style tilt guidance (roll angle). Hard fail if abs(roll) > 3 degrees.
TILT_HARD_FAIL_DEG = 3.0

# Blur / Laplacian variance
BLUR_THRESHOLD = 80.0  # keep consistent with face_quality_gate.py

# Face size vs DPI readiness (heuristic)
MIN_FACE_W_PX_AT_ORIGINAL = 300
MIN_FACE_H_PX_AT_ORIGINAL = 375

# Lighting balance: compare left/right intensity variance (lower is better).
LIGHTING_MAX_MEAN_DIFF = 35.0

# Presets Face Spacing / Size Rules (Face height to photo height ratio)
PRESET_FACE_RATIOS = {
    "35x45": (0.70, 0.80),    # India/UK Passport: 70%-80%
    "51x51": (0.50, 0.69),    # USA Visa: 50%-69%
    "33x48": (0.70, 0.80),    # Schengen: 70%-80%
    "40x60": (0.70, 0.80),    # China Visa: 70%-80%
    "2x2in": (0.50, 0.69),    # US Passport: 50%-69%
}

PRESET_ASPECT_RATIOS = {
    "35x45": 35.0 / 45.0,
    "51x51": 1.0,
    "33x48": 33.0 / 48.0,
    "40x60": 40.0 / 60.0,
    "2x2in": 1.0,
}


@dataclass
class ComplianceItem:
    id: str
    title: str
    status: str  # pass | warn | fail
    detail: str
    code: Optional[str] = None
    suggestion: Optional[str] = None
    auto_fixable: bool = False


def _detect_face(gray: np.ndarray) -> Optional[Tuple[int, int, int, int]]:
    cascade = cv2.CascadeClassifier(
        cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
    )
    faces = cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(60, 60))
    if len(faces) == 0:
        return None
    largest = max(faces, key=lambda r: r[2] * r[3])
    x, y, w, h = largest
    return int(x), int(y), int(w), int(h)


def _compute_laplace_blur_score(gray: np.ndarray) -> float:
    return float(cv2.Laplacian(gray, cv2.CV_64F).var())


def _estimate_roll_degrees(gray: np.ndarray, face_rect: Tuple[int, int, int, int]) -> float:
    # Heuristic roll estimation using gradients and orientation of face region.
    x, y, w, h = face_rect
    roi = gray[max(0, y):y + h, max(0, x):x + w]
    if roi.size == 0:
        return 0.0

    # Use PCA on edge coordinates to estimate dominant axis.
    edges = cv2.Canny(roi, 50, 150)
    ys, xs = np.where(edges > 0)
    if len(xs) < 50:
        return 0.0
    coords = np.column_stack([xs, ys]).astype(np.float32)
    mean = coords.mean(axis=0)
    centered = coords - mean
    cov = np.cov(centered.T)
    eigvals, eigvecs = np.linalg.eig(cov)
    principal = eigvecs[:, np.argmax(eigvals)]
    dx, dy = float(principal[0]), float(principal[1])
    angle_rad = np.arctan2(dy, dx)
    angle_deg = np.degrees(angle_rad)
    return float(angle_deg)


def _detect_eyes_and_get_tilt(gray: np.ndarray, face_rect: Tuple[int, int, int, int]) -> Tuple[float, Optional[list]]:
    x, y, w, h = face_rect
    # Look in the top 60% of the face box
    roi_gray = gray[y:y+int(h*0.6), x:x+w]
    
    eye_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_eye.xml")
    eyes = eye_cascade.detectMultiScale(roi_gray, scaleFactor=1.1, minNeighbors=5, minSize=(15, 15))
    
    if len(eyes) >= 2:
        sorted_eyes = sorted(eyes, key=lambda e: e[0])
        best_pair = None
        for i in range(len(sorted_eyes) - 1):
            e1 = sorted_eyes[i]
            e2 = sorted_eyes[i+1]
            e1_cx = e1[0] + e1[2] // 2
            e1_cy = e1[1] + e1[3] // 2
            e2_cx = e2[0] + e2[2] // 2
            e2_cy = e2[1] + e2[3] // 2
            
            dx = e2_cx - e1_cx
            dy = e2_cy - e1_cy
            if dx > 0.15 * w and abs(dy) < 0.15 * h:
                best_pair = (e1, e2)
                break
                
        if best_pair:
            e1, e2 = best_pair
            e1_x_full = x + e1[0] + e1[2] // 2
            e1_y_full = y + e1[1] + e1[3] // 2
            e2_x_full = x + e2[0] + e2[2] // 2
            e2_y_full = y + e2[1] + e2[3] // 2
            
            angle_rad = np.arctan2(e2_y_full - e1_y_full, e2_x_full - e1_x_full)
            angle_deg = float(np.degrees(angle_rad))
            
            return angle_deg, [
                {"x": e1_x_full, "y": e1_y_full},
                {"x": e2_x_full, "y": e2_y_full}
            ]
            
    # Fallback
    roll = _estimate_roll_degrees(gray, face_rect)
    return roll, None


def _check_background(image: np.ndarray, face_rect: Tuple[int, int, int, int]) -> Dict[str, Any]:
    h, w = image.shape[:2]
    # Sample top-left and top-right patches to avoid hair/body
    patch_h = max(5, int(h * 0.12))
    patch_w = max(5, int(w * 0.15))
    
    tl_patch = image[0:patch_h, 0:patch_w]
    tr_patch = image[0:patch_h, w - patch_w:w]
    
    samples = []
    if tl_patch.size > 0:
        samples.append(tl_patch.reshape(-1, 3))
    if tr_patch.size > 0:
        samples.append(tr_patch.reshape(-1, 3))
        
    if not samples:
        return {"is_plain": True, "is_light": True, "std_dev": 0.0, "mean_val": 255.0, "mean_sat": 0.0}
        
    pixels = np.vstack(samples)
    gray_pixels = cv2.cvtColor(pixels.reshape(-1, 1, 3), cv2.COLOR_BGR2GRAY).flatten()
    hsv_pixels = cv2.cvtColor(pixels.reshape(-1, 1, 3), cv2.COLOR_BGR2HSV).reshape(-1, 3)
    
    std_dev = float(np.std(gray_pixels))
    mean_val = float(np.mean(gray_pixels))
    mean_sat = float(np.mean(hsv_pixels[:, 1]))
    
    is_plain = std_dev < 18.0
    is_light = mean_val > 170.0 and mean_sat < 60.0
    
    return {
        "is_plain": is_plain,
        "is_light": is_light,
        "std_dev": std_dev,
        "mean_val": mean_val,
        "mean_sat": mean_sat
    }


def _lighting_balance(gray: np.ndarray, face_rect: Tuple[int, int, int, int]) -> Dict[str, float]:
    x, y, w, h = face_rect
    # Split face region into left/right halves
    roi = gray[max(0, y):y + h, max(0, x):x + w]
    if roi.size == 0:
        return {"left_mean": 0.0, "right_mean": 0.0, "mean_diff": 9999.0}

    half = w // 2
    left = roi[:, :half]
    right = roi[:, half:]

    left_mean = float(np.mean(left)) if left.size else 0.0
    right_mean = float(np.mean(right)) if right.size else 0.0
    mean_diff = float(abs(left_mean - right_mean))
    return {"left_mean": left_mean, "right_mean": right_mean, "mean_diff": mean_diff}


def _accessories_soft_warning(image: np.ndarray) -> Optional[ComplianceItem]:
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    face_rect = _detect_face(gray)
    if not face_rect:
        return None
    x, y, w, h = face_rect

    upper = gray[max(0, y):y + int(h * 0.35), max(0, x):x + w]
    if upper.size == 0:
        return None

    # Count dark pixels in upper band
    thresh = np.percentile(upper, 20)
    dark_ratio = float(np.mean(upper < thresh))

    # If dark ratio is high, warn.
    if dark_ratio > 0.18:
        return ComplianceItem(
            id="accessories",
            title="Accessories / Glasses",
            status="warn",
            detail="Possible accessories (glasses/hat) detected. Many countries restrict these.",
            code="ACCESSORIES_POSSIBLE",
            suggestion="Remove any hats, head coverings, or thick glasses unless worn for religious/medical reasons.",
            auto_fixable=False
        )
    return None


def inspect_compliance(image_path: str, size_preset: Optional[str] = None) -> Dict[str, Any]:
    image = cv2.imread(image_path)
    if image is None:
        # Return a structured failure checklist
        return {
            "passed": False,
            "hard_fail": True,
            "items": [
                {
                    "id": "image_read",
                    "title": "Image validity",
                    "status": "fail",
                    "detail": "Could not decode image.",
                    "code": "UNREADABLE_IMAGE",
                    "suggestion": "Please upload a valid image file.",
                    "auto_fixable": False
                }
            ],
        }

    h, w = image.shape[:2]
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    items = []

    # 1) Face detection
    face_rect = _detect_face(gray)
    if not face_rect:
        items.append({
            "id": "face",
            "title": "Face detection",
            "status": "fail",
            "detail": "No face detected. Photo must be a clear front-facing portrait.",
            "code": "NO_FACE_DETECTED",
            "suggestion": "Make sure your face is fully visible, well-lit, and directly facing the camera.",
            "auto_fixable": False
        })
        return {
            "passed": False,
            "hard_fail": True,
            "items": items,
        }

    fx, fy, fw, fh = face_rect
    face_cx = fx + fw // 2
    face_cy = fy + fh // 2
    img_cx = w // 2
    img_cy = h // 2

    # 2) DPI & quality readiness (heuristic)
    dpi_status = "pass"
    dpi_detail = "Image resolution appears sufficient for 300 DPI printing."
    dpi_suggestion = None
    if fw < MIN_FACE_W_PX_AT_ORIGINAL or fh < MIN_FACE_H_PX_AT_ORIGINAL:
        dpi_status = "fail"
        dpi_detail = f"Image resolution is too low for high-quality printing (face: {fw}x{fh}px)."
        dpi_suggestion = "Move closer to the camera and take the photo with higher resolution settings."

    items.append({
        "id": "dpi_quality",
        "title": "DPI & Print Quality",
        "status": dpi_status,
        "detail": dpi_detail,
        "code": "LOW_RESOLUTION" if dpi_status == "fail" else None,
        "suggestion": dpi_suggestion,
        "auto_fixable": False
    })

    # 3) Blur
    blur_score = _compute_laplace_blur_score(gray)
    blur_status = "pass" if blur_score >= BLUR_THRESHOLD else "fail"
    blur_detail = f"Image sharpness score: {blur_score:.1f} (min {BLUR_THRESHOLD})."
    blur_suggestion = None
    if blur_status == "fail":
        blur_detail = "Image is blurry or out of focus."
        blur_suggestion = "Take the photo in good lighting, hold the camera steady, and make sure it is in focus."

    items.append({
        "id": "blur",
        "title": "Sharpness",
        "status": blur_status,
        "detail": blur_detail,
        "code": "FACE_TOO_BLURRY" if blur_status == "fail" else None,
        "suggestion": blur_suggestion,
        "auto_fixable": False,
        "meta": {"blur_score": blur_score},
    })

    # 4) Tilt / roll
    roll_deg, detected_eyes = _detect_eyes_and_get_tilt(gray, face_rect)
    tilt_status = "pass" if abs(roll_deg) <= TILT_HARD_FAIL_DEG else "fail"
    tilt_detail = f"Estimated head tilt (roll): {roll_deg:.1f}° (limit ±{TILT_HARD_FAIL_DEG}°)."
    tilt_suggestion = None
    if tilt_status == "fail":
        tilt_detail = f"Head tilt ({roll_deg:.1f}°) exceeds standard passport guidelines."
        tilt_suggestion = "Ensure your head is perfectly level and facing straight. Click Auto-Fix to automatically straighten."

    items.append({
        "id": "tilt",
        "title": "Face Angle & Tilt",
        "status": tilt_status,
        "detail": tilt_detail,
        "code": "TILT_OUT_OF_RANGE" if tilt_status == "fail" else None,
        "suggestion": tilt_suggestion,
        "auto_fixable": True,
        "meta": {"roll_deg": roll_deg, "eyes": detected_eyes},
    })

    # 5) Face Centering check
    horiz_offset = abs(face_cx - img_cx) / w
    face_top_ratio = fy / h
    face_bottom_ratio = (fy + fh) / h
    
    centering_status = "pass"
    centering_detail = "Face is properly centered."
    centering_suggestion = None
    centering_code = None

    if horiz_offset > 0.08:
        centering_status = "fail"
        centering_code = "FACE_NOT_CENTERED_HORIZONTAL"
        direction = "right" if face_cx < img_cx else "left"
        centering_detail = f"Face is not centered horizontally (offset by {horiz_offset*100:.1f}%)."
        centering_suggestion = f"Shift the camera slightly to the {direction} or click Auto-Fix to center your face."
    elif face_top_ratio < 0.06:
        centering_status = "fail"
        centering_code = "FACE_TOO_CLOSE_TOP"
        centering_detail = "Face is too close to the top edge."
        centering_suggestion = "Tilt the camera down, move lower, or click Auto-Fix to center your face."
    elif face_bottom_ratio > 0.94:
        centering_status = "fail"
        centering_code = "FACE_TOO_CLOSE_BOTTOM"
        centering_detail = "Face is too close to the bottom edge."
        centering_suggestion = "Tilt the camera up, move higher, or click Auto-Fix to center your face."
        
    items.append({
        "id": "centering",
        "title": "Face Centering",
        "status": centering_status,
        "detail": centering_detail,
        "code": centering_code,
        "suggestion": centering_suggestion,
        "auto_fixable": True
    })

    # 6) Background
    bg_info = _check_background(image, face_rect)
    bg_status = "pass"
    bg_detail = "Background is flat and uniform."
    bg_suggestion = None
    bg_code = None
    
    if not bg_info["is_plain"]:
        bg_status = "fail"
        bg_code = "BACKGROUND_NOT_PLAIN"
        bg_detail = f"Background contains patterns, shadows, or objects (std dev: {bg_info['std_dev']:.1f})."
        bg_suggestion = "Step in front of a flat, solid-colored wall, or click Auto-Fix to remove the background."
    elif not bg_info["is_light"]:
        bg_status = "warn"
        bg_code = "BACKGROUND_NOT_LIGHT"
        bg_detail = "Background is too dark or highly saturated."
        bg_suggestion = "For standard compliance, use a white background. Click Auto-Fix to change the background to white."
        
    items.append({
        "id": "background",
        "title": "Background Uniformity",
        "status": bg_status,
        "detail": bg_detail,
        "code": bg_code,
        "suggestion": bg_suggestion,
        "auto_fixable": True,
        "meta": bg_info
    })

    # 7) Dimensions & Spacing preset check
    preset = size_preset or "35x45"
    face_ratio = fh / h
    target_min, target_max = PRESET_FACE_RATIOS.get(preset, (0.50, 0.80))
    aspect_target = PRESET_ASPECT_RATIOS.get(preset, 0.778)
    aspect_actual = w / h
    
    spacing_status = "pass"
    spacing_detail = f"Face height covers {face_ratio*100:.1f}% of photo (target: {target_min*100:.0f}%-{target_max*100:.0f}%)."
    spacing_suggestion = None
    spacing_code = None
    
    if face_ratio < target_min:
        spacing_status = "fail"
        spacing_code = "FACE_TOO_SMALL_RATIO"
        spacing_detail = f"Face is too small (covers only {face_ratio*100:.1f}% of height, required: {target_min*100:.0f}%-{target_max*100:.0f}%)."
        spacing_suggestion = "Move closer to the camera or click Auto-Fix to crop the image appropriately."
    elif face_ratio > target_max:
        spacing_status = "fail"
        spacing_code = "FACE_TOO_LARGE_RATIO"
        spacing_detail = f"Face is too large (covers {face_ratio*100:.1f}% of height, required: {target_min*100:.0f}%-{target_max*100:.0f}%)."
        spacing_suggestion = "Step back from the camera or click Auto-Fix to zoom out and frame correctly."
    elif abs(aspect_actual - aspect_target) / aspect_target > 0.10:
        spacing_status = "warn"
        spacing_code = "ASPECT_RATIO_MISMATCH"
        spacing_detail = f"Image aspect ratio ({aspect_actual:.2f}) does not match selected preset ({aspect_target:.2f})."
        spacing_suggestion = "Note: The photo will be auto-cropped/resized to match the preset's dimensions."
        
    items.append({
        "id": "dimensions",
        "title": "Dimensions & Spacing",
        "status": spacing_status,
        "detail": spacing_detail,
        "code": spacing_code,
        "suggestion": spacing_suggestion,
        "auto_fixable": spacing_status != "pass"
    })

    # 8) Lighting balance / shadows
    lighting = _lighting_balance(gray, face_rect)
    mean_diff = lighting["mean_diff"]
    lighting_status = "pass" if mean_diff <= LIGHTING_MAX_MEAN_DIFF else "warn"
    lighting_detail = f"Lighting balance diff: {mean_diff:.1f}."
    lighting_suggestion = None
    if mean_diff > LIGHTING_MAX_MEAN_DIFF:
        lighting_status = "warn"
        lighting_detail = "Uneven lighting detected (shadows on one side)."
        lighting_suggestion = "Position your light source directly in front of you for even illumination."

    items.append({
        "id": "lighting",
        "title": "Lighting & Shadows",
        "status": lighting_status,
        "detail": lighting_detail,
        "code": "SHADOWS_DETECTED" if lighting_status == "warn" else None,
        "suggestion": lighting_suggestion,
        "auto_fixable": False,
        "meta": lighting,
    })

    # 9) Accessories/glasses (soft warning)
    acc_item = _accessories_soft_warning(image)
    if acc_item:
        acc_dict = acc_item.__dict__
        acc_dict["suggestion"] = "Remove any hats, head coverings, or thick glasses unless worn for religious/medical reasons."
        acc_dict["auto_fixable"] = False
        items.append(acc_dict)

    hard_fail = any(i.get("status") == "fail" and i.get("id") in {"face", "dpi_quality", "blur", "tilt", "centering", "dimensions"} for i in items)
    passed = not hard_fail

    return {
        "passed": passed,
        "hard_fail": hard_fail,
        "items": items,
        "meta": {
            "face_rect": {"x": fx, "y": fy, "w": fw, "h": fh},
            "roll_deg": roll_deg,
            "blur_score": blur_score,
            "eyes": detected_eyes,
            "dimensions": {"w": w, "h": h}
        },
    }
