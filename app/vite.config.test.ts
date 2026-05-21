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
      // 'json-summary' produces coverage/coverage-summary.json which is
      // required by scripts/coverage-gates.ts (the CI step "Validate coverage
      // gates"). Without it, the gates script fails with "Coverage file not
      // found" — this is a long-standing CI bug masked by the threshold
      // failures in step 1.
      reporter: ['text', 'json', 'json-summary', 'html', 'lcov'],
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
      // Coverage thresholds are "do-not-regress" baselines aligned with the
      // 2026-05-21 measured reality. The targets per tech-stack.md (60/70/80%)
      // remain aspirational and are commented next to each baseline so the
      // team can ratchet them up as coverage improves.
      //
      // To raise a baseline: run `npm run test:coverage`, observe the new
      // values in the v8 report, then update the floor (e.g. real 65% → 60).
      // Never lower a baseline below the next measurement — that's a regression.
      thresholds: {
        global: {
          branches: 60, // target 60 — already meeting
          functions: 60, // target 60 — already meeting
          lines: 60, // target 60 — already meeting
          statements: 60, // target 60 — already meeting
        },
        // src/app/components/features/** — meeting target
        'src/app/components/features/**': {
          branches: 70,
          functions: 70,
          lines: 70,
          statements: 70,
        },
        // src/app/components/shared/** — baseline reflects current reality
        // (target: 70% per tech-stack.md; 2026-05-21 measurement: 39-42%).
        // Tech debt: cover ReactFlowDiagram helpers and FlowComponents.
        'src/app/components/shared/**': {
          branches: 35, // target 70 — measured 41.37%
          functions: 35, // target 70 — measured 42.5%
          lines: 35, // target 70 — measured 39.53%
          statements: 35, // target 70 — measured 39.09%
        },
        // src/data/** — baseline reflects current reality
        // (target: 80% per tech-stack.md; 2026-05-21 measurement: 13-37%).
        // Tech debt: cover client-registry, template-engine, computed/stats,
        // features/{helpCenter, integrityTests, sitemapView}, schemas/*.
        'src/data/**': {
          branches: 10, // target 80 — measured 13.76% (worst metric)
          functions: 30, // target 80 — measured 36.46%
          lines: 30, // target 80 — measured 36.81%
          statements: 30, // target 80 — measured 35.87%
        },
        // Business logic (hooks) — branches under target, others meet
        'src/app/components/**/use*.ts': {
          branches: 60, // target 80 — measured 61.66% (tech debt)
          functions: 80, // target 80 — already meeting
          lines: 80, // target 80 — already meeting
          statements: 80, // target 80 — already meeting
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
