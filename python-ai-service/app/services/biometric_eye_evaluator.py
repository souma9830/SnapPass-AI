import numpy as np

class BiometricEyeDistanceEvaluator:
    def __init__(self, min_ratio=0.20, max_ratio=0.45):
        self.min_ratio = min_ratio
        self.max_ratio = max_ratio

    def evaluate_interocular_distance(self, facial_landmarks, image_dimensions):
        """
        Calculates interocular pixel distance and ratio against canvas width.
        Ensures compliance with ICAO Document 9303 biometric specifications.
        """
        if not facial_landmarks or len(facial_landmarks) < 2:
            return {
                "is_compliant": False,
                "status_code": "INSUFFICIENT_LANDMARKS",
                "error_message": "Could not detect both eye center points from facial mesh.",
                "metrics": None
            }
        
        img_width, img_height = image_dimensions
        if img_width <= 0 or img_height <= 0:
            return {
                "is_compliant": False,
                "status_code": "INVALID_DIMENSIONS",
                "error_message": "Image dimensions must be positive integers.",
                "metrics": None
            }

        left_eye = np.array(facial_landmarks[0], dtype=np.float64)
        right_eye = np.array(facial_landmarks[1], dtype=np.float64)

        # Euclidean distance calculation
        pixel_distance = float(np.linalg.norm(left_eye - right_eye))
        ratio = pixel_distance / float(img_width)

        is_compliant = self.min_ratio <= ratio <= self.max_ratio

        reason = "Compliant interocular ratio."
        if ratio < self.min_ratio:
            reason = f"Eyes are too close relative to frame width (Ratio: {ratio:.3f} < Min: {self.min_ratio})."
        elif ratio > self.max_ratio:
            reason = f"Eyes are too far apart relative to frame width (Ratio: {ratio:.3f} > Max: {self.max_ratio})."

        return {
            "is_compliant": is_compliant,
            "status_code": "PASSED" if is_compliant else "OUT_OF_BOUNDS",
            "reason": reason,
            "metrics": {
                "interocular_pixel_distance": round(pixel_distance, 2),
                "frame_width_ratio": round(ratio, 4),
                "min_allowed_ratio": self.min_ratio,
                "max_allowed_ratio": self.max_ratio,
                "eye_center_left": {"x": float(left_eye[0]), "y": float(left_eye[1])},
                "eye_center_right": {"x": float(right_eye[0]), "y": float(right_eye[1])}
            }
        }