const { formatLog } = require('../utils/telemetryLogFormatter');

describe('telemetryLogFormatter', () => {
    it('formats log', () => {
        const log = JSON.parse(formatLog('info', 'test'));
        expect(log.level).toBe('info');
    });
});