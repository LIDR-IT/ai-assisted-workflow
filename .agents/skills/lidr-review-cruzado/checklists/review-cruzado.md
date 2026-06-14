---
id: review-cruzado-checklist
version: "1.1.0"
last_updated: "2026-06-12"
updated_by: "TL: domain-agnostic leak fix"
status: active
type: checklist
review_cycle: 30
next_review: "2026-07-12"
owner_role: "PO"
---

# PRD Alignment Checklist — Functional ↔ Technical Coherence (unified PRD)

> **Purpose**: Bidirectional consistency validation of the unified PRD's Functional ↔ Technical scopes (one `prd.md`, not two documents).
> **Evaluated by**: Skill `review-cruzado` + in-person review by Product + R&D
> **Associated Gate**: Gate 1 — PRD Approved
> **Frequency**: Mandatory before closing Gate 1. Repeated if any PRD changes post-Gate.

---

## 1. Scope Consistency

### 1.1 Scope Alignment

- [ ] **Aligned Scope** — Functional and technical scopes describe the same project scope
- [ ] **Functionalities Covered** — All functional-scope requirements have technical support in the PRD's technical scope
- [ ] **Limitations Communicated** — Technical-scope limitations are reflected in the functional scope (exclusions, restrictions)
- [ ] **Consistent Exclusions** — What's excluded in one is excluded in both
- [ ] **Coherent Roadmap** — Functional roadmap phases are viable with proposed technical roadmap

### 1.2 Terminology

- [ ] **Consistent Glossary** — Same concepts use same terms across the functional and technical sections
- [ ] **Aligned Actors** — Actors/roles mentioned across the functional and technical sections are the same with same responsibilities
- [ ] **Compatible Metrics** — Functional success metrics are measurable with proposed technical architecture

---

## 2. Requirements Consistency

### 2.1 Technical Feasibility of Functional

- [ ] **Viable User Journeys** — Each functional-scope journey is implementable with the technical-scope architecture
- [ ] **Sufficient Technical Capabilities** — Technical-scope capabilities cover all key functional-scope requirements
- [ ] **Compatible Performance** — Implicit performance requirements in functional are achievable with technical stack
- [ ] **Aligned Scalability** — Functional growth scenarios are supported by technical architecture

### 2.2 Integrations and Dependencies

- [ ] **Aligned Integrations** — Integrations needed for functional are contemplated in technical (APIs, services, SDKs)
- [ ] **Explicit Technical Dependencies** — Technical dependencies in the technical scope do not block priority functional requirements
- [ ] **Bidirectional APIs** — If functional requires data from external system, technical describes how to obtain it
- [ ] **Data and Storage** — Data that functional requires to persist is contemplated in technical data model

### 2.3 Security and Compliance

- [ ] **Traced Security Requirements** — Functionalities handling sensitive data have technical security counterpart
- [ ] **Reflected Compliance** — Functional regulatory requirements have described technical implementation
- [ ] **Handled Special-Category Data** — If involving special-category data (e.g. biometric/health, GDPR Art. 9): the technical scope details encryption, storage, and specific compliance

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
- [ ] **Product confirms**: the functional scope is consistent with the technical scope
- [ ] **R&D/Core confirms**: the technical scope supports all committed functionalities
- [ ] **QA confirms** (observer): RFs will be testable with this foundation

### 4.2 Required Signatures

- [ ] **Product Owner signed**
- [ ] **Tech Lead / R&D Lead signed**
- [ ] **QA Lead signed** (observer)

---

## 5. Anti-patterns to Avoid

| Anti-pattern                       | Alert Signal                                                                | Solution                                                                  |
| ---------------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| **Cosmetic review**                | Session <15 min, 0 findings                                                 | Use AI report as baseline — there are always items                        |
| **"We'll see it later"**           | Critical gaps deferred without plan                                         | Force decision: cover now, defer with date, or explicitly exclude         |
| **Session without QA**             | QA discovers inconsistencies in Gate 2 that should have been seen in Gate 1 | QA as mandatory observer — brings testability perspective                 |
| **PRD scopes diverging post-Gate** | PRD changes without re-review                                               | Any post-Gate 1 change requires re-evaluation (minimum impact assessment) |
| **One scope dominates**            | Technical ignores functional or vice versa                                  | Facilitator ensures balance                                               |

---

## 6. Connection with SDLC Flow

```
prd.md generated (Functional + Technical scopes)
    ↓
Cross Review (this checklist + skill review-cruzado)
    ↓
If PASS → Gate 1: PRD Approved → Phase 3: RF Specification
If FAIL → Fix PRDs → Re-review
```

---

## Changelog

| Version | Date       | Author                       | Changes                                                                                                                |
| ------- | ---------- | ---------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| 1.1.0   | 2026-06-12 | TL: domain-agnostic leak fix | "Handled Biometrics" item generalized to "Handled Special-Category Data" (biometric now an e.g.) — agnostic by default |
| 1.0.0   | 2026-03-16 | System: Checklist Migration  | Initial migration from docs/checklists/review-cruzado.md                                                               |
