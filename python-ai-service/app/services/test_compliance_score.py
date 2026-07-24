"""
Unit tests for composite compliance scoring module.
"""

import pytest
from app.services.compliance_score import calculate_composite_score

def test_calculate_composite_score_excellent():
    metrics = {
        "blur_score": 150.0,
        "face_width": 350,
        "face_height": 400,
        "background_uniformity": 95.0,
    }
    result = calculate_composite_score(metrics)
    assert result["overall_score"] >= 85.0
    assert result["status"] == "EXCELLENT"
    assert "breakdown" in result

def test_calculate_composite_score_fail():
    metrics = {
        "blur_score": 40.0,
        "face_width": 150,
        "face_height": 180,
        "background_uniformity": 30.0,
    }
    result = calculate_composite_score(metrics)
    assert result["overall_score"] < 65.0
    assert result["status"] == "FAIL"

def test_calculate_composite_score_defaults():
    result = calculate_composite_score({})
    assert "overall_score" in result
    assert "status" in result
