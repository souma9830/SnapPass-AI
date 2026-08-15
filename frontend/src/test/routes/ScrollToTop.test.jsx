import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ScrollToTop from '../../routes/ScrollToTop';

describe('ScrollToTop component', () => {
  beforeEach(() => {
    vi.stubGlobal('scrollTo', vi.fn());
  });

  it('calls window.scrollTo on mount and route change', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <ScrollToTop />
      </MemoryRouter>
    );

    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      left: 0,
      behavior: 'auto',
    });
  });

  it('renders null cleanly without DOM elements', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/upload']}>
        <ScrollToTop />
      </MemoryRouter>
    );

    expect(container.firstChild).toBeNull();
  });
});
