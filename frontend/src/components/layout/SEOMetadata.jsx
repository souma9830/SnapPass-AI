import { useEffect } from 'react';

const DEFAULT_TITLE = 'SnapPass AI - Professional Passport Photos';
const DEFAULT_DESC = 'Create professional-grade, standard-compliant passport photos in seconds using AI background removal and face detection.';

function SEOMetadata({ title, description, lang = 'en' }) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title ? `${title} | SnapPass AI` : DEFAULT_TITLE;

    const setMeta = (name, content, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      const prev = el ? el.getAttribute('content') : '';
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
      return prev;
    };

    const prevDesc = setMeta('description', description || DEFAULT_DESC);
    const prevOgTitle = setMeta('og:title', title || DEFAULT_TITLE, true);
    const prevOgDesc = setMeta('og:description', description || DEFAULT_DESC, true);
    const prevOgUrl = setMeta('og:url', window.location.href, true);

    document.documentElement.setAttribute('lang', lang);

    return () => {
      document.title = prevTitle;
      setMeta('description', prevDesc);
      setMeta('og:title', prevOgTitle, true);
      setMeta('og:description', prevOgDesc, true);
      setMeta('og:url', prevOgUrl, true);
    };
  }, [title, description, lang]);

  return null;
}

export default SEOMetadata;
