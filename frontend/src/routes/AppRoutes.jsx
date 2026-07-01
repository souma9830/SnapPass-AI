import React, { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorBoundary from '../components/ErrorBoundary';
import ScrollToTop from './ScrollToTop';

const HomePage = lazy(() => import('../pages/HomePage'));
const UploadPage = lazy(() => import('../pages/UploadPage'));
const EditorPage = lazy(() => import('../pages/EditorPage'));
const PrintPreviewPage = lazy(() => import('../pages/PrintPreviewPage'));
const AdminDashboard = lazy(() => import('../pages/AdminDashboard'));
const TermsPage = lazy(() => import('../pages/TermsPage'));
const PrivacyPage = lazy(() => import('../pages/PrivacyPage'));
const PhotoStudio = lazy(() => import('../pages/PhotoStudio'));
const HistoryPage = lazy(() => import('../pages/HistoryPage'));
const SettingsPage = lazy(() => import('../pages/SettingsPage'));
const DiagnosticsPage = lazy(() => import('../pages/DiagnosticsPage'));
const PassportComparatorPage = lazy(
  () => import('../pages/PassportComparatorPage')
);
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

/**
 * AppRoutes — central route configuration for SnapPass AI.
 * Add new pages here so contributors can find all routes in one place.
 */
function AppRoutes({ darkMode, toggleTheme }) {
  const location = useLocation();

  return (
    <ErrorBoundary key={location.pathname}>
      <ScrollToTop />
      <Suspense fallback={<LoadingSpinner fullPage delayMs={250} />}>
        <Routes>
          <Route
            path="/"
            element={<HomePage darkMode={darkMode} toggleTheme={toggleTheme} />}
          />
          <Route
            path="/upload"
            element={
              <UploadPage darkMode={darkMode} toggleTheme={toggleTheme} />
            }
          />
          <Route
            path="/editor"
            element={
              <EditorPage darkMode={darkMode} toggleTheme={toggleTheme} />
            }
          />
          <Route
            path="/print-preview"
            element={
              <PrintPreviewPage darkMode={darkMode} toggleTheme={toggleTheme} />
            }
          />
          <Route
            path="/admin"
            element={
              <AdminDashboard darkMode={darkMode} toggleTheme={toggleTheme} />
            }
          />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/studio" element={<PhotoStudio />} />
          <Route
            path="/settings"
            element={
              <SettingsPage darkMode={darkMode} toggleTheme={toggleTheme} />
            }
          />
          <Route
            path="/diagnostics"
            element={
              <DiagnosticsPage darkMode={darkMode} />
            }
          />
          <Route
            path="/history"
            element={
              <HistoryPage darkMode={darkMode} toggleTheme={toggleTheme} />
            }
          />
          <Route
            path="/settings"
            element={
              <SettingsPage darkMode={darkMode} toggleTheme={toggleTheme} />
            }
          />
          <Route
            path="/compare-requirements"
            element={
              <PassportComparatorPage
                darkMode={darkMode}
                toggleTheme={toggleTheme}
              />
            }
          />
          {/* Fallback — 404 page for unknown routes */}
          <Route
            path="*"
            element={<NotFoundPage darkMode={darkMode} />}
          />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

export default AppRoutes;
