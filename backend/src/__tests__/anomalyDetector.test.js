import request from 'supertest';
import app from '../app.js';
import anomalyDetectorService from '../services/anomalyDetector.service.js';
import ShareLink from '../models/shareLink.model.js';

describe('Behavioral Anomaly Detection Service & Endpoints', () => {
  const testIp = '198.51.100.42';
  const testShareId = 'anomalyshare123';

  beforeAll(() => {
    // Mock ShareLink Mongoose methods
    jest.spyOn(ShareLink.prototype, 'save').mockResolvedValue(true);
    jest.spyOn(ShareLink, 'findOne').mockImplementation((query) => {
      if (query && query.shareId === testShareId) {
        const mockLink = new ShareLink({
          shareId: testShareId,
          filename: 'test.jpg',
          expiresAt: new Date(Date.now() + 3600000),
          passwordHash: '$2a$10$abcdefghijklmnopqrstuuu', // bcrypt placeholder
        });
        mockLink.verifyPassword = jest.fn().mockImplementation((pass) => Promise.resolve(pass === 'CorrectSecret1'));
        return Promise.resolve(mockLink);
      }
      return Promise.resolve(null);
    });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    anomalyDetectorService.unblockIp(testIp);
    anomalyDetectorService.unlockShare(testShareId);
  });

  describe('Rule 1: Failed Password Attempts Lockout', () => {
    it('should lock share link after 5 consecutive failed password attempts', () => {
      for (let i = 0; i < 4; i++) {
        const res = anomalyDetectorService.recordAccessAttempt({
          shareId: testShareId,
          ip: testIp,
          success: false,
          passwordAttempted: true,
        });
        expect(res.allowed).toBe(true);
      }

      // 5th failed attempt triggers lockout
      const fifthRes = anomalyDetectorService.recordAccessAttempt({
        shareId: testShareId,
        ip: testIp,
        success: false,
        passwordAttempted: true,
      });

      expect(fifthRes.allowed).toBe(false);
      expect(fifthRes.isLocked).toBe(true);
      expect(fifthRes.reason).toContain('multiple failed password attempts');
      expect(anomalyDetectorService.isShareLocked(testShareId)).toBe(true);
    });
  });

  describe('Rule 2: Automated Script / Bot Request Frequency Detection', () => {
    it('should block IP when rapid sub-second request pattern is detected', () => {
      const botIp = '203.0.113.88';
      const baseTime = Date.now();
      const dateSpy = jest.spyOn(Date, 'now');

      // Simulate 10 requests with 100ms intervals (sub-250ms threshold)
      for (let i = 0; i < 10; i++) {
        dateSpy.mockReturnValue(baseTime + i * 100);
        anomalyDetectorService.recordAccessAttempt({
          shareId: 'botshare',
          ip: botIp,
          success: true,
        });
      }

      dateSpy.mockRestore();

      expect(anomalyDetectorService.isIpBlocked(botIp)).toBe(true);
      anomalyDetectorService.unblockIp(botIp);
    });
  });

  describe('GET /api/share/security/anomalies & Unblock IP API', () => {
    it('should return anomaly metrics and blocked IP list', async () => {
      anomalyDetectorService.blockIp(testIp, 600000, 'Test block');

      expect(anomalyDetectorService.isIpBlocked(testIp)).toBe(true);

      const res = await request(app).get('/api/share/security/anomalies');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.totalBlockedIpsCount).toBeGreaterThanOrEqual(1);

      // Direct unblock test
      const directUnblocked = anomalyDetectorService.unblockIp(testIp);
      expect(directUnblocked).toBe(true);

      // Re-block for API unblock test
      anomalyDetectorService.blockIp(testIp, 600000, 'Test block 2');
      const unblockRes = await request(app)
        .post('/api/share/security/unblock-ip')
        .send({ ip: testIp });

      expect(unblockRes.statusCode).toBe(200);
      expect(unblockRes.body.data.unblocked).toBe(true);
      expect(anomalyDetectorService.isIpBlocked(testIp)).toBe(false);
    });
  });
});
