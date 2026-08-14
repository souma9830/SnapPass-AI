import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AttireWardrobeSelector from '../../components/AttireWardrobeSelector';

describe('AttireWardrobeSelector', () => {
  it('renders studio header and category buttons', () => {
    render(<AttireWardrobeSelector />);
    expect(screen.getByTestId('wardrobe-selector')).toBeInTheDocument();
    expect(screen.getByText('Formal Attire Virtual Studio')).toBeInTheDocument();
  });

  it('filters attire items when category button is clicked', () => {
    render(<AttireWardrobeSelector />);
    const femaleBtn = screen.getByRole('button', { name: 'Female' });
    fireEvent.click(femaleBtn);

    expect(screen.getByText('Women Executive Blazer')).toBeInTheDocument();
    expect(screen.queryByText('Black Formal Suit')).not.toBeInTheDocument();
  });

  it('calls onSelectAttire when item card is clicked', () => {
    const handleSelect = vi.fn();
    render(<AttireWardrobeSelector onSelectAttire={handleSelect} />);

    const itemCard = screen.getByTestId('attire-item-suit_navy');
    fireEvent.click(itemCard);

    expect(handleSelect).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'suit_navy', name: 'Navy Blue Blazer' })
    );
  });
});
