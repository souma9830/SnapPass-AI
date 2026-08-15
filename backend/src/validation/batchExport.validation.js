/**
 * batchExport.validation.js — Validation for batch export requests.
 */

export const validateBatchExportRequest = (body) => {
  const errors = [];
  if (!body.files || !Array.isArray(body.files) || body.files.length === 0) {
    errors.push('files must be a non-empty array of file items.');
  }

  if (body.compressionLevel && (isNaN(body.compressionLevel) || body.compressionLevel < 0 || body.compressionLevel > 9)) {
    errors.push('compressionLevel must be an integer between 0 and 9.');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
