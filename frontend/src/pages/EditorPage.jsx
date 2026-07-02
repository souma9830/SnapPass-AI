import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const EditorPage = () => {
  const { locale } = useLanguage();
  return (
    <div>
      <h1>Editor - Current Language: {locale}</h1>
    </div>
  );
};

export default EditorPage;