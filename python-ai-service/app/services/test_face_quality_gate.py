import os
import tempfile
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

