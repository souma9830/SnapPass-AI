import { cacheMiddleware } from '../cache.middleware.js';

const makeRes = (statusCode) => {
  const json = jest.fn(function (body) {
    return body;
  });
  return { statusCode, json };
};

describe('cacheMiddleware', () => {
  test('caches successful 2xx responses', async () => {
    const req = { method: 'GET', originalUrl: '/api/stats' };
    const res = makeRes(200);
    const next = jest.fn();

    const middleware = cacheMiddleware(60);
    await middleware(req, res, next);
    res.json({ data: 'ok' });

    const res2 = makeRes(200);
    const next2 = jest.fn();
    await middleware({ method: 'GET', originalUrl: '/api/stats' }, res2, next2);

    expect(next2).not.toHaveBeenCalled();
    expect(res2.json).toHaveBeenCalledWith({ data: 'ok' });
  });

  test('does not cache error responses with 4xx status', async () => {
    const req = { method: 'GET', originalUrl: '/api/invalid' };
    const res = makeRes(400);
    const next = jest.fn();

    const middleware = cacheMiddleware(60);
    await middleware(req, res, next);
    res.json({ error: 'validation failed' });

    const res2 = makeRes(200);
    const res2Json = res2.json;
    const next2 = jest.fn();
    await middleware({ method: 'GET', originalUrl: '/api/invalid' }, res2, next2);

    expect(next2).toHaveBeenCalled();
    expect(res2Json).not.toHaveBeenCalled();
  });

  test('does not cache error responses with 5xx status', async () => {
    const req = { method: 'GET', originalUrl: '/api/db-timeout' };
    const res = makeRes(500);
    const next = jest.fn();

    const middleware = cacheMiddleware(60);
    await middleware(req, res, next);
    res.json({ error: 'database timeout' });

    const res2 = makeRes(200);
    const res2Json = res2.json;
    const next2 = jest.fn();
    await middleware({ method: 'GET', originalUrl: '/api/db-timeout' }, res2, next2);

    expect(next2).toHaveBeenCalled();
    expect(res2Json).not.toHaveBeenCalled();
  });

  test('does not interfere with non-GET requests', async () => {
    const req = { method: 'POST', originalUrl: '/api/stats' };
    const res = makeRes(200);
    const next = jest.fn();

    const middleware = cacheMiddleware(60);
    await middleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
