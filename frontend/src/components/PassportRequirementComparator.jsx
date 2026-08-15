import React, { useMemo, useState } from 'react';
import './PassportRequirementComparator.css';
import { PASSPORT_REQUIREMENTS } from '../data/passportRequirements';

function PassportRequirementComparator() {
  const [search, setSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedIds, setSelectedIds] = useState(['35x45', '2x2in']);

  const regions = ['All', 'Asia', 'Europe', 'Americas', 'Oceania'];

  const filteredRequirements = useMemo(() => {
    return PASSPORT_REQUIREMENTS.filter((requirement) => {
      const matchesSearch = requirement.label.toLowerCase().includes(search.toLowerCase());
      const matchesRegion = selectedRegion === 'All' || requirement.region === selectedRegion;
      return matchesSearch && matchesRegion;
    });
  }, [search, selectedRegion]);

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

  const selectAllFiltered = () => {
    const allFilteredIds = filteredRequirements.map((r) => r.id);
    setSelectedIds((prev) => Array.from(new Set([...prev, ...allFilteredIds])));
  };

  const clearAllSelections = () => {
    setSelectedIds([]);
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
        Compare passport and visa photo requirements across supported country presets and regions.
      </p>

      <div className="passport-comparator__filter-bar" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
        {regions.map((region) => (
          <button
            key={region}
            type="button"
            className={`passport-comparator__region-btn ${selectedRegion === region ? 'active' : ''}`}
            onClick={() => setSelectedRegion(region)}
            aria-pressed={selectedRegion === region}
          >
            {region}
          </button>
        ))}
      </div>

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

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.85rem' }}>
        <span>Showing {filteredRequirements.length} standard(s)</span>
        <div>
          <button type="button" onClick={selectAllFiltered} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', marginRight: '10px' }}>
            Select Filtered
          </button>
          <button type="button" onClick={clearAllSelections} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
            Clear Selection
          </button>
        </div>
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
              <span>{requirement.label}</span>
              <span className="passport-comparator__region-tag">{requirement.region}</span>
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
                <th>Rules & Expression</th>
              </tr>
            </thead>

            <tbody>
              {selectedRequirements.map((requirement) => (
                <tr key={requirement.id}>
                  <td><strong>{requirement.label}</strong></td>
                  <td>{requirement.width} × {requirement.height} mm</td>
                  <td>{requirement.dpi}</td>
                  <td>{requirement.background}</td>
                  <td>{requirement.headRatio}</td>
                  <td>{requirement.expressionRules || 'Standard'}</td>
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
                    Rules: {requirement.expressionRules || 'Standard'}
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
