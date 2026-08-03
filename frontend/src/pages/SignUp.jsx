import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './SignIn.css'; // Reuse core form structure designs
import PasswordStrengthMeter from '../components/PasswordStrengthMeter';
import {
  generateSalt,
  appendSalt,
  generateStrongPassword,
} from '../utils/passwordEntropy';

function SignUp({ darkMode }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [saltEnabled, setSaltEnabled] = useState(false);
  const [salt, setSalt] = useState('');
  const navigate = useNavigate();

  const toggleSalt = () => {
    setSaltEnabled((enabled) => {
      const next = !enabled;
      setSalt(next ? generateSalt() : '');
      return next;
    });
  };

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
    const saltedPassword = appendSalt(password, saltEnabled ? salt : '');
    console.log('Registering user workflow...', { email, saltedPassword });
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
            <PasswordStrengthMeter password={password} />
            <div className="password-tools">
              <button
                type="button"
                className="password-tools__generate"
                onClick={() => setPassword(generateStrongPassword())}
              >
                Generate Strong Password
              </button>
              <label className="password-tools__salt">
                <input
                  type="checkbox"
                  checked={saltEnabled}
                  onChange={toggleSalt}
                />
                <span>
                  Add client-side salt
                  <small className="password-tools__salt-hint">
                    Appends a high-entropy salt generated with your browser
                    crypto before saving.
                  </small>
                </span>
              </label>
            </div>
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
