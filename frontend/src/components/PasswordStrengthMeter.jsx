import React, { useMemo } from 'react';
import { getPasswordStrength } from '../utils/passwordEntropy';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations/translations';
import './PasswordStrengthMeter.css';

const TIER_CLASS = [
  'pwd-meter--empty',
  'pwd-meter--weak',
  'pwd-meter--medium',
  'pwd-meter--strong',
  'pwd-meter--excellent',
];

const PasswordStrengthMeter = ({ password = '' }) => {
  const { language } = useLanguage();
  const t = translations[language] || translations.en;
  const { score, entropy } = useMemo(() => getPasswordStrength(password), [password]);

  const percentage = Math.min(100, Math.round((score / 4) * 100));

  const label =
    score === 0
      ? ''
      : score === 1
        ? t.passwordWeak
        : score === 2
          ? t.passwordMedium
          : score === 3
            ? t.passwordStrong
            : t.passwordExcellent;

  return (
    <div
      className={`pwd-meter ${TIER_CLASS[score]}`}
      role="meter"
      aria-valuemin={0}
      aria-valuemax={4}
      aria-valuenow={score}
      aria-label={t.passwordStrengthLabel}
    >
      <div className="pwd-meter__track">
        <div className="pwd-meter__fill" style={{ width: `${percentage}%` }} />
      </div>
      <div className="pwd-meter__meta">
        <span className="pwd-meter__label" aria-live="polite">
          {label}
        </span>
        {score > 0 && (
          <span className="pwd-meter__entropy">
            {t.passwordEntropyLabel}: {entropy.toFixed(1)}
          </span>
        )}
      </div>
    </div>
  );
};

export default PasswordStrengthMeter;
