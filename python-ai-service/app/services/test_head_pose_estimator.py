import pytest
from app.services.head_pose_estimator import HeadPoseEstimator

def test_head_pose_upright():
    estimator = HeadPoseEstimator(max_allowed_angle=5.0)
    landmarks = [(0, 0, 0) for _ in range(10)]
    res = estimator.estimate_pose(landmarks)
    assert res["compliant"] is True
    assert res["status"] == "UPRIGHT"
    assert res["max_tilt_angle_deg"] <= 5.0

def test_head_pose_insufficient_points():
    estimator = HeadPoseEstimator()
    res = estimator.estimate_pose([])
    assert res["compliant"] is False
    assert "error" in res