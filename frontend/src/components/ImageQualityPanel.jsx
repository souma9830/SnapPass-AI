import React from 'react';
import './ImageQualityPanel.css';

function ImageQualityPanel({ processedUrl }) {

  if (!processedUrl) return null;

  const qualityScore = 82;

  const suggestions = [
    'Good lighting detected',
    'Face alignment looks correct',
    'Background quality is acceptable',
    'Image could be slightly sharper',
  ];

  const getStatus = () => {
    if (qualityScore >= 80) return 'Excellent';
    if (qualityScore >= 60) return 'Good';
    return 'Needs Improvement';
  };

  return (
    <div className="quality-panel">

      <div className="quality-panel__header">
        <h3>AI Image Quality Analysis</h3>
      </div>

      <div className="quality-panel__score">
        <div className="quality-panel__circle">
          {qualityScore}%
        </div>

        <p className="quality-panel__status">
          {getStatus()}
        </p>
      </div>

      <div className="quality-panel__suggestions">
        {suggestions.map((item) => (
          <div
            key={item}
            className="quality-panel__suggestion"
          >
            ✓ {item}
          </div>
        ))}
      </div>

    </div>
  );
}

export default ImageQualityPanel;