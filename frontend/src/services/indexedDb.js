/**
 * IndexedDB Service
 * Handles offline caching of processed passport photos and details.
 */

const DB_NAME = 'SnapPassOfflineDB';
const DB_VERSION = 1;
const STORE_NAME = 'photos';

/**
 * Opens (or creates) the SnapPass offline IndexedDB database and resolves
 * with the database instance. The `photos` object store is created during
 * the initial upgrade if it does not already exist.
 * @returns {Promise<IDBDatabase>}
 */
export function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

/**
 * Persists a processed photo and its metadata in the offline cache.
 * Resolves with the generated record key, or logs and swallows the error
 * so offline caching never crashes the calling workflow.
 * @param {Object} photoData Photo details and processed data to cache.
 * @returns {Promise<number|undefined>}
 */
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

/**
 * Retrieves every cached photo record from the offline store.
 * Returns an empty array when the store is empty or unavailable.
 * @returns {Promise<Array>}
 */
export async function getAllCachedPhotos() {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.error('Failed to get cached photos from IndexedDB:', err);
    return [];
  }
}

/**
 * Empties the offline photo cache. Resolves `true` on success and `false`
 * when the store is unavailable or clearing fails.
 * @returns {Promise<boolean>}
 */
export async function clearOfflineCache() {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.error('Failed to clear IndexedDB cache:', err);
    return false;
  }
}

export default cachePhotoOffline;

