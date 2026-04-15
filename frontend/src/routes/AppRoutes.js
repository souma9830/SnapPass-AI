import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import HomePage from '../pages/HomePage';
import UploadPage from '../pages/UploadPage';
import EditorPage from '../pages/EditorPage';
import PrintPreviewPage from '../pages/PrintPreviewPage';
import AdminDashboard from '../pages/AdminDashboard';

/**
 * AppRoutes — central route configuration for SnapPass AI.
 * Add new pages here so contributors can find all routes in one place.
 */
function AppRoutes() {
  return (
    <Routes>
      <Route path="/"             element={<HomePage />} />
      <Route path="/upload"       element={<UploadPage />} />
      <Route path="/editor"       element={<EditorPage />} />
      <Route path="/print-preview" element={<PrintPreviewPage />} />
      <Route path="/admin"        element={<AdminDashboard />} />
      {/* Fallback — redirect unknown paths to home */}
      <Route path="*"             element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
