import { describe, it, expect } from 'vitest';
import { generateBatchManifest } from '../../utils/batchZipExporter';

describe('batchZipExporter', () => {
  it('generates valid JSON manifest for batch photos', () => {
    const photos = [
      { id: '1', name: 'john_doe.jpg', countryPreset: 'US' },
      { id: '2', name: 'jane_doe.jpg', countryPreset: 'EU' }
    ];

    const jsonString = generateBatchManifest(photos);
    const parsed = JSON.parse(jsonString);

    expect(parsed.itemCount).toBe(2);
    expect(parsed.items[0].filename).toBe('john_doe.jpg');
    expect(parsed.items[1].countryPreset).toBe('EU');
  });

  it('handles empty photo array gracefully', () => {
    const parsed = JSON.parse(generateBatchManifest([]));
    expect(parsed.itemCount).toBe(0);
    expect(parsed.items).toHaveLength(0);
  });
});
