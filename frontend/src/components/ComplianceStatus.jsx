import React from 'react';
import './ComplianceStatus.css';

/**
 * Displays crop-related guidance and editing status.
 * Helps users review their framing adjustments before
 * continuing with passport photo generation.
 */
function ComplianceStatus({ cropData }) {
  return (
    <div className="compliance-status">
      <h3 className="compliance-status__title">Crop Adjustment Status</h3>

      <ul className="compliance-status__list">
        <li className="compliance-status__success">✓ Crop editor available</li>

        <li className="compliance-status__success">
          ✓ Adjustments saved automatically
        </li>

        <li className="compliance-status__success">
          ✓ Session recovery supported
        </li>

        <li className="compliance-status__warning">
          ⚠ Verify final framing before passport submission
        </li>
      </ul>

      {/* Surface the latest crop measurements so users can
          quickly verify their framing adjustments. */}
      {cropData && (
        <div className="compliance-status__details">
          <h4>Current Crop Values</h4>

          <div className="compliance-status__grid">
            <span>X: {Math.round(cropData.x || 0)}</span>
            <span>Y: {Math.round(cropData.y || 0)}</span>
            <span>Width: {Math.round(cropData.width || 0)}</span>
            <span>Height: {Math.round(cropData.height || 0)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default ComplianceStatus;
