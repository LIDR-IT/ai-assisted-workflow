---
name: epic-decomposition-rules
description: Reference rules for decomposing a master epic into feature sub-epics. Migrated from lidr-epic-breakdown skill. Use with bmad-create-epics-and-stories as project-specific customization.
last_updated: "2026-05-19"
status: active
type: reference
origin: lidr-epic-breakdown (deleted)
replaces_with: bmad-create-epics-and-stories
---

# Epic Decomposition Rules (LIDR SDLC)

> Reference rules extracted from `lidr-epic-breakdown` (deleted skill). Use as customization input to `bmad-create-epics-and-stories` when decomposing requirements into feature sub-epics at the Phase 3→4 boundary (Specification → Sprint Planning).

## Prerequisites (must exist before decomposition)

| Artifact                | Source                              | Required           |
| ----------------------- | ----------------------------------- | ------------------ |
| Validated RTM           | `lidr-requirements` (validate mode) | Blocks execution   |
| Implementation Clusters | `lidr-requirements` (validate mode) | Blocks execution   |
| Master Project          | `lidr-tracking-integration`         | Blocks execution   |
| Dependency Map          | `lidr-requirements` (per-rf mode)   | Critical           |
| NFR Summary             | `lidr-requirements` (nfr mode)      | Highly recommended |

**Do NOT proceed without validated requirements.**

## Sizing thresholds

- **>8 RFs in an epic** → split into multiple sub-epics
- **<2 RFs in an epic** → merge with adjacent epic
- **5±3 RFs** is the target sweet spot

## Grouping criteria (priority order)

1. **Business cohesion** — RFs serving the same user journey or capability
2. **Dependency chain** — RFs with hard order-of-implementation links
3. **Technical affinity** — RFs touching the same architectural layer / component
4. **Team allocation** — RFs implementable by the same squad

## Enabler Epic concept

NFRs that span multiple feature epics (cross-cutting performance, observability, security) form their own **Enabler Epic**. They do NOT get distributed across feature epics.

## Cross-cutting NFR distribution logic

- NFR is local to one epic → embed it in that epic's acceptance criteria
- NFR spans 2+ epics with shared infrastructure → create Enabler Epic
- NFR is global (e.g. WCAG AA) → reference from project NFR baseline, not per-epic

## Coverage validation

After decomposition: **100% of RFs MUST be assigned to at least one sub-epic.** Orphan RFs are gate-blocking.

## Output template

See `.agents/_shared/lidr/templates/epic.md` for the Spanish-language epic format.

## Typical master epics (domain examples)

1. "User Onboarding Platform v2.0" → Document Capture, Data Processing, Input Validation, Identity Matching
2. "Regulatory Compliance Integration" → Qualified Signatures, Cross-border Interoperability, Audit Trails
3. "Mobile SDK Enhancement" → iOS Native, Android Native, React Native Bridge, Performance Optimization
4. "Anti-Fraud Detection Engine" → Behavioral Analysis, Device Fingerprinting, Risk Scoring, Alert Management

## How to use with BMad

When invoking `bmad-create-epics-and-stories`, prepend these rules to the conversation context or reference them explicitly:

```
Use the LIDR epic decomposition rules at .agents/_shared/lidr/references/epic-decomposition-rules.md
Use the LIDR epic template at .agents/_shared/lidr/templates/epic.md (Spanish)
```
