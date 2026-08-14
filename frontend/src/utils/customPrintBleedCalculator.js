/**
 * Custom Print Bleed & Margin Grid Calculator
 * Calculates precise photo grid positions, crop marks, and bleed zones on standard paper sizes (A4, 4x6, Letter).
 */

/**
 * Calculates optimal grid rows, columns, and tile coordinates with bleed margins.
 * @param {Object} options - Paper dimensions and photo specs
 * @returns {{columns: number, rows: number, maxPhotos: number, tiles: Array<{x: number, y: number, w: number, h: number}>}}
 */
export function calculatePrintBleedGrid(options) {
  const {
    paperWidthMm = 152.4, // 6 inches
    paperHeightMm = 101.6, // 4 inches
    photoWidthMm = 51.0,   // 2 inches
    photoHeightMm = 51.0,  // 2 inches
    bleedMarginMm = 3.0,   // 3mm bleed margin
    spacingMm = 2.0        // 2mm gap between photos
  } = options || {};

  const effectivePhotoW = photoWidthMm + bleedMarginMm * 2;
  const effectivePhotoH = photoHeightMm + bleedMarginMm * 2;

  const columns = Math.floor((paperWidthMm + spacingMm) / (effectivePhotoW + spacingMm));
  const rows = Math.floor((paperHeightMm + spacingMm) / (effectivePhotoH + spacingMm));

  const tiles = [];
  const startX = (paperWidthMm - (columns * effectivePhotoW + (columns - 1) * spacingMm)) / 2;
  const startY = (paperHeightMm - (rows * effectivePhotoH + (rows - 1) * spacingMm)) / 2;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      tiles.push({
        column: c + 1,
        row: r + 1,
        x: Math.round((startX + c * (effectivePhotoW + spacingMm)) * 10) / 10,
        y: Math.round((startY + r * (effectivePhotoH + spacingMm)) * 10) / 10,
        w: photoWidthMm,
        h: photoHeightMm,
        bleed: bleedMarginMm
      });
    }
  }

  return {
    columns,
    rows,
    maxPhotos: columns * rows,
    tiles
  };
}
