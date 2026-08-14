import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import EyeGlareCard from '../../components/EyeGlareCard';

describe('EyeGlareCard component', () => {
  it('renders eye glare inspection card', () => {
    render(<EyeGlareCard canvasRef={{ current: null }} eyeRegions={null} />);
    expect(screen.getByTestId('eye-glare-card')).toBeDefined();
    expect(screen.getByText('Eye Glare & Specular Reflection')).toBeDefined();
  });
});
