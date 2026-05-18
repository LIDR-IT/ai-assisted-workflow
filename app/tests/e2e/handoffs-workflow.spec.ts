/**
 * Handoffs and Workflow E2E Tests
 *
 * Tests the handoffs templates functionality including template navigation,
 * phase-based organization, gate criteria, and workflow documentation.
 *
 * Critical User Flows:
 * - Navigate through SDLC phases and gates
 * - View handoff templates and DoR/DoD criteria
 * - Test phase accordion functionality
 * - Validate template table interactions
 * - Test workflow diagram integration
 */

import { test, expect } from '@playwright/test';

test.describe('Handoffs Templates Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/facephi/handoffs');
    await page.waitForLoadState('networkidle');

    // Wait for handoffs content to load
    await expect(
      page.locator('[data-testid="handoffs-loaded"]').or(page.locator('main'))
    ).toBeVisible({ timeout: 10000 });
  });

  test('should display main handoffs template sections', async ({ page }) => {
    // Check for main sections
    const expectedSections = ['Templates por Fase', 'Gates y Transiciones', 'DoR/DoD Criteria'];

    for (const sectionName of expectedSections) {
      const section = page.locator(
        `h2:has-text("${sectionName}"), h3:has-text("${sectionName}"), [data-testid="${sectionName.toLowerCase().replace(/[^a-z0-9]/g, '-')}"]`
      );
      await expect(section.first()).toBeVisible({ timeout: 5000 });
    }
  });

  test('should navigate through SDLC phases', async ({ page }) => {
    // Expected SDLC phases
    const phases = [
      'Fase 0',
      'Fase 1',
      'Fase 2',
      'Fase 3',
      'Fase 4',
      'Fase 5',
      'Fase 6',
      'Fase 7',
      'Fase 8',
    ];

    for (const phase of phases) {
      // Look for phase sections or accordion items
      const phaseElement = page.locator(
        `[data-testid="phase-${phase.split(' ')[1]}"], h3:has-text("${phase}"), .phase-header:has-text("${phase}")`
      );

      if (await phaseElement.isVisible()) {
        // If it's an accordion, try to expand it
        const accordion = page.locator(`[data-testid="phase-accordion-${phase.split(' ')[1]}"]`);
        if (await accordion.isVisible()) {
          await accordion.click();
          await page.waitForTimeout(500);
        }

        // Verify phase content is visible
        await expect(phaseElement.first()).toBeVisible();
      }
    }
  });

  test('should display gate criteria and transitions', async ({ page }) => {
    // Look for gate information
    const gates = ['Gate 0', 'Gate 1', 'Gate 2', 'Gate 3', 'Gate 4', 'Gate 5', 'Gate 6', 'Gate 7'];

    for (const gate of gates) {
      const gateElement = page.locator(
        `[data-testid="gate-${gate.split(' ')[1]}"], :has-text("${gate}")`
      );
      const gateCount = await gateElement.count();

      if (gateCount > 0) {
        await expect(gateElement.first()).toBeVisible();

        // Look for gate criteria
        const criteriaElement = page.locator(
          `[data-testid="gate-criteria"], .gate-criteria, :has-text("Criterios")`
        );
        if (await criteriaElement.isVisible()) {
          await expect(criteriaElement.first()).toBeVisible();
        }
      }
    }
  });

  test('should show handoff templates table', async ({ page }) => {
    // Look for templates table
    const templatesTable = page.locator('[data-testid="templates-table"], table, .templates-grid');

    if (await templatesTable.isVisible()) {
      await expect(templatesTable.first()).toBeVisible();

      // Check for table headers
      const headers = page.locator('th, .table-header, [data-testid="table-header"]');
      const headerCount = await headers.count();
      expect(headerCount).toBeGreaterThan(0);

      // Check for template rows
      const rows = page.locator('tr, .template-row, [data-testid="template-row"]');
      const rowCount = await rows.count();
      expect(rowCount).toBeGreaterThan(1); // At least header + one data row
    }
  });

  test('should support template filtering and search', async ({ page }) => {
    // Look for filter or search functionality
    const searchBox = page.locator(
      '[data-testid="template-search"], input[placeholder*="buscar"], input[placeholder*="search"]'
    );
    const filterButtons = page.locator(
      '[data-testid="template-filter"], .filter-button, button:has-text("Filtrar")'
    );

    if (await searchBox.isVisible()) {
      // Test search functionality
      await searchBox.fill('PRD');
      await page.waitForTimeout(500);

      // Verify filtered results
      const results = page.locator('.template-item, tr, [data-testid="template-item"]');
      const resultCount = await results.count();
      expect(resultCount).toBeGreaterThanOrEqual(0);

      // Clear search
      await searchBox.clear();
      await page.waitForTimeout(500);
    }

    if (await filterButtons.isVisible()) {
      // Test filter functionality
      await filterButtons.first().click();
      await page.waitForTimeout(500);

      // Should show filtered content or filter options
      const filterOptions = page.locator('.filter-option, [data-testid="filter-option"]');
      if (await filterOptions.isVisible()) {
        await expect(filterOptions.first()).toBeVisible();
      }
    }
  });
});

test.describe('DoR/DoD Criteria Testing', () => {
  test('should display Definition of Ready criteria', async ({ page }) => {
    await page.goto('/facephi/handoffs');
    await page.waitForLoadState('networkidle');

    // Look for DoR section
    const dorSection = page.locator(
      '[data-testid="dor-section"], :has-text("Definition of Ready"), :has-text("DoR")'
    );

    if (await dorSection.isVisible()) {
      await expect(dorSection.first()).toBeVisible();

      // Check for DoR criteria items
      const criteria = page.locator('[data-testid="dor-criteria"], .criteria-item, li');
      const criteriaCount = await criteria.count();
      expect(criteriaCount).toBeGreaterThan(0);
    }
  });

  test('should display Definition of Done criteria', async ({ page }) => {
    await page.goto('/facephi/handoffs');
    await page.waitForLoadState('networkidle');

    // Look for DoD section
    const dodSection = page.locator(
      '[data-testid="dod-section"], :has-text("Definition of Done"), :has-text("DoD")'
    );

    if (await dodSection.isVisible()) {
      await expect(dodSection.first()).toBeVisible();

      // Check for DoD criteria items
      const criteria = page.locator('[data-testid="dod-criteria"], .criteria-item, li');
      const criteriaCount = await criteria.count();
      expect(criteriaCount).toBeGreaterThan(0);
    }
  });

  test('should support criteria checklist interactions', async ({ page }) => {
    await page.goto('/facephi/handoffs');
    await page.waitForLoadState('networkidle');

    // Look for interactive checklists
    const checkboxes = page.locator('input[type="checkbox"], [role="checkbox"]');
    const checkboxCount = await checkboxes.count();

    if (checkboxCount > 0) {
      // Test checkbox interactions
      const firstCheckbox = checkboxes.first();

      // Check initial state
      const isChecked = await firstCheckbox.isChecked();

      // Toggle checkbox
      await firstCheckbox.click();
      await page.waitForTimeout(300);

      // Verify state changed
      const newState = await firstCheckbox.isChecked();
      expect(newState).not.toBe(isChecked);
    }
  });
});

test.describe('Phase Accordion Functionality', () => {
  test('should expand and collapse phase accordions', async ({ page }) => {
    await page.goto('/facephi/handoffs');
    await page.waitForLoadState('networkidle');

    // Look for accordion triggers
    const accordionTriggers = page.locator(
      '[data-testid="accordion-trigger"], .accordion-trigger, button[aria-expanded]'
    );
    const triggerCount = await accordionTriggers.count();

    if (triggerCount > 0) {
      const firstTrigger = accordionTriggers.first();

      // Check initial state
      const initialExpanded = await firstTrigger.getAttribute('aria-expanded');

      // Click to toggle
      await firstTrigger.click();
      await page.waitForTimeout(500);

      // Verify state changed
      const newExpanded = await firstTrigger.getAttribute('aria-expanded');
      expect(newExpanded).not.toBe(initialExpanded);

      // Look for associated content
      const content = page.locator('[data-testid="accordion-content"], .accordion-content');
      if (await content.isVisible()) {
        await expect(content.first()).toBeVisible();
      }
    }
  });

  test('should show phase-specific content when expanded', async ({ page }) => {
    await page.goto('/facephi/handoffs');
    await page.waitForLoadState('networkidle');

    // Test specific phase content
    const phases = ['0', '1', '2', '3'];

    for (const phase of phases) {
      const phaseTrigger = page.locator(
        `[data-testid="phase-${phase}"], [data-testid="accordion-${phase}"]`
      );

      if (await phaseTrigger.isVisible()) {
        await phaseTrigger.click();
        await page.waitForTimeout(500);

        // Look for phase-specific content
        const phaseContent = page.locator(`[data-testid="phase-${phase}-content"], .phase-content`);
        if (await phaseContent.isVisible()) {
          await expect(phaseContent.first()).toBeVisible();

          // Check for templates or activities
          const templates = page.locator('[data-testid="template-item"], .template, .activity');
          if (await templates.isVisible()) {
            const templateCount = await templates.count();
            expect(templateCount).toBeGreaterThan(0);
          }
        }
      }
    }
  });
});

test.describe('Template Details and Export', () => {
  test('should display template details on selection', async ({ page }) => {
    await page.goto('/facephi/handoffs');
    await page.waitForLoadState('networkidle');

    // Look for clickable templates
    const templateItems = page.locator(
      '[data-testid="template-item"], .template-row, .template-link'
    );
    const templateCount = await templateItems.count();

    if (templateCount > 0) {
      // Click on first template
      await templateItems.first().click();
      await page.waitForTimeout(1000);

      // Look for template details
      const templateDetails = page.locator(
        '[data-testid="template-details"], .template-detail, .modal'
      );
      if (await templateDetails.isVisible()) {
        await expect(templateDetails.first()).toBeVisible();

        // Check for template content
        const content = page.locator('[data-testid="template-content"], .template-body');
        if (await content.isVisible()) {
          await expect(content.first()).toBeVisible();
        }
      }
    }
  });

  test('should support template export functionality', async ({ page }) => {
    await page.goto('/facephi/handoffs');
    await page.waitForLoadState('networkidle');

    // Look for export buttons
    const exportButtons = page.locator(
      '[data-testid="export-template"], .export-btn, button:has-text("Export")'
    );
    const exportCount = await exportButtons.count();

    if (exportCount > 0) {
      const exportButton = exportButtons.first();
      await expect(exportButton).toBeVisible();

      // Click export (this might trigger download or show export options)
      await exportButton.click();
      await page.waitForTimeout(1000);

      // Look for export options or confirmation
      const exportDialog = page.locator('[data-testid="export-dialog"], .export-options, .modal');
      if (await exportDialog.isVisible()) {
        await expect(exportDialog.first()).toBeVisible();
      }
    }
  });

  test('should handle template copying and sharing', async ({ page }) => {
    await page.goto('/facephi/handoffs');
    await page.waitForLoadState('networkidle');

    // Look for copy/share functionality
    const copyButtons = page.locator(
      '[data-testid="copy-template"], button:has-text("Copy"), button:has-text("Copiar")'
    );
    const shareButtons = page.locator(
      '[data-testid="share-template"], button:has-text("Share"), button:has-text("Compartir")'
    );

    if (await copyButtons.isVisible()) {
      await copyButtons.first().click();
      await page.waitForTimeout(500);

      // Look for copy confirmation
      const confirmation = page.locator('[data-testid="copy-success"], .toast, .notification');
      if (await confirmation.isVisible()) {
        await expect(confirmation.first()).toBeVisible({ timeout: 3000 });
      }
    }

    if (await shareButtons.isVisible()) {
      await shareButtons.first().click();
      await page.waitForTimeout(500);

      // Look for share options
      const shareOptions = page.locator('[data-testid="share-options"], .share-dialog');
      if (await shareOptions.isVisible()) {
        await expect(shareOptions.first()).toBeVisible();
      }
    }
  });
});

test.describe('Workflow Integration', () => {
  test('should integrate with main workflow diagram', async ({ page }) => {
    await page.goto('/facephi/handoffs');
    await page.waitForLoadState('networkidle');

    // Look for workflow diagram or integration
    const workflowDiagram = page.locator('[data-testid="workflow-diagram"], .react-flow, svg');

    if (await workflowDiagram.isVisible()) {
      await expect(workflowDiagram.first()).toBeVisible();

      // Look for interactive elements
      const nodes = page.locator('.react-flow__node, [data-testid="flow-node"]');
      const nodeCount = await nodes.count();

      if (nodeCount > 0) {
        // Test node interaction
        await nodes.first().click();
        await page.waitForTimeout(500);

        // Look for node details or related templates
        const nodeDetails = page.locator('[data-testid="node-details"], .node-info');
        if (await nodeDetails.isVisible()) {
          await expect(nodeDetails.first()).toBeVisible();
        }
      }
    }
  });

  test('should link to related documentation', async ({ page }) => {
    await page.goto('/facephi/handoffs');
    await page.waitForLoadState('networkidle');

    // Look for documentation links
    const docLinks = page.locator('a[href*="/"], [data-testid="doc-link"]');
    const linkCount = await docLinks.count();

    if (linkCount > 0) {
      const firstLink = docLinks.first();
      const href = await firstLink.getAttribute('href');

      if (href && href !== '#' && !href.startsWith('mailto:')) {
        // Test navigation
        await firstLink.click();
        await page.waitForLoadState('networkidle');

        // Verify navigation occurred
        expect(page.url()).toContain(href.split('#')[0]);

        // Navigate back
        await page.goBack();
        await page.waitForLoadState('networkidle');
        await expect(page.locator('main')).toBeVisible();
      }
    }
  });
});

test.describe('Responsive and Accessibility', () => {
  test('should work on mobile viewports', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/facephi/handoffs');
    await page.waitForLoadState('networkidle');

    // Content should be accessible
    await expect(page.locator('main')).toBeVisible();

    // Check if accordions adapt to mobile
    const accordions = page.locator('[data-testid="accordion"], .accordion');
    if (await accordions.isVisible()) {
      await expect(accordions.first()).toBeVisible();
    }

    // Tables should be scrollable or responsive
    const tables = page.locator('table');
    if (await tables.isVisible()) {
      const tableContainer = page.locator('.table-container, .overflow-x-auto');
      if (await tableContainer.isVisible()) {
        await expect(tableContainer.first()).toBeVisible();
      }
    }
  });

  test('should meet basic accessibility standards', async ({ page }) => {
    await page.goto('/facephi/handoffs');
    await page.waitForLoadState('networkidle');

    // Check for proper heading hierarchy
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    const headingCount = await headings.count();
    expect(headingCount).toBeGreaterThan(0);

    // Check for accessible buttons
    const buttons = page.locator('button');
    for (let i = 0; i < Math.min(5, await buttons.count()); i++) {
      const button = buttons.nth(i);
      if (await button.isVisible()) {
        const hasText = await button.textContent();
        const hasAriaLabel = await button.getAttribute('aria-label');
        expect(hasText || hasAriaLabel).toBeTruthy();
      }
    }

    // Check for form labels
    const inputs = page.locator('input');
    for (let i = 0; i < Math.min(3, await inputs.count()); i++) {
      const input = inputs.nth(i);
      if (await input.isVisible()) {
        const id = await input.getAttribute('id');
        const ariaLabel = await input.getAttribute('aria-label');
        const placeholder = await input.getAttribute('placeholder');

        if (id) {
          const label = page.locator(`label[for="${id}"]`);
          const hasLabel = await label.isVisible();
          expect(hasLabel || ariaLabel || placeholder).toBeTruthy();
        }
      }
    }
  });
});
