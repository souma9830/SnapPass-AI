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
  const [error, setError] = useState(null);
  const processedUrlRef = useRef(null);

  const processImage = useCallback(async ({ filename, backgroundColour, photoSizePreset, attire }) => {
    setIsProcessing(true);
    setError(null);

    try {
      if (processedUrlRef.current) {
        URL.revokeObjectURL(processedUrlRef.current);
      }

      const blob = await processPhoto({ filename, backgroundColour, photoSizePreset, attire });

      // `processPhoto` uses axios { responseType: 'blob' }.
      // If the backend returns JSON errors, it may still arrive as a Blob.
      // Detect that case and surface a meaningful message.
      const contentType = blob?.type || '';
      const looksLikeJson = contentType.includes('application/json');

      if (looksLikeJson) {
        const text = await blob.text();
        try {
          const parsed = JSON.parse(text);
          const message = parsed?.message || parsed?.error?.message || 'Processing failed.';
          throw new Error(message);
        } catch {
          throw new Error(text || 'Processing failed.');
        }
      }

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
