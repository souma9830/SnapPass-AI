import { ErrorLogEntry } from '../types/errorLogger';

const errorStore: ErrorLogEntry[] = [];

export function logDiagnosticError(
  error: Error,
  componentStack?: string,
  severity: 'warning' | 'error' | 'fatal' = 'error'
): ErrorLogEntry {
  const entry: ErrorLogEntry = {
    id: `err_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    message: error.message || 'Unknown runtime error',
    stack: error.stack,
    componentStack,
    severity,
    timestamp: new Date().toISOString(),
  };

  errorStore.push(entry);
  if (errorStore.length > 50) errorStore.shift();

  console.error(`[SnapPass-AI Diagnostic Error] [${severity.toUpperCase()}]:`, error, componentStack);

  return entry;
}

export function getDiagnosticErrorLogs(): ErrorLogEntry[] {
  return [...errorStore];
}
