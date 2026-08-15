import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import AttireAlignmentOverlay from '../../components/AttireAlignmentOverlay';

describe('AttireAlignmentOverlay Component', () => {
  it('renders biometric alignment lines when visible', () => {
    const { container } = render(<AttireAlignmentOverlay visible={true} />);
    expect(container.querySelector('svg')).toBeInTheDocument();
    expect(container.querySelectorAll('line').length).toBe(3);
  });

  it('returns null when visible is false', () => {
    const { container } = render(<AttireAlignmentOverlay visible={false} />);
    expect(container.firstChild).toBeNull();
  });
});
