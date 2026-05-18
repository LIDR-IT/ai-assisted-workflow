#!/usr/bin/env tsx

/**
 * Baseline Screenshot Capture Script
 *
 * Captures baseline screenshots for visual regression testing before refactoring.
 * Used to ensure 100% visual parity after component refactoring.
 */

import { chromium, firefox, webkit } from 'playwright';
import { promises as fs } from 'fs';
import _path from 'path';

interface TestRoute {
  name: string;
  path: string;
  expectedElements: string[];
}

const criticalRoutes: TestRoute[] = [
  {
    name: 'help-center',
    path: '/help',
    expectedElements: [
      '[data-testid="search-input"]',
      '[data-testid="workflow-cards"]',
      '[data-testid="artifacts-grid"]',
    ],
  },
  {
    name: 'propuesta-mejora',
    path: '/propuesta',
    expectedElements: ['[role="tablist"]', '[role="tabpanel"]', '.react-flow__viewport'],
  },
  {
    name: 'integrity-tests',
    path: '/integrity',
    expectedElements: [
      '[data-testid="test-grid"]',
      '[data-testid="test-summary"]',
      '[data-testid="test-status"]',
    ],
  },
  {
    name: 'handoffs-templates',
    path: '/handoffs',
    expectedElements: [
      '[data-testid="phase-tabs"]',
      '[data-testid="templates-grid"]',
      '[data-testid="gate-criteria"]',
    ],
  },
  {
    name: 'sitemap-view',
    path: '/sitemap',
    expectedElements: [
      '[data-testid="sitemap-tree"]',
      '[data-testid="file-tree"]',
      '[data-testid="route-list"]',
    ],
  },
];

const viewports = [
  { name: 'desktop', width: 1920, height: 1080 },
  { name: 'tablet', width: 1024, height: 768 },
  { name: 'mobile', width: 390, height: 844 },
];

const browsers = [
  { name: 'chromium', launcher: chromium },
  { name: 'firefox', launcher: firefox },
  { name: 'webkit', launcher: webkit },
];

async function ensureDirectories() {
  const dirs = [
    'tests/baselines',
    'tests/baselines/desktop',
    'tests/baselines/tablet',
    'tests/baselines/mobile',
  ];

  for (const dir of dirs) {
    await fs.mkdir(dir, { recursive: true });
  }
}

async function waitForReactFlow(page: any) {
  try {
    await page.waitForSelector('.react-flow__viewport', { timeout: 10000 });
    await page.waitForTimeout(2000); // Allow diagram to render completely
  } catch {
    // No React Flow on this page, continue
  }
}

async function waitForDynamicContent(page: any, route: TestRoute) {
  // Wait for main elements
  for (const selector of route.expectedElements) {
    try {
      await page.waitForSelector(selector, { timeout: 15000 });
    } catch {
      console.warn(`Element ${selector} not found on ${route.path}, continuing...`);
    }
  }

  // Wait for React Flow if present
  await waitForReactFlow(page);

  // Wait for network to be idle
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000); // Additional buffer
}

async function captureBaselines() {
  console.log('🔍 Capturing baseline screenshots for visual regression testing...\n');

  await ensureDirectories();

  for (const browser of browsers) {
    console.log(`📱 Testing with ${browser.name}...`);

    const browserInstance = await browser.launcher.launch({
      headless: true,
    });

    for (const viewport of viewports) {
      console.log(`  📐 Viewport: ${viewport.name} (${viewport.width}x${viewport.height})`);

      const context = await browserInstance.newContext({
        viewport: { width: viewport.width, height: viewport.height },
        reducedMotion: 'reduce',
      });

      const page = await context.newPage();

      // Disable animations
      await page.addStyleTag({
        content: `
          *, *::before, *::after {
            animation-delay: -1ms !important;
            animation-duration: 1ms !important;
            animation-iteration-count: 1 !important;
            background-attachment: initial !important;
            scroll-behavior: auto !important;
            transition-delay: 0ms !important;
            transition-duration: 1ms !important;
          }
        `,
      });

      for (const route of criticalRoutes) {
        console.log(`    📄 ${route.name} (${route.path})`);

        try {
          await page.goto(`http://localhost:5173${route.path}`, {
            waitUntil: 'networkidle',
            timeout: 30000,
          });

          await waitForDynamicContent(page, route);

          const baseFilename = `${route.name}-${browser.name}-${viewport.name}`;

          // Full page screenshot
          await page.screenshot({
            path: `tests/baselines/${viewport.name}/${baseFilename}-fullpage.png`,
            fullPage: true,
            animations: 'disabled',
          });

          // Viewport screenshot
          await page.screenshot({
            path: `tests/baselines/${viewport.name}/${baseFilename}-viewport.png`,
            fullPage: false,
            animations: 'disabled',
          });

          // Component screenshots
          for (const selector of route.expectedElements) {
            try {
              const element = page.locator(selector);
              if ((await element.count()) > 0) {
                await element.first().screenshot({
                  path: `tests/baselines/${viewport.name}/${baseFilename}-${selector.replace(/[^a-zA-Z0-9]/g, '-')}.png`,
                  animations: 'disabled',
                });
              }
            } catch (error) {
              console.warn(`    ⚠️ Could not capture ${selector}: ${error.message}`);
            }
          }

          console.log(`    ✅ Captured baselines for ${route.name}`);
        } catch (error) {
          console.error(`    ❌ Error capturing ${route.name}:`, error.message);
        }
      }

      await context.close();
    }

    await browserInstance.close();
  }

  console.log('\n🎉 Baseline capture complete!');
  console.log('📁 Screenshots saved in tests/baselines/');
}

async function generateManifest() {
  const manifest = {
    capturedAt: new Date().toISOString(),
    routes: criticalRoutes,
    viewports,
    browsers: browsers.map((b) => b.name),
    threshold: 0.002, // <0.2% pixel difference
    version: '1.0.0',
  };

  await fs.writeFile('tests/baselines/manifest.json', JSON.stringify(manifest, null, 2));

  console.log('📋 Baseline manifest created');
}

async function main() {
  try {
    await captureBaselines();
    await generateManifest();
  } catch (error) {
    console.error('❌ Baseline capture failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { captureBaselines, generateManifest };
