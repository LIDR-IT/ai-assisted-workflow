---
id: generate-rf-workflow-brownfield-audit
version: "1.0.0"
last_updated: "2026-06-13"
updated_by: "TL: workflow refactor"
status: active
---

# Workflow — Mode 3: Brownfield / system audit (reverse)

**When:** there is **no PRD** — you are auditing an existing system to recover its spec and check test coverage. Output = a recovered `docs/features/<feature>/spec.md`, then a coverage audit via `bmad-testarch-trace`. Part of the "Cadena típica: Auditoría de sistema (brownfield)" in `rules/lidr-sdlc/workflows.md`.

> **Semi-assisted:** the input is code, not requirements. Every inferred item is `[REQUIERE VALIDACIÓN HUMANA]` — derived ≠ confirmed. Stop and resume freely.

## Phase 0 — Activate

1. Read `customize.toml` → resolve the feature(s) + output path.
2. **Resume check:** if a recovered `spec.md` exists with `status: in-progress`, continue the recovery / audit.

## Phase 1 — Inventory (understand the code)

Run / read **`bmad-document-project`** output: per-feature deep-dives (code-facing: what each feature DOES) + `docs/index.md`. This is the source instead of a forward PRD. Do NOT author requirements yet — extract behavior.

## Phase 2 — Recover the spec

Turn the documented behavior into the feature's `docs/features/<feature>/spec.md` (UJ/RF/NFR/AC, stable IDs), reusing `references/decomposition-rules.md` + `references/bdd-rules.md`. **Mark every inferred requirement `[REQUIERE VALIDACIÓN HUMANA]`.** Pull NFRs from `lidr-generate-nfr`. Set `status: in-progress`.

## Phase 3 — Audit coverage (handoff)

Feed the recovered `spec.md` to **`bmad-testarch-trace`**: it builds the UJ/AC ↔ test matrix and emits the **GATE (PASS / CONCERNS / FAIL / WAIVED)** — the audit verdict (_does every UJ have a test that meets its AC?_). Its **synthetic oracle** can infer UJ/AC straight from code, so the coverage audit can start before the spec is fully recovered.

## Phase 4 — Close the gaps

Gaps from the gate → `bmad-testarch-test-design` (risk-based, prioritize P1) + `bmad-testarch-automate` (characterization / golden master to fix current behavior). `bmad-testarch-nfr` for NFR evidence.

## Phase 5 — Finalize

Set `spec.md` `status: final` once human-validated. The trace GATE is the audit result; record it + open gaps in `.decision-log.md`. Close the loop with `lidr-validate-requirements` (RTM).
