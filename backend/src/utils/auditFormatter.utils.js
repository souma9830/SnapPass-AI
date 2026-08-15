/**
 * auditFormatter.utils.js — Security audit stream formatter.
 * Converts raw audit entries to CSV, NDJSON, and JSON formats for compliance export.
 */

export const formatAuditCSV = (records = []) => {
  const headers = ['id', 'action', 'userId', 'ip', 'status', 'timestamp'];
  const rows = records.map((rec) => {
    const id = JSON.stringify(rec.id || rec._id || '');
    const action = JSON.stringify(rec.action || 'UNKNOWN');
    const userId = JSON.stringify(rec.userId || 'system');
    const ip = JSON.stringify(rec.ip || '127.0.0.1');
    const status = JSON.stringify(rec.status || 'SUCCESS');
    const timestamp = JSON.stringify(rec.timestamp || new Date().toISOString());
    return [id, action, userId, ip, status, timestamp].join(',');
  });

  return [headers.join(','), ...rows].join('\n');
};

export const formatAuditNDJSON = (records = []) => {
  return records.map((rec) => JSON.stringify(rec)).join('\n');
};

export const formatAuditJSON = (records = []) => {
  return JSON.stringify({ count: records.length, exportedAt: new Date().toISOString(), records }, null, 2);
};
