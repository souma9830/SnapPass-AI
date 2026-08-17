"""Tests for shared face_detection helper."""
import numpy as np
import pytest
from app.services.face_detection import detect_largest_face, detect_all_faces


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


class TestDetectAllFaces:
    def test_no_face_returns_empty_list(self):
        gray = np.zeros((100, 100), dtype=np.uint8)
        result = detect_all_faces(gray)
        assert result == []

    def test_result_is_sorted_by_area_desc(self):
        gray = np.zeros((300, 300), dtype=np.uint8)
        gray[20:120, 20:120] = 255
        gray[150:250, 150:250] = 200
        result = detect_all_faces(gray)
        if len(result) >= 2:
            area0 = result[0]["w"] * result[0]["h"]
            area1 = result[1]["w"] * result[1]["h"]
            assert area0 >= area1

    def test_each_face_has_required_keys(self):
        gray = np.zeros((200, 200), dtype=np.uint8)
        gray[30:130, 30:130] = 255
        result = detect_all_faces(gray)
        for face in result:
            assert "index" in face
            assert "x" in face
            assert "y" in face
            assert "w" in face
            assert "h" in face
            assert isinstance(face["index"], int)