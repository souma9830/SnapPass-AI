import { writeAuditEntry } from '../utils/auditLogger.js';

export const requestAuditMiddleware = (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (req.method !== 'GET') {
      writeAuditEntry('API_WRITE_ACCESS', {
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        statusCode: res.statusCode,
        durationMs: duration
      });
    }
  });
  next();
};
