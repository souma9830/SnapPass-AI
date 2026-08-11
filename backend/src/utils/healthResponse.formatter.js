/**
 * healthResponse.formatter.js — Standardized JSON Health Diagnostics Response Formatter
 * Built for ELUSoC 2026 / GSSOC 2026 Monitoring Infrastructure.
 */
export function formatHealthResponse(status, metrics = {}, services = {}) {
  return {
    success: status === 'UP' || status === 'HEALTHY',
    status,
    timestamp: new Date().toISOString(),
    metrics,
    services,
  };
}

export function formatDiagnosticsError(error) {
  return {
    success: false,
    status: 'CRITICAL',
    timestamp: new Date().toISOString(),
    error: error.message || 'Health probe execution failure',
  };
}
