import React from 'react';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

const UploadPage = () => {
  useDocumentMeta({
    title: 'Upload Photo',
    description: 'Upload your passport photo for AI-powered processing and compliance verification.',
  });

  return (
    <div>
      <h1>Upload Passport Photo</h1>
    </div>
  );
};

export default UploadPage;
