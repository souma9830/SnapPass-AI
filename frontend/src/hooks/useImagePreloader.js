import { useState, useEffect } from 'react';
import { preloadMultipleImages } from '../utils/imagePreloader.js';

export const useImagePreloader = (imageUrls) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    setLoaded(false);

    preloadMultipleImages(imageUrls).then(() => {
      if (active) setLoaded(true);
    });

    return () => {
      active = false;
    };
  }, [imageUrls]);

  return loaded;
};
