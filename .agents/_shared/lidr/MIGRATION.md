---
name: lidr-skills-migration
version: "1.1.0"
description: Migration log for LIDR skills consolidated into the BMad family, plus the prefix-unification and new-skill phases. Documents which assets moved here, why, and the BMad replacement.
last_updated: "2026-06-11"
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

The top-level architecture/data-model templates (`architecture.md`, `db-schema.md`, `data-model.md`) were **removed** (2026-06-10): `bmad-create-architecture` now fully owns the architecture doc and data model, so LIDR wraps its output instead of duplicating templates.

Only the LIDR-genuine DTC spec templates remain in `.agents/_shared/lidr/templates/architecture/specs/`:

- `specs/routes.md`, `specs/components.md`, `specs/storage.md` — per-change technical specs (DTC)

**How to use:** Run `bmad-create-architecture` for the architecture doc and data model. Copy the surviving `specs/*` templates to `docs/projects/<name>/specs/` for per-change DTC documentation.

### `lidr-epic-breakdown` → `bmad-create-epics-and-stories`

- Template: `.agents/_shared/lidr/templates/epic.md` (Spanish epic format)
- Rules reference: `.agents/_shared/lidr/references/epic-decomposition-rules.md` (sizing thresholds, grouping criteria, Enabler Epic concept)

**How to use:** Reference both files when invoking `bmad-create-epics-and-stories` for projects following the LIDR Gate model.

### `lidr-ux-design-spec` → `bmad-ux`

- The `ux-design-spec.md` template was **removed** (2026-06-10): `bmad-ux` now owns the UX spec; LIDR wraps its output.
- Custom rule to carry into `bmad-ux` usage: "Every screen has 4+ states (default/loading/empty/error)"

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

| LIDR (kept)              | Why kept                                                                                                                                                 |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `lidr-pr-description`    | No BMad equivalent. DoD checklist (`checklists/dod.md`) is enforced at `/lidr-advance-gate 4` (and the `lidr-frontmatter-guard` hook guards .md writes). |
| `lidr-user-stories`      | `scripts/rf-slicer.py` (1184 lines): 8 slicing patterns + INVEST + Jira CSV export. BMad stories are dev-agent fodder, not Jira-ready PO artifacts.      |
| `lidr-create-test-cases` | Xray-importable QA test cases. BMad ATDD generates code scaffolds for devs — different role, different deliverable.                                      |

## Phase D — Repositioning LIDR as thin BMad complement (2026-05-20)

**Architectural shift:** LIDR is no longer a parallel methodology — it becomes a thin pre/post wrapper layer on top of BMad's base flow. Skills that competed with BMad workflows are removed; those that complement (pre/post wrappers, Gate enforcement, compliance, automation) are kept and reframed.

### Additional deletions (7 skills)

> **Update (2026-06-10):** the migrated templates listed in the last column below were **subsequently removed** — `bmad-prd` / `bmad-retrospective` / `bmad-prfaq` fully own these artifacts now (LIDR wraps, does not duplicate). The filenames are kept here only as a historical record of what was migrated.

| Deleted LIDR               | BMad substitute / outcome                                                                           | Template (removed 2026-06-10)            |
| -------------------------- | --------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| `lidr-prd-funcional`       | `bmad-prd` (intent: create) becomes Gate 1 input. `lidr-review-cruzado` validates F-section.        | `prd-funcional.md`                       |
| `lidr-prd-tecnico`         | `bmad-prd` becomes Gate 1 input. `lidr-review-cruzado` validates T-section.                         | `prd-tecnico.md`, `prd-system-design.md` |
| `lidr-epic-review`         | `bmad-retrospective` (10× larger, covers post-epic review with lessons learned).                    | `epic-review.md`                         |
| `lidr-poc-report`          | `bmad-technical-research` covers technical validation. GO/NO-GO documented as invocation guideline. | (no template)                            |
| `lidr-use-cases`           | Embedded inside `bmad-prd` output (BMad PRD already includes use cases section).                    | `use-cases.md`                           |
| `lidr-business-model`      | `bmad-prfaq` (Working Backwards) covers business positioning.                                       | `business-model.md`                      |
| `lidr-changelog-generator` | Consolidated into `lidr-release-notes` (3-level: exec + technical + customer in one skill).         | (no template)                            |

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
- 🟡 RECOMENDABLE: 9 (BMad covers partially; LIDR adds automation/localization/Gate-binding)
- 🟢 OPCIONAL: 6 (niche use cases; only activate when relevant)

Plus 4 anytime skills (agents-architecture, command-development, commit-management, ticket-validation) all OPCIONAL.

> **Note (superseded):** the above Phase-D snapshot counts predate the prefix unification.
> See "Final inventory" at the end of this file for the current 44 LIDR / 69 BMad / 113 total.

## Phase E — meta-tooling prefix experiment, later reverted (2026-05-20)

**Context:** 5 meta-tooling skills in `.agents/skills/` extend the agent platform itself
(rules, hooks, MCP, commands, agents architecture) rather than the LIDR SDLC Gate model.
Phase E temporarily renamed them with a `claude-` prefix and moved them from
`source: 'lidr'` to `source: 'anytime'` to make that distinction explicit.

### Renames in Phase E (5) — to `claude-*`

| Before                  | Phase E (claude-\*)          | Source change      |
| ----------------------- | ---------------------------- | ------------------ |
| `agents-architecture`   | `claude-agents-architecture` | `anytime`          |
| `command-development`   | `claude-command-development` | `anytime`          |
| `lidr-generate-rule`    | `claude-generate-rule`       | `lidr` → `anytime` |
| `lidr-hook-development` | `claude-hook-development`    | `lidr` → `anytime` |
| `lidr-mcp-integration`  | `claude-mcp-integration`     | `lidr` → `anytime` |

### Reverted — renamed back to `lidr-*` (the `claude-*` prefix no longer exists)

The `claude-*` experiment was reversed: the methodology decision is that **every LIDR
artifact, including meta-tooling, carries the `lidr-` prefix**. The 5 skills were renamed
back and now live as:

`lidr-agents-architecture`, `lidr-command-development`, `lidr-generate-rule`,
`lidr-hook-development`, `lidr-mcp-integration` (all classified OPCIONAL / anytime in
`CRITICALITY.md`). No `claude-*`-prefixed skill exists anywhere in the ecosystem today.

### Why the revert

A single consistent prefix (`lidr-*` for LIDR, `bmad-*` for BMad) keeps the inventory,
validators, and sitemap unambiguous. The "platform extension vs methodology" nuance is
captured by the OPCIONAL/anytime classification, not by a separate prefix.

## Phase F — Prefix unprefixed + 4 LIDR refactors + BMad sitemap restructure (2026-05-20)

**Context:** Final cleanup pass after Phase E. The user requested:

1. The 2 remaining unprefixed skills (`commit-management`, `ticket-validation`) should get `lidr-` prefix and move from `source: 'anytime'` to `source: 'lidr'` for consistency.
2. Restructure the sitemap UI (`sitemapView.ts`) so BMad skills are grouped by the **official BMad phases** documented in Vol I-V (`docs/guides/bmad/`), not collapsed as "+117 more".
3. Re-audit the 35 LIDR skills with BMad as source of truth and refactor any redundant ones as thin wrappers over BMad outputs.

### Renames (2)

| Before              | After                    | Source change      | Criticality   |
| ------------------- | ------------------------ | ------------------ | ------------- |
| `commit-management` | `lidr-commit-management` | `anytime` → `lidr` | `optional`    |
| `ticket-validation` | `lidr-ticket-validation` | `anytime` → `lidr` | `recommended` |

`lidr-ticket-validation` was upgraded to `recommended` (was optional) because it validates LIDR/BMad ticket structure pre-PR — has real value in the flow, not just niche.

### 4 LIDR SKILL.md refactors (thin-wrapper framing)

Each `description:` was rewritten to make the wrap explicit:

- `lidr-project-classifier` — removed; replaced by `bmad-document-project` (classifies project type + derives doc requirements via its project-types.csv / documentation-requirements.csv).
- `lidr-refinement-notes` — POST-BMAD WRAPPER: consumes user stories from `bmad-create-story` and captures DoR-readiness grooming notes.
- `lidr-bug-report` — QA→DEV WRAPPER: while `bmad-investigate` is Dev-internal forensic, this is QA-facing outbound bug report.
- `lidr-audit-standards` — ECOSYSTEM-SCOPE WRAPPER over `bmad-review-adversarial-general` (which reviews content). This audits `.agents/` structure: frontmatter, drift, paths.

No directory or functionality changes — only description refactor to clarify role in the BMad-base + LIDR-complement architecture.

### Sitemap restructure (app/src/data/features/sitemapView.ts)

Removed the "+117 more" placeholder. Added two new top-level nodes:

1. **Claude meta-tooling (anytime)** — 5 `claude-*` skills with explicit nature ("Skills para extender la plataforma Claude Code, no LIDR, no BMad").
2. **BMad — Base flow (69 skills)** — full tree organized by BMad Vol I-V official phases:
   - Fase 0 — Aprendizaje (1)
   - Fase 1 — Análisis (6)
   - Fase 2 — Planificación (4)
   - Fase 3 — Solución (6)
   - Fase 4 — Implementación (10)
   - Toolkit Anytime (3)
   - Brownfield (4)
   - Persona Agents — BMM + TEA (7)
   - Persona Agents — CIS (6)
   - CIS Workflows (4)
   - BMad Builder (BMB) — Meta (4)
   - Core Utilities (13)

Visible across all clients (`/facephi/sitemap`, `/aramis/sitemap`, `/docline/sitemap`, `/base/sitemap`) since `sitemapView.ts` is shared.

### Re-audit summary

After reading BMad Vol I-V and cross-referencing all 35 LIDR skills with the 69 BMad skills:

- **0 DELETE candidates** — every LIDR skill survives the audit
- **4 REFACTOR candidates** done in this phase (above)
- LIDR architecture is sound: BMad covers the base flow (69 skills); LIDR adds 35 skills for Gate enforcement (G0-G7), security/compliance, pre/post wrappers, and consultancy multi-client tooling

### Updates

- 2 dirs renamed in `.agents/skills/` via `git mv`
- 2 SKILL.md `name:` fields updated
- 4 SKILL.md `description:` fields refactored as thin-wrapper framing
- `app/src/data/artifacts/skills.ts` — 2 ids/names/docPaths/sources/criticality updated
- `app/src/data/features/sitemapView.ts` — ~150 new TreeNodes; placeholder removed
- `CRITICALITY.md` — table reorganized to reflect renames + wrapper notes
- `TODO.md` — items completed in this phase marked as done

## Inventory snapshot (after Phase F — historical)

```
LIDR:    35 skills (23 OBLIGATORIO + 8 RECOMENDABLE + 4 OPCIONAL)
BMad:    69 skills (base flow, untouched)
Anytime: 5 skills (all OPCIONAL — meta-tooling, then claude-* prefixed)
Total:   109 skills
```

`lidr-` became the consistent prefix for the LIDR-methodology skills (no naked "anytime" entries remained).

_Post-Phase F (gate-over-BMAD cleanup): removed `lidr-project-classifier` (→ `bmad-document-project`) and `lidr-automated-handoffs` (redundant with the gate handoff system; its QA→Sec / Sec→DevOps content folded into `gate-evidence.yaml` G5/G6). Inventory dropped 37→35 LIDR / 111→109 total._

## Phase G — Language + Tool Agnosticism (2026-06-09)

**Context:** LIDR is a consultancy framework that must drop into any client repo regardless of the client's working language or toolchain. Previous phases hardcoded Spanish as the output language and named concrete tools (Jira, Xray, Confluence, SonarQube) directly inside skills and rules. This coupled the methodology to one client's stack and blocked reuse.

### Decision

- **LIDR skills are agnostic by nature.** Output **LANGUAGE** and concrete **TOOLS** are _client configuration_, not hardcoded skill content.
- Skill **CONTENT** is authored in **English** (the lingua franca for the methodology source). The _artifact_ a skill produces follows the client `language` setting — default English, overridable per client (e.g. Spanish for a Spanish-speaking team).
- Concrete tools are referenced through **abstract capability variables** (`{{TRACKING_TOOL}}`, `{{TEST_MGMT_TOOL}}`, `{{DOCS_TOOL}}`, etc.) resolved from client config — never named inline.

### Foundation added

| File                                              | Purpose                                                                                                                           |
| ------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `_shared/lidr/integrations/tool-registry.yaml`    | Central abstract→concrete map. 7 capabilities (tracking, test management, docs, source control, CI/CD, code quality, comms).      |
| `_shared/lidr/integrations/clients/_example.yaml` | Per-client binding template: maps each abstract capability to the client's real tool + sets the artifact `language`.              |
| `_shared/lidr/integrations/README.md`             | Documents the hybrid model: a central registry for the abstract↔concrete map + per-skill adapters for tool-specific export logic. |

### Reference skill wired to the registry

`lidr-tracking-integration` is the proof skill: it resolves `{{TRACKING_TOOL}}` from client config instead of assuming Jira. Added `_shared/lidr/integrations/adapters/redmine-adapter.py` to **prove a client can drop Jira entirely** and bind Redmine — the abstract capability stays the same, only the adapter changes.

### Fan-out (skills refactored)

| Metric                                                                                          | Count |
| ----------------------------------------------------------------------------------------------- | ----- |
| LIDR skills refactored (English-default-configurable + tools abstracted to `{{...}}` variables) | 30    |
| Passed adversarial verification                                                                 | 30    |
| Need manual follow-up                                                                           | 0     |

All 30 targeted skills were refactored and adversarially verified (a refactor → verify → repair pipeline run across batched executions; server-side rate limiting forced low-concurrency batching of ≤4). 6 LIDR skills were out of scope (no localized output, no tool coupling): `lidr-dast-interpretation`, `lidr-pentest-report`, `lidr-playwright-cli`, `lidr-review-cruzado`, `lidr-ticket-validation`, `lidr-using-git-worktrees`. The 5 meta-tooling skills (`lidr-agents-architecture`, `lidr-command-development`, `lidr-generate-rule`, `lidr-hook-development`, `lidr-mcp-integration`) are excluded by design (agent-platform tooling, not LIDR methodology).

### Rules lockstep

The language mandate moved out of the skills/rules and into client config (default English):

- `lidr-sdlc/org.md` §6.2 (Estándares de Documentación) — hardcoded Spanish/Inglés language column reframed as client-config-driven.
- `lidr-sdlc/project.md` §7.3 (Reglas de Documentación) — "Documentación funcional en español" rules superseded by the per-client `language` setting.

### Residual (NOT auto-edited — tracked follow-up)

Tool coupling lives **inside `.py`/`.ts` scripts**, not just SKILL.md prose, and was deliberately left untouched to avoid breaking working automation:

- `lidr-user-stories` → `scripts/rf-slicer.py` (Jira CSV export format).
- `lidr-dev-handoff-qa` → `scripts/validate-examples.ts` (self-test asserts Spanish section headers; now inconsistent with the English-translated example — re-translate the validator's check-strings to English).
- Tracking adapters that still assume a specific tool's payload shape.

These require careful, test-backed refactoring (each export format change must be re-verified against the target tool's import schema) and are tracked for a follow-up pass.

## Phase H — prefix unification + new spec-lifecycle / impact skills (2026-06)

**Context:** Two reconciling changes finalized the inventory at its current shape.

### Meta-tooling renamed back `claude-*` → `lidr-*` (reverting Phase E)

The 5 meta-tooling skills experimentally moved to a `claude-*` prefix in Phase E were
renamed back to `lidr-*` (see Phase E above for the full reconciliation). Decision: a
single `lidr-*` prefix covers every LIDR artifact, including meta-tooling. The `claude-*`
prefix no longer exists anywhere in the ecosystem.

### New LIDR skills added (4)

| Skill                      | Role                                                                        | Criticality         |
| -------------------------- | --------------------------------------------------------------------------- | ------------------- |
| `lidr-help`                | Ecosystem guide (ex-command, now a skill; still invocable as `/lidr-help`)  | OPCIONAL (utility)  |
| `lidr-impact-analysis`     | Contract impact + variant compatibility against client registries (G2 → G4) | RECOMENDABLE        |
| `lidr-using-git-worktrees` | Create/use/clean up git worktrees safely; prerequisite for parallel work    | OPCIONAL (parallel) |
| `lidr-run-parallel-tasks`  | Launch N changes in parallel, each in an isolated worktree                  | OPCIONAL (parallel) |

These bring the LIDR count from 38 (post-Phase-F cleanup) to 44.

## Final inventory (current — 2026-06-11)

```
LIDR:  44 skills (23 OBLIGATORIO + 9 RECOMENDABLE + 12 OPCIONAL) — all prefixed lidr-*
BMad:  69 skills (base flow, untouched) — all prefixed bmad-*
Total: 113 skills
```

Companion ecosystem counts: 30 commands, 24 rules, 10 subagents (since 2026-06-11: the 13 BMad persona wrappers were removed — personas live as skills, see `docs/adr/ADR-0008-personas-as-skills-not-subagents.md`), 6 hooks
(`notify`, `auto-format`, `protect-secrets`, `frontmatter-guard`, `load-context`,
`validate-ecosystem-counts`). See `.agents/_shared/lidr/CRITICALITY.md` for the
per-skill criticality classification.
