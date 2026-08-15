import { SessionAdapterFactory } from '../services/adapters/sessionAdapterFactory.js';
import { validateSessionQuery } from '../validation/sessionQuery.validation.js';

describe('Session Storage Adapter Architecture', () => {
  test('SessionAdapterFactory instantiates memory adapter correctly', async () => {
    const adapter = SessionAdapterFactory.getAdapter('memory');
    await adapter.set('sess_123', { userId: 'u1' });
    const sess = await adapter.get('sess_123');
    expect(sess.userId).toBe('u1');
  });

  test('validateSessionQuery validates input session query parameters', () => {
    expect(validateSessionQuery({ sessionId: 'sess-abc' }).isValid).toBe(true);
    expect(validateSessionQuery({ sessionId: 123 }).isValid).toBe(false);
  });
});
