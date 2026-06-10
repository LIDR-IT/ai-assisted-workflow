---
name: lidr-gate-evaluation
id: gate-evaluation
version: "1.2.0"
last_updated: "2026-06-09"
updated_by: "TL: epic-jira-cleanup"
status: active
phase: 0
stage: anytime
owner_role: "PME"
automation: false
domain_agnostic: true
language_default: en
integrations: [tracking]
description: >
  Generate standardized gate evaluation reports for SDLC phase transitions.
  Tool-agnostic - works across all project tracking systems and methodologies.
  Use for formal gate assessments, handoff package generation, compliance scoring.
  Essential for maintaining SDLC governance and ensuring phase-gate quality standards.
  Always use when transitioning between SDLC phases, always use for gate pass/fail decisions.
  Do NOT use for individual task evaluation or informal progress checks.
  Triggers on "gate evaluation", "phase transition", "gate assessment", "handoff package".
  Output: English by default; artifact language follows the client `language` setting (see `_shared/lidr/integrations/`).
  Audience: PME (conducts evaluations), PO/TL (receives results), QA/Security (provides sign-offs).
---

# Gate Evaluation — SDLC Phase Transition Assessment

**Essential for formal SDLC governance** — this skill generates standardized gate evaluation reports that determine whether a project can advance to the next phase. Critical for maintaining quality gates and ensuring proper handoffs.

**Triggers**: "gate evaluation", "phase transition", "gate assessment", "handoff package", "advance gate"

Tools resolve via the central registry `_shared/lidr/integrations/tool-registry.yaml`; the active client binds concrete tools in `clients/<CODE>.yaml`.

Phase: Cross-cutting (Gates 0-7) | Language: English (default; configurable per client `language` setting) | Duration: 15-45min

## Critical Success Workflow

This workflow is MANDATORY for every gate transition — ensures systematic evaluation of artifacts, checklists, coherence, and sign-offs.

### Prerequisites (Required)

- ✅ All required artifacts for the current phase completed
- ✅ Phase-specific checklists validated
- ✅ Required sign-offs obtained
- ✅ Coherence validation completed

### Execution Steps

1. **Load Gate Context** — Identify the gate number, then load its evidence definition from `../../_shared/lidr/gate-evidence.yaml` (`gates.G<N>`). This manifest is the source of truth for which artifacts satisfy the gate: BMad outputs (primary engine) + LIDR custom-skill outputs (gap-fillers). The gate verifies them — it never regenerates them.
2. **Artifact Assessment** — For each `bmad_evidence` and `lidr_evidence` entry, evaluate existence (glob match) and content quality. BMad artifacts under `_bmad-output/` are read-only.
3. **Checklist Validation** — Verify completion of phase-specific quality criteria
4. **Coherence Analysis** — Check cross-references and traceability between artifacts
5. **Sign-off Verification** — Confirm required approvals are in place
6. **Generate Report** — Create standardized gate evaluation with scoring and verdict

## Input

**Gate Specification:**

- Gate number (0-7) → resolves to `gates.G<N>` in `../../_shared/lidr/gate-evidence.yaml`
- Project identifier (active CLIENT_CODE → resolves the `{client}` path_vars)
- Evidence manifest (`gate-evidence.yaml`) — the per-gate BMad + LIDR evidence list

## Output

**Gate Evaluation Report** using template `templates/gate-evaluation.md`:

- Weighted scoring across 4 dimensions (Artifacts 40%, Checklists 35%, Coherence 15%, Sign-offs 10%) — sourced from the manifest: Artifacts = `bmad_evidence` + `lidr_evidence`, Checklists = `checklist`, Sign-offs = `signoffs`
- PASS/CONDITIONAL/FAIL verdict with thresholds
- Action items for CONDITIONAL/FAIL results
- Handoff context for next phase
- Evidence documentation

## Success Metrics

- **Pass Rate**: >85% of gates pass on first attempt
- **Consistency**: Standardized evaluation across all projects
- **Traceability**: Complete audit trail for governance
- **Efficiency**: <45min evaluation time per gate

## Integration Points

- **Commands**: Used by `/advance-gate [N]` for automated evaluation
- **Manifest**: Reads `../../_shared/lidr/gate-evidence.yaml` for the per-gate evidence list (BMad artifacts + LIDR gap-fillers)
- **Skills**: References artifacts from BMad (engine) + LIDR custom skills (governance/compliance/capacity)
- **Governance**: Feeds into project health dashboards and metrics

---

## Changelog

| Version | Date       | Author                  | Changes                                                                                                                                                           |
| ------- | ---------- | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1.2.0   | 2026-06-09 | TL: lang+tool agnostic  | Language to English-default-configurable; abstracted tracking (Jira) via tool-registry                                                                            |
| 1.1.0   | 2026-06-09 | TL: LIDR Gate-over-BMad | Evidence sourcing now reads `_shared/lidr/gate-evidence.yaml` — gate verifies BMad artifacts (primary) + LIDR gap-fillers instead of phase-specific re-generation |
| 1.0.0   | 2026-04-06 | TL: epic-jira-cleanup   | Initial skill creation — extracted from deprecated epic-jira                                                                                                      |
