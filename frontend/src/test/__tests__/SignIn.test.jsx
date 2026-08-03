import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import SignIn from '../../pages/SignIn';

describe('SignIn autofill support (issue 1380)', () => {
  const renderSignIn = () =>
    render(
      <MemoryRouter>
        <SignIn darkMode={false} />
      </MemoryRouter>
    );

  it('email input supports browser autofill', () => {
    const { getByLabelText } = renderSignIn();
    expect(getByLabelText('Email Address').getAttribute('autoComplete')).toBe('email');
  });

  it('password input supports password-manager autofill', () => {
    const { getByLabelText } = renderSignIn();
    expect(getByLabelText('Password').getAttribute('autoComplete')).toBe('current-password');
  });
});
