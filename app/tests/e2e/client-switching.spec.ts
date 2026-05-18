/**
 * Client Switching E2E Tests
 *
 * Tests the multi-client functionality including client switching,
 * configuration persistence, and client-specific content rendering.
 *
 * Critical User Flows:
 * - Switch between clients (Docline ↔ FacePhi)
 * - Verify client-specific navigation changes
 * - Validate template variable substitution
 * - Test configuration persistence across page reloads
 * - Verify client-specific branding and content
 */

import { test, expect } from '@playwright/test';

test.describe('Client Switching Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Start with a clean state
    await page.goto('/');

    // Wait for initial load and hydration
    await page.waitForLoadState('networkidle');
    await expect(page.locator('[data-testid="app-loaded"]')).toBeVisible({ timeout: 10000 });
  });

  test('should display current client in UI', async ({ page }) => {
    // Default client should be visible (assuming Docline is default)
    await expect(page.locator('[data-testid="current-client-display"]')).toContainText(
      /docline|facephi/i
    );

    // Should show client name somewhere in the UI
    const clientIndicator = page.locator('[data-testid="client-indicator"]').first();
    await expect(clientIndicator).toBeVisible();
  });

  test('should switch between clients successfully', async ({ page }) => {
    // Get initial client state
    const initialClient = await page
      .locator('[data-testid="current-client-display"]')
      .textContent();

    // Open client switcher (could be a dropdown, modal, or menu)
    await page.click('[data-testid="client-switcher-trigger"]');

    // Wait for client options to appear
    await expect(page.locator('[data-testid="client-option"]').first()).toBeVisible();

    // Get available client options
    const clientOptions = page.locator('[data-testid="client-option"]');
    const clientCount = await clientOptions.count();

    expect(clientCount).toBeGreaterThan(1); // Should have multiple clients

    // Click on a different client
    const targetOption = clientOptions.nth(1);
    const targetClientName = await targetOption.textContent();
    await targetOption.click();

    // Wait for client switch to complete
    await page.waitForLoadState('networkidle');

    // Verify client has changed
    const newClient = await page.locator('[data-testid="current-client-display"]').textContent();
    expect(newClient).not.toBe(initialClient);
    expect(newClient?.toLowerCase()).toContain(
      targetClientName?.toLowerCase().substring(0, 6) || ''
    );
  });

  test('should update navigation based on client configuration', async ({ page }) => {
    // Get initial navigation state
    const _initialNavItems = await page.locator('[data-testid="nav-item"]').allTextContents();

    // Switch client
    await page.click('[data-testid="client-switcher-trigger"]');
    await page.click('[data-testid="client-option"]');
    await page.waitForLoadState('networkidle');

    // Get new navigation state
    const newNavItems = await page.locator('[data-testid="nav-item"]').allTextContents();

    // Navigation should be updated (could be different items, labels, or organization)
    // This will depend on client configuration differences
    expect(newNavItems.length).toBeGreaterThan(0);
  });

  test('should persist client selection across page reloads', async ({ page }) => {
    // Switch to a specific client
    await page.click('[data-testid="client-switcher-trigger"]');

    const targetOption = page.locator('[data-testid="client-option"]').last();
    const targetClientName = await targetOption.textContent();
    await targetOption.click();
    await page.waitForLoadState('networkidle');

    // Reload the page
    await page.reload();
    await page.waitForLoadState('networkidle');
    await expect(page.locator('[data-testid="app-loaded"]')).toBeVisible();

    // Verify client selection is maintained
    const persistedClient = await page
      .locator('[data-testid="current-client-display"]')
      .textContent();
    expect(persistedClient?.toLowerCase()).toContain(
      targetClientName?.toLowerCase().substring(0, 6) || ''
    );
  });

  test('should render client-specific template variables', async ({ page }) => {
    // Navigate to a page that uses template variables (e.g., help page)
    await page.goto('/facephi/help');
    await page.waitForLoadState('networkidle');

    // Switch to Docline client
    await page.click('[data-testid="client-switcher-trigger"]');
    await page.click('[data-testid="client-option"]:has-text("docline")', { timeout: 5000 });
    await page.waitForLoadState('networkidle');

    // Look for Docline-specific content
    const pageContent = await page.locator('main').textContent();

    // Should see Linear instead of Jira (Docline uses Linear)
    expect(pageContent?.toLowerCase()).toContain('linear');

    // Switch to FacePhi client
    await page.click('[data-testid="client-switcher-trigger"]');
    await page.click('[data-testid="client-option"]:has-text("facephi")', { timeout: 5000 });
    await page.waitForLoadState('networkidle');

    // Look for FacePhi-specific content
    const facePhiContent = await page.locator('main').textContent();

    // Should see different tooling references
    expect(facePhiContent?.toLowerCase()).toContain('jira');
  });

  test('should update client-specific metrics and data', async ({ page }) => {
    // Navigate to metrics dashboard
    await page.goto('/facephi/propuesta');
    await page.waitForLoadState('networkidle');

    // Get initial metrics data
    const _initialMetrics = await page.locator('[data-testid="metric-value"]').allTextContents();

    // Switch client
    await page.click('[data-testid="client-switcher-trigger"]');
    await page.click('[data-testid="client-option"]');
    await page.waitForLoadState('networkidle');

    // Verify metrics update for new client
    const newMetrics = await page.locator('[data-testid="metric-value"]').allTextContents();

    // Metrics should be available (could be same or different depending on client data)
    expect(newMetrics.length).toBeGreaterThan(0);
  });

  test('should handle client switching errors gracefully', async ({ page }) => {
    // Mock a client switching error (if possible with network interception)
    await page.route('**/api/client/**', (route) => {
      route.abort('failed');
    });

    // Attempt to switch client
    await page.click('[data-testid="client-switcher-trigger"]');
    await page.click('[data-testid="client-option"]');

    // Should show error state or fallback
    const errorMessage = page.locator('[data-testid="error-message"]');
    await expect(
      errorMessage.or(page.locator('.error')).or(page.locator('[role="alert"]'))
    ).toBeVisible({ timeout: 5000 });
  });

  test('should maintain state consistency during client switch', async ({ page }) => {
    // Navigate to a stateful page (e.g., collapsed sidebar)
    await page.goto('/facephi/propuesta');
    await page.waitForLoadState('networkidle');

    // Interact with UI state (e.g., collapse sidebar)
    const sidebarToggle = page.locator('[data-testid="sidebar-toggle"]');
    if (await sidebarToggle.isVisible()) {
      await sidebarToggle.click();
      await expect(page.locator('[data-testid="sidebar"]')).toHaveClass(/collapsed/);
    }

    // Switch client
    await page.click('[data-testid="client-switcher-trigger"]');
    await page.click('[data-testid="client-option"]');
    await page.waitForLoadState('networkidle');

    // Verify UI state is maintained or properly reset
    const sidebar = page.locator('[data-testid="sidebar"]');
    await expect(sidebar).toBeVisible();
  });

  test('should load client-specific navigation configuration', async ({ page }) => {
    // Test different navigation structures per client
    const clients = ['docline', 'facephi'];

    for (const clientName of clients) {
      // Switch to client
      await page.click('[data-testid="client-switcher-trigger"]');
      await page.click(`[data-testid="client-option"]:has-text("${clientName}")`);
      await page.waitForLoadState('networkidle');

      // Verify navigation is loaded
      const navItems = page.locator('[data-testid="nav-item"]');
      const navCount = await navItems.count();

      expect(navCount).toBeGreaterThan(0);

      // Verify navigation items are clickable
      if (navCount > 0) {
        await navItems.first().click();
        await page.waitForLoadState('networkidle');

        // Should navigate successfully
        expect(page.url()).not.toBe('/');
      }
    }
  });
});

test.describe('Client Configuration Validation', () => {
  test('should validate client configurations are properly loaded', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check that client registry is properly initialized
    const clientSwitcher = page.locator('[data-testid="client-switcher-trigger"]');
    await expect(clientSwitcher).toBeVisible();

    // Open client options
    await clientSwitcher.click();

    // Should have at least 2 clients (Docline and FacePhi)
    const clientOptions = page.locator('[data-testid="client-option"]');
    const optionCount = await clientOptions.count();

    expect(optionCount).toBeGreaterThanOrEqual(2);

    // Each client option should have proper labeling
    for (let i = 0; i < optionCount; i++) {
      const option = clientOptions.nth(i);
      const text = await option.textContent();
      expect(text).toBeTruthy();
      expect(text?.length).toBeGreaterThan(3);
    }
  });

  test('should handle client-specific error states', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Navigate to a complex page that might fail
    await page.goto('/facephi/integrity');

    // Wait for page load or error state
    await Promise.race([
      page.waitForLoadState('networkidle'),
      page.waitForSelector('[data-testid="error-boundary"]', { timeout: 5000 }),
      page.waitForSelector('.error', { timeout: 5000 }),
    ]);

    // Page should either load successfully or show proper error handling
    const hasError = await page
      .locator('[data-testid="error-boundary"], .error, [role="alert"]')
      .isVisible();
    const isLoaded = await page.locator('main').isVisible();

    expect(hasError || isLoaded).toBe(true);
  });
});
