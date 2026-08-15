"""Tests for shared face_detection helper."""
import numpy as np
import pytest
from app.services.face_detection import detect_largest_face


class TestDetectLargestFace:
    def test_no_face_returns_none(self):
        gray = np.zeros((100, 100), dtype=np.uint8)
        assert detect_largest_face(gray) is None

    def test_valid_face_image_returns_rect(self):
        gray = np.zeros((200, 200), dtype=np.uint8)
        gray[50:150, 50:150] = 255
        rect = detect_largest_face(gray)
        assert rect is not None
        x, y, w, h = rect
        assert w > 0 and h > 0