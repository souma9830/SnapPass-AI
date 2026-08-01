import { describe, it, expect } from 'vitest';
import { en } from '../../translations/en.js';
import { hi } from '../../translations/hi.js';
import { es } from '../../translations/es.js';
import { translations } from '../../translations/translations.js';

describe('translations structure', () => {
  it('exports en, hi, and es dictionaries', () => {
    expect(en).toBeDefined();
    expect(hi).toBeDefined();
    expect(es).toBeDefined();
    expect(translations.es).toBe(es);
  });

  it('combines en, hi, and es in translations', () => {
    expect(translations.en).toBe(en);
    expect(translations.hi).toBe(hi);
  });

  it('has matching keys across en and hi locales', () => {
    const enKeys = Object.keys(en).sort();
    const hiKeys = Object.keys(hi).sort();
    expect(enKeys).toEqual(hiKeys);
  });

  it('has matching keys across en and es locales', () => {
    const enKeys = Object.keys(en).sort();
    const esKeys = Object.keys(es).sort();
    expect(esKeys).toEqual(enKeys);
  });

  it('has no missing or empty translations in Hindi (hi)', () => {
    const enKeys = Object.keys(en);
    for (const key of enKeys) {
      expect(hi[key]).toBeDefined();
      expect(hi[key]).not.toBe('');
    }
  });

  it('has no missing or empty translations in Spanish (es)', () => {
    const enKeys = Object.keys(en);
    for (const key of enKeys) {
      expect(es[key]).toBeDefined();
      expect(es[key]).not.toBe('');
    }
  });
});
