const limiter = require('../middleware/customRateLimiterMiddleware');

describe('customRateLimiterMiddleware', () => {
    it('exports middleware function', () => {
        expect(typeof limiter()).toBe('function');
    });
});