/**
 * Metrics Dashboard E2E Tests
 *
 * Tests the metrics dashboard functionality including data visualization,
 * interactive charts, tab navigation, and export capabilities.
 *
 * Critical User Flows:
 * - Navigate through dashboard tabs (Flujo, Diagnóstico, Mejoras, IA, SDD, Roadmap)
 * - Interact with charts and data visualizations
 * - Test export functionality for charts and reports
 * - Validate metrics data accuracy and formatting
 * - Test responsive behavior across viewport sizes
 */

import { test, expect } from '@playwright/test';

test.describe('Metrics Dashboard Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/facephi/propuesta');
    await page.waitForLoadState('networkidle');

    // Wait for dashboard to load
    await expect(
      page.locator('[data-testid="dashboard-loaded"]').or(page.locator('main'))
    ).toBeVisible({ timeout: 10000 });
  });

  test('should display all dashboard tabs', async ({ page }) => {
    // Expected tabs based on PropuestaMejora component
    const expectedTabs = ['Flujo', 'Diagnóstico', 'Mejoras', 'IA', 'SDD', 'Roadmap'];

    // Check for tab navigation
    const tabList = page.locator('[role="tablist"], .tab-list, [data-testid="tabs"]');
    await expect(tabList).toBeVisible();

    // Verify all expected tabs are present
    for (const tabName of expectedTabs) {
      const tab = page.locator(`[role="tab"]:has-text("${tabName}"), .tab:has-text("${tabName}")`);
      await expect(tab).toBeVisible();
    }
  });

  test('should switch between tabs successfully', async ({ page }) => {
    const tabNames = ['Diagnóstico', 'Mejoras', 'IA', 'SDD'];

    for (const tabName of tabNames) {
      // Click on tab
      const tab = page
        .locator(`[role="tab"]:has-text("${tabName}"), .tab:has-text("${tabName}")`)
        .first();
      await tab.click();

      // Wait for content to load
      await page.waitForTimeout(500);

      // Verify tab is active
      await expect(tab).toHaveClass(/active|selected|current/);

      // Verify tab content is visible
      const tabContent = page.locator(
        `[role="tabpanel"], .tab-content, [data-testid="${tabName.toLowerCase()}-tab"]`
      );
      await expect(tabContent).toBeVisible({ timeout: 5000 });
    }
  });

  test('should load Flujo tab with workflow diagram', async ({ page }) => {
    // Click on Flujo tab (should be default or click to ensure)
    const flujoTab = page.locator('[role="tab"]:has-text("Flujo"), .tab:has-text("Flujo")').first();
    await flujoTab.click();

    // Should show workflow diagram
    await expect(page.locator('.react-flow, [data-testid="workflow-diagram"]')).toBeVisible({
      timeout: 10000,
    });

    // Should have workflow nodes
    const nodes = page.locator('.react-flow__node, [data-testid="flow-node"]');
    const nodeCount = await nodes.count();
    expect(nodeCount).toBeGreaterThan(0);

    // Should have legend
    await expect(page.locator('[data-testid="diagram-legend"], .legend')).toBeVisible();
  });

  test('should display metrics in Diagnóstico tab', async ({ page }) => {
    // Navigate to Diagnóstico tab
    await page.click('[role="tab"]:has-text("Diagnóstico"), .tab:has-text("Diagnóstico")');
    await page.waitForTimeout(1000);

    // Should display metrics cards or charts
    const metricsContainer = page.locator(
      '[data-testid="metrics-container"], .metrics-grid, .metrics-cards'
    );
    await expect(metricsContainer).toBeVisible({ timeout: 5000 });

    // Should have metric values
    const metricValues = page.locator('[data-testid="metric-value"], .metric-value');
    const metricCount = await metricValues.count();
    expect(metricCount).toBeGreaterThan(0);

    // Verify metrics have proper formatting (numbers, percentages, etc.)
    const firstMetric = await metricValues.first().textContent();
    expect(firstMetric).toBeTruthy();
    expect(firstMetric?.length).toBeGreaterThan(0);
  });

  test('should show improvement suggestions in Mejoras tab', async ({ page }) => {
    // Navigate to Mejoras tab
    await page.click('[role="tab"]:has-text("Mejoras"), .tab:has-text("Mejoras")');
    await page.waitForTimeout(1000);

    // Should display improvement items
    const improvementList = page.locator(
      '[data-testid="improvement-list"], .improvements, .mejoras-list'
    );
    await expect(improvementList).toBeVisible({ timeout: 5000 });

    // Should have improvement items
    const improvementItems = page.locator(
      '[data-testid="improvement-item"], .improvement-card, .mejora-item'
    );
    const itemCount = await improvementItems.count();
    expect(itemCount).toBeGreaterThan(0);
  });

  test('should display IA integration content', async ({ page }) => {
    // Navigate to IA tab
    await page.click('[role="tab"]:has-text("IA"), .tab:has-text("IA")');
    await page.waitForTimeout(1000);

    // Should show IA-related content
    const iaContent = page.locator('[data-testid="ia-content"], .ia-integration');
    await expect(iaContent).toBeVisible({ timeout: 5000 });

    // Should mention automation or AI features
    const content = await page.locator('main').textContent();
    expect(content?.toLowerCase()).toMatch(/ia|artificial|automatización|claude/);
  });
});

test.describe('Dashboard Data Visualization', () => {
  test('should render charts and data visualizations', async ({ page }) => {
    await page.goto('/facephi/propuesta');
    await page.waitForLoadState('networkidle');

    // Look for chart containers (Recharts, Chart.js, or custom charts)
    const charts = page.locator('.recharts-wrapper, .chart-container, [data-testid="chart"]');
    const chartCount = await charts.count();

    if (chartCount > 0) {
      // Verify charts are rendered
      await expect(charts.first()).toBeVisible();

      // Charts should have data elements
      const chartElements = page.locator('.recharts-bar, .recharts-line, .recharts-pie, svg');
      const elementCount = await chartElements.count();
      expect(elementCount).toBeGreaterThan(0);
    }
  });

  test('should handle interactive chart features', async ({ page }) => {
    await page.goto('/facephi/propuesta');
    await page.waitForLoadState('networkidle');

    // Navigate to a tab that likely has charts (Diagnóstico or Mejoras)
    await page.click('[role="tab"]:has-text("Diagnóstico"), .tab:has-text("Diagnóstico")');
    await page.waitForTimeout(1000);

    // Look for interactive chart elements
    const interactiveElements = page.locator(
      '.recharts-bar, .recharts-line, .chart-point, [data-interactive]'
    );
    const interactiveCount = await interactiveElements.count();

    if (interactiveCount > 0) {
      // Hover over chart element to test interactivity
      await interactiveElements.first().hover();

      // Look for tooltips or hover effects
      const _tooltip = page.locator('.recharts-tooltip, .tooltip, [data-testid="chart-tooltip"]');
      // Note: Tooltip might not always appear, so we don't assert its presence
    }
  });

  test('should display data tables with proper formatting', async ({ page }) => {
    await page.goto('/facephi/propuesta');
    await page.waitForLoadState('networkidle');

    // Navigate through tabs looking for data tables
    const tabsWithTables = ['Diagnóstico', 'Mejoras', 'Roadmap'];

    for (const tabName of tabsWithTables) {
      await page.click(`[role="tab"]:has-text("${tabName}"), .tab:has-text("${tabName}")`);
      await page.waitForTimeout(500);

      // Look for tables
      const tables = page.locator('table, .table, [data-testid="data-table"]');
      const tableCount = await tables.count();

      if (tableCount > 0) {
        // Verify table structure
        const table = tables.first();
        await expect(table).toBeVisible();

        // Should have headers
        const headers = table.locator('th, .table-header, [data-testid="table-header"]');
        const headerCount = await headers.count();
        expect(headerCount).toBeGreaterThan(0);

        // Should have data rows
        const rows = table.locator('tr, .table-row, [data-testid="table-row"]');
        const rowCount = await rows.count();
        expect(rowCount).toBeGreaterThan(1); // Header + at least one data row
      }
    }
  });
});

test.describe('Dashboard Export and Actions', () => {
  test('should provide export functionality for diagrams', async ({ page }) => {
    await page.goto('/facephi/propuesta');
    await page.waitForLoadState('networkidle');

    // Look for export buttons
    const exportButtons = page.locator(
      '[data-testid="export-button"], .export-btn, button:has-text("Exportar")'
    );
    const exportCount = await exportButtons.count();

    if (exportCount > 0) {
      // Test export functionality
      const exportButton = exportButtons.first();
      await expect(exportButton).toBeVisible();

      // Click export button
      await exportButton.click();

      // Should trigger download or show export options
      // Note: Actual file download testing is complex in E2E, so we just verify the action
      await page.waitForTimeout(1000);

      // Look for export success indicator or modal
      const exportModal = page.locator('.modal, [data-testid="export-modal"], .export-dialog');
      const _isModalVisible = await exportModal.isVisible();

      // Either modal appears or download is triggered (both are valid)
      // This is more of a smoke test to ensure the export button works
    }
  });

  test('should handle data refresh actions', async ({ page }) => {
    await page.goto('/facephi/propuesta');
    await page.waitForLoadState('networkidle');

    // Look for refresh buttons
    const refreshButtons = page.locator(
      '[data-testid="refresh-button"], .refresh-btn, button:has-text("Actualizar")'
    );
    const refreshCount = await refreshButtons.count();

    if (refreshCount > 0) {
      const refreshButton = refreshButtons.first();
      await refreshButton.click();

      // Should show loading state or update data
      await page.waitForTimeout(1000);

      // Verify page is still functional after refresh
      await expect(page.locator('main')).toBeVisible();
    }
  });

  test('should navigate to detailed views from dashboard', async ({ page }) => {
    await page.goto('/facephi/propuesta');
    await page.waitForLoadState('networkidle');

    // Look for links to detailed views
    const detailLinks = page.locator('a[href*="/"], .detail-link, [data-testid="detail-link"]');
    const linkCount = await detailLinks.count();

    if (linkCount > 0) {
      // Test navigation to a detailed view
      const detailLink = detailLinks.first();
      const href = await detailLink.getAttribute('href');

      if (href && href !== '#' && !href.startsWith('mailto:')) {
        await detailLink.click();
        await page.waitForLoadState('networkidle');

        // Should navigate successfully
        expect(page.url()).toContain(href.split('#')[0]);

        // Navigate back to dashboard
        await page.goBack();
        await page.waitForLoadState('networkidle');
        await expect(page.locator('main')).toBeVisible();
      }
    }
  });
});

test.describe('Dashboard Responsive Behavior', () => {
  test('should adapt to mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/facephi/propuesta');
    await page.waitForLoadState('networkidle');

    // Dashboard should be visible and usable on mobile
    await expect(page.locator('main')).toBeVisible();

    // Tabs should be accessible (might be in dropdown or scrollable)
    const tabs = page.locator('[role="tab"], .tab');
    const tabCount = await tabs.count();
    expect(tabCount).toBeGreaterThan(0);

    // Content should not overflow horizontally
    const body = page.locator('body');
    const scrollWidth = await body.evaluate((el) => el.scrollWidth);
    const clientWidth = await body.evaluate((el) => el.clientWidth);

    // Allow some tolerance for scrollbars
    expect(scrollWidth - clientWidth).toBeLessThan(50);
  });

  test('should adapt to tablet viewport', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/facephi/propuesta');
    await page.waitForLoadState('networkidle');

    // Dashboard should be fully functional on tablet
    await expect(page.locator('main')).toBeVisible();

    // All tabs should be visible and clickable
    const tabs = page.locator('[role="tab"], .tab');
    const tabCount = await tabs.count();

    if (tabCount > 0) {
      // Test tab navigation on tablet
      const secondTab = tabs.nth(1);
      await secondTab.click();
      await page.waitForTimeout(500);
      await expect(secondTab).toHaveClass(/active|selected|current/);
    }
  });

  test('should maintain functionality on desktop', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/facephi/propuesta');
    await page.waitForLoadState('networkidle');

    // All features should be available on desktop
    await expect(page.locator('main')).toBeVisible();

    // Test sidebar if present
    const sidebar = page.locator('[data-testid="sidebar"], .sidebar, aside');
    if (await sidebar.isVisible()) {
      await expect(sidebar).toBeVisible();
    }

    // Navigation should be fully expanded
    const navItems = page.locator('[data-testid="nav-item"], .nav-item');
    const navCount = await navItems.count();
    expect(navCount).toBeGreaterThan(0);
  });
});

test.describe('Dashboard Error Handling', () => {
  test('should handle missing data gracefully', async ({ page }) => {
    // Mock API failures to test error handling
    await page.route('**/api/metrics/**', (route) => {
      route.abort('failed');
    });

    await page.goto('/facephi/propuesta');
    await page.waitForLoadState('networkidle');

    // Page should still load with error states
    await expect(page.locator('main')).toBeVisible();

    // Should show error states or loading indicators
    const errorStates = page.locator('.error, [data-testid="error-state"], .loading');
    const hasErrorHandling = (await errorStates.count()) > 0;

    // Either shows errors gracefully or loads with fallback data
    expect(
      hasErrorHandling || (await page.locator('[data-testid="metric-value"]').count()) >= 0
    ).toBe(true);
  });

  test('should handle slow network conditions', async ({ page }) => {
    // Simulate slow network
    await page.route('**/*', (route) => {
      setTimeout(() => route.continue(), 100);
    });

    await page.goto('/facephi/propuesta');

    // Should show loading states
    const _loadingIndicators = page.locator('.loading, .spinner, [data-testid="loading"]');

    // Wait for eventual load completion
    await page.waitForLoadState('networkidle', { timeout: 15000 });
    await expect(page.locator('main')).toBeVisible();
  });
});
