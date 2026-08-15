import { jsPDF } from 'jspdf';
import { getPresetById } from './printLayoutPresets';

/**
 * generatePassportPDFSheet — High-DPI PDF document exporter that places
 * passport photo tiles onto configured paper sheets with cutting guides.
 */
export async function generatePassportPDFSheet({
  imageSrc,
  paperPresetId = '4x6_standard',
  photoWidthMm = 35,
  photoHeightMm = 45,
  showCropGuides = true,
}) {
  const paper = getPresetById(paperPresetId);
  const orientation = paper.widthMm > paper.heightMm ? 'landscape' : 'portrait';

  const doc = new jsPDF({
    orientation,
    unit: 'mm',
    format: [paper.widthMm, paper.heightMm],
  });

  const columns = paper.defaultColumns;
  const rows = paper.defaultRows;
  const totalPhotos = Math.min(columns * rows, paper.maxPhotos);

  const startX = (paper.widthMm - columns * photoWidthMm) / 2;
  const startY = (paper.heightMm - rows * photoHeightMm) / 2;

  let count = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (count >= totalPhotos) break;

      const x = startX + c * photoWidthMm;
      const y = startY + r * photoHeightMm;

      if (imageSrc) {
        doc.addImage(imageSrc, 'JPEG', x, y, photoWidthMm, photoHeightMm);
      }

      if (showCropGuides) {
        doc.setDrawColor(180, 180, 180);
        doc.setLineWidth(0.1);
        doc.rect(x, y, photoWidthMm, photoHeightMm);
      }

      count++;
    }
  }

  return doc;
}

export default generatePassportPDFSheet;
