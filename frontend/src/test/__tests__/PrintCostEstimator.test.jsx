import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import PrintCostEstimator from '../../components/PrintCostEstimator';

describe('PrintCostEstimator Component', () => {
  it('renders cost estimator calculations and savings badge', () => {
    render(<PrintCostEstimator photoCount={6} darkMode={false} />);

    expect(screen.getByText(/Print Cost & Savings Estimator/i)).toBeInTheDocument();
    expect(screen.getByText(/Est. DIY Printing Cost:/i)).toBeInTheDocument();
    expect(screen.getByText(/Retail Commercial Studio Cost:/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Estimated Savings:/i)).toBeInTheDocument();
  });
});
