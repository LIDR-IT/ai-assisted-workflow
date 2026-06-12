---
id: generate-rf-workflow-living-spec
version: "1.0.0"
last_updated: "2026-06-13"
updated_by: "TL: workflow refactor"
status: active
---

# Workflow — Mode 2: Living Spec (feature-level consolidation)

**When:** you want the **current state** of a feature in PRD format (UJ + RF + NFR + AC, stable IDs) — not just a delta. Output = one consolidated `docs/features/<feature>/spec.md` per feature that the PRD-delta reconciles over time.

> Mismo formato que el PRD, distinto alcance: el PRD-delta es el CAMBIO; la spec viva es el ACUMULADO actual. Stop and resume freely.

## Phase 0 — Activate

1. Read `customize.toml` → resolve the feature + output path (`docs/features/{feature}/spec.md`, or the per-client variant).
2. **Resume check:** if `spec.md` exists, this is a reconcile (Phase 3), not a fresh build. Read its current RF/AC IDs.
3. Load the change driver: a PRD-delta (`bmad-prd` Update) or the feature's prior spec.

## Phase 1 — Gather the four parts

- **UJ** — reference from the PRD / `bmad-ux` (inline at the moments that matter).
- **RF + AC** — author with `references/decomposition-rules.md` + `references/bdd-rules.md` (AC in Gherkin = AC + test).
- **NFR** — pull from `lidr-generate-nfr` for this feature.

## Phase 2 — Consolidate

Assemble `spec.md` with **stable IDs** (RF-{FEATURE}-NN, UJ-N, AC-…) so traceability survives across deltas. Use `templates/rf-body.md` per RF inside the feature spec. Set `status: draft`.

## Phase 3 — Reconcile the delta (DTC)

Apply the PRD-delta to the existing `spec.md`: **add / modify / deprecate** RFs by stable ID (never renumber). Log each change in `.decision-log.md`. The delta is then archived; the spec stays the current-state truth. Set `status: in-progress`.

## Phase 4 — Validate / trace

Hand the consolidated RF/NFR/AC to `lidr-validate-requirements` (RTM) so RF/AC ↔ test ↔ delta stay traceable. Resolve gaps.

## Phase 5 — Finalize

Set `spec.md` frontmatter `status: final`, `last_updated` today. The feature's living spec is the readable-structured face of the living truth (code + tests). Index it in `docs/index.md`.
