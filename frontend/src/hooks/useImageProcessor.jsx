/**
 * useImageProcessor — custom hook for AI processing state.
 *
 * Returns:
 *   { processImage, processedUrl, isProcessing, error, reset }
 *
 * TODO: Wire to real backend POST /api/process once available.
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { processPhoto } from '../services/photoService';

function useImageProcessor() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedUrl, setProcessedUrl] = useState(null);
  const [error, setError]               = useState(null);
  const processedUrlRef = useRef(null);

  const processImage = useCallback(async ({ filename, backgroundColour, photoSizePreset }) => {
    setIsProcessing(true);
    setError(null);

    try {
      if (processedUrlRef.current) {
        URL.revokeObjectURL(processedUrlRef.current);
      }

      const blob = await processPhoto({ filename, backgroundColour, photoSizePreset });
      const url = URL.createObjectURL(blob);
      processedUrlRef.current = url;
      setProcessedUrl(url);
      return url;
    } catch (err) {
      setError(err.message || 'Processing failed. Is the AI service running?');
      if (processedUrlRef.current) {
        URL.revokeObjectURL(processedUrlRef.current);
        processedUrlRef.current = null;
      }
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const reset = useCallback(() => {
    if (processedUrlRef.current) {
      URL.revokeObjectURL(processedUrlRef.current);
      processedUrlRef.current = null;
    }
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
