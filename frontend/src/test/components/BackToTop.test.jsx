import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import BackToTop from '../../src/components/HomePage/BackToTop';

describe('BackToTop component', () => {
  beforeEach(() => {
    // Reset scrollY and mock scrollTo
    Object.defineProperty(window, 'scrollY', { writable: true, configurable: true, value: 0 });
    window.scrollTo = jest.fn();
  });

  test('does not render button when scroll is low', () => {
    const { queryByRole } = render(<BackToTop />);
    expect(queryByRole('button', { name: /back to top/i })).not.toBeInTheDocument();
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
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });
});
