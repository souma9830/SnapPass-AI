"""
image_contrast_enhancer.py — CLAHE Image Contrast Equalization Service
Built for ELUSoC 2026 / GSSOC 2026.
"""
import cv2
import numpy as np

def apply_clahe_contrast(image_bgr: np.ndarray, clip_limit=2.0, grid_size=(8, 8)) -> np.ndarray:
    if image_bgr is None:
        return None
    lab = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2LAB)
    l, a, b = cv2.split(lab)
    clahe = cv2.createCLAHE(clipLimit=clip_limit, tileGridSize=grid_size)
    cl = clahe.apply(l)
    limg = cv2.merge((cl, a, b))
    return cv2.cvtColor(limg, cv2.COLOR_LAB2BGR)
