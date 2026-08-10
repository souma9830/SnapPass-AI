import { ExifAnalysisResult, ExifTagItem } from '../types/exifScrubber';

export function analyzeMockExifMetadata(filename?: string): ExifAnalysisResult {
  const tags: ExifTagItem[] = [
    { key: 'GPSLatitude', label: 'GPS Latitude', value: '37° 46\' 29.8" N', isSensitive: true, category: 'GPS' },
    { key: 'GPSLongitude', label: 'GPS Longitude', value: '122° 25\' 09.9" W', isSensitive: true, category: 'GPS' },
    { key: 'MakeModel', label: 'Camera Device', value: 'Apple iPhone 14 Pro', isSensitive: true, category: 'Camera' },
    { key: 'DateTimeOriginal', label: 'Original Timestamp', value: '2026-08-01 14:22:05', isSensitive: true, category: 'Timestamp' },
    { key: 'FocalLength', label: 'Focal Length', value: '24mm f/1.78', isSensitive: false, category: 'Technical' },
    { key: 'ColorSpace', label: 'Color Space', value: 'sRGB', isSensitive: false, category: 'Technical' },
  ];

  const sensitiveCount = tags.filter((t) => t.isSensitive).length;

  return {
    hasExifData: true,
    sensitiveTagCount: sensitiveCount,
    privacyRiskRating: sensitiveCount >= 3 ? 'high_risk' : sensitiveCount > 0 ? 'moderate' : 'safe',
    tags,
  };
}

export function getSensitiveTagsOnly(tags: ExifTagItem[]): ExifTagItem[] {
  return tags.filter((t) => t.isSensitive);
}

export async function scrubExifFromCanvas(
  sourceCanvas: HTMLCanvasElement
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    sourceCanvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Failed to export scrubbed image blob'));
    }, 'image/jpeg', 0.95);
  });
}
