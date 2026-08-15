import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CustomPaperSizeCalculator from '../../components/CustomPaperSizeCalculator';

describe('CustomPaperSizeCalculator Component', () => {
  it('renders width, height, and DPI inputs and triggers apply callback', () => {
    const handleApply = vi.fn();
    render(<CustomPaperSizeCalculator onApplyCustomPaper={handleApply} darkMode={false} />);

    expect(screen.getByText(/Custom Paper Dimensions Calculator/i)).toBeInTheDocument();
    expect(screen.getByText(/Canvas Resolution:/i)).toBeInTheDocument();

    const applyBtn = screen.getByText('Apply Custom Paper');
    fireEvent.click(applyBtn);

    expect(handleApply).toHaveBeenCalledWith(
      expect.objectContaining({
        widthMm: 210,
        heightMm: 297,
        dpi: 300,
      })
    );
  });
});
