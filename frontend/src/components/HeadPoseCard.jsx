import React from 'react';
import { calculateHeadPose } from '../utils/headPoseEstimator';
import './HeadPoseCard.css';

export default function HeadPoseCard({ landmarks }) {
  const pose = calculateHeadPose(landmarks);

  return (
    <div className="head-pose-card" data-testid="head-pose-card">
      <div className="head-pose-header">
        <h4 className="head-pose-title">ICAO Head Pose Orientation</h4>
        <span className={`pose-status-badge ${pose.isCompliant ? 'compliant' : 'non-compliant'}`}>
          {pose.isCompliant ? 'Compliant (Frontal)' : 'Pose Warning'}
        </span>
      </div>

      <div className="pose-metrics-grid">
        <div className="pose-metric-item">
          <span className="metric-label">Yaw (Left/Right)</span>
          <span className={`metric-value ${Math.abs(pose.yaw) > 5 ? 'error' : 'ok'}`}>
            {pose.yaw > 0 ? `+${pose.yaw}°` : `${pose.yaw}°`}
          </span>
        </div>

        <div className="pose-metric-item">
          <span className="metric-label">Pitch (Up/Down)</span>
          <span className={`metric-value ${Math.abs(pose.pitch) > 5 ? 'error' : 'ok'}`}>
            {pose.pitch > 0 ? `+${pose.pitch}°` : `${pose.pitch}°`}
          </span>
        </div>

        <div className="pose-metric-item">
          <span className="metric-label">Roll (Tilt)</span>
          <span className={`metric-value ${Math.abs(pose.roll) > 3 ? 'error' : 'ok'}`}>
            {pose.roll > 0 ? `+${pose.roll}°` : `${pose.roll}°`}
          </span>
        </div>
      </div>

      {pose.warnings.length > 0 && (
        <ul className="pose-warning-list" data-testid="pose-warnings">
          {pose.warnings.map((warn, idx) => (
            <li key={idx} className="pose-warning-item">
              <span className="warning-icon">⚠️</span> {warn}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
