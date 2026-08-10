import React, { useEffect, useState } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AppRoutes from './routes/AppRoutes';
import SkipToContent from './components/SkipToContent';
import SnapPassAssistant from './chatbot/SnapPassAssistant';
import { ToastProvider, useToast } from './context/ToastContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { OfflineStatusIndicator } from './components/common/OfflineStatusIndicator';
import './App.css';
import ScrollToTopButton from './components/ScrollToTopButton';
import CookieConsentBanner from './components/cookie/CookieConsentBanner';
import { scanBackendPorts } from './services/portSync';


import ToastContainer from './components/ToastContainer';

import CustomCursor from './components/CustomCursor';
import KeyboardShortcutsModal from './components/KeyboardShortcutsModal';

function AppContent() {
  // Retrieve global visual and functional preferences from mounted contexts
  const { darkMode, toggleTheme } = useTheme();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const defaultCommands = [
    { id: 'c1', title: 'Go to Home', category: 'Navigation', iconEmoji: '🏠', hotkey: 'Ctrl+H', action: () => navigate('/') },
    { id: 'c2', title: 'Go to Photo Editor', category: 'Navigation', iconEmoji: '✏️', hotkey: 'Ctrl+E', action: () => navigate('/editor') },
    { id: 'c3', title: 'Go to Upload Page', category: 'Navigation', iconEmoji: '📤', action: () => navigate('/upload') },
    { id: 'c4', title: 'Go to Compliance Analytics', category: 'Navigation', iconEmoji: '📊', action: () => navigate('/analytics') },
    { id: 'c5', title: 'Go to Print Preview', category: 'Navigation', iconEmoji: '🖨️', action: () => navigate('/print-preview') },
    { id: 'c6', title: 'Toggle Light / Dark Mode', category: 'Settings', iconEmoji: '🌓', action: () => toggleTheme() },
  ];

  return (
    <div className="app-shell">
      <SkipToContent />
      <ToastContainer />
      <CustomCursor />
      <OfflineStatusIndicator />
      {/* Primary content area rendering child routes */}
      <Navbar darkMode={darkMode} toggleTheme={toggleTheme} />
      <main className="app-main" id="main-content" tabIndex={-1}>
        <AppRoutes darkMode={darkMode} toggleTheme={toggleTheme} />
      </main>
      <Footer darkMode={darkMode} />
      <SnapPassAssistant />
      <ScrollToTopButton />
      <CookieConsentBanner darkMode={darkMode} />
      <KeyboardShortcutsModal darkMode={darkMode} />
    </div>
  );
}

import { JobQueueProvider } from './context/JobQueueContext';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  // Mount primary application providers and routing controls
  return (
    <ErrorBoundary>
      <ToastProvider>
        <ThemeProvider>
          <ThemeCustomizerProvider>
            <JobQueueProvider>
              <AppContent />
            </JobQueueProvider>
          </ThemeCustomizerProvider>
        </ThemeProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
