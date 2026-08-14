import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import ColorTemperatureControl from '../../components/ColorTemperatureControl';

describe('ColorTemperatureControl component', () => {
  it('renders temperature control sliders', () => {
    render(<ColorTemperatureControl canvasRef={{ current: null }} />);
    expect(screen.getByTestId('color-temp-control')).toBeDefined();
    expect(screen.getByText('Color Temperature & Skin Tone Balance')).toBeDefined();
  });
});
