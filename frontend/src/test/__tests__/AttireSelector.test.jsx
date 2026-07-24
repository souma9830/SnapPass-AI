import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AttireSelector from '../../components/AttireSelector';
import { LanguageProvider } from '../../context/LanguageContext';

describe('AttireSelector Component', () => {
  it('renders attire options correctly', () => {
    render(
      <LanguageProvider>
        <AttireSelector selected="none" onChange={() => {}} />
      </LanguageProvider>
    );

    expect(screen.getByRole('radiogroup')).toBeDefined();
  });

  it('triggers onChange handler when option clicked', () => {
    const handleChange = vi.fn();
    render(
      <LanguageProvider>
        <AttireSelector selected="none" onChange={handleChange} />
      </LanguageProvider>
    );

    const buttons = screen.getAllByRole('radio');
    if (buttons.length > 1) {
      fireEvent.click(buttons[1]);
      expect(handleChange).toHaveBeenCalled();
    }
  });
});
