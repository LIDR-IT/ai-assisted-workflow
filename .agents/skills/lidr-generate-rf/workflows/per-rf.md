---
id: generate-rf-workflow-per-rf
version: "1.0.0"
last_updated: "2026-06-13"
updated_by: "TL: workflow refactor"
status: active
---

# Workflow — Mode 1: Per-RF (forward, Gate-2)

**When:** the Functional PRD is approved (Gate 1 ✅) and you need atomic, testable RFs before Sprint Planning. This is the **default** mode. Output = one file per RF (the G2 evidence contract).

> Run each phase in order. After each phase, write the artifact(s) and update the run `status` frontmatter — never hold all RFs in context at once. Stop and resume freely.

## Phase 0 — Activate

1. Read `customize.toml` → resolve `{CLIENT_CODE}`, output paths, `persistent_facts`.
2. **Resume check:** scan `docs/projects/{CLIENT_CODE}/requirements/` for `RF-*.md` whose frontmatter `status` is not `final`. If found, offer to resume (continue decomposition / BDD / validation) rather than restart.
3. Load the Functional PRD (`bmad-prd` output) + Technical PRD. Create `.decision-log.md` at the requirements root if absent.

## Phase 1 — Decompose

Apply `references/decomposition-rules.md`: 1 RF = 1 observable behavior (split on "and"/"also"); error flows are separate RFs; compliance separate. Extract functionalities from PRD-F §4, journeys from §5, constraints from PRD-T §3.

→ Write each RF file with frontmatter (`status: draft`) using `templates/rf-body.md`. Log scope decisions to `.decision-log.md`.

## Phase 2 — BDD acceptance criteria

For each RF, write Gherkin scenarios per `references/bdd-rules.md` (min: happy + alternative + error; edge/outline if warranted). Measurable thresholds, no PII in logs, sensitive-data compliance. The AC **is** the test (ATDD seam).

→ Update each RF (`status: in-progress`).

## Phase 3 — Dependency map

Build the global map (`dependency-map.md`): ASCII chains + dependency table + implementation clusters (for Sprint Planning) + critical path. No cycles.

## Phase 4 — Validate (Gate-2 readiness)

Run `checklists/rf-coherence.md` per RF + global: single behavior, full PRD traceability, ≥3 scenarios, measurable thresholds, NFRs declared, no orphans. Fix or log exceptions.

## Phase 5 — Finalize

Set every RF + `dependency-map.md` frontmatter `status: final`, `last_updated` to today. Record finalization in `.decision-log.md`. **Gate-2 evidence** = the `requirements/RF-*.md` files (gate glob). Common next: `lidr-validate-requirements` (RTM) → `bmad-create-epics-and-stories`.
