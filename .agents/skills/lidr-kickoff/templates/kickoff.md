---
id: tpl-kickoff
version: "1.1.0"
last_updated: "2026-06-09"
updated_by: "TL: lang+tool agnostic"
status: active
type: template
review_cycle: 60
next_review: "2026-05-15"
owner_role: "Scrum Master"
---

# Kickoff / Initiation Minutes Template

> **Usage**: Formal project kick-off minutes. Used by the skill `kickoff`.
> **Gate**: Gate 0 (Intake)
> **Output**: English by default; artifact language follows the client `language` setting (see `_shared/lidr/integrations/`).

---

## Project Data

| Field              | Value            |
| ------------------ | ---------------- |
| Project name       | {project_name}   |
| Sponsor            | {sponsor_name}   |
| Product Owner      | {po_name}        |
| Tech Lead          | {tl_name}        |
| Kick-off date      | {YYYY-MM-DD}     |
| Estimated duration | {N weeks/months} |

---

## Attendees

| Name   | Role   | Area        | Present  |
| ------ | ------ | ----------- | -------- |
| {name} | {role} | {area/team} | Yes / No |

---

## Project Objective

{Clear description of the project's main objective in 2-3 sentences. Must answer: What is being built and for whom.}

---

## Scope

### In Scope

- {feature/deliverable 1}
- {feature/deliverable 2}
- {feature/deliverable 3}

### Out of Scope

- {explicit exclusion 1}
- {explicit exclusion 2}

---

## Business Context

{Business Case summary: business problem, opportunity, expected success metrics. Reference to the approved BC.}

---

## Decisions Made

| #   | Decision   | Owner  | Rationale   |
| --- | ---------- | ------ | ----------- |
| 1   | {decision} | {name} | {rationale} |

---

## Initial Identified Risks

| ID    | Risk   | Probability     | Impact          | Proposed Mitigation |
| ----- | ------ | --------------- | --------------- | ------------------- |
| R-001 | {risk} | high/medium/low | high/medium/low | {mitigation}        |

---

## Next Steps

| #   | Action   | Owner  | Deadline     |
| --- | -------- | ------ | ------------ |
| 1   | {action} | {name} | {YYYY-MM-DD} |

---

## Success Criteria

- [ ] {measurable criterion 1}
- [ ] {measurable criterion 2}
- [ ] {measurable criterion 3}

---

## Signatures

| Role          | Name   | Signature      | Date         |
| ------------- | ------ | -------------- | ------------ |
| Sponsor       | {name} | \***\*\_\*\*** | {YYYY-MM-DD} |
| Product Owner | {name} | \***\*\_\*\*** | {YYYY-MM-DD} |
| Tech Lead     | {name} | \***\*\_\*\*** | {YYYY-MM-DD} |
