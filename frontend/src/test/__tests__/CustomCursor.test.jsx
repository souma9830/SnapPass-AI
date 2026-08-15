import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CustomCursor, { CURSOR_MODES } from '../../components/CustomCursor';

describe('CustomCursor Component', () => {
  it('renders cursor mode selector options accurately', () => {
    render(<CustomCursor />);
    const selectEl = screen.getByRole('combobox');
    expect(selectEl).toBeTruthy();
    expect(screen.getByText('🎯 System Default')).toBeTruthy();
    expect(screen.getByText('✨ Neon Glow')).toBeTruthy();
  });

  it('exposes all 5 defined cursor modes', () => {
    expect(CURSOR_MODES.length).toBe(5);
    expect(CURSOR_MODES.map((m) => m.id)).toEqual(['default', 'glow', 'trail', 'sparkle', 'orbit']);
  });
});
