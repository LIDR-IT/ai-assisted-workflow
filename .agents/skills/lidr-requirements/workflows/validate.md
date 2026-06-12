---
id: requirements-workflow-validate
version: "1.0.0"
last_updated: "2026-06-13"
updated_by: "TL: requirements fusion"
status: active
---

# Workflow — Mode: Validate (RTM + Gate-2 enforcer)

**When:** RFs (per-rf mode) and NFRs (nfr mode) exist and you need the Gate-2 quality gate — the bidirectional RTM, gap report, and PASS/CONDITIONAL/FAIL verdict. **Owner: PO + TL.** This is the engine the `/lidr-validate-requirements` command delegates to (the command owns the slash; this mode is reached via the command or by routing). Automation-first (Python scripts) with manual fallback. ROI: ~150 h/year (5 min vs 6+ h).

> Gate-2 contract: the **required** artifact is `docs/projects/{CLIENT_CODE}/rtm.md` — the transient `validation-results/` does NOT satisfy the gate. Traces BMad's epics for coverage; does NOT feed `bmad-create-epics-and-stories`.

## Phase 0 — Activate

Read `customize.toml`. Confirm RFs (`requirements/RF-*.md`) + NFRs (`requirements/NFR-*.md`) exist in the shared `requirements/` directory.

## Phase 1 — PRD parser

Run `scripts/prd-parser.py`: auto-discover + parse the unified PRD (bmad-prd output); extract functionalities §2.4 + NFR categories §5 → `prd-analysis.json` + `prd-summary.md`.

## Phase 2 — 5-pass validation

Run `scripts/rtm-generator.py` (engine `scripts/validation-engine.py`):

- **Pass 1** PRD-F → RFs (functional coverage, 100% required)
- **Pass 2** PRD-T → NFRs + mandatory categories (security + performance)
- **Pass 3** NFR allocation + orphan detection
- **Pass 4** circular dependencies + contradictions (0 required)
- **Pass 5** BDD scenarios ≥3/RF + NFR measurability

## Phase 3 — Human review

Validate automated findings; prioritize gaps; confirm Gate-2 readiness.

## Phase 4 — Generate reports

Auto-produce the bidirectional **RTM** (`templates/rtm.md` shape), **gap report** (action items by owner), `validation-results.json`, and implementation clusters for Sprint Planning. Validate against `checklists/requirements-validation.md`.

## Phase 5 — Gate-2 decision

Publish the canonical RTM to `docs/projects/{CLIENT_CODE}/rtm.md` (**required** gate path). Companions: `gap-report.md`, `validation-results.json`. Final status **PASS / CONDITIONAL / FAIL** is the input to `/lidr-advance-gate 2`. Blocking criteria: 100% PRD functional coverage · mandatory NFR categories · 0 circular deps · 0 contradictions · ≥3 BDD/RF · all NFRs measurable. Next: `bmad-create-epics-and-stories`.
