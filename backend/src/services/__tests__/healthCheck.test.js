import { HealthCheckService } from '../healthCheck.service.js';

jest.mock('mongoose', () => ({
  connection: { readyState: 1 },
}));

jest.mock('../../config/redis.js', () => ({
  isRedisAvailable: () => true,
}));

describe('HealthCheckService', () => {
  it('returns UP when all dependencies are healthy', async () => {
    const result = await HealthCheckService.performReadinessCheck();
    expect(result.status).toBe('UP');
    expect(result.checks.mongodb).toBe('HEALTHY');
    expect(result.checks.redis).toBe('HEALTHY');
  });


  it('returns DEGRADED when MongoDB is unavailable', async () => {
    jest.doMock('mongoose', () => ({
      connection: { readyState: 0 },
    }));
    const result = await HealthCheckService.performReadinessCheck();
    expect(result.status).toBe('DEGRADED');
  });


  it('includes timestamp and checks in response', async () => {
    const result = await HealthCheckService.performReadinessCheck();
    expect(result).toHaveProperty('timestamp');
    expect(result).toHaveProperty('checks');
  });
});