import React, { useState, useEffect } from 'react';
import QuantityInput from '../components/QuantityInput';
import PrintButton from '../components/PrintButton';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { generateSheet } from '../services/photoService';
import { useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import QuantityInput from '../components/QuantityInput';
import PrintButton from '../components/PrintButton';
import './PrintPreviewPage.css';
import EmptyState from '../components/EmptyState';
import { calculatePasswordStrength } from '../utils/passwordStrength';

const PrintPreviewPage = () => {
  const { state } = useLocation();

  const [quantity, setQuantity] = useState(6);
  const [sheetUrl, setSheetUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [password, setPassword] = useState('');
  const [strength, setStrength] = useState(0);
  const [strengthLabel, setStrengthLabel] = useState('');

  useEffect(() => {
  const timer = setTimeout(() => {
    const result =
      calculatePasswordStrength(password);

    setStrength(result.score);
    setStrengthLabel(result.label);
  }, 100);

  return () => clearTimeout(timer);
}, [password]);

  const fetchSheet = async () => {
    setError(null);
    setLoading(true);
    try {
      const result = await generateSheet({
        processedId: state?.processedId,
        quantity,
      });
      setSheetUrl(result.sheetUrl);
    } catch (err) {
      setError(
        err.message || 'Failed to generate print sheet. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSheet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="page print-preview-page">
      <h1>Print Preview</h1>
      <p className="page__subtitle">
        Your A4 print-ready sheet is ready to download.
      </p>

      <ErrorMessage message={error} onRetry={fetchSheet} />

      {loading ? (
        <LoadingSpinner message="Generating your A4 print sheet..." />
      ) : (
        <>
          {sheetUrl && (
            <img
              className="print-preview__sheet"
              src={sheetUrl}
              alt="A4 passport photo print sheet"
            />
          )}
          <QuantityInput value={quantity} onChange={setQuantity} />
          <PrintButton
            sheetUrl={sheetUrl}
            onRegenerate={fetchSheet}
            disabled={!sheetUrl}

          <hr className="divider" />

          <div className="password-section">
  <label className="print-info-label">
    Secure Access Password
  </label>

  <input
    type="password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    placeholder="Enter secure password"
    className="password-input"
  />

  <div className="password-meter">
    <div
      className={`password-meter__fill ${
        strength <= 1
          ? 'password-meter__fill--weak'
          : strength === 2
          ? 'password-meter__fill--medium'
          : strength === 3
          ? 'password-meter__fill--strong'
          : 'password-meter__fill--excellent'
      }`}
      style={{
        width: `${(strength / 4) * 100}%`,
      }}
    />
  </div>

  <span
    aria-live="polite"
    className={`password-feedback ${
      strength <= 1
        ? 'password-feedback--weak'
        : strength === 2
        ? 'password-feedback--medium'
        : strength === 3
        ? 'password-feedback--strong'
        : 'password-feedback--excellent'
    }`}
  >
    {strengthLabel}
  </span>
</div>

          <PrintButton
            onClick={handleGenerateSheet}
            isLoading={isGenerating}
            disabled={isGenerating || strength === 0}
          />
        </>
      )}
    </div>
  );
};

export default PrintPreviewPage;
