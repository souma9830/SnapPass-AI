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
        "head_ratio": 0.75,
        "roll_deg": 0.5,
        "lighting_diff": 5.0,
    }
    result = calculate_composite_score(metrics)
    assert result["overall_score"] >= 85.0
    assert result["status"] == "EXCELLENT"
    assert "breakdown" in result
    assert "tilt_rating" in result["breakdown"]
    assert "lighting_rating" in result["breakdown"]
    assert "recommendations" in result

def test_calculate_composite_score_fail():
    metrics = {
        "blur_score": 40.0,
        "face_width": 150,
        "face_height": 180,
        "background_uniformity": 30.0,
        "head_ratio": 0.40,
        "roll_deg": 12.0,
        "lighting_diff": 45.0,
    }
    result = calculate_composite_score(metrics)
    assert result["overall_score"] < 65.0
    assert result["status"] == "FAIL"
    assert len(result["recommendations"]) > 0

def test_calculate_composite_score_defaults():
    result = calculate_composite_score({})
    assert "overall_score" in result
    assert "status" in result
    assert "breakdown" in result
    assert "recommendations" in result


@pytest.mark.parametrize(
    "metrics,expected_status,min_score,max_score",
    [
        (
            {"blur_score": 100.0, "face_width": 300, "face_height": 375, "background_uniformity": 90.0, "head_ratio": 0.72},
            "EXCELLENT",
            90.0,
            100.0,
        ),
        (
            {"blur_score": 90.0, "face_width": 270, "face_height": 330, "background_uniformity": 80.0, "head_ratio": 0.75},
            "PASS",
            80.0,
            89.9,
        ),
        (
            {"blur_score": 75.0, "face_width": 220, "face_height": 280, "background_uniformity": 65.0, "head_ratio": 0.60},
            "ACCEPTABLE",
            65.0,
            79.9,
        ),
    ],
)
def test_calculate_composite_score_parameterized_tiers(metrics, expected_status, min_score, max_score):
    result = calculate_composite_score(metrics)
    assert min_score <= result["overall_score"] <= max_score
    assert result["status"] == expected_status
    assert "breakdown" in result
    for key in ["blur_rating", "resolution_rating", "background_rating", "head_ratio_rating"]:
        assert key in result["breakdown"]

def test_calculate_composite_score_partial_attributes():
    # Verify resilience when only specific metrics are provided
    partial_metrics = {"blur_score": 110.0}
    result = calculate_composite_score(partial_metrics)
    assert "overall_score" in result
    assert "status" in result
    assert isinstance(result["overall_score"], float)
