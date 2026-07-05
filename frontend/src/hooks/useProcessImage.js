import { useState, useRef, useCallback, useEffect } from 'react';

const POLL_INTERVAL = 1000;

export default function useProcessImage() {
  const [jobId, setJobId] = useState(null);
  const [status, setStatus] = useState('idle');
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState('');
  const [processedUrl, setProcessedUrl] = useState(null);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);

  const startProcessing = useCallback(async (payload) => {
    setStatus('queued');
    setProgress(0);
    setStage('Starting');
    setProcessedUrl(null);
    setError(null);

    try {
      const res = await fetch('/api/process/job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || `HTTP ${res.status}`);
      }
      const body = await res.json();
      if (!body.success) throw new Error(body.message || 'Failed to start job');
      setJobId(body.data.jobId);
      setStatus('processing');
      return body.data.jobId;
    } catch (err) {
      setStatus('failed');
      setError(err.message);
      throw err;
    }
  }, []);

  const pollJob = useCallback(async (id) => {
    try {
      const res = await fetch(`/api/process/job/${id}`);
      if (!res.ok) throw new Error('Poll failed');
      const body = await res.json();
      if (!body.success) throw new Error(body.message);

      const data = body.data;
      setProgress(data.progress ?? 0);
      setStage(data.stage ?? '');
      setStatus(data.status);

      if (data.status === 'done') {
        setProcessedUrl(data.processedUrl);
        setProgress(100);
        setStage('Complete');
        return true;
      }
      if (data.status === 'failed') {
        setError(data.error?.message || 'Processing failed');
        return true;
      }
      return false;
    } catch (err) {
      setError(err.message);
      return true;
    }
  }, []);

  useEffect(() => {
    if (!jobId || status === 'done' || status === 'failed' || status === 'idle') {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    const poll = async () => {
      const done = await pollJob(jobId);
      if (done && intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    poll();
    intervalRef.current = setInterval(poll, POLL_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [jobId, status, pollJob]);

  const reset = useCallback(() => {
    setJobId(null);
    setStatus('idle');
    setProgress(0);
    setStage('');
    setProcessedUrl(null);
    setError(null);
  }, []);

  return { jobId, status, progress, stage, processedUrl, error, startProcessing, reset };
}
