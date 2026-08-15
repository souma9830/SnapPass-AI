import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ColorTemperatureAdjuster from '../../components/ColorTemperatureAdjuster';

describe('ColorTemperatureAdjuster Component', () => {
  it('renders temperature and tint sliders with reset button', () => {
    const handleTemp = vi.fn();
    const handleTint = vi.fn();
    const handleReset = vi.fn();

    render(
      <ColorTemperatureAdjuster
        temperature={10}
        tint={-5}
        onChangeTemperature={handleTemp}
        onChangeTint={handleTint}
        onReset={handleReset}
        darkMode={false}
      />
    );

    expect(screen.getByText(/White Balance & Color Temperature/i)).toBeInTheDocument();
    expect(screen.getByText(/\+10K/i)).toBeInTheDocument();
    expect(screen.getByText(/-5/i)).toBeInTheDocument();

    const resetBtn = screen.getByText('Reset');
    fireEvent.click(resetBtn);
    expect(handleReset).toHaveBeenCalledTimes(1);
  });
});
