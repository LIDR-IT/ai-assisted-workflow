---
id: developer-guide
version: "1.1.0"
last_updated: "2026-04-06"
updated_by: "TL: skills count update"
status: active
type: guide
owner_role: "TL"
review_cycle: 60
next_review: "2026-05-25"
---

# Developer Guide — LIDR SDLC Methodology

> **Technical implementation guide for developers extending and customizing the LIDR SDLC framework**

## Architecture Overview

### Core Structure

The LIDR SDLC Methodology follows a self-contained architecture:

```
.claude/                          # Self-contained framework
├── skills/                       # 61 domain-agnostic skills
│   ├── {skill-name}/
│   │   ├── SKILL.md             # Main skill definition
│   │   ├── templates/           # IMMUTABLE templates
│   │   ├── checklists/          # IMMUTABLE criteria
│   │   ├── examples/            # Usage examples
│   │   └── scripts/             # Validation scripts
├── rules/                        # 5 core governance rules
├── commands/                     # 23 slash commands
├── hooks/                        # 4 automation guards
├── agents/                       # 10 autonomous subagents
└── memory/                       # Persistent context

src/                              # Application layer
├── app/components/               # React components
├── data/                         # Centralized data layer
└── __tests__/                    # Test infrastructure

docs/                             # Living documentation
├── projects/                     # Project-specific docs
├── guides/                       # Framework guides
├── adr/                          # Architecture decisions
└── standards/                    # Organization standards
```

### Design Principles

#### 1. Self-Contained Architecture

Every skill contains its own templates and checklists:

- **✅ CORRECT**: `.claude/skills/adr/templates/adr.md` (local template)
- **❌ INCORRECT**: `templates/adr.md` (external dependency)

#### 2. Immutable Templates

Templates define standard formats that NEVER change:

- Templates are **IMMUTABLE** — define the skeleton
- Generated documents are **MUTABLE** — contain actual content
- Output always goes to `docs/projects/{project}/`

#### 3. Domain-Agnostic Design

All skills work across industries:

- No hardcoded company names or product references
- Use generic terminology with client variables
- Variables resolved at runtime via `src/data/client.ts`

---

## Adding Diagrams and Components

### React Flow Diagram Development

#### Creating New Diagrams

1. **Create Component File**

```typescript
// src/app/components/diagrams/YourDiagram.tsx
import { n, e } from '../shared/ReactFlowDiagram';

const nodes = [
  n('1', 'Start Process', { x: 100, y: 100 }, 'start'),
  n('2', 'Main Activity', { x: 300, y: 100 }, 'process'),
  n('3', 'End Process', { x: 500, y: 100 }, 'end')
];

const edges = [
  e('1', '2', 'Trigger'),
  e('2', '3', 'Complete')
];

export function YourDiagram() {
  return (
    <FlowDiagram
      nodes={nodes}
      edges={edges}
      height={600}
      exportName="your-diagram"
    />
  );
}
```

2. **Add to Routes**

```typescript
// src/app/routes.ts
import { YourDiagram } from './components/diagrams/YourDiagram';

export const routes = [
  // ... existing routes
  {
    path: "/your-diagram",
    element: <YourDiagram />
  }
];
```

3. **Update Navigation**

```typescript
// src/app/components/Layout.tsx
const navigationItems = [
  // ... existing items
  {
    href: "/your-diagram",
    label: "Your Diagram",
    description: "Description of your diagram",
  },
];
```

#### Helper Functions Reference

The `n()` and `e()` helpers provide consistent styling:

```typescript
// Node creation
n(id: string, label: string, position: {x, y}, type?: 'start'|'process'|'end'|'decision')

// Edge creation
e(source: string, target: string, label?: string, type?: 'default'|'step'|'smoothstep')
```

#### Color Conventions by Phase

```typescript
const phaseColors = {
  0: "#8B5CF6", // purple - Preparación
  1: "#3B82F6", // blue - Originación
  2: "#06B6D4", // cyan - Discovery
  3: "#10B981", // emerald - Especificación
  4: "#F59E0B", // amber - Planning
  5: "#EF4444", // red - Desarrollo
  6: "#EC4899", // pink - QA
  7: "#6366F1", // indigo - Seguridad
  8: "#84CC16", // lime - Despliegue
};
```

### Component Development Guidelines

#### File Organization

```
src/app/components/
├── diagrams/           # Page-level diagram components
├── features/           # Feature-specific components
│   ├── help-center/
│   ├── propuesta-mejora/
│   └── sitemap/
├── shared/             # Shared utilities
│   ├── FlowComponents.tsx
│   ├── ReactFlowDiagram.tsx
│   └── ui/             # shadcn/ui components
└── layouts/            # Layout components
```

#### Naming Conventions

- **Components**: `PascalCase.tsx`
- **Hooks**: `useCamelCase.ts`
- **Utilities**: `camelCase.ts`
- **Test files**: `*.test.tsx`

#### Component Template

```typescript
import { FC, ReactNode } from 'react';

interface YourComponentProps {
  readonly title: string;
  readonly description?: string;
  readonly children?: ReactNode;
  readonly className?: string;
}

export const YourComponent: FC<YourComponentProps> = ({
  title,
  description,
  children,
  className
}) => {
  return (
    <div className={cn('base-styles', className)}>
      <h2 className="text-xl font-semibold">{title}</h2>
      {description && <p className="text-gray-600">{description}</p>}
      {children}
    </div>
  );
};
```

---

## Data Layer Integration

### Centralized Data Management

The framework uses centralized data to eliminate hardcoding:

```typescript
// src/data/index.ts
export { ecosystemStats } from "./computed/stats";
export { clientConfig } from "./client";
export { phaseColors, phases } from "./phases";
export { skillsData } from "./artifacts/skills";
export { commandsData } from "./artifacts/commands";
```

### Adding New Data Sources

1. **Create Data File**

```typescript
// src/data/artifacts/newArtifactType.ts
export const newArtifactData = [
  {
    id: "item-1",
    name: "Item Name",
    description: "Item description",
    // ... other properties
  },
];

export const newArtifactCount = newArtifactData.length;
```

2. **Add to Computed Stats**

```typescript
// src/data/computed/stats.ts
import { newArtifactCount } from "../artifacts/newArtifactType";

export const ecosystemStats = {
  // ... existing stats
  newArtifacts: newArtifactCount,
  // ... computed totals updated
};
```

3. **Update Components**

```typescript
// In your component
import { ecosystemStats } from '../../data';

// Use centralized data instead of hardcoded values
<div>Total New Artifacts: {ecosystemStats.newArtifacts}</div>
```

### Client Configuration

Client-specific data is managed through variables:

```typescript
// src/data/client.ts
export const clientConfig = {
  name: process.env.CLIENT_NAME || '{{CLIENT_NAME}}',
  code: process.env.CLIENT_CODE || 'FP',
  industry: 'domain-specific-identity',
  displayName: '{{CLIENT_NAME}} - AI powered workflow 2026'
};

// Usage in components
import { clientConfig } from '../../data/client';

<h1>{clientConfig.displayName}</h1>
```

---

## Skills Development

### Skill Structure

Every skill follows this structure:

```
.claude/skills/{skill-name}/
├── SKILL.md                    # Main skill definition
├── templates/                  # IMMUTABLE templates
│   ├── {output-format}.md     # Output template
│   └── specs/                 # Specification templates
├── checklists/                # IMMUTABLE criteria
│   ├── {criteria-name}.md     # Validation criteria
│   └── signoffs/              # Approval criteria
├── examples/                  # Usage examples
│   ├── input-example.md       # Sample input
│   └── output-example.md      # Sample output
└── scripts/                   # Validation automation
    └── validate-examples.ts   # Quality checks
```

### Creating New Skills

Use the skill development framework:

```bash
# Generate skill template
npx tsx .claude/skills/skill-creator/SKILL.md \
  --name "custom-skill" \
  --phase 5 \
  --automation true

# This creates complete directory structure with:
# - SKILL.md with proper frontmatter
# - Template files
# - Checklist files
# - Example files
# - Validation script
```

### Skill Frontmatter Requirements

```yaml
---
id: skill-name
version: "1.0.0"
last_updated: "2026-03-26"
updated_by: "TL: Lead Engineer"
status: active
phase: 1-8
owner_role: "Dev"
automation: false
domain_agnostic: true
description: "Clear description with trigger phrases"
---
```

### Domain-Agnostic Guidelines

Ensure skills work across industries:

```markdown
# ❌ AVOID: Industry-specific terms

"domain-specific template verification"
"facial recognition accuracy"
"{{CLIENT_NAME}} SDK integration"

# ✅ USE: Generic equivalents

"data template verification"
"recognition accuracy"
"recognition SDK integration"
```

### Skill Validation

Every skill must pass validation:

```bash
# Run skill validation
npx tsx .claude/skills/{skill-name}/scripts/validate-examples.ts

# Run ecosystem-wide validation
npx tsx scripts/validate-coherence.ts
```

---

## Commands Development

### Command Structure

Commands orchestrate multiple skills and tools:

```markdown
---
id: command-name
version: "1.0.0"
last_updated: "2026-03-26"
updated_by: "TL: Lead Engineer"
status: active
tier: 1
authorized_roles:
  - Tech Lead
  - Developer
---

# Command: /command-name

## Purpose

Brief description of command purpose

## Syntax

/command-name [argument]

## Workflow

1. **Load Context** - Load relevant rules and skills
2. **Validate Input** - Check preconditions
3. **Execute Skills** - Orchestrate skill sequence
4. **Generate Output** - Create deliverables
5. **Update State** - Advance gates or update tracking

## Implementation

{Detailed steps with skill calls and MCP integrations}
```

### Adding New Commands

1. **Create Command File**

```bash
# Create in commands/
touch commands/new-command.md
```

2. **Add to Workflow Rules**

```typescript
// rules/workflows.md - Add authorization matrix
| Command | Roles Authorized | Precondition |
|---------|------------------|--------------|
| /new-command | Dev, TL | Ready state |
```

3. **Test Command**

```bash
# Test the command
/new-command test-argument
```

---

## Testing Framework

### Test Structure

Follow the established testing patterns:

```
src/__tests__/
├── components/           # Component tests
│   ├── diagrams/        # Diagram component tests
│   ├── features/        # Feature component tests
│   └── shared/          # Shared component tests
├── data/                # Data layer tests
│   └── features/        # Feature data tests
├── hooks/               # Custom hook tests
└── utils/               # Utility function tests
```

### Writing Component Tests

```typescript
// Component test template
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { YourComponent } from '../YourComponent';

// Mock dependencies
vi.mock('../../../data', () => ({
  clientConfig: { name: 'TestClient' }
}));

describe('YourComponent', () => {
  it('renders without crashing', () => {
    render(<YourComponent title="Test" />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('handles props correctly', () => {
    render(<YourComponent title="Test Title" description="Test Description" />);

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });
});
```

### Mocking Patterns

#### React Flow Mocking

```typescript
vi.mock('@xyflow/react', () => ({
  ReactFlow: ({ children, nodes, edges, ...props }: any) => (
    <div data-testid="react-flow" {...props}>
      {children}
      <div data-testid="react-flow-nodes">{nodes?.length || 0} nodes</div>
      <div data-testid="react-flow-edges">{edges?.length || 0} edges</div>
    </div>
  ),
  // ... other React Flow components
}));
```

#### Data Layer Mocking

```typescript
vi.mock("../../../data", () => ({
  clientConfig: {
    name: "TestClient",
    code: "TEST",
  },
  ecosystemStats: {
    totalSkills: 57,
    totalCommands: 23,
  },
}));
```

### Test Coverage Goals

Maintain these coverage levels:

- **Components**: 75%+ line coverage
- **Data layer**: 90%+ line coverage
- **Utilities**: 95%+ line coverage
- **Overall**: 80%+ line coverage

---

## Performance Optimization

### Bundle Optimization

#### Lazy Loading

```typescript
// Lazy load heavy components
const HeavyDiagram = lazy(() => import('./HeavyDiagram'));

// Use in routes
{
  path: "/heavy-diagram",
  element: <Suspense fallback={<Loading />}><HeavyDiagram /></Suspense>
}
```

#### Code Splitting

```typescript
// Split by feature
const FeatureModule = lazy(() => import("./features/FeatureModule"));

// Split utilities
const heavyUtil = () => import("./utils/heavyUtil");
```

#### Memoization Patterns

```typescript
// Memoize expensive computations
const expensiveData = useMemo(() => {
  return processLargeDataset(rawData);
}, [rawData]);

// Memoize callbacks passed to children
const handleClick = useCallback(
  (id: string) => {
    onItemSelect(id);
  },
  [onItemSelect]
);
```

### React Flow Performance

#### Large Diagram Optimization

```typescript
// Limit visible nodes
const visibleNodes = useMemo(() => {
  return allNodes.filter((node) => isInViewport(node.position));
}, [allNodes, viewport]);

// Use node types for complex nodes
const nodeTypes = {
  customNode: CustomNodeComponent,
};

// Memoize edge computations
const optimizedEdges = useMemo(() => {
  return computeEdges(nodes);
}, [nodes]);
```

#### Memory Management

```typescript
// Clean up event listeners
useEffect(() => {
  const handleResize = () => {
    // Handle resize
  };

  window.addEventListener("resize", handleResize);

  return () => {
    window.removeEventListener("resize", handleResize);
  };
}, []);
```

---

## Integration Patterns

### MCP Integration

Integrate external tools through MCP servers:

```typescript
// Using filesystem MCP
const readFile = async (path: string) => {
  return await mcp.filesystem.readFile(path);
};

// Using memory MCP
const storeContext = async (key: string, data: any) => {
  return await mcp.memory.store(key, data);
};
```

### External Tool Integration

#### Jira Integration

```bash
# Export data from Jira
npx tsx scripts/external-sync.ts --source jira --project PROJ --export tickets.json

# Import to LIDR tracking
npx tsx scripts/track-sdlc.ts --import tickets.json
```

#### GitHub Integration

```bash
# Sync with GitHub repository
npx tsx scripts/external-sync.ts --source github --repo org/repo --sync

# Generate reports
npx tsx scripts/metrics/github-metrics.ts --output reports/
```

### CI/CD Integration

#### Quality Gates

```yaml
# .github/workflows/lidr-quality.yml
name: LIDR SDLC Quality Gates

on: [pull_request]

jobs:
  validate-sdlc:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3

      - name: Install dependencies
        run: npm ci

      - name: Validate coherence
        run: npx tsx scripts/validate-coherence.ts

      - name: Run tests
        run: npm test

      - name: Check documentation
        run: /validate-project-docs
```

---

## Debugging and Troubleshooting

### Debug Mode

Enable debug output for troubleshooting:

```bash
# Enable debug mode
export LIDR_DEBUG="true"

# Debug specific skill
/debug-skill business-case

# Debug command execution
/debug-command /implement-ticket PROJ-123
```

### Common Issues

#### 1. Missing Dependencies

```bash
# Check Node.js version
node --version  # Should be 20+

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### 2. React Flow Rendering Issues

```typescript
// Ensure container has dimensions
.react-flow-container {
  width: 100%;
  height: 600px; /* Explicit height required */
}

// Check for getBoundingClientRect mock in tests
Object.defineProperty(Element.prototype, 'getBoundingClientRect', {
  writable: true,
  value: () => ({ width: 800, height: 600, top: 0, left: 0 })
});
```

#### 3. Data Loading Issues

```typescript
// Check data import paths
import { ecosystemStats } from '../../data'; // Correct
import { ecosystemStats } from '../data';    // Incorrect

// Verify data file exports
export const myData = [...]; // Named export
export default myData;       // Default export
```

#### 4. Test Failures

```bash
# Clear test cache
npm test -- --clearCache

# Run specific test file
npm test -- src/__tests__/components/MyComponent.test.tsx

# Debug test with verbose output
npm test -- --reporter=verbose
```

### Performance Debugging

#### Bundle Analysis

```bash
# Analyze bundle size
npm run build
npx vite-bundle-analyzer dist/

# Check for duplicate dependencies
npm ls --depth=0
```

#### Memory Profiling

```typescript
// Monitor component re-renders
import { Profiler } from 'react';

<Profiler id="MyComponent" onRender={logRenderTime}>
  <MyComponent />
</Profiler>

function logRenderTime(id, phase, actualDuration) {
  if (actualDuration > 16) {
    console.warn(`${id} took ${actualDuration}ms to ${phase}`);
  }
}
```

---

## Best Practices

### Code Quality

#### TypeScript Strict Mode

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "exactOptionalPropertyTypes": true
  }
}
```

#### ESLint Configuration

```json
// .eslintrc.json
{
  "extends": ["@typescript-eslint/recommended", "react-hooks/recommended"],
  "rules": {
    "no-console": "warn",
    "prefer-const": "error",
    "@typescript-eslint/no-unused-vars": "error"
  }
}
```

### Component Design

#### Single Responsibility

```typescript
// ❌ Component doing too much
function UserDashboard() {
  // User data fetching
  // Chart rendering
  // Navigation handling
  // Form submission
  // ... 200+ lines
}

// ✅ Decomposed components
function UserDashboard() {
  return (
    <div>
      <UserProfile />
      <UserMetrics />
      <UserActions />
    </div>
  );
}
```

#### Props Interface Design

```typescript
// ❌ Unclear props
interface Props {
  data: any;
  onClick: () => void;
}

// ✅ Clear, typed props
interface UserCardProps {
  readonly user: User;
  readonly onSelect?: (userId: string) => void;
  readonly isSelected?: boolean;
  readonly className?: string;
}
```

### Documentation Standards

#### Code Comments

```typescript
/**
 * Processes diagram data for React Flow rendering
 * @param rawData - Raw diagram configuration from data layer
 * @param options - Rendering options and transformations
 * @returns Processed nodes and edges for React Flow
 */
function processDiagramData(rawData: DiagramConfig, options: RenderOptions) {
  // Implementation
}
```

#### README Templates

````markdown
# Component Name

Brief description of component purpose.

## Usage

```tsx
<ComponentName prop1="value" prop2={data} onAction={handleAction} />
```
````

## Props

| Prop  | Type   | Required | Description |
| ----- | ------ | -------- | ----------- |
| prop1 | string | Yes      | Description |
| prop2 | Data   | No       | Description |

## Examples

[Link to examples](./examples/)

````

---

## Release Process

### Version Management

Follow semantic versioning:
- **MAJOR**: Breaking changes in APIs or data structure
- **MINOR**: New features, new components, new skills
- **PATCH**: Bug fixes, documentation updates, performance improvements

### Release Checklist

Before releasing updates:

- [ ] All tests passing (100% pass rate)
- [ ] Documentation updated
- [ ] Performance benchmarks met
- [ ] Skills validation passed
- [ ] Client configuration tested
- [ ] Migration guide created (if needed)
- [ ] ADR created for significant changes

### Deployment

```bash
# Build production bundle
npm run build

# Run final validation
npm test -- --run
npx tsx scripts/validate-coherence.ts

# Deploy
npm run deploy
````

---

_This guide provides comprehensive technical guidance for developers working with the LIDR SDLC Methodology framework. For user-facing setup instructions, see the [User Setup Guide](user-setup-guide.md)._

## Changelog

| Versión | Fecha      | Autor             | Cambios                                                        |
| ------- | ---------- | ----------------- | -------------------------------------------------------------- |
| 1.0.0   | 2026-03-26 | TL: Lead Engineer | Versión inicial del Developer Guide para LIDR SDLC Methodology |
