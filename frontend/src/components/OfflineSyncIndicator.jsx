import React from 'react';
import { useOfflineSyncQueue } from '../hooks/useOfflineSyncQueue';
import './OfflineSyncIndicator.css';

export default function OfflineSyncIndicator() {
  const { isOnline, pendingCount } = useOfflineSyncQueue();

  if (isOnline && pendingCount === 0) return null;

  return (
    <div
      className={`offline-sync-banner ${isOnline ? 'syncing' : 'offline'}`}
      data-testid="offline-sync-indicator"
    >
      <span className="indicator-dot"></span>
      <span className="indicator-text">
        {!isOnline
          ? `Offline Mode (${pendingCount} queued for sync)`
          : `Syncing ${pendingCount} offline item(s)...`}
      </span>
    </div>
  );
}
