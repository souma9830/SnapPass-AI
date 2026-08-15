// In-memory cache for preloaded image sources
const preloadedCache = new Map();

export const preloadImageSrc = (src, timeoutMs = 5000) => {
  return new Promise((resolve, reject) => {
    if (!src) return resolve(null);

    if (preloadedCache.has(src)) {
      return resolve(src);
    }

    const img = new Image();
    let timer = null;

    const cleanup = () => {
      if (timer) clearTimeout(timer);
      img.onload = null;
      img.onerror = null;
    };

    timer = setTimeout(() => {
      cleanup();
      reject(new Error(`Image preload timeout (${timeoutMs}ms)`));
    }, timeoutMs);

    img.onload = () => {
      cleanup();
      preloadedCache.set(src, true);
      resolve(src);
    };

    img.onerror = (err) => {
      cleanup();
      reject(err);
    };

    img.src = src;
  });
};

export const preloadMultipleImages = (sources, timeoutMs = 5000) => {
  if (!Array.isArray(sources)) return Promise.resolve([]);
  return Promise.all(
    sources.map((src) => preloadImageSrc(src, timeoutMs).catch(() => null))
  );
};

export const clearPreloadCache = () => {
  preloadedCache.clear();
};
