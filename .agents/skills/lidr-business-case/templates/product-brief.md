---
id: product-brief-template
version: "1.0.0"
last_updated: "2026-03-16"
updated_by: "System: Template Migration"
status: active
type: template
review_cycle: 90
next_review: "2026-06-14"
owner_role: "Product Owner"
---

# Template: Product Brief

> **Purpose**: Startup document that captures the vision, problem, and initial scope of a product/project.
> **When it is created**: Phase 1 — Origination, before the kick-off
> **Who fills it**: PME / Product Owner with assistance from skill `business-case`
> **Who validates it**: Executive sponsor + key stakeholders
> **Associated gate**: Gate 0 — Intake Approved
> **Instances per project**: `docs/projects/{project}/product-brief.md`

---

## Document Sections

### 1. Executive Summary

```markdown
## Executive Summary

**Product/project name**: {name}
**Sponsor**: {name and role}
**Product Owner**: {name}
**Date**: {YYYY-MM-DD}
**Status**: Draft | Under Review | Approved

### Elevator Pitch (2-3 sentences)

{What it is, for whom, what problem it solves, and why now}
```

**Validation criterion**: Elevator pitch ≤3 sentences. Must answer WHAT, FOR WHOM, WHY.

### 2. Problem

```markdown
## Problem

### Current Situation

{Describe the current state — what exists today, how it works, what pain it causes}

### Problem Impact

| Dimension | Impact                        | Evidence                      |
| --------- | ----------------------------- | ----------------------------- |
| Users     | {how many affected, how}      | {data, metrics, feedback}     |
| Business  | {revenue, efficiency, risk}   | {financial data if available} |
| Technical | {debt, scalability, security} | {technical metrics}           |

### Root of the Problem

{Causal analysis — why the problem exists, not just the symptoms}
```

**Validation criteria**:

- [ ] Current situation describes the status quo without proposing solutions
- [ ] Impact quantified with at least 1 concrete metric or data point
- [ ] Root of the problem identified (not just symptoms)

### 3. Proposed Solution

```markdown
## Proposed Solution

### Product Vision

{1-2 paragraphs describing the solution in business language}

### Key Objectives (maximum 5)

| #   | Objective | Success Metric | Target |
| --- | --------- | -------------- | ------ |
| O1  |           |                |        |
| O2  |           |                |        |

### Initial Scope (MVP)

#### Includes

- {Feature 1}
- {Feature 2}

#### Excludes (explicitly)

- {Feature out of scope} — reason: {justification}

### Anti-scope (what it will NEVER be)

- {Feature that will not be built under any circumstance}
```

**Validation criteria**:

- [ ] SMART objectives (Specific, Measurable, Achievable, Relevant, Time-bound)
- [ ] ≤5 objectives (focus)
- [ ] Scope with explicit inclusions AND exclusions
- [ ] Each exclusion has justification

### 4. Users and Stakeholders

```markdown
## Users and Stakeholders

### Primary Users

| Persona | Role | Main Need | Usage Frequency          |
| ------- | ---- | --------- | ------------------------ |
|         |      |           | Daily / Weekly / Monthly |

### Stakeholders

| Name | Role | Influence       | Interest        | Communication Channel |
| ---- | ---- | --------------- | --------------- | --------------------- |
|      |      | High/Medium/Low | High/Medium/Low |                       |
```

**Validation criteria**:

- [ ] At least 1 primary user identified with a concrete need
- [ ] Stakeholders with influence and interest levels mapped
- [ ] Executive sponsor identified

### 5. Initial Technical Context

```markdown
## Technical Context (High Level)

### Proposed Stack (if known)

{Main proposed technologies or known technical constraints}

### Required Integrations

| System | Type                  | Criticality     | Status                       |
| ------ | --------------------- | --------------- | ---------------------------- |
|        | API / SDK / DB / File | High/Medium/Low | Available / To be negotiated |

### Known Technical Constraints

- {Constraint 1 — e.g.: must work offline}
- {Constraint 2 — e.g.: compatibility with legacy system X}

### Security/Compliance Requirements

- {Applicable regulation — e.g.: GDPR, HIPAA}
- {Sensitive data — e.g.: PII, financial}
```

**Validation criteria**:

- [ ] Integrations identified with criticality
- [ ] Explicit technical constraints
- [ ] Compliance requirements identified if applicable

### 6. Timeline and Resources

```markdown
## Timeline and Resources

### Key Milestones

| Milestone | Target Date | Dependency |
| --------- | ----------- | ---------- |
| Kick-off  |             |            |
| MVP ready |             |            |
| Go-live   |             |            |

### Required Resources

| Role | Quantity | Dedication | Availability |
| ---- | -------- | ---------- | ------------ |
|      |          | %          | From {date}  |

### Estimated Budget (if applicable)

| Concept        | Estimate | Notes |
| -------------- | -------- | ----- |
| Development    |          |       |
| Infrastructure |          |       |
| Licenses       |          |       |
```

### 7. Initial Risks

```markdown
## Initial Risks

| #   | Risk | Probability     | Impact          | Proposed Mitigation |
| --- | ---- | --------------- | --------------- | ------------------- |
| R1  |      | High/Medium/Low | High/Medium/Low |                     |
```

### 8. Approval

```markdown
## Approval

| Role    | Name | Decision                 | Signature | Date |
| ------- | ---- | ------------------------ | --------- | ---- |
| Sponsor |      | Approve / Reject / Defer |           |      |
| PO      |      | Approve / Reject         |           |      |
```

---

## Global Completeness Criteria

| Criterion                          | Required | Validation               |
| ---------------------------------- | -------- | ------------------------ |
| Elevator pitch present             | Yes      | Automatic (≤3 sentences) |
| Problem with quantified impact     | Yes      | Semi-auto                |
| ≤5 SMART objectives                | Yes      | Automatic                |
| Scope with inclusions + exclusions | Yes      | Automatic                |
| At least 1 primary user            | Yes      | Automatic                |
| Sponsor identified                 | Yes      | Automatic                |
| Timeline with ≥3 milestones        | Yes      | Automatic                |
| At least 1 risk identified         | Yes      | Automatic                |
| Sponsor approval                   | Yes      | Manual                   |

---

## Assisting Skills

- **Generation**: Skill `business-case` generates a draft from the business problem
- **Stakeholders**: Skill `stakeholder-map` suggests a stakeholder map
- **Validation**: Command `/validate-project-docs` verifies completeness criteria
- **Next step**: Skill `kickoff` generates the kick-off minutes from this brief

---

_Format template — each project creates its instance in `docs/projects/{project}/product-brief.md`_
