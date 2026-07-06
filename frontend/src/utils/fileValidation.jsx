/**
 * fileValidation.jsx — Client-side image validation helpers.
 *
 * Combines MIME-type checks, file-size limits, magic-byte verification,
 * and image dimension enforcement into a single, clearly-structured module.
 * The dimension gate is intentionally strict: passport photos printed at
 * 300 DPI need at least 413 × 531 pixels (35×45 mm standard), so we raise
 * the minimum to 400 px on both axes to give users a safe margin.
 */

export const ACCEPTED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const ACCEPTED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];
export const MAX_FILE_SIZE_MB = 10;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

// Minimum dimensions required to produce a sharp, print-quality passport photo.
// Below these values rembg + DPI optimisation cannot guarantee 300 DPI output.
export const MIN_PRINT_WIDTH = 400;
export const MIN_PRINT_HEIGHT = 400;
export const MAX_PIXEL_DIMENSION = 8000; // guard against decompression-bomb payloads

const hasAcceptedImageExtension = (fileName = '') => {
  const lower = fileName.toLowerCase();
  return ACCEPTED_EXTENSIONS.some((ext) => lower.endsWith(ext));
};

/**
 * Reads the first 12 bytes of a file to verify its binary signature
 * (magic bytes).  Returns a Promise<boolean>.
 *
 * Supported signatures:
 *  - JPEG/JPG : FF D8 FF
 *  - PNG      : 89 50 4E 47
 *  - WebP     : 52 49 46 46 … 57 45 42 50
 */
export const validateImageMagicBytes = (file) =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = (e) => {
      if (e.target.readyState !== FileReader.DONE) {
        resolve(false);
        return;
      }
      const arr = new Uint8Array(e.target.result);
      let header = '';
      for (let i = 0; i < Math.min(arr.length, 12); i++) {
        header += arr[i].toString(16).toUpperCase().padStart(2, '0');
      }
      const isJpeg = header.startsWith('FFD8FF');
      const isPng = header.startsWith('89504E47');
      const isWebp =
        header.startsWith('52494646') && header.includes('57454250');
      resolve(isJpeg || isPng || isWebp);
    };
    reader.onerror = () => resolve(false);
    reader.readAsArrayBuffer(file.slice(0, 12));
  });

/**
 * Synchronous checks: MIME type, file extension, and size limit.
 *
 * @param {File} file
 * @returns {{ valid: boolean, error: string | null }}
 */
export const validateImageFile = (file) => {
  if (!file) {
    return { valid: false, error: 'No file provided.' };
  }

  const hasType = ACCEPTED_MIME_TYPES.includes(file.type);
  const hasExt = hasAcceptedImageExtension(file.name);

  if (!hasType || !hasExt) {
    return {
      valid: false,
      error: 'Unsupported format. Please upload a JPG, PNG, or WebP image.',
    };
  }

  if (file.size === 0) {
    return { valid: false, error: 'The selected file is empty (0 bytes).' };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    const mb = (file.size / 1024 / 1024).toFixed(1);
    return {
      valid: false,
      error: `File is too large (${mb} MB). Maximum allowed size is ${MAX_FILE_SIZE_MB} MB.`,
    };
  }

  return { valid: true, error: null };
};

/**
 * Asynchronous pixel-dimension check.
 *
 * Enforces a minimum resolution needed for 300 DPI passport printing and a
 * maximum to prevent browser/server memory exhaustion on huge images.
 *
 * @param {File} file
 * @param {number} [minWidth]
 * @param {number} [minHeight]
 * @returns {Promise<{ valid: boolean, error: string | null, width?: number, height?: number }>}
 */
export const validateImageDimensions = (
  file,
  minWidth = MIN_PRINT_WIDTH,
  minHeight = MIN_PRINT_HEIGHT
) =>
  new Promise((resolve) => {
    if (!file) {
      resolve({ valid: false, error: 'No file provided.' });
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const { naturalWidth: w, naturalHeight: h } = img;

      if (w > MAX_PIXEL_DIMENSION || h > MAX_PIXEL_DIMENSION) {
        resolve({
          valid: false,
          error: `Image dimensions (${w}×${h} px) are too large. Maximum allowed is ${MAX_PIXEL_DIMENSION}×${MAX_PIXEL_DIMENSION} px.`,
        });
        return;
      }

      if (w < minWidth || h < minHeight) {
        resolve({
          valid: false,
          error:
            `Image resolution is too low (${w}×${h} px). ` +
            `A minimum of ${minWidth}×${minHeight} px is required for ` +
            `high-quality passport photo printing at 300 DPI.`,
          width: w,
          height: h,
        });
        return;
      }

      resolve({ valid: true, error: null, width: w, height: h });
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve({
        valid: false,
        error: 'Could not decode image to read its dimensions.',
      });
    };

    img.src = objectUrl;
  });

/**
 * Full async validation pipeline — runs all checks in order and returns an
 * array of human-readable error strings.  An empty array means the file is
 * valid.
 *
 * Order: type/size → magic bytes → dimensions
 *
 * Dimension check is skipped when earlier checks have already failed to avoid
 * confusing the user with cascading errors from a corrupted or wrong-type file.
 *
 * @param {File} file
 * @returns {Promise<string[]>}
 */
export const validatePhotoFile = async (file) => {
  const errors = [];

  // 1) Synchronous checks
  const basicResult = validateImageFile(file);
  if (!basicResult.valid) {
    errors.push(basicResult.error);
    return errors; // stop early — later checks are meaningless
  }

  // 2) Binary signature check
  const magicOk = await validateImageMagicBytes(file);
  if (!magicOk) {
    errors.push(
      'File signature mismatch. The file does not appear to be a valid JPEG, PNG, or WebP image.'
    );
    return errors;
  }

  // 3) Dimension / resolution check
  const dimResult = await validateImageDimensions(file);
  if (!dimResult.valid) {
    errors.push(dimResult.error);
  }

  return errors;
};
