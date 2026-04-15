/**
 * formatters.js — small formatting utilities used across the app.
 */

/**
 * Format file size in human-readable form.
 * @param {number} bytes
 * @returns {string}
 */
export const formatFileSize = (bytes) => {
  if (bytes < 1024)       return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
};

/**
 * Format a Date object or ISO string into a readable date.
 * @param {Date|string} date
 * @returns {string}
 */
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
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
