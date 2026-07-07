import React from 'react';
import { Navigate } from 'react-router-dom';
import { useRouteGuard } from '../hooks/useRouteGuard';

export const RouteGuard = ({ children, requiredRole }) => {
  const { allowed, loading } = useRouteGuard(requiredRole);

  if (loading) {
    return <div className="route-guard-spinner" style={{ display: 'none' }} />;
  }

  if (!allowed) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RouteGuard;
