/**
 * usePhotoUpload — custom hook that encapsulates the upload state machine.
 *
 * Returns:
 *   { uploadFile, uploadedFile, isUploading, error, reset }
 *
 * TODO: Replace the simulated delay with a real fetch to POST /api/upload.
 */

import { useState, useCallback } from 'react';

function usePhotoUpload() {
  const [isUploading, setIsUploading]   = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState(null); // { filename, fileUrl, localUrl }
  const [error, setError]               = useState(null);

  const uploadFile = useCallback(async (file) => {
    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      // Create local preview immediately
      const localUrl = URL.createObjectURL(file);

      // Simulate progress for placeholder
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      // TODO: uncomment when backend is ready
      // const xhr = new XMLHttpRequest();
      // xhr.upload.onprogress = (e) => {
      //   if (e.lengthComputable) {
      //     const progress = Math.round((e.loaded / e.total) * 100);
      //     setUploadProgress(progress);
      //   }
      // };
      // const formData = new FormData();
      // formData.append('photo', file);
      // xhr.open('POST', '/api/upload');
      // xhr.send(formData);

      // Placeholder — simulate network delay
      await new Promise((r) => setTimeout(r, 1000));
      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadedFile({ filename: file.name, fileUrl: localUrl, localUrl });
    } catch (err) {
      setError(err.message || 'Upload failed. Please try again.');
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setUploadedFile(null);
    setError(null);
  }, []);

  return { uploadFile, uploadedFile, isUploading, uploadProgress, error, reset };
}

export default usePhotoUpload;
