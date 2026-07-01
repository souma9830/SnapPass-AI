import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Home, Search, Camera, AlertTriangle } from 'lucide-react';
import SEOMetadata from '../components/layout/SEOMetadata';
import './NotFoundPage.css';

function NotFoundPage({ darkMode }) {
  const location = useLocation();

  useEffect(() => {
    console.warn(`404: Page not found — ${location.pathname}`);
  }, [location.pathname]);

  const suggestions = [
    { path: '/', label: 'Home', icon: <Home size={18} /> },
    { path: '/upload', label: 'Upload Photo', icon: <Camera size={18} /> },
    { path: '/studio', label: 'Photo Studio', icon: <Search size={18} /> },
  ];

  return (
    <div className={`not-found-page ${darkMode ? 'not-found-page-dark' : ''}`}>
      <SEOMetadata title="Page Not Found" description="The page you are looking for does not exist or has been moved." />

      <div className="not-found-page__container">
        <div className="not-found-page__icon-wrapper" aria-hidden="true">
          <AlertTriangle size={48} className="not-found-page__icon" />
        </div>

        <h1 className="not-found-page__code">404</h1>
        <h2 className="not-found-page__title">Page Not Found</h2>
        <p className="not-found-page__description">
          The page <code className="not-found-page__path">{location.pathname}</code> does not exist
          or has been moved. It might have been removed, renamed, or is temporarily unavailable.
        </p>

        <div className="not-found-page__actions">
          <Link
            to="/"
            className="not-found-page__btn not-found-page__btn--primary"
          >
            <ArrowLeft size={18} />
            Go Home
          </Link>
          <button
            className={`not-found-page__btn not-found-page__btn--secondary ${darkMode ? 'not-found-page__btn--secondary-dark' : ''}`}
            onClick={() => window.history.back()}
          >
            Go Back
          </button>
        </div>

        <div className="not-found-page__suggestions">
          <h3 className="not-found-page__suggestions-title">Try These Pages</h3>
          <div className="not-found-page__suggestions-list">
            {suggestions.map(({ path, label, icon }) => (
              <Link
                key={path}
                to={path}
                className={`not-found-page__suggestion-link ${darkMode ? 'not-found-page__suggestion-link-dark' : ''}`}
              >
                <span className="not-found-page__suggestion-icon">{icon}</span>
                <span>{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
