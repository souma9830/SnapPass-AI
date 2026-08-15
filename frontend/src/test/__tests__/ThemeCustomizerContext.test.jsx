import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeCustomizerProvider, useThemeCustomizer } from '../../context/ThemeCustomizerContext';

const TestComponent = () => {
  const { accentColor, setAccentColor, highContrast, setHighContrast, resetTheme } = useThemeCustomizer();
  return (
    <div>
      <span data-testid="accent-display">{accentColor}</span>
      <span data-testid="contrast-display">{highContrast ? 'enabled' : 'disabled'}</span>
      <button onClick={() => setAccentColor('emerald-green')}>Set Green</button>
      <button onClick={() => setHighContrast(true)}>Enable Contrast</button>
      <button onClick={resetTheme}>Reset</button>
    </div>
  );
};

describe('ThemeCustomizerContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('provides default accent color and high contrast state', () => {
    render(
      <ThemeCustomizerProvider>
        <TestComponent />
      </ThemeCustomizerProvider>
    );

    expect(screen.getByTestId('accent-display').textContent).toBe('classic-blue');
    expect(screen.getByTestId('contrast-display').textContent).toBe('disabled');
  });

  test('updates accent color and sets root CSS variable', () => {
    render(
      <ThemeCustomizerProvider>
        <TestComponent />
      </ThemeCustomizerProvider>
    );

    fireEvent.click(screen.getByText('Set Green'));
    expect(screen.getByTestId('accent-display').textContent).toBe('emerald-green');
    expect(localStorage.getItem('theme-accent')).toBe('emerald-green');
  });

  test('toggles high contrast mode and resets to defaults', () => {
    render(
      <ThemeCustomizerProvider>
        <TestComponent />
      </ThemeCustomizerProvider>
    );

    fireEvent.click(screen.getByText('Enable Contrast'));
    expect(screen.getByTestId('contrast-display').textContent).toBe('enabled');

    fireEvent.click(screen.getByText('Reset'));
    expect(screen.getByTestId('accent-display').textContent).toBe('classic-blue');
    expect(screen.getByTestId('contrast-display').textContent).toBe('disabled');
  });
});
