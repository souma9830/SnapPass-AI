import React, { useState } from 'react';
import { ATTIRE_CATALOG, filterAttireByCategory } from '../utils/attireWardrobeCatalog';
import './AttireWardrobeSelector.css';

export default function AttireWardrobeSelector({ onSelectAttire }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedAttireId, setSelectedAttireId] = useState(ATTIRE_CATALOG[0].id);

  const items = filterAttireByCategory(selectedCategory);

  const handleSelect = (item) => {
    setSelectedAttireId(item.id);
    if (onSelectAttire) {
      onSelectAttire(item);
    }
  };

  return (
    <div className="wardrobe-selector-card" data-testid="wardrobe-selector">
      <div className="wardrobe-header">
        <h4>Formal Attire Virtual Studio</h4>
        <div className="category-filters">
          {['All', 'Male', 'Female'].map((cat) => (
            <button
              key={cat}
              className={`cat-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="attire-grid">
        {items.map((item) => (
          <div
            key={item.id}
            className={`attire-card ${selectedAttireId === item.id ? 'selected' : ''}`}
            onClick={() => handleSelect(item)}
            data-testid={`attire-item-${item.id}`}
          >
            <div className="attire-color-swatch" style={{ backgroundColor: item.color }} />
            <div className="attire-info">
              <span className="attire-name">{item.name}</span>
              <span className="attire-collar">{item.collarType}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
