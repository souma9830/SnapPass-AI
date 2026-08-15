import { jsPDF } from 'jspdf';

/**
 * Exports a passport sheet image blob to a high-res PDF with exact physical dimensions and crop guides.
 */
export const exportSheetToPDF = async (
  imageBlob,
  filename = 'passport-sheet.pdf',
  dimensions = [4, 6],
  options = {}
) => {
  const { title = 'SnapPass-AI Printable Sheet', addCropMarks = false } = options;

  const pdf = new jsPDF({
    orientation: dimensions[0] > dimensions[1] ? 'landscape' : 'portrait',
    unit: 'in',
    format: dimensions,
  });

  pdf.setProperties({ title, creator: 'SnapPass-AI Studio' });

  const imageUrl = URL.createObjectURL(imageBlob);

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      pdf.addImage(img, 'PNG', 0, 0, dimensions[0], dimensions[1]);

      if (addCropMarks) {
        pdf.setDrawColor(180, 180, 180);
        pdf.setLineWidth(0.01);
        // Add subtle margin cut guides
        pdf.line(0.2, 0, 0.2, 0.3);
        pdf.line(0, 0.2, 0.3, 0.2);
      }

      pdf.save(filename);
      URL.revokeObjectURL(imageUrl);
      resolve();
    };
    img.onerror = () => {
      URL.revokeObjectURL(imageUrl);
      reject(new Error('Failed to load image for PDF export'));
    };
    img.src = imageUrl;
  });
};
