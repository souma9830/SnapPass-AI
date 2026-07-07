import { useState, useCallback } from 'react';

export default function useBatchExport() {
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState(null);

  const exportFiles = useCallback(async (filenames) => {
    if (!filenames || filenames.length === 0) return;
    setExporting(true);
    setError(null);
    try {
      const res = await fetch('/api/batch/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filenames }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || `Export failed (HTTP ${res.status})`);
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `snappass-batch-${Date.now()}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setExporting(false);
    }
  }, []);

  return { exportFiles, exporting, error };
}
