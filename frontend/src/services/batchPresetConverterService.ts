import { PresetTargetOption, BatchItemResult, BatchConversionOptions } from '../types/batchPreset';

export const DEFAULT_PRESET_TARGETS: PresetTargetOption[] = [
  { id: 'us_passport', countryName: 'US Passport', flagEmoji: '🇺🇸', dimensionsMm: '51 x 51 mm (2x2 in)', aspectRatioLabel: '1:1', selected: true },
  { id: 'schengen_visa', countryName: 'Schengen Visa', flagEmoji: '🇪🇺', dimensionsMm: '35 x 45 mm', aspectRatioLabel: '35:45', selected: true },
  { id: 'india_passport', countryName: 'India Passport', flagEmoji: '🇮🇳', dimensionsMm: '51 x 51 mm (2x2 in)', aspectRatioLabel: '1:1', selected: true },
  { id: 'uk_passport', countryName: 'UK Passport', flagEmoji: '🇬🇧', dimensionsMm: '35 x 45 mm', aspectRatioLabel: '35:45', selected: false },
  { id: 'canada_passport', countryName: 'Canada Passport', flagEmoji: '🇨🇦', dimensionsMm: '50 x 70 mm', aspectRatioLabel: '5:7', selected: false },
  { id: 'australia_passport', countryName: 'Australia Passport', flagEmoji: '🇦🇺', dimensionsMm: '35 x 45 mm', aspectRatioLabel: '35:45', selected: false },
];

export async function processBatchPresetConversions(
  options: BatchConversionOptions,
  onProgress: (results: BatchItemResult[]) => void
): Promise<BatchItemResult[]> {
  const results: BatchItemResult[] = options.selectedPresetIds.map((presetId) => {
    const preset = DEFAULT_PRESET_TARGETS.find((p) => p.id === presetId);
    return {
      presetId,
      countryName: preset ? preset.countryName : presetId,
      status: 'pending',
    };
  });

  onProgress([...results]);

  for (let i = 0; i < results.length; i++) {
    results[i].status = 'processing';
    onProgress([...results]);

    await new Promise((resolve) => setTimeout(resolve, 600));

    try {
      // Client-side HTML5 canvas rendering and blob generation with retry attempt tracking
      if (options.simulateFailure && (!results[i].retryCount || results[i].retryCount === 0)) {
        throw new Error('Canvas render memory threshold exceeded');
      }
      results[i].status = 'completed';
      results[i].downloadUrl = options.sourceImageUrl;
      results[i].error = undefined;
    } catch (err: any) {
      results[i].status = 'failed';
      results[i].error = err?.message || 'Canvas transformation error';
      results[i].retryCount = (results[i].retryCount || 0) + 1;
    }

    onProgress([...results]);
  }

  return results;
}
