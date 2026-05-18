#!/usr/bin/env tsx

/**
 * Memory Profiling Script
 *
 * Tracks memory usage improvements from component refactoring:
 * - Measures heap usage before/after component mounting
 * - Validates memory leak prevention
 * - Tracks virtualization benefits for large lists
 * - Target: 20%+ memory reduction for virtualized components
 */

import fs from 'fs/promises';
import path from 'path';
import { chromium, Browser, Page } from 'playwright';

interface MemorySnapshot {
  timestamp: number;
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
  domNodes: number;
  eventListeners: number;
}

interface ComponentMemoryProfile {
  component: string;
  route: string;
  refactored: boolean;
  snapshots: {
    beforeMount: MemorySnapshot;
    afterMount: MemorySnapshot;
    afterInteraction: MemorySnapshot;
    afterUnmount?: MemorySnapshot;
  };
  analysis: {
    mountMemoryIncrease: number;
    interactionMemoryIncrease: number;
    memoryLeakDetected: boolean;
    domNodesCount: number;
    eventListenersCount: number;
    passed: boolean;
    issues: string[];
  };
}

interface MemoryReport {
  timestamp: string;
  profiles: ComponentMemoryProfile[];
  summary: {
    totalComponents: number;
    passedComponents: number;
    failedComponents: number;
    averageMemoryReduction: number;
    memoryLeaksDetected: number;
  };
  thresholds: {
    maxMemoryIncrease: number; // 50MB
    maxMemoryLeak: number; // 5MB
    maxDomNodes: number; // 1000 nodes
    maxEventListeners: number; // 100 listeners
  };
}

const MEMORY_THRESHOLDS = {
  maxMemoryIncrease: 50 * 1024 * 1024, // 50MB
  maxMemoryLeak: 5 * 1024 * 1024, // 5MB
  maxDomNodes: 1000,
  maxEventListeners: 100,
};

const COMPONENTS_TO_PROFILE = [
  { component: 'PropuestaMejora', route: '/propuesta', refactored: true },
  { component: 'IntegrityTests', route: '/integrity', refactored: true },
  { component: 'HelpCenter', route: '/help', refactored: false },
];

class MemoryProfiler {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private baseUrl = 'http://localhost:5173';
  private reportsDir = 'tests/performance-reports';

  async run(): Promise<void> {
    console.log('🧠 Starting Memory Profiling');

    try {
      await this.setup();
      await this.ensureServerRunning();

      const profiles = await this.profileAllComponents();
      const report = await this.generateReport(profiles);

      const passed = report.summary.failedComponents === 0;
      if (passed) {
        console.log('✅ Memory profiling PASSED - No memory issues detected');
        process.exit(0);
      } else {
        console.log('❌ Memory profiling FAILED - Memory issues detected');
        process.exit(1);
      }
    } catch (error) {
      console.error('❌ Memory profiling error:', error);
      process.exit(1);
    } finally {
      await this.cleanup();
    }
  }

  private async setup(): Promise<void> {
    console.log('🚀 Setting up browser for memory profiling...');

    this.browser = await chromium.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-dev-shm-usage',
        '--disable-extensions',
        '--disable-gpu',
        '--enable-precise-memory-info', // Enable precise memory measurements
      ],
    });

    const context = await this.browser.newContext({
      viewport: { width: 1920, height: 1080 },
    });

    this.page = await context.newPage();

    // Enable memory profiling
    await this.page.addInitScript(() => {
      // Force garbage collection if available (Chrome dev builds)
      if ('gc' in window && typeof (window as any).gc === 'function') {
        (window as any).forceGC = () => (window as any).gc();
      } else {
        // Fallback: create temporary objects to trigger GC
        (window as any).forceGC = () => {
          const arr = [];
          for (let i = 0; i < 100000; i++) {
            arr.push({});
          }
          arr.length = 0;
        };
      }
    });

    await fs.mkdir(this.reportsDir, { recursive: true });
  }

  private async ensureServerRunning(): Promise<void> {
    try {
      const response = await fetch(this.baseUrl);
      if (!response.ok) {
        throw new Error('Server not responding');
      }
      console.log('✅ Development server is running');
    } catch {
      throw new Error('Development server is not running. Please start with: npm run dev');
    }
  }

  private async profileAllComponents(): Promise<ComponentMemoryProfile[]> {
    const profiles: ComponentMemoryProfile[] = [];

    for (const config of COMPONENTS_TO_PROFILE) {
      console.log(`🧠 Profiling memory for ${config.component}...`);
      const profile = await this.profileComponent(config);
      profiles.push(profile);
    }

    return profiles;
  }

  private async profileComponent(
    config: (typeof COMPONENTS_TO_PROFILE)[0]
  ): Promise<ComponentMemoryProfile> {
    if (!this.page) {
      throw new Error('Page not initialized');
    }

    // Force garbage collection before starting
    await this.page.evaluate(() => (window as any).forceGC?.());
    await this.page.waitForTimeout(1000);

    // Baseline memory snapshot
    const beforeMount = await this.takeMemorySnapshot();

    // Navigate to component
    const url = `${this.baseUrl}${config.route}`;
    await this.page.goto(url, { waitUntil: 'networkidle' });
    await this.page.waitForTimeout(2000); // Allow component to fully mount

    // Memory after mounting
    const afterMount = await this.takeMemorySnapshot();

    // Perform interactions to test memory during usage
    await this.interactWithComponent(config.component);
    await this.page.waitForTimeout(1000);

    // Memory after interactions
    const afterInteraction = await this.takeMemorySnapshot();

    // Navigate away to test memory cleanup
    await this.page.goto(`${this.baseUrl}/`);
    await this.page.waitForTimeout(1000);

    // Force garbage collection and measure
    await this.page.evaluate(() => (window as any).forceGC?.());
    await this.page.waitForTimeout(2000);

    const afterUnmount = await this.takeMemorySnapshot();

    // Analyze memory usage
    const analysis = this.analyzeMemoryUsage({
      beforeMount,
      afterMount,
      afterInteraction,
      afterUnmount,
    });

    return {
      component: config.component,
      route: config.route,
      refactored: config.refactored,
      snapshots: {
        beforeMount,
        afterMount,
        afterInteraction,
        afterUnmount,
      },
      analysis,
    };
  }

  private async takeMemorySnapshot(): Promise<MemorySnapshot> {
    if (!this.page) {
      throw new Error('Page not initialized');
    }

    const memoryInfo = await this.page.evaluate(() => {
      const memory = (performance as any).memory;
      return {
        usedJSHeapSize: memory?.usedJSHeapSize || 0,
        totalJSHeapSize: memory?.totalJSHeapSize || 0,
        jsHeapSizeLimit: memory?.jsHeapSizeLimit || 0,
      };
    });

    const domInfo = await this.page.evaluate(() => {
      return {
        domNodes: document.querySelectorAll('*').length,
        eventListeners: (window as any).getEventListeners
          ? Object.keys((window as any).getEventListeners(document)).length
          : 0,
      };
    });

    return {
      timestamp: Date.now(),
      ...memoryInfo,
      ...domInfo,
    };
  }

  private async interactWithComponent(componentName: string): Promise<void> {
    if (!this.page) {
      return;
    }

    try {
      // Component-specific interactions
      switch (componentName) {
        case 'PropuestaMejora': {
          // Click through tabs to load lazy components
          const tabs = await this.page.locator('button').all();
          for (const tab of tabs.slice(0, 3)) {
            await tab.click({ timeout: 1000 });
            await this.page.waitForTimeout(500);
          }
          break;
        }

        case 'IntegrityTests': {
          // Run some tests
          const runButton = this.page.locator('button:has-text("Run All")');
          if ((await runButton.count()) > 0) {
            await runButton.click();
            await this.page.waitForTimeout(2000);
          }
          break;
        }

        case 'HelpCenter': {
          // Perform search to trigger list rendering
          const searchInput = this.page.locator('input[type="text"]');
          if ((await searchInput.count()) > 0) {
            await searchInput.fill('skill');
            await this.page.waitForTimeout(1000);
            await searchInput.clear();
          }
          break;
        }
      }
    } catch (error) {
      console.warn(`Warning: Could not interact with ${componentName}:`, error);
    }
  }

  private analyzeMemoryUsage(
    snapshots: ComponentMemoryProfile['snapshots']
  ): ComponentMemoryProfile['analysis'] {
    const { beforeMount, afterMount, afterInteraction, afterUnmount } = snapshots;

    const mountMemoryIncrease = afterMount.usedJSHeapSize - beforeMount.usedJSHeapSize;
    const interactionMemoryIncrease = afterInteraction.usedJSHeapSize - afterMount.usedJSHeapSize;

    // Check for memory leaks (memory should return close to baseline after unmount)
    const memoryLeak = afterUnmount ? afterUnmount.usedJSHeapSize - beforeMount.usedJSHeapSize : 0;
    const memoryLeakDetected = memoryLeak > MEMORY_THRESHOLDS.maxMemoryLeak;

    const issues: string[] = [];

    if (mountMemoryIncrease > MEMORY_THRESHOLDS.maxMemoryIncrease) {
      issues.push(`High memory increase on mount: ${this.formatBytes(mountMemoryIncrease)}`);
    }

    if (memoryLeakDetected) {
      issues.push(
        `Memory leak detected: ${this.formatBytes(memoryLeak)} not released after unmount`
      );
    }

    if (afterMount.domNodes > MEMORY_THRESHOLDS.maxDomNodes) {
      issues.push(`High DOM node count: ${afterMount.domNodes} nodes`);
    }

    if (afterMount.eventListeners > MEMORY_THRESHOLDS.maxEventListeners) {
      issues.push(`High event listener count: ${afterMount.eventListeners} listeners`);
    }

    return {
      mountMemoryIncrease,
      interactionMemoryIncrease,
      memoryLeakDetected,
      domNodesCount: afterMount.domNodes,
      eventListenersCount: afterMount.eventListeners,
      passed: issues.length === 0,
      issues,
    };
  }

  private async generateReport(profiles: ComponentMemoryProfile[]): Promise<MemoryReport> {
    const passedComponents = profiles.filter((p) => p.analysis.passed).length;
    const failedComponents = profiles.length - passedComponents;
    const memoryLeaksDetected = profiles.filter((p) => p.analysis.memoryLeakDetected).length;

    // Calculate average memory reduction for refactored components
    const refactoredProfiles = profiles.filter((p) => p.refactored);
    const averageMemoryReduction =
      refactoredProfiles.length > 0
        ? refactoredProfiles.reduce((acc, p) => acc + p.analysis.mountMemoryIncrease, 0) /
          refactoredProfiles.length
        : 0;

    const report: MemoryReport = {
      timestamp: new Date().toISOString(),
      profiles,
      summary: {
        totalComponents: profiles.length,
        passedComponents,
        failedComponents,
        averageMemoryReduction,
        memoryLeaksDetected,
      },
      thresholds: MEMORY_THRESHOLDS,
    };

    // Console output
    console.log('\n🧠 MEMORY PROFILING RESULTS');
    console.log('===========================\n');

    for (const profile of profiles) {
      const status = profile.analysis.passed ? '✅ PASS' : '❌ FAIL';
      console.log(
        `${status} ${profile.component} ${profile.refactored ? '(refactored)' : '(original)'}`
      );
      console.log(`  Mount Memory: +${this.formatBytes(profile.analysis.mountMemoryIncrease)}`);
      console.log(`  DOM Nodes: ${profile.analysis.domNodesCount}`);
      console.log(`  Event Listeners: ${profile.analysis.eventListenersCount}`);
      console.log(`  Memory Leak: ${profile.analysis.memoryLeakDetected ? 'Yes' : 'No'}`);

      if (profile.analysis.issues.length > 0) {
        console.log(`  Issues:`);
        profile.analysis.issues.forEach((issue) => console.log(`    • ${issue}`));
      }
      console.log();
    }

    console.log('📊 Summary:');
    console.log(`  Components Tested: ${report.summary.totalComponents}`);
    console.log(`  Passed: ${report.summary.passedComponents}`);
    console.log(`  Failed: ${report.summary.failedComponents}`);
    console.log(`  Memory Leaks: ${report.summary.memoryLeaksDetected}`);

    // Save JSON report
    await fs.writeFile(
      path.join(this.reportsDir, `memory-profile-${Date.now()}.json`),
      JSON.stringify(report, null, 2)
    );

    // Save markdown report
    const markdownReport = this.generateMarkdownReport(report);
    await fs.writeFile(
      path.join(this.reportsDir, `memory-profile-${new Date().toISOString().split('T')[0]}.md`),
      markdownReport
    );

    console.log(`\n📁 Memory profiling reports saved to ${this.reportsDir}/`);

    return report;
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) {
      return '0 B';
    }
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(Math.abs(bytes)) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  }

  private generateMarkdownReport(report: MemoryReport): string {
    return `# Memory Profiling Report

**Generated:** ${report.timestamp}
**Status:** ${report.summary.failedComponents === 0 ? 'PASSED' : 'FAILED'}

## Summary

| Metric | Value |
|--------|-------|
| Components Tested | ${report.summary.totalComponents} |
| Passed | ${report.summary.passedComponents} |
| Failed | ${report.summary.failedComponents} |
| Memory Leaks Detected | ${report.summary.memoryLeaksDetected} |
| Average Memory Usage | ${this.formatBytes(report.summary.averageMemoryReduction)} |

## Thresholds

| Threshold | Value |
|-----------|-------|
| Max Memory Increase | ${this.formatBytes(report.thresholds.maxMemoryIncrease)} |
| Max Memory Leak | ${this.formatBytes(report.thresholds.maxMemoryLeak)} |
| Max DOM Nodes | ${report.thresholds.maxDomNodes} |
| Max Event Listeners | ${report.thresholds.maxEventListeners} |

## Component Profiles

${report.profiles
  .map(
    (profile) => `
### ${profile.component} ${profile.analysis.passed ? '✅' : '❌'}

**Route:** ${profile.route}
**Refactored:** ${profile.refactored ? 'Yes' : 'No'}

| Metric | Value |
|--------|-------|
| Mount Memory Increase | ${this.formatBytes(profile.analysis.mountMemoryIncrease)} |
| Interaction Memory Increase | ${this.formatBytes(profile.analysis.interactionMemoryIncrease)} |
| DOM Nodes | ${profile.analysis.domNodesCount} |
| Event Listeners | ${profile.analysis.eventListenersCount} |
| Memory Leak Detected | ${profile.analysis.memoryLeakDetected ? 'Yes' : 'No'} |

#### Memory Timeline

| Phase | Used Heap | Total Heap | DOM Nodes |
|-------|-----------|------------|-----------|
| Before Mount | ${this.formatBytes(profile.snapshots.beforeMount.usedJSHeapSize)} | ${this.formatBytes(profile.snapshots.beforeMount.totalJSHeapSize)} | ${profile.snapshots.beforeMount.domNodes} |
| After Mount | ${this.formatBytes(profile.snapshots.afterMount.usedJSHeapSize)} | ${this.formatBytes(profile.snapshots.afterMount.totalJSHeapSize)} | ${profile.snapshots.afterMount.domNodes} |
| After Interaction | ${this.formatBytes(profile.snapshots.afterInteraction.usedJSHeapSize)} | ${this.formatBytes(profile.snapshots.afterInteraction.totalJSHeapSize)} | ${profile.snapshots.afterInteraction.domNodes} |
| After Unmount | ${profile.snapshots.afterUnmount ? this.formatBytes(profile.snapshots.afterUnmount.usedJSHeapSize) : 'N/A'} | ${profile.snapshots.afterUnmount ? this.formatBytes(profile.snapshots.afterUnmount.totalJSHeapSize) : 'N/A'} | ${profile.snapshots.afterUnmount ? profile.snapshots.afterUnmount.domNodes : 'N/A'} |

${
  profile.analysis.issues.length > 0
    ? `#### Issues

${profile.analysis.issues.map((issue) => `- ${issue}`).join('\n')}`
    : '#### ✅ No memory issues detected'
}
`
  )
  .join('\n')}

## Recommendations

Based on the memory profiling results:

${
  report.profiles.some((p) => p.analysis.memoryLeakDetected)
    ? `
### 🔴 Critical: Memory Leaks Detected

Memory leaks were detected in one or more components. This can lead to performance degradation over time.

**Action Items:**
- Review event listener cleanup in useEffect cleanup functions
- Check for uncancelled timers or intervals
- Verify React refs are properly cleaned up
- Consider using React.memo() for expensive components
`
    : ''
}

${
  report.profiles.some((p) => p.analysis.domNodesCount > 500)
    ? `
### 🟡 Warning: High DOM Node Count

Some components are creating a large number of DOM nodes, which can impact rendering performance.

**Recommendations:**
- Implement virtualization for large lists (react-window or similar)
- Consider lazy loading for heavy components
- Review component structure for unnecessary nesting
`
    : ''
}

${
  report.profiles.filter((p) => p.refactored && p.analysis.passed).length > 0
    ? `
### ✅ Success: Refactored Components

The refactored components show good memory performance:
${report.profiles
  .filter((p) => p.refactored && p.analysis.passed)
  .map((p) => `- ${p.component}: ${this.formatBytes(p.analysis.mountMemoryIncrease)} memory usage`)
  .join('\n')}
`
    : ''
}
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
  const profiler = new MemoryProfiler();
  profiler.run().catch((error) => {
    console.error('❌ Memory profiling failed:', error);
    process.exit(1);
  });
}

export { MemoryProfiler };
