"""
face_align.py — Auto-rotate and face alignment correction.

Detects eye landmarks using OpenCV Haar cascades, calculates the roll
angle between the eyes, and rotates the image so the face is perfectly
level.  Falls back to PCA-based edge orientation if eyes are not found.
"""

import cv2
import numpy as np
from typing import Optional, Tuple
from dataclasses import dataclass


@dataclass
class AlignmentResult:
    """Result of a face alignment operation."""
    roll_degrees: float
    corrected_bytes: bytes
    eyes_detected: bool


# Maximum roll angle (degrees) to correct.  Images tilted beyond this
# are likely not simple selfies and should not be auto-rotated.
MAX_CORRECTION_DEG = 25.0


def _detect_face(gray: np.ndarray) -> Optional[Tuple[int, int, int, int]]:
    """Detect the largest face in a grayscale image using Haar cascade."""
    cascade = cv2.CascadeClassifier(
        cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
    )
    faces = cascade.detectMultiScale(
        gray, scaleFactor=1.1, minNeighbors=5, minSize=(60, 60)
    )
    if len(faces) == 0:
        return None
    best = max(faces, key=lambda r: r[2] * r[3])
    return int(best[0]), int(best[1]), int(best[2]), int(best[3])


def _detect_eye_roll(
    gray: np.ndarray, face_rect: Tuple[int, int, int, int]
) -> Tuple[float, bool]:
    """Detect eyes within the face ROI and compute the roll angle.

    Returns:
        (roll_degrees, eyes_detected) where roll_degrees is positive
        when the right eye is lower than the left.
    """
    x, y, w, h = face_rect
    # Only look at the upper 60 % of the face (eyes region)
    roi = gray[y : y + int(h * 0.6), x : x + w]
    if roi.size == 0:
        return 0.0, False

    eye_cascade = cv2.CascadeClassifier(
        cv2.data.haarcascades + "haarcascade_eye.xml"
    )
    eyes = eye_cascade.detectMultiScale(
        roi, scaleFactor=1.1, minNeighbors=5, minSize=(15, 15)
    )

    if len(eyes) >= 2:
        sorted_eyes = sorted(eyes, key=lambda e: e[0])
        # Find the best horizontally-separated pair
        for i in range(len(sorted_eyes) - 1):
            e1 = sorted_eyes[i]
            e2 = sorted_eyes[i + 1]
            e1_cx = e1[0] + e1[2] // 2
            e1_cy = e1[1] + e1[3] // 2
            e2_cx = e2[0] + e2[2] // 2
            e2_cy = e2[1] + e2[3] // 2

            dx = e2_cx - e1_cx
            dy = e2_cy - e1_cy
            if dx > 0.15 * w and abs(dy) < 0.15 * h:
                angle_rad = np.arctan2(dy, dx)
                return float(np.degrees(angle_rad)), True

    # Fallback: PCA on Canny edges of the face region
    edges = cv2.Canny(roi, 50, 150)
    ys, xs = np.where(edges > 0)
    if len(xs) < 50:
        return 0.0, False

    coords = np.column_stack([xs, ys]).astype(np.float32)
    mean = coords.mean(axis=0)
    centered = coords - mean
    cov = np.cov(centered.T)
    eigvals, eigvecs = np.linalg.eig(cov)
    principal = eigvecs[:, np.argmax(eigvals)]
    dx, dy = float(principal[0]), float(principal[1])
    angle_deg = float(np.degrees(np.arctan2(dy, dx)))
    return angle_deg, False


def auto_rotate(image_bytes: bytes) -> AlignmentResult:
    """Auto-rotate an image so the detected face is level.

    Steps:
        1. Decode the image bytes into an OpenCV matrix.
        2. Detect the largest face using Haar cascade.
        3. Detect eyes within the face ROI and compute roll angle.
        4. Rotate the image by the negative of the detected angle
           (filling borders with white) so the face becomes level.
        5. Re-encode as PNG bytes.

    Args:
        image_bytes: Raw bytes of the input image (any format OpenCV
                     can decode).

    Returns:
        AlignmentResult with the corrected image bytes and metadata.

    Raises:
        ValueError: If no face is detected in the image.
    """
    nparr = np.frombuffer(image_bytes, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if image is None:
        raise ValueError("Could not decode image for auto-rotation.")

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    face_rect = _detect_face(gray)
    if face_rect is None:
        raise ValueError(
            "No face detected for auto-rotation. "
            "Please use a clear front-facing portrait."
        )

    roll_deg, eyes_detected = _detect_eye_roll(gray, face_rect)

    if abs(roll_deg) < 0.1:
        # Image is already level — return as-is
        return AlignmentResult(
            roll_degrees=0.0,
            corrected_bytes=image_bytes,
            eyes_detected=eyes_detected,
        )

    # Clamp to safe range
    if abs(roll_deg) > MAX_CORRECTION_DEG:
        return AlignmentResult(
            roll_degrees=roll_deg,
            corrected_bytes=image_bytes,
            eyes_detected=eyes_detected,
        )

    h, w = image.shape[:2]
    fx, fy, fw, fh = face_rect
    center = (fx + fw // 2, fy + fh // 2)

    matrix = cv2.getRotationMatrix2D(center, -roll_deg, 1.0)
    rotated = cv2.warpAffine(
        image, matrix, (w, h),
        borderMode=cv2.BORDER_CONSTANT,
        borderValue=(255, 255, 255),
    )

    success, encoded = cv2.imencode(".png", rotated)
    if not success:
        raise ValueError("Failed to encode rotated image as PNG.")

    return AlignmentResult(
        roll_degrees=roll_deg,
        corrected_bytes=encoded.tobytes(),
        eyes_detected=eyes_detected,
    )
