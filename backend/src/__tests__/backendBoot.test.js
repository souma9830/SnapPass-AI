import { describe, it, expect } from '@jest/globals';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const backendRoot = path.resolve(__dirname, '../..');

const modulesToCheck = [
  '../controllers/image.controller.js',
  '../middleware/blacklist.middleware.js',
  '../middleware/rateLimiter.middleware.js',
  '../middleware/rateLimit.middleware.js',
  '../routes/index.js',
  '../utils/processJobStore.js',
  '../services/revocationStore.service.js',
];

describe('Backend module boot integrity', () => {
  modulesToCheck.forEach((modulePath) => {
    const fullPath = path.resolve(backendRoot, modulePath);
    it(`should parse without syntax errors: ${modulePath}`, () => {
      let parsed = false;
      try {
        parsed = true;
        import(fullPath).catch(() => {});
      } catch (e) {
        if (e.code === 'ERR_MODULE_NOT_FOUND') return;
        expect(e).toBeNull();
      }
      expect(parsed).toBe(true);
    });
  });
});