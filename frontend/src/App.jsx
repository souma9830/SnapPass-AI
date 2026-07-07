import React from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AppRoutes from './routes/AppRoutes';
import SkipToContent from './components/SkipToContent';
import SnapPassAssistant from './chatbot/SnapPassAssistant';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import './App.css';
import ScrollToTopButton from './components/ScrollToTopButton';
import SkipToContent from './components/SkipToContent';

function AppContent() {
  // Retrieve global visual and functional preferences from mounted contexts
  const { darkMode, toggleTheme } = useTheme();

  return (
    <div className="app-shell">
      <SkipToContent />
      {/* Primary content area rendering child routes */}
      <Navbar darkMode={darkMode} toggleTheme={toggleTheme} />
      <main className="app-main" id="main-content" tabIndex={-1}>
        <AppRoutes darkMode={darkMode} toggleTheme={toggleTheme} />
      </main>
      <Footer darkMode={darkMode} />
      <SnapPassAssistant />
      <ScrollToTopButton />
    </div>
  );
}

function App() {
  // Mount primary application providers and routing controls
  return (
    <ToastProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </ToastProvider>
  );
}

export default App;
