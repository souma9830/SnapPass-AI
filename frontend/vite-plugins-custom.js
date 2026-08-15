// Custom plugins descriptor for bundling diagnostics and file size reports
export const buildReportPlugin = () => {
  return {
    name: 'custom-build-report-plugin',
    closeBundle() {
      console.log('[ViteConfigOptimizer] Production build compiled successfully.');
    }
  };
};
