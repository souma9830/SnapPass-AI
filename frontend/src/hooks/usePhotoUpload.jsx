/**
 * usePhotoUpload — custom hook that encapsulates the upload state machine.
 *
 * Returns:
 *   { uploadFile, uploadedFile, isUploading, uploadProgress, uploadFileName, error, reset }
 *
 * TODO: Replace the simulated delay with a real fetch to POST /api/upload.
 */

import { useState, useCallback, useRef } from 'react';

function usePhotoUpload() {
  const [isUploading, setIsUploading]   = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadFileName, setUploadFileName] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null); // { filename, fileUrl, localUrl }
  const [error, setError]               = useState(null);
  const progressRef = useRef(null);

  const uploadFile = useCallback(async (file) => {
    setIsUploading(true);
    setUploadProgress(0);
    setUploadFileName(file.name);
    setError(null);

    try {
      // Create local preview immediately
      const localUrl = URL.createObjectURL(file);

      // Simulate realistic upload progress with variable speed
      // Fast at start, slows down in the middle, pauses near the end
      let current = 0;
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
      await new Promise((r) => setTimeout(r, 1800));
      clearInterval(progressRef.current);
      setUploadProgress(100);

      // Brief pause at 100% so the user sees the completion state
      await new Promise((r) => setTimeout(r, 500));

      setUploadedFile({ filename: file.name, fileUrl: localUrl, localUrl });
    } catch (err) {
      setError(err.message || 'Upload failed. Please try again.');
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
      setUploadFileName('');
      if (progressRef.current) clearInterval(progressRef.current);
    }
  }, []);

  const reset = useCallback(() => {
    setUploadedFile(null);
    setError(null);
    setUploadProgress(0);
    setUploadFileName('');
  }, []);

  return { uploadFile, uploadedFile, isUploading, uploadProgress, uploadFileName, error, reset };
}

export default usePhotoUpload;
