/**
 * High-DPI PDF Export & Paper Layout Renderer Engine
 */
export function calculatePrintGridDimensions({ paperSize = 'A4', photoWidthMm = 35, photoHeightMm = 45, spacingMm = 5 }) {
  const paperSpecs = {
    A4: { widthMm: 210, heightMm: 297 },
    '4x6': { widthMm: 101.6, heightMm: 152.4 },
    '5x7': { widthMm: 127, heightMm: 177.8 },
  };

  const page = paperSpecs[paperSize] || paperSpecs.A4;
  const cols = Math.floor((page.widthMm - spacingMm) / (photoWidthMm + spacingMm));
  const rows = Math.floor((page.heightMm - spacingMm) / (photoHeightMm + spacingMm));
  const totalPhotos = Math.max(1, cols * rows);

  return {
    paperSize,
    pageWidthMm: page.widthMm,
    pageHeightMm: page.heightMm,
    cols,
    rows,
    totalPhotos,
  };
}

export function generatePrintCanvasConfig(grid) {
  const dpi = 300;
  const mmToPx = (mm) => Math.round((mm * dpi) / 25.4);

  return {
    canvasWidthPx: mmToPx(grid.pageWidthMm),
    canvasHeightPx: mmToPx(grid.pageHeightMm),
    grid,
  };
}
