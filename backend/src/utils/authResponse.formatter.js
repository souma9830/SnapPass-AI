/**
 * authResponse.formatter.js — Authentication Response Error Formatter
 * Built for ELUSoC 2026 / GSSOC 2026.
 */
export function formatAuthError(code, message) {
  return {
    success: false,
    error: code,
    message,
    timestamp: new Date().toISOString(),
  };
}
