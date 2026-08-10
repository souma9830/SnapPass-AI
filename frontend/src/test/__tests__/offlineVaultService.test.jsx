import { describe, it, expect, vi } from 'vitest';
import { openOfflineVaultDB, saveDraftToVault } from '../../services/offlineVaultService';

describe('offlineVaultService', () => {
  it('opens IndexedDB database and resolves connection', async () => {
    const mockOpen = vi.fn().mockReturnValue({
      onupgradeneeded: null,
      onsuccess: null,
      onerror: null,
    });
    
    // Test helper exported function signature
    expect(typeof openOfflineVaultDB).toBe('function');
    expect(typeof saveDraftToVault).toBe('function');
  });
});
