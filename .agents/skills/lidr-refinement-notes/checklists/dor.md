---
id: dor-checklist
version: "1.0.0"
last_updated: "2026-03-16"
updated_by: "System: Checklist Migration"
status: active
type: checklist
review_cycle: 30
next_review: "2026-04-15"
owner_role: "Scrum Master"
---

# Definition of Ready (DoR) Checklist

> **Purpose**: Criteria that a User Story must meet BEFORE entering the sprint.
> **Evaluated by**: Skill `refinement-notes` (during refinement) + PO manual validation
> **Associated Gate**: Gate 3 — Sprint Committed
> **Frequency**: Each sprint planning / refinement session

---

## 1. Mandatory Criteria

All criteria marked as mandatory must be PASS for the US to enter the sprint.

### 1.1 User Story Structure

- [ ] **Actor/Action/Value Format** — US follows "As [actor] I want [action] so that [business value]"
- [ ] **Actor Identified** — The actor exists in the stakeholder map with defined role
- [ ] **Explicit Business Value** — The "so that" describes measurable benefit, not technical action
- [ ] **Descriptive Title** — Title summarizes the US in ≤15 words without ambiguous technical jargon
- [ ] **No Ambiguities** — Does not contain "should", "could", "normally", "possibly", etc.

### 1.2 Acceptance Criteria

- [ ] **BDD Format Present** — At least 1 Given/When/Then scenario per acceptance criterion
- [ ] **Happy Path Covered** — Minimum 1 scenario of successful main flow
- [ ] **Error Path Covered** — Minimum 1 scenario of error or edge case
- [ ] **Concrete Data** — Scenarios use real example data, not vague descriptions
- [ ] **Testable** — Each criterion can be verified automatically or manually clearly

### 1.3 Estimation and Planning

- [ ] **Estimation in Hours** — Estimation field completed (hours, not story points)
- [ ] **Reasonable Size** — US fits in 1 sprint (if >40h, consider split)
- [ ] **Priority Assigned** — PO has assigned priority (MoSCoW or numeric)
- [ ] **Sprint Assigned** — US is in sprint backlog, not generic product backlog

### 1.4 Traceability and Dependencies

- [ ] **RF Linked** — US has reference to originating RF (RF Origin field)
- [ ] **Dependencies Resolved** — All identified dependencies are resolved or have documented mitigation plan
- [ ] **No Active Blockers** — No linked issues with status "Blocked" or "Impediment"
- [ ] **Epic Linked** — US belongs to an epic with approved Business Case

### 1.5 Design and Resources

- [ ] **Design Available** — Mockups/wireframes attached if applicable, or explicit confirmation of "no design required"
- [ ] **Test Data Identified** — QA can generate or obtain necessary data for testing
- [ ] **API Contract Defined** — If involves API, OpenAPI/Swagger contract available or agreed
- [ ] **Environment Access** — Dev has access to necessary environment for implementation

---

## 2. Desirable Criteria (Nice-to-Have)

Does not block sprint entry but significantly improves quality.

- [ ] **Preliminary Test Cases** — QA has generated draft test cases
- [ ] **Technical Approach Agreed** — Dev has proposed technical approach in refinement
- [ ] **Regression Impact Evaluated** — Affected areas identified for regression suite
- [ ] **Spike Completed** — If US required investigation, spike documented
- [ ] **Reusable Components Identified** — Dev has mapped what can be reused from previous implementations

---

## 3. Evaluation Results and Decisions

| Result                      | Meaning                          | Action                                    |
| --------------------------- | -------------------------------- | ----------------------------------------- |
| **READY**                   | All mandatory = PASS             | US can enter sprint                       |
| **READY with observations** | All PASS but desirable pending   | US enters, observations recorded          |
| **NOT READY**               | 1+ mandatory = FAIL              | US must be refined, does NOT enter sprint |
| **BLOCKED**                 | External dependency not resolved | Escalate to PO, find alternative US       |

---

## 4. Anti-patterns to Avoid

| Anti-pattern                     | Problem                                         | Solution                                            |
| -------------------------------- | ----------------------------------------------- | --------------------------------------------------- |
| "We'll refine during sprint"     | US enters without being ready, generates rework | Maintain strict DoR — NOT READY = does not enter    |
| "It's already understood"        | Missing BDD criteria, free interpretation       | Require explicit Given/When/Then always             |
| "It's similar to previous"       | Not estimated, assumes same effort              | Estimate each US individually in refinement         |
| "Dependency will resolve itself" | Ignored blocker, discovered mid-sprint          | Verify real status of dependencies                  |
| "We'll see design later"         | Dev implements without mockups, rework          | Design must exist BEFORE sprint or US doesn't enter |

---

## 5. Connection with SDLC Flow

```
RF approved (Gate 2) → User Stories generated → DoR evaluated
    ↓                                                ↓
If PASS → Sprint backlog → Sprint commitment
If FAIL → Refinement backlog → Re-evaluate in next refinement
```

---

## Changelog

| Version | Date       | Author                      | Changes                                       |
| ------- | ---------- | --------------------------- | --------------------------------------------- |
| 1.0.0   | 2026-03-16 | System: Checklist Migration | Initial migration from docs/checklists/dor.md |
