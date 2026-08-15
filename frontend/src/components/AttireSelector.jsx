import React, { useState, useMemo } from 'react';
import './AttireSelector.css';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations/translations';
import AttireAlignmentOverlay from './AttireAlignmentOverlay';

const ATTIRES = [
  { 
    id: 'none', 
    labelKey: 'attireNone', 
    category: 'all',
    emoji: '👕', 
    descEn: 'Keep original clothing', 
    descHi: 'मूल कपड़े रखें' 
  },
  { 
    id: 'male_suit', 
    labelKey: 'attireMaleSuit', 
    category: 'male',
    emoji: '👔', 
    descEn: 'Formal suit & tie', 
    descHi: 'औपचारिक सूट और टाई' 
  },
  { 
    id: 'female_blazer', 
    labelKey: 'attireFemaleBlazer', 
    category: 'female',
    emoji: '🧥', 
    descEn: 'Navy blazer & blouse', 
    descHi: 'नेवी ब्लेज़र और ब्लाउज़' 
  },
  { 
    id: 'male_bowtie', 
    labelKey: 'attireMaleBowtie', 
    category: 'male',
    emoji: '🤵', 
    descEn: 'Tuxedo & bowtie', 
    descHi: 'टक्सीडो और बो टाई' 
  },
  { 
    id: 'formal_shirt', 
    labelKey: 'attireFormalShirt', 
    category: 'formal',
    emoji: '👔', 
    descEn: 'White formal collared shirt', 
    descHi: 'सफेद फॉर्मल कॉलर वाली कमीज' 
  },
];

function AttireSelector({ selected = 'none', onChange }) {
  const { language } = useLanguage();
  const t = translations[language] || {};
  const [activeTab, setActiveTab] = useState('all');
  const [showGuide, setShowGuide] = useState(false);

  const filteredAttires = useMemo(() => {
    if (activeTab === 'all') return ATTIRES;
    return ATTIRES.filter((a) => a.category === activeTab || a.id === 'none');
  }, [activeTab]);

  return (
    <div className="attire-selector relative">
      <div className="attire-selector__header flex justify-between items-center mb-2">
        <div>
          <h3 className="attire-selector__title">{t.formalAttire || 'Formal Attire'}</h3>
          <p className="attire-selector__subtitle">{t.formalAttireSubtitle || 'Virtual fitting presets'}</p>
        </div>
        <button
          type="button"
          onClick={() => setShowGuide(!showGuide)}
          className={`text-xs px-2.5 py-1 rounded border transition-colors ${
            showGuide ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300'
          }`}
        >
          {showGuide ? 'Hide Guide' : 'Alignment Guide'}
        </button>
      </div>

      <AttireAlignmentOverlay visible={showGuide} />

      <div className="attire-selector__tabs" style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        {['all', 'male', 'female', 'formal'].map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActiveTab(category)}
            style={{
              padding: '4px 12px',
              borderRadius: '999px',
              border: '1px solid #cbd5e1',
              background: activeTab === category ? '#3b82f6' : 'transparent',
              color: activeTab === category ? '#ffffff' : '#64748b',
              fontSize: '0.8rem',
              cursor: 'pointer',
              textTransform: 'capitalize',
            }}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="attire-selector__grid" role="radiogroup" aria-label={t.formalAttire || 'Formal Attire'}>
        {filteredAttires.map(({ id, labelKey, emoji, descEn, descHi }) => {
          const isActive = selected === id;
          const desc = language === 'hi' ? descHi : descEn;
          return (
            <button
              key={id}
              className={`attire-card ${isActive ? 'attire-card--active' : ''}`}
              onClick={() => onChange && onChange(id)}
              role="radio"
              aria-checked={isActive}
              tabIndex={isActive ? 0 : -1}
              title={t[labelKey] || descEn}
            >
              <div className="attire-card__icon">{emoji}</div>
              <div className="attire-card__content">
                <span className="attire-card__label">{t[labelKey] || id}</span>
                <span className="attire-card__desc">{desc}</span>
              </div>
              {isActive && (
                <div className="attire-card__badge">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default AttireSelector;
