import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import RouteGuard from '../../routes/RouteGuard';

const renderGuard = () => {
  return render(
    <MemoryRouter initialEntries={['/admin']}>
      <Routes>
        <Route
          path="/admin"
          element={
            <RouteGuard requiredRole="admin">
              <div>Admin Panel Content</div>
            </RouteGuard>
          }
        />
        <Route path="/signin" element={<div>Sign In Page</div>} />
      </Routes>
    </MemoryRouter>
  );
};

describe('RouteGuard', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('renders children for authenticated admins', () => {
    window.localStorage.setItem('token', 'demo-token');
    window.localStorage.setItem('user_role', 'admin');
    renderGuard();
    expect(screen.getByText('Admin Panel Content')).toBeInTheDocument();
    expect(screen.queryByText(/Access Denied/i)).not.toBeInTheDocument();
  });

  it('redirects unauthenticated visitors to the sign in page', () => {
    renderGuard();
    expect(screen.getByText('Sign In Page')).toBeInTheDocument();
    expect(screen.queryByText('Admin Panel Content')).not.toBeInTheDocument();
  });

  it('shows an access denied message for authenticated non-admins', () => {
    window.localStorage.setItem('token', 'demo-token');
    window.localStorage.setItem('user_role', 'user');
    renderGuard();
    expect(screen.getByText('Access Denied')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /Back to Home/i })
    ).toBeInTheDocument();
    expect(screen.queryByText('Admin Panel Content')).not.toBeInTheDocument();
  });

  it('treats users without a stored role as non-admin', () => {
    window.localStorage.setItem('token', 'demo-token');
    renderGuard();
    expect(screen.getByText('Access Denied')).toBeInTheDocument();
  });
});
