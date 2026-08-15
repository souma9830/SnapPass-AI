import { renderHook, act } from '@testing-library/react';
import { useOfflineSync } from '../../hooks/useOfflineSync';
import * as indexedDbModule from '../../services/indexedDb';

jest.mock('../../services/indexedDb', () => ({
  getAllCachedPhotos: jest.fn().mockResolvedValue([{ id: 1, name: 'draft1.jpg' }]),
  clearOfflineCache: jest.fn().mockResolvedValue(true),
}));

describe('useOfflineSync', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('initializes with network status and checks pending queue', async () => {
    const { result } = renderHook(() => useOfflineSync());
    expect(result.current.isOnline).toBe(navigator.onLine);
    expect(result.current.syncStatus).toBe('idle');
  });

  test('triggers sync and clears cache on success', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ synced: true }) });
    const { result } = renderHook(() => useOfflineSync());

    await act(async () => {
      await result.current.triggerSync();
    });

    expect(indexedDbModule.clearOfflineCache).toHaveBeenCalled();
    expect(result.current.syncStatus).toBe('synced');
  });
});
