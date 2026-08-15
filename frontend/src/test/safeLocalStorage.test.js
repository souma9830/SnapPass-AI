import { safeLocalStorageSet, safeLocalStorageGet } from '../utils/safeLocalStorage';

describe('SafeLocalStorage Tests', () => {
  it('should fall back to in-memory store seamlessly', () => {
    safeLocalStorageSet('test_key', 'val123');
    expect(safeLocalStorageGet('test_key')).toBe('val123');
  });
});
