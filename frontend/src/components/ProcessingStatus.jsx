import React, { useState, useEffect, useCallback } from 'react';
import './ProcessingStatus.css';

const STATUS_LABELS = {
  queued: 'Queued',
  processing: 'Processing...',
  done: 'Complete',
  failed: 'Failed',
};

const ProcessingStatus = ({ jobId, onStatusChange }) => {
  const [status, setStatus] = useState('queued');
  const [error, setError] = useState(null);
  const [pollCount, setPollCount] = useState(0);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch(`/api/process/job/${jobId}`);
      const json = await res.json();
      if (json.success) {
        setStatus(json.data.status);
        setError(json.data.error?.message || null);
        if (json.data.status === 'done' || json.data.status === 'failed') {
          onStatusChange?.(json.data.status, json.data);
          return true;
        }
      }
    } catch (err) {
      console.warn('[ProcessingStatus] Poll error:', err.message);
    }
    return false;
  }, [jobId, onStatusChange]);

  useEffect(() => {
    if (!jobId) return;
    const interval = setInterval(async () => {
      setPollCount((p) => p + 1);
      const done = await fetchStatus();
      if (done || pollCount >= 60) clearInterval(interval);
    }, 2000);
    return () => clearInterval(interval);
  }, [jobId, fetchStatus, pollCount]);

  return (
    <div
      className={`processing-status processing-status--${status}`}
      role="status"
      aria-live="polite"
    >
      <div className="processing-status__indicator" />
      <span className="processing-status__label">
        {STATUS_LABELS[status] || status}
      </span>
      {error && <span className="processing-status__error">{error}</span>}
    </div>
  );
};

export default ProcessingStatus;
