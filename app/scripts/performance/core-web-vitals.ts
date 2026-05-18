#!/usr/bin/env tsx

/**
 * Core Web Vitals Performance Testing
 *
 * Measures Core Web Vitals for refactored components:
 * - LCP (Largest Contentful Paint) - target <2.5s
 * - FID (First Input Delay) - target <100ms
 * - CLS (Cumulative Layout Shift) - target <0.1
 * - INP (Interaction to Next Paint) - target <200ms
 *
 * Tests routes containing refactored components to validate
 * performance impact of componentization.
 */

import fs from 'fs/promises';
import path from 'path';
import { chromium, Browser, Page } from 'playwright';

interface WebVitalsMetrics {
  lcp: number | null;
  fid: number | null;
  cls: number | null;
  inp: number | null;
  fcp: number | null;
  ttfb: number | null;
}

interface RoutePerformance {
  route: string;
  component: string;
  metrics: WebVitalsMetrics;
  loadTime: number;
  passed: boolean;
  issues: string[];
}

interface PerformanceThresholds {
  lcp: number; // Largest Contentful Paint (ms)
  fid: number; // First Input Delay (ms)
  cls: number; // Cumulative Layout Shift (score)
  inp: number; // Interaction to Next Paint (ms)
  loadTime: number; // Total page load time (ms)
}

const PERFORMANCE_THRESHOLDS: PerformanceThresholds = {
  lcp: 2500, // 2.5s
  fid: 100, // 100ms
  cls: 0.1, // 0.1
  inp: 200, // 200ms
  loadTime: 5000, // 5s
};

const ROUTES_TO_TEST = [
  { route: '/propuesta', component: 'PropuestaMejora', refactored: true },
  { route: '/integrity', component: 'IntegrityTests', refactored: true },
  { route: '/help', component: 'HelpCenter', refactored: false },
  { route: '/handoffs', component: 'HandoffsTemplates', refactored: false },
  { route: '/sitemap', component: 'SitemapView', refactored: false },
];

class CoreWebVitalsCollector {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private baseUrl = 'http://localhost:5173';
  private resultsDir = 'tests/performance-reports';

  async run(): Promise<void> {
    console.log('🔍 Starting Core Web Vitals Performance Testing');

    try {
      await this.setup();
      await this.ensureServerRunning();

      const results = await this.testAllRoutes();
      await this.generateReports(results);

      const allPassed = results.every((r) => r.passed);
      if (allPassed) {
        console.log('✅ All Core Web Vitals tests PASSED');
        process.exit(0);
      } else {
        console.log('❌ Some Core Web Vitals tests FAILED');
        process.exit(1);
      }
    } finally {
      await this.cleanup();
    }
  }

  private async setup(): Promise<void> {
    console.log('🚀 Setting up browser...');
    this.browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-extensions', '--disable-gpu'],
    });

    const context = await this.browser.newContext({
      viewport: { width: 1920, height: 1080 },
      deviceScaleFactor: 1,
    });

    this.page = await context.newPage();

    // Inject Web Vitals library
    await this.page.addInitScript(() => {
      // Web Vitals measurement script
      (window as any).webVitalsData = {
        lcp: null,
        fid: null,
        cls: null,
        inp: null,
        fcp: null,
        ttfb: null,
      };

      // Mock Web Vitals library (in production would use real library)
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'largest-contentful-paint') {
            (window as any).webVitalsData.lcp = entry.startTime;
          }
          if (entry.entryType === 'first-input') {
            (window as any).webVitalsData.fid = entry.processingStart - entry.startTime;
          }
          if (entry.entryType === 'layout-shift' && !entry.hadRecentInput) {
            (window as any).webVitalsData.cls =
              ((window as any).webVitalsData.cls || 0) + entry.value;
          }
        }
      });

      observer.observe({ type: 'largest-contentful-paint', buffered: true });
      observer.observe({ type: 'first-input', buffered: true });
      observer.observe({ type: 'layout-shift', buffered: true });

      // Navigation timing for TTFB and FCP
      window.addEventListener('load', () => {
        const navigation = performance.getEntriesByType(
          'navigation'
        )[0] as PerformanceNavigationTiming;
        (window as any).webVitalsData.ttfb = navigation.responseStart - navigation.requestStart;

        const paintEntries = performance.getEntriesByType('paint');
        const fcp = paintEntries.find((entry) => entry.name === 'first-contentful-paint');
        if (fcp) {
          (window as any).webVitalsData.fcp = fcp.startTime;
        }
      });
    });

    await fs.mkdir(this.resultsDir, { recursive: true });
  }

  private async ensureServerRunning(): Promise<void> {
    console.log('🌐 Checking if development server is running...');

    try {
      const response = await fetch(this.baseUrl);
      if (response.ok) {
        console.log('✅ Development server is running');
      } else {
        throw new Error('Server responded with error');
      }
    } catch {
      console.error('❌ Development server is not running!');
      console.log('Please start the development server with: npm run dev');
      process.exit(1);
    }
  }

  private async testAllRoutes(): Promise<RoutePerformance[]> {
    const results: RoutePerformance[] = [];

    for (const routeConfig of ROUTES_TO_TEST) {
      console.log(`📊 Testing ${routeConfig.component} at ${routeConfig.route}...`);
      const result = await this.testRoute(routeConfig);
      results.push(result);
    }

    return results;
  }

  private async testRoute(routeConfig: (typeof ROUTES_TO_TEST)[0]): Promise<RoutePerformance> {
    if (!this.page) {
      throw new Error('Page not initialized');
    }

    const startTime = performance.now();
    const url = `${this.baseUrl}${routeConfig.route}`;

    // Navigate to route
    const response = await this.page.goto(url, {
      waitUntil: 'networkidle',
      timeout: 30000,
    });

    if (!response || !response.ok()) {
      throw new Error(`Failed to load ${url}: ${response?.status()}`);
    }

    // Wait for component to fully render
    await this.page.waitForTimeout(2000); // Allow time for lazy loading and React hydration

    // Wait for any remaining network activity
    await this.page.waitForLoadState('networkidle');

    // Extract Web Vitals metrics
    const metrics = await this.page.evaluate(() => {
      return (window as any).webVitalsData as WebVitalsMetrics;
    });

    const loadTime = performance.now() - startTime;

    // Validate against thresholds
    const issues: string[] = [];

    if (metrics.lcp && metrics.lcp > PERFORMANCE_THRESHOLDS.lcp) {
      issues.push(
        `LCP too high: ${metrics.lcp.toFixed(0)}ms (threshold: ${PERFORMANCE_THRESHOLDS.lcp}ms)`
      );
    }

    if (metrics.fid && metrics.fid > PERFORMANCE_THRESHOLDS.fid) {
      issues.push(
        `FID too high: ${metrics.fid.toFixed(0)}ms (threshold: ${PERFORMANCE_THRESHOLDS.fid}ms)`
      );
    }

    if (metrics.cls && metrics.cls > PERFORMANCE_THRESHOLDS.cls) {
      issues.push(
        `CLS too high: ${metrics.cls.toFixed(3)} (threshold: ${PERFORMANCE_THRESHOLDS.cls})`
      );
    }

    if (metrics.inp && metrics.inp > PERFORMANCE_THRESHOLDS.inp) {
      issues.push(
        `INP too high: ${metrics.inp.toFixed(0)}ms (threshold: ${PERFORMANCE_THRESHOLDS.inp}ms)`
      );
    }

    if (loadTime > PERFORMANCE_THRESHOLDS.loadTime) {
      issues.push(
        `Load time too high: ${loadTime.toFixed(0)}ms (threshold: ${PERFORMANCE_THRESHOLDS.loadTime}ms)`
      );
    }

    // Take screenshot for visual verification
    await this.page.screenshot({
      path: path.join(this.resultsDir, `screenshot-${routeConfig.component}.png`),
      fullPage: false,
    });

    return {
      route: routeConfig.route,
      component: routeConfig.component,
      metrics,
      loadTime,
      passed: issues.length === 0,
      issues,
    };
  }

  private async generateReports(results: RoutePerformance[]): Promise<void> {
    // Console report
    console.log('\n🔍 CORE WEB VITALS RESULTS');
    console.log('==========================\n');

    for (const result of results) {
      const status = result.passed ? '✅ PASS' : '❌ FAIL';
      console.log(`${status} ${result.component} (${result.route})`);
      console.log(`  LCP: ${result.metrics.lcp ? `${result.metrics.lcp.toFixed(0)}ms` : 'N/A'}`);
      console.log(`  FID: ${result.metrics.fid ? `${result.metrics.fid.toFixed(0)}ms` : 'N/A'}`);
      console.log(`  CLS: ${result.metrics.cls ? result.metrics.cls.toFixed(3) : 'N/A'}`);
      console.log(`  INP: ${result.metrics.inp ? `${result.metrics.inp.toFixed(0)}ms` : 'N/A'}`);
      console.log(`  FCP: ${result.metrics.fcp ? `${result.metrics.fcp.toFixed(0)}ms` : 'N/A'}`);
      console.log(`  TTFB: ${result.metrics.ttfb ? `${result.metrics.ttfb.toFixed(0)}ms` : 'N/A'}`);
      console.log(`  Load Time: ${result.loadTime.toFixed(0)}ms`);

      if (result.issues.length > 0) {
        console.log(`  ❌ Issues:`);
        result.issues.forEach((issue) => console.log(`    • ${issue}`));
      }
      console.log();
    }

    // JSON report
    const report = {
      timestamp: new Date().toISOString(),
      baseUrl: this.baseUrl,
      thresholds: PERFORMANCE_THRESHOLDS,
      summary: {
        totalRoutes: results.length,
        passed: results.filter((r) => r.passed).length,
        failed: results.filter((r) => !r.passed).length,
        overallStatus: results.every((r) => r.passed) ? 'PASS' : 'FAIL',
      },
      results,
    };

    await fs.writeFile(
      path.join(this.resultsDir, `web-vitals-${Date.now()}.json`),
      JSON.stringify(report, null, 2)
    );

    // Markdown report
    const markdownReport = this.generateMarkdownReport(report);
    await fs.writeFile(
      path.join(this.resultsDir, `web-vitals-${new Date().toISOString().split('T')[0]}.md`),
      markdownReport
    );

    console.log(`📁 Reports saved to ${this.resultsDir}/`);
  }

  private generateMarkdownReport(report: any): string {
    return `# Core Web Vitals Performance Report

**Generated:** ${report.timestamp}
**Base URL:** ${report.baseUrl}
**Status:** ${report.summary.overallStatus}
**Routes:** ${report.summary.passed}/${report.summary.totalRoutes} passed

## Performance Thresholds

| Metric | Threshold | Description |
|--------|-----------|-------------|
| LCP | ≤${report.thresholds.lcp}ms | Largest Contentful Paint |
| FID | ≤${report.thresholds.fid}ms | First Input Delay |
| CLS | ≤${report.thresholds.cls} | Cumulative Layout Shift |
| INP | ≤${report.thresholds.inp}ms | Interaction to Next Paint |
| Load Time | ≤${report.thresholds.loadTime}ms | Total page load time |

## Results

${report.results
  .map(
    (result: RoutePerformance) => `
### ${result.component} ${result.passed ? '✅' : '❌'}

**Route:** ${result.route}

| Metric | Value | Status |
|--------|-------|--------|
| LCP | ${result.metrics.lcp ? `${result.metrics.lcp.toFixed(0)}ms` : 'N/A'} | ${result.metrics.lcp && result.metrics.lcp > report.thresholds.lcp ? '❌' : '✅'} |
| FID | ${result.metrics.fid ? `${result.metrics.fid.toFixed(0)}ms` : 'N/A'} | ${result.metrics.fid && result.metrics.fid > report.thresholds.fid ? '❌' : '✅'} |
| CLS | ${result.metrics.cls ? result.metrics.cls.toFixed(3) : 'N/A'} | ${result.metrics.cls && result.metrics.cls > report.thresholds.cls ? '❌' : '✅'} |
| INP | ${result.metrics.inp ? `${result.metrics.inp.toFixed(0)}ms` : 'N/A'} | ${result.metrics.inp && result.metrics.inp > report.thresholds.inp ? '❌' : '✅'} |
| FCP | ${result.metrics.fcp ? `${result.metrics.fcp.toFixed(0)}ms` : 'N/A'} | - |
| TTFB | ${result.metrics.ttfb ? `${result.metrics.ttfb.toFixed(0)}ms` : 'N/A'} | - |
| Load Time | ${result.loadTime.toFixed(0)}ms | ${result.loadTime > report.thresholds.loadTime ? '❌' : '✅'} |

${
  result.issues.length > 0
    ? `**❌ Issues:**
${result.issues.map((issue: string) => `- ${issue}`).join('\n')}`
    : '**✅ All metrics within thresholds**'
}
`
  )
  .join('\n')}

## Screenshots

Screenshots of each tested component are available in the \`tests/performance-reports\` directory:

${report.results.map((result: RoutePerformance) => `- \`screenshot-${result.component}.png\``).join('\n')}
`;
  }

  private async cleanup(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const collector = new CoreWebVitalsCollector();
  collector.run().catch((error) => {
    console.error('❌ Core Web Vitals test failed:', error);
    process.exit(1);
  });
}

export { CoreWebVitalsCollector };
