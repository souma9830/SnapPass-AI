/**
 * fileValidation.js — helpers for validating image files on the client side.
 */

export const ACCEPTED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const ACCEPTED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];
export const MAX_FILE_SIZE_MB    = 10;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const hasAcceptedImageExtension = (fileName = '') => {
  const normalizedName = fileName.toLowerCase();
  return ACCEPTED_EXTENSIONS.some((extension) => normalizedName.endsWith(extension));
};

/**
 * Verifies the file's binary signature (magic bytes) to ensure it is a real image.
 * @param {File} file
 * @returns {Promise<boolean>}
 */
export const validateImageMagicBytes = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = (e) => {
      if (e.target.readyState === FileReader.DONE) {
        const arr = new Uint8Array(e.target.result);
        let header = "";
        for (let i = 0; i < Math.min(arr.length, 12); i++) {
          header += arr[i].toString(16).toUpperCase().padStart(2, '0');
        }
        // JPEG/JPG: FFD8FF
        const isJpeg = header.startsWith("FFD8FF");
        // PNG: 89504E47
        const isPng = header.startsWith("89504E47");
        // WEBP RIFF (52494646) and WEBP (57454250)
        const isWebp = header.startsWith("52494646") && header.endsWith("57454250");
        
        resolve(isJpeg || isPng || isWebp);
      } else {
        resolve(false);
      }
    };
    reader.readAsArrayBuffer(file.slice(0, 12));
  });
};

/**
 * Validates that a file is an accepted image type and within the size limit.
 * @param {File} file
 * @returns {{ valid: boolean, error: string|null }}
 */
export const validateImageFile = (file) => {
  if (!file) {
    return { valid: false, error: 'No file provided.' };
  }

  const hasAcceptedType = ACCEPTED_MIME_TYPES.includes(file.type);
  const hasAcceptedExtension = hasAcceptedImageExtension(file.name);

  if (!hasAcceptedType || !hasAcceptedExtension) {
    return {
      valid: false,
      error: 'Unsupported file format. Please upload a JPG, PNG, or WEBP image.',
    };
  }

  if (file.size === 0) {
    return {
      valid: false,
      error: 'File is empty. Please upload a valid image.',
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File size is too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Max is ${MAX_FILE_SIZE_MB}MB.`,
    };
  }

  return { valid: true, error: '' };
};

/**
 * Asynchronously validates image width and height to ensure sufficient quality.
 * @param {File} file
 * @param {number} minWidth
 * @param {number} minHeight
 * @returns {Promise<{ valid: boolean, error: string|null }>}
 */
export const validateImageDimensions = (file, minWidth = 600, minHeight = 600) => {
  return new Promise((resolve) => {
    if (!file) {
      return resolve({ valid: false, error: 'No file provided.' });
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        if (img.width < minWidth || img.height < minHeight) {
          resolve({
            valid: false,
            error: `Image resolution is too low (${img.width}x${img.height}px). Minimum recommended is ${minWidth}x${minHeight}px for high-quality printing.`,
          });
        } else {
          resolve({ valid: true, error: null });
        }
      };
      img.onerror = () => {
        resolve({ valid: false, error: 'Failed to read image dimensions.' });
      };
      img.src = e.target.result;
    };
    reader.onerror = () => {
      resolve({ valid: false, error: 'Failed to read file.' });
    };
    reader.readAsDataURL(file);
  });
};
