import { describe, it, expect } from 'vitest';
import { getPresetById, PAPER_PRESETS } from '../../utils/printLayoutPresets';
import generatePassportPDFSheet from '../../utils/pdfExportGenerator';

describe('pdfExportGenerator and printLayoutPresets utilities', () => {
  it('fetches correct preset by ID', () => {
    const preset = getPresetById('a4_sheet');
    expect(preset.name).toContain('A4 Sheet');
    expect(preset.maxPhotos).toBe(20);
  });

  it('fallback to default preset if ID non-existent', () => {
    const preset = getPresetById('non_existent_preset');
    expect(preset.id).toBe('4x6_standard');
  });

  it('generates a jsPDF document instance', async () => {
    const doc = await generatePassportPDFSheet({
      paperPresetId: '4x6_standard',
      photoWidthMm: 35,
      photoHeightMm: 45,
      showCropGuides: true,
    });

    expect(doc).toBeDefined();
    expect(typeof doc.save).toBe('function');
  });
});
