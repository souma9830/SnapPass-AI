import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ToastProvider, useToast } from '../../context/ToastContext';
import ToastContainer from '../../components/ToastContainer';

function TestComponent() {
  const { addToast } = useToast();
  return (
    <div>
      <button onClick={() => addToast({ title: 'Success Alert', message: 'Operation finished', type: 'success' })}>
        Trigger Toast
      </button>
      <ToastContainer />
    </div>
  );
}

describe('ToastContext and ToastContainer components', () => {
  it('dispatches and renders toast alert on action', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    const triggerBtn = screen.getByText('Trigger Toast');
    fireEvent.click(triggerBtn);

    expect(screen.getByText('Success Alert')).toBeDefined();
    expect(screen.getByText('Operation finished')).toBeDefined();
  });
});
