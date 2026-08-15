import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BatchProcessingQueueModal from '../../components/BatchProcessingQueueModal';

describe('BatchProcessingQueueModal Component', () => {
  const mockQueue = [
    { id: '1', title: 'Passport Photo 1', status: 'completed', progress: 100 },
    { id: '2', title: 'Passport Photo 2', status: 'failed', error: 'Network error', progress: 0 },
  ];

  it('renders modal with items when open', () => {
    render(
      <BatchProcessingQueueModal
        isOpen={true}
        onClose={jest.fn()}
        queue={mockQueue}
      />
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/batch processing queue/i)).toBeInTheDocument();
    expect(screen.getByText('Passport Photo 1')).toBeInTheDocument();
    expect(screen.getByText('Passport Photo 2')).toBeInTheDocument();
  });

  it('triggers onRetry when retry button clicked for failed item', () => {
    const handleRetry = jest.fn();
    render(
      <BatchProcessingQueueModal
        isOpen={true}
        onClose={jest.fn()}
        queue={mockQueue}
        onRetry={handleRetry}
      />
    );

    const retryBtn = screen.getByRole('button', { name: /retry/i });
    fireEvent.click(retryBtn);
    expect(handleRetry).toHaveBeenCalledWith('2');
  });

  it('triggers onClearCompleted when clicked', () => {
    const handleClear = jest.fn();
    render(
      <BatchProcessingQueueModal
        isOpen={true}
        onClose={jest.fn()}
        queue={mockQueue}
        onClearCompleted={handleClear}
      />
    );

    const clearBtn = screen.getByRole('button', { name: /clear completed/i });
    fireEvent.click(clearBtn);
    expect(handleClear).toHaveBeenCalled();
  });
});
