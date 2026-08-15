import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './SignIn.css';

function SignIn({ darkMode }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignIn = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    // Simulate secure authentication flow
    setError('');
    console.log('Authenticating user...', { email });
    navigate('/upload'); // Redirect to appropriate dashboard/landing page
  };

  return (
    <div className={`auth-page-container ${darkMode ? 'dark-mode' : ''}`}>
      <div className="auth-card">
        <h2>Sign In to SnapPass-AI</h2>
        <p className="auth-subtitle">Welcome back! Please enter your details.</p>
        
        {error && <div className="auth-error-alert">{error}</div>}
        
        <form onSubmit={handleSignIn} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className="auth-submit-btn">Sign In</button>
        </form>
        
        <p className="auth-redirect-text">
          Don't have an account? <Link to="/signup" className="auth-link">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default SignIn;
