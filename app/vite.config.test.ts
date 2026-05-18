/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    exclude: [
      'node_modules',
      'tests/visual/**',
      'tests/e2e/**',
      '.claude/**',
      'vite.config.test.ts',
    ],
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'src/test/',
        'src/__tests__/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/*.test.*',
        '**/*.spec.*',
        '**/types.ts',
        '**/index.ts',
        'src/imports/',
        'src/styles/',
        'scripts/',
        '.claude/',
        'docs/',
      ],
      thresholds: {
        global: {
          branches: 60,
          functions: 60,
          lines: 60,
          statements: 60,
        },
        // Specific thresholds for different areas per tech-stack.md requirements
        'src/app/components/features/**': {
          branches: 70,
          functions: 70,
          lines: 70,
          statements: 70,
        },
        'src/app/components/shared/**': {
          branches: 70,
          functions: 70,
          lines: 70,
          statements: 70,
        },
        'src/data/**': {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
        // Business logic (hooks and services) - highest requirements
        'src/app/components/**/use*.ts': {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
      all: true,
      skipFull: false,
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@/components': resolve(__dirname, './src/app/components'),
      '@/data': resolve(__dirname, './src/data'),
      '@/types': resolve(__dirname, './src/types'),
    },
  },
});
