import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PrintBleedMarginAdjuster from '../../components/PrintBleedMarginAdjuster';

describe('PrintBleedMarginAdjuster Component', () => {
  it('renders sliders for bleed and page margins', () => {
    const handleBleed = vi.fn();
    const handleMargin = vi.fn();

    render(
      <PrintBleedMarginAdjuster
        bleedMm={2}
        marginMm={10}
        onChangeBleed={handleBleed}
        onChangeMargin={handleMargin}
        darkMode={false}
      />
    );

    expect(screen.getByText(/Print Bleed & Page Margins/i)).toBeInTheDocument();
    expect(screen.getByText(/Photo Bleed \(2 mm\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Page Outer Margin \(10 mm\)/i)).toBeInTheDocument();
  });
});
