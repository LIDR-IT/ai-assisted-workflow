---
name: lidr-skills-migration
description: Migration log for 17 LIDR skills consolidated into BMad family. Documents which assets moved here, why, and the BMad replacement.
last_updated: "2026-05-19"
status: active
type: migration-log
---

# LIDR → BMad Consolidation (2026-05-19)

This document tracks the migration of 17 `lidr-*` skills into BMad equivalents and where their unique assets live now.

## Phase A — 10 orphan skills deleted (no assets, no refs)

These had no unique templates, scripts, or active references. Deleted outright:

| Deleted LIDR                 | BMad replacement                               |
| ---------------------------- | ---------------------------------------------- |
| `lidr-brainstorming`         | `bmad-brainstorming`                           |
| `lidr-domain-research`       | `bmad-domain-research`                         |
| `lidr-technical-research`    | `bmad-technical-research`                      |
| `lidr-bdd-patterns`          | `bmad-testarch-atdd`                           |
| `lidr-skill-development`     | `bmad-workflow-builder` + `bmad-agent-builder` |
| `lidr-agent-development`     | `bmad-agent-builder`                           |
| `lidr-multi-agent-audit`     | `bmad-eval-runner` + `bmad-party-mode`         |
| `lidr-document-discovery`    | `bmad-document-project` + `bmad-shard-doc`     |
| `lidr-design-doc`            | `bmad-create-architecture`                     |
| `lidr-implementation-phases` | `bmad-sprint-planning`                         |

## Phase B — 7 skills migrated and deleted

These had real assets (templates, Python scripts) worth preserving even though BMad covers the workflow better:

### `lidr-architecture-doc` → `bmad-create-architecture`

Templates moved to `.agents/_shared/lidr/templates/architecture/`:

- `architecture.md` — top-level architecture doc
- `db-schema.md` — DB schema template
- `data-model.md` — data model template
- `specs/routes.md`, `specs/components.md`, `specs/storage.md` — 5-level spec templates

**How to use:** When `bmad-create-architecture` finishes, copy templates to `docs/projects/<name>/` as starting structure.

### `lidr-epic-breakdown` → `bmad-create-epics-and-stories`

- Template: `.agents/_shared/lidr/templates/epic.md` (Spanish epic format)
- Rules reference: `.agents/_shared/lidr/references/epic-decomposition-rules.md` (sizing thresholds, grouping criteria, Enabler Epic concept)

**How to use:** Reference both files when invoking `bmad-create-epics-and-stories` for projects following the LIDR Gate model.

### `lidr-ux-design-spec` → `bmad-create-ux-design`

- Template: `.agents/_shared/lidr/templates/ux-design-spec.md`
- Custom rule: "Every screen has 4+ states (default/loading/empty/error)"

### `lidr-skill-creator` → `bmad-agent-builder` + `bmad-eval-runner`

Anthropic upstream archive at `.agents/_shared/anthropic/skill-creator/` (includes LICENSE.txt, eval-viewer web UI, 8 Python scripts).

**Why archive:** It IS Anthropic's official skill-creator (per LICENSE.txt). Preserved for reference but not used in new skill creation — BMad's eval-runner has Docker isolation + parallel graders (methodologically superior).

### `lidr-test-plan` → `bmad-testarch-test-design`

Python scripts moved to `.agents/_shared/lidr/scripts/test-automation/`:

- `risk-analyzer.py` (829 lines) — auto-discovers PRDs/RFs/NFRs and scores complexity
- `test-strategy-generator.py` (963 lines) — generates phased test strategy with entry/exit criteria

**Warning:** Scripts have biometric domain hardcoded (`{{SENSITIVE_DATA_TYPE}}` and similar). Make them fully domain-agnostic before reusing in new projects.

### `lidr-regression-suite` → `bmad-testarch-automate` + `bmad-testarch-trace`

Python scripts moved to `.agents/_shared/lidr/scripts/regression/`:

- `impact-analyzer.py` (328 lines) — git diff → component impact radius
- `dependency-mapper.py` (433 lines) — module dependency graph

**How to use:** Invoke from `bmad-testarch-automate` workflow to identify which regression tests must run for a given PR.

### `lidr-retrospective` → `bmad-retrospective`

No asset migration needed. BMad's retro is 1513 lines (vs LIDR's 149) with Party Mode and epic-scope facilitation.

**Lost when deleting LIDR:** Sprint-level retro with metrics-first principle (Jira velocity, GitHub PR cycle time, QA pass rate). Re-introduce as a customization prepend if needed.

## Skills KEPT (no migration — LIDR substantively unique)

| LIDR (kept)              | Why kept                                                                                                                                            |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `lidr-pr-description`    | No BMad equivalent. DoD checklist (`checklists/dod.md`) is wired into hook `dtc-write-guard` and `/lidr-advance-gate 4`.                            |
| `lidr-user-stories`      | `scripts/rf-slicer.py` (1184 lines): 8 slicing patterns + INVEST + Jira CSV export. BMad stories are dev-agent fodder, not Jira-ready PO artifacts. |
| `lidr-create-test-cases` | Xray-importable QA test cases. BMad ATDD generates code scaffolds for devs — different role, different deliverable.                                 |

## Final inventory

- Before Phase A: 62 LIDR skills
- After Phase A (deletions): 52 LIDR skills
- After Phase B (migrations + deletions): **45 LIDR skills** + 69 BMad + 7 generic = 121 total
