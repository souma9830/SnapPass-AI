import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import KeyboardShortcutsModal from '../../components/KeyboardShortcutsModal';

describe('KeyboardShortcutsModal Component', () => {
  it('renders floating trigger button when closed', () => {
    render(<KeyboardShortcutsModal />);
    expect(screen.getByRole('button', { name: /keyboard shortcuts guide/i })).toBeInTheDocument();
  });

  it('opens cheat sheet modal when trigger button clicked', () => {
    render(<KeyboardShortcutsModal />);
    const trigger = screen.getByRole('button', { name: /keyboard shortcuts guide/i });
    fireEvent.click(trigger);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/keyboard shortcuts cheat sheet/i)).toBeInTheDocument();
    expect(screen.getByText('Shift + ?')).toBeInTheDocument();
  });

  it('closes modal when close button clicked', () => {
    render(<KeyboardShortcutsModal />);
    fireEvent.click(screen.getByRole('button', { name: /keyboard shortcuts guide/i }));

    const closeBtn = screen.getByRole('button', { name: /close shortcuts dialog/i });
    fireEvent.click(closeBtn);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
