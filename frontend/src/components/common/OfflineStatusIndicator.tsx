import React, { useState, useEffect } from 'react';
import styles from './OfflineStatusIndicator.module.css';

export const OfflineStatusIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [pendingDraftsCount] = useState<number>(0);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline && pendingDraftsCount === 0) return null;

  return (
    <div className={`${styles.statusPill} ${isOnline ? styles.onlinePill : styles.offlinePill}`}>
      <span className={styles.dot} />
      <span>
        {isOnline
          ? `Online (${pendingDraftsCount} drafts synced)`
          : 'Offline Mode - Saving drafts to IndexedDB'}
      </span>
    </div>
  );
};
