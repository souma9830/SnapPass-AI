import { describe, it, expect } from 'vitest';
import {
  validateFileType,
  validateFileSize,
  validateCompressionRatio,
} from '../fileValidation';

describe('validateFileType', () => {
  it('rejects non-image types', () => {
    const result = validateFileType({ type: 'application/pdf' });
    expect(result).toContain('Unsupported file type');
  });

  it('accepts JPEG', () => {
    const result = validateFileType({ type: 'image/jpeg' });
    expect(result).toBe('');
  });

  it('rejects empty file', () => {
    const result = validateFileType(null);
    expect(result).toBe('No file provided');
  });
});

describe('validateFileSize', () => {
  it('rejects files over 10MB', () => {
    const result = validateFileSize({ size: 11 * 1024 * 1024 });
    expect(result).toContain('11.0MB');
  });

  it('accepts files under 10MB', () => {
    const result = validateFileSize({ size: 1024 });
    expect(result).toBe('');
  });
});

describe('validateCompressionRatio', () => {
  it('returns valid for ratio above 0.05', () => {
    const result = validateCompressionRatio(1000, 500);
    expect(result.valid).toBe(true);
  });

  it('returns invalid for ratio below 0.05', () => {
    const result = validateCompressionRatio(1000, 10);
    expect(result.valid).toBe(false);
  });
});