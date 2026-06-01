import cv2
from dataclasses import dataclass
from typing import Tuple, Optional

BLUR_THRESHOLD = 80.0
MIN_FACE_W = 300
MIN_FACE_H = 375

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
    img = cv2.imread(image_path)
    if img is None:
        return FaceQualityReport(
            passed=False,
            rejection_code="UNREADABLE_IMAGE",
            rejection_reason="Image could not be decoded.",
            user_hint="Please upload a valid JPEG or PNG file."
        )

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # 1. Blur detection
    blur_score = float(cv2.Laplacian(gray, cv2.CV_64F).var())
    if blur_score < BLUR_THRESHOLD:
        return FaceQualityReport(
            passed=False,
            blur_score=blur_score,
            rejection_code="FACE_TOO_BLURRY",
            rejection_reason=f"Image is too blurry (score: {blur_score:.1f}, minimum: {BLUR_THRESHOLD}).",
            user_hint="Take the photo in good lighting and hold the camera steady."
        )

    # 2. Face count detection
    cascade = cv2.CascadeClassifier(
        cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
    )
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
            user_hint="Please upload a solo portrait with only one person in the frame."
        )

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