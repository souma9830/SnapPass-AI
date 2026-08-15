import { describe, it, expect } from 'vitest';
import { calculateHistogram } from '../../utils/imageEnhancer';

describe('calculateHistogram', () => {
  it('correctly calculates RGB histograms for simple image data', () => {
    const mockImageData = {
      data: new Uint8Array([
        255, 0, 0, 255,   // Red pixel
        0, 255, 0, 255,   // Green pixel
        0, 0, 255, 255,   // Blue pixel
        128, 128, 128, 255 // Gray pixel
      ]),
    };

    const histogram = calculateHistogram(mockImageData);

    expect(histogram.r[255]).toBe(1);
    expect(histogram.g[255]).toBe(1);
    expect(histogram.b[255]).toBe(1);
    expect(histogram.r[128]).toBe(1);
    expect(histogram.r[0]).toBe(2);
  });

  it('handles empty image data without crashing', () => {
    const mockImageData = { data: new Uint8Array([]) };
    const histogram = calculateHistogram(mockImageData);

    expect(histogram.r.length).toBe(256);
    expect(histogram.g.length).toBe(256);
    expect(histogram.b.length).toBe(256);
    expect(histogram.r.every((v) => v === 0)).toBe(true);
  });
});
