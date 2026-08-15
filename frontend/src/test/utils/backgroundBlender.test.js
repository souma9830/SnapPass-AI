import { describe, it, expect, vi } from 'vitest';
import { blendBackgroundColor } from '../../utils/backgroundBlender';

describe('backgroundBlender', () => {
  it('handles null canvas gracefully', () => {
    expect(() => blendBackgroundColor(null)).not.toThrow();
  });

  it('blends light pixels towards target background color with mock context', () => {
    const mockImageData = {
      data: new Uint8ClampedArray([230, 230, 230, 255])
    };
    const mockCtx = {
      getImageData: vi.fn().mockReturnValue(mockImageData),
      putImageData: vi.fn()
    };
    const mockCanvas = {
      width: 1,
      height: 1,
      getContext: vi.fn().mockReturnValue(mockCtx)
    };

    blendBackgroundColor(mockCanvas, '#ffffff', 3);

    expect(mockCtx.getImageData).toHaveBeenCalledWith(0, 0, 1, 1);
    expect(mockImageData.data[0]).toBeGreaterThan(230);
    expect(mockCtx.putImageData).toHaveBeenCalled();
  });
});
