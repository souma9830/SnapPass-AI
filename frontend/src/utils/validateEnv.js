export function validateEnv() {
  const isDev = import.meta.env.DEV;
  if (!isDev) return;

  const required = [
    'VITE_API_URL'
  ];

  const missing = required.filter(key => !import.meta.env[key]);

  if (missing.length > 0) {
    console.warn('%c⚠️ SnapPass AI Configuration Warning:', 'color: orange; font-weight: bold; font-size: 14px;');
    missing.forEach(key => {
      console.warn(`   - import.meta.env.${key} is missing. Please check your frontend/.env file.`);
    });
  }
}
