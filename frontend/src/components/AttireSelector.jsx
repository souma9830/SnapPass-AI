import React from 'react';
import './AttireSelector.css';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations/translations';

const ATTIRES = [
  { 
    id: 'none', 
    labelKey: 'attireNone', 
    emoji: '👕', 
    descEn: 'Keep original clothing', 
    descHi: 'मूल कपड़े रखें' 
  },
  { 
    id: 'male_suit', 
    labelKey: 'attireMaleSuit', 
    emoji: '👔', 
    descEn: 'Formal suit & tie', 
    descHi: 'औपचारिक सूट और टाई' 
  },
  { 
    id: 'female_blazer', 
    labelKey: 'attireFemaleBlazer', 
    emoji: '🧥', 
    descEn: 'Navy blazer & blouse', 
    descHi: 'नेवी ब्लेज़र और ब्लाउज़' 
  },
  { 
    id: 'male_bowtie', 
    labelKey: 'attireMaleBowtie', 
    emoji: '🤵', 
    descEn: 'Tuxedo & bowtie', 
    descHi: 'टक्सीडो और बो टाई' 
  },
];

function AttireSelector({ selected = 'none', onChange }) {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <div className="attire-selector">
      <div className="attire-selector__header">
        <h3 className="attire-selector__title">{t.formalAttire}</h3>
        <p className="attire-selector__subtitle">{t.formalAttireSubtitle}</p>
      </div>
      
      <div className="attire-selector__grid" role="radiogroup" aria-label={t.formalAttire}>
        {ATTIRES.map(({ id, labelKey, emoji, descEn, descHi }) => {
          const isActive = selected === id;
          const desc = language === 'hi' ? descHi : descEn;
          return (
            <button
              key={id}
              className={`attire-card ${isActive ? 'attire-card--active' : ''}`}
              onClick={() => onChange && onChange(id)}
              role="radio"
              aria-checked={isActive}
              title={t[labelKey]}
            >
              <div className="attire-card__icon">{emoji}</div>
              <div className="attire-card__content">
                <span className="attire-card__label">{t[labelKey]}</span>
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
