import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import BackToTop from '../../components/HomePage/BackToTop';
import { vi } from 'vitest';

describe('BackToTop component', () => {
  beforeEach(() => {
    // Reset scrollY and mock scrollTo
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: 0,
    });
    window.scrollTo = vi.fn();
  });

  test('does not show active class when scroll is low', () => {
    const { getByRole } = render(<BackToTop />);
    expect(getByRole('button', { name: /back to top/i })).not.toHaveClass('show');
  });

  test('shows button after scrolling down and scrolls to top on click', () => {
    const { getByRole } = render(<BackToTop />);
    // Simulate scroll
    window.scrollY = 500;
    fireEvent.scroll(window);
    const btn = getByRole('button', { name: /back to top/i });
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveClass('show');
    fireEvent.click(btn);
    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth',
    });
  });
});
