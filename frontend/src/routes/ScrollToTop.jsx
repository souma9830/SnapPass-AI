import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
/**
 * ScrollToTop — resets the window scroll position whenever the route
 * pathname or search string changes, so users always land at the top of
 * a newly navigated page.
 */
Export function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname, search]);

  return null;
}

export default ScrollToTop;
