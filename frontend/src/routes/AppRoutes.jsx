import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ErrorBoundary from '../components/ErrorBoundary';

import HomePage from '../pages/HomePage';
import UploadPage from '../pages/UploadPage';
import EditorPage from '../pages/EditorPage';
import PrintPreviewPage from '../pages/PrintPreviewPage';
import AdminDashboard from '../pages/AdminDashboard';

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ErrorBoundary>
            <HomePage />
          </ErrorBoundary>
        }
      />
      <Route
        path="/upload"
        element={
          <ErrorBoundary>
            <UploadPage />
          </ErrorBoundary>
        }
      />
      <Route
        path="/editor"
        element={
          <ErrorBoundary>
            <EditorPage />
          </ErrorBoundary>
        }
      />
      <Route
        path="/print-preview"
        element={
          <ErrorBoundary>
            <PrintPreviewPage />
          </ErrorBoundary>
        }
      />
        <Route
        path="/admin"
        element={
          <ErrorBoundary>
            <AdminDashboard />
          </ErrorBoundary>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
