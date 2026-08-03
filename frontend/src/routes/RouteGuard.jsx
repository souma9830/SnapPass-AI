import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useRouteGuard } from '../hooks/useRouteGuard';
import './RouteGuard.css';

export const RouteGuard = ({ children, requiredRole }) => {
  const { allowed, loading, isAuthenticated } = useRouteGuard(requiredRole);
  const location = useLocation();

  if (loading) {
    return <div className="route-guard-spinner" style={{ display: 'none' }} aria-hidden="true" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace state={{ from: location.pathname }} />;
  }

  if (!allowed) {
    return (
      <div className="route-guard-denied" role="alert">
        <div className="route-guard-denied__card">
          <h1 className="route-guard-denied__title">Access Denied</h1>
          <p className="route-guard-denied__message">
            You do not have permission to view this page. This area is restricted to administrators.
          </p>
          <Link to="/" className="route-guard-denied__link">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return children;
};

export default RouteGuard;
