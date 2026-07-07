import { useState, useEffect } from 'react';

export const useRouteGuard = (requiredRole) => {
  const [state, setState] = useState({ allowed: true, loading: false });

  useEffect(() => {
    // Simple front-end authorization checker hook
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('user_role') || 'user';
    
    if (requiredRole && (!token || userRole !== requiredRole)) {
      setState({ allowed: false, loading: false });
    } else {
      setState({ allowed: true, loading: false });
    }
  }, [requiredRole]);

  return state;
};
