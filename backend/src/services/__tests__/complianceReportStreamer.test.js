import { describe, it, expect, jest, beforeEach } from '@jest/globals';

const mockCreateTask = jest.fn();
const mockFindOneAndUpdate = jest.fn();

jest.mock('../../models/auditLog.model.js', () => ({
  __esModule: true,
  default: {
    find: jest.fn(() => ({})),
  },
}));

jest.mock('../../models/complianceExportTask.model.js', () => ({
  __esModule: true,
  default: {
    create: (...args) => mockCreateTask(...args),
    findOneAndUpdate: (...args) => mockFindOneAndUpdate(...args),
  },
}));

import AuditLog from '../../models/auditLog.model.js';
import { ComplianceReportStreamer } from '../../services/complianceReportStreamer.service.js';

const docs = [
  {
    _id: '1',
    createdAt: new Date('2026-08-11T10:00:00Z'),
    method: 'GET',
    endpoint: '/api/upload',
    statusCode: 200,
    durationMs: 12,
    ip: '127.0.0.1',
    userId: '507f1f77bcf86cd799439011',
    requestId: 'req-1',
    errorMessage: '',
  },
  {
    _id: '2',
    createdAt: new Date('2026-08-11T10:00:01Z'),
    method: 'POST',
    endpoint: '/api/upload/batch',
    statusCode: 500,
    durationMs: 3400,
    ip: '127.0.0.1',
    userId: null,
    requestId: 'req-2',
    errorMessage: 'Service unavailable',
  },
];

const mockCursor = (list) => {
  let i = 0;
  return {
    next: jest.fn(async () => (i < list.length ? list[i++] : null)),
  };
};

const collect = (stream) =>
  new Promise((resolve, reject) => {
    let out = '';
    stream.on('data', (chunk) => {
      out += chunk.toString();
    });
    stream.on('end', () => resolve(out));
    stream.on('error', reject);
  });

describe('ComplianceReportStreamer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCreateTask.mockResolvedValue({ taskId: 'task-1' });
    mockFindOneAndUpdate.mockResolvedValue({});
    AuditLog.find.mockReturnValue({
      sort: jest.fn(() => ({
        lean: jest.fn(() => ({
          cursor: jest.fn(() => mockCursor(docs)),
        })),
      })),
    });
  });

  it('streams CSV with a header row and all audit log rows', async () => {
    const out = await collect(new ComplianceReportStreamer());

    const lines = out.trim().split('\n');
    expect(lines[0]).toBe(
      'timestamp,method,endpoint,statusCode,durationMs,ip,userId,requestId,errorMessage'
    );
    expect(lines).toHaveLength(3);
    expect(lines[1]).toContain('GET,/api/upload,200,12,127.0.0.1,507f1f77bcf86cd799439011,req-1,');
    expect(lines[2]).toContain('POST,/api/upload/batch,500,3400');
    expect(mockCreateTask).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'RUNNING' })
    );
    expect(mockFindOneAndUpdate).toHaveBeenCalledWith(
      expect.any(Object),
      expect.objectContaining({ status: 'COMPLETED', recordCount: 2 })
    );
  });

  it('applies the method filter to the underlying query', async () => {
    const stream = new ComplianceReportStreamer({ filter: { method: 'GET' } });
    await collect(stream);

    expect(AuditLog.find).toHaveBeenCalledWith({ method: 'GET' });
  });

  it('emits CSV header only (no rows) when there are no logs', async () => {
    AuditLog.find.mockReturnValue({
      sort: jest.fn(() => ({
        lean: jest.fn(() => ({
          cursor: jest.fn(() => mockCursor([])),
        })),
      })),
    });

    const out = await collect(new ComplianceReportStreamer());
    expect(out.trim()).toBe(
      'timestamp,method,endpoint,statusCode,durationMs,ip,userId,requestId,errorMessage'
    );
    expect(mockFindOneAndUpdate).toHaveBeenCalledWith(
      expect.any(Object),
      expect.objectContaining({ status: 'COMPLETED', recordCount: 0 })
    );
  });

  it('escapes commas and quotes in CSV fields', async () => {
    const tricky = {
      _id: '3',
      createdAt: new Date('2026-08-11T10:00:02Z'),
      method: 'GET',
      endpoint: '/api/x',
      statusCode: 400,
      durationMs: 1,
      ip: '127.0.0.1',
      userId: null,
      requestId: 'req,3',
      errorMessage: 'bad "input", retry',
    };
    AuditLog.find.mockReturnValue({
      sort: jest.fn(() => ({
        lean: jest.fn(() => ({
          cursor: jest.fn(() => mockCursor([tricky])),
        })),
      })),
    });

    const out = await collect(new ComplianceReportStreamer());
    expect(out).toContain('"req,3"');
    expect(out).toContain('"bad ""input"", retry"');
  });
});
