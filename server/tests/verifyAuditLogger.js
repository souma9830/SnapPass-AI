/**
 * Verification test for Admin Audit Logger Middleware & Audit Log endpoint.
 */
const { auditLoggerMiddleware, getAuditLogs, clearAuditLogs } = require('../middleware/auditLoggerMiddleware');

function verifyAuditLogger() {
  clearAuditLogs();

  const req = {
    method: 'POST',
    url: '/api/v1/tasks/dispatch',
    ip: '127.0.0.1',
    headers: { 'user-agent': 'Vitest-Test-Agent' },
  };

  const handlers = [];
  const res = {
    statusCode: 200,
    on: (event, handler) => handlers.push(handler),
  };

  const next = () => {};

  auditLoggerMiddleware(req, res, next);
  handlers.forEach((h) => h());

  const logs = getAuditLogs();
  if (logs.length !== 1) {
    throw new Error(`Expected 1 log entry, got ${logs.length}`);
  }

  if (logs[0].method !== 'POST' || logs[0].ip !== '127.0.0.1') {
    throw new Error('Audit log payload contents mismatch');
  }

  console.log('PASSED: Audit logger middleware verified successfully!');
}

verifyAuditLogger();
