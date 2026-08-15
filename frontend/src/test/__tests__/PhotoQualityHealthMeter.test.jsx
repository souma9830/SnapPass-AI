import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import PhotoQualityHealthMeter from '../../components/PhotoQualityHealthMeter';

describe('PhotoQualityHealthMeter Component', () => {
  it('renders overall health status and biometric checks', () => {
    const mockFile = new File(['dummy content'], 'passport.png', { type: 'image/png' });
    render(<PhotoQualityHealthMeter file={mockFile} complianceScore={90} darkMode={false} />);

    expect(screen.getByText(/Photo Health & Biometric Audit/i)).toBeInTheDocument();
    expect(screen.getByText(/EXCELLENT/i)).toBeInTheDocument();
    expect(screen.getByText(/Resolution Grade:/i)).toBeInTheDocument();
  });
});
