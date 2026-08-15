import { describe, it, expect } from 'vitest';
import { en } from '../en.js';
import { hi } from '../hi.js';
import { es } from '../es.js';
import { translations } from '../translations.js';

describe('translations structure', () => {
  it('exports en, hi, and es dictionaries', () => {
    expect(en).toBeDefined();
    expect(hi).toBeDefined();
    expect(es).toBeDefined();
    expect(translations.es).toBe(es);
  });

  it('exports hi with all expected keys', () => {
    expect(hi).toBeDefined();
    expect(typeof hi.home).toBe('string');
    expect(hi.uploadPhoto).toBe('अपनी फोटो अपलोड करें');
  });

  it('combines en and hi in translations', () => {
    expect(translations.en).toBe(en);
    expect(translations.hi).toBe(hi);
  });

  it('has matching keys across locales', () => {
    const enKeys = Object.keys(en).sort();
    const hiKeys = Object.keys(hi).sort();
    expect(enKeys).toEqual(hiKeys);
  });

  it('has no missing translations', () => {
    const enKeys = Object.keys(en);
    for (const key of enKeys) {
      expect(hi[key]).toBeDefined();
      expect(hi[key]).not.toBe('');
    }
  });
});
