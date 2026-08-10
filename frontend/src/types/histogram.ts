export interface HistogramChannelBins {
  red: number[];
  green: number[];
  blue: number[];
  luminance: number[];
}

export interface ExposureAnalysisStats {
  underExposedPercentage: number;
  overExposedPercentage: number;
  isExposureCompliant: boolean;
  meanLuminance: number;
}
