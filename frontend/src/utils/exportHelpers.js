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

/**
 * Render an image to a canvas at the exact target pixel dimensions.
 * Optional circular mask for avatar-style exports.
 */
export function renderToPixelCanvas(
  source,
  { width, height, shape = 'square' } = {}
) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);

      if (shape === 'circle') {
        ctx.save();
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, Math.min(width, height) / 2, 0, Math.PI * 2);
        ctx.clip();
      }

      const scale = Math.max(width / img.width, height / img.height);
      const dw = img.width * scale;
      const dh = img.height * scale;
      ctx.drawImage(img, (width - dw) / 2, (height - dh) / 2, dw, dh);

      if (shape === 'circle') ctx.restore();

      resolve(canvas);
    };
    img.onerror = reject;
    img.src = source;
  });
}

/**
 * Export a single high-resolution digital image (PNG or JPEG) at the
 * exact pixel dimensions of the selected preset.
 */
export async function exportDigitalImage(
  source,
  { width, height, shape = 'square', format = 'png', quality = 0.95, filename = 'avatar.png' }
) {
  const canvas = await renderToPixelCanvas(source, { width, height, shape });
  const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
  const blob = await new Promise((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Export failed'))), mimeType, quality);
  });
  saveAs(blob, filename);
  return blob;
}
