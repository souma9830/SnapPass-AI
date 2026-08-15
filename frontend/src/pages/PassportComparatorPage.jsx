import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PassportRequirementComparator from '../components/PassportRequirementComparator';
import SEOMetadata from '../components/layout/SEOMetadata';
import './PassportComparatorPage.css';

/**
 * PassportComparatorPage
 * Dedicated page for comparing passport and visa photo requirements across supported global standards.
 */
function PassportComparatorPage({ darkMode }) {
  useEffect(() => {
    const mainHeading = document.getElementById('comparator-heading');
    if (mainHeading) {
      mainHeading.focus();
    }
  }, []);

  return (
    <main
      id="main-comparator-content"
      tabIndex={-1}
      className={`passport-comparator-page ${darkMode ? 'dark-mode' : ''}`}
    >
      <SEOMetadata
        title="Global Passport Photo Requirement Comparator — SnapPass-AI"
        description="Compare official passport and visa photo requirements across countries, including dimensions, background colors, DPI, and head height ratios."
      />
      <div className="passport-comparator-page__container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
        <nav aria-label="Breadcrumb" style={{ marginBottom: '1rem', fontSize: '0.875rem', color: '#64748b' }}>
          <Link to="/" style={{ color: '#3b82f6', textDecoration: 'none' }}>Home</Link>
          <span style={{ margin: '0 8px' }}>/</span>
          <span aria-current="page">Passport Comparator</span>
        </nav>
        <PassportRequirementComparator />
      </div>
    </main>
  );
}

export default PassportComparatorPage;
