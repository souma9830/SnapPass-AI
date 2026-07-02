import { useState, useEffect } from 'react';

export const useHistory = () => {
  const [history, setHistory] = useState([]);
  useEffect(() => {
    const saved = localStorage.getItem('snappass_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);
  return { history };
};