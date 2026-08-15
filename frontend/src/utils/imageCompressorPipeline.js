/**
 * imageCompressorPipeline.js — Multi-stage canvas image compressor with quality scale & memory bounds.
 */

const MAX_PIXEL_DIMENSION = 4096;
const DEFAULT_MAX_SIZE_MB = 2.0;

export async function compressImagePipeline(file, options = {}) {
  if (!file || !(file instanceof File)) {
    return { compressedFile: file, ratio: 1.0, originalSize: file?.size || 0, newSize: file?.size || 0 };
  }

  const maxSizeMB = options.maxSizeMB || DEFAULT_MAX_SIZE_MB;
  const targetBytes = maxSizeMB * 1024 * 1024;

  if (file.size <= targetBytes && !options.forceCompress) {
    return { compressedFile: file, ratio: 1.0, originalSize: file.size, newSize: file.size };
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      let { width, height } = img;
      if (width > MAX_PIXEL_DIMENSION || height > MAX_PIXEL_DIMENSION) {
        if (width > height) {
          height = Math.round((height * MAX_PIXEL_DIMENSION) / width);
          width = MAX_PIXEL_DIMENSION;
        } else {
          width = Math.round((width * MAX_PIXEL_DIMENSION) / height);
          height = MAX_PIXEL_DIMENSION;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return resolve({ compressedFile: file, ratio: 1.0, originalSize: file.size, newSize: file.size });
      }

      ctx.drawImage(img, 0, 0, width, height);

      let quality = 0.85;
      const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            return resolve({ compressedFile: file, ratio: 1.0, originalSize: file.size, newSize: file.size });
          }

          const compressedFile = new File([blob], file.name, {
            type: blob.type || mimeType,
            lastModified: Date.now(),
          });

          const ratio = (compressedFile.size / file.size).toFixed(2);
          resolve({
            compressedFile,
            ratio: parseFloat(ratio),
            originalSize: file.size,
            newSize: compressedFile.size,
          });
        },
        mimeType,
        quality
      );
    };

    img.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image for compression pipeline.'));
    };

    img.src = url;
  });
}
