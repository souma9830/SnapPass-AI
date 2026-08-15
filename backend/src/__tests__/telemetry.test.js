import { TelemetryLogger } from '../utils/telemetryLogger.js';

describe('TelemetryLogger', () => {
  it('should format logEvent payload cleanly', () => {
    expect(() => TelemetryLogger.logEvent('test_event', { key: 'value' })).not.toThrow();
  });

  it('should format logError payload cleanly', () => {
    expect(() => TelemetryLogger.logError('test_error', new Error('test err'))).not.toThrow();
  });
});
