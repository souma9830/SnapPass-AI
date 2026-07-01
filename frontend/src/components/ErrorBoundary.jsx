import React, { Component } from "react";
import "./ErrorBoundary.css";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error("ErrorBoundary caught an uncaught error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = "/";
  };

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-container" role="alert" aria-live="assertive">
          <div className="error-boundary-card">
            <div className="error-icon-wrapper">
              <svg
                className="error-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <h1 className="error-title">Oops! Something went wrong</h1>
            <p className="error-message">
              SnapPass AI encountered an unexpected rendering error. Please try one of the options below.
            </p>
            <div className="error-boundary-actions">
              <button className="error-reset-btn" onClick={this.handleReset}>
                Go to Home
              </button>
              <button
                className="error-retry-btn"
                onClick={this.handleRetry}
              >
                Try Again
              </button>
            </div>
            <div style={{ marginTop: '16px' }}>
              <a
                href="/diagnostics"
                style={{
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: '#2563eb',
                  textDecoration: 'none',
                }}
              >
                🔍 Run System Diagnostics Report
              </a>
            </div>
            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="error-details">
                <summary>Technical Details</summary>
                <pre>{this.state.error.toString()}</pre>
                <pre>{this.state.errorInfo?.componentStack}</pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
