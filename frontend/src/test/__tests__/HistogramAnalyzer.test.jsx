import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import HistogramAnalyzer from '../../components/HistogramAnalyzer';

describe('HistogramAnalyzer Component', () => {
  it('renders header title and metrics structure', () => {
    render(<HistogramAnalyzer imageUrl="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==" darkMode={false} />);
    expect(screen.getByText(/Real-Time RGB Exposure Histogram/i)).toBeInTheDocument();
    expect(screen.getByText(/Avg Luminance/i)).toBeInTheDocument();
    expect(screen.getByText(/Shadow Clipped/i)).toBeInTheDocument();
    expect(screen.getByText(/Highlight Clipped/i)).toBeInTheDocument();
  });
});
