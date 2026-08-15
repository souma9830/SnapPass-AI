import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PresetFilterManager, { COMPLIANCE_PRESETS } from '../../components/PresetFilterManager';

describe('PresetFilterManager Component', () => {
  it('renders all compliance preset options', () => {
    render(
      <PresetFilterManager
        activePresetId={null}
        onSelectPreset={vi.fn()}
        onResetPreset={vi.fn()}
        darkMode={false}
      />
    );

    COMPLIANCE_PRESETS.forEach((preset) => {
      expect(screen.getByText(preset.name)).toBeInTheDocument();
    });
  });

  it('calls onSelectPreset when a preset card is clicked', () => {
    const handleSelect = vi.fn();
    render(
      <PresetFilterManager
        activePresetId={null}
        onSelectPreset={handleSelect}
        onResetPreset={vi.fn()}
        darkMode={false}
      />
    );

    const firstPreset = COMPLIANCE_PRESETS[0];
    fireEvent.click(screen.getByText(firstPreset.name));
    expect(handleSelect).toHaveBeenCalledWith(firstPreset);
  });

  it('renders reset button when activePresetId is provided and handles reset click', () => {
    const handleReset = vi.fn();
    render(
      <PresetFilterManager
        activePresetId="us_passport"
        onSelectPreset={vi.fn()}
        onResetPreset={handleReset}
        darkMode={true}
      />
    );

    const resetBtn = screen.getByText(/Reset Custom Adjustments/i);
    expect(resetBtn).toBeInTheDocument();
    fireEvent.click(resetBtn);
    expect(handleReset).toHaveBeenCalledTimes(1);
  });
});
