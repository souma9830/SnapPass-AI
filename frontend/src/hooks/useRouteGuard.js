import { useState, useEffect } from 'react';

const readSession = (requiredRole) => {
  // Simple front-end authorization checker hook
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('user_role') || 'user';
  const isAuthenticated = Boolean(token);
  const allowed =
    !requiredRole || (isAuthenticated && userRole === requiredRole);
  return { allowed, loading: false, isAuthenticated, userRole };
};

export const useRouteGuard = (requiredRole) => {
  const [state, setState] = useState(() => readSession(requiredRole));

  useEffect(() => {
    setState(readSession(requiredRole));
  }, [requiredRole]);

  return state;
};
