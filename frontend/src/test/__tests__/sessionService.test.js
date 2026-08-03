import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../services/api', () => ({
  default: {
    get: vi.fn(),
    delete: vi.fn(),
    post: vi.fn(),
  },
}));

import api from '../../services/api';
import {
  fetchSessions,
  revokeSession,
  bulkRevokeSessions,
} from '../../services/sessionService';

describe('sessionService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches sessions through the shared api client', async () => {
    api.get.mockResolvedValue({
      data: { success: true, data: [{ _id: '1', ipAddress: '1.2.3.4' }] },
    });
    const body = await fetchSessions();
    expect(api.get).toHaveBeenCalledWith('/auth/sessions');
    expect(body.data).toHaveLength(1);
  });

  it('revokes a session through the shared api client', async () => {
    api.delete.mockResolvedValue({ data: { success: true } });
    await revokeSession('abc123');
    expect(api.delete).toHaveBeenCalledWith('/auth/sessions/abc123');
  });

  it('bulk revokes sessions with the selected ids', async () => {
    api.post.mockResolvedValue({ data: { success: true } });
    await bulkRevokeSessions(['a', 'b']);
    expect(api.post).toHaveBeenCalledWith('/auth/sessions/bulk-revoke', {
      sessionIds: ['a', 'b'],
    });
  });
});
