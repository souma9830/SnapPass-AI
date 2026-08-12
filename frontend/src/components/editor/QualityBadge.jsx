import React from 'react';
import './QualityBadge.css';

export default function QualityBadge({ score }) {
  if (score === undefined || score === null) return null;

  return (
    <div className={`quality-score-badge ${score > 80 ? 'high' : 'medium'}`}>
      Matting Score: {score}%
    </div>
  );
}
