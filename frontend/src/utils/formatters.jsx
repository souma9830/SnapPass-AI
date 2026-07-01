/**
 * formatters.js — small formatting utilities used across the app.
 */

/**
 * Format file size in human-readable form.
 * @param {number} bytes
 * @returns {string}
 */
export const formatFileSize = (bytes) => {
  const size = Number(bytes);

  if (!Number.isFinite(size) || size <= 0) return '0 B';
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${Number((size / 1024).toFixed(1))} KB`;
  if (size < 1024 * 1024 * 1024) {
    return `${Number((size / 1024 / 1024).toFixed(1))} MB`;
  }
  return `${Number((size / 1024 / 1024 / 1024).toFixed(1))} GB`;
};

/**
 * Format a Date object or ISO string into a readable date.
 * @param {Date|string} date
 * @returns {string}
 */
export const formatDate = (date) => {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return 'Invalid date';
  }

  return parsedDate.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

/**
 * Converts mm dimensions to a display string.
 * @param {number} widthMm
 * @param {number} heightMm
 * @returns {string}
 */
export const formatDimensions = (widthMm, heightMm) => `${widthMm}×${heightMm} mm`;
