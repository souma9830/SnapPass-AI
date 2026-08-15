import { useState, useEffect, useCallback } from 'react';
import { cachePhotoOffline, getAllCachedPhotos, clearOfflineCache } from '../services/indexedDb';

export function useOfflineStorage() {
  const [cachedPhotos, setCachedPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPhotos = useCallback(async () => {
    setLoading(true);
    const photos = await getAllCachedPhotos();
    setCachedPhotos(photos);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  const savePhoto = useCallback(async (photoData) => {
    await cachePhotoOffline(photoData);
    await fetchPhotos();
  }, [fetchPhotos]);

  const clearAll = useCallback(async () => {
    await clearOfflineCache();
    setCachedPhotos([]);
  }, []);

  return {
    cachedPhotos,
    loading,
    savePhoto,
    clearAll,
    refresh: fetchPhotos,
  };
}

export default useOfflineStorage;
