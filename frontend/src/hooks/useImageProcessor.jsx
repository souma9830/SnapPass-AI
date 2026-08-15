/**
 * useImageProcessor — custom hook for AI processing state.
 *
 * Returns:
 *   { processImage, processedUrl, isProcessing, error, reset }
 *
 * TODO: Updated to real backend async preview endpoints.
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import api from '../services/api';


function useImageProcessor() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedUrl, setProcessedUrl] = useState(null);
  const [error, setError] = useState(null);
  const processedUrlRef = useRef(null);

  const processImage = useCallback(async ({ filename, backgroundColour, photoSizePreset, attire }) => {
    setIsProcessing(true);
    setError(null);

    try {
      if (processedUrlRef.current?.startsWith('blob:')) {
        URL.revokeObjectURL(processedUrlRef.current);
      }
      processedUrlRef.current = null;
      setProcessedUrl(null);

      // 1) Start async job
      const startResp = await api.post('/process/job', {
        filename,
        backgroundColour,
        photoSizePreset,
        attire,
      });

      const jobId = startResp?.data?.data?.jobId;
      if (!jobId) throw new Error('Failed to start AI processing.');

      // 2) Poll until done
      const pollIntervalMs = 1000;
      // Safety timeout ~2 minutes
      const timeoutMs = 120000;
      const startTs = Date.now();

      while (true) {
        if (Date.now() - startTs > timeoutMs) {
          throw new Error('Processing timed out. Please try again.');
        }

        const statusResp = await api.get(`/process/job/${jobId}`);
        const statusData = statusResp?.data?.data;

        if (!statusData) throw new Error('Invalid status response.');

        if (statusData.status === 'done') {
          const nextUrl = statusData.processedUrl;
          if (!nextUrl) throw new Error('Processed image is missing.');
          processedUrlRef.current = nextUrl;
          setProcessedUrl(nextUrl);
          return nextUrl;
        }

        if (statusData.status === 'failed') {
          throw new Error(statusData.error?.message || 'Processing failed.');
        }

        // queued | processing
        await new Promise((r) => setTimeout(r, pollIntervalMs));
      }
    } catch (err) {
      setError(err.message || 'Processing failed. Is the AI service running?');
      // No object URL cleanup here (we now use server URLs)
      processedUrlRef.current = null;
      setProcessedUrl(null);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, []);


  const reset = useCallback(() => {
    if (processedUrlRef.current?.startsWith('blob:')) {
      URL.revokeObjectURL(processedUrlRef.current);
    }
    processedUrlRef.current = null;
    setProcessedUrl(null);
    setError(null);
  }, []);

  useEffect(() => {
    return () => {
      if (processedUrlRef.current) {
        URL.revokeObjectURL(processedUrlRef.current);
      }
    };
  }, []);

  return { processImage, processedUrl, isProcessing, error, reset };
}

export default useImageProcessor;
