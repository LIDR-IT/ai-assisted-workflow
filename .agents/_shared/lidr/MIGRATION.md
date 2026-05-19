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

## Phase D — Repositioning LIDR as thin BMad complement (2026-05-20)

**Architectural shift:** LIDR is no longer a parallel methodology — it becomes a thin pre/post wrapper layer on top of BMad's base flow. Skills that competed with BMad workflows are removed; those that complement (pre/post wrappers, Gate enforcement, compliance, automation) are kept and reframed.

### Additional deletions (7 skills)

| Deleted LIDR               | BMad substitute / outcome                                                                           | Template migrated to `_shared/lidr/templates/` |
| -------------------------- | --------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| `lidr-prd-funcional`       | `bmad-prd` (intent: create) becomes Gate 1 input. `lidr-review-cruzado` validates F-section.        | `prd-funcional.md`                             |
| `lidr-prd-tecnico`         | `bmad-prd` becomes Gate 1 input. `lidr-review-cruzado` validates T-section.                         | `prd-tecnico.md`, `prd-system-design.md`       |
| `lidr-epic-review`         | `bmad-retrospective` (10× larger, covers post-epic review with lessons learned).                    | `epic-review.md`                               |
| `lidr-poc-report`          | `bmad-technical-research` covers technical validation. GO/NO-GO documented as invocation guideline. | (no template)                                  |
| `lidr-use-cases`           | Embedded inside `bmad-create-prd` output (BMad PRD already includes use cases section).             | `use-cases.md`                                 |
| `lidr-business-model`      | `bmad-prfaq` (Working Backwards) covers business positioning.                                       | `business-model.md`                            |
| `lidr-changelog-generator` | Consolidated into `lidr-release-notes` (3-level: exec + technical + customer in one skill).         | (no template)                                  |

### SKILL.md reframe (no deletion, reposition as wrapper)

`lidr-review-cruzado` description rewritten to make its new role explicit: **Gate 1 enforcer that validates bmad-prd output has both F+T sections complete**. Other LIDR wrappers (generate-rf, generate-nfr, user-stories, sprint-capacity, pr-description, release-notes, gate-evaluation) keep their existing descriptions which already document their pre/post role; full reframe is follow-up doc work.

### Criticality classification

Every LIDR skill now has a `criticality` field (`required` | `recommended` | `optional`) classifying it relative to BMad coverage. See `.agents/_shared/lidr/CRITICALITY.md` for the public reference. Each Artifact in HelpCenter (`/aramis/help`) shows a colored badge: 🔴 OBLIGATORIO / 🟡 RECOMENDABLE / 🟢 OPCIONAL.

### Repo cleanup

- Deleted `app/.claude/` (109 pre-merge stale symlinks)
- Deleted `app/.claude-env` (auto-generated by load-context hook, untracked)
- Moved `app/.github/workflows/test-coverage.yml` → `.github/workflows/test-coverage.yml` (GitHub Actions only reads from repo root); added `working-directory: ./app` to all `npm` steps and `cache-dependency-path: app/package-lock.json` for setup-node so it actually runs.

### `_bmad/` framework committed

The BMad Method framework (`_bmad/`, 21 files, 304K) is now tracked — required for all 69 bmad-\* skills to resolve their step-files and configs.

## Final inventory (Phase A + B + C + D)

```
Before Phase A: 62 LIDR
After Phase A (10 orphan deletions): 52 LIDR
After Phase B (7 migrated + deleted):  45 LIDR
After Phase C (anytime registered):    45 LIDR + 69 BMad + 4 anytime = 118
After Phase D (7 parallel-flow deleted): 38 LIDR + 69 BMad + 4 anytime = 111
```

Final LIDR breakdown by criticality:

- 🔴 OBLIGATORIO: 23 (BMad doesn't cover; cannot be skipped)
- 🟡 RECOMENDABLE: 9 (BMad covers partially; LIDR adds automation/Spanish/Gate-binding)
- 🟢 OPCIONAL: 6 (niche use cases; only activate when relevant)

Plus 4 anytime skills (agents-architecture, command-development, commit-management, ticket-validation) all OPCIONAL.
