import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';

/**
 * Compress an image (Blob) to JPEG with given quality.
 * Returns a Blob.
 */
export async function compressImage(fileBlob, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Compression failed'));
        },
        'image/jpeg',
        quality
      );
    };
    img.onerror = reject;
    const url = URL.createObjectURL(fileBlob);
    img.src = url;
  });
}

/**
 * Generate a PDF containing a single image.
 * Returns a Blob of type application/pdf.
 */
export async function generatePdf(imageBlob, filename = 'download.pdf') {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const pdf = new jsPDF({
          orientation: img.width > img.height ? 'landscape' : 'portrait',
          unit: 'pt',
          format: [img.width, img.height],
        });
        pdf.addImage(reader.result, 'JPEG', 0, 0, img.width, img.height);
        const pdfBlob = pdf.output('blob');
        resolve(pdfBlob);
      };
      img.onerror = reject;
      img.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(imageBlob);
  });
}

/**
 * Create a ZIP file from a map of filename => Blob.
 * Triggers a download of the zip.
 */
export async function createZip(filesMap, zipName = 'download_package.zip') {
  const zip = new JSZip();
  Object.entries(filesMap).forEach(([name, blob]) => {
    zip.file(name, blob);
  });
  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, zipName);
}

/**
 * Sanitize a filename for compliance (remove special chars, lower case).
 */
export function sanitizeFileName(originalName) {
  return originalName.replace(/[^a-zA-Z0-9._-]/g, '_').toLowerCase();
}
