import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import EyeGlareDiagnosticCard from '../../components/EyeGlareDiagnosticCard';

describe('EyeGlareDiagnosticCard', () => {
  it('renders placeholder when no result is passed', () => {
    render(<EyeGlareDiagnosticCard diagnosticResult={null} />);
    expect(screen.getByTestId('glare-card-placeholder')).toBeInTheDocument();
  });

  it('renders clear status badge when no glare is present', () => {
    const mockResult = { hasGlare: false, specularRatio: 1.2, confidence: 85 };
    render(<EyeGlareDiagnosticCard diagnosticResult={mockResult} />);
    expect(screen.getByTestId('glare-diagnostic-card')).toBeInTheDocument();
    expect(screen.getByText('Clear Refraction')).toBeInTheDocument();
  });

  it('renders alert badge and warning note when glare is detected', () => {
    const mockResult = { hasGlare: true, specularRatio: 6.8, confidence: 95 };
    render(<EyeGlareDiagnosticCard diagnosticResult={mockResult} />);
    expect(screen.getByText('Glare Detected')).toBeInTheDocument();
    expect(screen.getByText(/Lens reflections detected/i)).toBeInTheDocument();
  });
});
