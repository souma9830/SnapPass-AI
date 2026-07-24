from app.services.preset_compliance_engine import PresetComplianceEngine

def test_evaluate_compliance_perfect():
    res = PresetComplianceEngine.evaluate_compliance(0.95, 0.60, 0.90)
    assert res["compliant"] is True
    assert res["score"] >= 90.0
    assert len(res["reasons"]) == 0

def test_evaluate_compliance_poor():
    res = PresetComplianceEngine.evaluate_compliance(0.50, 0.30, 0.60)
    assert res["compliant"] is False
    assert len(res["reasons"]) > 0
