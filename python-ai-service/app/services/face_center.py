

import cv2
import numpy as np
from PIL import Image
import io


# ICAO 9303 guideline: face should occupy 75 % of the image height.
# Integrated with backend image controller processing and rembg background removal.
COUNTRY_STANDARDS = {
    "default": {"face_height_ratio": 0.75, "head_top_padding_ratio": 0.20},
    "us": {"face_height_ratio": 0.50, "head_top_padding_ratio": 0.15},
    "uk": {"face_height_ratio": 0.65, "head_top_padding_ratio": 0.10},
    "canada": {"face_height_ratio": 0.60, "head_top_padding_ratio": 0.15},
    "australia": {"face_height_ratio": 0.70, "head_top_padding_ratio": 0.15},
    "schengen": {"face_height_ratio": 0.75, "head_top_padding_ratio": 0.20},
}


def center_face(image_bytes: bytes, country_standard: str = "default") -> bytes:

    img_pil = Image.open(io.BytesIO(image_bytes)).convert("RGBA")
    img_np = np.array(img_pil)

    # OpenCV works with BGR; use the RGB channels for detection
    img_bgr = cv2.cvtColor(img_np[:, :, :3], cv2.COLOR_RGB2BGR)
    gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
    gray = cv2.equalizeHist(gray)

    face_rect = _detect_face(gray)
    if face_rect is None:
        raise ValueError(
            "No face detected in the image. "
            "Please use a clear front-facing portrait photo."
        )

    fx, fy, fw, fh = face_rect
    face_cx = fx + fw // 2  # horizontal centre of face
    face_top = fy           # top of bounding box (eyebrows area)

    standards = COUNTRY_STANDARDS.get(country_standard.lower(), COUNTRY_STANDARDS["default"])
    face_height_ratio = standards["face_height_ratio"]
    head_top_padding_ratio = standards["head_top_padding_ratio"]

    # --- Compute the target canvas height from the face height ---
    # face_height_ratio tells us: fh / target_h = face_height_ratio
    target_h = int(fh / face_height_ratio)
    target_w = img_pil.width  # keep original width initially

    # How much space above the face-top we want (forehead + hair room)
    head_clearance = int(head_top_padding_ratio * target_h)

    # The y-coordinate in the original image that maps to y=0 in the crop
    crop_top = face_top - head_clearance
    crop_bottom = crop_top + target_h

    # Centre horizontally around the face centre
    crop_left = face_cx - target_w // 2
    crop_right = crop_left + target_w

    # --- Pad if the crop extends beyond the original image ---
    pad_top = max(0, -crop_top)
    pad_bottom = max(0, crop_bottom - img_pil.height)
    pad_left = max(0, -crop_left)
    pad_right = max(0, crop_right - img_pil.width)

    # Expand canvas with transparent padding then crop
    padded = Image.new(
        "RGBA",
        (img_pil.width + pad_left + pad_right, img_pil.height + pad_top + pad_bottom),
        (255, 255, 255, 255),
    )
    padded.paste(img_pil, (pad_left, pad_top))

    # Re-calculate crop coords in the padded image
    c_top = crop_top + pad_top
    c_left = crop_left + pad_left
    c_bottom = c_top + target_h
    c_right = c_left + target_w

    cropped = padded.crop((c_left, c_top, c_right, c_bottom))

    output = io.BytesIO()
    cropped.save(output, format="PNG")
    return output.getvalue()


# Helpers
def _detect_face(gray_image: np.ndarray):
    """
    Run OpenCV Haar cascade on a grayscale image.
    Returns (x, y, w, h) of the largest detected face, or None.
    """
    cascade = cv2.CascadeClassifier(
        cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
    )
    faces = cascade.detectMultiScale(
        gray_image,
        scaleFactor=1.1,
        minNeighbors=5,
        minSize=(60, 60),
    )

    if len(faces) == 0:
        return None

    # Pick the largest face by area
    largest = max(faces, key=lambda r: r[2] * r[3])
    return largest
