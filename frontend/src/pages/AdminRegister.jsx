import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminRegister.css';

function AdminRegister({ darkMode }) {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/admin/register', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess('Admin account created successfully');
        setTimeout(() => navigate('/admin'), 1500);
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`admin-register-page ${darkMode ? 'admin-register-page-dark' : ''}`}> 
      <h2 className="admin-register-title">Create Admin Account</h2>
      <form className="admin-register-form" onSubmit={handleSubmit}>
        <label>
          Full Name
          <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
        </label>
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <label>
          Confirm Password
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        </label>
        {error && <div className="admin-register-error" role="alert">{error}</div>}
        {success && <div className="admin-register-success" role="status">{success}</div>}
        <button type="submit" disabled={loading} className="admin-register-btn">
          {loading ? 'Creating…' : 'Create Admin'}
        </button>
      </form>
    </div>
  );
}

export default AdminRegister;
