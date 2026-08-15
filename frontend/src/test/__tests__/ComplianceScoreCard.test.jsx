import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ComplianceScoreCard from '../../components/ComplianceScoreCard';

describe('ComplianceScoreCard Component', () => {
  it('renders overall compliance score title and grade', () => {
    render(<ComplianceScoreCard metrics={{ lightingScore: 90, backgroundUniformity: 95 }} />);
    expect(screen.getByText('Passport Compliance Score')).toBeInTheDocument();
    expect(screen.getByText(/AI-driven biometric/i)).toBeInTheDocument();
  });

  it('displays calculated score percentages and status rules', () => {
    render(
      <ComplianceScoreCard
        metrics={{ faceDetected: true, headPoseCentered: true, backgroundUniformity: 80, lightingScore: 85 }}
      />
    );
    expect(screen.getByText('Head Alignment')).toBeInTheDocument();
    expect(screen.getByText('Background Uniformity')).toBeInTheDocument();
  });
});
