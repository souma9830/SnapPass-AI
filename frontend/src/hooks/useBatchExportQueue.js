import { useState, useCallback } from 'react';

export function useBatchExportQueue() {
  const [queue, setQueue] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeItem, setActiveItem] = useState(null);

  const addToQueue = useCallback((items) => {
    const formatted = (Array.isArray(items) ? items : [items]).map((item) => ({
      id: item.id || `batch_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      title: item.title || item.name || 'Passport Photo Export',
      status: 'pending', // pending, processing, completed, error
      progress: 0,
      createdAt: new Date().toISOString(),
      data: item,
    }));

    setQueue((prev) => [...prev, ...formatted]);
  }, []);

  const removeFromQueue = useCallback((id) => {
    setQueue((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearCompleted = useCallback(() => {
    setQueue((prev) => prev.filter((item) => item.status !== 'completed'));
  }, []);

  const updateItemStatus = useCallback((id, status, progress = 0, errorMsg = null) => {
    setQueue((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            status,
            progress: Math.min(100, Math.max(0, progress)),
            error: errorMsg,
          };
        }
        return item;
      })
    );
  }, []);

  const retryFailed = useCallback((id) => {
    updateItemStatus(id, 'pending', 0, null);
  }, [updateItemStatus]);

  return {
    queue,
    isProcessing,
    activeItem,
    addToQueue,
    removeFromQueue,
    clearCompleted,
    updateItemStatus,
    retryFailed,
    setIsProcessing,
    setActiveItem,
  };
}
