import numpy as np

class HeadPoseEstimator:
    def __init__(self, max_allowed_angle=5.0):
        self.max_allowed_angle = max_allowed_angle

    def estimate_pose(self, 3d_landmarks):
        """
        Estimates pitch, yaw, and roll inclination angles using 3D facial mesh points.
        """
        if not 3d_landmarks or len(3d_landmarks) < 6:
            return {
                "compliant": False,
                "error": "Insufficient 3D facial landmarks for pose matrix calculation."
            }

        # Simulated PnP rotation matrix calculation
        pitch = 1.8  # Up/Down tilt
        yaw = -0.9   # Left/Right turn
        roll = 0.4   # Side tilt

        max_tilt = max(abs(pitch), abs(yaw), abs(roll))
        is_compliant = max_tilt <= self.max_allowed_angle

        return {
            "compliant": is_compliant,
            "max_tilt_angle_deg": round(max_tilt, 2),
            "allowed_threshold_deg": self.max_allowed_angle,
            "angles": {
                "pitch": round(pitch, 2),
                "yaw": round(yaw, 2),
                "roll": round(roll, 2)
            },
            "status": "UPRIGHT" if is_compliant else "INCLINED"
        }