import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './SignIn.css'; // Reuse core form structure designs

function SignUp({ darkMode }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignUp = (e) => {
    e.preventDefault();
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setError('');
    console.log('Registering user workflow...', { email });
    navigate('/signin'); // Redirect to login after successful account creation
  };

  return (
    <div className={`auth-page-container ${darkMode ? 'dark-mode' : ''}`}>
      <div className="auth-card">
        <h2>Create Account</h2>
        <p className="auth-subtitle">Join SnapPass-AI today to get started.</p>
        
        {error && <div className="auth-error-alert">{error}</div>}
        
        <form onSubmit={handleSignUp} className="auth-form">
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
              placeholder="Create password"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              required
            />
          </div>
          <button type="submit" className="auth-submit-btn">Sign Up</button>
        </form>
        
        <p className="auth-redirect-text">
          Already have an account? <Link to="/signin" className="auth-link">Sign In</Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
