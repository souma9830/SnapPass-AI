"""
test_matting_quality.py — Matting Quality Evaluator Tests
Built for ELUSoC 2026 / GSSOC 2026.
"""
import numpy as np
from app.services.matting_quality_evaluator import evaluate_alpha_matting_quality

def test_alpha_matting_quality():
    mock_alpha = np.ones((100, 100), dtype=np.uint8) * 255
    score = evaluate_alpha_matting_quality(mock_alpha)
    assert score >= 90.0
