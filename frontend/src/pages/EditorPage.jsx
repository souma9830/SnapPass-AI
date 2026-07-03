import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

const EditorPage = () => {
  const { locale } = useLanguage();
  useDocumentMeta({
    title: 'Photo Editor',
    description: 'Edit your passport photo with AI background removal, face centering, and color adjustments.',
  });

  return (
    <div>
      <h1>Editor - Current Language: {locale}</h1>
    </div>
  );
};

export default EditorPage;
