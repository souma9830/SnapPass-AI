import request from 'supertest';

// Set dummy environment variables before importing app to prevent config from throwing errors
process.env.MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/test-snappass';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret-key-123';
process.env.RESEND_API_KEY = process.env.RESEND_API_KEY || 're_testkey123';
process.env.EMAIL_FROM = process.env.EMAIL_FROM || 'test@snappassai.com';

// Import app dynamically after setting environment variables
const appModule = await import('./app.js');
const app = appModule.default;

describe('GET /health', () => {
  it('should return 200 OK and service status', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toEqual('ok');
    expect(res.body.service).toEqual('SnapPass AI Backend');
  });
});
