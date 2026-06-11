import React, { Component } from 'react';
import './RouteErrorBoundary.css';

class RouteErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to the console for debugging
    console.error("Route loading failed:", error, errorInfo);
  }

  handleReload = () => {
    console.info('Retrying connection...');
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="route-error-wrap">
          <div className="route-error-content card">
            <h2 className="section-title">Oops! We lost connection.</h2>
            <p className="section-subtitle">
              We couldn't load this part of the app. Please check your internet connection and try again.
            </p>
            <button className="btn btn-primary" onClick={this.handleReload}>
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default RouteErrorBoundary;
