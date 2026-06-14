---
name: lidr-requirements
id: requirements
version: "1.1.0"
last_updated: "2026-06-14"
updated_by: "TL: BMad-PRD coherence + multi-phase modes"
status: active
# Multi-phase skill. `phase`/`stage` below are the PRIMARY phase (where Gate 2 lives);
# the real per-mode phase/stage is the `modes` map. The coherence guard validates both.
phase: 3
stage: specification
modes:
  per-rf: { phase: 3, stage: specification, gate: 2 }
  nfr: { phase: 3, stage: specification, gate: 2 }
  validate: { phase: 3, stage: specification, gate: 2 }
  living-spec: { phase: 0, stage: anytime }
  brownfield-audit: { phase: 0, stage: context }
owner_role: "PO + TL"
automation: true
domain_agnostic: true
language_default: en
integrations: [tracking, docs]
description: >
  Author and validate the requirements specification — Functional Requirements (RF) with BDD acceptance criteria, measurable Non-Functional Requirements (NFR), and the cross-validation / RTM that enforces Gate 2. BMad emits ONE unified PRD (FRs nested under features + cross-cutting and feature-specific NFRs in the SAME document) — this skill consumes that single PRD; it does NOT assume a separate "Functional PRD" and "Technical PRD". Fuses the former generate-rf + generate-nfr + validate-requirements into one workflow-driven skill with 5 modes across two phases: per-rf (atomic RFs from the PRD's functional scope — Gate-2 evidence, Phase 3), nfr (measurable NFRs from the PRD's NFR scope — Phase 3), validate (5-pass RTM + Gate-2 verdict; the /lidr-validate-requirements command delegates here — Phase 3), living-spec (consolidate a feature's current-state UJ/RF/NFR/AC into docs/features/<f>/spec.md — Phase 0/anytime, DTC), brownfield-audit (recover the spec from an existing system via bmad-document-project, then hand off to bmad-testarch-trace — Phase 0/context). per-rf · nfr · validate are Phase-3 specification (Gate 2); living-spec · brownfield-audit are Phase-0 context/anytime.
  Domain-agnostic — any software system, platform, or product type. Essential at Gate 2: RFs + NFRs + RTM must exist before Sprint Planning.
  Do NOT use for user stories (use user-stories) or epic decomposition (use bmad-create-epics-and-stories).
  Triggers on "generate requirements", "functional requirements", "RF", "BDD acceptance criteria", "non-functional requirements", "NFR", "performance requirements", "security requirements", "SLA", "quality attributes", "validate requirements", "RTM generation", "5-pass validation", "Gate 2 readiness", "requirements traceability", "feature living spec", "consolidate feature spec", "audit system spec", "recover spec from code", "brownfield spec".
  Output: English by default; artifact language follows the client `language` setting (see `_shared/lidr/integrations/`).
  Audience: PO (functional alignment), TL (NFRs + architecture), QA (test cases), Dev (implementation).
---

# Requirements (RF · NFR · RTM)

> **Workflow-driven (BMad-style).** This `SKILL.md` is a thin **orchestrator**: it detects the mode, resumes any in-progress run, and routes to the matching workflow in `workflows/`. Phase detail, rules, and templates live in `workflows/`, `references/`, and `templates/`. Fuses `generate-rf` + `generate-nfr` + `validate-requirements`.

**Primary phase:** 3 — Specification (Gate 2) | **Language:** English by default (client `language`) | **Domain:** any software system.

**Multi-phase.** This skill spans two unified phases by mode (see frontmatter `modes`):

| Mode                          | Phase · stage                                                 | Gate  |
| ----------------------------- | ------------------------------------------------------------- | ----- |
| `per-rf` · `nfr` · `validate` | **3 — Solutioning / specification**                           | ⭐ G2 |
| `living-spec`                 | **0 — Context / anytime** (DTC living doc)                    | —     |
| `brownfield-audit`            | **0 — Context / context** (recover spec from existing system) | —     |

Tools resolve via the central registry `_shared/lidr/integrations/tool-registry.yaml`.

## Relationship to BMad

LIDR-unique: authors the atomic, BDD-bearing requirements (RF + NFR) and the RTM that BMad's epic flow assumes. Consumes the **single unified PRD** from `bmad-prd` — BMad keeps functional requirements (FRs nested under features) and non-functional requirements (cross-cutting + feature-specific NFR sections) in ONE document, so this skill reads the PRD's functional scope for RFs and its NFR scope for NFRs; there is no separate "Functional PRD" / "Technical PRD". Feeds `bmad-create-epics-and-stories` and traces it for coverage. NFRs audited by `bmad-testarch-nfr`; `brownfield-audit` consumes `bmad-document-project` (Phase 0) and hands off to `bmad-testarch-trace`. Does NOT modify BMad skills.

## On Activation

1. **Resolve config** — read `customize.toml` `[workflow]`: modes, per-mode output paths, `persistent_facts`, references. Load the persistent facts.
2. **Detect the mode** (intent) — note the phase each mode belongs to:
   - **per-rf** _(Phase 3)_ — approved unified PRD (functional scope) → atomic RFs for Gate 2 (`requirements/RF-*.md`). _Owner: PO._
   - **nfr** _(Phase 3)_ — the unified PRD's NFR scope (cross-cutting + feature-specific) → measurable NFRs (`requirements/NFR-*.md`). _Owner: TL._
   - **validate** _(Phase 3)_ — RFs + NFRs exist → 5-pass RTM + Gate-2 verdict (`rtm.md`). _Owner: PO + TL._ The `/lidr-validate-requirements` command delegates here.
   - **living-spec** _(Phase 0 / anytime)_ — consolidate a feature's current-state UJ/RF/NFR/AC → `docs/features/<f>/spec.md` (DTC).
   - **brownfield-audit** _(Phase 0 / context)_ — no PRD; recover the spec from `bmad-document-project` → hand off to `bmad-testarch-trace`.
   - If ambiguous, ask which mode.
3. **Resume** — scan the mode's output path for prior runs whose frontmatter `status` is not `final`; offer to resume.
4. **Route** — read and follow the mode's workflow fully: `workflows/{per-rf,nfr,validate,living-spec,brownfield-audit}.md`.

## Conventions (all modes)

- **State machine:** artifacts carry `status: draft → in-progress → final` in frontmatter. Only `final` counts (and as Gate-2 evidence). This makes runs resumable.
- **Shared `requirements/` directory:** RFs and NFRs both land in `docs/projects/{CLIENT_CODE}/requirements/` so the `validate` mode builds the RTM from one location. The RTM (`rtm.md`) is the **required** Gate-2 artifact.
- **Run memory:** `.decision-log.md` at the output root logs every decision (audit trail; enables resume with context).
- **Stable IDs:** RF/NFR/AC keep IDs across deltas so the RTM traces RF/AC ↔ test ↔ delta.

## References (pulled in by the workflows)

| File                                                                              | What                                                 |
| --------------------------------------------------------------------------------- | ---------------------------------------------------- |
| `references/decomposition-rules.md`                                               | 1-RF-1-behavior rules, patterns, anti-patterns       |
| `references/bdd-rules.md`                                                         | Gherkin AC rules + best practices                    |
| `templates/rf-format.md` · `rf-body.md`                                           | per-RF frontmatter + body + dependency map           |
| `templates/nfr-format.md`                                                         | measurable NFR format (baseline/target/max + method) |
| `templates/rtm.md`                                                                | bidirectional traceability matrix                    |
| `checklists/rf-coherence.md` · `nfr-compliance.md` · `requirements-validation.md` | per-mode coherence gates                             |
| `scripts/` (prd-parser, rtm-generator, validation-engine, batch-validation `.py`) | validate-mode automation                             |
| `examples/`                                                                       | worked RF + Gherkin examples                         |

## Quality Assurance

Validate skill examples/structure: `npx tsx scripts/validate-examples.ts` (+ `validate-examples-nfr.ts`).

## Changelog

| Version | Date       | Author                  | Changes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| ------- | ---------- | ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1.1.0   | 2026-06-14 | TL: BMad-PRD coherence  | **Unified-PRD coherence**: removed the false "Functional PRD / Technical PRD" split — BMad emits ONE PRD (FRs under features + cross-cutting/feature NFRs in the same doc); RFs read its functional scope, NFRs its NFR scope (semantic anchors, not `§2.4`/`§5`). **Multi-phase model**: explicit `modes` map — `per-rf`·`nfr`·`validate` stay Phase-3 specification (Gate 2); `living-spec`·`brownfield-audit` declared Phase-0 (anytime/context). Python parser already unified-first; unchanged |
| 1.0.0   | 2026-06-13 | TL: requirements fusion | **Fusion**: `lidr-generate-rf` + `lidr-generate-nfr` + `lidr-validate-requirements` → one workflow-driven `lidr-requirements` with 5 modes (per-rf · nfr · validate · living-spec · brownfield-audit). Behavior-preserving; Gate-2 contracts (`requirements/RF-*.md`, `requirements/NFR-*.md`, `rtm.md`) unchanged. Inherits generate-rf v2.0.0 workflow structure                                                                                                                                  |
