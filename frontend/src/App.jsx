import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AppRoutes from './routes/AppRoutes';
import SkipToContent from './components/SkipToContent';
import SnapPassAssistant from './chatbot/SnapPassAssistant';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import './App.css';
import ScrollToTopButton from './components/ScrollToTopButton';

function AppContent() {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <div className="app-shell">
      <Navbar darkMode={darkMode} toggleTheme={toggleTheme} />
      <SkipToContent />
      <main className="app-main" id="main-content" tabIndex={-1}>
        <AppRoutes darkMode={darkMode} toggleTheme={toggleTheme} />
      </main>
      <Footer darkMode={darkMode} toggleTheme={toggleTheme} />
      <SnapPassAssistant />
      <ScrollToTopButton />
    </div>
  );
}

function App() {
  // Mount primary application providers and routing controls
  return (
    <BrowserRouter>
      <ToastProvider>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
