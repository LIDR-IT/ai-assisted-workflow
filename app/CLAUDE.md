# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React/TypeScript application that implements the **LIDR SDLC Methodology** - a comprehensive software development lifecycle framework. The application provides interactive documentation, workflow visualization, and governance tools for software development teams.

## Development Commands

### Core Development

```bash
npm run dev                    # Start development server (Vite)
npm run build                  # Production build
npm run test                   # Run unit tests with Vitest
npm run test:ui               # Open Vitest UI
npm run test:coverage         # Generate test coverage report
```

### Data Validation & Quality Control

```bash
npm run validate:coherence     # Detect hardcoded values vs centralized data
npm run validate:templates     # Validate skill templates
npm run validate:examples      # Validate all skill examples
npm run fix:coherence         # Auto-fix hardcoded values
npm run data:validate         # Full data validation suite
npm run skills:health         # Skill ecosystem health report
```

### Visual Testing & Performance

```bash
npm run visual:test           # Playwright visual regression tests
npm run visual:update         # Update visual baselines
npm run perf:all             # Run full performance suite
npm run perf:benchmark       # Component benchmarking
npm run perf:bundle          # Bundle size analysis
```

### Client & Multi-tenant Management

```bash
npm run client:add           # Add new client configuration
npm run client:list          # List all clients
npm run client:validate      # Validate client configurations
npm run lidr:init           # Initialize LIDR SDLC framework for new projects
npm run lidr:init:dry-run   # Preview what lidr:init would create without writing files
```

### Linting

```bash
npm run lint               # Run ESLint
npm run lint:fix           # Auto-fix lint issues
```

### Testing

```bash
npm run test:run           # Single test run (no watch, no coverage)
npm run test:unit           # Unit tests only
npm run test:watch          # Watch mode for development
npm run test:ci            # CI test suite with coverage gates
npm run coverage:report    # Generate and validate coverage
```

## Architecture Overview

### Core Technology Stack

- **Framework**: React 18 + TypeScript with strict mode
- **Build Tool**: Vite 6+ with React and Tailwind plugins
- **Styling**: Tailwind CSS v4 (using CSS-first configuration in `theme.css`)
- **Routing**: React Router v7 with data mode (`createBrowserRouter`)
- **Diagrams**: React Flow (@xyflow/react) for interactive visualizations
- **UI Components**: Radix UI primitives + shadcn/ui components
- **Testing**: Vitest + React Testing Library + Playwright

### Key Architectural Patterns

#### Data Centralization System (Anti-Hardcoding)

The application implements a sophisticated data centralization system to eliminate hardcoded values:

```typescript
// ❌ AVOID: Hardcoded values
const skillCount = '57 skills';

// ✅ USE: Centralized data
import { ecosystemStats } from '@/data/computed/stats';
const skillCount = `${ecosystemStats.skills} skills`;
```

**Key files:**

- `src/data/artifacts/skills.ts` - Skills metadata and auto-computed counts
- `src/data/artifacts/commands.ts` - Commands by tier with auto-computed counts
- `src/data/phases.ts` - SDLC phases, gates, colors, and utilities
- `src/data/computed/stats.ts` - Auto-computed ecosystem statistics
- `src/data/index.ts` - Unified export point

#### React Flow Diagram Patterns

Interactive diagrams use standardized helper functions:

```typescript
import { n, e } from '@/app/components/shared/ReactFlowDiagram';

// Create nodes and edges with consistent styling
const nodes = [
  n('node1', 'Label', 'step', { phase: 1 }), // Auto phase colors
  n('node2', 'Label', 'decision'),
];

const edges = [
  e('node1', 'node2', 'Success'), // Labeled edge
];
```

#### Component Organization

```
src/app/components/
├── ui/               # Base UI components (shadcn/ui)
├── shared/           # Shared components with business logic (DiagramCard, ReactFlowDiagram, etc.)
├── diagrams/         # Simple page-level React Flow diagram components
├── features/         # Heavy feature directories (propuesta-mejora/, handoffs-templates/, help-center/, integrity-tests/, sitemap-view/, metrics-dashboard/)
├── content/          # Block-based content rendering system (ContentRenderer, ContentBlockRenderer, blocks/)
├── layout/           # Layout components (Sidebar, header)
└── figma/            # Figma-specific components
```

#### Content System

`src/app/components/content/` provides a block-based content rendering architecture for dynamic, configurable page content. `ContentRenderer` composes blocks from `blocks/` subdirectory; use it for any page that needs JSON-driven layout rather than hardcoded JSX.

#### Path Aliases

Configured in `vite.config.test.ts` (applies to both app and tests):

- `@/` → `src/`
- `@/components` → `src/app/components`
- `@/data` → `src/data`
- `@/types` → `src/types`

### Phase-Based Architecture

The application is organized around the **unified 5-phase SDLC model (0-4)**; the legacy LIDR phases 0-8 survive only as granular **stages**:

- **Phase 0 — Context & Anytime** · stages: `context`, `anytime` (cross-cutting, brownfield)
- **Phase 1 — Analysis** · stage: `analysis` (ex-Fase 1 Originación) → Gate 0
- **Phase 2 — Planning** · stage: `planning` (ex-Fase 2 Discovery & PRD) → Gate 1
- **Phase 3 — Solutioning** · stages: `specification` (ex-Fase 3) → Gate 2, `sprint-planning` (ex-Fase 4) → Gate 3
- **Phase 4 — Implementation** · stages: `development` (ex-Fase 5) → Gate 4, `qa` (ex-Fase 6) → Gate 5, `security` (ex-Fase 7) → Gate 6, `release` (ex-Fase 8) → Gate 7

Each phase has associated colors, gates, artifacts, and workflows defined in `src/data/phases.ts`.

## Code Quality & Validation

### Validation Scripts System

The project includes 55+ validation scripts organized in two categories:

1. **Skill-specific validators** (`skills/*/scripts/validate-examples.ts`) - Validate individual skill outputs
2. **Shared functional validators** (`_shared/validators/`) - Cross-cutting validation (coherence, SDLC compliance, security patterns)

Key validators:

- `scripts/validate-coherence.ts` - Detects hardcoded values that should use centralized data
- `scripts/validate-skill-templates.ts` - Ensures skill template integrity
- `.agents/_shared/lidr/validators/validate-domain-agnostic.ts` - Ensures framework portability

### Quality Gates

The project enforces quality through:

- **Pre-commit hooks** (Husky) - Run coherence validation, template validation, and linting
- **TypeScript strict mode** - `noUncheckedIndexedAccess`, `strict: true`, etc.
- **Coverage gates** - Enforced minimum test coverage thresholds
- **Visual regression testing** - Playwright-based component screenshot comparisons

## Multi-Client Architecture

The application supports multiple clients through a centralized configuration system:

```typescript
import { getCurrentClient } from '@/data/client-registry';
import { resolveTemplate } from '@/data/template-engine';

const client = getCurrentClient(); // Gets active client config
const text = resolveTemplate('Hello {{CLIENT_NAME}}'); // Resolves {{VAR}} placeholders
```

**Key files:**

- `src/data/client-registry.ts` - Client registry and switching logic (clients: `base`, `docline`, `facephi`)
- `src/data/template-engine.ts` - Resolves `{{VARIABLE}}` placeholders from client config + industry pack
- `src/data/config-resolver.ts` - JSON config hierarchy: Global → Client → Project → Page → Block
- `src/data/industries/` - Industry-specific configurations (biometric, healthcare, fintech, etc.)
- `src/data/clients/{clientId}/config.ts` - Per-client configuration files
- `scripts/add-client.ts` - CLI for adding new clients

## Important Development Patterns

### React Flow Helpers

Always use the standardized helpers for creating diagrams:

```typescript
// Helper functions for consistent styling
const n = (id: string, label: string, type = 'step', data = {}) => ({
  id,
  type: 'custom',
  position: { x: 0, y: 0 }, // Position will be auto-calculated
  data: { label, nodeType: type, ...data },
});

const e = (source: string, target: string, label?: string) => ({
  id: `${source}-${target}`,
  source,
  target,
  label,
  style: { stroke: '#64748b' },
});
```

### Data Import Patterns

Always prefer centralized data over hardcoded values:

```typescript
// ✅ CORRECT: Import from centralized data
import { ecosystemStats, summaryStrings } from '@/data';
import { getPhaseColor, phases } from '@/data/phases';

// Use computed values
const title = summaryStrings.skillsStandardized;
const phaseColor = getPhaseColor(phaseId);
```

### Component Naming Conventions

- **Page components**: PascalCase (e.g., `PropuestaMejora.tsx`)
- **Reusable components**: PascalCase (e.g., `DiagramCard.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useNavEntries.ts`)
- **Utilities**: camelCase (e.g., `formatDate.ts`)
- **Feature directories**: kebab-case (e.g., `help-center/`, `integrity-tests/`)

## Testing Strategy

### Unit Tests

- **Location**: `src/__tests__/` or co-located with components (e.g., `src/app/components/shared/__tests__/`)
- **Framework**: Vitest + React Testing Library
- **Setup file**: `src/test/setup.ts`
- **Pattern**: Test behavior, not implementation
- **Coverage thresholds** (enforced by `npm run coverage:gates`):
  - Global: 70% lines/statements
  - `src/data/**`: 80% branches/functions/lines/statements
  - `src/app/components/**/use*.ts` (hooks): 80% all metrics

### Visual Regression Tests

- **Framework**: Playwright
- **Location**: `tests/visual/`
- **Purpose**: Ensure UI consistency across changes
- **Commands**: `npm run visual:test` to run, `npm run visual:update` to update baselines

### Performance Tests

- **Bundle Analysis**: Tracks bundle size growth
- **Component Benchmarking**: Measures render performance
- **Web Vitals**: Core Web Vitals monitoring
- **Memory Profiling**: Detects memory leaks

## SDLC Ecosystem Integration

This application is part of a larger SDLC ecosystem located in `.claude/`:

- **Skills** (106): Automated workflows for each SDLC phase
- **Commands** (30): Claude Code slash commands for SDLC operations
- **Rules** (24): Governance and standards
- **Hooks** (6): Automated quality guards
- **Agents** (10): Autonomous subagents for complex tasks

See `.claude/CLAUDE.md` for the complete ecosystem documentation.

## Working with Validation

### Before Committing

The pre-commit hook runs:

1. `npm run validate:coherence` - Checks for hardcoded values
2. `npm run validate:templates` - Validates skill template integrity
3. Linting and formatting

### Fixing Coherence Issues

If validation fails with hardcoded values:

```bash
npm run fix:coherence        # Auto-fix common patterns
npm run validate:coherence   # Re-check after fixes
```

### Adding New Data

When adding new skills, commands, or artifacts:

1. Update the relevant data file (`src/data/artifacts/`, `src/data/phases.ts`)
2. Run validation to ensure consistency: `npm run data:validate`
3. Update any affected components to use the centralized data
4. Verify with `npm run validate:coherence`

## Performance Considerations

- **Bundle Splitting**: Use React.lazy() for route-level code splitting
- **React Flow**: Large diagrams may impact performance; use viewport-based rendering
- **Data Centralization**: Computed values are cached; avoid recalculating in renders
- **Images**: Use `ImageWithFallback` component for resilient image loading

## Key Files to Understand

- `src/app/routes.ts` - All routes with lazy imports; WorkflowDiagram is the only statically imported route component
- `src/data/index.ts` - Central data export (start here for data understanding)
- `src/data/phases.ts` - SDLC phase definitions and utilities
- `src/data/client-registry.ts` - Multi-client system entry point
- `src/data/template-engine.ts` - `{{VAR}}` template resolution logic
- `src/app/components/Layout.tsx` - Main application layout with collapsible sidebar
- `src/app/components/shared/ReactFlowDiagram.tsx` - `n()` and `e()` helpers for diagram nodes/edges
- `scripts/validate-coherence.ts` - Data coherence validation logic
- `.claude/CLAUDE.md` - SDLC ecosystem comprehensive documentation
