/**
 * logFormatter.js — Winston Log Format Transformer
 * Built for ELUSoC 2026 / GSSOC 2026.
 */
export function formatLogEntry(level, message, meta = {}) {
  return {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...meta,
  };
}
