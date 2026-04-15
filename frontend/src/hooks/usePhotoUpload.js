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
  const [uploadedFile, setUploadedFile] = useState(null); // { filename, fileUrl, localUrl }
  const [error, setError]               = useState(null);

  const uploadFile = useCallback(async (file) => {
    setIsUploading(true);
    setError(null);

    try {
      // Create local preview immediately
      const localUrl = URL.createObjectURL(file);

      // TODO: uncomment when backend is ready
      // const formData = new FormData();
      // formData.append('photo', file);
      // const res = await fetch('/api/upload', { method: 'POST', body: formData });
      // if (!res.ok) throw new Error('Upload failed');
      // const data = await res.json();
      // setUploadedFile({ ...data.data, localUrl });

      // Placeholder — simulate network delay
      await new Promise((r) => setTimeout(r, 600));
      setUploadedFile({ filename: file.name, fileUrl: localUrl, localUrl });
    } catch (err) {
      setError(err.message || 'Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setUploadedFile(null);
    setError(null);
  }, []);

  return { uploadFile, uploadedFile, isUploading, error, reset };
}

export default usePhotoUpload;
