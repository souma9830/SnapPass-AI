export const cacheImage = (key, dataUrl) => {
  try {
    localStorage.setItem(key, dataUrl);
  } catch (err) {
    console.error('Storage error:', err);
  }
};