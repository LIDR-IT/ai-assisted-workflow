---
name: lidr-generate-rf
id: generate-rf
version: "2.0.0"
last_updated: "2026-06-13"
updated_by: "TL: workflow refactor"
status: active
phase: 3
stage: specification
owner_role: "PO"
automation: false
domain_agnostic: true
language_default: en
integrations: [tracking, docs]
description: >
  Generate structured Functional Requirements (RFs) with BDD acceptance criteria (Given/When/Then). Workflow-driven with 3 parallel modes: per-RF (forward, from the Functional PRD — Gate-2 evidence), living-spec (consolidate a feature's UJ/RF/NFR/AC into docs/features/<f>/spec.md), and brownfield-audit (recover the spec from an existing system via bmad-document-project, then hand off to bmad-testarch-trace for coverage + gate).
  Domain-agnostic — works for any software system, platform, or product type.
  Essential at Gate 2: all RFs must exist before Sprint Planning begins.
  Do NOT use for non-functional requirements (use generate-nfr), for user stories (use user-stories), or for epic decomposition (use bmad-create-epics-and-stories).
  Triggers on "generate requirements", "functional requirements", "RF", "BDD requirements", "acceptance criteria", "feature specification", "requirements from PRD", "feature living spec", "consolidate feature spec", "audit system spec", "recover spec from code", "brownfield spec".
  Output: English by default; artifact language follows the client `language` setting (see `_shared/lidr/integrations/`).
  Audience: PO (validates business alignment), QA (uses for test cases), Dev (implements against).
---

# Functional Requirements Generator

> **Workflow-driven (BMad-style).** This `SKILL.md` is a thin **orchestrator**: it detects the mode, resumes any in-progress run, and routes to the matching workflow in `workflows/`. Phase detail, rules, and templates live in `workflows/`, `references/`, and `templates/` — not here.

**Phase:** 3 — Specification | **Gate:** 2 | **Language:** English by default (client `language`) | **Domain:** any software system.

Tools resolve via the central registry `_shared/lidr/integrations/tool-registry.yaml`.

## Relationship to BMad

LIDR-unique: authors atomic, BDD-bearing Functional Requirements — the testable contract BMad's epic flow assumes. Consumes the Functional PRD from `bmad-prd`; feeds `bmad-create-epics-and-stories` and `lidr-validate-requirements` (RTM). Does NOT modify BMad skills.

## On Activation

1. **Resolve config** — read `customize.toml` `[workflow]`: states, per-mode output paths, `persistent_facts`, references. Load the persistent facts as foundational context.
2. **Detect the mode** (intent):
   - **per-rf** — there is an approved Functional PRD and you need atomic RFs for Gate 2 (the default).
   - **living-spec** — you want a feature's consolidated current-state spec (UJ/RF/NFR/AC) in `docs/features/<f>/spec.md`.
   - **brownfield-audit** — there is no PRD; you are auditing an existing system (input = `bmad-document-project`).
   - If ambiguous, ask which of the three.
3. **Resume** — scan the mode's output path for prior runs whose frontmatter `status` is not `final`; offer to resume rather than restart (`resume_on_activation = true`).
4. **Route** — read and follow the mode's workflow file fully:
   - per-rf → `workflows/per-rf.md`
   - living-spec → `workflows/living-spec.md`
   - brownfield-audit → `workflows/brownfield-audit.md`

## Conventions (all modes)

- **State machine:** the produced artifact carries `status: draft → in-progress → final` in frontmatter. Only `final` counts as done (and as Gate-2 evidence in per-rf mode). This is what makes runs resumable.
- **Run memory:** each run keeps a `.decision-log.md` at the output root — every scope / decomposition / override decision logged as it happens (audit trail; enables resume with context).
- **Stop & resume freely** — write artifacts + update `status` after each phase; never hold all RFs in context at once.
- **Stable IDs** — RF/AC keep their IDs across deltas so `lidr-validate-requirements` (RTM) traces RF/AC ↔ test ↔ delta.

## References (pulled in by the workflows)

| File                                              | What                                                                            |
| ------------------------------------------------- | ------------------------------------------------------------------------------- |
| `references/decomposition-rules.md`               | 1-RF-1-behavior rules, RF pattern examples, validation checklist, anti-patterns |
| `references/bdd-rules.md`                         | Gherkin AC rules + best practices                                               |
| `templates/rf-format.md` · `templates/rf-body.md` | per-RF frontmatter + body + dependency-map template                             |
| `checklists/rf-coherence.md`                      | coherence gate (run in Phase 4)                                                 |
| `examples/`                                       | worked RF + Gherkin examples (e-commerce, SaaS, healthcare, identity)           |

## Quality Assurance

Validate skill examples/structure: `npx tsx scripts/validate-examples.ts` (before release, in CI, after example updates).

## Changelog

| Version | Date       | Author                         | Changes                                                                                                                                                                                                                                                                                                                                                     |
| ------- | ---------- | ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2.0.0   | 2026-06-13 | TL: workflow refactor          | Refactored to the BMad workflow pattern: `SKILL.md` is now a thin orchestrator routing 3 parallel modes (per-rf / living-spec / brownfield-audit) to `workflows/`, with `customize.toml` (run-folder + state `draft→final` + resume) and `references/` extracted from the monolith. Behavior-preserving; Gate-2 contract (`requirements/RF-*.md`) unchanged |
| 1.10.0  | 2026-06-12 | TL: brownfield audit mode      | Living Spec gained a reverse/brownfield path (recover spec from `bmad-document-project` → hand off to `bmad-testarch-trace`)                                                                                                                                                                                                                                |
| 1.9.0   | 2026-06-12 | TL: living-spec mode           | Added Living Spec Mode: consolidate UJ/RF/NFR/AC into `docs/features/<f>/spec.md`                                                                                                                                                                                                                                                                           |
| 1.8.0   | 2026-06-10 | TL: Gate-evidence contract fix | Per-RF files at `requirements/RF-*.md` (G2 glob) + per-RF frontmatter                                                                                                                                                                                                                                                                                       |
| 1.7.0   | 2026-06-09 | TL: BMad-coherence             | "Relationship to BMad" note                                                                                                                                                                                                                                                                                                                                 |
| 1.6.0   | 2026-06-09 | TL: lang+tool agnostic         | English-default-configurable; abstracted tracking/docs tools                                                                                                                                                                                                                                                                                                |
| 1.5.0   | 2026-03-25 | TL: tier3-remediation          | Domain-agnostic migration; examples extracted to `examples/`                                                                                                                                                                                                                                                                                                |
| 1.4.0   | 2026-03-16 | System: QA Integration         | Quality assurance integration                                                                                                                                                                                                                                                                                                                               |
| 1.2.0   | 2026-03-09 | System: Improvement            | Concrete BDD scenarios + domain RF patterns                                                                                                                                                                                                                                                                                                                 |
| 1.1.0   | 2026-02-15 | TL: García                     | Decomposition rules + validation checklist                                                                                                                                                                                                                                                                                                                  |
| 1.0.0   | 2026-01-20 | TL: García                     | Initial version                                                                                                                                                                                                                                                                                                                                             |
