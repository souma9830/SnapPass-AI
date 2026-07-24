import { TelemetryLogger } from '../utils/telemetryLogger.js';

export const telemetryContextMiddleware = (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const durationMs = Date.now() - start;
    TelemetryLogger.logEvent('http_request_telemetry', {
      method: req.method,
      path: req.originalUrl || req.url,
      statusCode: res.statusCode,
      durationMs,
      correlationId: req.correlationId || req.headers['x-correlation-id'] || 'none',
    });
  });
  next();
};
