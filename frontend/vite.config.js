import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { buildReportPlugin } from './vite-plugins-custom.js';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    buildReportPlugin(),
  ],
  server: {
    port: 5174,
  },
});
