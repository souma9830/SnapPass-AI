import { useState, useCallback, useRef } from 'react';
import { compressImage } from '../utils/imageCompression';

const UPLOAD_CONCURRENCY = 3;

export const useBatchUpload = (options = {}) => {
  const { concurrency = UPLOAD_CONCURRENCY, compress = true, compressOptions = {} } = options;

  const [queue, setQueue] = useState([]);
  const [results, setResults] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState({ total: 0, completed: 0, failed: 0 });
  const abortRef = useRef(false);

  const addFiles = useCallback((files) => {
    const entries = Array.from(files).map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      file,
      status: 'queued',
      error: null,
    }));
    setQueue((prev) => [...prev, ...entries]);
    setResults((prev) => [...prev, ...entries]);
    setProgress((prev) => ({ ...prev, total: prev.total + entries.length }));
  }, []);

  const uploadSingle = async (entry, endpoint = '/api/upload') => {
    if (abortRef.current) return { ...entry, status: 'aborted' };

    setQueue((prev) => prev.map((e) => e.id === entry.id ? { ...e, status: 'processing' } : e));

    try {
      let file = entry.file;
      if (compress) {
        file = await compressImage(file, compressOptions);
      }

      const formData = new FormData();
      formData.append('photo', file);

      const res = await fetch(endpoint, { method: 'POST', body: formData });
      if (!res.ok) throw new Error(`Upload failed: ${res.statusText}`);

      const json = await res.json();

      setProgress((prev) => ({ ...prev, completed: prev.completed + 1 }));
      return { ...entry, status: 'done', response: json };
    } catch (err) {
      setProgress((prev) => ({ ...prev, failed: prev.failed + 1 }));
      return { ...entry, status: 'failed', error: err.message };
    }
  };

  const startUpload = useCallback(async (endpoint = '/api/upload') => {
    if (uploading || queue.length === 0) return;
    setUploading(true);
    abortRef.current = false;

    const pool = [];
    for (let i = 0; i < concurrency; i++) {
      pool.push((async () => {
        while (queue.length > 0 && !abortRef.current) {
          const entry = queue.shift();
          if (!entry) break;
          const result = await uploadSingle(entry, endpoint);
          setResults((prev) => prev.map((r) => r.id === result.id ? result : r));
        }
      })());
    }

    await Promise.all(pool);
    setUploading(false);
  }, [queue, uploading, concurrency, compress, compressOptions]);

  const abort = useCallback(() => {
    abortRef.current = true;
    setUploading(false);
  }, []);

  const reset = useCallback(() => {
    setQueue([]);
    setResults([]);
    setUploading(false);
    setProgress({ total: 0, completed: 0, failed: 0 });
    abortRef.current = false;
  }, []);

  return {
    addFiles,
    startUpload,
    abort,
    reset,
    results,
    uploading,
    progress,
    hasPending: results.some((r) => r.status === 'queued' || r.status === 'processing'),
  };
};
