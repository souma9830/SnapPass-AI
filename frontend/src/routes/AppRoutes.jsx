import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import DelayedFallback from '../components/DelayedFallback';
import RouteErrorBoundary from '../components/RouteErrorBoundary';

const HomePage = lazy(() => import('../pages/HomePage'));
const UploadPage = lazy(() => import('../pages/UploadPage'));
const EditorPage = lazy(() => import('../pages/EditorPage'));
const PrintPreviewPage = lazy(() => import('../pages/PrintPreviewPage'));
const AdminDashboard = lazy(() => import('../pages/AdminDashboard'));
const TermsPage = lazy(() => import('../pages/TermsPage'));
const PrivacyPage = lazy(() => import('../pages/PrivacyPage'));

/**
 * AppRoutes — central route configuration for SnapPass AI.
 * Add new pages here so contributors can find all routes in one place.
 */
function AppRoutes() {
  const location = useLocation();

  return (
    <RouteErrorBoundary key={location.pathname}>
      <Suspense fallback={<DelayedFallback delayMs={250} />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/editor" element={<EditorPage />} />
          <Route path="/print-preview" element={<PrintPreviewPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          {/* Fallback — redirect unknown paths to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </RouteErrorBoundary>
  );
}

export default AppRoutes;