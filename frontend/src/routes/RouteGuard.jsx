import React from 'react';
import { Navigate } from 'react-router-dom';
import { useRouteGuard } from '../hooks/useRouteGuard';

/**
 * RouteGuard Component
 *
 * Enforces role-based route authorization and authentication checks.
 * Redirects unauthenticated or unauthorized users to the landing page ("/").
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - Protected child components.
 * @param {string} [props.requiredRole] - Required user role string (e.g., "admin").
 * @param {React.ReactNode} [props.fallback] - Custom loading component during auth check.
 */
export const RouteGuard = ({ children, requiredRole, fallback }) => {
  const { allowed, loading } = useRouteGuard(requiredRole);

  if (loading) {
    return fallback ? (
      <>{fallback}</>
    ) : (
      <div
        className="route-guard-spinner"
        role="status"
        aria-busy="true"
        aria-label="Verifying authorization..."
        style={{ display: 'none' }}
      />
    );
  }

  if (!allowed) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RouteGuard;
