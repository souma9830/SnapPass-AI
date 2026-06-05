import React, { useMemo, useState } from 'react';
import './PassportRequirementComparator.css';
import { PASSPORT_REQUIREMENTS } from '../data/passportRequirements';

/**
 * PassportRequirementComparator
 *
 * Allows users to compare passport and visa photo
 * requirements across multiple country presets.
 */
function PassportRequirementComparator() {
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState(['35x45', '2x2in']);

  const filteredRequirements = useMemo(() => {
    return PASSPORT_REQUIREMENTS.filter((requirement) =>
      requirement.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const selectedRequirements = PASSPORT_REQUIREMENTS.filter((requirement) =>
    selectedIds.includes(requirement.id)
  );

  const handleSelection = (id) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  const getHeadHeight = (headRatio) => {
    if (headRatio.includes('80')) return '75%';
    if (headRatio.includes('70')) return '65%';
    return '55%';
  };

  return (
    <div className="passport-comparator">
      <h2 className="passport-comparator__title">
        Passport Requirement Comparator
      </h2>

      <p className="passport-comparator__description">
        Compare passport and visa photo requirements across supported country
        presets.
      </p>

      <div className="passport-comparator__search-wrapper">
        <input
          type="text"
          placeholder="Search country or document type..."
          className="passport-comparator__search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search country or document type"
        />
        {search && (
          <button 
            className="passport-comparator__clear-btn" 
            onClick={() => setSearch('')}
            aria-label="Clear search"
          >
            Clear
          </button>
        )}
      </div>

      <div className="passport-comparator__selection" role="group" aria-label="Select standards to compare">
        {filteredRequirements.length === 0 ? (
          <div className="passport-comparator__empty-state">
            No matching passport or visa standards found.
          </div>
        ) : (
          filteredRequirements.map((requirement) => (
            <label 
              key={requirement.id} 
              className="passport-comparator__checkbox"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                  e.preventDefault();
                  handleSelection(requirement.id);
                }
              }}
            >
              <input
                type="checkbox"
                checked={selectedIds.includes(requirement.id)}
                onChange={() => handleSelection(requirement.id)}
                tabIndex={-1}
              />
              {requirement.label}
            </label>
          ))
        )}
      </div>

      {selectedRequirements.length > 0 && (
        <div className="passport-comparator__table-wrapper">
          <table className="passport-comparator__table">
            <thead>
              <tr>
                <th>Country / Standard</th>
                <th>Dimensions</th>
                <th>DPI</th>
                <th>Background</th>
                <th>Head Size Ratio</th>
                <th>Eye Position</th>
              </tr>
            </thead>

            <tbody>
              {selectedRequirements.map((requirement) => (
                <tr key={requirement.id}>
                  <td>{requirement.label}</td>
                  <td>
                    {requirement.width} × {requirement.height} mm
                  </td>
                  <td>{requirement.dpi}</td>
                  <td>{requirement.background}</td>
                  <td>{requirement.headRatio}</td>
                  <td>{requirement.eyePosition}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedRequirements.length > 0 && (
        <section className="passport-comparator__preview-section">
          <h3 className="passport-comparator__preview-title">
            Visual Requirement Preview
          </h3>
          <div className="passport-comparator__preview-grid">
            {selectedRequirements.map((requirement) => (
              <div
                key={requirement.id}
                className="passport-comparator__preview-card"
              >
                <div
                  className="passport-comparator__preview-frame"
                  style={{
                    aspectRatio: `${requirement.width} / ${requirement.height}`,
                  }}
                >
                  <div
                    className="passport-comparator__preview-head"
                    style={{
                      height: getHeadHeight(requirement.headRatio),
                    }}
                  >
                    <div className="passport-comparator__preview-silhouette">
                      👤
                    </div>
                  </div>
                </div>
                <div className="passport-comparator__preview-info">
                  <h4 className="passport-comparator__preview-label">
                    {requirement.label}
                  </h4>
                  <p className="passport-comparator__preview-dimensions">
                    {requirement.width} × {requirement.height} mm
                  </p>
                  <p className="passport-comparator__preview-ratio">
                    Head Ratio: {requirement.headRatio}
                  </p>
                  <p className="passport-comparator__preview-eye">
                    Eye Position: {requirement.eyePosition}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default PassportRequirementComparator;
