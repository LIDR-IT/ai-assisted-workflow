---
name: drift_prevention_patterns
description: Patterns and signals for preventing documentation drift in LIDR SDLC ecosystem
type: feedback
---

# Documentation Drift Prevention Patterns

Based on analysis of cleanup phases and current ecosystem state.

## High-Risk Drift Triggers

### Directory Removal Cascades

**Pattern**: When removing a directory (like docs/projects/), references persist in:

- Rules (.claude/rules/\*.md)
- Skill templates
- Command documentation
- Workflow descriptions

**Prevention**: Before directory removal, run comprehensive grep for all references and update systematically.

### Count Methodology Disputes

**Pattern**: Different components count artifacts differently:

- CLAUDE.md: Manual maintenance
- src/data/computed/stats.ts: Programmatic counting
- Integrity tests: Expected counts hardcoded
- Validation scripts: Mixed .py + .ts counting

**Prevention**: Establish canonical counting methodology. Scripts should be Python-only or TypeScript-only, not mixed.

### Template Self-Containment Violations

**Pattern**: Skills accidentally referencing external templates instead of local ones

- ✅ CORRECT: `.claude/skills/adr/templates/adr.md` (local immutable)
- ❌ INCORRECT: `templates/adr.md` (external dependency)

**Prevention**: Template validation script should verify all skills have local templates/\*.

## Successful Stability Patterns

### Data Centralization Success

**Why**: `src/data/computed/stats.ts` eliminates hardcoded counts across UI

- PropuestaMejora.tsx uses `summaryStrings.skillsStandardized`
- CLAUDE.md references ecosystem stats
- HelpCenter gets counts from centralized data

**Maintain**: Never hardcode counts in components again. Always import from src/data/.

### Self-Contained Architecture Success

**Why**: 61 skills are completely independent with local templates/checklists

- No external dependencies
- Portable .claude/ folder
- Framework scales to any client

**Maintain**: All new skills MUST include local templates/, checklists/, examples/.

### Framework vs Project Separation Success

**Why**: Framework rules (in .claude/) separate from client-specific content

- Client-agnostic skill templates
- {{CLIENT_NAME}} variables for customization
- Industry Pack pattern for domain adaptation

**Maintain**: Never put client-specific content in .claude/ framework files.

## Early Warning Signals

### Signal 1: Coherence Validation Warnings

**What**: `npm run validate:coherence` shows hardcoded values
**Meaning**: Components bypassing data centralization system
**Action**: Update components to import from src/data/

### Signal 2: Count Discrepancies in CLAUDE.md

**What**: CLAUDE.md totals don't match src/data/computed/stats.ts totals
**Meaning**: Manual maintenance lag or counting methodology dispute  
**Action**: Investigate counting differences, update methodology docs

### Signal 3: docs/projects/ References

**What**: Skills or rules referencing non-existent docs/projects/
**Meaning**: Documentation following wrong patterns
**Action**: Update to use client-specific paths or generic templates

### Signal 4: Template External Dependencies

**What**: Skills referencing templates outside their directory
**Meaning**: Self-contained architecture violation
**Action**: Copy template locally to skill, update references

## Quality Gates for Drift Prevention

### Pre-Release Checklist

- [ ] Run `npm run validate:coherence` (zero warnings)
- [ ] Verify CLAUDE.md counts match src/data/computed/stats.ts
- [ ] Check skills have local templates/ directories
- [ ] Grep for docs/projects/ references (should be zero)
- [ ] Verify client-agnostic language in framework files

### Post-Cleanup Validation

- [ ] Update CLAUDE.md artifact totals
- [ ] Run integrity tests T1-T32
- [ ] Update expected counts in test definitions
- [ ] Verify reference cascade updates
- [ ] Test data centralization working

### Continuous Monitoring

- [ ] Weekly coherence validation runs
- [ ] Monthly count reconciliation
- [ ] Quarterly self-contained architecture audit
- [ ] Per-release framework portability test
