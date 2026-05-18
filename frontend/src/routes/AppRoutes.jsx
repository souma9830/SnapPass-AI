import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DelayedFallback from '../components/DelayedFallback';
import RouteErrorBoundary from '../components/RouteErrorBoundary';

const HomePage = lazy(() => import('../pages/HomePage'));
const UploadPage = lazy(() => import('../pages/UploadPage'));
const EditorPage = lazy(() => import('../pages/EditorPage'));
const PrintPreviewPage = lazy(() => import('../pages/PrintPreviewPage'));
const AdminDashboard = lazy(() => import('../pages/AdminDashboard'));

/**
 * AppRoutes — central route configuration for SnapPass AI.
 * Add new pages here so contributors can find all routes in one place.
 */
function AppRoutes({darkMode, toggleTheme}) {
  return (
    <RouteErrorBoundary>
      <Suspense fallback={<DelayedFallback delayMs={250} />}>
        <Routes>
          <Route path="/" element={<HomePage darkMode={darkMode} toggleTheme={toggleTheme}/>} />
          <Route path="/upload"       element={<UploadPage />} />
          <Route path="/editor"       element={<EditorPage />} />
          <Route path="/print-preview" element={<PrintPreviewPage />} />
          <Route path="/admin"        element={<AdminDashboard />} />
          {/* Fallback — redirect unknown paths to home */}
          <Route path="*"             element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </RouteErrorBoundary>
  );
}

export default AppRoutes;
