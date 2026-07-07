// Vite Environment Variable Pre-build Verification Check
export const verifyViteEnvironment = () => {
  const required = ['VITE_API_URL'];
  const missing = required.filter((key) => !process.env[key] && !import.meta.env?.[key]);
  if (missing.length > 0) {
    console.warn(`[ViteConfigOptimizer] Warning: Missing environment variables: ${missing.join(', ')}`);
  }
  return true;
};
