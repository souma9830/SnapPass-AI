import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PassportRequirementComparator from '../../components/PassportRequirementComparator';

describe('PassportRequirementComparator Component', () => {
  test('renders comparator title and search input', () => {
    render(<PassportRequirementComparator />);
    expect(screen.getByText(/Passport Requirement Comparator/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Search country or document type/i)).toBeInTheDocument();
  });

  test('filters requirements based on search query', () => {
    render(<PassportRequirementComparator />);
    const searchInput = screen.getByPlaceholderText(/Search country or document type/i);

    fireEvent.change(searchInput, { target: { value: 'Japan' } });
    expect(screen.getByText(/Japan Passport/i)).toBeInTheDocument();
    expect(screen.queryByText(/USA Visa/i)).not.toBeInTheDocument();
  });

  test('filters requirements based on region buttons', () => {
    render(<PassportRequirementComparator />);
    const europeBtn = screen.getByRole('button', { name: 'Europe' });

    fireEvent.click(europeBtn);
    expect(screen.getByText(/Schengen Visa/i)).toBeInTheDocument();
  });

  test('clears search when clear button clicked', () => {
    render(<PassportRequirementComparator />);
    const searchInput = screen.getByPlaceholderText(/Search country or document type/i);

    fireEvent.change(searchInput, { target: { value: 'India' } });
    const clearBtn = screen.getByRole('button', { name: /Clear search/i });

    fireEvent.click(clearBtn);
    expect(searchInput.value).toBe('');
  });
});
