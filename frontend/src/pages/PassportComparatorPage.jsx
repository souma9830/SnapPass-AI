import React from 'react';
import PassportRequirementComparator from '../components/PassportRequirementComparator';
import './PassportComparatorPage.css';

/**
 * PassportComparatorPage
 *
 * Dedicated page for comparing passport
 * and visa photo requirements across
 * supported country presets.
 */
function PassportComparatorPage() {
  return (
    <main className="passport-comparator-page">
      <div className="passport-comparator-page__container">
        <PassportRequirementComparator />
      </div>
    </main>
  );
}

export default PassportComparatorPage;
