/**
 * Admin Audit Logger Middleware for SnapPass AI Server
 * Logs security sensitive API events with IP, User Agent, and timestamp.
 */

const auditLogs = [];

function auditLoggerMiddleware(req, res, next) {
  const startTime = Date.now();
  
  res.on('finish', () => {
    const durationMs = Date.now() - startTime;
    const logEntry = {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.originalUrl || req.url,
      status: res.statusCode,
      ip: req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      userAgent: req.headers['user-agent'] || 'unknown',
      durationMs,
    };

    auditLogs.push(logEntry);
    if (auditLogs.length > 500) {
      auditLogs.shift();
    }
  });

  next();
}

function getAuditLogs(limit = 50) {
  return auditLogs.slice(-limit).reverse();
}

function clearAuditLogs() {
  auditLogs.length = 0;
}

module.exports = {
  auditLoggerMiddleware,
  getAuditLogs,
  clearAuditLogs,
};
