---
id: review-cruzado-checklist
version: "1.0.0"
last_updated: "2026-03-16"
updated_by: "System: Checklist Migration"
status: active
type: checklist
review_cycle: 30
next_review: "2026-04-15"
owner_role: "PO"
---

# Cross Review Checklist — Technical ↔ Functional PRD

> **Purpose**: Bidirectional consistency validation between Technical PRD and Functional PRD.
> **Evaluated by**: Skill `review-cruzado` + in-person review by Product + R&D
> **Associated Gate**: Gate 1 — PRD Approved
> **Frequency**: Mandatory before closing Gate 1. Repeated if any PRD changes post-Gate.

---

## 1. Scope Consistency

### 1.1 Scope Alignment

- [ ] **Aligned Scope** — Both PRDs describe same project scope
- [ ] **Functionalities Covered** — All Functional PRD functionality has technical support in Technical PRD
- [ ] **Limitations Communicated** — Technical PRD limitations are reflected in functional scope (exclusions, restrictions)
- [ ] **Consistent Exclusions** — What's excluded in one is excluded in both
- [ ] **Coherent Roadmap** — Functional roadmap phases are viable with proposed technical roadmap

### 1.2 Terminology

- [ ] **Consistent Glossary** — Same concepts use same terms in both PRDs
- [ ] **Aligned Actors** — Actors/roles mentioned in both PRDs are the same with same responsibilities
- [ ] **Compatible Metrics** — Functional success metrics are measurable with proposed technical architecture

---

## 2. Requirements Consistency

### 2.1 Technical Feasibility of Functional

- [ ] **Viable User Journeys** — Each Functional PRD journey is implementable with Technical PRD architecture
- [ ] **Sufficient Technical Capabilities** — Technical PRD capabilities cover all key Functional PRD functionalities
- [ ] **Compatible Performance** — Implicit performance requirements in functional are achievable with technical stack
- [ ] **Aligned Scalability** — Functional growth scenarios are supported by technical architecture

### 2.2 Integrations and Dependencies

- [ ] **Aligned Integrations** — Integrations needed for functional are contemplated in technical (APIs, services, SDKs)
- [ ] **Explicit Technical Dependencies** — Technical dependencies mentioned in Technical PRD do not block priority Functional functionalities
- [ ] **Bidirectional APIs** — If functional requires data from external system, technical describes how to obtain it
- [ ] **Data and Storage** — Data that functional requires to persist is contemplated in technical data model

### 2.3 Security and Compliance

- [ ] **Traced Security Requirements** — Functionalities handling sensitive data have technical security counterpart
- [ ] **Reflected Compliance** — Functional regulatory requirements have described technical implementation
- [ ] **Handled Biometrics** — If involving biometric data: Technical PRD details encryption, storage, and specific compliance

---

## 3. Gap Analysis

### 3.1 Bidirectional Gap Analysis

#### Functional → Technical Gaps

_(Functionalities without clear technical support)_

- [ ] **All functionalities have technical support identified**
- [ ] **Critical gaps have resolution plan**
- [ ] **Major gaps have assigned owner and deadline**

#### Technical → Functional Gaps

_(Technical capabilities without functional use case — possible over-engineering)_

- [ ] **All technical capabilities have functional justification**
- [ ] **Unused capabilities reviewed for necessity**
- [ ] **Over-engineering risks assessed**

#### Cross Risks

_(Risks impacting both PRDs requiring coordinated mitigation)_

- [ ] **Cross risks identified and documented**
- [ ] **Mitigation strategies assigned owners**
- [ ] **Risk monitoring plan established**

---

## 4. Cross Review Session

### 4.1 Sign-off Criteria

- [ ] **All Critical gaps resolved** or with approved resolution plan
- [ ] **Major gaps with owner and deadline** assigned
- [ ] **Cross risks with documented mitigation**
- [ ] **Action items assigned** with realistic dates
- [ ] **Product confirms**: Functional PRD is consistent with Technical PRD
- [ ] **R&D/Core confirms**: Technical PRD supports all committed functionalities
- [ ] **QA confirms** (observer): RFs will be testable with this foundation

### 4.2 Required Signatures

- [ ] **Product Owner signed**
- [ ] **Tech Lead / R&D Lead signed**
- [ ] **QA Lead signed** (observer)

---

## 5. Anti-patterns to Avoid

| Anti-pattern                 | Alert Signal                                                                | Solution                                                                  |
| ---------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| **Cosmetic review**          | Session <15 min, 0 findings                                                 | Use AI report as baseline — there are always items                        |
| **"We'll see it later"**     | Critical gaps deferred without plan                                         | Force decision: cover now, defer with date, or explicitly exclude         |
| **Session without QA**       | QA discovers inconsistencies in Gate 2 that should have been seen in Gate 1 | QA as mandatory observer — brings testability perspective                 |
| **PRDs diverging post-Gate** | PRD changes without re-review                                               | Any post-Gate 1 change requires re-evaluation (minimum impact assessment) |
| **One PRD dominates**        | Technical ignores functional or vice versa                                  | Facilitator ensures balance                                               |

---

## 6. Connection with SDLC Flow

```
PRD-T generated + PRD-F generated
    ↓
Cross Review (this checklist + skill review-cruzado)
    ↓
If PASS → Gate 1: PRD Approved → Phase 3: RF Specification
If FAIL → Fix PRDs → Re-review
```

---

## Changelog

| Version | Date       | Author                      | Changes                                                  |
| ------- | ---------- | --------------------------- | -------------------------------------------------------- |
| 1.0.0   | 2026-03-16 | System: Checklist Migration | Initial migration from docs/checklists/review-cruzado.md |
