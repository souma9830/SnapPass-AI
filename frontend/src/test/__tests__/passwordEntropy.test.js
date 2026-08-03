import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  calculateEntropy,
  getPasswordStrength,
  evaluatePasswordStrength,
  generateSalt,
  appendSalt,
  generateStrongPassword,
} from '../../utils/passwordEntropy';

describe('calculateEntropy', () => {
  it('returns 0 for empty passwords', () => {
    expect(calculateEntropy('')).toBe(0);
    expect(calculateEntropy()).toBe(0);
  });

  it('computes near-zero entropy for a repeated character', () => {
    expect(calculateEntropy('aaaaaa')).toBe(0);
  });

  it('computes 1 bit of entropy per character for two unique symbols', () => {
    expect(calculateEntropy('abababab')).toBe(8);
  });

  it('returns a positive value for a mixed password', () => {
    expect(calculateEntropy('Tr0ub4dor&3')).toBeGreaterThan(20);
  });
});

describe('getPasswordStrength', () => {
  it('scores empty passwords as 0 with no label', () => {
    expect(getPasswordStrength('')).toEqual({ score: 0, entropy: 0, label: '' });
  });

  it('classifies a short repetitive password as weak', () => {
    expect(getPasswordStrength('aaa').score).toBe(1);
  });

  it('classifies a moderate password as medium', () => {
    const result = getPasswordStrength('password123');
    expect(result.score).toBeGreaterThanOrEqual(2);
    expect(result.score).toBeLessThanOrEqual(3);
  });

  it('classifies a long random password as strong or excellent', () => {
    const result = getPasswordStrength('k7$Qw9#Zp2!LmR4&');
    expect(result.score).toBeGreaterThanOrEqual(3);
  });

  it('evaluatePasswordStrength resolves asynchronously', async () => {
    const result = await evaluatePasswordStrength('hunter2hunter2hunter2');
    expect(result.score).toBeGreaterThan(0);
  });
});

describe('generateSalt', () => {
  it('produces a URL-safe base64 string of the requested length', () => {
    const salt = generateSalt(16);
    expect(salt).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(salt.length).toBeGreaterThanOrEqual(20);
  });

  it('produces unique salts on successive calls', () => {
    expect(generateSalt(16)).not.toBe(generateSalt(16));
  });

  it('appendSalt combines password and salt with a separator', () => {
    expect(appendSalt('secret', 'AbC-12')).toBe('secret.AbC-12');
    expect(appendSalt('secret', '')).toBe('secret');
  });
});

describe('generateStrongPassword', () => {
  beforeEach(() => {
    vi.spyOn(crypto, 'getRandomValues').mockImplementation((arr) => {
      for (let i = 0; i < arr.length; i += 1) arr[i] = i;
      return arr;
    });
  });

  it('returns a password of the requested length', () => {
    const pwd = generateStrongPassword(20);
    expect(pwd.length).toBe(20);
  });

  it('returns a different password with real randomness', () => {
    vi.restoreAllMocks();
    expect(generateStrongPassword()).not.toBe(generateStrongPassword());
  });
});
