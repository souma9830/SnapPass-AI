import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { LanguageProvider } from '../../context/LanguageContext';
import SignUp from '../../pages/SignUp';

const renderSignUp = () => {
  return render(
    <LanguageProvider>
      <BrowserRouter>
        <SignUp darkMode={false} />
      </BrowserRouter>
    </LanguageProvider>
  );
};

describe('SignUp password security', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('shows the entropy meter below the password field', () => {
    renderSignUp();
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'abc' },
    });
    expect(screen.getByRole('meter')).toBeInTheDocument();
    expect(screen.getByText('Weak')).toBeInTheDocument();
  });

  it('generates a strong password with the generator button', () => {
    renderSignUp();
    const input = screen.getByLabelText('Password');
    fireEvent.click(screen.getByRole('button', { name: 'Generate Strong Password' }));
    expect(input.value.length).toBeGreaterThanOrEqual(12);
  });

  it('enables client-side salt via the toggle', () => {
    renderSignUp();
    const saltToggle = screen.getByRole('checkbox');
    fireEvent.click(saltToggle);
    expect(saltToggle.checked).toBe(true);
  });
});
