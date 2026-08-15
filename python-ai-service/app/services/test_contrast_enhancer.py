"""
test_contrast_enhancer.py — Contrast Enhancer Tests
Built for ELUSoC 2026 / GSSOC 2026.
"""
import numpy as np
from app.services.image_contrast_enhancer import apply_clahe_contrast

def test_clahe_enhancer():
    mock_img = np.ones((50, 50, 3), dtype=np.uint8) * 100
    res = apply_clahe_contrast(mock_img)
    assert res is not None
