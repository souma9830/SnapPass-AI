"""Tests for the retouch service (#1566)."""

import cv2
import numpy as np
import pytest

from app.services.retouch import retouch_portrait


def _blemished_image() -> bytes:
    """Skin-toned canvas with a few small dark blemishes."""
    canvas = np.full((180, 180, 3), (140, 160, 180), dtype=np.uint8)
    rng = np.random.default_rng(42)
    for _ in range(12):
        x, y = int(rng.integers(10, 170)), int(rng.integers(10, 170))
        cv2.circle(canvas, (x, y), 2, (90, 105, 125), -1)
    return cv2.imencode(".png", canvas)[1].tobytes()


def _clean_image() -> bytes:
    canvas = np.full((180, 180, 3), (140, 160, 180), dtype=np.uint8)
    return cv2.imencode(".png", canvas)[1].tobytes()


def test_blemishes_are_altered():
    source = _blemished_image()
    src = cv2.imdecode(np.frombuffer(source, np.uint8), cv2.IMREAD_COLOR)
    out = cv2.imdecode(np.frombuffer(retouch_portrait(source, 1.0), np.uint8), cv2.IMREAD_COLOR)
    diff = np.abs(out.astype(int) - src.astype(int)).sum()
    assert diff > 0


def test_clean_image_changes_subtly():
    source = _clean_image()
    src = cv2.imdecode(np.frombuffer(source, np.uint8), cv2.IMREAD_COLOR)
    out = cv2.imdecode(np.frombuffer(retouch_portrait(source, 1.0), np.uint8), cv2.IMREAD_COLOR)
    # Uniform canvas: bilateral filter changes nothing pixel-wise beyond
    # the feathered spot pass and smoothing blend; assert tight bound.
    diff = np.abs(out.astype(int) - src.astype(int))
    assert diff.mean() < 3.0


def test_zero_intensity_passthrough():
    source = _blemished_image()
    assert retouch_portrait(source, 0.0) == source


def test_intensity_clamped():
    source = _blemished_image()
    out = cv2.imdecode(np.frombuffer(retouch_portrait(source, 5.0), np.uint8), cv2.IMREAD_COLOR)
    assert out.shape == (180, 180, 3)


def test_intensity_changes_output():
    source = _blemished_image()
    soft = retouch_portrait(source, 0.2)
    strong = retouch_portrait(source, 1.0)
    assert soft != strong
    assert soft != source


def test_invalid_bytes_raise():
    with pytest.raises(ValueError):
        retouch_portrait(b"not-an-image", intensity=1.0)


def test_output_is_png():
    result = retouch_portrait(_blemished_image())
    assert result[:8] == b"\x89PNG\r\n\x1a\n"