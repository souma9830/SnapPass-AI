/**
 * printLayoutPresets.js
 * Standard paper sizes and layout preset configurations for passport photo print sheets.
 */

export const PAPER_PRESETS = [
  {
    id: '4x6_standard',
    name: '4 × 6 inch (10 × 15 cm)',
    widthMm: 101.6,
    heightMm: 152.4,
    defaultColumns: 2,
    defaultRows: 3,
    maxPhotos: 6,
  },
  {
    id: '5x7_standard',
    name: '5 × 7 inch (13 × 18 cm)',
    widthMm: 127.0,
    heightMm: 177.8,
    defaultColumns: 2,
    defaultRows: 4,
    maxPhotos: 8,
  },
  {
    id: 'a4_sheet',
    name: 'A4 Sheet (210 × 297 mm)',
    widthMm: 210.0,
    heightMm: 297.0,
    defaultColumns: 4,
    defaultRows: 5,
    maxPhotos: 20,
  },
  {
    id: 'us_letter',
    name: 'US Letter (8.5 × 11 in)',
    widthMm: 215.9,
    heightMm: 279.4,
    defaultColumns: 4,
    defaultRows: 5,
    maxPhotos: 20,
  },
];

export function getPresetById(presetId) {
  return PAPER_PRESETS.find((p) => p.id === presetId) || PAPER_PRESETS[0];
}

export default {
  PAPER_PRESETS,
  getPresetById,
};
