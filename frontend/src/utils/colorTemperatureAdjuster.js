/**
 * Photo Color Temperature & Tint Adjuster
 * Adjusts Kelvin color temperature (warmth/coolness) and tint (green/magenta) for natural skin tones.
 */

/**
 * Adjusts color temperature and tint on a canvas.
 * @param {HTMLCanvasElement} canvas - Source canvas
 * @param {number} temperature - Range -50 (cool) to +50 (warm)
 * @param {number} tint - Range -50 (magenta) to +50 (green)
 */
export function applyColorTemperatureAndTint(canvas, temperature = 0, tint = 0) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;

  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  // Temperature adjustments affect Red and Blue channels inversely
  const tempOffsetR = temperature * 1.2;
  const tempOffsetB = -temperature * 1.2;

  // Tint adjustments affect Green channel relative to Red/Blue
  const tintOffsetG = tint * 1.1;

  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.min(255, Math.max(0, data[i] + tempOffsetR));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + tintOffsetG));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + tempOffsetB));
  }

  ctx.putImageData(imageData, 0, 0);
}
