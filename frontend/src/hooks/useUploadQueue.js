import { useState, useCallback, useRef } from 'react';

export default function useUploadQueue() {
  const [queue, setQueue] = useState([]);
  const [activeCount, setActiveCount] = useState(0);
  const abortRef = useRef(null);

  const addToQueue = useCallback((files) => {
    const items = Array.from(files).map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      file,
      name: file.name,
      size: file.size,
      status: 'queued',
      progress: 0,
      error: null,
    }));
    setQueue((prev) => [...prev, ...items]);
    return items;
  }, []);

  const updateItem = useCallback((id, patch) => {
    setQueue((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }, []);

  const uploadItem = useCallback(async (item) => {
    updateItem(item.id, { status: 'uploading', progress: 0 });
    setActiveCount((prev) => prev + 1);

    try {
      const formData = new FormData();
      formData.append('file', item.file);

      const xhr = new XMLHttpRequest();
      abortRef.current = xhr;

      return new Promise((resolve, reject) => {
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const pct = Math.round((e.loaded / e.total) * 100);
            updateItem(item.id, { progress: pct });
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            updateItem(item.id, { status: 'done', progress: 100 });
            resolve();
          } else {
            const msg = `Upload failed (HTTP ${xhr.status})`;
            updateItem(item.id, { status: 'failed', error: msg });
            reject(new Error(msg));
          }
        });

        xhr.addEventListener('error', () => {
          const msg = 'Network error during upload';
          updateItem(item.id, { status: 'failed', error: msg });
          reject(new Error(msg));
        });

        xhr.addEventListener('abort', () => {
          updateItem(item.id, { status: 'cancelled' });
          reject(new Error('Upload cancelled'));
        });

        xhr.open('POST', '/api/upload');
        xhr.send(formData);
      });
    } catch (err) {
      if (item.status !== 'cancelled') {
        updateItem(item.id, { status: 'failed', error: err.message });
      }
    } finally {
      setActiveCount((prev) => Math.max(0, prev - 1));
    }
  }, [updateItem]);

  const processQueue = useCallback(async () => {
    setQueue((prev) => prev.map((item) =>
      item.status === 'queued' ? { ...item, status: 'queued' } : item
    ));

    const pending = queue.filter((item) => item.status === 'queued');
    for (const item of pending) {
      await uploadItem(item);
    }
  }, [queue, uploadItem]);

  const retryItem = useCallback((id) => {
    updateItem(id, { status: 'queued', progress: 0, error: null });
  }, [updateItem]);

  const removeItem = useCallback((id) => {
    setQueue((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearCompleted = useCallback(() => {
    setQueue((prev) => prev.filter((item) => item.status !== 'done'));
  }, []);

  const cancelAll = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
    }
    setQueue((prev) => prev.map((item) =>
      item.status === 'uploading' || item.status === 'queued'
        ? { ...item, status: 'cancelled' }
        : item
    ));
    setActiveCount(0);
  }, []);

  return {
    queue,
    activeCount,
    addToQueue,
    processQueue,
    retryItem,
    removeItem,
    clearCompleted,
    cancelAll,
  };
}
