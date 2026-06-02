import pytest
from face_quality_gate import assess_face_quality

def test_rejects_unreadable_file():
    report = assess_face_quality("nonexistent_file.jpg")
    assert not report.passed
    assert report.rejection_code == "UNREADABLE_IMAGE"

def test_report_has_user_hint_on_failure():
    report = assess_face_quality("nonexistent_file.jpg")
    assert report.user_hint is not None
    assert len(report.user_hint) > 0