---
name: lidr-gate-evaluation
id: gate-evaluation
version: "1.0.0"
last_updated: "2026-04-06"
updated_by: "TL: epic-jira-cleanup"
status: active
phase: 0
owner_role: "PME"
automation: false
domain_agnostic: true
description: >
  Generate standardized gate evaluation reports for SDLC phase transitions.
  Tool-agnostic - works across all project tracking systems and methodologies.
  Use for formal gate assessments, handoff package generation, compliance scoring.
  Essential for maintaining SDLC governance and ensuring phase-gate quality standards.
  Always use when transitioning between SDLC phases, always use for gate pass/fail decisions.
  Do NOT use for individual task evaluation or informal progress checks.
  Triggers on "gate evaluation", "phase transition", "gate assessment", "handoff package".
  Output in Spanish (descriptions) + English (technical terms).
  Audience: PME (conducts evaluations), PO/TL (receives results), QA/Security (provides sign-offs).
---

# Gate Evaluation — SDLC Phase Transition Assessment

**Essential for formal SDLC governance** — this skill generates standardized gate evaluation reports that determine whether a project can advance to the next phase. Critical for maintaining quality gates and ensuring proper handoffs.

**Triggers**: "gate evaluation", "phase transition", "gate assessment", "handoff package", "advance gate"

Phase: Cross-cutting (Gates 0-7) | Language: Spanish + English | Duration: 15-45min

## Critical Success Workflow

This workflow is MANDATORY for every gate transition — ensures systematic evaluation of artifacts, checklists, coherence, and sign-offs.

### Prerequisites (Required)

- ✅ All required artifacts for the current phase completed
- ✅ Phase-specific checklists validated
- ✅ Required sign-offs obtained
- ✅ Coherence validation completed

### Execution Steps

1. **Load Gate Context** — Identify gate number and required evaluation criteria
2. **Artifact Assessment** — Evaluate existence and content quality of required deliverables
3. **Checklist Validation** — Verify completion of phase-specific quality criteria
4. **Coherence Analysis** — Check cross-references and traceability between artifacts
5. **Sign-off Verification** — Confirm required approvals are in place
6. **Generate Report** — Create standardized gate evaluation with scoring and verdict

## Input

**Gate Specification:**

- Gate number (0-7)
- Project identifier
- Phase context and requirements

## Output

**Gate Evaluation Report** using template `templates/gate-evaluation.md`:

- Weighted scoring across 4 dimensions (Artifacts 40%, Checklists 35%, Coherence 15%, Sign-offs 10%)
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
- **Skills**: References artifacts from all phase-specific skills
- **Governance**: Feeds into project health dashboards and metrics

---

## Changelog

| Version | Date       | Author                | Changes                                                      |
| ------- | ---------- | --------------------- | ------------------------------------------------------------ |
| 1.0.0   | 2026-04-06 | TL: epic-jira-cleanup | Initial skill creation — extracted from deprecated epic-jira |
