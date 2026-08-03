import { describe, it, expect } from 'vitest';
import { en } from '../../translations/en.js';
import { hi } from '../../translations/hi.js';
import { es } from '../../translations/es.js';
import { ml } from '../../translations/ml.js';
import { translations } from '../../translations/translations.js';

describe('translations structure', () => {
  it('exports en, hi, es, and ml dictionaries', () => {
    expect(en).toBeDefined();
    expect(hi).toBeDefined();
    expect(es).toBeDefined();
    expect(ml).toBeDefined();
    expect(translations.es).toBe(es);
    expect(translations.ml).toBe(ml);
  });

  it.each(['hi', 'es', 'ml'])('%s locale contains every key present in the English dictionary', (locale) => {
    for (const key of Object.keys(en)) {
      expect(translations[locale][key]).toBeDefined();
    }
  });
});
