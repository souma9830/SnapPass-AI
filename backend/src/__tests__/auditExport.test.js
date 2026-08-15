import { formatAuditCSV, formatAuditNDJSON, formatAuditJSON } from '../utils/auditFormatter.utils.js';
import { validateAuditExportQuery } from '../validation/auditQuery.validation.js';

describe('Audit Export Utilities & Validation', () => {
  const dummyLogs = [
    { id: '1', action: 'USER_LOGIN', userId: 'usr_123', ip: '192.168.1.1', status: 'SUCCESS', timestamp: '2026-08-02T10:00:00Z' },
    { id: '2', action: 'FILE_UPLOAD', userId: 'usr_123', ip: '192.168.1.1', status: 'SUCCESS', timestamp: '2026-08-02T10:05:00Z' }
  ];

  test('formatAuditCSV exports valid CSV header and rows', () => {
    const csv = formatAuditCSV(dummyLogs);
    expect(csv).toContain('id,action,userId,ip,status,timestamp');
    expect(csv).toContain('"USER_LOGIN"');
  });

  test('formatAuditNDJSON exports newline delimited JSON', () => {
    const ndjson = formatAuditNDJSON(dummyLogs);
    const lines = ndjson.split('\n');
    expect(lines.length).toBe(2);
    expect(JSON.parse(lines[0]).action).toBe('USER_LOGIN');
  });

  test('formatAuditJSON outputs structured envelope', () => {
    const jsonStr = formatAuditJSON(dummyLogs);
    const parsed = JSON.parse(jsonStr);
    expect(parsed.count).toBe(2);
    expect(parsed.records).toHaveLength(2);
  });

  test('validateAuditExportQuery handles format and date validation', () => {
    expect(validateAuditExportQuery({ format: 'csv' }).isValid).toBe(true);
    expect(validateAuditExportQuery({ format: 'xml' }).isValid).toBe(false);
    expect(validateAuditExportQuery({ startDate: 'invalid-date' }).isValid).toBe(false);
  });
});
