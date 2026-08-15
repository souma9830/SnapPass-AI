/**
 * Real-time photo quality gauge calculation utility
 */

export function calculateQualityGaugeMetrics(metrics = {}) {
  const contrast = metrics.contrast || 80;
  const sharpness = metrics.sharpness || 85;
  const lighting = metrics.lighting || 90;
  const resolution = metrics.resolution || 95;

  const overallHealthScore = Math.round(
    contrast * 0.2 + sharpness * 0.3 + lighting * 0.25 + resolution * 0.25
  );

  let statusTier = 'POOR';
  if (overallHealthScore >= 88) statusTier = 'EXCELLENT';
  else if (overallHealthScore >= 75) statusTier = 'GOOD';
  else if (overallHealthScore >= 60) statusTier = 'FAIR';

  return {
    contrast,
    sharpness,
    lighting,
    resolution,
    overallHealthScore,
    statusTier
  };
}
