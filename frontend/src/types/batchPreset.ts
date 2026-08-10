export interface PresetTargetOption {
  id: string;
  countryName: string;
  flagEmoji: string;
  dimensionsMm: string;
  aspectRatioLabel: string;
  selected: boolean;
}

export interface BatchItemResult {
  presetId: string;
  countryName: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  downloadUrl?: string;
  error?: string;
}

export interface BatchConversionOptions {
  sourceImageUrl: string;
  selectedPresetIds: string[];
  maintainAspectCrop: boolean;
  highQualityExport: boolean;
}
