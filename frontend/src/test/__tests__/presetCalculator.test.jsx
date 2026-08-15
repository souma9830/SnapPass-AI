import { describe, it, expect } from 'vitest';
import { calculatePixels, getAspectratio, calculatePrintCapacity } from '../../utils/presetCalculator';

describe('presetCalculator', () => {
  it('calculates pixel dimensions accurately for 300 DPI', () => {
    const { widthPx, heightPx } = calculatePixels(25.4, 50.8, 300);
    expect(widthPx).toBe(300);
    expect(heightPx).toBe(600);
  });

  it('calculates aspect ratio correctly', () => {
    expect(getAspectratio(35, 45)).toBeCloseTo(0.7778, 3);
    expect(getAspectratio(0, 45)).toBe(1);
  });

  it('calculates print capacity grid counts for 4x6 paper', () => {
    const capacity = calculatePrintCapacity('4x6', 35, 45, 2, 5);
    expect(capacity.cols).toBeGreaterThanOrEqual(1);
    expect(capacity.rows).toBeGreaterThanOrEqual(1);
    expect(capacity.totalCapacity).toBe(capacity.cols * capacity.rows);
  });
});
