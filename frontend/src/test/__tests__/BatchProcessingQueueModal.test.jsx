import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import BatchProcessingQueueModal from '../../components/BatchProcessingQueueModal';

describe('BatchProcessingQueueModal', () => {
  const mockQueue = [
    { id: '1', title: 'US Passport Photo', status: 'completed' },
    { id: '2', title: 'Schengen Visa Photo', status: 'failed', error: 'Canvas error', retryCount: 2 },
  ];

  it('renders queue modal with items and retry count badge', () => {
    render(
      <BatchProcessingQueueModal
        isOpen={true}
        onClose={vi.fn()}
        queue={mockQueue}
        onRetry={vi.fn()}
      />
    );

    expect(screen.getByText(/Batch Processing Queue/i)).toBeInTheDocument();
    expect(screen.getByText('US Passport Photo')).toBeInTheDocument();
    expect(screen.getByText('Schengen Visa Photo')).toBeInTheDocument();
    expect(screen.getByText(/Retry #2/i)).toBeInTheDocument();
  });

  it('triggers onRetry callback when retry button is clicked', () => {
    const handleRetry = vi.fn();
    render(
      <BatchProcessingQueueModal
        isOpen={true}
        onClose={vi.fn()}
        queue={mockQueue}
        onRetry={handleRetry}
      />
    );

    const retryBtn = screen.getByRole('button', { name: /Retry item Schengen Visa Photo/i });
    fireEvent.click(retryBtn);
    expect(handleRetry).toHaveBeenCalledWith('2');
  });
});
