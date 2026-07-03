import React from 'react';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

const HomePage = () => {
  useDocumentMeta({
    title: 'SnapPass AI - Passport Photo Studio',
    description: 'Generate studio-quality passport photos with AI-powered background removal, face centering, and compliance checks.',
  });

  return (
    <main>
      <h1>SnapPass AI Photo Studio</h1>
    </main>
  );
};

export default HomePage;
