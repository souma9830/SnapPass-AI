import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ShadowRemovalControlPanel from '../../components/ShadowRemovalControlPanel';

describe('ShadowRemovalControlPanel', () => {
  it('renders header and toggle switch', () => {
    render(<ShadowRemovalControlPanel />);
    expect(screen.getByTestId('shadow-removal-panel')).toBeInTheDocument();
    expect(screen.getByText('Adaptive Shadow Removal')).toBeInTheDocument();
  });

  it('reveals controls when toggle is checked and triggers callback', () => {
    const handleApply = vi.fn();
    render(<ShadowRemovalControlPanel onApplyShadowRemoval={handleApply} />);

    const toggle = screen.getByTestId('shadow-toggle');
    fireEvent.click(toggle);

    const applyBtn = screen.getByTestId('apply-shadow-btn');
    expect(applyBtn).toBeInTheDocument();

    fireEvent.click(applyBtn);
    expect(handleApply).toHaveBeenCalledTimes(1);
  });
});
