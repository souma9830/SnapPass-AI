export type ComparisonMode = 'split' | 'sideBySide' | 'visualDiff';

export interface ComparisonState {
  mode: ComparisonMode;
  splitPositionPercentage: number;
  isDragging: boolean;
  showDiffHighlight: boolean;
  diffSensitivity: number;
}

export interface PixelDiffStats {
  totalPixels: number;
  changedPixels: number;
  changePercentage: number;
  significantDiffDetected: boolean;
}
