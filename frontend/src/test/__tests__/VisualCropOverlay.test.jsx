import { describe, it, expect } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';
import VisualCropOverlay from '../../components/editor/VisualCropOverlay';

describe('VisualCropOverlay', () => {
  it('renders title when visible is true', () => {
    const { getByText } = render(<VisualCropOverlay visible={true} title="ICAO Test Guide" />);
    expect(getByText('ICAO Test Guide')).toBeInTheDocument();
  });

  it('renders null when visible is false', () => {
    const { container } = render(<VisualCropOverlay visible={false} />);
    expect(container.firstChild).toBeNull();
  });
});
