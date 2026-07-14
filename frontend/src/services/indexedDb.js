/**
 * IndexedDB Service
 * Handles offline caching of processed passport photos and details.
 */

const DB_NAME = 'SnapPassOfflineDB';
const DB_VERSION = 1;
const STORE_NAME = 'photos';

export function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.objectStoreStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

export async function cachePhotoOffline(photoData) {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.add({
        ...photoData,
        cachedAt: new Date().toISOString()
      });

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.error('IndexedDB caching failed:', err);
  }
}
export default cachePhotoOffline;
