import React, { useMemo } from 'react';
import { evaluateBiometricMesh } from '../utils/biometricMeshAnalyzer';
import './BiometricMeshViewer.css';

export default function BiometricMeshViewer({ landmarks, width = 400, height = 500 }) {
  const result = useMemo(() => {
    if (!landmarks) return null;
    return evaluateBiometricMesh(landmarks);
  }, [landmarks]);

  if (!landmarks || !result) {
    return (
      <div className="biometric-mesh-placeholder" data-testid="biometric-mesh-placeholder">
        <p>No facial landmark mesh data available for rendering.</p>
      </div>
    );
  }

  return (
    <div className="biometric-mesh-card" data-testid="biometric-mesh-viewer">
      <div className="biometric-mesh-header">
        <h3>Biometric 3D Mesh Analyzer</h3>
        <span className={`compliance-badge ${result.isMeshCompliant ? 'pass' : 'fail'}`}>
          {result.isMeshCompliant ? 'ICAO Compliant' : 'Non-Compliant'}
        </span>
      </div>

      <div className="biometric-mesh-canvas-container">
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="biometric-mesh-svg"
          aria-label="Facial landmark mesh overlay"
        >
          {landmarks.leftEye?.map((pt, idx) => (
            <circle key={`left-eye-${idx}`} cx={pt.x} cy={pt.y} r="2.5" className="mesh-point eye-point" />
          ))}
          {landmarks.rightEye?.map((pt, idx) => (
            <circle key={`right-eye-${idx}`} cx={pt.x} cy={pt.y} r="2.5" className="mesh-point eye-point" />
          ))}
          {landmarks.noseBridge?.map((pt, idx) => (
            <circle key={`nose-${idx}`} cx={pt.x} cy={pt.y} r="2" className="mesh-point nose-point" />
          ))}
          {landmarks.jawline?.map((pt, idx) => (
            <circle key={`jaw-${idx}`} cx={pt.x} cy={pt.y} r="2" className="mesh-point jaw-point" />
          ))}
        </svg>
      </div>

      <div className="biometric-metrics-grid">
        <div className="metric-item">
          <span className="metric-label">Confidence</span>
          <span className="metric-value">{result.confidenceScore}%</span>
        </div>
        <div className="metric-item">
          <span className="metric-label">IPD (Px)</span>
          <span className="metric-value">{result.interpupillaryDistancePx} px</span>
        </div>
        <div className="metric-item">
          <span className="metric-label">Roll Angle</span>
          <span className="metric-value">{result.rollAngleDegrees}°</span>
        </div>
        <div className="metric-item">
          <span className="metric-label">Yaw Angle</span>
          <span className="metric-value">{result.yawAngleDegrees}°</span>
        </div>
      </div>

      {result.warnings.length > 0 && (
        <div className="biometric-warnings-list" data-testid="biometric-warnings">
          <h4>Compliance Warnings:</h4>
          <ul>
            {result.warnings.map((warn, i) => (
              <li key={i}>{warn}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
