/**
 * winstonLogger.test.js — Winston Logger Tests
 * Built for ELUSoC 2026 / GSSOC 2026.
 */
import { formatLogEntry } from '../utils/logFormatter.js';

describe('LogFormatter Tests', () => {
  it('should format log entries with timestamp and level', () => {
    const entry = formatLogEntry('info', 'Test log message');
    expect(entry.level).toBe('info');
    expect(entry.message).toBe('Test log message');
    expect(entry).toHaveProperty('timestamp');
  });
});
