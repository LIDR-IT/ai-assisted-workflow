#!/usr/bin/env tsx

/**
 * Refactoring Validation Script
 *
 * Compares current screenshots with baselines to validate that refactoring
 * maintains 100% visual parity. Uses <0.2% pixel difference threshold.
 */

import { chromium } from 'playwright';
import { promises as fs } from 'fs';
import { PNG } from 'pngjs';

interface ComparisonResult {
  route: string;
  viewport: string;
  browser: string;
  type: string;
  pixelDiff: number;
  percentage: number;
  passed: boolean;
  baselinePath: string;
  currentPath: string;
  diffPath?: string;
}

const THRESHOLD = 0.002; // 0.2% pixel difference

async function compareImages(
  baselinePath: string,
  currentPath: string,
  diffPath: string
): Promise<{ pixelDiff: number; percentage: number }> {
  try {
    const baselineBuffer = await fs.readFile(baselinePath);
    const currentBuffer = await fs.readFile(currentPath);

    const baseline = PNG.sync.read(baselineBuffer);
    const current = PNG.sync.read(currentBuffer);

    if (baseline.width !== current.width || baseline.height !== current.height) {
      throw new Error('Image dimensions do not match');
    }

    const diff = new PNG({ width: baseline.width, height: baseline.height });
    let pixelDiff = 0;
    const totalPixels = baseline.width * baseline.height;

    for (let y = 0; y < baseline.height; y++) {
      for (let x = 0; x < baseline.width; x++) {
        const idx = (baseline.width * y + x) << 2;

        const rDiff = Math.abs(baseline.data[idx] - current.data[idx]);
        const gDiff = Math.abs(baseline.data[idx + 1] - current.data[idx + 1]);
        const bDiff = Math.abs(baseline.data[idx + 2] - current.data[idx + 2]);
        const aDiff = Math.abs(baseline.data[idx + 3] - current.data[idx + 3]);

        const totalDiff = rDiff + gDiff + bDiff + aDiff;

        if (totalDiff > 0) {
          pixelDiff++;
          diff.data[idx] = 255; // Red
          diff.data[idx + 1] = 0;
          diff.data[idx + 2] = 0;
          diff.data[idx + 3] = 255;
        } else {
          diff.data[idx] = baseline.data[idx];
          diff.data[idx + 1] = baseline.data[idx + 1];
          diff.data[idx + 2] = baseline.data[idx + 2];
          diff.data[idx + 3] = baseline.data[idx + 3];
        }
      }
    }

    // Save diff image if there are differences
    if (pixelDiff > 0) {
      await fs.writeFile(diffPath, PNG.sync.write(diff));
    }

    const percentage = pixelDiff / totalPixels;
    return { pixelDiff, percentage };
  } catch (error) {
    console.error(`Error comparing images: ${error.message}`);
    return { pixelDiff: Infinity, percentage: 1 };
  }
}

async function captureCurrentScreenshots() {
  console.log('📸 Capturing current screenshots for comparison...\n');

  const browser = await chromium.launch({ headless: true });

  const routes = [
    { name: 'help-center', path: '/help' },
    { name: 'propuesta-mejora', path: '/propuesta' },
    { name: 'integrity-tests', path: '/integrity' },
    { name: 'handoffs-templates', path: '/handoffs' },
    { name: 'sitemap-view', path: '/sitemap' },
  ];

  const viewports = [
    { name: 'desktop', width: 1920, height: 1080 },
    { name: 'tablet', width: 1024, height: 768 },
    { name: 'mobile', width: 390, height: 844 },
  ];

  // Ensure comparison directories exist
  await fs.mkdir('tests/current', { recursive: true });
  await fs.mkdir('tests/diffs', { recursive: true });

  for (const viewport of viewports) {
    await fs.mkdir(`tests/current/${viewport.name}`, { recursive: true });
    await fs.mkdir(`tests/diffs/${viewport.name}`, { recursive: true });

    const context = await browser.newContext({
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

    for (const route of routes) {
      console.log(`  📄 ${route.name} - ${viewport.name}`);

      try {
        await page.goto(`http://localhost:5173${route.path}`, {
          waitUntil: 'networkidle',
          timeout: 30000,
        });

        // Wait for React Flow if present
        try {
          await page.waitForSelector('.react-flow__viewport', { timeout: 5000 });
          await page.waitForTimeout(2000);
        } catch {
          // No React Flow, continue
        }

        await page.waitForTimeout(1000);

        const baseFilename = `${route.name}-chromium-${viewport.name}`;

        // Full page screenshot
        await page.screenshot({
          path: `tests/current/${viewport.name}/${baseFilename}-fullpage.png`,
          fullPage: true,
          animations: 'disabled',
        });

        // Viewport screenshot
        await page.screenshot({
          path: `tests/current/${viewport.name}/${baseFilename}-viewport.png`,
          fullPage: false,
          animations: 'disabled',
        });

        console.log(`    ✅ Captured ${route.name}`);
      } catch (error) {
        console.error(`    ❌ Error capturing ${route.name}:`, error.message);
      }
    }

    await context.close();
  }

  await browser.close();
  console.log('\n📸 Current screenshot capture complete!');
}

async function runComparisons(): Promise<ComparisonResult[]> {
  console.log('🔍 Running visual comparisons...\n');

  const results: ComparisonResult[] = [];

  const routes = [
    'help-center',
    'propuesta-mejora',
    'integrity-tests',
    'handoffs-templates',
    'sitemap-view',
  ];

  const viewports = ['desktop', 'tablet', 'mobile'];
  const types = ['fullpage', 'viewport'];

  for (const viewport of viewports) {
    console.log(`📐 ${viewport} comparisons:`);

    for (const route of routes) {
      for (const type of types) {
        const baseFilename = `${route}-chromium-${viewport}-${type}.png`;
        const baselinePath = `tests/baselines/${viewport}/${baseFilename}`;
        const currentPath = `tests/current/${viewport}/${baseFilename}`;
        const diffPath = `tests/diffs/${viewport}/${route}-${type}-diff.png`;

        try {
          // Check if baseline exists
          await fs.access(baselinePath);

          // Check if current exists
          await fs.access(currentPath);

          const { pixelDiff, percentage } = await compareImages(
            baselinePath,
            currentPath,
            diffPath
          );

          const passed = percentage <= THRESHOLD;

          const result: ComparisonResult = {
            route,
            viewport,
            browser: 'chromium',
            type,
            pixelDiff,
            percentage,
            passed,
            baselinePath,
            currentPath,
            diffPath: pixelDiff > 0 ? diffPath : undefined,
          };

          results.push(result);

          const status = passed ? '✅' : '❌';
          const percentStr = (percentage * 100).toFixed(4);
          console.log(`  ${status} ${route}-${type}: ${percentStr}% diff (${pixelDiff} pixels)`);
        } catch (error) {
          console.error(`  ⚠️ Could not compare ${route}-${type}: ${error.message}`);
          results.push({
            route,
            viewport,
            browser: 'chromium',
            type,
            pixelDiff: Infinity,
            percentage: 1,
            passed: false,
            baselinePath,
            currentPath,
          });
        }
      }
    }
    console.log();
  }

  return results;
}

async function generateReport(results: ComparisonResult[]) {
  const report = {
    timestamp: new Date().toISOString(),
    threshold: THRESHOLD,
    summary: {
      total: results.length,
      passed: results.filter((r) => r.passed).length,
      failed: results.filter((r) => !r.passed).length,
      passRate: results.length > 0 ? results.filter((r) => r.passed).length / results.length : 0,
    },
    results,
    failedTests: results.filter((r) => !r.passed),
  };

  await fs.writeFile('tests/visual-comparison-report.json', JSON.stringify(report, null, 2));

  console.log('📋 Visual Comparison Report');
  console.log('═══════════════════════════');
  console.log(`Total Tests: ${report.summary.total}`);
  console.log(`Passed: ${report.summary.passed} ✅`);
  console.log(`Failed: ${report.summary.failed} ❌`);
  console.log(`Pass Rate: ${(report.summary.passRate * 100).toFixed(2)}%`);
  console.log(`Threshold: ${(THRESHOLD * 100).toFixed(2)}% pixel difference`);

  if (report.summary.failed > 0) {
    console.log('\n❌ Failed Tests:');
    report.failedTests.forEach((test) => {
      const percentStr = (test.percentage * 100).toFixed(4);
      console.log(`  ${test.route}-${test.type} (${test.viewport}): ${percentStr}% diff`);
      if (test.diffPath) {
        console.log(`    Diff image: ${test.diffPath}`);
      }
    });

    console.log('\n🔍 Next Steps:');
    console.log('1. Review diff images in tests/diffs/');
    console.log('2. If differences are expected, update baselines');
    console.log('3. If differences are unexpected, fix the refactoring');

    return false; // Validation failed
  } else {
    console.log('\n🎉 All visual tests passed! Refactoring maintains 100% visual parity.');
    return true; // Validation passed
  }
}

async function main() {
  try {
    await captureCurrentScreenshots();
    const results = await runComparisons();
    const passed = await generateReport(results);

    process.exit(passed ? 0 : 1);
  } catch (error) {
    console.error('❌ Validation failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { captureCurrentScreenshots, runComparisons, generateReport };
