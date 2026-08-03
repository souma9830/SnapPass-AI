import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LanguageProvider } from '../../context/LanguageContext';
import PasswordStrengthMeter from '../../components/PasswordStrengthMeter';

const renderMeter = (password = '') => {
  return render(
    <LanguageProvider>
      <PasswordStrengthMeter password={password} />
    </LanguageProvider>
  );
};

describe('PasswordStrengthMeter', () => {
  it('renders an accessible meter element', () => {
    renderMeter('hello');
    const meter = screen.getByRole('meter');
    expect(meter).toBeInTheDocument();
    expect(meter).toHaveAttribute('aria-valuemin', '0');
    expect(meter).toHaveAttribute('aria-valuemax', '4');
  });

  it('shows Weak for a short password', () => {
    renderMeter('abc');
    expect(screen.getByText('Weak')).toBeInTheDocument();
  });

  it('shows a strong or excellent rating for a long random password', () => {
    renderMeter('k7$Qw9#Zp2!LmR4&xT1@');
    const meter = screen.getByRole('meter');
    expect(Number(meter.getAttribute('aria-valuenow'))).toBeGreaterThanOrEqual(3);
  });

  it('shows no label for an empty password', () => {
    renderMeter('');
    expect(screen.queryByText(/Weak|Medium|Strong|Excellent/)).not.toBeInTheDocument();
  });

  it('updates the strength as the password changes', () => {
    const { rerender } = renderMeter('short');
    expect(screen.getByText('Weak')).toBeInTheDocument();
    rerender(
      <LanguageProvider>
        <PasswordStrengthMeter password="k7$Qw9#Zp2!LmR4&xT1@zZ0!" />
      </LanguageProvider>
    );
    expect(screen.queryByText('Weak')).not.toBeInTheDocument();
    expect(
      Number(screen.getByRole('meter').getAttribute('aria-valuenow'))
    ).toBeGreaterThanOrEqual(3);
  });

  it('displays the entropy value in bits', () => {
    renderMeter('Tr0ub4dor&3');
    expect(screen.getByText(/Entropy:/)).toBeInTheDocument();
  });
});
