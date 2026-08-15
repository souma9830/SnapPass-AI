import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import AccessibilityToolbar from '../../components/AccessibilityToolbar';
import { ThemeCustomizerProvider } from '../../context/ThemeCustomizerContext';

describe('AccessibilityToolbar Component', () => {
  it('renders high contrast and font scaling buttons', () => {
    render(
      <ThemeCustomizerProvider>
        <AccessibilityToolbar />
      </ThemeCustomizerProvider>
    );
    expect(screen.getByText(/Accessibility Controls/i)).toBeInTheDocument();
    expect(screen.getByText(/High Contrast OFF/i)).toBeInTheDocument();
  });
});
