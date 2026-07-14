/**
 * Canvas Image Filters
 * Applies brightness, contrast, and saturation CSS-like filters directly to a Canvas Context.
 */

export function applyFiltersToCanvas(canvas, filters) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const { brightness, contrast, saturation } = filters;
  
  // Build standard canvas CSS-like filter string
  // brightness: 0 to 200 (100 is default)
  // contrast: 0 to 200 (100 is default)
  // saturation: 0 to 200 (100 is default)
  ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
}

export function drawImageWithFilters(canvas, imgElement, filters) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  applyFiltersToCanvas(canvas, filters);
  ctx.drawImage(imgElement, 0, 0, canvas.width, canvas.height);
  ctx.restore();
}
