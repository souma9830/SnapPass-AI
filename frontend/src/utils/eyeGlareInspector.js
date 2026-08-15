/**
 * Biometric Eye Glare & Specular Reflection Inspector
 * Detects harsh light reflections (flash glare) across eye regions according to ICAO specifications.
 */

/**
 * Analyzes specular highlights and glare percentage inside eye bounding boxes.
 * @param {HTMLCanvasElement} canvas - Photo canvas
 * @param {Object} eyeRegions - { leftEye: {x, y, w, h}, rightEye: {x, y, w, h} }
 * @returns {{glareDetected: boolean, maxSpecularRatio: number, warnings: Array<string>}}
 */
export function analyzeEyeGlare(canvas, eyeRegions) {
  if (!canvas || !eyeRegions || !eyeRegions.leftEye || !eyeRegions.rightEye) {
    return {
      glareDetected: false,
      maxSpecularRatio: 0,
      warnings: []
    };
  }

  const ctx = canvas.getContext('2d');

  function checkRegionGlare(region) {
    if (region.w <= 0 || region.h <= 0) return 0;
    try {
      const imageData = ctx.getImageData(region.x, region.y, region.w, region.h);
      const data = imageData.data;
      let specularCount = 0;
      const totalPixels = data.length / 4;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        // Pure white flash glare threshold (R > 245, G > 245, B > 245)
        if (r > 245 && g > 245 && b > 245) {
          specularCount++;
        }
      }

      return specularCount / totalPixels;
    } catch (e) {
      return 0;
    }
  }

  const leftRatio = checkRegionGlare(eyeRegions.leftEye);
  const rightRatio = checkRegionGlare(eyeRegions.rightEye);
  const maxSpecularRatio = Math.max(leftRatio, rightRatio);

  const glareDetected = maxSpecularRatio > 0.08; // > 8% pure white specular reflection
  const warnings = [];

  if (glareDetected) {
    warnings.push(`Harsh flash glare detected in eye region (${(maxSpecularRatio * 100).toFixed(1)}% area covered)`);
  }

  return {
    glareDetected,
    maxSpecularRatio: Math.round(maxSpecularRatio * 100) / 100,
    warnings
  };
}
