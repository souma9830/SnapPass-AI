import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ScrollToTopButton from '../../components/ScrollToTopButton';

describe('ScrollToTopButton UX (issue 933)', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: 0,
    });
    window.scrollTo = vi.fn();
  });

  it('is rendered but hidden at the top of the page', () => {
    const { getByRole } = render(<ScrollToTopButton />);
    const button = getByRole('button', { name: /scroll to top/i });
    expect(button).toBeTruthy();
    expect(button.className).not.toContain('show');
  });

  it('fades in after scrolling down', () => {
    const { getByRole } = render(<ScrollToTopButton />);
    window.scrollY = 600;
    fireEvent.scroll(window);
    const button = getByRole('button', { name: /scroll to top/i });
    expect(button.className).toContain('show');
  });

  it('fades out when scrolled back to the top', () => {
    const { getByRole } = render(<ScrollToTopButton />);
    window.scrollY = 600;
    fireEvent.scroll(window);
    const button = getByRole('button', { name: /scroll to top/i });
    expect(button.className).toContain('show');
    window.scrollY = 0;
    fireEvent.scroll(window);
    expect(button.className).not.toContain('show');
  });

  it('scrolls smoothly to the top on click', () => {
    const { getByRole } = render(<ScrollToTopButton />);
    window.scrollY = 600;
    fireEvent.scroll(window);
    fireEvent.click(getByRole('button', { name: /scroll to top/i }));
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });
});
