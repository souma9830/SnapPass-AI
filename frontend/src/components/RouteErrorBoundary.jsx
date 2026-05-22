import React, { Component } from 'react';
import useNetworkStatus from '../hooks/useNetworkStatus';
import './RouteErrorBoundary.css';

class RouteErrorBoundaryInner extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Route loading failed:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const isOffline = !this.props.isOnline;

      const title = isOffline
        ? 'You are offline'
        : 'Something went wrong';

      const subtitle = isOffline
        ? 'Please check your internet connection and try again.'
        : 'We couldn\'t load this part of the app. Please try reloading the page.';

      return (
        <div className="route-error-wrap">
          <div className="route-error-content card">
            <h2 className="section-title">{title}</h2>
            <p className="section-subtitle">{subtitle}</p>
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

function RouteErrorBoundary(props) {
  const isOnline = useNetworkStatus();
  return <RouteErrorBoundaryInner {...props} isOnline={isOnline} />;
}

export default RouteErrorBoundary;
