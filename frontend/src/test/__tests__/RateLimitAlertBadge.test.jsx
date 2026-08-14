import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import RateLimitAlertBadge from '../../components/RateLimitAlertBadge';

describe('RateLimitAlertBadge', () => {
  it('returns null when no alert object is supplied', () => {
    const { container } = render(<RateLimitAlertBadge alert={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders critical alert badge with proper class and message', () => {
    const mockAlert = {
      tenantId: 'tenant_test',
      severity: 'CRITICAL',
      message: 'Tenant tenant_test exceeded 95% quota',
      timestamp: new Date().toISOString()
    };

    render(<RateLimitAlertBadge alert={mockAlert} />);
    const badge = screen.getByTestId('rate-limit-alert-badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('critical');
    expect(screen.getByText('Tenant tenant_test exceeded 95% quota')).toBeInTheDocument();
  });
});
