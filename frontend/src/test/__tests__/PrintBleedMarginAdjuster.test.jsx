import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PrintBleedMarginAdjuster from '../../components/PrintBleedMarginAdjuster';

describe('PrintBleedMarginAdjuster', () => {
  it('renders title and default 3mm bleed margin', () => {
    render(<PrintBleedMarginAdjuster />);
    expect(screen.getByTestId('bleed-margin-adjuster')).toBeInTheDocument();
    expect(screen.getByText('Bleed Margin: 3 mm')).toBeInTheDocument();
  });

  it('triggers onUpdateBleed when range slider changes', () => {
    const handleUpdate = vi.fn();
    render(<PrintBleedMarginAdjuster onUpdateBleed={handleUpdate} />);

    const slider = screen.getByTestId('bleed-range-slider');
    fireEvent.change(slider, { target: { value: '5' } });

    expect(handleUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ bleedMm: 5 })
    );
  });
});
