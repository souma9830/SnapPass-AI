import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import StudioFinancialWidget from '../../components/StudioFinancialWidget';

describe('StudioFinancialWidget component', () => {
  it('renders studio financial revenue widget', () => {
    render(<StudioFinancialWidget />);
    expect(screen.getByTestId('studio-financial-widget')).toBeDefined();
    expect(screen.getByText('Commercial Studio Revenue & Cost Estimator')).toBeDefined();
  });
});
