---
id: component-architecture-readme
version: '1.0.0'
last_updated: '2026-03-25'
updated_by: 'AI Assistant: React Refactoring'
status: active
type: documentation
---

# Component Architecture — Feature-Based Structure

This document describes the new feature-based component architecture implemented to comply with tech-stack.md requirements (500-line component limit) and improve maintainability.

## Directory Structure

```
src/app/components/
├── features/                    # Feature-based components (NEW)
│   ├── help-center/            # HelpCenter feature components
│   ├── integrity-tests/        # IntegrityTests feature components
│   ├── propuesta-mejora/       # PropuestaMejora feature components
│   ├── handoffs-templates/     # HandoffsTemplates feature components
│   ├── sitemap-view/          # SitemapView feature components
│   └── index.ts               # Barrel export for all features
├── shared/                     # Shared components
│   └── ui/                    # Reusable UI components (moved from ui/)
│       └── index.ts           # Re-exports ui components + shared components
├── diagrams/                   # Diagram components (UNCHANGED)
├── ui/                        # Base UI components (shadcn/ui) (EXISTING)
├── figma/                     # Figma-related components (EXISTING)
└── README.md                  # This documentation
```

## Architecture Principles

### Feature-Based Organization

Each feature directory contains all components related to a specific application feature:

- **Single Responsibility**: Each feature handles one major application capability
- **Encapsulation**: Feature components are co-located with their related logic
- **Scalability**: Easy to add new features without cluttering the structure

### Component Size Limits (tech-stack.md compliance)

- **Maximum 500 lines per component** (enforced via refactoring)
- **Break large components** into smaller, focused sub-components
- **Extract data and constants** to separate modules in `src/data/features/`

### Import Strategy

```typescript
// ✅ Clean feature-based imports
import { HelpCenter, SearchBar } from '@/components/features/help-center';
import { PropuestaMejora, FlowTab } from '@/components/features/propuesta-mejora';

// ✅ Centralized feature imports
import { HelpCenter, PropuestaMejora, IntegrityTests } from '@/components/features';

// ✅ Shared UI components
import { Card, Button, Tabs } from '@/components/shared/ui';
```

## Feature Breakdown (migration COMPLETE — 2026-06-10 cleanup)

All five heavy pages live in `features/`. The old monolithic versions under
`diagrams/` were deleted (dead code) except two thin wrappers that the route
registry still imports.

### 1. Help Center (`features/help-center/`)

Components: `HelpCenter.tsx` (container), `SearchInterface.tsx`, `ArtifactList.tsx`, `WorkflowSuggestions.tsx`, hooks `useArtifactSearch`/`usePagination`.
Note: `diagrams/HelpCenter.tsx` survives as a ~77-line wrapper (routed via route-registry and mocked in `useTestExecution.test.ts`).

### 2. Propuesta Mejora (`features/propuesta-mejora/`)

Components: `PropuestaMejora.tsx` (container), `FlowTab.tsx`, `DiagnosisTab.tsx`, `MejorasTab.tsx`, `RoadmapTab.tsx`, `MetricsDashboard.tsx`. Routed directly from `features/`.

### 3. Integrity Tests (`features/integrity-tests/`)

Components: `IntegrityTests.tsx` (container), `TestRunner.tsx`, `TestSuite.tsx`, `TestResults.tsx`, `useTestExecution.ts`. Routed directly from `features/`; the `diagrams/IntegrityTests.tsx` shim was deleted.

### 4. Handoffs Templates (`features/handoffs-templates/`)

Routed directly from `features/`; data in `src/data/features/handoffsTemplates.ts` (unified phase labels). The dead `diagrams/HandoffsTemplates.tsx`, `diagrams/HandoffsTemplatesRefactored.tsx` and `diagrams/handoffs/*` were deleted.

### 5. Sitemap View (`features/sitemap-view/`)

Components: `SitemapView.tsx` (container), `FileTree.tsx`, `SitemapDiagram.tsx`, `NavigationPanel.tsx`.
Note: `diagrams/SitemapView.tsx` survives as a 2-line re-export (routed via route-registry).

## Migration Guidelines

### Phase 1: Structure Creation ✅

- [x] Create feature directories
- [x] Create index.ts barrel exports
- [x] Document new architecture

### Phase 2: Data Extraction (Pending)

- [ ] Extract component data to `src/data/features/`
- [ ] Create typed data interfaces
- [ ] Implement data validation

### Phase 3: Component Refactoring (Pending)

- [ ] Break down monolithic components
- [ ] Implement feature-based components
- [ ] Update imports and exports

### Phase 4: Testing & Validation (Pending)

- [ ] Unit tests for new components
- [ ] Visual regression tests
- [ ] Performance validation

## Benefits

1. **Tech-Stack Compliance**: All components under 500-line limit
2. **Improved Maintainability**: Smaller, focused components
3. **Better Developer Experience**: Clear feature boundaries
4. **Scalability**: Easy to add new features
5. **Testability**: Smaller units of testing
6. **Code Reuse**: Shared components in dedicated directory

## Next Steps

1. **Extract Data** → Move constants and data to `src/data/features/`
2. **Refactor Components** → Break down large components
3. **Update Imports** → Use new feature-based imports
4. **Add Tests** → Create comprehensive test suite
5. **Performance Testing** → Validate improvements

---

**Note**: This structure follows the React component refactoring plan outlined in `.claude/plans/silly-humming-metcalfe.md` and adheres to the tech-stack.md standards for component architecture.

## Changelog

| Versión | Fecha      | Autor                           | Cambios                                          |
| ------- | ---------- | ------------------------------- | ------------------------------------------------ |
| 1.0.0   | 2026-03-25 | AI Assistant: React Refactoring | Initial feature-based architecture documentation |
