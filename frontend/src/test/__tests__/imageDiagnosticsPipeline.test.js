import { detectImageFormat, matchSignature } from '../../utils/magicBytes';
import { preloadImageSrc, clearPreloadCache } from '../../utils/imagePreloader';
import { getExifOrientation } from '../../utils/exifRotation';

describe('Image Diagnostics & Utility Pipeline', () => {
  describe('magicBytes', () => {
    test('detects JPEG signature', () => {
      const jpegHeader = new Uint8Array([0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10]);
      expect(detectImageFormat(jpegHeader)).toBe('jpeg');
    });

    test('detects PNG signature', () => {
      const pngHeader = new Uint8Array([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A]);
      expect(detectImageFormat(pngHeader)).toBe('png');
    });

    test('returns null for unknown byte signature', () => {
      const unknownHeader = new Uint8Array([0x00, 0x00, 0x00, 0x00]);
      expect(detectImageFormat(unknownHeader)).toBeNull();
    });
  });

  describe('exifRotation', () => {
    test('returns orientation 1 for non-JPEG buffer', () => {
      const dummyBuffer = new Uint8Array([0x00, 0x00, 0x00]).buffer;
      expect(getExifOrientation(dummyBuffer)).toBe(1);
    });
  });

  describe('imagePreloader', () => {
    beforeEach(() => {
      clearPreloadCache();
    });

    test('resolves null when empty src passed', async () => {
      const result = await preloadImageSrc('');
      expect(result).toBeNull();
    });
  });
});
