/**
 * dbConnection.test.js — Database Connection Tests
 * Built for ELUSoC 2026 / GSSOC 2026.
 */
import { formatDbState } from '../utils/dbStateFormatter.js';

describe('DbStateFormatter Tests', () => {
  it('should format state codes', () => {
    expect(formatDbState(1)).toBe('CONNECTED');
    expect(formatDbState(0)).toBe('DISCONNECTED');
  });
});
