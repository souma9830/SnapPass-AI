import { describe, it, expect } from 'vitest';
import { readFileBytes, matchSignature, detectImageFormat } from '../magicBytes';

describe('matchSignature', () => {
  it('matches JPEG signature at offset 0', () => {
    const bytes = new Uint8Array([0xFF, 0xD8, 0xFF, 0xE0, 0x00]);
    expect(matchSignature(bytes, [0xFF, 0xD8, 0xFF])).toBe(true);
  });

  it('rejects mismatched signature', () => {
    const bytes = new Uint8Array([0x00, 0x00, 0x00]);
    expect(matchSignature(bytes, [0xFF, 0xD8, 0xFF])).toBe(false);
  });

  it('matches signature at custom offset', () => {
    const bytes = new Uint8Array([0x00, 0x00, 0x52, 0x49, 0x46, 0x46]);
    expect(matchSignature(bytes, [0x52, 0x49, 0x46, 0x46], 2)).toBe(true);
  });

  it('returns false when buffer is too short', () => {
    const bytes = new Uint8Array([0xFF, 0xD8]);
    expect(matchSignature(bytes, [0xFF, 0xD8, 0xFF])).toBe(false);
  });
});

describe('detectImageFormat', () => {
  it('detects JPEG from magic bytes', () => {
    expect(detectImageFormat(new Uint8Array([0xFF, 0xD8, 0xFF, 0xE0]))).toBe('jpeg');
  });

  it('detects PNG from magic bytes', () => {
    expect(detectImageFormat(new Uint8Array([0x89, 0x50, 0x4E, 0x47]))).toBe('png');
  });

  it('detects WebP from magic bytes', () => {
    const webp = new Uint8Array([
      0x52, 0x49, 0x46, 0x46, 0x00, 0x00, 0x00, 0x00,
      0x57, 0x45, 0x42, 0x50,
    ]);
    expect(detectImageFormat(webp)).toBe('webp');
  });

  it('returns null for unknown format', () => {
    expect(detectImageFormat(new Uint8Array([0x00, 0x00, 0x00, 0x00]))).toBeNull();
  });

  it('returns null for empty buffer', () => {
    expect(detectImageFormat(new Uint8Array([]))).toBeNull();
  });
});

describe('readFileBytes', () => {
  it('reads the first N bytes of a file', async () => {
    const file = new File(['Hello World'], 'test.txt', { type: 'text/plain' });
    const bytes = await readFileBytes(file, 5);
    expect(bytes).toBeInstanceOf(Uint8Array);
    expect(bytes.length).toBe(5);
    expect(bytes[0]).toBe(0x48); // 'H'
  });

  it('rejects empty file', async () => {
    const file = new File([], 'empty.txt', { type: 'text/plain' });
    await expect(readFileBytes(file)).rejects.toThrow('Empty file');
  });
});
