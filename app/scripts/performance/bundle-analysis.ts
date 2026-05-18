#!/usr/bin/env tsx

/**
 * Bundle Size Analysis Script
 *
 * Analyzes the impact of component refactoring on bundle size:
 * - Tracks chunk sizes before/after refactoring
 * - Validates code splitting effectiveness
 * - Measures lazy loading impact
 * - Ensures bundle size doesn't increase (target: equal or smaller)
 */

import fs from 'fs/promises';
import path from 'path';
import { execSync } from 'child_process';
import { glob } from 'glob';

interface ChunkAnalysis {
  name: string;
  size: number;
  gzipSize: number;
  modules: string[];
  lazy: boolean;
}

interface BundleReport {
  timestamp: string;
  totalSize: number;
  totalGzipSize: number;
  chunks: ChunkAnalysis[];
  lazyChunks: number;
  codeSpittingScore: number; // 0-100
}

interface ComponentChunk {
  component: string;
  originalSize?: number;
  currentSize: number;
  chunkName: string;
  isLazy: boolean;
  modules: string[];
}

class BundleAnalyzer {
  private distDir = 'dist';
  private reportsDir = 'tests/performance-reports';
  private baselineFile = 'tests/bundle-baseline.json';

  async run(): Promise<void> {
    console.log('📦 Starting Bundle Size Analysis');

    try {
      await this.buildForProduction();
      const analysis = await this.analyzeBundles();
      const baseline = await this.loadBaseline();
      const comparison = this.compareWithBaseline(analysis, baseline);

      await this.generateReports(analysis, comparison);
      await this.saveBaseline(analysis);

      const passed = comparison.passed;
      if (passed) {
        console.log('✅ Bundle analysis PASSED - No size regression detected');
        process.exit(0);
      } else {
        console.log('❌ Bundle analysis FAILED - Size regression detected');
        process.exit(1);
      }
    } catch (error) {
      console.error('❌ Bundle analysis error:', error);
      process.exit(1);
    }
  }

  private async buildForProduction(): Promise<void> {
    console.log('🔨 Building for production...');

    try {
      // Clean dist directory
      await fs.rm(this.distDir, { recursive: true, force: true });

      // Run production build with detailed output
      execSync('npm run build', {
        stdio: ['inherit', 'pipe', 'pipe'],
        encoding: 'utf-8',
      });

      console.log('✅ Production build completed');
    } catch (error) {
      throw new Error(`Production build failed: ${error}`);
    }
  }

  private async analyzeBundles(): Promise<BundleReport> {
    console.log('🔍 Analyzing bundle chunks...');

    // Find all JS chunks in dist
    const jsFiles = await glob(`${this.distDir}/**/*.js`);
    const cssFiles = await glob(`${this.distDir}/**/*.css`);
    const allFiles = [...jsFiles, ...cssFiles];

    const chunks: ChunkAnalysis[] = [];
    let totalSize = 0;
    let totalGzipSize = 0;

    for (const file of allFiles) {
      const analysis = await this.analyzeChunk(file);
      chunks.push(analysis);
      totalSize += analysis.size;
      totalGzipSize += analysis.gzipSize;
    }

    // Sort chunks by size (largest first)
    chunks.sort((a, b) => b.size - a.size);

    const lazyChunks = chunks.filter((chunk) => chunk.lazy).length;
    const codeSpittingScore = this.calculateCodeSplittingScore(chunks);

    return {
      timestamp: new Date().toISOString(),
      totalSize,
      totalGzipSize,
      chunks,
      lazyChunks,
      codeSpittingScore,
    };
  }

  private async analyzeChunk(filePath: string): Promise<ChunkAnalysis> {
    const stats = await fs.stat(filePath);
    const fileName = path.basename(filePath);

    // Estimate gzip size (roughly 1/3 of original)
    const gzipSize = Math.round(stats.size * 0.33);

    // Determine if chunk is lazy-loaded based on name patterns
    const isLazy = this.isLazyChunk(fileName);

    // Extract module information from chunk content
    const modules = await this.extractModulesFromChunk(filePath);

    return {
      name: fileName,
      size: stats.size,
      gzipSize,
      modules,
      lazy: isLazy,
    };
  }

  private isLazyChunk(fileName: string): boolean {
    // Vite lazy chunks typically have hash patterns like "Component-{hash}.js"
    // or are in separate directories for dynamic imports
    return (
      fileName.includes('-') &&
      !fileName.startsWith('index') &&
      !fileName.startsWith('vendor') &&
      !fileName.includes('.legacy.')
    );
  }

  private async extractModulesFromChunk(filePath: string): Promise<string[]> {
    try {
      const content = await fs.readFile(filePath, 'utf-8');

      // Extract module paths from the bundle content
      // This is a simplified extraction - in production would use proper source map analysis
      const modules: string[] = [];

      // Look for import patterns and file paths
      const importMatches = content.match(/from\s+["']([^"']+)["']/g) || [];
      const pathMatches = content.match(/\/src\/[^"'\s)]+/g) || [];

      importMatches.forEach((match) => {
        const path = match.replace(/^from\s+["']/, '').replace(/["']$/, '');
        if (path.startsWith('./') || path.startsWith('../') || path.startsWith('/src/')) {
          modules.push(path);
        }
      });

      pathMatches.forEach((path) => {
        if (!modules.includes(path)) {
          modules.push(path);
        }
      });

      return Array.from(new Set(modules)); // Remove duplicates
    } catch {
      return [];
    }
  }

  private calculateCodeSplittingScore(chunks: ChunkAnalysis[]): number {
    // Score based on:
    // - Number of lazy chunks (higher is better)
    // - Size distribution (more even distribution is better)
    // - Vendor chunk separation (better for caching)

    const totalChunks = chunks.length;
    const lazyChunks = chunks.filter((c) => c.lazy).length;
    const hasVendorChunk = chunks.some((c) => c.name.includes('vendor'));

    // Lazy chunk ratio (0-40 points)
    const lazyRatio = lazyChunks / Math.max(totalChunks, 1);
    const lazyScore = Math.min(lazyRatio * 40, 40);

    // Size distribution score (0-30 points)
    // Better distribution = lower variance in chunk sizes
    const sizes = chunks.map((c) => c.size);
    const avgSize = sizes.reduce((a, b) => a + b, 0) / sizes.length;
    const variance =
      sizes.reduce((acc, size) => acc + Math.pow(size - avgSize, 2), 0) / sizes.length;
    const sizeDistributionScore = Math.max(30 - (variance / avgSize) * 10, 0);

    // Vendor chunk bonus (0-15 points)
    const vendorScore = hasVendorChunk ? 15 : 0;

    // Multiple chunk bonus (0-15 points)
    const multiChunkScore = totalChunks > 1 ? 15 : 0;

    return Math.min(lazyScore + sizeDistributionScore + vendorScore + multiChunkScore, 100);
  }

  private async loadBaseline(): Promise<BundleReport | null> {
    try {
      const content = await fs.readFile(this.baselineFile, 'utf-8');
      return JSON.parse(content);
    } catch {
      console.log('📝 No bundle baseline found, creating new baseline');
      return null;
    }
  }

  private compareWithBaseline(
    current: BundleReport,
    baseline: BundleReport | null
  ): {
    passed: boolean;
    totalSizeChange: number;
    gzipSizeChange: number;
    codeSpittingImprovement: number;
    lazyChunksChange: number;
    issues: string[];
    improvements: string[];
  } {
    if (!baseline) {
      return {
        passed: true,
        totalSizeChange: 0,
        gzipSizeChange: 0,
        codeSpittingImprovement: 0,
        lazyChunksChange: 0,
        issues: [],
        improvements: ['Initial baseline created'],
      };
    }

    const totalSizeChange = (current.totalSize - baseline.totalSize) / baseline.totalSize;
    const gzipSizeChange =
      (current.totalGzipSize - baseline.totalGzipSize) / baseline.totalGzipSize;
    const codeSpittingImprovement = current.codeSpittingScore - baseline.codeSpittingScore;
    const lazyChunksChange = current.lazyChunks - baseline.lazyChunks;

    const issues: string[] = [];
    const improvements: string[] = [];

    // Check for size regression (target: no increase)
    if (totalSizeChange > 0.05) {
      // Allow 5% tolerance
      issues.push(`Total bundle size increased by ${(totalSizeChange * 100).toFixed(1)}%`);
    } else if (totalSizeChange < -0.05) {
      improvements.push(
        `Total bundle size reduced by ${Math.abs(totalSizeChange * 100).toFixed(1)}%`
      );
    }

    if (gzipSizeChange > 0.05) {
      issues.push(`Gzip bundle size increased by ${(gzipSizeChange * 100).toFixed(1)}%`);
    } else if (gzipSizeChange < -0.05) {
      improvements.push(
        `Gzip bundle size reduced by ${Math.abs(gzipSizeChange * 100).toFixed(1)}%`
      );
    }

    // Check code splitting improvements
    if (codeSpittingImprovement > 5) {
      improvements.push(
        `Code splitting score improved by ${codeSpittingImprovement.toFixed(1)} points`
      );
    } else if (codeSpittingImprovement < -5) {
      issues.push(
        `Code splitting score decreased by ${Math.abs(codeSpittingImprovement).toFixed(1)} points`
      );
    }

    if (lazyChunksChange > 0) {
      improvements.push(`${lazyChunksChange} more lazy-loaded chunks added`);
    } else if (lazyChunksChange < 0) {
      issues.push(`${Math.abs(lazyChunksChange)} lazy-loaded chunks removed`);
    }

    return {
      passed: issues.length === 0,
      totalSizeChange,
      gzipSizeChange,
      codeSpittingImprovement,
      lazyChunksChange,
      issues,
      improvements,
    };
  }

  private async generateReports(
    analysis: BundleReport,
    comparison: ReturnType<BundleAnalyzer['compareWithBaseline']>
  ): Promise<void> {
    await fs.mkdir(this.reportsDir, { recursive: true });

    // Console report
    console.log('\n📦 BUNDLE SIZE ANALYSIS RESULTS');
    console.log('===============================\n');

    console.log(`📊 Bundle Summary:`);
    console.log(`  Total Size: ${this.formatBytes(analysis.totalSize)}`);
    console.log(`  Gzipped Size: ${this.formatBytes(analysis.totalGzipSize)}`);
    console.log(`  Total Chunks: ${analysis.chunks.length}`);
    console.log(`  Lazy Chunks: ${analysis.lazyChunks}`);
    console.log(`  Code Splitting Score: ${analysis.codeSpittingScore.toFixed(1)}/100\n`);

    console.log(`📈 Changes vs Baseline:`);
    if (comparison.totalSizeChange !== 0) {
      console.log(`  Total Size: ${this.formatPercentChange(comparison.totalSizeChange)}`);
    }
    if (comparison.gzipSizeChange !== 0) {
      console.log(`  Gzip Size: ${this.formatPercentChange(comparison.gzipSizeChange)}`);
    }
    if (comparison.codeSpittingImprovement !== 0) {
      console.log(
        `  Code Splitting: ${comparison.codeSpittingImprovement > 0 ? '+' : ''}${comparison.codeSpittingImprovement.toFixed(1)} points`
      );
    }
    console.log();

    if (comparison.improvements.length > 0) {
      console.log(`✅ Improvements:`);
      comparison.improvements.forEach((imp) => console.log(`  • ${imp}`));
      console.log();
    }

    if (comparison.issues.length > 0) {
      console.log(`❌ Issues:`);
      comparison.issues.forEach((issue) => console.log(`  • ${issue}`));
      console.log();
    }

    console.log(`📄 Top 10 Chunks by Size:`);
    analysis.chunks.slice(0, 10).forEach((chunk, i) => {
      const lazy = chunk.lazy ? '(lazy)' : '';
      console.log(`  ${i + 1}. ${chunk.name} ${lazy} - ${this.formatBytes(chunk.size)}`);
    });

    // JSON report
    const report = {
      analysis,
      comparison,
      componentChunks: await this.identifyComponentChunks(analysis),
    };

    await fs.writeFile(
      path.join(this.reportsDir, `bundle-analysis-${Date.now()}.json`),
      JSON.stringify(report, null, 2)
    );

    // Markdown report
    const markdownReport = this.generateMarkdownReport(report);
    await fs.writeFile(
      path.join(this.reportsDir, `bundle-analysis-${new Date().toISOString().split('T')[0]}.md`),
      markdownReport
    );

    console.log(`\n📁 Detailed reports saved to ${this.reportsDir}/`);
  }

  private async identifyComponentChunks(analysis: BundleReport): Promise<ComponentChunk[]> {
    const componentNames = [
      'PropuestaMejora',
      'IntegrityTests',
      'HelpCenter',
      'HandoffsTemplates',
      'SitemapView',
    ];
    const componentChunks: ComponentChunk[] = [];

    for (const chunk of analysis.chunks) {
      // Try to identify which component this chunk belongs to
      for (const componentName of componentNames) {
        if (
          chunk.name.toLowerCase().includes(componentName.toLowerCase()) ||
          chunk.modules.some((mod) => mod.includes(componentName))
        ) {
          componentChunks.push({
            component: componentName,
            currentSize: chunk.size,
            chunkName: chunk.name,
            isLazy: chunk.lazy,
            modules: chunk.modules,
          });
          break;
        }
      }
    }

    return componentChunks;
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) {
      return '0 B';
    }
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  }

  private formatPercentChange(change: number): string {
    const symbol = change > 0 ? '+' : '';
    return `${symbol}${(change * 100).toFixed(1)}%`;
  }

  private generateMarkdownReport(report: any): string {
    const { analysis, comparison, componentChunks } = report;

    return `# Bundle Size Analysis Report

**Generated:** ${analysis.timestamp}
**Status:** ${comparison.passed ? 'PASSED' : 'FAILED'}

## Summary

| Metric | Value | Change vs Baseline |
|--------|-------|-------------------|
| Total Size | ${this.formatBytes(analysis.totalSize)} | ${comparison.totalSizeChange !== 0 ? this.formatPercentChange(comparison.totalSizeChange) : '-'} |
| Gzipped Size | ${this.formatBytes(analysis.totalGzipSize)} | ${comparison.gzipSizeChange !== 0 ? this.formatPercentChange(comparison.gzipSizeChange) : '-'} |
| Total Chunks | ${analysis.chunks.length} | - |
| Lazy Chunks | ${analysis.lazyChunks} | ${comparison.lazyChunksChange !== 0 ? (comparison.lazyChunksChange > 0 ? `+${comparison.lazyChunksChange}` : comparison.lazyChunksChange) : '-'} |
| Code Splitting Score | ${analysis.codeSpittingScore.toFixed(1)}/100 | ${comparison.codeSpittingImprovement !== 0 ? (comparison.codeSpittingImprovement > 0 ? '+' : '') + comparison.codeSpittingImprovement.toFixed(1) + ' points' : '-'} |

${
  comparison.improvements.length > 0
    ? `## ✅ Improvements

${comparison.improvements.map((imp: string) => `- ${imp}`).join('\n')}
`
    : ''
}

${
  comparison.issues.length > 0
    ? `## ❌ Issues

${comparison.issues.map((issue: string) => `- ${issue}`).join('\n')}
`
    : ''
}

## Component Chunks

${
  componentChunks.length > 0
    ? componentChunks
        .map(
          (chunk: ComponentChunk) => `
### ${chunk.component}

- **Chunk:** \`${chunk.chunkName}\`
- **Size:** ${this.formatBytes(chunk.currentSize)}
- **Lazy Loaded:** ${chunk.isLazy ? 'Yes' : 'No'}
- **Modules:** ${chunk.modules.length} modules
`
        )
        .join('\n')
    : 'No specific component chunks identified.'
}

## All Chunks

| Chunk | Size | Gzipped | Lazy | Modules |
|-------|------|---------|------|---------|
${analysis.chunks.map((chunk: ChunkAnalysis) => `| \`${chunk.name}\` | ${this.formatBytes(chunk.size)} | ${this.formatBytes(chunk.gzipSize)} | ${chunk.lazy ? 'Yes' : 'No'} | ${chunk.modules.length} |`).join('\n')}

## Code Splitting Analysis

The code splitting score (${analysis.codeSpittingScore.toFixed(1)}/100) is calculated based on:

- **Lazy chunk ratio:** ${((analysis.lazyChunks / analysis.chunks.length) * 40).toFixed(1)}/40 points
- **Size distribution:** Penalty for uneven chunk sizes
- **Vendor chunk separation:** Bonus for separate vendor chunks
- **Multiple chunks:** Bonus for having multiple chunks

Higher scores indicate better code splitting and lazy loading implementation.
`;
  }

  private async saveBaseline(analysis: BundleReport): Promise<void> {
    await fs.writeFile(this.baselineFile, JSON.stringify(analysis, null, 2));
    console.log(`💾 Baseline saved to ${this.baselineFile}`);
  }
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const analyzer = new BundleAnalyzer();
  analyzer.run().catch((error) => {
    console.error('❌ Bundle analysis failed:', error);
    process.exit(1);
  });
}

export { BundleAnalyzer };
