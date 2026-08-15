import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import BackgroundColorPalettePicker from '../../components/BackgroundColorPalettePicker';
import AttireStudioSelector from '../../components/AttireStudioSelector';

describe('BackgroundColorPalettePicker and AttireStudioSelector components', () => {
  it('renders color preset buttons and calls onChangeColor', () => {
    const handleChangeColor = vi.fn();
    render(<BackgroundColorPalettePicker selectedColor="#FFFFFF" onChangeColor={handleChangeColor} />);

    expect(screen.getByText(/Official Background Color Studio/i)).toBeDefined();
    const offWhiteBtn = screen.getByText('Off-White');
    fireEvent.click(offWhiteBtn);
    expect(handleChangeColor).toHaveBeenCalledWith('#F8FAFC');
  });

  it('renders attire preset options and triggers onSelectAttire', () => {
    const handleSelectAttire = vi.fn();
    render(<AttireStudioSelector selectedAttire="none" onSelectAttire={handleSelectAttire} />);

    expect(screen.getByText(/AI Virtual Attire Fitting Studio/i)).toBeDefined();
    const suitBtn = screen.getByText('Classic Black Suit');
    fireEvent.click(suitBtn);
    expect(handleSelectAttire).toHaveBeenCalledWith('suit_black');
  });
});
