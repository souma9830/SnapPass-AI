import { useEffect } from 'react';

const DEFAULT_TITLE = 'SnapPass AI - Passport Photo Studio';
const DEFAULT_DESCRIPTION = 'Generate studio-quality passport photos with AI-powered background removal, face centering, and compliance checks.';

/**
 * useDocumentMeta - updates document title and meta tags per route.
 *
 * @param {object} options
 * @param {string} options.title - Page title (appended with " | SnapPass AI" unless it already contains it)
 * @param {string} options.description - Meta description for the page
 */
export function useDocumentMeta({ title, description } = {}) {
  useEffect(() => {
    const prevTitle = document.title;

    if (title) {
      document.title = title.includes('SnapPass') ? title : `${title} | SnapPass AI`;
    }

    if (description) {
      const meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute('content', description);

      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute('content', description);
    }

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle && title) {
      ogTitle.setAttribute('content', title);
    }

    return () => {
      document.title = prevTitle;
    };
  }, [title, description]);
}

export default useDocumentMeta;
