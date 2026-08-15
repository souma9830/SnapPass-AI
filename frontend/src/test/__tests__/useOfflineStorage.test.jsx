import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useOfflineStorage } from '../../hooks/useOfflineStorage';

vi.mock('../../services/indexedDb', () => ({
  getAllCachedPhotos: vi.fn().mockResolvedValue([{ id: 1, filename: 'test.jpg' }]),
  cachePhotoOffline: vi.fn().mockResolvedValue(1),
  clearOfflineCache: vi.fn().mockResolvedValue(true),
}));

describe('useOfflineStorage Hook', () => {
  it('loads cached photos on mount', async () => {
    const { result } = renderHook(() => useOfflineStorage());
    await act(async () => {});
    expect(result.current.cachedPhotos.length).toBe(1);
    expect(result.current.cachedPhotos[0].filename).toBe('test.jpg');
  });
});
