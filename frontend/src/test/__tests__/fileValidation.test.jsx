import { describe, it, expect, vi, beforeEach } from 'vitest';
import { validateImageFile, validateImageMagicBytes } from '../../utils/fileValidation';

describe('validateImageFile', () => {
  it('returns valid for a properly sized JPEG file', () => {
    const file = new File(['mock'], 'photo.jpg', { type: 'image/jpeg' });
    Object.defineProperty(file, 'size', { value: 5 * 1024 * 1024 });
    const result = validateImageFile(file);
    expect(result.valid).toBe(true);
    expect(result.error).toBe('');
  });

  it('returns invalid for very large files', () => {
    const file = new File(['mock'], 'large.jpg', { type: 'image/jpeg' });
    Object.defineProperty(file, 'size', { value: 20 * 1024 * 1024 });
    const result = validateImageFile(file);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('size');
  });

  it('returns invalid for unsupported file types', () => {
    const file = new File(['mock'], 'doc.pdf', { type: 'application/pdf' });
    const result = validateImageFile(file);
    expect(result.valid).toBe(false);
  });

  it('returns invalid for GIF files', () => {
    const file = new File(['mock'], 'image.gif', { type: 'image/gif' });
    const result = validateImageFile(file);
    expect(result.valid).toBe(false);
  });

  it('returns invalid when no file is provided', () => {
    const result = validateImageFile(null);
    expect(result.valid).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it('accepts PNG files with valid size', () => {
    const file = new File(['mock'], 'photo.png', { type: 'image/png' });
    Object.defineProperty(file, 'size', { value: 2 * 1024 * 1024 });
    const result = validateImageFile(file);
    expect(result.valid).toBe(true);
  });

  it('accepts WebP files with valid size', () => {
    const file = new File(['mock'], 'photo.webp', { type: 'image/webp' });
    Object.defineProperty(file, 'size', { value: 1 * 1024 * 1024 });
    const result = validateImageFile(file);
    expect(result.valid).toBe(true);
  });

  it('rejects empty files', () => {
    const file = new File([''], 'empty.jpg', { type: 'image/jpeg' });
    Object.defineProperty(file, 'size', { value: 0 });
    const result = validateImageFile(file);
    expect(result.valid).toBe(false);
  });

  it('returns error with specific MAX_FILE_SIZE when exceeded', () => {
    const file = new File(['mock'], 'big.jpg', { type: 'image/jpeg' });
    Object.defineProperty(file, 'size', { value: 11 * 1024 * 1024 });
    const result = validateImageFile(file);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('10MB');
  });
});

describe('validateImageMagicBytes', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns true for a valid JPEG magic bytes header', async () => {
    const jpegHeader = new Uint8Array([0xFF, 0xD8, 0xFF, 0xE0]);
    const file = new File([jpegHeader], 'photo.jpg', { type: 'image/jpeg' });
    const result = await validateImageMagicBytes(file);
    expect(result).toBe(true);
  });

  it('returns true for a valid PNG magic bytes header', async () => {
    const pngHeader = new Uint8Array([0x89, 0x50, 0x4E, 0x47]);
    const file = new File([pngHeader], 'photo.png', { type: 'image/png' });
    const result = await validateImageMagicBytes(file);
    expect(result).toBe(true);
  });

  it('returns false for a text file pretending to be an image', async () => {
    const textContent = new Uint8Array([0x48, 0x65, 0x6C, 0x6C]);
    const file = new File([textContent], 'fake.jpg', { type: 'image/jpeg' });
    const result = await validateImageMagicBytes(file);
    expect(result).toBe(false);
  });

  it('handles FileReader errors gracefully', async () => {
    const tinyFile = new File([], 'empty.jpg', { type: 'image/jpeg' });
    const result = await validateImageMagicBytes(tinyFile);
    expect(result).toBe(false);
  });
});
