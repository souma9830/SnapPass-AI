import { useState, useEffect, useCallback } from 'react';

const HISTORY_KEY = 'passport_history';

export const useHistory = () => {
  const [history, setHistory] = useState([]);

  const loadHistory = useCallback(() => {
    try {
      const data = localStorage.getItem(HISTORY_KEY);
      setHistory(data ? JSON.parse(data) : []);
    } catch {
      setHistory([]);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const deleteSession = useCallback((sessionId) => {
    try {
      const updated = history.filter((s) => s.id !== sessionId);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      setHistory(updated);
    } catch (e) {
      console.error('Failed to delete session:', e);
    }
  }, [history]);

  const clearHistory = useCallback(() => {
    try {
      localStorage.removeItem(HISTORY_KEY);
      setHistory([]);
    } catch (e) {
      console.error('Failed to clear history:', e);
    }
  }, []);

  return { history, deleteSession, clearHistory, reload: loadHistory };
};
