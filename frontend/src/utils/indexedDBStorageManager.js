/**
 * indexedDBStorageManager.js
 * Promise-based IndexedDB wrapper for storing high-res passport photo drafts
 * locally with automatic schema upgrades and storage quota resilience.
 */

const DB_NAME = 'SnapPassOfflineDB';
const DB_VERSION = 1;
const DRAFT_STORE = 'photo_drafts';

export function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(DRAFT_STORE)) {
        const store = db.createObjectStore(DRAFT_STORE, { keyPath: 'id' });
        store.createIndex('timestamp', 'timestamp', { unique: false });
        store.createIndex('status', 'status', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function savePhotoDraft(draft) {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(DRAFT_STORE, 'readwrite');
    const store = tx.objectStore(DRAFT_STORE);
    const record = {
      id: draft.id || `draft_${Date.now()}`,
      dataUrl: draft.dataUrl,
      preset: draft.preset || '35x45',
      background: draft.background || 'white',
      timestamp: Date.now(),
      status: 'LOCAL_ONLY',
    };

    const req = store.put(record);
    req.onsuccess = () => resolve(record);
    req.onerror = () => reject(req.error);
  });
}

export async function getAllDrafts() {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(DRAFT_STORE, 'readonly');
    const store = tx.objectStore(DRAFT_STORE);
    const req = store.getAll();

    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

export default {
  openDatabase,
  savePhotoDraft,
  getAllDrafts,
};
