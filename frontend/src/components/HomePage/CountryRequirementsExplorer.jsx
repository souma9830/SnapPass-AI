import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeUpVariant } from '../../animations/variants.js';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../translations/translations';
import { PASSPORT_REQUIREMENTS } from '../../data/passportRequirements';
import './CountryRequirementsExplorer.css';

function getHeadHeight(headRatio) {
  if (headRatio.includes('80')) return '75%';
  if (headRatio.includes('70')) return '65%';
  return '55%';
}

const CountryRequirementsExplorer = ({ darkMode }) => {
  const { language } = useLanguage();
  const t = translations[language];
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState(PASSPORT_REQUIREMENTS[0].id);

  const filteredCountries = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return PASSPORT_REQUIREMENTS;
    return PASSPORT_REQUIREMENTS.filter(
      (requirement) =>
        requirement.country.toLowerCase().includes(query) ||
        requirement.label.toLowerCase().includes(query) ||
        requirement.region.toLowerCase().includes(query)
    );
  }, [search]);

  const selected = useMemo(
    () => PASSPORT_REQUIREMENTS.find((requirement) => requirement.id === selectedId),
    [selectedId]
  );

  const specRows = selected
    ? [
        { key: 'dimensions', label: t.explorerDimensions, value: `${selected.width} × ${selected.height} mm (${selected.dpi} DPI)` },
        { key: 'background', label: t.explorerBackground, value: selected.background },
        { key: 'headRatio', label: t.explorerHeadRatio, value: selected.headRatio },
        { key: 'eyePosition', label: t.explorerEyePosition, value: selected.eyePosition },
        { key: 'expression', label: t.explorerExpression, value: selected.expressionRules },
        { key: 'accessories', label: t.explorerAccessories, value: selected.accessories },
        { key: 'printFormat', label: t.explorerPrintFormat, value: selected.printFormat },
      ]
    : [];

  return (
    <div
      className={`country-explorer ${darkMode ? 'country-explorer--dark' : ''}`}
      aria-labelledby="country-explorer-title"
    >
      <section className="country-explorer__section">
        <motion.div
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0.1}
        >
          <h2 id="country-explorer-title" className="section-title">
            {t.explorerTitle}
          </h2>
          <p className="section-subtitle">{t.explorerSubtitle}</p>
        </motion.div>

        <div className="country-explorer__layout">
          <div className="country-explorer__panel">
            <div className="country-explorer__search-wrapper">
              <span className="country-explorer__search-icon" aria-hidden="true">
                🔍
              </span>
              <input
                type="text"
                className="country-explorer__search"
                placeholder={t.explorerSearchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label={t.explorerSearchPlaceholder}
              />
              {search && (
                <button
                  type="button"
                  className="country-explorer__clear"
                  onClick={() => setSearch('')}
                  aria-label={t.explorerClearSearch}
                >
                  ✕
                </button>
              )}
            </div>

            <ul className="country-explorer__list" role="listbox" aria-label={t.explorerSelectCountry}>
              {filteredCountries.length === 0 ? (
                <li className="country-explorer__empty">{t.explorerNoResults}</li>
              ) : (
                filteredCountries.map((requirement) => (
                  <li key={requirement.id} role="option" aria-selected={requirement.id === selectedId}>
                    <button
                      type="button"
                      className={`country-explorer__item ${
                        requirement.id === selectedId ? 'country-explorer__item--active' : ''
                      }`}
                      onClick={() => setSelectedId(requirement.id)}
                      aria-pressed={requirement.id === selectedId}
                    >
                      <span className="country-explorer__flag" aria-hidden="true">
                        {requirement.flag}
                      </span>
                      <span className="country-explorer__country">{requirement.country}</span>
                      <span className="country-explorer__region">{requirement.region}</span>
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>

          <div className="country-explorer__card-wrap">
            <AnimatePresence mode="wait">
              {selected && (
                <motion.div
                  key={selected.id}
                  className="country-explorer__card"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.25 }}
                  role="region"
                  aria-label={`${selected.country} ${t.explorerTitle}`}
                >
                  <div className="country-explorer__card-header">
                    <span className="country-explorer__card-flag" aria-hidden="true">
                      {selected.flag}
                    </span>
                    <div>
                      <h3 className="country-explorer__card-title">{selected.country}</h3>
                      <p className="country-explorer__card-label">{selected.label}</p>
                    </div>
                    <span className="country-explorer__card-region">{selected.region}</span>
                  </div>

                  <div className="country-explorer__visual">
                    <div
                      className="country-explorer__frame"
                      style={{ aspectRatio: `${selected.width} / ${selected.height}` }}
                    >
                      <div
                        className="country-explorer__head"
                        style={{ height: getHeadHeight(selected.headRatio) }}
                      >
                        <span className="country-explorer__silhouette" aria-hidden="true">
                          👤
                        </span>
                      </div>
                    </div>
                    <p className="country-explorer__visual-dim">
                      {selected.width} × {selected.height} mm
                    </p>
                  </div>

                  <dl className="country-explorer__specs">
                    {specRows.map((row) => (
                      <div className="country-explorer__spec" key={row.key}>
                        <dt className="country-explorer__spec-label">{row.label}</dt>
                        <dd className="country-explorer__spec-value">{row.value}</dd>
                      </div>
                    ))}
                  </dl>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CountryRequirementsExplorer;
