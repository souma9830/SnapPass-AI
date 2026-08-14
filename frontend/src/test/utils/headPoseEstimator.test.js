import { describe, it, expect } from 'vitest';
import { calculateHeadPose } from '../../utils/headPoseEstimator';

describe('headPoseEstimator', () => {
  const createDummyLandmarks = (yawOffset = 0, pitchOffset = 0, rollOffset = 0) => {
    const points = new Array(68).fill(null).map(() => ({ x: 100, y: 100 }));
    // Left eye outer: index 36
    points[36] = { x: 50, y: 50 + rollOffset };
    // Right eye outer: index 45
    points[45] = { x: 150, y: 50 };
    // Nose tip: index 30 (ideal distance to left eye 50, right eye 50)
    points[30] = { x: 100 + yawOffset, y: 50 + pitchOffset };
    // Chin: index 8
    points[8] = { x: 100, y: 150 };
    return points;
  };

  it('returns non-compliant when landmarks are insufficient', () => {
    const result = calculateHeadPose([]);
    expect(result.isCompliant).toBe(false);
    expect(result.warnings[0]).toContain('Insufficient landmark');
  });

  it('calculates near-zero pose for ideal frontal face', () => {
    const landmarks = createDummyLandmarks(0, 0, 0);
    const result = calculateHeadPose(landmarks);
    expect(Math.abs(result.yaw)).toBeLessThanOrEqual(5);
  });

  it('detects head yaw rotation warning', () => {
    const landmarks = createDummyLandmarks(25, 0, 0);
    const result = calculateHeadPose(landmarks);
    expect(Math.abs(result.yaw)).toBeGreaterThan(5);
    expect(result.isCompliant).toBe(false);
  });
});
