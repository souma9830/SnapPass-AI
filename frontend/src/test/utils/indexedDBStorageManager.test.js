import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useNetworkMonitor } from '../../hooks/useNetworkMonitor';

describe('IndexedDB and Network Monitor utilities', () => {
  it('initializes network monitor online status', () => {
    const { result } = renderHook(() => useNetworkMonitor());
    expect(typeof result.current.isOnline).toBe('boolean');
  });
});
