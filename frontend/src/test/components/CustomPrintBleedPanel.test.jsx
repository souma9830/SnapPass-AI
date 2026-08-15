import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import CustomPrintBleedPanel from '../../components/CustomPrintBleedPanel';

describe('CustomPrintBleedPanel component', () => {
  it('renders print bleed configurator panel', () => {
    render(<CustomPrintBleedPanel />);
    expect(screen.getByTestId('bleed-panel')).toBeDefined();
    expect(screen.getByText('Print Bleed & Cutting Margin Configurator')).toBeDefined();
  });
});
