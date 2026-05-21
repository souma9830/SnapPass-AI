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
  const [uploadedFile, setUploadedFile] = useState(null); // { filename, fileUrl, localUrl }
  const [error, setError]               = useState(null);
  const localUrlRef = useRef(null);

  const uploadFile = useCallback(async (file) => {
    setIsUploading(true);
    setError(null);

    try {
      if (localUrlRef.current) {
        URL.revokeObjectURL(localUrlRef.current);
      }

      const localUrl = URL.createObjectURL(file);
      localUrlRef.current = localUrl;

      // Delegate to photoService which uses the configured axios api instance.
      // VITE_API_URL controls the backend URL — no hardcoded localhost here.
      const data = await uploadPhoto(file);
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
      if (localUrlRef.current) {
        URL.revokeObjectURL(localUrlRef.current);
        localUrlRef.current = null;
      }
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

  return { uploadFile, uploadedFile, isUploading, error, reset };
}

export default usePhotoUpload;
