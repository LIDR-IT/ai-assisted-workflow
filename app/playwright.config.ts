/* global */
import { defineConfig, devices } from '@playwright/test';

/**
 * Visual Regression Testing Configuration
 *
 * Setup for automated visual testing of critical components:
 * - HelpCenter.tsx (3,070 lines) - /help route
 * - PropuestaMejora.tsx (2,066 lines) - /propuesta route
 * - IntegrityTests.tsx (2,087 lines) - /integrity route
 * - HandoffsTemplates.tsx (1,862 lines) - /handoffs route
 * - SitemapView.tsx (1,625 lines) - /sitemap route
 */

export default defineConfig({
  testDir: './tests/visual',
  timeout: 30000,
  expect: {
    // Visual comparison threshold: <0.2% pixel difference
    threshold: 0.002,
    toHaveScreenshot: {
      // Animation handling
      animations: 'disabled',
      // More precise comparison
      mode: 'css',
      threshold: 0.002,
    },
  },

  // Run tests in headless browsers
  use: {
    // Base URL for tests
    baseURL: 'http://localhost:5173',
    // Disable animations for consistent screenshots
    reducedMotion: 'reduce',
    // Wait for network to be idle
    waitForLoadState: 'networkidle',
  },

  // Test for multiple viewport sizes
  projects: [
    // Desktop
    {
      name: 'chromium-desktop',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
      },
    },
    {
      name: 'firefox-desktop',
      use: {
        ...devices['Desktop Firefox'],
        viewport: { width: 1920, height: 1080 },
      },
    },

    // Tablet
    {
      name: 'tablet',
      use: {
        ...devices['iPad Pro'],
        viewport: { width: 1024, height: 768 },
      },
    },

    // Mobile
    {
      name: 'mobile',
      use: {
        ...devices['iPhone 12 Pro'],
        viewport: { width: 390, height: 844 },
      },
    },
  ],

  // Web server configuration
  webServer: {
    command: 'npm run dev',
    port: 5173,
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },

  // Test artifacts
  outputDir: 'tests/visual-results',

  // Retry failed tests
  retries: process.env.CI ? 2 : 0,

  // Parallel workers
  workers: process.env.CI ? 1 : undefined,

  // Reporter configuration
  reporter: [
    ['html', { outputFolder: 'tests/visual-reports' }],
    ['json', { outputFile: 'tests/visual-results/results.json' }],
  ],
});
