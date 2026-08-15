import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AccessibilityToolbar from '../../components/AccessibilityToolbar';
import { ThemeCustomizerProvider } from '../../context/ThemeCustomizerContext';

describe('AccessibilityToolbar Component', () => {
  const renderToolbar = () =>
    render(
      <ThemeCustomizerProvider>
        <AccessibilityToolbar />
      </ThemeCustomizerProvider>
    );

  it('renders accessibility controls region and toggle buttons', () => {
    renderToolbar();
    expect(screen.getByRole('region', { name: /accessibility preferences toolbar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /high contrast/i })).toBeInTheDocument();
  });

  it('toggles high contrast mode when clicked', () => {
    renderToolbar();
    const contrastBtn = screen.getByRole('button', { name: /high contrast off/i });
    expect(contrastBtn).toHaveAttribute('aria-pressed', 'false');

    fireEvent.click(contrastBtn);
    expect(contrastBtn).toHaveTextContent(/high contrast on/i);
    expect(contrastBtn).toHaveAttribute('aria-pressed', 'true');
  });

  it('adjusts font scale up and down', () => {
    renderToolbar();
    const fontPlusBtn = screen.getByRole('button', { name: /increase text size/i });
    const fontMinusBtn = screen.getByRole('button', { name: /decrease text size/i });

    fireEvent.click(fontPlusBtn);
    expect(screen.getByText('110%')).toBeInTheDocument();

    fireEvent.click(fontMinusBtn);
    expect(screen.getByText('100%')).toBeInTheDocument();
  });
});
