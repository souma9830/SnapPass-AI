import os
import cv2
from dataclasses import dataclass
from typing import Tuple, Optional

BLUR_THRESHOLD = 80.0
MIN_FACE_W = 300
MIN_FACE_H = 375


# Enhanced Face Quality Gate for Studio Passport Photo AI Pipeline
@dataclass
class FaceQualityReport:
    passed: bool
    face_count: int = 0
    blur_score: float = 0.0
    face_region: Optional[Tuple[int, int, int, int]] = None
    rejection_code: Optional[str] = None
    rejection_reason: Optional[str] = None
    user_hint: Optional[str] = None


def assess_face_quality(image_path: str) -> FaceQualityReport:
    # 1. Existence and size validations
    if not os.path.exists(image_path):
        return FaceQualityReport(
            passed=False,
            rejection_code="UNREADABLE_FILE",
            rejection_reason="The specified image file does not exist.",
            user_hint="Please select and upload a valid image file."
        )

    if os.path.getsize(image_path) == 0:
        return FaceQualityReport(
            passed=False,
            rejection_code="UNREADABLE_FILE",
            rejection_reason="The uploaded file is empty.",
            user_hint="The file appears to contain no data. Please upload a fresh photo.")

    # 2. File header magic bytes validation (JPEG / PNG / WebP)
    try:
        with open(image_path, "rb") as f:
            header = f.read(12)
            # JPEG starts with FF D8 FF
            # PNG starts with 89 50 4E 47 0D 0A 1A 0A
            # WebP starts with RIFF .... WEBP
            is_jpeg = header.startswith(b"\xff\xd8\xff")
            is_png = header.startswith(b"\x89PNG\r\n\x1a\n")
            is_webp = header.startswith(b"RIFF") and b"WEBP" in header

            if not (is_jpeg or is_png or is_webp):
                return FaceQualityReport(
                    passed=False,
                    rejection_code="INVALID_IMAGE_HEADER",
                    rejection_reason="Unapproved file format or invalid image header.",
                    user_hint="Only standard JPEG, PNG, or WebP images are accepted.")
    except Exception as e:
        return FaceQualityReport(
            passed=False,
            rejection_code="UNREADABLE_FILE",
            rejection_reason=f"Failed to read image headers: {str(e)}",
            user_hint="The file couldn't be opened. Please verify it isn't corrupted.")

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

    try:
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    except Exception as e:
        return FaceQualityReport(
            passed=False,
            rejection_code="COLOR_CONVERSION_ERROR",
            rejection_reason=f"Failed to convert image to grayscale: {str(e)}",
            user_hint="Please verify the image is a standard RGB portrait."
        )

    # 1. Blur detection
    blur_score = float(cv2.Laplacian(gray, cv2.CV_64F).var())
    if blur_score < BLUR_THRESHOLD:
        return FaceQualityReport(
            passed=False,
            blur_score=blur_score,
            rejection_code="FACE_TOO_BLURRY",
            rejection_reason=f"Image is too blurry (score: {blur_score:.1f}, minimum: {BLUR_THRESHOLD}).",
            user_hint="Take the photo in good lighting and hold the camera steady.")

    # 2. Face count detection
    cascade = cv2.CascadeClassifier(
        cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
    )
    faces = cascade.detectMultiScale(
        gray,
        scaleFactor=1.1,
        minNeighbors=5,
        minSize=(
            100,
            100))

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

    # 3. Face region size check
    x, y, w, h = faces[0]
    if w < MIN_FACE_W or h < MIN_FACE_H:
        return FaceQualityReport(
            passed=False,
            face_count=1,
            blur_score=blur_score,
            face_region=(x, y, w, h),
            rejection_code="FACE_TOO_SMALL",
            rejection_reason=f"Face region too small ({w}×{h}px). Minimum: {MIN_FACE_W}×{MIN_FACE_H}px.",
            user_hint="Move closer to the camera so your face fills more of the frame."
        )

    return FaceQualityReport(
        passed=True,
        face_count=1,
        blur_score=blur_score,
        face_region=(x, y, w, h)
    )
