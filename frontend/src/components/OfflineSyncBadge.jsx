import React from 'react';
import useNetworkMonitor from '../hooks/useNetworkMonitor';

/**
 * OfflineSyncBadge — Floating UI badge showing network status
 * and offline local draft caching indicator.
 */
export function OfflineSyncBadge({ pendingCount = 0 }) {
  const { isOnline } = useNetworkMonitor();

  if (isOnline && pendingCount === 0) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        padding: '0.3rem 0.75rem',
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: 600,
        backgroundColor: isOnline ? 'rgba(59, 130, 246, 0.15)' : 'rgba(245, 158, 11, 0.15)',
        color: isOnline ? '#60a5fa' : '#fbbf24',
        border: `1px solid ${isOnline ? 'rgba(59, 130, 246, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
      }}
    >
      <span
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: isOnline ? '#3b82f6' : '#f59e0b',
        }}
      />
      {isOnline
        ? `${pendingCount} Local Draft(s) Cached`
        : 'Offline Mode — Drafts Saved Locally'}
    </div>
  );
}

export default OfflineSyncBadge;
