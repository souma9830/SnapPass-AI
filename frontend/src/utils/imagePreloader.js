// Utility to prefetch images into memory cache before rendering to avoid UI flashes
export const preloadImageSrc = (src) => {
  return new Promise((resolve, reject) => {
    if (!src) return resolve(null);
    const img = new Image();
    img.src = src;
    img.onload = () => resolve(src);
    img.onerror = (err) => reject(err);
  });
};

export const preloadMultipleImages = (sources) => {
  if (!Array.isArray(sources)) return Promise.resolve([]);
  return Promise.all(sources.map((src) => preloadImageSrc(src).catch(() => null)));
};
