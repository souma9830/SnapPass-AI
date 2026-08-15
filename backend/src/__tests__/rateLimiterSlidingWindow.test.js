import { calculateSlidingWeight } from '../utils/slidingWindow.utils.js';
import { validateRateLimitQuery } from '../validation/rateLimitQuery.validation.js';

describe('Sliding Window Rate Limiting', () => {
  test('calculateSlidingWeight smoothly weights previous window count', () => {
    const weighted = calculateSlidingWeight(5, 10, 30000, 60000); // half through window
    expect(weighted).toBe(10); // 5 + 10 * 0.5 = 10
  });

  test('validateRateLimitQuery checks rate limit parameters', () => {
    expect(validateRateLimitQuery({ limit: '100' }).isValid).toBe(true);
    expect(validateRateLimitQuery({ limit: '-1' }).isValid).toBe(false);
  });
});
