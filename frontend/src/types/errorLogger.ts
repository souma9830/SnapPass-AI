export interface ErrorLogEntry {
  id: string;
  message: string;
  stack?: string;
  componentStack?: string;
  severity: 'warning' | 'error' | 'fatal';
  timestamp: string;
}
