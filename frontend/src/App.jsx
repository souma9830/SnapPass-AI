import React, { useState } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AppRoutes from './routes/AppRoutes';
import { ToastProvider } from './contexts/ToastContext';
import ToastContainer from './components/Toast/ToastContainer';
import './App.css';

function App() {
  const [darkMode, setDarkMode] = useState(false); 
  const toggleTheme = () => {
    setDarkMode(prev => !prev);
  };

  return (
    <ToastProvider>
      <div className="app-shell">
        <Navbar darkMode={darkMode} toggleTheme={toggleTheme} />
        <main className="app-main">
          <AppRoutes darkMode={darkMode} toggleTheme={toggleTheme} />
        </main>
        <Footer darkMode={darkMode} toggleTheme={toggleTheme} />
        <ToastContainer />
      </div>
    </ToastProvider>
  );
}

export default App;
