import numpy as np
import pytest
from app.services.alpha_matting_refiner import AlphaMattingRefiner

def test_alpha_matting_refine_mask():
    refiner = AlphaMattingRefiner()
    mask = np.full((100, 100), 255, dtype=np.uint8)
    refined = refiner.refine_alpha_mask(mask)
    assert refined.shape == (100, 100)

def test_suppress_color_spill():
    refiner = AlphaMattingRefiner()
    fg = np.full((50, 50, 3), 100, dtype=np.uint8)
    mask = np.full((50, 50), 255, dtype=np.uint8)
    blended = refiner.suppress_color_spill(fg, mask)
    assert blended.shape == (50, 50, 3)
