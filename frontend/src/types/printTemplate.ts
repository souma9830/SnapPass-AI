export interface CustomPrintPaperSize {
  id: string;
  name: string;
  widthMm: number;
  heightMm: number;
  unit: 'mm' | 'in';
}

export interface PrintGridLayoutConfig {
  columns: number;
  rows: number;
  marginTopMm: number;
  marginBottomMm: number;
  marginLeftMm: number;
  marginRightMm: number;
  gapMm: number;
  showCutGuides: boolean;
}

export interface CustomPrintTemplatePreset {
  id: string;
  templateName: string;
  paperSize: CustomPrintPaperSize;
  layout: PrintGridLayoutConfig;
  createdAt: string;
}
