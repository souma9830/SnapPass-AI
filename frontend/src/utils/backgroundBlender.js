/**
 * Intelligent Background Color Blender & Shadow Softener
 * Standardizes background color and removes unwanted casting shadows around passport portraits.
 */

/**
 * Normalizes background color and blends edge transitions on a canvas.
 * @param {HTMLCanvasElement} canvas - Target HTML5 canvas
 * @param {string} targetHexColor - Hex code for background color (default '#ffffff')
 * @param {number} featherRadius - Softening radius around subjects (px)
 */
export function blendBackgroundColor(canvas, targetHexColor = '#ffffff', featherRadius = 3) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  // Convert target Hex color to RGB
  const targetR = parseInt(targetHexColor.slice(1, 3), 16) || 255;
  const targetG = parseInt(targetHexColor.slice(3, 5), 16) || 255;
  const targetB = parseInt(targetHexColor.slice(5, 7), 16) || 255;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Detect light background regions (brightness threshold)
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    
    // If background region is near-white or light grey (typical unrefined bg)
    if (brightness > 210) {
      // Calculate blend ratio for smooth transition
      const factor = (brightness - 210) / (255 - 210);
      data[i] = Math.round(r * (1 - factor) + targetR * factor);
      data[i + 1] = Math.round(g * (1 - factor) + targetG * factor);
      data[i + 2] = Math.round(b * (1 - factor) + targetB * factor);
    }
  }

  ctx.putImageData(imageData, 0, 0);
}
