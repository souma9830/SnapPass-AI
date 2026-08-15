import { memoryStorageFallback } from './storageFallbackAdapter';

export function safeLocalStorageSet(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (err) {
    memoryStorageFallback.setItem(key, value);
  }
}

export function safeLocalStorageGet(key) {
  try {
    return localStorage.getItem(key);
  } catch (err) {
    return memoryStorageFallback.getItem(key);
  }
}
