import { describe, it, expect } from 'vitest';
import { formatFileSize, formatDate } from '../../utils/formatters';

describe('formatFileSize', () => {
  it('returns "0 B" for zero bytes', () => {
    expect(formatFileSize(0)).toBe('0 B');
  });

  it('formats bytes correctly', () => {
    expect(formatFileSize(500)).toBe('500 B');
  });

  it('formats kilobytes correctly', () => {
    expect(formatFileSize(2048)).toBe('2 KB');
  });

  it('formats megabytes correctly', () => {
    expect(formatFileSize(5 * 1024 * 1024)).toBe('5 MB');
  });

  it('rounds to one decimal place for KB', () => {
    const result = formatFileSize(2560);
    expect(result).toMatch(/2\.5 KB|2\.6 KB/);
  });

  it('handles undefined gracefully', () => {
    expect(formatFileSize(undefined)).toBe('0 B');
  });

  it('handles null gracefully', () => {
    expect(formatFileSize(null)).toBe('0 B');
  });

  it('handles string numbers', () => {
    expect(formatFileSize('1024')).toBe('1 KB');
  });

  it('formats gigabytes correctly', () => {
    expect(formatFileSize(2 * 1024 * 1024 * 1024)).toBe('2 GB');
  });
});

describe('formatDate', () => {
  it('returns "Invalid date" for undefined', () => {
    expect(formatDate(undefined)).toBe('Invalid date');
  });

  it('formats a valid ISO date string', () => {
    const result = formatDate('2026-06-15T10:30:00.000Z');
    expect(result).toBeTruthy();
  });

  it('formats a Date object', () => {
    const result = formatDate(new Date('2026-01-01'));
    expect(result).toBeTruthy();
  });

  it('formats a timestamp number', () => {
    const result = formatDate(Date.now());
    expect(result).toBeTruthy();
  });

  it('returns "Invalid date" for an invalid string', () => {
    const result = formatDate('not-a-date');
    expect(result).toBe('Invalid date');
  });
});
