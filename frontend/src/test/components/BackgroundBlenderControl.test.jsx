import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import BackgroundBlenderControl from '../../components/BackgroundBlenderControl';

describe('BackgroundBlenderControl component', () => {
  it('renders control elements correctly', () => {
    render(<BackgroundBlenderControl canvasRef={{ current: null }} />);
    expect(screen.getByTestId('bg-blender-control')).toBeDefined();
    expect(screen.getByText('Background Color Standardization & Blending')).toBeDefined();
    expect(screen.getByText('Apply Background Blend')).toBeDefined();
  });
});
