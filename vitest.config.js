import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      include: [/\.js$/, /\.jsx$/, /\.ts$/, /\.tsx$/], // ✅ acepta JSX en .js también
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.js',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['src/**/*.{js,jsx,ts,tsx}'],
      exclude: [
        'node_modules/',
        'src/**/*.test.{js,jsx,ts,tsx}',
        'src/**/*.spec.{js,jsx,ts,tsx}',
        '**/*.config.{js,mjs}',
        '**/coverage/**',
        // ignore supabase setup files
        'src/utils/supabase/**',
        'src/middleware/**',
        'src/app/auth/**',
      ],
    },
  },
});
