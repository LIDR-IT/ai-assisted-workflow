/* global */
/**
 * Performance Validation Configuration
 *
 * Centralized configuration for all performance benchmarking thresholds,
 * component targets, and validation settings.
 */

export interface ComponentTarget {
  name: string;
  originalLines: number;
  targetLines: number;
  refactored: boolean;
  path: string;
  lazy: boolean; // Should be lazy-loaded after refactoring
}

export interface PerformanceThresholds {
  // Bundle analysis thresholds
  bundle: {
    sizeRegression: number; // Max allowed bundle size regression (0 = no regression)
    codeSplittingMinScore: number; // Minimum code splitting score (0-100)
    lazyChunksMin: number; // Minimum number of lazy chunks expected
  };

  // Core Web Vitals thresholds (milliseconds)
  webVitals: {
    lcp: number; // Largest Contentful Paint
    fid: number; // First Input Delay
    cls: number; // Cumulative Layout Shift
    inp: number; // Interaction to Next Paint
    loadTime: number; // Total page load time
  };

  // Memory usage thresholds (bytes)
  memory: {
    maxMountIncrease: number; // Max memory increase on component mount
    maxMemoryLeak: number; // Max memory leak after unmount
    maxDomNodes: number; // Max DOM nodes per component
    maxEventListeners: number; // Max event listeners per component
  };

  // Component complexity thresholds
  component: {
    complexityReduction: number; // Min complexity reduction expected (0-1)
    linesTolerancePercent: number; // Allowed variance from target lines (0-1)
  };
}

// Component targets for refactoring validation
export const COMPONENT_TARGETS: ComponentTarget[] = [
  {
    name: 'PropuestaMejora',
    originalLines: 2066,
    targetLines: 300,
    refactored: true,
    path: 'src/app/components/features/propuesta-mejora/PropuestaMejora.tsx',
    lazy: true,
  },
  {
    name: 'IntegrityTests',
    originalLines: 2087,
    targetLines: 350,
    refactored: true,
    path: 'src/app/components/features/integrity-tests/IntegrityTests.tsx',
    lazy: true,
  },
  {
    name: 'HelpCenter',
    originalLines: 3070,
    targetLines: 400,
    refactored: false, // Will be refactored by Agent C1
    path: 'src/app/components/diagrams/HelpCenter.tsx',
    lazy: false,
  },
  {
    name: 'HandoffsTemplates',
    originalLines: 1800, // Estimated
    targetLines: 350,
    refactored: false, // Will be refactored by Agent D1
    path: 'src/app/components/diagrams/HandoffsTemplates.tsx',
    lazy: false,
  },
  {
    name: 'SitemapView',
    originalLines: 1500, // Estimated
    targetLines: 300,
    refactored: false, // Will be refactored by Agent D2
    path: 'src/app/components/diagrams/SitemapView.tsx',
    lazy: false,
  },
];

// Performance thresholds configuration
export const PERFORMANCE_THRESHOLDS: PerformanceThresholds = {
  bundle: {
    sizeRegression: 0, // No bundle size regression allowed
    codeSplittingMinScore: 60, // Minimum code splitting score
    lazyChunksMin: 3, // At least 3 lazy chunks expected
  },

  webVitals: {
    lcp: 2500, // 2.5 seconds
    fid: 100, // 100 milliseconds
    cls: 0.1, // 0.1 cumulative layout shift
    inp: 200, // 200 milliseconds
    loadTime: 5000, // 5 seconds
  },

  memory: {
    maxMountIncrease: 50 * 1024 * 1024, // 50MB
    maxMemoryLeak: 5 * 1024 * 1024, // 5MB
    maxDomNodes: 1000, // 1,000 DOM nodes
    maxEventListeners: 100, // 100 event listeners
  },

  component: {
    complexityReduction: 0.5, // 50% complexity reduction expected
    linesTolerancePercent: 0.1, // 10% tolerance on target lines
  },
};

// Routes to test for Core Web Vitals
export const WEB_VITALS_ROUTES = [
  { route: '/propuesta', component: 'PropuestaMejora', refactored: true },
  { route: '/integrity', component: 'IntegrityTests', refactored: true },
  { route: '/help', component: 'HelpCenter', refactored: false },
  { route: '/handoffs', component: 'HandoffsTemplates', refactored: false },
  { route: '/sitemap', component: 'SitemapView', refactored: false },
];

// Memory profiling routes (subset requiring dev server)
export const MEMORY_PROFILING_ROUTES = [
  { component: 'PropuestaMejora', route: '/propuesta', refactored: true },
  { component: 'IntegrityTests', route: '/integrity', refactored: true },
  { component: 'HelpCenter', route: '/help', refactored: false },
];

// Development server configuration
export const DEV_SERVER_CONFIG = {
  url: 'http://localhost:5173',
  timeout: 30000, // 30 second timeout for server checks
  retries: 3, // Number of retries for server connection
};

// Report configuration
export const REPORT_CONFIG = {
  outputDir: 'tests/performance-reports',
  baselinesDir: 'tests',
  screenshotsDir: 'tests/performance-reports/screenshots',
  retainReports: 10, // Keep last 10 reports
  formats: ['json', 'markdown', 'console'] as const,
};

// CI/CD configuration hints
export const CI_CONFIG = {
  skipWebVitals: process.env.CI === 'true' && !process.env.ENABLE_BROWSER_TESTS,
  skipMemoryProfiling: process.env.CI === 'true' && !process.env.ENABLE_MEMORY_PROFILING,
  headless: process.env.CI === 'true',
  timeout: process.env.CI === 'true' ? 120000 : 30000, // 2 minutes in CI, 30s locally
};

// Validation scoring weights
export const SCORING_WEIGHTS = {
  component: 0.3, // 30% weight for component benchmarking
  bundle: 0.25, // 25% weight for bundle analysis
  webVitals: 0.25, // 25% weight for Core Web Vitals
  memory: 0.2, // 20% weight for memory profiling
};

// Expected performance improvements from refactoring
export const IMPROVEMENT_TARGETS = {
  bundleSize: {
    total: 0, // No increase in total bundle size
    perComponent: -0.1, // 10% reduction per refactored component
  },
  renderTime: {
    maxRegression: 0.2, // Max 20% regression
    expectedImprovement: -0.1, // 10% improvement expected
  },
  memoryUsage: {
    reduction: 0.2, // 20% memory reduction target
    maxRegression: 0.1, // 10% max regression
  },
  codeComplexity: {
    reduction: 0.5, // 50% complexity reduction target
  },
};

export default {
  components: COMPONENT_TARGETS,
  thresholds: PERFORMANCE_THRESHOLDS,
  webVitalsRoutes: WEB_VITALS_ROUTES,
  memoryRoutes: MEMORY_PROFILING_ROUTES,
  devServer: DEV_SERVER_CONFIG,
  reports: REPORT_CONFIG,
  ci: CI_CONFIG,
  scoring: SCORING_WEIGHTS,
  improvements: IMPROVEMENT_TARGETS,
};
