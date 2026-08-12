"""Tests for the red-eye correction service (issue #1550)."""

import io

import cv2
import numpy as np
import pytest
from PIL import Image

from app.services.red_eye_correction import correct_red_eye


def _make_image(with_red_eye=True):
    canvas = np.full((300, 400, 3), 235, dtype=np.uint8)
    center = (150, 200)
    cv2.circle(canvas, center, 9, (60, 60, 60), -1)
    if with_red_eye:
        cv2.circle(canvas, center, 5, (30, 40, 200), -1)
    ok, buffer = cv2.imencode(".png", canvas)
    return buffer.tobytes()


def _red_channel_stats(image_bytes):
    bgr = cv2.imdecode(np.frombuffer(image_bytes, dtype=np.uint8), cv2.IMREAD_COLOR)
    center = (150, 200)
    mask = np.zeros(bgr.shape[:2], dtype=np.uint8)
    cv2.circle(mask, center, 5, 255, -1)
    pixels = bgr[mask == 255]
    return int(pixels[:, 2].mean()), int(pixels[:, 1].mean())


def test_corrects_red_pupil():
    source = _make_image(with_red_eye=True)
    red_before, _ = _red_channel_stats(source)
    result = correct_red_eye(source, intensity=1.0)
    red_after, _ = _red_channel_stats(result)
    assert red_after < red_before - 30


def test_reduces_saturation():
    source = _make_image(with_red_eye=True)
    result = correct_red_eye(source, intensity=1.0)
    assert Image.open(io.BytesIO(result)).size == (400, 300)


def test_image_without_red_eye_is_unchanged():
    source = _make_image(with_red_eye=False)
    assert correct_red_eye(source, intensity=1.0) == source


def test_zero_intensity_passes_through():
    source = _make_image(with_red_eye=True)
    assert correct_red_eye(source, intensity=0.0) == source


def test_intensity_is_clamped():
    source = _make_image(with_red_eye=True)
    strong = correct_red_eye(source, intensity=5.0)
    weak = correct_red_eye(source, intensity=-1.0)
    assert Image.open(io.BytesIO(strong)).size == (400, 300)
    assert Image.open(io.BytesIO(weak)).size == (400, 300)


def test_garbage_bytes_raise_value_error():
    with pytest.raises(ValueError):
        correct_red_eye(b"not-an-image")