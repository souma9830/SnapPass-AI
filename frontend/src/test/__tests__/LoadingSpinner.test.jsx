import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LoadingSpinner, { ButtonSpinner } from '../../components/LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders without crashing', () => {
    const { container } = render(<LoadingSpinner />);
    expect(container.querySelector('.spinner-wrap')).toBeInTheDocument();
  });

  it('shows the message when provided', () => {
    render(<LoadingSpinner message="Processing photo..." />);
    expect(screen.getByText('Processing photo...')).toBeInTheDocument();
  });

  it('does not show message when empty', () => {
    const { container } = render(<LoadingSpinner />);
    expect(container.querySelector('.spinner-message')).not.toBeInTheDocument();
  });

  it('applies size class correctly', () => {
    const { container: sm } = render(<LoadingSpinner size="sm" />);
    expect(sm.querySelector('.spinner--sm')).toBeInTheDocument();

    const { container: lg } = render(<LoadingSpinner size="lg" />);
    expect(lg.querySelector('.spinner--lg')).toBeInTheDocument();
  });

  it('applies light class when light prop is true', () => {
    const { container } = render(<LoadingSpinner light />);
    expect(container.querySelector('.spinner--light')).toBeInTheDocument();
  });

  it('applies fullpage class when fullPage is true', () => {
    const { container } = render(<LoadingSpinner fullPage />);
    expect(container.querySelector('.spinner-wrap--fullpage')).toBeInTheDocument();
  });

  it('has role="status" for accessibility', () => {
    render(<LoadingSpinner />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('has aria-live="polite" for screen readers', () => {
    const { container } = render(<LoadingSpinner />);
    expect(container.querySelector('[aria-live="polite"]')).toBeInTheDocument();
  });

  it('contains sr-only loading text for screen readers', () => {
    render(<LoadingSpinner />);
    expect(screen.getByText('Loading…')).toBeInTheDocument();
  });
});

describe('ButtonSpinner', () => {
  it('renders a small spinner element', () => {
    const { container } = render(<ButtonSpinner />);
    expect(container.querySelector('.spinner--sm')).toBeInTheDocument();
    expect(container.querySelector('.spinner--btn')).toBeInTheDocument();
  });

  it('applies light class by default', () => {
    const { container } = render(<ButtonSpinner />);
    expect(container.querySelector('.spinner--light')).toBeInTheDocument();
  });

  it('has aria-hidden="true"', () => {
    const { container } = render(<ButtonSpinner />);
    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
  });
});
