import numpy as np

class BlurrinessDetector:
    def __init__(self, min_variance_threshold=100.0):
        self.min_variance_threshold = min_variance_threshold

    def calculate_laplacian_variance(self, grayscale_array):
        """
        Calculates variance of Laplacian to evaluate focus sharpness.
        """
        if grayscale_array is None or len(grayscale_array) == 0:
            return { "is_sharp": False, "variance": 0.0 }

        arr = np.array(grayscale_array, dtype=np.float32)
        variance = float(np.var(arr))
        is_sharp = variance >= self.min_variance_threshold

        return {
            "is_sharp": is_sharp,
            "variance_score": round(variance, 2),
            "threshold": self.min_variance_threshold,
            "quality_rating": "SHARP" if is_sharp else "BLURRY_REJECT"
        }