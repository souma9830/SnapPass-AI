from app.services.preset_compliance_engine import PresetComplianceEngine
import pytest

def test_evaluate_compliance_perfect():
    res = PresetComplianceEngine.evaluate_compliance(0.95, 0.60, 0.90)
    assert res["compliant"] is True
    assert res["score"] >= 90.0
    assert len(res["reasons"]) == 0

def test_evaluate_compliance_poor():
    res = PresetComplianceEngine.evaluate_compliance(0.50, 0.30, 0.60)
    assert res["compliant"] is False
    assert len(res["reasons"]) > 0

@pytest.mark.parametrize(
    "confidence, eye_line, bg_uniformity, expected_compliant, min_score, max_score, expected_reason_count",
    [
        (0.85, 0.55, 0.90, True, 90.0, 100.0, 0),
        (0.75, 0.60, 0.88, True, 75.0, 89.9, 1),
        (0.70, 0.75, 0.70, False, 0.0, 74.9, 3),
        (0.95, 0.40, 0.90, False, 75.0, 85.0, 1),
    ],
)
def test_evaluate_compliance_parameterized_boundaries(
    confidence, eye_line, bg_uniformity, expected_compliant, min_score, max_score, expected_reason_count
):
    res = PresetComplianceEngine.evaluate_compliance(confidence, eye_line, bg_uniformity)
    assert res["compliant"] is expected_compliant
    assert min_score <= res["score"] <= max_score
    assert len(res["reasons"]) == expected_reason_count

@pytest.mark.parametrize(
    "preset_id, face_ratio, expected_compliant, min_r, max_r",
    [
        ("35x45", 0.75, True, 0.70, 0.80),
        ("35x45", 0.65, False, 0.70, 0.80),
        ("51x51", 0.60, True, 0.50, 0.69),
        ("51x51", 0.72, False, 0.50, 0.69),
    ],
)
def test_evaluate_preset_rules(preset_id, face_ratio, expected_compliant, min_r, max_r):
    res = PresetComplianceEngine.evaluate_preset_rules(preset_id, face_ratio)
    assert res["compliant"] is expected_compliant
    assert res["preset_id"] == preset_id
    assert res["face_ratio"] == face_ratio
    assert res["required_min"] == min_r
    assert res["required_max"] == max_r
