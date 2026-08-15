// Dynamic client-side network error logger and analyzer
export const logApiError = (error) => {
  const errorInfo = {
    timestamp: new Date().toISOString(),
    message: error.message || 'Unknown network error',
    url: error.config?.url || 'none',
    method: error.config?.method || 'none',
    status: error.response?.status || 'network_failure'
  };

  console.error('[APIErrorTracker] Network request failed:', errorInfo);
  return errorInfo;
};
