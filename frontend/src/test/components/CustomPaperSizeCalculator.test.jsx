import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CustomPaperSizeCalculator from '../../components/CustomPaperSizeCalculator';

describe('CustomPaperSizeCalculator Component', () => {
  it('renders custom dimension calculator fields', () => {
    render(<CustomPaperSizeCalculator onApplyCustomPaper={jest.fn()} />);
    expect(screen.getByText(/custom paper & dimension calculator/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/width \(mm\)/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/height \(mm\)/i)).toBeInTheDocument();
  });

  it('calculates pixel resolution dynamically based on DPI and mm inputs', () => {
    render(<CustomPaperSizeCalculator onApplyCustomPaper={jest.fn()} />);
    const widthInput = screen.getByLabelText(/width \(mm\)/i);
    fireEvent.change(widthInput, { target: { value: '100' } });

    // 100mm / 25.4 * 300 = 1181px
    expect(screen.getByText(/1181 × 3508 px/i)).toBeInTheDocument();
  });

  it('calls onApplyCustomPaper with calculated dimensions', () => {
    const handleApply = jest.fn();
    render(<CustomPaperSizeCalculator onApplyCustomPaper={handleApply} />);

    const applyBtn = screen.getByRole('button', { name: /apply dimensions/i });
    fireEvent.click(applyBtn);

    expect(handleApply).toHaveBeenCalledWith(
      expect.objectContaining({
        widthMm: 210,
        heightMm: 297,
        dpi: 300,
        pxWidth: 2480,
        pxHeight: 3508,
      })
    );
  });
});
