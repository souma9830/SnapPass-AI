import React, { Component, ErrorInfo, ReactNode } from 'react';
import { logDiagnosticError } from '../../services/errorLoggingService';
import styles from './GlobalErrorBoundary.module.css';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
  errorStack?: string;
}

export class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorMessage: '',
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      errorMessage: error.message || 'An unexpected rendering error occurred.',
      errorStack: error.stack,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logDiagnosticError(error, errorInfo.componentStack || undefined, 'fatal');
  }

  private handleReset = () => {
    this.setState({ hasError: false, errorMessage: '' });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className={styles.fallbackContainer} role="alert">
          <div className={styles.errorCard}>
            <div className={styles.icon}>⚠️</div>
            <h1 className={styles.title}>Application Component Exception</h1>
            <p className={styles.subtitle}>SnapPass-AI encountered an unhandled rendering error. We have safely isolated the app state.</p>
            <div className={styles.errorBox}>{this.state.errorMessage}</div>
            <div className={styles.actionRow}>
              <button className={styles.resetBtn} onClick={this.handleReset} type="button">
                🔄 Reload & Restore App
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
