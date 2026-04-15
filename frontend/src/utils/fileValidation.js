/**
 * fileValidation.js — helpers for validating image files on the client side.
 */

export const ACCEPTED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const MAX_FILE_SIZE_MB    = 10;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

/**
 * Validates that a file is an accepted image type and within the size limit.
 * @param {File} file
 * @returns {{ valid: boolean, error: string|null }}
 */
export const validateImageFile = (file) => {
  if (!file) {
    return { valid: false, error: 'No file provided.' };
  }

  if (!ACCEPTED_MIME_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Unsupported file type: ${file.type}. Please use JPEG, PNG, or WebP.`,
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
