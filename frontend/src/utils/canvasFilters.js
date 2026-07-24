/**
 * Canvas Image Filters
 * Applies brightness, contrast, saturation, sharpness, and warmth CSS-like filters directly to a Canvas Context.
 */

export function applyFiltersToCanvas(canvas, filters = {}) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const {
    brightness = 100,
    contrast = 100,
    saturation = 100,
    hueRotate = 0,
    sepia = 0,
    blur = 0,
  } = filters;

  ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) hue-rotate(${hueRotate}deg) sepia(${sepia}%) blur(${blur}px)`;
}

export function drawImageWithFilters(canvas, imgElement, filters = {}) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  applyFiltersToCanvas(canvas, filters);
  ctx.drawImage(imgElement, 0, 0, canvas.width, canvas.height);
  ctx.restore();
}

export function resetCanvasFilters(canvas) {
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.filter = 'none';
  }
}

