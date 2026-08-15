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
});
