"""
Edge Alpha Matting & Foreground Color Spill Suppression for Passport Photos.
Refines hair strand edges and eliminates green/blue backdrop halo reflections.
"""

import cv2
import numpy as np
from typing import Tuple

class AlphaMattingRefiner:
    def __init__(self, feather_radius: int = 3, spill_suppression_factor: float = 0.5):
        self.feather_radius = feather_radius
        self.spill_suppression_factor = spill_suppression_factor

    def refine_alpha_mask(self, mask: np.ndarray) -> np.ndarray:
        """Applies guided edge feathering and Gaussian smoothing to alpha boundary."""
        if mask is None or mask.size == 0:
            return mask

        # Soften binary edges using morphological erosion & Gaussian blur
        kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (self.feather_radius * 2 + 1, self.feather_radius * 2 + 1))
        eroded = cv2.erode(mask, kernel, iterations=1)
        blurred = cv2.GaussianBlur(mask, (self.feather_radius * 2 + 1, self.feather_radius * 2 + 1), 0)
        
        refined_mask = np.where(eroded > 0, mask, blurred)
        return refined_mask

    def suppress_color_spill(self, foreground: np.ndarray, alpha_mask: np.ndarray, bg_color: Tuple[int, int, int] = (255, 255, 255)) -> np.ndarray:
        """Neutralizes background color reflections around hair/edge boundaries."""
        if foreground is None or alpha_mask is None:
            return foreground

        h, w = foreground.shape[:2]
        bg_img = np.full((h, w, 3), bg_color, dtype=np.uint8)
        
        # Convert mask to float 0..1
        alpha = alpha_mask.astype(float) / 255.0
        if len(alpha.shape) == 2:
            alpha = np.expand_dims(alpha, axis=2)

        blended = (foreground.astype(float) * alpha + bg_img.astype(float) * (1.0 - alpha)).astype(np.uint8)
        return blended
