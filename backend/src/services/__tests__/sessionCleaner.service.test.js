import { cleanupExpiredInactiveSessions } from '../sessionCleaner.service.js';
import Session from '../../models/session.model.js';

describe('SessionCleaner Service', () => {
  test('deactivates inactive sessions older than window', async () => {
    const spy = jest.spyOn(Session, 'updateMany').mockResolvedValue({ modifiedCount: 3 });
    const res = await cleanupExpiredInactiveSessions(3600000);
    expect(res.success).toBe(true);
    expect(res.deactivatedCount).toBe(3);
    spy.mockRestore();
  });
});
