import numpy as np
import pytest
from app.services.facial_asymmetry_analyzer import FacialAsymmetryAnalyzer

def test_facial_asymmetry_analyzer_perfect_symmetry():
    analyzer = FacialAsymmetryAnalyzer()
    # Synthetic perfectly symmetric image
    synthetic = np.full((200, 200, 3), 128, dtype=np.uint8)
    res = analyzer.analyze_facial_symmetry(synthetic)
    assert res["passed"] is True
    assert res["asymmetry_score"] == 0.0

def test_facial_asymmetry_analyzer_invalid_img():
    analyzer = FacialAsymmetryAnalyzer()
    res = analyzer.analyze_facial_symmetry(None)
    assert res["passed"] is False
    assert "Invalid image" in res["recommendation"]
