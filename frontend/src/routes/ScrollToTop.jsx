import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop — Resets the window scroll position whenever the route
 * pathname or search string changes, ensuring users land smoothly at the top
 * of a newly navigated page without build or layout shift issues.
 */
export function ScrollToTop({ behavior = 'auto' }) {
  const { pathname, search } = useLocation();

  useEffect(() => {
    try {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior,
      });
    } catch (err) {
      window.scrollTo(0, 0);
    }
  }, [pathname, search, behavior]);

  return null;
}

export default ScrollToTop;
