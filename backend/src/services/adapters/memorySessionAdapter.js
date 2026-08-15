/**
 * memorySessionAdapter.js — Abstract in-memory session adapter implementation.
 */

const sessions = new Map();

export class MemorySessionAdapter {
  async set(sessionId, data) {
    sessions.set(sessionId, data);
    return true;
  }

  async get(sessionId) {
    return sessions.get(sessionId) || null;
  }

  async delete(sessionId) {
    return sessions.delete(sessionId);
  }

  async clear() {
    sessions.clear();
  }
}
