/**
 * sessionAdapterFactory.js — Factory pattern builder for session adapters.
 */
import { MemorySessionAdapter } from './memorySessionAdapter.js';

export class SessionAdapterFactory {
  static getAdapter(type = 'memory') {
    if (type === 'memory') {
      return new MemorySessionAdapter();
    }
    return new MemorySessionAdapter();
  }
}
