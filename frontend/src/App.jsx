import React, { useState, useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AppRoutes from './routes/AppRoutes';
import SnapPassAssistant from './chatbot/SnapPassAssistant';
import { ToastProvider } from './context/ToastContext';
import './App.css';
import ScrollToTopButton from './components/ScrollToTopButton';

// bug-> when toggle is clicked , to change html over browser we need to alter dom
// documnet.documentElement.setAttribute('data-theme', next ? 'dark' : 'light');
// in a way we are telling the browser that the html element has a data attribute of theme with value dark or light
function App() {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        console.log("Keyboard shortcut triggered");
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const toggleTheme = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light');
    localStorage.setItem('theme', next ? 'dark' : 'light');
    return next; // this line was missing in the early code 
  }

  return (
    <ToastProvider>
      <div className="app-shell">
        <Navbar darkMode={darkMode} toggleTheme={toggleTheme} />
        <main className="app-main">
          <AppRoutes darkMode={darkMode} toggleTheme={toggleTheme} />
        </main>
        <Footer darkMode={darkMode} toggleTheme={toggleTheme} />
        <SnapPassAssistant />
        <ScrollToTopButton />
      </div>
    </ToastProvider>
  );
}
export default App;