import { validateAndSanitizePreset, searchBuiltinPresets } from '../presetManager.js';

describe('PresetManager Utility', () => {
  test('validates preset parameters correctly', () => {
    const valid = validateAndSanitizePreset({ name: 'custom-pass', widthMm: 40, heightMm: 50 });
    expect(valid.valid).toBe(true);
    expect(valid.data.name).toBe('custom-pass');
  });

  test('rejects missing or out of range dimensions', () => {
    const invalid = validateAndSanitizePreset({ name: 'bad', widthMm: -10, heightMm: 600 });
    expect(invalid.valid).toBe(false);
    expect(invalid.errors.length).toBeGreaterThan(0);
  });

  test('searches builtin presets by query string', () => {
    const results = searchBuiltinPresets('India');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].id).toBe('35x45');
  });
});
