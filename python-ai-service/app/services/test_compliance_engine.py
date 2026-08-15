import pytest
from app.services.compliance_score import calculate_composite_score
from app.services.preset_compliance_engine import PresetComplianceEngine

def test_calculate_composite_score_excellent():
    metrics = {
        "blur_score": 150.0,
        "face_width": 400,
        "face_height": 500,
        "background_uniformity": 95.0,
        "head_ratio": 0.75,
    }
    result = calculate_composite_score(metrics)
    assert result["overall_score"] >= 85.0
    assert result["status"] in ["EXCELLENT", "PASS"]
    assert result["grade"] in ["A+", "A"]

def test_calculate_composite_score_fail():
    metrics = {
        "blur_score": 20.0,
        "face_width": 100,
        "face_height": 120,
        "background_uniformity": 30.0,
        "head_ratio": 0.30,
    }
    result = calculate_composite_score(metrics)
    assert result["overall_score"] < 65.0
    assert result["status"] == "FAIL"
    assert result["grade"] == "F"

def test_preset_compliance_engine_evaluate():
    result = PresetComplianceEngine.evaluate_compliance(
        face_confidence=0.95,
        eye_line_ratio=0.60,
        background_uniformity=0.90
    )
    assert result["compliant"] is True
    assert result["score"] >= 75.0

def test_preset_compliance_engine_rules():
    rule_res = PresetComplianceEngine.evaluate_preset_rules("35x45", 0.75)
    assert rule_res["compliant"] is True

    rule_fail = PresetComplianceEngine.evaluate_preset_rules("35x45", 0.40)
    assert rule_fail["compliant"] is False
