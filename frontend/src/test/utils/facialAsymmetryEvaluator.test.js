import { describe, it, expect } from 'vitest';
import { calculateFacialAsymmetry } from '../../utils/facialAsymmetryEvaluator';

describe('facialAsymmetryEvaluator', () => {
  const createSymmetricLandmarks = (eyeDiffY = 0) => {
    const points = new Array(68).fill(null).map(() => ({ x: 100, y: 100 }));
    // Left eye (36, 39)
    points[36] = { x: 40, y: 50 };
    points[39] = { x: 60, y: 50 };
    // Right eye (42, 45)
    points[42] = { x: 140, y: 50 + eyeDiffY };
    points[45] = { x: 160, y: 50 + eyeDiffY };
    // Nose (30)
    points[30] = { x: 100, y: 90 };
    // Mouth (48, 54)
    points[48] = { x: 70, y: 130 };
    points[54] = { x: 130, y: 130 };
    return points;
  };

  it('calculates 100% symmetry for perfectly aligned landmarks', () => {
    const landmarks = createSymmetricLandmarks(0);
    const result = calculateFacialAsymmetry(landmarks);
    expect(result.symmetryScore).toBe(100);
    expect(result.eyeLevelDiffPx).toBe(0);
    expect(result.isCompliant).toBe(true);
  });

  it('detects eye level tilt asymmetry', () => {
    const landmarks = createSymmetricLandmarks(6);
    const result = calculateFacialAsymmetry(landmarks);
    expect(result.eyeLevelDiffPx).toBe(6);
    expect(result.isCompliant).toBe(false);
  });
});
