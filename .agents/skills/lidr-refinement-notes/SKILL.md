---
name: lidr-refinement-notes
id: refinement-notes
version: "1.2.1"
last_updated: "2026-06-09"
updated_by: "TL: BMad-coherence batch-fix"
status: active
phase: 4
owner_role: "TL"
automation: false
domain_agnostic: true
language_default: en
integrations: [tracking]
description: "POST-BMad WRAPPER: consumes user stories from `bmad-create-story` and captures DoR-readiness backlog grooming notes (domain decisions, compliance clarifications, performance thresholds, cross-platform needs). Adds the LIDR Gate 3 DoR validation layer that BMad's story creation does not provide. ALWAYS use after `bmad-create-story` during backlog grooming, before sprint commitment."
---

# Refinement Notes Structurer

Phase: 4 — Sprint Planning | Language: English by default; artifact language follows the client `language` setting (see `_shared/lidr/integrations/`)

Tools resolve via the central registry `_shared/lidr/integrations/tool-registry.yaml`; the active client binds concrete tools in `clients/<CODE>.yaml`.

## Workflow

1. **Read US** discussed in session ({{TRACKING_TOOL}} backlog, prioritized by PO)
2. **Capture domain-specific decisions**:
   - Accuracy or quality thresholds (precision, performance targets)
   - Performance targets (response time, throughput)
   - Compliance requirements and data handling specifics
   - Cross-platform compatibility needs (iOS/Android/Web/Desktop)
   - System support and fallback mechanisms
3. **Record per US**: estimate considering domain complexity, DoR status, technical blockers
4. **Clarify acceptance criteria**: BDD scenarios for domain workflows with concrete test data
5. **Validate compliance requirements**: Consent flows, data retention, deletion workflows (if applicable)
6. **Generate action items**: Validation tasks, security review, compliance documentation
7. **Flag readiness**: "sprint-ready" vs "needs further investigation" vs "compliance review pending"

## Input

| Input                       | Required  | Source                    |
| --------------------------- | --------- | ------------------------- |
| US discussed (IDs + titles) | ✅        | {{TRACKING_TOOL}} backlog |
| Session notes or transcript | ✅        | Facilitator / recording   |
| Participants                | ✅        | Attendance                |
| Sprint capacity             | Desirable | skill `sprint-capacity/`  |
| DoR checklist               | Desirable | checklists/dor.md         |

## Output Template

```markdown
# Refinement Notes — [DD/MM/YYYY]

| Field           | Value                        |
| --------------- | ---------------------------- |
| **Session**     | Refinement #{N} — Sprint {N} |
| **Date**        | [YYYY-MM-DD HH:MM]           |
| **Facilitator** | [SM]                         |
| **Attendees**   | [Names + roles]              |
| **Duration**    | [Xh Xmin]                    |

## User Stories Discussed

### US-{PROJ}-{NNN}: {Title}

| Field          | Value                                   |
| -------------- | --------------------------------------- |
| **Estimate**   | [X]h (range: [min]-[max]h)              |
| **Priority**   | Must / Should / Could                   |
| **DoR Status** | ✅ Ready / ⚠️ Needs work / ❌ Not ready |
| **Blockers**   | [None / description]                    |

**Decisions:**

- [Decision 1 — what was agreed]
- [Decision 2]

**Questions resolved:**

- Q: [question] → A: [answer, who answered]

**Open questions:**

- [Open question — owner to resolve by date]

**Changes to scope/criteria:**

- [What changed from original US]

---

[Repeat for each US]

## Session Summary

| US       | Estimate | DoR      | Sprint-Ready? |
| -------- | -------- | -------- | ------------- |
| US-{NNN} | {X}h     | ✅/⚠️/❌ | Yes/No        |

## Action Items

| #   | Action | Owner | Due Date |
| --- | ------ | ----- | -------- |

## Next Session

- **Date**: [next refinement date]
- **US to discuss**: [backlog items for next session]
```

## Key Rules

- **Domain estimates have wider ranges**: Complex domain work has higher uncertainty (2x-3x factor common)
- **Performance thresholds are mandatory**: Every US with performance requirements needs concrete latency/accuracy targets
- **Compliance is non-negotiable**: Every US handling sensitive data needs compliance validation
- **Testing scope defined**: Which devices/OS versions, platforms, or environments are in scope vs. out of scope
- **Fallback mechanisms clarified**: What happens when a primary path fails or a dependency is unavailable
- **Cross-functional dependencies explicit**: Research/algorithm work, security review, compliance validation
- **Test data requirements**: Diverse datasets, edge cases, and negative scenario needs defined
- **Regulatory context documented**: Which compliance frameworks apply (e.g., GDPR, PSD2, HIPAA, SOC2)

## Domain Example

See `examples/domain-example.md` for a detailed refinement session example from an identity verification project (featuring complex workflow features and regulatory compliance workflows).

## Quality Assurance

### Validation Script

This skill includes automated validation via `scripts/validate-examples.ts`:

```bash
# Validate skill examples and structure
npx tsx scripts/validate-examples.ts
```

**Validation includes:**

- Example completeness and correctness
- Refinement compliance patterns
- Progressive disclosure adherence
- Resource organization standards

**When to use:**

- Before skill release/packaging
- In CI/CD pipeline (quality gates)
- After major example updates
- During skill maintenance cycles

**Integration with ecosystem:**

- Used by `bmad-eval-runner` for ecosystem validation
- Supports quality gates in SDLC workflow
- Provides consistent validation across all skills

## Changelog

| Version | Date       | Author                       | Changes                                                                                |
| ------- | ---------- | ---------------------------- | -------------------------------------------------------------------------------------- |
| 1.2.1   | 2026-06-09 | TL: BMad-coherence batch-fix | Added `language_default: en` frontmatter (P5 bookkeeping)                              |
| 1.2.0   | 2026-06-09 | TL: lang+tool agnostic       | Language to English-default-configurable; abstracted Jira (tracking) via tool-registry |
