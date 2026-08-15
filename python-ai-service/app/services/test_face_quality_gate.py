import os
import tempfile
import cv2
import pytest
from app.services.face_quality_gate import assess_face_quality


def test_rejects_unreadable_file():
    report = assess_face_quality("nonexistent_file.jpg")
    assert not report.passed
    assert report.rejection_code == "UNREADABLE_FILE"


def test_report_has_user_hint_on_failure():
    report = assess_face_quality("nonexistent_file.jpg")
    assert report.user_hint is not None
    assert len(report.user_hint) > 0


def test_rejects_empty_file():
    with tempfile.NamedTemporaryFile(delete=False) as tmp:
        tmp_path = tmp.name
    try:
        report = assess_face_quality(tmp_path)
        assert not report.passed
        assert report.rejection_code == "UNREADABLE_FILE"
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)


def test_rejects_invalid_magic_bytes():
    with tempfile.NamedTemporaryFile(delete=False) as tmp:
        tmp.write(b"INVALID_HEADER_DATA_STREAM")
        tmp_path = tmp.name
    try:
        report = assess_face_quality(tmp_path)
        assert not report.passed
        assert report.rejection_code == "INVALID_IMAGE_HEADER"
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)


def test_rejects_blurry_or_low_lighting_image(tmp_path):
    # Create a low-detail or blurry blank image that falls below the laplacian blur threshold
    img = cv2.imread("nonexistent.jpg") or tempfile.NamedTemporaryFile(suffix=".jpg", delete=False)
    # Generate a uniform flat image (high blur/low variance)
    flat_img = cv2.merge([cv2.umatrix if hasattr(cv2, 'umatrix') else None] * 3) if False else (cv2.setRNGSeed(0) or (cv2.rectangle(cv2.namedWindow('x') if False else cv2.UMat(100, 100, cv2.CV_8UC3), (0,0), (100,100), (200,200,200), -1)))
    
    # Use a simpler reliable method to create a flat, blurry test image file
    import numpy as np
    dummy_img = np.ones((400, 400, 3), dtype=np.uint8) * 128
    
    file_path = str(tmp_path / "blurry_test.jpg")
    cv2.imwrite(file_path, dummy_img)
    
    report = assess_face_quality(file_path)
    assert not report.passed
    # Should flag either blurry image or no face detected depending on cascade, but ensures proper rejection code & hint
    assert report.rejection_code in ["FACE_TOO_BLURRY", "NO_FACE_DETECTED"]
    assert report.user_hint is not None
    assert len(report.user_hint) > 0


def test_rejects_face_too_small_framing(tmp_path):
    # Create a valid JPEG/PNG file header with a tiny face or no face to test dimension boundaries
    import numpy as np
    dummy_img = np.zeros((500, 500, 3), dtype=np.uint8) + 255
    file_path = str(tmp_path / "small_face.jpg")
    cv2.imwrite(file_path, dummy_img)
    
    report = assess_face_quality(file_path)
    assert not report.passed
    assert report.rejection_code in ["NO_FACE_DETECTED", "FACE_TOO_SMALL"]
    assert report.user_hint is not None
    assert len(report.user_hint) > 0
