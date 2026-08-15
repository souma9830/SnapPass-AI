import { describe, it, expect, vi } from 'vitest';
import { analyzeEyeGlare } from '../../utils/eyeGlareInspector';

describe('eyeGlareInspector', () => {
  it('returns clean result when eye region input is missing', () => {
    const result = analyzeEyeGlare(null, null);
    expect(result.glareDetected).toBe(false);
    expect(result.maxSpecularRatio).toBe(0);
  });

  it('detects glare when specular highlights exceed threshold', () => {
    const mockData = new Uint8ClampedArray(100 * 4);
    // Fill 20% of pixels with pure white (glare)
    for (let i = 0; i < 20 * 4; i += 4) {
      mockData[i] = 250;
      mockData[i + 1] = 250;
      mockData[i + 2] = 250;
      mockData[i + 3] = 255;
    }

    const mockCtx = {
      getImageData: vi.fn().mockReturnValue({ data: mockData })
    };
    const mockCanvas = { getContext: vi.fn().mockReturnValue(mockCtx) };

    const eyeRegions = {
      leftEye: { x: 0, y: 0, w: 10, h: 10 },
      rightEye: { x: 0, y: 0, w: 10, h: 10 }
    };

    const result = analyzeEyeGlare(mockCanvas, eyeRegions);

    expect(result.glareDetected).toBe(true);
    expect(result.maxSpecularRatio).toBe(0.2);
    expect(result.warnings[0]).toContain('Harsh flash glare detected');
  });
});
