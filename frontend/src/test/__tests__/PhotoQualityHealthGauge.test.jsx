import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import PhotoQualityHealthGauge from '../../components/PhotoQualityHealthGauge';

describe('PhotoQualityHealthGauge', () => {
  it('renders overall health gauge score and status tier', () => {
    const mockMetrics = { contrast: 90, sharpness: 92, lighting: 88, resolution: 96 };
    render(<PhotoQualityHealthGauge metrics={mockMetrics} />);

    expect(screen.getByTestId('photo-quality-health-gauge')).toBeInTheDocument();
    expect(screen.getByText('EXCELLENT')).toBeInTheDocument();
    expect(screen.getByText('92')).toBeInTheDocument();
  });
});
