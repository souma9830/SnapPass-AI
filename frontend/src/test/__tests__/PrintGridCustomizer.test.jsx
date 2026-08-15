import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import PrintGridCustomizer from '../../components/PrintGridCustomizer';

describe('PrintGridCustomizer Component', () => {
  it('renders paper format dropdown and grid dimensions', () => {
    render(<PrintGridCustomizer paperSize="A4" spacingMm={5} />);
    expect(screen.getByText('Print Sheet Layout Configurator')).toBeInTheDocument();
    expect(screen.getByText(/Paper Format/i)).toBeInTheDocument();
  });
});
