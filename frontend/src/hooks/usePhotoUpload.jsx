/**
 * usePhotoUpload — custom hook that encapsulates the upload state machine.
 *
 * Returns:
 *   { uploadFile, uploadedFile, isUploading, error, reset }
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { uploadPhoto } from '../services/photoService';


function usePhotoUpload() {
  const [isUploading, setIsUploading]   = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [error, setError]               = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const localUrlRef = useRef(null);

  const uploadFile = useCallback(async (file) => {
    setIsUploading(true);
    setUploadProgress(0);
    setError(null);
    setUploadProgress(0);
    try {
      if (localUrlRef.current) {
        URL.revokeObjectURL(localUrlRef.current);
      }

      const localUrl = URL.createObjectURL(file);
      localUrlRef.current = localUrl;

      // Delegate to photoService which uses the configured axios api instance.
      // VITE_API_URL controls the backend URL — no hardcoded localhost here.
      const data = await uploadPhoto(file, (percent) => setUploadProgress(percent));
      const nextUploaded = { ...data, localUrl };
      setUploadedFile(nextUploaded);
      setUploadProgress(100);
      return nextUploaded;
    } catch (err) {
      const status = err?.response?.status;
      const backendMessage = err?.response?.data?.message;
      const backendError = err?.response?.data?.error;

      const isUnsupportedFormat =
        status === 400 &&
        (backendMessage?.toLowerCase().includes('unsupported file format') ||
          backendError?.toLowerCase().includes('file rejected') ||
          backendMessage?.toLowerCase().includes('only jpeg') ||
          backendError?.toLowerCase().includes('magic bytes'));

      const isNetworkError =
        err.message?.toLowerCase().includes('network') ||
        err.message?.toLowerCase().includes('failed to fetch') ||
        err.message?.toLowerCase().includes('err_connection_refused');

      const isSizeExceeded =
        status === 413 &&
        (backendMessage?.toLowerCase().includes('too large') ||
          backendMessage?.toLowerCase().includes('file size') ||
          err.message?.toLowerCase().includes('request entity too large'));

      setError(
        isSizeExceeded
          ? 'File size exceeds the maximum allowed (10 MB). Please compress your image first.'
          : isUnsupportedFormat
            ? 'Unsupported file format. Please upload a JPG, PNG, or WEBP image.'
            : isNetworkError
              ? 'Could not reach the server. Please check your connection or try again later.'
              : backendMessage || backendError || err.message || 'Upload failed. Please try again.'
      );

      if (localUrlRef.current) {
        URL.revokeObjectURL(localUrlRef.current);
        localUrlRef.current = null;
      }
      setUploadProgress(0);
      throw err;
    } finally {
      setIsUploading(false);
    }
  }, []);



  const reset = useCallback(() => {
    if (localUrlRef.current) {
      URL.revokeObjectURL(localUrlRef.current);
      localUrlRef.current = null;
    }
    setUploadedFile(null);
    setError(null);
  }, []);

  useEffect(() => {
    return () => {
      if (localUrlRef.current) {
        URL.revokeObjectURL(localUrlRef.current);
      }
    };
  }, []);

  return { uploadFile, uploadedFile, isUploading, error, uploadProgress, reset };
}

export default usePhotoUpload;
