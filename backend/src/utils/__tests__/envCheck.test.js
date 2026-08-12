import { verifyEnvironment } from '../envCheck.js';
import logger from '../logger.js';

const KNOWN_DEFAULT = 'snappass_dev_secret_key_change_in_production';

const realEnv = { ...process.env };

describe('verifyEnvironment JWT secret hardening (#1448)', () => {
  afterEach(() => {
    process.env = { ...realEnv };
    jest.restoreAllMocks();
  });

  function envWith(base) {
    return {
      MONGO_URI: 'mongodb://test',
      RESEND_API_KEY: 'test',
      EMAIL_FROM: 'test@example.com',
      ...base,
    };
  }

  test('exits even in development when the repo-known default JWT secret is used', () => {
    process.env = envWith({ NODE_ENV: 'development', JWT_SECRET: KNOWN_DEFAULT });
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {});
    const warnSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    verifyEnvironment();

    expect(exitSpy).toHaveBeenCalledWith(1);
    warnSpy.mockRestore();
  });

  test('passes when a real, non-default JWT secret is configured', () => {
    process.env = envWith({ NODE_ENV: 'development', JWT_SECRET: 'a-real-random-secret' });
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {});

    verifyEnvironment();

    expect(exitSpy).not.toHaveBeenCalled();
    exitSpy.mockRestore();
  });

  test('exits outside production when JWT_SECRET is missing (fallback is public)', () => {
    process.env = envWith({ NODE_ENV: 'development' });
    delete process.env.JWT_SECRET;
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {});

    verifyEnvironment();

    expect(exitSpy).toHaveBeenCalledWith(1);
    exitSpy.mockRestore();
  });
});