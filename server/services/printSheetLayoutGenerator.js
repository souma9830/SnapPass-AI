/**
 * Server-side print sheet layout geometry and crop mark position engine
 */

export function computePrintSheetGrid(sheetWidthMm, sheetHeightMm, photoWidthMm, photoHeightMm, bleedMm = 3) {
  const effectivePhotoW = photoWidthMm + bleedMm * 2;
  const effectivePhotoH = photoHeightMm + bleedMm * 2;

  const columns = Math.floor(sheetWidthMm / effectivePhotoW);
  const rows = Math.floor(sheetHeightMm / effectivePhotoH);
  const totalPhotosPerSheet = columns * rows;

  return {
    columns,
    rows,
    totalPhotosPerSheet,
    bleedMm
  };
}
