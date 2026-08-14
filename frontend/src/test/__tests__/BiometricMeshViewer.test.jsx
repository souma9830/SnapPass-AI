import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import BiometricMeshViewer from '../../components/BiometricMeshViewer';

describe('BiometricMeshViewer', () => {
  it('renders placeholder when no landmarks are supplied', () => {
    render(<BiometricMeshViewer landmarks={null} />);
    expect(screen.getByTestId('biometric-mesh-placeholder')).toBeInTheDocument();
  });

  it('renders compliance badge and metrics when valid landmarks are supplied', () => {
    const mockLandmarks = {
      leftEye: [{ x: 100, y: 150, z: 0 }, { x: 120, y: 150, z: 0 }],
      rightEye: [{ x: 220, y: 150, z: 0 }, { x: 240, y: 150, z: 0 }],
      noseBridge: [{ x: 170, y: 180, z: 0 }, { x: 170, y: 220, z: 0 }],
      mouthOutline: [{ x: 140, y: 260, z: 0 }, { x: 200, y: 260, z: 0 }],
      jawline: [{ x: 80, y: 200, z: 0 }, { x: 170, y: 320, z: 0 }, { x: 260, y: 200, z: 0 }],
      chinPoint: { x: 170, y: 320, z: 0 },
      foreheadTop: { x: 170, y: 80, z: 0 }
    };

    render(<BiometricMeshViewer landmarks={mockLandmarks} width={400} height={500} />);
    expect(screen.getByTestId('biometric-mesh-viewer')).toBeInTheDocument();
    expect(screen.getByText('Biometric 3D Mesh Analyzer')).toBeInTheDocument();
    expect(screen.getByText('ICAO Compliant')).toBeInTheDocument();
  });
});
