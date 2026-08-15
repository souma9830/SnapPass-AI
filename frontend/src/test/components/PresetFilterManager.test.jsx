import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PresetFilterManager, { COMPLIANCE_PRESETS } from '../../components/PresetFilterManager';

describe('PresetFilterManager Component', () => {
  it('renders list of compliance presets', () => {
    render(<PresetFilterManager activePresetId={null} onSelectPreset={jest.fn()} />);
    expect(screen.getByText(/compliance photo presets/i)).toBeInTheDocument();
    expect(screen.getByText('US Passport Clean')).toBeInTheDocument();
    expect(screen.getByText('India Passport Matte')).toBeInTheDocument();
  });

  it('triggers onSelectPreset when a preset card is clicked', () => {
    const handleSelect = jest.fn();
    render(<PresetFilterManager activePresetId={null} onSelectPreset={handleSelect} />);

    const usPresetBtn = screen.getByRole('button', { name: /us passport clean/i });
    fireEvent.click(usPresetBtn);

    expect(handleSelect).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'us_passport', name: 'US Passport Clean' })
    );
  });

  it('shows reset button when activePresetId is provided', () => {
    const handleReset = jest.fn();
    render(
      <PresetFilterManager
        activePresetId="us_passport"
        onSelectPreset={jest.fn()}
        onResetPreset={handleReset}
      />
    );

    const resetBtn = screen.getByRole('button', { name: /reset custom adjustments/i });
    expect(resetBtn).toBeInTheDocument();

    fireEvent.click(resetBtn);
    expect(handleReset).toHaveBeenCalled();
  });
});
