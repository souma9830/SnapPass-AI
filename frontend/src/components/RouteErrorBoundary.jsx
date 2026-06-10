import React, { Component } from 'react';
import './RouteErrorBoundary.css';

class RouteErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("RouteErrorBoundary caught an error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="route-error-wrap">
          <div className="route-error-content card">
            <div className="route-error-icon">⚠️</div>
            <h2 className="section-title">Something went wrong</h2>
            <p className="section-subtitle">
              An unexpected error occurred while loading this view. Please reload or navigate back to the home screen.
            </p>
            
            {this.state.error && (
              <details className="route-error-details">
                <summary>Technical Details</summary>
                <pre>{this.state.error.toString()}</pre>
              </details>
            )}

            <div className="route-error-actions">
              <button className="btn btn-primary" onClick={this.handleReload}>
                Reload Page
              </button>
              <button className="btn btn-secondary" onClick={this.handleGoHome} style={{ marginLeft: '10px' }}>
                Go to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default RouteErrorBoundary;
