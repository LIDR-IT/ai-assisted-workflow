---
id: TICK-000
title: [Refactor title - what is being improved]
status: backlog
priority: medium
assignee: [department|person|agent-name]
type: refactor
provider: none
external_link: null
created_at: YYYY-MM-DD HH:MM
updated_at: YYYY-MM-DD HH:MM
---

# [Refactor Title]

## Description

[Why this refactoring is needed]

**Motivation:**

- Technical debt to address
- Performance improvement opportunity
- Code quality enhancement
- Maintainability improvement

**Benefits:**

- Benefit 1
- Benefit 2
- Benefit 3

## Current State

[Describe current implementation and its issues]

**Problems with current approach:**

- Problem 1
- Problem 2
- Problem 3

**Affected files:**

- `path/to/file1.ts`
- `path/to/file2.ts`

## Target State

[Describe desired implementation after refactoring]

**Improvements:**

- Improvement 1
- Improvement 2
- Improvement 3

**New structure:**

```
[Outline new file/module structure if relevant]
```

## Migration Plan

1. Step 1: [Preparation]
2. Step 2: [Incremental change]
3. Step 3: [Validation]
4. Step 4: [Cleanup]

**Rollback plan:**
[How to revert if issues arise]

## Acceptance Criteria

- [ ] Target state implemented as described
- [ ] All existing tests still passing
- [ ] No behavior changes (functional equivalence)
- [ ] Code quality metrics improved (cyclomatic complexity, duplication, etc.)
- [ ] Performance maintained or improved

## Definition of Done

**Standard checklist:**

- [ ] All acceptance criteria met
- [ ] Tests written and passing (unit, integration, e2e as needed)
- [ ] Documentation updated (README, API reference, guides)
- [ ] Code reviewed and approved
- [ ] No linting errors or warnings
- [ ] Conventional commit created with TICK-ID
- [ ] PR created with proper template

**Refactor-specific:**

- [ ] No behavior change (all tests pass without modification)
- [ ] Performance measured (before/after benchmarks)
- [ ] Migration completed (no old code remaining)
- [ ] Team notified of structural changes

## BDD Scenarios

```gherkin
Feature: [Feature being refactored]

  Scenario: Existing behavior preserved
    Given [precondition from existing tests]
    When [action from existing tests]
    Then [same outcome as before refactor]
```

<!--
For refactoring, BDD scenarios should prove functional equivalence.
Copy scenarios from existing tests to verify no behavior change.
-->

## Performance Benchmarks

**Before refactoring:**

```
[Benchmark results - execution time, memory usage, etc.]
```

**After refactoring:**

```
[Target benchmark results]
```

**Measurement method:**

```bash
[Command or script to reproduce benchmarks]
```

## Tasks

- [ ] Create feature branch and baseline tests - Assigned to: [developer-name]
- [ ] Implement refactoring incrementally - Assigned to: [developer-name]
- [ ] Run performance benchmarks - Assigned to: [developer-name]
- [ ] Update documentation - Assigned to: [doc-improver agent]
- [ ] Code review focusing on equivalence - Assigned to: [reviewer-name]
- [ ] Merge and cleanup old code - Assigned to: [developer-name]

## Notes

**Design decisions:**
[Document key architectural choices]

**Trade-offs:**
[What was prioritized vs what was deferred]

**Breaking changes:**
[Any API changes, even if internal]

**References:**

- Design pattern: [Link or name]
- Related refactorings: [Other tickets]
