import React, { useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AppRoutes from './routes/AppRoutes';
import SkipToContent from './components/SkipToContent';
import SnapPassAssistant from './chatbot/SnapPassAssistant';
import CookieConsentBanner from './components/CookieConsentBanner';
import { ToastProvider, useToast } from './context/ToastContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { ThemeCustomizerProvider } from './context/ThemeCustomizerContext';
import './App.css';
import ScrollToTopButton from './components/ScrollToTopButton';
import { scanBackendPorts } from './services/portSync';


function AppContent() {
  // Retrieve global visual and functional preferences from mounted contexts
  const { darkMode, toggleTheme } = useTheme();
  const { showToast } = useToast();

  useEffect(() => {
    if (import.meta.env.DEV) {
      scanBackendPorts().then((discoveredPort) => {
        if (discoveredPort) {
          showToast(`[PortSync] Connected to backend on port ${discoveredPort}`, 'success');
        }
      });
    }
  }, [showToast]);

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
      <CookieConsentBanner />
      <ScrollToTopButton />
    </div>
  );
}

import ErrorBoundary from './components/ErrorBoundary';

function App() {
  // Mount primary application providers and routing controls
  return (
    <ErrorBoundary>
      <ToastProvider>
        <ThemeProvider>
          <ThemeCustomizerProvider>
            <AppContent />
          </ThemeCustomizerProvider>
        </ThemeProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
