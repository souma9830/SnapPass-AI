import AuditLog from '../models/auditLog.model.js';

const EXCLUDED_PATHS = ['/health', '/diagnostics'];

export const auditMiddleware = async (req, res, next) => {
  if (EXCLUDED_PATHS.some((p) => req.path.startsWith(p))) return next();

  const start = Date.now();
  const originalEnd = res.end;

  res.end = function (...args) {
    const durationMs = Date.now() - start;
    const logEntry = {
      method: req.method,
      endpoint: req.originalUrl || req.url,
      statusCode: res.statusCode,
      durationMs,
      ip: req.ip || req.connection?.remoteAddress || '',
      userAgent: (req.headers['user-agent'] || '').slice(0, 255),
      userId: req.user?._id || req.user?.id || null,
      requestId: req.headers['x-request-id'] || '',
      errorMessage:
        res.statusCode >= 400 ? res.statusMessage || `${res.statusCode}` : '',
    };

    AuditLog.create(logEntry).catch((err) => {
      console.error('[Audit] Failed to persist audit log:', err.message);
    });

    return originalEnd.apply(this, args);
  };

  next();
};
