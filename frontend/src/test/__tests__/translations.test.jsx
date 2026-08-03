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

  it.each(['en', 'hi', 'es'])('%s locale defines hero title keys without trailing commas', (locale) => {
    const dict = translations[locale];
    expect(dict.heroMainTitle).toBeDefined();
    expect(dict.heroMainTitle.endsWith(',')).toBe(false);
    expect(dict.heroHighlight).toBeDefined();
  });
});
