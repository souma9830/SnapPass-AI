import React from 'react';
import ErrorBoundary from './ErrorBoundary';

export default function withErrorBoundary(WrappedComponent, options = {}) {
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

  function WithErrorBoundary(props) {
    return (
      <ErrorBoundary name={displayName} {...options}>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    );
  }

  WithErrorBoundary.displayName = `withErrorBoundary(${displayName})`;
  return WithErrorBoundary;
}
