---
name: lidr-refinement-notes
id: refinement-notes
version: "1.4.0"
last_updated: "2026-06-12"
updated_by: "TL: ticket-fusion consolidation"
status: active
phase: 3
stage: sprint-planning
owner_role: "TL"
automation: false
domain_agnostic: true
language_default: en
integrations: [tracking]
description: 'POST-BMad WRAPPER + single ticket/story-quality authority: consumes the Phase-3 backlog stories (the `bmad-create-epics-and-stories` story skeleton and/or the `lidr-user-stories` PO backlog) and captures DoR-readiness grooming notes (domain decisions, compliance clarifications, performance thresholds, cross-platform needs). Adds the LIDR Gate 3 DoR validation layer BMad has no concept of, and owns ticket/story-quality validation — use when agents need to "validate ticket structure", "check YAML frontmatter", "verify acceptance criteria", "review Definition of Done", or "validate BDD scenarios" (see references/ticket-validation.md). ALWAYS use during backlog grooming — after the story skeleton exists, before sprint commitment (and before the Phase-4 `bmad-create-story`/`bmad-dev-story` context-fill + implement the story).'
---

# Refinement Notes Structurer

Phase: 3 — Solutioning · sprint-planning (ex-Fase 4) | Language: English by default; artifact language follows the client `language` setting (see `_shared/lidr/integrations/`)

Tools resolve via the central registry `_shared/lidr/integrations/tool-registry.yaml`; the active client binds concrete tools in `clients/<CODE>.yaml`.

## Relationship to BMad

POST-BMad wrapper (BMad has no Definition-of-Ready gate). `bmad-create-epics-and-stories` produces the epic→story skeleton and `lidr-user-stories` refines it into the PO backlog, but nothing in the base flow grooms those stories for readiness before sprint commitment. This skill (Phase 3 · sprint-planning) consumes those **Phase-3 backlog stories** — the `bmad-create-epics-and-stories` skeleton and/or the `lidr-user-stories` PO backlog — and captures the LIDR refinement record (domain decisions, compliance clarifications, performance thresholds, blockers), flagging each story `sprint-ready` vs `needs investigation`. Feeds **Gate 3** evidence (DoR validation) — which gates BEFORE the Phase-4 `bmad-create-story` context-fill, `bmad-dev-story`, or the `lidr-spec-*` lifecycle implements the story.

## Ticket / Story Validation

This skill is the **single ticket/story-quality + DoR authority** for the ecosystem (consolidated 2026-06-12; absorbed the former `lidr-ticket-validation` skill). It validates ticket structure, YAML frontmatter, acceptance-criteria specificity, Definition of Done completeness, BDD/Gherkin scenario quality, and tasks-section assignments — then enriches incomplete tickets before they reach sprint commitment.

Two layers cover the readiness story:

- **`references/ticket-validation.md`** — ticket-level structural + content checks (frontmatter, AC quality, DoD, BDD, tasks) and common-issue→fix patterns. Trigger phrases: "validate ticket structure", "check YAML frontmatter", "verify acceptance criteria", "review Definition of Done", "validate BDD scenarios".
- **`checklists/dor.md`** — the Definition-of-Ready gate (Gate 3 evidence).

The actionable appliers run on this single source: the `/lidr-enrich-ticket` command and `lidr-ticket-enricher` subagent (enrich incomplete tickets) and the `lidr-pr-validator` subagent (DoD readiness before PR).

## References

- `references/ticket-validation.md` — ticket/story-quality validation patterns + checklists
- `checklists/dor.md` — Definition of Ready (Gate 3 DoR)

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

| Version | Date       | Author                          | Changes                                                                                                                                                                                                                                                                                                          |
| ------- | ---------- | ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1.4.0   | 2026-06-12 | TL: ticket-fusion consolidation | Absorbed the former `lidr-ticket-validation` skill: added `references/ticket-validation.md` (full ticket/story-quality validation patterns), a "## Ticket / Story Validation" body section, and the 5 ticket-validation trigger phrases into `description:`. Now the single ticket/story-quality + DoR authority |
| 1.3.0   | 2026-06-11 | TL: BMad-seam visibility        | Added "## Relationship to BMad": makes explicit that it consumes `bmad-create-story` / `lidr-user-stories` output and feeds Gate 3 DoR before `bmad-dev-story` / `lidr-spec-*` (relationship was only in the `description:` before); normalized body `Phase:` prose to unified numbering                         |
| 1.2.1   | 2026-06-09 | TL: BMad-coherence batch-fix    | Added `language_default: en` frontmatter (P5 bookkeeping)                                                                                                                                                                                                                                                        |
| 1.2.0   | 2026-06-09 | TL: lang+tool agnostic          | Language to English-default-configurable; abstracted Jira (tracking) via tool-registry                                                                                                                                                                                                                           |
