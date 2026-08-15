import React, { useState } from 'react';
import { generateWatermarkSignature, verifySteganographySignature } from '../utils/steganographyWatermarkUtil';
import './SteganographyWatermarkCard.css';

export default function SteganographyWatermarkCard({ photoId }) {
  const [signature, setSignature] = useState('');
  const [isValid, setIsValid] = useState(null);

  const handleEmbed = () => {
    const sig = generateWatermarkSignature(photoId || 'sample_101');
    setSignature(sig);
    setIsValid(verifySteganographySignature(sig));
  };

  return (
    <div className="steganography-card" data-testid="steganography-card">
      <div className="card-header">
        <h4>Digital Steganography Protection</h4>
        <button className="embed-btn" onClick={handleEmbed} data-testid="embed-signature-btn">
          Embed Invisible Signature
        </button>
      </div>

      {signature && (
        <div className="signature-info" data-testid="signature-info">
          <span className="sig-text">{signature}</span>
          <span className={`sig-status ${isValid ? 'valid' : 'invalid'}`}>
            {isValid ? 'Authentic LSB Seal' : 'Tampered Data'}
          </span>
        </div>
      )}
    </div>
  );
}
