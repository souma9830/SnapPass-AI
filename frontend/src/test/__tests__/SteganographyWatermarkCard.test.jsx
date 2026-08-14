import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import SteganographyWatermarkCard from '../../components/SteganographyWatermarkCard';

describe('SteganographyWatermarkCard', () => {
  it('renders card header and embed button', () => {
    render(<SteganographyWatermarkCard photoId="test_123" />);
    expect(screen.getByTestId('steganography-card')).toBeInTheDocument();
    expect(screen.getByText('Digital Steganography Protection')).toBeInTheDocument();
  });

  it('embeds signature when button is clicked', () => {
    render(<SteganographyWatermarkCard photoId="test_123" />);
    const btn = screen.getByTestId('embed-signature-btn');
    fireEvent.click(btn);

    expect(screen.getByTestId('signature-info')).toBeInTheDocument();
    expect(screen.getByText('Authentic LSB Seal')).toBeInTheDocument();
  });
});
