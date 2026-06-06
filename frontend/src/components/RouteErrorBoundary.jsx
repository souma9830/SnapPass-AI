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
    console.error("Route loading failed:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleResetAppState = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="route-error-wrap">
          <div className="route-error-content card" style={{ padding: '2rem', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <h2 className="section-title">Oops! An unexpected error occurred.</h2>
            <p className="section-subtitle">
              We encountered a runtime problem loading this section.
            </p>
            {this.state.error && (
              <div style={{
                background: 'rgba(255, 0, 0, 0.1)',
                border: '1px solid rgba(255, 0, 0, 0.2)',
                borderRadius: '8px',
                padding: '1rem',
                margin: '1rem 0',
                fontFamily: 'monospace',
                fontSize: '0.85rem',
                textAlign: 'left',
                color: '#ff4d4d',
                overflowX: 'auto'
              }}>
                {this.state.error.toString()}
              </div>
            )}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem' }}>
              <button className="btn btn-primary" onClick={this.handleReload}>
                Reload Page
              </button>
              <button className="btn" style={{ background: 'rgba(255,255,255,0.05)', color: '#fff' }} onClick={this.handleResetAppState}>
                Reset App & Go Home
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
