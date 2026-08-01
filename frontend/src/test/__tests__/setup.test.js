import { describe, it, expect, beforeEach } from 'vitest';

describe('Vitest jsdom environment stubs (setup.js)', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  describe('localStorage mock', () => {
    it('persists values via setItem and retrieves them via getItem', () => {
      window.localStorage.setItem('theme', 'dark');
      window.localStorage.setItem('count', '42');
      expect(window.localStorage.getItem('theme')).toBe('dark');
      expect(window.localStorage.getItem('count')).toBe('42');
    });

    it('stores values as strings', () => {
      window.localStorage.setItem('num', 123);
      expect(window.localStorage.getItem('num')).toBe('123');
    });

    it('returns null for missing keys', () => {
      expect(window.localStorage.getItem('does-not-exist')).toBeNull();
    });

    it('supports removeItem', () => {
      window.localStorage.setItem('temp', 'value');
      window.localStorage.removeItem('temp');
      expect(window.localStorage.getItem('temp')).toBeNull();
    });

    it('supports clear and length', () => {
      window.localStorage.setItem('a', '1');
      window.localStorage.setItem('b', '2');
      expect(window.localStorage.length).toBe(2);
      window.localStorage.clear();
      expect(window.localStorage.length).toBe(0);
      expect(window.localStorage.getItem('a')).toBeNull();
    });

    it('supports key lookup by index', () => {
      window.localStorage.clear();
      window.localStorage.setItem('first', '1');
      window.localStorage.setItem('second', '2');
      const keys = [window.localStorage.key(0), window.localStorage.key(1)];
      expect(keys.sort()).toEqual(['first', 'second']);
      expect(window.localStorage.key(99)).toBeNull();
    });
  });

  describe('IntersectionObserver stub', () => {
    it('instantiates without throwing', () => {
      expect(() => new window.IntersectionObserver(() => {})).not.toThrow();
    });

    it('exposes no-op observe/unobserve/disconnect methods', () => {
      const observer = new window.IntersectionObserver(() => {});
      expect(typeof observer.observe).toBe('function');
      expect(typeof observer.unobserve).toBe('function');
      expect(typeof observer.disconnect).toBe('function');
      expect(() => observer.observe(document.body)).not.toThrow();
      expect(() => observer.unobserve(document.body)).not.toThrow();
      expect(() => observer.disconnect()).not.toThrow();
    });
  });

  describe('matchMedia stub', () => {
    it('returns a media query result object without throwing', () => {
      const mql = window.matchMedia('(max-width: 768px)');
      expect(mql).toBeDefined();
      expect(mql.media).toBe('(max-width: 768px)');
      expect(typeof mql.matches).toBe('boolean');
    });

    it('provides non-throwing listener management methods', () => {
      const mql = window.matchMedia('(min-width: 1024px)');
      expect(() => mql.addListener(() => {})).not.toThrow();
      expect(() => mql.removeListener(() => {})).not.toThrow();
      expect(() => mql.addEventListener('change', () => {})).not.toThrow();
      expect(() => mql.removeEventListener('change', () => {})).not.toThrow();
      expect(() => mql.dispatchEvent(new Event('change'))).not.toThrow();
    });
  });

  describe('scrollTo stub', () => {
    it('is callable without throwing', () => {
      expect(typeof window.scrollTo).toBe('function');
      expect(() => window.scrollTo({ top: 0, behavior: 'smooth' })).not.toThrow();
      expect(() => window.scrollTo(0, 0)).not.toThrow();
    });
  });
});
