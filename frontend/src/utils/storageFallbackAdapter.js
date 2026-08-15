export class StorageFallbackAdapter {
  constructor() {
    this.memoryStore = new Map();
  }

  getItem(key) {
    return this.memoryStore.get(key) || null;
  }

  setItem(key, value) {
    this.memoryStore.set(key, String(value));
  }

  removeItem(key) {
    this.memoryStore.delete(key);
  }
}

export const memoryStorageFallback = new StorageFallbackAdapter();
