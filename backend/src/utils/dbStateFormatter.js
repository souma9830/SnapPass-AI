/**
 * dbStateFormatter.js — MongoDB State Log Formatter
 * Built for ELUSoC 2026 / GSSOC 2026.
 */
export function formatDbState(stateCode) {
  const states = { 0: 'DISCONNECTED', 1: 'CONNECTED', 2: 'CONNECTING', 3: 'DISCONNECTING' };
  return states[stateCode] || 'UNKNOWN';
}
