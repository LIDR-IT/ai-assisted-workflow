---
name: lidr-requirements
id: requirements
version: "1.0.0"
last_updated: "2026-06-13"
updated_by: "TL: requirements fusion"
status: active
phase: 3
stage: specification
owner_role: "PO + TL"
automation: true
domain_agnostic: true
language_default: en
integrations: [tracking, docs]
description: >
  Author and validate the requirements specification — Functional Requirements (RF) with BDD acceptance criteria, measurable Non-Functional Requirements (NFR), and the cross-validation / RTM that enforces Gate 2. Fuses the former generate-rf + generate-nfr + validate-requirements into one workflow-driven skill with 5 modes: per-rf (RFs from the Functional PRD — Gate-2 evidence), nfr (measurable NFRs from the Technical PRD), validate (5-pass RTM + Gate-2 verdict; the /lidr-validate-requirements command delegates here), living-spec (consolidate a feature's UJ/RF/NFR/AC into docs/features/<f>/spec.md), brownfield-audit (recover the spec from an existing system via bmad-document-project, then hand off to bmad-testarch-trace).
  Domain-agnostic — any software system, platform, or product type. Essential at Gate 2: RFs + NFRs + RTM must exist before Sprint Planning.
  Do NOT use for user stories (use user-stories) or epic decomposition (use bmad-create-epics-and-stories).
  Triggers on "generate requirements", "functional requirements", "RF", "BDD acceptance criteria", "non-functional requirements", "NFR", "performance requirements", "security requirements", "SLA", "quality attributes", "validate requirements", "RTM generation", "5-pass validation", "Gate 2 readiness", "requirements traceability", "feature living spec", "consolidate feature spec", "audit system spec", "recover spec from code", "brownfield spec".
  Output: English by default; artifact language follows the client `language` setting (see `_shared/lidr/integrations/`).
  Audience: PO (functional alignment), TL (NFRs + architecture), QA (test cases), Dev (implementation).
---

# Requirements (RF · NFR · RTM)

> **Workflow-driven (BMad-style).** This `SKILL.md` is a thin **orchestrator**: it detects the mode, resumes any in-progress run, and routes to the matching workflow in `workflows/`. Phase detail, rules, and templates live in `workflows/`, `references/`, and `templates/`. Fuses `generate-rf` + `generate-nfr` + `validate-requirements`.

**Phase:** 3 — Specification | **Gate:** 2 | **Language:** English by default (client `language`) | **Domain:** any software system.

Tools resolve via the central registry `_shared/lidr/integrations/tool-registry.yaml`.

## Relationship to BMad

LIDR-unique: authors the atomic, BDD-bearing requirements (RF + NFR) and the RTM that BMad's epic flow assumes. Consumes the unified PRD from `bmad-prd`; feeds `bmad-create-epics-and-stories` and traces it for coverage. NFRs audited by `bmad-testarch-nfr`; brownfield-audit hands off to `bmad-testarch-trace`. Does NOT modify BMad skills.

## On Activation

1. **Resolve config** — read `customize.toml` `[workflow]`: modes, per-mode output paths, `persistent_facts`, references. Load the persistent facts.
2. **Detect the mode** (intent):
   - **per-rf** — approved Functional PRD → atomic RFs for Gate 2 (`requirements/RF-*.md`). _Owner: PO._
   - **nfr** — Technical PRD §5 → measurable NFRs (`requirements/NFR-*.md`). _Owner: TL._
   - **validate** — RFs + NFRs exist → 5-pass RTM + Gate-2 verdict (`rtm.md`). _Owner: PO + TL._ The `/lidr-validate-requirements` command delegates here.
   - **living-spec** — consolidate a feature's current-state UJ/RF/NFR/AC → `docs/features/<f>/spec.md`.
   - **brownfield-audit** — no PRD; recover the spec from `bmad-document-project` → hand off to `bmad-testarch-trace`.
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

| Version | Date       | Author                  | Changes                                                                                                                                                                                                                                                                                                                                                            |
| ------- | ---------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1.0.0   | 2026-06-13 | TL: requirements fusion | **Fusion**: `lidr-generate-rf` + `lidr-generate-nfr` + `lidr-validate-requirements` → one workflow-driven `lidr-requirements` with 5 modes (per-rf · nfr · validate · living-spec · brownfield-audit). Behavior-preserving; Gate-2 contracts (`requirements/RF-*.md`, `requirements/NFR-*.md`, `rtm.md`) unchanged. Inherits generate-rf v2.0.0 workflow structure |
