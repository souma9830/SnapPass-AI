import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import DelayedFallback from '../components/DelayedFallback';
import RouteErrorBoundary from '../components/RouteErrorBoundary';

const HomePage = lazy(() => import('../pages/HomePage'));
const UploadPage = lazy(() => import('../pages/UploadPage'));
const EditorPage = lazy(() => import('../pages/EditorPage'));
const PrintPreviewPage = lazy(() => import('../pages/PrintPreviewPage'));
const AdminDashboard = lazy(() => import('../pages/AdminDashboard'));
const TermsPage = lazy(() => import('../pages/TermsPage'));
const PrivacyPage = lazy(() => import('../pages/PrivacyPage'));
const PhotoStudio = lazy(() => import('../pages/PhotoStudio'));
const HistoryPage = lazy(() => import('../pages/HistoryPage'));
const PassportComparatorPage = lazy(
  () => import('../pages/PassportComparatorPage')
);

/**
 * AppRoutes — central route configuration for SnapPass AI.
 * Add new pages here so contributors can find all routes in one place.
 */
function AppRoutes({ darkMode, toggleTheme }) {
  const location = useLocation();

  return (
    <RouteErrorBoundary key={location.pathname}>
      <AnimatePresence mode="wait">
        <Suspense fallback={<DelayedFallback delayMs={250} />}>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            style={{ width: '100%', minHeight: '100%' }}
          >
            <Routes location={location}>
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
            path="/history"
            element={
              <HistoryPage darkMode={darkMode} toggleTheme={toggleTheme} />
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
          {/* Fallback — redirect unknown paths to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </motion.div>
        </Suspense>
      </AnimatePresence>
    </RouteErrorBoundary>
  );
}

export default AppRoutes;
