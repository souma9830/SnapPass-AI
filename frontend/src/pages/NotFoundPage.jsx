import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Home, Search, Camera, AlertTriangle, ExternalLink } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations/translations';
import SEOMetadata from '../components/layout/SEOMetadata';
import './NotFoundPage.css';

function NotFoundPage({ darkMode }) {
  const location = useLocation();
  const { language } = useLanguage();
  const t = translations[language];

  useEffect(() => {
    console.warn(`404: Page not found — ${location.pathname}`);
  }, [location.pathname]);

  const suggestions = [
    { path: '/', label: t.home || 'Home', icon: <Home size={18} /> },
    { path: '/upload', label: t.uploadPhoto || 'Upload Photo', icon: <Camera size={18} /> },
    { path: '/studio', label: t.photoStudio || 'Photo Studio', icon: <Search size={18} /> },
  ];

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (delay = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut', delay } }),
  };

  return (
    <div className={`not-found-page ${darkMode ? 'not-found-page-dark' : ''}`}>
      <SEOMetadata title="Page Not Found" description="The page you are looking for does not exist or has been moved." />

      <motion.div
        className="not-found-page__container"
        initial="hidden"
        animate="visible"
      >
        <motion.div className="not-found-page__icon-wrapper" aria-hidden="true" variants={fadeUp} custom={0}>
          <AlertTriangle size={48} className="not-found-page__icon" />
        </motion.div>

        <motion.h1 className="not-found-page__code" variants={fadeUp} custom={0.1}>
          404
        </motion.h1>

        <motion.h2 className="not-found-page__title" variants={fadeUp} custom={0.15}>
          {t.pageNotFound || 'Page Not Found'}
        </motion.h2>

        <motion.p className="not-found-page__description" variants={fadeUp} custom={0.2}>
          {t.pageNotFoundDesc || 'The page'}
          <code className="not-found-page__path">{location.pathname}</code>
          {t.pageNotFoundDoesNotExist || 'does not exist or has been moved.'}
        </motion.p>

        <motion.div className="not-found-page__actions" variants={fadeUp} custom={0.25}>
          <Link to="/" className="not-found-page__btn not-found-page__btn--primary">
            <ArrowLeft size={18} />
            {t.goHome || 'Go Home'}
          </Link>
          <button
            className={`not-found-page__btn not-found-page__btn--secondary ${darkMode ? 'not-found-page__btn--secondary-dark' : ''}`}
            onClick={() => window.history.back()}
          >
            {t.goBack || 'Go Back'}
          </button>
        </motion.div>

        <motion.div className="not-found-page__suggestions" variants={fadeUp} custom={0.3}>
          <h3 className="not-found-page__suggestions-title">
            {t.tryThesePages || 'Try These Pages'}
          </h3>
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
        </motion.div>

        <motion.div className="not-found-page__report" variants={fadeUp} custom={0.35}>
          <a
            href="https://github.com/Babin123456/SnapPass-AI/issues/new"
            target="_blank"
            rel="noopener noreferrer"
            className="not-found-page__report-link"
          >
            <ExternalLink size={14} />
            {t.reportIssue || 'Report this issue'}
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default NotFoundPage;
