import { describe, it, expect } from 'vitest';
import { calculatePrintBleedGrid } from '../../utils/customPrintBleedCalculator';

describe('customPrintBleedCalculator', () => {
  it('calculates print grid layout for 4x6 inch paper', () => {
    const grid = calculatePrintBleedGrid({
      paperWidthMm: 152.4,
      paperHeightMm: 101.6,
      photoWidthMm: 50,
      photoHeightMm: 50,
      bleedMarginMm: 0,
      spacingMm: 0
    });

    expect(grid.columns).toBe(3);
    expect(grid.rows).toBe(2);
    expect(grid.maxPhotos).toBe(6);
    expect(grid.tiles).toHaveLength(6);
  });
});
