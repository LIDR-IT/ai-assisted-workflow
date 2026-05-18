---
id: visual-tests-readme
version: '1.0.0'
last_updated: '2026-03-25'
updated_by: 'TL: Testing Infrastructure'
status: active
type: standard
owner_role: 'Tech Lead'
---

# Visual Regression Testing

This directory contains the visual regression testing infrastructure for validating component refactoring.

## Quick Start

```bash
# 1. Capture baseline screenshots (before refactoring)
npm run visual:capture

# 2. After refactoring, validate visual parity
npm run visual:validate

# 3. Run complete Playwright test suite
npm run visual:test

# 4. View test results
npm run visual:report
```

## Directory Structure

```
tests/
├── visual/                          # Test specifications
│   └── critical-components.spec.ts  # Main visual tests
├── baselines/                       # Reference screenshots (pre-refactor)
│   ├── desktop/
│   ├── tablet/
│   ├── mobile/
│   └── manifest.json
├── current/                         # Current screenshots (post-refactor)
├── diffs/                          # Difference images (when tests fail)
├── visual-reports/                 # Playwright HTML reports
└── visual-results/                 # JSON test results
```

## Target Components

- **HelpCenter** (3,070 lines) - `/help`
- **PropuestaMejora** (2,066 lines) - `/propuesta`
- **IntegrityTests** (2,087 lines) - `/integrity`
- **HandoffsTemplates** (1,862 lines) - `/handoffs`
- **SitemapView** (1,625 lines) - `/sitemap`

## Workflow

1. **Pre-refactoring**: Capture baseline screenshots
2. **Refactoring**: Make component changes
3. **Post-refactoring**: Run validation tests
4. **Review**: Analyze any visual differences
5. **Action**: Fix regressions or update baselines

## Threshold

- **Pass**: <0.2% pixel difference
- **Fail**: ≥0.2% pixel difference

See `docs/standards/testing/visual-regression-testing.md` for complete documentation.
