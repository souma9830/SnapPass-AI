import { describe, it, expect } from 'vitest';
import { compressImagePipeline } from '../../utils/imageCompressorPipeline';

describe('compressImagePipeline', () => {
  it('returns original file if null or invalid file', async () => {
    const res = await compressImagePipeline(null);
    expect(res.compressedFile).toBeNull();
    expect(res.ratio).toBe(1.0);
  });

  it('bypasses compression if file size is below max limit', async () => {
    const file = new File(['mock content'], 'test.jpg', { type: 'image/jpeg' });
    Object.defineProperty(file, 'size', { value: 500 * 1024 }); // 500KB
    const res = await compressImagePipeline(file, { maxSizeMB: 2.0 });
    expect(res.compressedFile).toBe(file);
    expect(res.ratio).toBe(1.0);
  });
});
