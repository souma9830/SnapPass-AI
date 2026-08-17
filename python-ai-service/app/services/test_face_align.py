import pytest
import numpy as np
import cv2
import io
from unittest.mock import patch, MagicMock
from PIL import Image

from app.services.face_align import auto_rotate, AlignmentResult, _detect_face, _detect_eye_roll


def _make_tilted_image(width=300, height=400, tilt_deg=0.0):
    """Create a test image with a face-like pattern, optionally tilted."""
    img = np.full((height, width, 3), 240, dtype=np.uint8)

    cx, cy = width // 2, height // 2
    face_w, face_h = 120, 160
    cv2.ellipse(img, (cx, cy), (face_w // 2, face_h // 2), 0, 0, 360, (200, 180, 160), -1)

    eye_y = cy - face_h // 6
    eye_offset = face_w // 5
    cv2.circle(img, (cx - eye_offset, eye_y), 10, (50, 50, 50), -1)
    cv2.circle(img, (cx + eye_offset, eye_y), 10, (50, 50, 50), -1)

    if abs(tilt_deg) > 0.1:
        h, w = img.shape[:2]
        matrix = cv2.getRotationMatrix2D((cx, cy), tilt_deg, 1.0)
        img = cv2.warpAffine(img, matrix, (w, h), borderMode=cv2.BORDER_CONSTANT, borderValue=(255, 255, 255))

    _, encoded = cv2.imencode(".png", img)
    return encoded.tobytes()


@patch("app.services.face_align.cv2.CascadeClassifier")
def test_auto_rotate_no_face_raises(mock_cc_cls):
    mock_cc = MagicMock()
    mock_cc_cls.return_value = mock_cc
    mock_cc.detectMultiScale.return_value = np.array([])

    _, fake_img = cv2.imencode(".png", np.full((400, 300, 3), 200, dtype=np.uint8))

    with pytest.raises(ValueError, match="No face detected"):
        auto_rotate(fake_img.tobytes())


@patch("app.services.face_align._detect_eye_roll", return_value=(0.0, False))
@patch("app.services.face_align._detect_face", return_value=(80, 100, 140, 180))
def test_auto_rotate_already_level(mock_face, mock_eyes):
    image_bytes = _make_tilted_image(tilt_deg=0.0)
    result = auto_rotate(image_bytes)
    assert isinstance(result, AlignmentResult)
    assert abs(result.roll_degrees) < 0.1


@patch("app.services.face_align._detect_eye_roll", return_value=(0.0, False))
@patch("app.services.face_align._detect_face", return_value=(80, 100, 140, 180))
def test_auto_rotate_level_returns_input(mock_face, mock_eyes):
    image_bytes = _make_tilted_image(tilt_deg=0.0)
    result = auto_rotate(image_bytes)
    assert isinstance(result, AlignmentResult)
    assert abs(result.roll_degrees) < 0.1
    assert result.corrected_bytes == image_bytes


@patch("app.services.face_align._detect_eye_roll", return_value=(5.0, True))
@patch("app.services.face_align._detect_face", return_value=(80, 100, 140, 180))
def test_auto_rotate_tilted_corrects_image(mock_face, mock_eyes):
    image_bytes = _make_tilted_image(tilt_deg=5.0)
    result = auto_rotate(image_bytes)
    assert isinstance(result, AlignmentResult)
    assert result.corrected_bytes is not None
    assert len(result.corrected_bytes) > 0
    assert result.corrected_bytes[:8] == b'\x89PNG\r\n\x1a\n'


@patch("app.services.face_align._detect_eye_roll", return_value=(30.0, True))
@patch("app.services.face_align._detect_face", return_value=(80, 100, 140, 180))
def test_auto_rotate_clamps_large_tilt(mock_face, mock_eyes):
    image_bytes = _make_tilted_image(tilt_deg=30.0)
    result = auto_rotate(image_bytes)
    assert result.corrected_bytes == image_bytes


@patch("app.services.face_align._detect_eye_roll", return_value=(0.0, False))
@patch("app.services.face_align._detect_face", return_value=(80, 100, 140, 180))
def test_auto_rotate_returns_png(mock_face, mock_eyes):
    image_bytes = _make_tilted_image(tilt_deg=5.0)
    result = auto_rotate(image_bytes)
    assert result.corrected_bytes[:8] == b'\x89PNG\r\n\x1a\n'


def test_auto_rotate_invalid_image():
    with pytest.raises(ValueError, match="Could not decode"):
        auto_rotate(b"not an image at all")


@patch("app.services.face_align.cv2.CascadeClassifier")
def test_detect_face_returns_none_when_no_faces(mock_cc_cls):
    mock_cc = MagicMock()
    mock_cc_cls.return_value = mock_cc
    mock_cc.detectMultiScale.return_value = np.array([])
    gray = np.full((400, 300), 200, dtype=np.uint8)
    result = _detect_face(gray)
    assert result is None


@patch("app.services.face_align.cv2.CascadeClassifier")
def test_detect_face_returns_largest(mock_cc_cls):
    mock_cc = MagicMock()
    mock_cc_cls.return_value = mock_cc
    mock_cc.detectMultiScale.return_value = np.array([
        [10, 20, 80, 100],
        [50, 60, 150, 200],
    ])
    gray = np.full((400, 300), 200, dtype=np.uint8)
    result = _detect_face(gray)
    assert result == (50, 60, 150, 200)
    assert all(isinstance(v, int) for v in result)


@patch("app.services.face_align.cv2.CascadeClassifier")
def test_detect_eye_roll_no_eyes_falls_back_to_pca(mock_cc_cls):
    mock_cc = MagicMock()
    mock_cc_cls.return_value = mock_cc
    mock_cc.detectMultiScale.return_value = np.array([])

    gray = np.full((400, 300), 200, dtype=np.uint8)
    face_rect = (60, 80, 180, 240)
    roll, detected = _detect_eye_roll(gray, face_rect)
    assert isinstance(roll, float)
    assert detected is False


def test_alignment_result_dataclass():
    result = AlignmentResult(roll_degrees=5.0, corrected_bytes=b"test", eyes_detected=True)
    assert result.roll_degrees == 5.0
    assert result.corrected_bytes == b"test"
    assert result.eyes_detected is True
