/**
 * Client-side canvas shadow detection and adaptive luminosity equalization utility
 */

export function detectShadowLuminance(imageData) {
  const data = imageData.data;
  let totalLuminance = 0;
  let pixelCount = 0;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    totalLuminance += lum;
    pixelCount++;
  }

  const avgLuminance = pixelCount > 0 ? totalLuminance / pixelCount : 0;
  return {
    avgLuminance: Math.round(avgLuminance),
    hasHarshShadows: avgLuminance < 110
  };
}

export function applyAdaptiveShadowRemoval(imageData, shadowThreshold = 100, boostFactor = 1.25) {
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;

    if (lum < shadowThreshold) {
      data[i] = Math.min(255, Math.round(r * boostFactor));
      data[i + 1] = Math.min(255, Math.round(g * boostFactor));
      data[i + 2] = Math.min(255, Math.round(b * boostFactor));
    }
  }

  return imageData;
}
