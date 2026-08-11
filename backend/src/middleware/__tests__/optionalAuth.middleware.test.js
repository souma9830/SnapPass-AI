import { describe, it, expect, jest, beforeEach } from '@jest/globals';

jest.mock('../auth.middleware.js', () => ({
  __esModule: true,
  default: jest.fn((req, res, next) => next()),
}));

import authMiddleware from '../auth.middleware.js';
import optionallyAuthenticated from '../optionalAuth.middleware.js';
import { config } from '../../config/config.js';

describe('optionallyAuthenticated middleware', () => {
  const original = config.requireAuthForUploads;

  beforeEach(() => {
    authMiddleware.mockClear();
    config.requireAuthForUploads = false;
  });

  afterAll(() => {
    config.requireAuthForUploads = original;
  });

  it('passes through without auth when REQUIRE_AUTH_FOR_UPLOADS is off', async () => {
    const req = {};
    const res = {};
    const next = jest.fn();

    await optionallyAuthenticated(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(authMiddleware).not.toHaveBeenCalled();
  });

  it('delegates to authMiddleware when REQUIRE_AUTH_FOR_UPLOADS is on', async () => {
    config.requireAuthForUploads = true;

    const req = {};
    const res = {};
    const next = jest.fn();

    await optionallyAuthenticated(req, res, next);

    expect(authMiddleware).toHaveBeenCalledWith(req, res, next);
  });
});
