import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useBatchExportQueue } from '../../hooks/useBatchExportQueue';

describe('useBatchExportQueue Hook', () => {
  it('initializes with an empty queue state', () => {
    const { result } = renderHook(() => useBatchExportQueue());
    expect(result.current.queue).toEqual([]);
    expect(result.current.isProcessing).toBe(false);
  });

  it('adds items to export queue', () => {
    const { result } = renderHook(() => useBatchExportQueue());
    act(() => {
      result.current.addToQueue({ id: 'item_1', title: 'Test Export 1' });
    });
    expect(result.current.queue.length).toBe(1);
    expect(result.current.queue[0].title).toBe('Test Export 1');
    expect(result.current.queue[0].status).toBe('pending');
  });

  it('updates item status and progress in queue', () => {
    const { result } = renderHook(() => useBatchExportQueue());
    act(() => {
      result.current.addToQueue({ id: 'item_1', title: 'Test Export 1' });
    });
    act(() => {
      result.current.updateItemStatus('item_1', 'completed', 100);
    });
    expect(result.current.queue[0].status).toBe('completed');
    expect(result.current.queue[0].progress).toBe(100);
  });

  it('clears completed items from queue', () => {
    const { result } = renderHook(() => useBatchExportQueue());
    act(() => {
      result.current.addToQueue({ id: 'item_1', title: 'Test Export 1' });
    });
    act(() => {
      result.current.updateItemStatus('item_1', 'completed', 100);
    });
    act(() => {
      result.current.clearCompleted();
    });
    expect(result.current.queue.length).toBe(0);
  });
});
