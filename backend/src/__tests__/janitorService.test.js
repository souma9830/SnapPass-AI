import { isFileExpired } from '../config/janitorPolicy.config.js';
import { validateJanitorQuery } from '../validation/janitorQuery.validation.js';

describe('Janitor Retention Policy & Query Validation', () => {
  test('isFileExpired correctly identifies files exceeding TTL threshold', () => {
    const oldTime = Date.now() - 48 * 60 * 60 * 1000;
    const recentTime = Date.now() - 1 * 60 * 60 * 1000;
    expect(isFileExpired(oldTime, 'tempUploadsMs')).toBe(true);
    expect(isFileExpired(recentTime, 'tempUploadsMs')).toBe(false);
  });

  test('validateJanitorQuery handles query validation', () => {
    expect(validateJanitorQuery({ maxAgeHours: '12', dryRun: 'true' }).isValid).toBe(true);
    expect(validateJanitorQuery({ maxAgeHours: '-5' }).isValid).toBe(false);
    expect(validateJanitorQuery({ dryRun: 'invalid' }).isValid).toBe(false);
  });
});
