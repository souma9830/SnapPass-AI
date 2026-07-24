import React from 'react';
import { logError } from '../utils/errorLogger';
import './ErrorBoundary.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    logError(error, {
      componentStack: errorInfo?.componentStack || '',
      boundary: this.props.name || 'ErrorBoundary',
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    });
  };

  handleRetry = () => {
    window.location.reload();
  };

  toggleDetails = () => {
    this.setState((prev) => ({ showDetails: !prev.showDetails }));
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    const { error, showDetails } = this.state;
    const { fallback } = this.props;

    if (fallback) return fallback;

    return (
      <div className="error-boundary-container">
        <div className="error-boundary-card" role="alert">
          <div className="error-icon-wrapper">
            <svg
              className="error-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>

          <h2 className="error-title" aria-live="assertive">Something went wrong</h2>
          <p className="error-message">
            An unexpected error occurred. You can try reloading the page or
            return to the previous screen.
          </p>

          <div className="error-boundary-actions">
            <button className="error-reset-btn" onClick={this.handleReset}>
              Try Again
            </button>
            <button className="error-retry-btn" onClick={this.handleRetry}>
              Reload Page
            </button>
          </div>

          {error && (
            <details className="error-details" open={showDetails}>
              <summary onClick={this.toggleDetails}>
                {showDetails ? 'Hide' : 'Show'} technical details
              </summary>
              <pre>
                {error.name}: {error.message}
                {error.stack ? `\n\n${error.stack}` : ''}
              </pre>
            </details>
          )}
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
