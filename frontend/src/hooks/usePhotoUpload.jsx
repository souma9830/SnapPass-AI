/**
 * usePhotoUpload — custom hook that encapsulates the upload state machine.
 *
 * Returns:
 *   { uploadFile, uploadedFile, isUploading, uploadProgress, uploadFileName, error, reset }
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { uploadPhoto } from '../services/photoService';

function usePhotoUpload() {
  const [isUploading, setIsUploading]   = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadFileName, setUploadFileName] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null); // { filename, fileUrl, localUrl }
  const [error, setError]               = useState(null);

  const localUrlRef = useRef(null);
  const progressRef = useRef(null);

  const uploadFile = useCallback(async (file) => {
    setIsUploading(true);
    setUploadProgress(0);
    setUploadFileName(file.name);
    setError(null);

    try {
      if (localUrlRef.current) {
        URL.revokeObjectURL(localUrlRef.current);
      }

      const localUrl = URL.createObjectURL(file);
      localUrlRef.current = localUrl;

      // Simulate realistic upload progress with variable speed
      // Fast at start, slows down in the middle, pauses near the end
      progressRef.current = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressRef.current);
            return 90;
          }
          // Variable increment: faster early, slower later
          let increment;
          if (prev < 30) {
            increment = Math.random() * 8 + 4;   // 4–12% jumps
          } else if (prev < 60) {
            increment = Math.random() * 5 + 2;   // 2–7% jumps
          } else {
            increment = Math.random() * 3 + 1;   // 1–4% jumps
          }
          return Math.min(prev + increment, 90);
        });
      }, 150);

      // Delegate to photoService which uses the configured axios api instance.
      const data = await uploadPhoto(file);
      
      clearInterval(progressRef.current);
      setUploadProgress(100);

      // Brief pause at 100% so the user sees the completion state
      await new Promise((r) => setTimeout(r, 500));

      const nextUploaded = { ...data, localUrl };
      setUploadedFile(nextUploaded);
      return nextUploaded;
    } catch (err) {
      const isNetworkError =
        err.message?.toLowerCase().includes('network') ||
        err.message?.toLowerCase().includes('failed to fetch') ||
        err.message?.toLowerCase().includes('err_connection_refused');

      setError(
        isNetworkError
          ? 'Could not reach the server. Please check your connection or try again later.'
          : err.message || 'Upload failed. Please try again.'
      );
      setUploadProgress(0);
      if (localUrlRef.current) {
        URL.revokeObjectURL(localUrlRef.current);
        localUrlRef.current = null;
      }
      throw err;
    } finally {
      setIsUploading(false);
      setUploadFileName('');
      if (progressRef.current) clearInterval(progressRef.current);
    }
  }, []);

  const reset = useCallback(() => {
    if (localUrlRef.current) {
      URL.revokeObjectURL(localUrlRef.current);
      localUrlRef.current = null;
    }
    setUploadedFile(null);
    setError(null);
    setUploadProgress(0);
    setUploadFileName('');
  }, []);

  useEffect(() => {
    return () => {
      if (localUrlRef.current) {
        URL.revokeObjectURL(localUrlRef.current);
      }
    };
  }, []);

  return { uploadFile, uploadedFile, isUploading, uploadProgress, uploadFileName, error, reset };
}

export default usePhotoUpload;
