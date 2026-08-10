import { CustomPrintPaperSize, PrintGridLayoutConfig, CustomPrintTemplatePreset } from '../types/printTemplate';

export const STANDARD_PAPER_PRESETS: CustomPrintPaperSize[] = [
  { id: '4x6_in', name: '4 x 6 inches (Standard Photo)', widthMm: 101.6, heightMm: 152.4, unit: 'in' },
  { id: 'a4_sheet', name: 'A4 Paper Sheet', widthMm: 210, heightMm: 297, unit: 'mm' },
  { id: '5x7_in', name: '5 x 7 inches', widthMm: 127, heightMm: 177.8, unit: 'in' },
  { id: 'us_letter', name: 'US Letter (8.5 x 11 in)', widthMm: 215.9, heightMm: 279.4, unit: 'in' },
];

export function calculateMaxFitTiles(
  paper: CustomPrintPaperSize,
  photoWidthMm: number,
  photoHeightMm: number,
  gapMm = 3
): { columns: number; rows: number; totalTiles: number } {
  const availWidth = paper.widthMm - 10; // 5mm default margin on each side
  const availHeight = paper.heightMm - 10;

  const columns = Math.floor((availWidth + gapMm) / (photoWidthMm + gapMm));
  const rows = Math.floor((availHeight + gapMm) / (photoHeightMm + gapMm));

  return {
    columns: Math.max(1, columns),
    rows: Math.max(1, rows),
    totalTiles: Math.max(1, columns * rows),
  };
}

export function loadCustomPrintTemplates(): CustomPrintTemplatePreset[] {
  try {
    return JSON.parse(localStorage.getItem('custom_print_templates') || '[]');
  } catch (e) {
    console.error('Failed to load print templates from localStorage', e);
    return [];
  }
}

export function saveCustomPrintTemplate(preset: CustomPrintTemplatePreset): void {
  try {
    const existing = loadCustomPrintTemplates();
    const updated = existing.filter((p) => p.id !== preset.id);
    localStorage.setItem('custom_print_templates', JSON.stringify([...updated, preset]));
  } catch (e) {
    console.error('Failed to save print template to localStorage', e);
  }
}

export function deleteCustomPrintTemplate(presetId: string): void {
  try {
    const existing = loadCustomPrintTemplates();
    const updated = existing.filter((p) => p.id !== presetId);
    localStorage.setItem('custom_print_templates', JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to delete print template from localStorage', e);
  }
}
