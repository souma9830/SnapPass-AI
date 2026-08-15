import { validateFileMagicBytes } from './magicBytes';

/**
 * Run comprehensive client-side diagnostics on passport photo before upload.
 */
export const runImageDiagnostics = async (file) => {
  return new Promise(async (resolve) => {
    if (!file) {
      return resolve({ success: false, errors: ['No file provided.'], warnings: [] });
    }

    const magicCheck = await validateFileMagicBytes(file);
    if (!magicCheck.valid) {
      return resolve({
        success: false,
        errors: [`Invalid file format: ${magicCheck.error}`],
        warnings: [],
      });
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const errors = [];
        const warnings = [];

        // Check image dimensions (Minimum resolution: 600x600 px)
        if (img.width < 600 || img.height < 600) {
          errors.push(`Low resolution detected (${img.width}x${img.height}px). Minimum required is 600x600px.`);
        }

        // Maximum file size check (15MB)
        if (file.size > 15 * 1024 * 1024) {
          errors.push('File size exceeds maximum allowed limit of 15MB.');
        }

        // Check aspect ratio
        const ratio = img.width / img.height;
        if (ratio < 0.6 || ratio > 1.5) {
          warnings.push('Unusual aspect ratio. Standard passport photos have a 1:1 or 3.5:4.5 aspect ratio.');
        }

        // DPI Estimation (assuming 300 DPI target for 2 inch width)
        const estimatedDPI = Math.round(img.width / 2.0);

        resolve({
          success: errors.length === 0,
          errors,
          warnings,
          width: img.width,
          height: img.height,
          sizeMB: (file.size / (1024 * 1024)).toFixed(2),
          estimatedDPI,
          detectedFormat: magicCheck.format,
        });
      };
      img.onerror = () => resolve({ success: false, errors: ['Failed to decode image data.'], warnings: [] });
      img.src = e.target.result;
    };
    reader.onerror = () => resolve({ success: false, errors: ['Failed to read file buffer.'], warnings: [] });
    reader.readAsDataURL(file);
  });
};

export default runImageDiagnostics;
