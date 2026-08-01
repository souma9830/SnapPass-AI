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

  test('hides button at intermediate scroll offset below threshold', () => {
    const { getByRole } = render(<BackToTop />);
    window.scrollY = 250;
    fireEvent.scroll(window);
    expect(getByRole('button', { name: /back to top/i })).not.toHaveClass('show');
  });

  test('remains visible at large scroll offsets above threshold', () => {
    const { getByRole } = render(<BackToTop />);
    window.scrollY = 1200;
    fireEvent.scroll(window);
    expect(getByRole('button', { name: /back to top/i })).toHaveClass('show');
  });

  test('exact threshold boundary of 400 keeps the button hidden', () => {
    const { getByRole } = render(<BackToTop />);
    window.scrollY = 400;
    fireEvent.scroll(window);
    expect(getByRole('button', { name: /back to top/i })).not.toHaveClass('show');
  });

  test('scroll offset just above the threshold shows the button', () => {
    const { getByRole } = render(<BackToTop />);
    window.scrollY = 401;
    fireEvent.scroll(window);
    expect(getByRole('button', { name: /back to top/i })).toHaveClass('show');
  });

  test('hides the button again when scrolling back below the threshold', () => {
    const { getByRole } = render(<BackToTop />);
    window.scrollY = 700;
    fireEvent.scroll(window);
    const btn = getByRole('button', { name: /back to top/i });
    expect(btn).toHaveClass('show');
    window.scrollY = 300;
    fireEvent.scroll(window);
    expect(btn).not.toHaveClass('show');
  });

  test('removes the window scroll listener on unmount', () => {
    const addSpy = vi.spyOn(window, 'addEventListener');
    const removeSpy = vi.spyOn(window, 'removeEventListener');
    const { unmount } = render(<BackToTop />);
    expect(addSpy).toHaveBeenCalledWith('scroll', expect.any(Function));

    unmount();
    expect(removeSpy).toHaveBeenCalledWith('scroll', expect.any(Function));

    addSpy.mockRestore();
    removeSpy.mockRestore();
  });
});
