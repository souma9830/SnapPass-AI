/**
 * telemetryFormatter.utils.js — Telemetry metrics payload formatter.
 */

export const formatTelemetryPayload = (summary) => {
  return {
    timestamp: new Date().toISOString(),
    metrics: {
      requestsTotal: summary.totalRequests,
      errorsTotal: summary.totalErrors,
      errorRate: summary.totalRequests > 0 ? (summary.totalErrors / summary.totalRequests).toFixed(4) : 0,
      latencyAvgMs: summary.avgMs,
      latencyP95Ms: summary.p95Ms,
    },
  };
};
