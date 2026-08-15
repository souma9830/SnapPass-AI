import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useFocusTrap } from '../../hooks/useFocusTrap';

function TestComponent({ active }) {
  const ref = useFocusTrap(active);
  return (
    <div ref={ref}>
      <button id="btn1">First</button>
      <button id="btn2">Second</button>
    </div>
  );
}

describe('useFocusTrap Hook', () => {
  it('focuses the first element when active', () => {
    render(<TestComponent active={true} />);
    expect(document.activeElement.id).toBe('btn1');
  });
});
