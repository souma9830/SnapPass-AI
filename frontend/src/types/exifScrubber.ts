export interface ExifTagItem {
  key: string;
  label: string;
  value: string;
  isSensitive: boolean;
  category: 'GPS' | 'Camera' | 'Timestamp' | 'Technical';
}

export interface ExifAnalysisResult {
  hasExifData: boolean;
  sensitiveTagCount: number;
  privacyRiskRating: 'safe' | 'moderate' | 'high_risk';
  tags: ExifTagItem[];
}
