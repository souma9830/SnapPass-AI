/**
 * Biometric eye glare and lens specular reflection evaluator for passport photos
 */

export function detectEyeSpecularReflection(eyeRegionData) {
  if (!eyeRegionData || !eyeRegionData.data) {
    return { hasGlare: false, specularRatio: 0, confidence: 0 };
  }

  const data = eyeRegionData.data;
  let saturatedCount = 0;
  const totalPixels = data.length / 4;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Detect specular highlight saturation (pure white reflection)
    if (r > 245 && g > 245 && b > 245) {
      saturatedCount++;
    }
  }

  const specularRatio = totalPixels > 0 ? (saturatedCount / totalPixels) * 100 : 0;
  const hasGlare = specularRatio > 4.5;

  return {
    hasGlare,
    specularRatio: parseFloat(specularRatio.toFixed(2)),
    confidence: Math.min(100, Math.round(specularRatio * 15))
  };
}
