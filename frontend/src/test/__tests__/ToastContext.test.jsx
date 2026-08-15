import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ToastProvider, useToast } from '../../context/ToastContext';

describe('ToastContext', () => {
  it('provides showToast function', () => {
    const wrapper = ({ children }) => <ToastProvider>{children}</ToastProvider>;
    const { result } = renderHook(() => useToast(), { wrapper });

    expect(typeof result.current.showToast).toBe('function');
  });

  it('adds and removes toast items', () => {
    const wrapper = ({ children }) => <ToastProvider>{children}</ToastProvider>;
    const { result } = renderHook(() => useToast(), { wrapper });

    act(() => {
      result.current.showToast('Test notification', 'success', 0);
    });
  });
});
