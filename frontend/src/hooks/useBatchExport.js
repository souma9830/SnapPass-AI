import { useState, useCallback } from 'react';

export default function useBatchExport(options = {}) {
  const { defaultFilenamePrefix = 'snappass-batch' } = options;
  const [exporting, setExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const exportFiles = useCallback(async (filenames, customPrefix = defaultFilenamePrefix) => {
    if (!filenames || filenames.length === 0) return;
    setExporting(true);
    setExportProgress(10);
    setError(null);

    let attempts = 0;
    const maxAttempts = 2;

    while (attempts < maxAttempts) {
      try {
        attempts++;
        setExportProgress(30 + attempts * 10);
        const res = await fetch('/api/batch/export', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filenames }),
        });

        setExportProgress(75);
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.message || `Export failed (HTTP ${res.status})`);
        }

        const blob = await res.blob();
        setExportProgress(90);
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${customPrefix}-${Date.now()}.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        setExportProgress(100);
        setRetryCount(0);
        break;
      } catch (err) {
        if (attempts >= maxAttempts) {
          setError(err.message);
          setExportProgress(0);
          setRetryCount(attempts);
          throw err;
        }
      } finally {
        if (attempts >= maxAttempts) {
          setExporting(false);
        }
      }
    }
  }, [defaultFilenamePrefix]);

  const clearError = useCallback(() => {
    setError(null);
    setRetryCount(0);
  }, []);

  return { exportFiles, exporting, exportProgress, error, retryCount, clearError };
}
