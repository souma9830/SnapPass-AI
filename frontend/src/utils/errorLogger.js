const LOG_KEY = 'error_log';

const MAX_ENTRIES = 50;

export function logError(error, context = {}) {
  try {
    const entry = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      message: error?.message || String(error),
      stack: error?.stack || null,
      context,
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : '',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
    };

    const existing = getErrorLog();
    existing.unshift(entry);
    localStorage.setItem(LOG_KEY, JSON.stringify(existing.slice(0, MAX_ENTRIES)));

    if (process.env.NODE_ENV === 'development') {
      console.groupCollapsed('[ErrorLogger]', entry.message);
      console.error(error);
      console.log('Context:', context);
      console.groupEnd();
    }

    return entry;
  } catch {
    // Fail silently — logger must never throw
  }
}

export function getErrorLog() {
  try {
    const data = localStorage.getItem(LOG_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function clearErrorLog() {
  try {
    localStorage.removeItem(LOG_KEY);
  } catch {
    // silent
  }
}
