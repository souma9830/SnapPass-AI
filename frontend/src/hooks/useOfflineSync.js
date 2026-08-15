import { useState, useEffect, useCallback } from 'react';
import { registerNetworkMonitor, getNetworkDetails } from '../utils/networkMonitor';
import { getAllCachedPhotos, clearOfflineCache } from '../services/indexedDb';

export const useOfflineSync = (onSyncComplete) => {
  const [networkState, setNetworkState] = useState(getNetworkDetails());
  const [syncStatus, setSyncStatus] = useState('idle'); // idle | syncing | synced | error
  const [pendingCount, setPendingCount] = useState(0);

  const checkPendingQueue = useCallback(async () => {
    const cached = await getAllCachedPhotos();
    setPendingCount(cached.length);
  }, []);

  const triggerSync = useCallback(async () => {
    if (!navigator.onLine || syncStatus === 'syncing') return;
    setSyncStatus('syncing');

    try {
      const cached = await getAllCachedPhotos();
      if (cached.length > 0) {
        // Sync pending drafts with server
        for (const item of cached) {
          await fetch('/api/photo/sync-draft', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item),
          }).catch(() => {});
        }
        await clearOfflineCache();
      }

      setPendingCount(0);
      setSyncStatus('synced');
      if (onSyncComplete) onSyncComplete();
    } catch (err) {
      setSyncStatus('error');
    }
  }, [syncStatus, onSyncComplete]);

  useEffect(() => {
    checkPendingQueue();

    const cleanup = registerNetworkMonitor(
      (details) => setNetworkState(details),
      async (details) => {
        setNetworkState(details);
        await triggerSync();
      }
    );

    return cleanup;
  }, [checkPendingQueue, triggerSync]);

  return {
    isOnline: networkState.online,
    networkDetails: networkState,
    syncStatus,
    pendingCount,
    triggerSync,
    checkPendingQueue,
  };
};