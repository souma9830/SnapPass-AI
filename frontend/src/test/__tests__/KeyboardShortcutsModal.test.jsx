import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import KeyboardShortcutsModal from '../../components/KeyboardShortcutsModal';

describe('KeyboardShortcutsModal Component', () => {
  it('renders trigger button initially and opens shortcuts modal on click', () => {
    render(<KeyboardShortcutsModal darkMode={false} />);

    const triggerBtn = screen.getByLabelText('Keyboard Shortcuts Guide');
    expect(triggerBtn).toBeInTheDocument();

    fireEvent.click(triggerBtn);

    expect(screen.getAllByText(/Keyboard Shortcuts Cheat Sheet/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Shift \+ \?/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Toggle SnapPass AI Assistant Chatbot/i)).toBeInTheDocument();
  });
});
