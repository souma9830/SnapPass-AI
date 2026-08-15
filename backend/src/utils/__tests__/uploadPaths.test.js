import { describe, it, expect } from '@jest/globals';
import { resolveUploadPath } from '../uploadPaths.utils.js';

describe('resolveUploadPath', () => {
  it('returns null for empty string', () => {
    expect(resolveUploadPath('')).toBeNull();
  });

  it('returns null for path traversal attempt', () => {
    expect(resolveUploadPath('../../etc/passwd')).toBeNull();
  });

  it('returns null for absolute path', () => {
    expect(resolveUploadPath('/etc/passwd')).toBeNull();
  });

  it('returns a valid path for a clean filename', () => {
    const result = resolveUploadPath('test.jpg');
    expect(result).toBeTruthy();
    expect(result.endsWith('test.jpg')).toBe(true);
  });

  it('returns null for hidden files', () => {
    expect(resolveUploadPath('.hidden')).toBeNull();
  });
});