---
id: unit-testing-guide
version: '1.0.0'
last_updated: '2026-03-25'
updated_by: 'Agent E3: Unit Test Development'
status: active
type: standard
review_cycle: 60
next_review: '2026-05-25'
owner_role: 'Tech Lead'
---

# Unit Testing Guide — SDLC Ecosystem

## Overview

Comprehensive unit testing infrastructure for the SDLC ecosystem with coverage validation, performance testing, and CI/CD integration.

## Architecture

### Test Structure

```
src/__tests__/
├── components/           # Component tests
│   ├── features/        # Feature component tests
│   ├── shared/          # Shared component tests
│   └── diagrams/        # Diagram component tests
├── hooks/               # Custom hook tests
├── data/                # Data layer tests
│   └── features/        # Feature data tests
├── utils/               # Utility function tests
└── integration/         # Integration tests
```

## Coverage Requirements

Per `tech-stack.md` requirements:

| Category                   | Minimum Coverage | Target Coverage |
| -------------------------- | ---------------- | --------------- |
| **Global**                 | 60%              | 75%             |
| **React Components**       | 70%              | 85%             |
| **Business Logic (hooks)** | 80%              | 90%             |
| **Data Layer**             | 80%              | 90%             |

## Test Categories

### 1. Component Tests

- **Location**: `src/__tests__/components/`
- **Focus**: UI behavior, props handling, user interactions
- **Tools**: React Testing Library, userEvent
- **Example**: PropuestaMejora tab switching, IntegrityTests execution

### 2. Hook Tests

- **Location**: `src/__tests__/hooks/`
- **Focus**: State management, side effects, callback stability
- **Tools**: React Hooks Testing Library
- **Example**: useTestExecution, useTabNavigation

### 3. Data Layer Tests

- **Location**: `src/__tests__/data/`
- **Focus**: Data integrity, type safety, utility functions
- **Tools**: Vitest unit tests
- **Example**: integrityTests data, propuestaMejora config

### 4. Integration Tests

- **Location**: `src/__tests__/integration/`
- **Focus**: Component interaction, lazy loading, error handling
- **Tools**: Full React tree rendering
- **Example**: Lazy loading behavior, tab navigation flow

## Test Utilities

### Core Utilities (`test-helpers.tsx`)

```typescript
// Router wrapper for components needing routing
export const renderWithRouter = (ui, options) => { ... };

// React Flow mocks for diagram testing
export const mockReactFlowProps = { ... };

// Async operation helpers
export const waitForAsyncOperation = (ms = 100) => { ... };

// Mock data creators
export const createMockTestDefinition = (overrides) => { ... };
```

### Mock Strategies

1. **React Flow Components**: Mocked for performance and isolation
2. **Export Libraries**: html-to-image, jsPDF mocked for export tests
3. **Client Config**: Centralized mock for consistent testing
4. **Data Modules**: Feature-specific mocks for data layer testing

## Running Tests

### Basic Commands

```bash
# Run all unit tests
npm run test:unit

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch

# Run with UI
npm run test:ui
```

### Coverage Validation

```bash
# Run coverage with gates validation
npm run coverage:report

# Run only coverage gates
npm run coverage:gates

# Full CI pipeline
npm run test:ci
```

## Coverage Gates

The `scripts/coverage-gates.ts` script enforces quality standards:

### Validation Rules

- **Global minimum**: 60% across all metrics
- **Category-specific**: Higher thresholds for critical code
- **File-level**: Individual file validation against category thresholds
- **CI Integration**: Fails build on threshold violations

### Output Format

```
🧪 Coverage Gates Report

📊 Summary:
   Total Checks: 45
   Passed: 42 (93%)
   Failed: 3
   Overall Status: ❌ FAILED

❌ Failed Checks:
   React Components (Features) (branches): 68.50% < 70%
   Business Logic (useTestExecution) (functions): 78.20% < 80%

📈 Category Breakdown:
   ✅ Global: 15/16 checks (94%) - Avg: 72%
   ⚠️ React Components (Features): 8/12 checks (67%) - Avg: 69%
   ✅ Business Logic (Hooks): 12/12 checks (100%) - Avg: 85%
```

## CI/CD Integration

### GitHub Actions Workflow

- **Trigger**: Push to main/develop, PRs
- **Steps**: Install → Test → Coverage Gates → Upload Results
- **Artifacts**: Coverage reports, test results
- **PR Comments**: Automated coverage reporting

### Quality Gates

1. **Unit Tests**: Must pass all tests
2. **Coverage Thresholds**: Must meet minimum requirements
3. **Visual Regression**: Must pass Playwright tests
4. **Performance**: Must meet Core Web Vitals targets

## Testing Patterns

### Component Testing Pattern

```typescript
describe('ComponentName', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<ComponentName {...requiredProps} />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('handles user interactions', async () => {
    const user = userEvent.setup();
    render(<ComponentName {...propsWithHandlers} />);

    await user.click(screen.getByRole('button'));
    expect(mockHandler).toHaveBeenCalledWith(expectedArgs);
  });
});
```

### Hook Testing Pattern

```typescript
describe('useCustomHook', () => {
  it('initializes with correct state', () => {
    const { result } = renderHook(() => useCustomHook(initialArgs));
    expect(result.current.state).toEqual(expectedInitialState);
  });

  it('handles state changes', () => {
    const { result } = renderHook(() => useCustomHook(args));

    act(() => {
      result.current.updateState(newValue);
    });

    expect(result.current.state).toEqual(expectedNewState);
  });
});
```

## Best Practices

### Test Organization

1. **File naming**: `ComponentName.test.tsx`, `hookName.test.ts`
2. **Test grouping**: Logical `describe` blocks by feature/behavior
3. **Setup/teardown**: `beforeEach` for mock cleanup, `afterEach` for state reset

### Assertions

1. **User-centric**: Test what users see/experience, not implementation
2. **Specific**: Assert exact values, not just presence
3. **Error scenarios**: Test error handling and edge cases

### Mocking Strategy

1. **External deps**: Mock libraries that don't affect component behavior
2. **API calls**: Mock data fetching for predictable tests
3. **Timers**: Mock for time-dependent functionality

## Changelog

| Versión | Fecha      | Autor                           | Cambios                                                 |
| ------- | ---------- | ------------------------------- | ------------------------------------------------------- |
| 1.0.0   | 2026-03-25 | Agent E3: Unit Test Development | Versión inicial con infraestructura completa de testing |
