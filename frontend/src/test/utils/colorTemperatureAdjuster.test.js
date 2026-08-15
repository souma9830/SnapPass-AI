import { describe, it, expect, vi } from 'vitest';
import { applyColorTemperatureAndTint } from '../../utils/colorTemperatureAdjuster';

describe('colorTemperatureAdjuster', () => {
  it('handles null canvas gracefully', () => {
    expect(() => applyColorTemperatureAndTint(null)).not.toThrow();
  });

  it('modifies pixel RGB values based on temperature and tint offset', () => {
    const mockData = new Uint8ClampedArray([100, 100, 100, 255]);
    const mockCtx = {
      getImageData: vi.fn().mockReturnValue({ data: mockData }),
      putImageData: vi.fn()
    };
    const mockCanvas = { width: 1, height: 1, getContext: vi.fn().mockReturnValue(mockCtx) };

    applyColorTemperatureAndTint(mockCanvas, 20, 10);

    expect(mockData[0]).toBeGreaterThan(100); // Red increased (warmth)
    expect(mockData[1]).toBeGreaterThan(100); // Green increased (tint)
    expect(mockData[2]).toBeLessThan(100);    // Blue decreased (warmth)
  });
});
