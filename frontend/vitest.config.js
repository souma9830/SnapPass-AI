import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    include: ['src/test/**/*.test.{js,jsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      include: ['src/**/*.{js,jsx}'],
      exclude: [
        'src/test/**',
        'src/**/*.test.{js,jsx}',
        'src/main.jsx',
        'src/**/*.config.*',
        'src/**/index.*',
      ],
      thresholds: {
        lines: 50,
        functions: 50,
        branches: 40,
        statements: 50,
      },
    },
    css: {
      modules: {
        classNameStrategy: 'non-scoped',
      },
    },
    server: {
      deps: {
        inline: ['lucide-react'],
      },
    },
  },
});
