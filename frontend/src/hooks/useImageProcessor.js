/**
 * useImageProcessor — custom hook for AI processing state.
 *
 * Returns:
 *   { processImage, processedUrl, isProcessing, error, reset }
 *
 * TODO: Wire to real backend POST /api/process once available.
 */

import { useState, useCallback } from 'react';

function useImageProcessor() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedUrl, setProcessedUrl] = useState(null);
  const [error, setError]               = useState(null);

  const processImage = useCallback(async ({ filename, backgroundColour, photoSizePreset }) => {
    setIsProcessing(true);
    setError(null);

    try {
      // TODO: uncomment when backend + python-ai-service are running
      // const res = await fetch('/api/process', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ filename, backgroundColour, photoSizePreset }),
      // });
      // if (!res.ok) throw new Error('Processing failed');
      // const blob = await res.blob();
      // setProcessedUrl(URL.createObjectURL(blob));

      // Placeholder
      await new Promise((r) => setTimeout(r, 1500));
      setProcessedUrl(null); // replace with real URL
    } catch (err) {
      setError(err.message || 'Processing failed. Is the AI service running?');
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const reset = useCallback(() => {
    setProcessedUrl(null);
    setError(null);
  }, []);

  return { processImage, processedUrl, isProcessing, error, reset };
}

export default useImageProcessor;
