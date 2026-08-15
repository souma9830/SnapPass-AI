import React, { createContext, useContext, useState, useEffect } from 'react';
import { savePhotoDraft, getAllDrafts } from '../utils/indexedDBStorageManager';

const PhotoContext = createContext();

export function PhotoProvider({ children }) {
  const [currentPhoto, setCurrentPhoto] = useState(null);
  const [savedDrafts, setSavedDrafts] = useState([]);

  useEffect(() => {
    getAllDrafts()
      .then((drafts) => setSavedDrafts(drafts))
      .catch(() => {});
  }, []);

  const saveCurrentPhotoDraft = async (photoData) => {
    setCurrentPhoto(photoData);
    try {
      const saved = await savePhotoDraft(photoData);
      setSavedDrafts((prev) => [...prev, saved]);
    } catch (err) {
      console.warn('Failed to save photo draft to IndexedDB:', err);
    }
  };

  return (
    <PhotoContext.Provider
      value={{
        currentPhoto,
        setCurrentPhoto,
        savedDrafts,
        saveCurrentPhotoDraft,
      }}
    >
      {children}
    </PhotoContext.Provider>
  );
}

export function usePhotoContext() {
  return useContext(PhotoContext);
}

export default PhotoContext;
