import request from 'supertest';
import express from 'express';
import { getAuditLogs, getAuditStats } from '../controllers/audit.controller.js';
import AuditLog from '../models/auditLog.model.js';

jest.mock('../models/auditLog.model.js');

const app = express();
app.use(express.json());
app.get('/admin/audit-logs', getAuditLogs);
app.get('/admin/audit-stats', getAuditStats);

describe('Audit Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /admin/audit-logs', () => {
    it('should return paginated audit logs', async () => {
      const mockLogs = [
        { method: 'POST', endpoint: '/api/photos/upload', statusCode: 200, durationMs: 120 },
      ];
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockLogs),
      };

      AuditLog.find.mockReturnValue(mockQuery);
      AuditLog.countDocuments.mockResolvedValue(1);

      const res = await request(app).get('/admin/audit-logs?page=1&limit=10');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.logs).toEqual(mockLogs);
      expect(res.body.data.pagination.total).toBe(1);
    });
  });

  describe('GET /admin/audit-stats', () => {
    it('should return 24h traffic statistics', async () => {
      AuditLog.countDocuments.mockResolvedValueOnce(100).mockResolvedValueOnce(5);
      AuditLog.aggregate.mockResolvedValueOnce([{ _id: 'POST', count: 60 }]).mockResolvedValueOnce([{ _id: '/api/upload', count: 50, avgDuration: 110 }]);

      const res = await request(app).get('/admin/audit-stats');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.totalRequests24h).toBe(100);
      expect(res.body.data.errorCount24h).toBe(5);
    });
  });
});
