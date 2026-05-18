---
name: lidr-regression-suite
id: regression-suite
version: "1.1.0"
last_updated: "2026-03-16"
updated_by: "System: Quality Assurance Enhancement"
status: active
phase: 6
owner_role: "TL"
automation: true
domain_agnostic: true
description: "🤖 AUTOMATED regression test suite selection and prioritization using code change impact analysis. Auto-analyzes git diff, maps changes to components, calculates test coverage impact matrix. Use each sprint to auto-select relevant regression subset, each release for full regression, after infrastructure changes, and post-hotfix for targeted regression. Triggers on "automated regression analysis", "select regression tests", "impact analysis for testing", "what to retest", "regression suite for sprint", "change impact". ROI: 120+ hours/year saved through intelligent test selection. ALWAYS use before releases to select optimal regression test coverage."
---

# Regression Suite Manager

Phase: 6 — QA (continuous per sprint/release) | Gate: contributes to Gate 5 (100% pass rate)

## Workflow

1. Read git diff/PR to identify changed files and modules
2. Map changes to architectural components and dependencies
3. Analyze coupling: direct changes + indirect impact radius
4. Select regression test cases from existing suite by priority
5. Suggest new regression candidates from current sprint TCs
6. Generate execution plan (smoke → critical → extended)

## Input

| Input                     | Required  | Source                                        |
| ------------------------- | --------- | --------------------------------------------- |
| Diff/PR of changes        | ✅        | Git                                           |
| Existing regression suite | ✅        | TestRail / test repo                          |
| Bug history               | Desirable | Jira (areas with more bugs = more regression) |
| Component dependency map  | Desirable | Architecture docs                             |
| Sprint scope (RFs/US)     | ✅        | Sprint backlog                                |

## Impact Analysis Process

```
Changed files → Affected modules → Dependent modules → Risk areas
     │                │                    │                │
     ▼                ▼                    ▼                ▼
  Direct TCs     Integration TCs    Indirect TCs    Smoke TCs
  (MUST run)     (SHOULD run)       (COULD run)     (ALWAYS run)
```

## Output Template

```markdown
# Regression Suite: Sprint {N} / Release v{X.Y}

## Impact Analysis

| Changed Files | Module   | Direct Impact              | Indirect Impact   |
| ------------- | -------- | -------------------------- | ----------------- |
| {file}        | {module} | {what's directly affected} | {coupling impact} |

## Selected Regression TCs

### Tier 1 — Smoke (ALWAYS run, ~15 min)

| TC                        | Description | Area | Automated |
| ------------------------- | ----------- | ---- | --------- |
| {critical business flows} |

### Tier 2 — Critical (run if module affected, ~45 min)

| TC  | Description | Area | Reason Selected | Automated |
| --- | ----------- | ---- | --------------- | --------- |

### Tier 3 — Extended (full regression, release only, ~2h)

| TC  | Description | Area | Automated |
| --- | ----------- | ---- | --------- |

## New Regression Candidates (from this sprint)

| TC  | Why Add to Suite | Tier | Automate? |
| --- | ---------------- | ---- | --------- |

## Retired TCs (obsolete or duplicated)

| TC  | Reason | Action |
| --- | ------ | ------ |

## Execution Summary

| Tier      | Total TCs | Automated | Manual | Est. Time |
| --------- | --------- | --------- | ------ | --------- |
| Smoke     | {N}       | {N}       | {N}    | ~{X} min  |
| Critical  | {N}       | {N}       | {N}    | ~{X} min  |
| Extended  | {N}       | {N}       | {N}    | ~{X} min  |
| **Total** | **{N}**   |           |        | **~{X}**  |
```

## Key Rules

- **Smoke tests always run**: Core business flows regardless of change scope.
- **Impact analysis drives selection**: Don't run the entire suite every sprint — select based on change radius.
- **Bug hotspots get more regression**: Files/modules with more historical bugs get additional regression coverage.
- **Automate first**: Critical and smoke tiers should be >80% automated.
- **Suite maintenance**: Every 3 sprints, review suite for obsolete TCs, duplicates, and gaps.
- **Gate 5 criterion**: Regression pass rate must be 100% (0 regressions).

## Quality Assurance

### Validation Script

This skill includes automated validation via `scripts/validate-examples.ts`:

```bash
# Validate skill examples and structure
npx tsx scripts/validate-examples.ts
```

**Validation includes:**

- Example completeness and correctness
- Testing and regression compliance patterns
- Progressive disclosure adherence
- Resource organization standards

**When to use:**

- Before skill release/packaging
- In CI/CD pipeline (quality gates)
- After major example updates
- During skill maintenance cycles

**Integration with ecosystem:**

- Used by `/multi-agent-audit` for ecosystem validation
- Supports quality gates in SDLC workflow
- Provides consistent validation across all skills
