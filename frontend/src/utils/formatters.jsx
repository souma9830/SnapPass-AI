/**
 * formatters.js — small formatting utilities used across the app.
 */

/**
 * Format file size in human-readable form.
 * @param {number} bytes
 * @returns {string}
 */
export const formatFileSize = (bytes) => {
  if (bytes === null || bytes === undefined) return '0 B';
  const num = Number(bytes);
  if (isNaN(num) || num <= 0) return '0 B';

  const units = ['B', 'KB', 'MB', 'GB'];
  let val = num;
  let unitIndex = 0;
  while (val >= 1024 && unitIndex < units.length - 1) {
    val /= 1024;
    unitIndex++;
  }
  const formatted = val % 1 === 0 ? val.toString() : val.toFixed(1);
  return `${formatted} ${units[unitIndex]}`;
};

export const formatDate = (date) => {
  if (!date) return 'Invalid date';
  const d = new Date(date);
  if (isNaN(d.getTime())) return 'Invalid date';
  return d.toLocaleDateString('en-IN', {
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
