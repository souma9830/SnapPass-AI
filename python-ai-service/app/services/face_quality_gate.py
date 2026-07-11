import os
import cv2
import numpy as np
from dataclasses import dataclass
from typing import Tuple, Optional

BLUR_THRESHOLD = 80.0
MIN_FACE_W = 300
MIN_FACE_H = 375
MAX_ASPECT_RATIO = 3.0
MIN_IMAGE_DIM = 100

FACE_CASCADE_PATH = cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
EYE_CASCADE_PATH = cv2.data.haarcascades + 'haarcascade_eye.xml'


@dataclass
class FaceQualityReport:
    passed: bool
    face_count: int = 0
    blur_score: float = 0.0
    brightness_score: float = 0.0
    face_region: Optional[Tuple[int, int, int, int]] = None
    image_dimensions: Optional[Tuple[int, int]] = None
    rejection_code: Optional[str] = None
    rejection_reason: Optional[str] = None
    user_hint: Optional[str] = None


def _validate_header(image_path: str) -> Tuple[bool, Optional[str]]:
    try:
        with open(image_path, "rb") as f:
            header = f.read(12)
            is_jpeg = header.startswith(b"\xff\xd8\xff")
            is_png = header.startswith(b"\x89PNG\r\n\x1a\n")
            is_webp = header.startswith(b"RIFF") and b"WEBP" in header[:12]

            if not (is_jpeg or is_png or is_webp):
                return False, "Unapproved file format or invalid image header."
    except Exception as e:
        return False, f"Failed to read image headers: {str(e)}"
    return True, None


def assess_face_quality(image_path: str) -> FaceQualityReport:
    if not os.path.exists(image_path):
        return FaceQualityReport(
            passed=False,
            rejection_code="FILE_NOT_FOUND",
            rejection_reason="The specified image file does not exist.",
            user_hint="Please select and upload a valid image file."
        )

    if os.path.getsize(image_path) == 0:
        return FaceQualityReport(
            passed=False,
            rejection_code="EMPTY_FILE",
            rejection_reason="The uploaded file is empty.",
            user_hint="The file appears to contain no data. Please upload a fresh photo.")

    header_valid, header_error = _validate_header(image_path)
    if not header_valid:
        return FaceQualityReport(
            passed=False,
            rejection_code="INVALID_FORMAT",
            rejection_reason=header_error,
            user_hint="Only standard JPEG, PNG, or WebP images are accepted.")

    try:
        img = cv2.imread(image_path)
    except Exception as e:
        return FaceQualityReport(
            passed=False,
            rejection_code="UNREADABLE_IMAGE",
            rejection_reason=f"OpenCV failed to read image array: {str(e)}",
            user_hint="The file is formatted improperly. Please try re-saving it.")

    if img is None:
        return FaceQualityReport(
            passed=False,
            rejection_code="UNREADABLE_IMAGE",
            rejection_reason="Image could not be decoded by OpenCV.",
            user_hint="Please upload a valid JPEG or PNG file."
        )

    height, width = img.shape[:2]
    if width < MIN_IMAGE_DIM or height < MIN_IMAGE_DIM:
        return FaceQualityReport(
            passed=False,
            image_dimensions=(width, height),
            rejection_code="IMAGE_TOO_SMALL",
            rejection_reason=f"Image dimensions too small ({width}x{height}).",
            user_hint="Upload a higher resolution photo.")

    aspect_ratio = max(width, height) / max(min(width, height), 1)
    if aspect_ratio > MAX_ASPECT_RATIO:
        return FaceQualityReport(
            passed=False,
            image_dimensions=(width, height),
            rejection_code="BAD_ASPECT_RATIO",
            rejection_reason=f"Aspect ratio too extreme ({aspect_ratio:.1f}:1).",
            user_hint="Use a standard portrait orientation photo.")

    try:
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    except Exception as e:
        return FaceQualityReport(
            passed=False,
            rejection_code="COLOR_CONVERSION_ERROR",
            rejection_reason=f"Failed to convert image to grayscale: {str(e)}",
            user_hint="Please verify the image is a standard RGB portrait.")

    blur_score = float(cv2.Laplacian(gray, cv2.CV_64F).var())
    if blur_score < BLUR_THRESHOLD:
        return FaceQualityReport(
            passed=False,
            blur_score=blur_score,
            rejection_code="FACE_TOO_BLURRY",
            rejection_reason=f"Image is too blurry (score: {blur_score:.1f}, minimum: {BLUR_THRESHOLD}).",
            user_hint="Take the photo in good lighting and hold the camera steady.")

    brightness_score = float(np.mean(gray))
    if brightness_score < 30 or brightness_score > 240:
        return FaceQualityReport(
            passed=False,
            blur_score=blur_score,
            brightness_score=brightness_score,
            rejection_code="BAD_BRIGHTNESS",
            rejection_reason=f"Image brightness unsuitable ({brightness_score:.0f}/255).",
            user_hint="Ensure the photo is well-lit and not too dark or overexposed.")

    cascade = cv2.CascadeClassifier(FACE_CASCADE_PATH)
    faces = cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(100, 100))

    if len(faces) == 0:
        return FaceQualityReport(
            passed=False,
            face_count=0,
            blur_score=blur_score,
            rejection_code="NO_FACE_DETECTED",
            rejection_reason="No face detected in the image.",
            user_hint="Make sure your face is clearly visible, well-lit, and facing the camera directly."
        )

    if len(faces) > 1:
        return FaceQualityReport(
            passed=False,
            face_count=len(faces),
            blur_score=blur_score,
            rejection_code="MULTIPLE_FACES_DETECTED",
            rejection_reason=f"{len(faces)} faces detected.",
            user_hint="Please upload a solo portrait with only one person in the frame.")

    x, y, w, h = faces[0]
    if w < MIN_FACE_W or h < MIN_FACE_H:
        return FaceQualityReport(
            passed=False,
            face_count=1,
            blur_score=blur_score,
            face_region=(x, y, w, h),
            rejection_code="FACE_TOO_SMALL",
            rejection_reason=f"Face region too small ({w}x{h}px). Minimum: {MIN_FACE_W}x{MIN_FACE_H}px.",
            user_hint="Move closer to the camera so your face fills more of the frame."
        )

    eye_cascade = cv2.CascadeClassifier(EYE_CASCADE_PATH)
    face_roi = gray[y:y+h, x:x+w]
    eyes = eye_cascade.detectMultiScale(face_roi, scaleFactor=1.1, minNeighbors=5, minSize=(20, 20))

    return FaceQualityReport(
        passed=True,
        face_count=1,
        blur_score=blur_score,
        brightness_score=brightness_score,
        face_region=(x, y, w, h),
        image_dimensions=(width, height),
    )
