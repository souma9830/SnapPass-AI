/**
 * Print bleed margin and cut alignment geometry calculator
 */

export function calculatePrintBleedDimensions(paperWidthMm, paperHeightMm, bleedMm = 3) {
  const totalWidthMm = paperWidthMm + bleedMm * 2;
  const totalHeightMm = paperHeightMm + bleedMm * 2;
  const widthPx300Dpi = Math.round((totalWidthMm / 25.4) * 300);
  const heightPx300Dpi = Math.round((totalHeightMm / 25.4) * 300);

  return {
    paperWidthMm,
    paperHeightMm,
    bleedMm,
    totalWidthMm,
    totalHeightMm,
    widthPx300Dpi,
    heightPx300Dpi
  };
}
