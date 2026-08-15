/**
 * IndexedDB Service
 * Handles offline caching of processed passport photos, draft sessions, and export details.
 */

const DB_NAME = 'SnapPassOfflineDB';
const DB_VERSION = 2;
const STORE_NAME = 'photos';
const DRAFT_STORE = 'drafts';

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
      if (!db.objectStoreNames.contains(DRAFT_STORE)) {
        db.createObjectStore(DRAFT_STORE, { keyPath: 'draftId' });
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
        cachedAt: new Date().toISOString(),
      });

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.error('IndexedDB caching failed:', err);
  }
}

export async function saveOfflineDraft(draftId, draftData) {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([DRAFT_STORE], 'readwrite');
      const store = transaction.objectStore(DRAFT_STORE);
      const request = store.put({
        draftId,
        data: draftData,
        updatedAt: new Date().toISOString(),
      });

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.error('Failed to save offline draft:', err);
  }
}

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

export async function deleteCachedPhoto(id) {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    return false;
  }
}

export async function clearOfflineCache() {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME, DRAFT_STORE], 'readwrite');
      transaction.objectStore(STORE_NAME).clear();
      transaction.objectStore(DRAFT_STORE).clear();

      transaction.oncomplete = () => resolve(true);
      transaction.onerror = () => reject(transaction.error);
    });
  } catch (err) {
    console.error('Failed to clear IndexedDB cache:', err);
    return false;
  }
}

export default cachePhotoOffline;
