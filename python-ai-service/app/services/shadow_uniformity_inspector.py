import numpy as np

class ShadowUniformityInspector:
    def __init__(self, variance_threshold=18.5):
        self.variance_threshold = variance_threshold

    def inspect_shadows(self, background_region_array):
        """
        Analyzes standard deviation across background bounding regions to detect harsh shadows.
        """
        if background_region_array is None or len(background_region_array) == 0:
            return {
                "has_harsh_shadows": False,
                "uniformity_score": 100.0,
                "std_deviation": 0.0
            }

        bg_arr = np.array(background_region_array, dtype=np.float32)
        std_dev = float(np.std(bg_arr))
        has_shadows = std_dev > self.variance_threshold
        uniformity_score = max(0.0, 100.0 - (std_dev * 2.5))

        return {
            "has_harsh_shadows": has_shadows,
            "uniformity_score": round(uniformity_score, 2),
            "std_deviation": round(std_dev, 2),
            "threshold": self.variance_threshold,
            "status": "PASS" if not has_shadows else "HARSH_SHADOWS_DETECTED"
        }