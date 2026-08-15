import request from 'supertest';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import app from '../app.js';
import ShareLink from '../models/shareLink.model.js';

describe('Temporary Expiring Share Links API', () => {
  const testFilename = 'test-share-image.jpg';
  const uploadsDir = path.resolve(process.cwd(), 'uploads');
  const testFilePath = path.join(uploadsDir, testFilename);

  // In-memory mock storage for testing without live MongoDB
  const memoryStore = new Map();

  beforeAll(() => {
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    fs.writeFileSync(testFilePath, Buffer.from('fake-image-binary-data'));

    // Mock Mongoose model methods
    jest.spyOn(ShareLink.prototype, 'save').mockImplementation(function () {
      memoryStore.set(this.shareId, this);
      return Promise.resolve(this);
    });

    jest.spyOn(ShareLink, 'findOne').mockImplementation((query) => {
      if (query && query.shareId) {
        return Promise.resolve(memoryStore.get(query.shareId) || null);
      }
      return Promise.resolve(null);
    });

    jest.spyOn(ShareLink, 'deleteMany').mockImplementation((query) => {
      memoryStore.clear();
      return Promise.resolve({ deletedCount: 1 });
    });
  });

  afterAll(() => {
    if (fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath);
    }
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    memoryStore.clear();
  });

  describe('POST /api/share/create', () => {
    it('should fail if no filename is provided', async () => {
      const res = await request(app).post('/api/share/create').send({});
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should create an expiring share link successfully with default options', async () => {
      const res = await request(app).post('/api/share/create').send({
        filename: testFilename,
        expirationOption: '1h',
        title: 'Sensitive ID Photo',
      });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('shareId');
      expect(res.body.data).toHaveProperty('shareUrl');
      expect(res.body.data.title).toBe('Sensitive ID Photo');
      expect(res.body.data.hasPassword).toBe(false);
      expect(res.body.data.isOneTime).toBe(false);
    });

    it('should support password protection and one-time access settings', async () => {
      const res = await request(app).post('/api/share/create').send({
        filename: testFilename,
        expirationOption: '15m',
        isOneTime: true,
        password: 'SecretPassword123!',
        title: 'One-Time Secret Passport',
      });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.hasPassword).toBe(true);
      expect(res.body.data.isOneTime).toBe(true);
    });
  });

  describe('GET /api/share/:shareId/meta', () => {
    it('should return 404 for unknown shareId', async () => {
      const res = await request(app).get('/api/share/invalid12345/meta');
      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it('should return metadata without exposing image payload or password hash', async () => {
      const createRes = await request(app).post('/api/share/create').send({
        filename: testFilename,
        expirationOption: '1h',
        password: 'MyPassword',
      });

      const { shareId } = createRes.body.data;

      const metaRes = await request(app).get(`/api/share/${shareId}/meta`);
      expect(metaRes.statusCode).toBe(200);
      expect(metaRes.body.data.shareId).toBe(shareId);
      expect(metaRes.body.data.requiresPassword).toBe(true);
      expect(metaRes.body.data.isExpired).toBe(false);
      expect(metaRes.body.data).not.toHaveProperty('passwordHash');
      expect(metaRes.body.data).not.toHaveProperty('imageData');
    });
  });

  describe('POST /api/share/:shareId/access', () => {
    it('should reject access if password is required but missing or incorrect', async () => {
      const createRes = await request(app).post('/api/share/create').send({
        filename: testFilename,
        expirationOption: '1h',
        password: 'CorrectPassword1',
      });

      const { shareId } = createRes.body.data;

      // Missing password
      const noPassRes = await request(app).post(`/api/share/${shareId}/access`).send({});
      expect(noPassRes.statusCode).toBe(401);

      // Wrong password
      const wrongPassRes = await request(app).post(`/api/share/${shareId}/access`).send({
        password: 'WrongPassword',
      });
      expect(wrongPassRes.statusCode).toBe(401);
    });

    it('should grant access when correct password is provided', async () => {
      const createRes = await request(app).post('/api/share/create').send({
        filename: testFilename,
        expirationOption: '1h',
        password: 'CorrectPassword1',
      });

      const { shareId } = createRes.body.data;

      const res = await request(app).post(`/api/share/${shareId}/access`).send({
        password: 'CorrectPassword1',
      });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('imageData');
      expect(res.body.data.shareId).toBe(shareId);
    });

    it('should self-destruct/invalidate one-time access link after the 1st view', async () => {
      const createRes = await request(app).post('/api/share/create').send({
        filename: testFilename,
        expirationOption: '1h',
        isOneTime: true,
      });

      const { shareId } = createRes.body.data;

      // First view -> success
      const firstView = await request(app).post(`/api/share/${shareId}/access`).send({});
      expect(firstView.statusCode).toBe(200);
      expect(firstView.body.data.isOneTime).toBe(true);

      // Second view -> 410 Gone (Expired / Invalidated)
      const secondView = await request(app).post(`/api/share/${shareId}/access`).send({});
      expect(secondView.statusCode).toBe(410);
      expect(secondView.body.message).toContain('one-time view link');
    });

    it('should reject access to expired links', async () => {
      const shareId = 'expiredtestlink1';
      const expiredLink = new ShareLink({
        shareId,
        filename: testFilename,
        expiresAt: new Date(Date.now() - 60000), // 1 min in past
        isOneTime: false,
      });
      memoryStore.set(shareId, expiredLink);

      const res = await request(app).post(`/api/share/${shareId}/access`).send({});
      expect(res.statusCode).toBe(410);
      expect(res.body.message).toContain('expired');
    });
  });

  describe('DELETE /api/share/:shareId', () => {
    it('should manually revoke a share link', async () => {
      const createRes = await request(app).post('/api/share/create').send({
        filename: testFilename,
        expirationOption: '1h',
      });

      const { shareId } = createRes.body.data;

      const deleteRes = await request(app).delete(`/api/share/${shareId}`);
      expect(deleteRes.statusCode).toBe(200);

      // Access after revocation should fail
      const accessRes = await request(app).post(`/api/share/${shareId}/access`).send({});
      expect(accessRes.statusCode).toBe(410);
    });
  });
});
