import { requestId } from '../requestId.middleware.js';

describe('RequestId Middleware', () => {
  test('attaches correlation ID to req and res headers', () => {
    const req = { headers: {} };
    const res = { setHeader: jest.fn() };
    const next = jest.fn();

    requestId(req, res, next);

    expect(req.correlationId).toBeDefined();
    expect(res.setHeader).toHaveBeenCalledWith('X-Correlation-ID', req.correlationId);
    expect(next).toHaveBeenCalled();
  });
});
