"""
matting_quality_evaluator.py — AI Background Matting Quality Metrics Evaluator
Built for ELUSoC 2026 / GSSOC 2026.
"""
import numpy as np

def evaluate_alpha_matting_quality(alpha_channel: np.ndarray) -> float:
    if alpha_channel is None or alpha_channel.size == 0:
        return 0.0
    
    # Calculate boundary smoothness and edge sharpness
    gradient_magnitude = np.abs(np.gradient(alpha_channel.astype(float)))
    mean_gradient = float(np.mean(gradient_magnitude))
    quality_score = min(100.0, max(0.0, (1.0 - mean_gradient / 255.0) * 100.0))
    return round(quality_score, 2)
