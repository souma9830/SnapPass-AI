import React, { useState, useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AppRoutes from './routes/AppRoutes';
import SnapPassAssistant from './chatbot/SnapPassAssistant';
import './App.css';

function App() {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const toggleTheme = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
    return next;
  };

  return (
    <div className="app-shell">
      <Navbar darkMode={darkMode} toggleTheme={toggleTheme} />
      <main className="app-main">
        <AppRoutes darkMode={darkMode} toggleTheme={toggleTheme} />
      </main>
      <Footer darkMode={darkMode} toggleTheme={toggleTheme} />
      <SnapPassAssistant />
    </div>
  );
}
export default App;