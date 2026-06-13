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

  if (!file) {
    setIsUploading(false);
    setError('No file selected.');
    return;
  }

  setIsUploading(true);
  setError(null);

  try {

    if (localUrlRef.current) {
      URL.revokeObjectURL(localUrlRef.current);
    }

    const validTypes = [
      'image/jpeg',
      'image/png',
      'image/webp'
    ];

    if (!validTypes.includes(file.type)) {

      setError(
        'Unsupported file format. Please upload JPG, PNG, or WEBP images.'
      );

      return;
    }

    const localUrl = URL.createObjectURL(file);

    localUrlRef.current = localUrl;

    const data = await uploadPhoto(file);

    const nextUploaded = {
      ...data,
      localUrl
    };

    setUploadedFile(nextUploaded);

    return nextUploaded;

  } catch (err) {

    console.error(err);

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
