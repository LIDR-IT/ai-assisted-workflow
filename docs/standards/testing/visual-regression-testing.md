---
id: visual-regression-testing
version: "1.0.0"
last_updated: "2026-03-25"
updated_by: "TL: Visual Testing Infrastructure"
status: active
type: standard
review_cycle: 60
next_review: "2026-05-25"
owner_role: "Tech Lead"
---

# Visual Regression Testing Documentation

## Overview

This document describes the comprehensive visual regression testing setup for validating component refactoring. The system ensures that large component refactoring maintains 100% visual parity using automated screenshot comparison with a <0.2% pixel difference threshold.

## Target Components

The visual regression testing system focuses on the 5 largest components that require refactoring:

| Component             | Size        | Route        | Test Scenarios                                           |
| --------------------- | ----------- | ------------ | -------------------------------------------------------- |
| HelpCenter.tsx        | 3,070 lines | `/help`      | Search functionality, artifact grid, workflow cards      |
| PropuestaMejora.tsx   | 2,066 lines | `/propuesta` | Tab interactions, React Flow diagrams, metrics dashboard |
| IntegrityTests.tsx    | 2,087 lines | `/integrity` | Test grid, status indicators, summary panels             |
| HandoffsTemplates.tsx | 1,862 lines | `/handoffs`  | Phase tabs, template grids, gate criteria                |
| SitemapView.tsx       | 1,625 lines | `/sitemap`   | File tree, sitemap visualization, route listing          |

## Architecture

### Testing Framework

- **Playwright**: Cross-browser visual testing
- **React**: Component rendering and interaction
- **Vite Dev Server**: Local development environment
- **PNG.js**: Image comparison for validation scripts

### Viewport Coverage

- **Desktop**: 1920x1080 (Chrome, Firefox, Safari)
- **Tablet**: 1024x768 (iPad Pro simulation)
- **Mobile**: 390x844 (iPhone 12 Pro simulation)

### Comparison Threshold

- **Standard**: <0.2% pixel difference (0.002 ratio)
- **Critical**: Any difference >0.2% triggers test failure
- **Tolerance**: Handles anti-aliasing and minor rendering differences

## File Structure

```
├── playwright.config.ts                 # Playwright configuration
├── tests/
│   ├── visual/                          # Visual test specifications
│   │   └── critical-components.spec.ts  # Main test suite
│   ├── baselines/                       # Reference screenshots
│   │   ├── desktop/
│   │   ├── tablet/
│   │   ├── mobile/
│   │   └── manifest.json
│   ├── current/                         # Current screenshots for comparison
│   ├── diffs/                           # Difference images when tests fail
│   ├── visual-reports/                  # Playwright HTML reports
│   └── visual-results/                  # Test execution results
└── scripts/
    ├── capture-baselines.ts             # Baseline screenshot generation
    ├── validate-refactoring.ts          # Post-refactor validation
    └── visual-regression-workflow.ts    # Complete workflow automation
```

## Usage

### 1. Initial Baseline Capture (Pre-Refactoring)

Capture baseline screenshots before starting refactoring:

```bash
# Start development server
npm run dev

# Capture baselines for all components and viewports
npm run visual:capture

# Alternative: Use workflow script
tsx scripts/visual-regression-workflow.ts capture
```

This generates:

- Full page screenshots
- Viewport screenshots
- Individual component element screenshots
- Cross-browser comparison images
- Baseline manifest with metadata

### 2. Refactoring Validation (Post-Refactoring)

Validate that refactoring maintains visual parity:

```bash
# Run validation comparison
npm run visual:validate

# Run Playwright visual tests
npm run visual:test

# View results report
npm run visual:report
```

### 3. Complete Workflow Automation

Run the entire visual regression workflow:

```bash
# Full workflow: capture → validate → test → report
tsx scripts/visual-regression-workflow.ts full-workflow

# Skip server management (if already running)
tsx scripts/visual-regression-workflow.ts full-workflow --skip-server
```

## Test Scenarios

### Core Visual Tests

Each component is tested for:

1. **Full page rendering** - Complete page state
2. **Viewport rendering** - Above-the-fold content
3. **Component elements** - Individual UI elements
4. **Scrollable areas** - Top, middle, and scroll states
5. **Interactive states** - Tabs, search, hover states

### Interaction Testing

#### PropuestaMejora Component

- Tab switching between all 6 tabs (flujo, diagnóstico, mejoras, IA, SDD, roadmap)
- React Flow diagram rendering and stability
- Metrics dashboard scrolling and data display

#### HelpCenter Component

- Empty search state
- Search results with query input
- Artifact grid filtering and display
- Workflow card interactions

#### IntegrityTests Component

- Test status grid display
- Summary panel states
- Test result filtering

#### HandoffsTemplates Component

- Phase tab navigation
- Template grid scrolling
- Gate criteria display

#### SitemapView Component

- File tree expansion/collapse
- Sitemap visualization
- Route list rendering

## Configuration

### Playwright Configuration

```typescript
// playwright.config.ts
export default defineConfig({
  testDir: "./tests/visual",
  timeout: 30000,
  expect: {
    threshold: 0.002, // <0.2% pixel difference
    toHaveScreenshot: {
      animations: "disabled",
      mode: "css",
      threshold: 0.002,
    },
  },
  use: {
    baseURL: "http://localhost:5173",
    reducedMotion: "reduce",
    waitForLoadState: "networkidle",
  },
  projects: [
    { name: "chromium-desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox-desktop", use: { ...devices["Desktop Firefox"] } },
    { name: "tablet", use: { ...devices["iPad Pro"] } },
    { name: "mobile", use: { ...devices["iPhone 12 Pro"] } },
  ],
  webServer: {
    command: "npm run dev",
    port: 5173,
    reuseExistingServer: true,
  },
});
```

### Animation Handling

All tests disable animations for consistent screenshots:

```css
*,
*::before,
*::after {
  animation-delay: -1ms !important;
  animation-duration: 1ms !important;
  animation-iteration-count: 1 !important;
  transition-delay: 0ms !important;
  transition-duration: 1ms !important;
}
```

## Workflow Integration

### Pre-Refactoring Checklist

- [ ] Development server running (`npm run dev`)
- [ ] All critical routes accessible
- [ ] React Flow diagrams loading properly
- [ ] Search functionality working
- [ ] Dynamic content loading correctly
- [ ] Baseline capture completed successfully

### Post-Refactoring Validation

- [ ] All visual tests pass (<0.2% difference)
- [ ] No unexpected UI regressions
- [ ] Interactive functionality preserved
- [ ] Performance characteristics maintained
- [ ] Cross-browser compatibility verified

### Failure Resolution

When visual tests fail:

1. **Review diff images** in `tests/diffs/`
2. **Identify root cause**:
   - Intentional UI changes → Update baselines
   - Unintentional regressions → Fix refactoring
   - Browser/environment differences → Adjust thresholds
3. **Update baselines** if changes are intentional:
   ```bash
   npm run visual:update
   ```
4. **Re-run validation** to confirm fixes

## CI/CD Integration

### GitHub Actions Integration

```yaml
name: Visual Regression Tests
on: [pull_request]

jobs:
  visual-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
      - run: npm ci
      - run: npx playwright install
      - run: npm run visual:test
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: visual-test-results
          path: tests/visual-reports/
```

### Quality Gates

Visual regression tests serve as quality gates:

- **Pre-merge**: All visual tests must pass
- **Pre-deployment**: Baseline validation required
- **Post-deployment**: Smoke test verification

## Troubleshooting

### Common Issues

#### Server Not Starting

```bash
# Check if port 5173 is available
lsof -ti:5173

# Kill existing processes
kill -9 $(lsof -ti:5173)

# Restart development server
npm run dev
```

#### Baseline Capture Failures

```bash
# Verify all routes are accessible
curl http://localhost:5173/help
curl http://localhost:5173/propuesta

# Check browser installations
npx playwright install
```

#### High Pixel Difference

- Review browser zoom levels (should be 100%)
- Check for font rendering differences
- Verify animation disabling is working
- Consider adjusting threshold for legitimate differences

#### React Flow Rendering Issues

- Increase wait times for diagram stabilization
- Verify network requests complete before screenshots
- Check for dynamic data loading affecting layout

## Performance Considerations

### Test Execution Time

- **Baseline capture**: ~5-10 minutes (all components, viewports, browsers)
- **Validation comparison**: ~2-3 minutes
- **Playwright tests**: ~3-5 minutes
- **Total workflow**: ~15-20 minutes

### Storage Requirements

- **Baseline images**: ~50-100MB (all viewports/browsers)
- **Comparison images**: ~50-100MB (during validation)
- **Diff images**: Variable (only when tests fail)
- **Reports**: ~10-20MB (HTML reports with embedded images)

### Optimization Tips

- Run tests in parallel when possible
- Use headless browsers for faster execution
- Clean up old test artifacts regularly
- Consider using image compression for storage

## Maintenance

### Regular Tasks

- **Weekly**: Review and clean old test artifacts
- **Monthly**: Update browser versions and re-capture baselines
- **Per Release**: Validate critical paths with full test suite
- **Post Major Changes**: Re-capture baselines for affected components

### Baseline Management

```bash
# Update all baselines after intentional UI changes
npm run visual:update

# Capture new baselines for specific component
tsx scripts/capture-baselines.ts --component help-center

# Archive old baselines before major UI changes
mv tests/baselines tests/baselines-v1.0
```

---

## Changelog

| Version | Date       | Author                            | Changes                                                   |
| ------- | ---------- | --------------------------------- | --------------------------------------------------------- |
| 1.0.0   | 2026-03-25 | TL: Visual Testing Infrastructure | Initial documentation for visual regression testing setup |

This visual regression testing system ensures that the ambitious refactoring of 10,000+ lines of code maintains perfect visual parity while enabling safer, more confident development practices.
