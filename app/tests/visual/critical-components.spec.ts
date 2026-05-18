import { test, expect, Page } from '@playwright/test';

/**
 * Visual Regression Tests for Critical Components
 *
 * Tests the 5 largest components that are candidates for refactoring:
 * - HelpCenter.tsx (3,070 lines) - /help route
 * - PropuestaMejora.tsx (2,066 lines) - /propuesta route
 * - IntegrityTests.tsx (2,087 lines) - /integrity route
 * - HandoffsTemplates.tsx (1,862 lines) - /handoffs route
 * - SitemapView.tsx (1,625 lines) - /sitemap route
 *
 * Purpose: Ensure refactoring maintains 100% visual parity
 */

interface TestRoute {
  name: string;
  path: string;
  expectedElements: string[];
  scrollableAreas?: string[];
}

const criticalRoutes: TestRoute[] = [
  {
    name: 'help-center',
    path: '/facephi/help',
    expectedElements: [
      '[data-testid="search-input"]',
      '[data-testid="workflow-cards"]',
      '[data-testid="artifacts-grid"]',
    ],
    scrollableAreas: ['.overflow-y-auto', '[data-testid="artifacts-grid"]'],
  },
  {
    name: 'propuesta-mejora',
    path: '/facephi/propuesta',
    expectedElements: ['[role="tablist"]', '[role="tabpanel"]', '.react-flow__viewport'],
    scrollableAreas: ['.overflow-y-auto', '[data-testid="metrics-dashboard"]'],
  },
  {
    name: 'integrity-tests',
    path: '/facephi/integrity',
    expectedElements: [
      '[data-testid="test-grid"]',
      '[data-testid="test-summary"]',
      '[data-testid="test-status"]',
    ],
  },
  {
    name: 'handoffs-templates',
    path: '/facephi/handoffs',
    expectedElements: [
      '[data-testid="phase-tabs"]',
      '[data-testid="templates-grid"]',
      '[data-testid="gate-criteria"]',
    ],
    scrollableAreas: ['.overflow-y-auto', '[data-testid="templates-grid"]'],
  },
  {
    name: 'sitemap-view',
    path: '/facephi/sitemap',
    expectedElements: [
      '[data-testid="sitemap-tree"]',
      '[data-testid="file-tree"]',
      '[data-testid="route-list"]',
    ],
    scrollableAreas: ['.overflow-y-auto', '[data-testid="sitemap-tree"]'],
  },
];

// Helper to wait for React Flow diagrams to stabilize
async function waitForReactFlow(page: Page) {
  await page.waitForSelector('.react-flow__viewport', { timeout: 10000 });
  await page.waitForTimeout(2000); // Allow diagram to render completely
}

// Helper to wait for dynamic content
async function waitForDynamicContent(page: Page, route: TestRoute) {
  // Wait for main elements
  for (const selector of route.expectedElements) {
    await page.waitForSelector(selector, { timeout: 15000 });
  }

  // Wait for React Flow if present
  const hasReactFlow = (await page.locator('.react-flow__viewport').count()) > 0;
  if (hasReactFlow) {
    await waitForReactFlow(page);
  }

  // Wait for any loading states to complete
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000); // Additional buffer
}

// Test each critical component
for (const route of criticalRoutes) {
  test.describe(`${route.name} visual regression`, () => {
    test('full page screenshot', async ({ page }) => {
      await page.goto(route.path);
      await waitForDynamicContent(page, route);

      // Take full page screenshot
      await expect(page).toHaveScreenshot(`${route.name}-fullpage.png`, {
        fullPage: true,
        animations: 'disabled',
      });
    });

    test('viewport screenshot', async ({ page }) => {
      await page.goto(route.path);
      await waitForDynamicContent(page, route);

      // Take viewport screenshot
      await expect(page).toHaveScreenshot(`${route.name}-viewport.png`, {
        fullPage: false,
        animations: 'disabled',
      });
    });

    test('component elements', async ({ page }) => {
      await page.goto(route.path);
      await waitForDynamicContent(page, route);

      // Screenshot each expected element
      for (const selector of route.expectedElements) {
        const element = page.locator(selector);
        if ((await element.count()) > 0) {
          await expect(element.first()).toHaveScreenshot(
            `${route.name}-${selector.replace(/[^a-zA-Z0-9]/g, '-')}.png`,
            {
              animations: 'disabled',
            }
          );
        }
      }
    });

    // Test scrollable areas if present
    if (route.scrollableAreas) {
      test('scrollable areas', async ({ page }) => {
        await page.goto(route.path);
        await waitForDynamicContent(page, route);

        for (const scrollSelector of route.scrollableAreas) {
          const scrollArea = page.locator(scrollSelector);
          if ((await scrollArea.count()) > 0) {
            // Screenshot at top
            await expect(scrollArea.first()).toHaveScreenshot(
              `${route.name}-scroll-${scrollSelector.replace(/[^a-zA-Z0-9]/g, '-')}-top.png`,
              {
                animations: 'disabled',
              }
            );

            // Scroll and screenshot
            await scrollArea.first().evaluate((el) => {
              el.scrollTop = el.scrollHeight / 2;
            });
            await page.waitForTimeout(500);

            await expect(scrollArea.first()).toHaveScreenshot(
              `${route.name}-scroll-${scrollSelector.replace(/[^a-zA-Z0-9]/g, '-')}-middle.png`,
              {
                animations: 'disabled',
              }
            );
          }
        }
      });
    }

    // Test interactions for dynamic components
    if (route.name === 'propuesta-mejora') {
      test('tab interactions', async ({ page }) => {
        await page.goto(route.path);
        await waitForDynamicContent(page, route);

        const tabs = page.locator('[role="tab"]');
        const tabCount = await tabs.count();

        for (let i = 0; i < Math.min(tabCount, 6); i++) {
          await tabs.nth(i).click();
          await page.waitForTimeout(1000);

          const tabPanel = page.locator('[role="tabpanel"]');
          await expect(tabPanel).toHaveScreenshot(`${route.name}-tab-${i}.png`, {
            animations: 'disabled',
          });
        }
      });
    }

    if (route.name === 'help-center') {
      test('search functionality visual', async ({ page }) => {
        await page.goto(route.path);
        await waitForDynamicContent(page, route);

        const searchInput = page.locator('[data-testid="search-input"]');
        if ((await searchInput.count()) > 0) {
          // Empty state
          await expect(page.locator('[data-testid="artifacts-grid"]')).toHaveScreenshot(
            `${route.name}-search-empty.png`,
            { animations: 'disabled' }
          );

          // Search with results
          await searchInput.fill('workflow');
          await page.waitForTimeout(1000);
          await expect(page.locator('[data-testid="artifacts-grid"]')).toHaveScreenshot(
            `${route.name}-search-results.png`,
            { animations: 'disabled' }
          );
        }
      });
    }
  });
}

// Cross-browser compatibility test
test.describe('cross-browser visual consistency', () => {
  const sampleRoutes = ['/help', '/propuesta', '/integrity'];

  for (const routePath of sampleRoutes) {
    test(`${routePath} consistency check`, async ({ page, browserName }) => {
      await page.goto(routePath);

      const route = criticalRoutes.find((r) => r.path === routePath);
      if (route) {
        await waitForDynamicContent(page, route);
      }

      await expect(page).toHaveScreenshot(
        `consistency-${routePath.replace('/', '')}-${browserName}.png`,
        {
          fullPage: false,
          animations: 'disabled',
        }
      );
    });
  }
});
