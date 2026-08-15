import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import OfflineSyncIndicator from '../../components/OfflineSyncIndicator';

vi.mock('../../hooks/useOfflineSyncQueue', () => ({
  useOfflineSyncQueue: vi.fn()
}));

import { useOfflineSyncQueue } from '../../hooks/useOfflineSyncQueue';

describe('OfflineSyncIndicator', () => {
  it('returns null when online with 0 pending items', () => {
    useOfflineSyncQueue.mockReturnValue({ isOnline: true, pendingCount: 0 });
    const { container } = render(<OfflineSyncIndicator />);
    expect(container.firstChild).toBeNull();
  });

  it('renders offline banner when offline with pending count', () => {
    useOfflineSyncQueue.mockReturnValue({ isOnline: false, pendingCount: 3 });
    render(<OfflineSyncIndicator />);
    const banner = screen.getByTestId('offline-sync-indicator');
    expect(banner).toBeInTheDocument();
    expect(screen.getByText(/Offline Mode \(3 queued for sync\)/i)).toBeInTheDocument();
  });
});
