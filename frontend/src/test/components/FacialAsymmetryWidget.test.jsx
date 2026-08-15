import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import FacialAsymmetryWidget from '../../components/FacialAsymmetryWidget';

describe('FacialAsymmetryWidget component', () => {
  it('renders symmetry score widget', () => {
    render(<FacialAsymmetryWidget landmarks={[]} />);
    expect(screen.getByTestId('asymmetry-widget')).toBeDefined();
    expect(screen.getByText('Biometric Facial Symmetry')).toBeDefined();
  });
});
