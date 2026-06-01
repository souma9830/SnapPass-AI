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

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File is too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Max is ${MAX_FILE_SIZE_MB} MB.`,
    };
  }

  return { valid: true, error: null };
};
