---
id: requirements-validation-checklist
version: "1.0.0"
last_updated: "2026-03-16"
updated_by: "System: Checklist Migration"
status: active
type: checklist
review_cycle: 30
next_review: "2026-04-15"
owner_role: "PO"
---

# Requirements Validation Checklist

> **Purpose**: Validation criteria for complete requirements traceability matrix and coherence check.
> **Evaluated by**: Skill the validate mode during Phase 3 — Specification
> **Associated Gate**: Gate 2 — Requirements Complete
> **Frequency**: After RFs and NFRs generation, before epic breakdown

---

## 1. Functional Requirements (RFs) Validation

### 1.1 Structural Completeness

- [ ] **All RFs Follow Standard Format** — Each RF uses the established template structure
- [ ] **Unique Identifiers** — All RFs have unique IDs following RF-{PROJ}-{NNN} pattern
- [ ] **Sequential Numbering** — No gaps in RF numbering sequence
- [ ] **Origin Traceability** — Each RF traces back to specific PRD sections
- [ ] **Priority Classification** — All RFs classified as Must/Should/Could/Won't

### 1.2 Content Quality

- [ ] **Clear Behavioral Descriptions** — Each RF describes observable system behavior
- [ ] **BDD Acceptance Criteria** — All RFs include Given/When/Then scenarios
- [ ] **Testable Criteria** — Each acceptance criterion can be verified objectively
- [ ] **Complete Scenarios** — Minimum: 1 happy path + 1 alternative + 1 error per RF
- [ ] **Concrete Data Examples** — Scenarios use specific data, not vague descriptions

### 1.3 Business Rules

- [ ] **Explicit Business Rules** — Business rules documented separately from acceptance criteria
- [ ] **Consistent Rules** — No contradictory business rules between RFs
- [ ] **Domain-Appropriate Rules** — Business rules align with domain terminology and constraints
- [ ] **Enforceable Rules** — All business rules can be implemented and validated

---

## 2. Non-Functional Requirements (NFRs) Validation

### 2.1 Measurability

- [ ] **Quantitative Targets** — All NFRs include specific, measurable targets
- [ ] **Clear Metrics** — Metrics for measuring NFR compliance defined
- [ ] **Testable Thresholds** — Performance, security, availability thresholds specified
- [ ] **Baseline Values** — Current state documented for comparison

### 2.2 Coverage

- [ ] **Performance Requirements** — Response time, throughput, resource usage defined
- [ ] **Security Requirements** — Authentication, authorization, data protection specified
- [ ] **Availability Requirements** — Uptime, disaster recovery, failover specified
- [ ] **Scalability Requirements** — Load capacity, growth scenarios defined
- [ ] **Compliance Requirements** — Regulatory and standards compliance specified

### 2.3 Technical Feasibility

- [ ] **Achievable with Proposed Architecture** — NFRs compatible with technical design
- [ ] **Resource Requirements Understood** — Infrastructure needs for NFR compliance estimated
- [ ] **Implementation Approach Defined** — How each NFR will be achieved documented
- [ ] **Verification Strategy** — How each NFR will be tested specified

---

## 3. Requirements Traceability Matrix (RTM)

### 3.1 Forward Traceability

- [ ] **PRD to RFs Mapping** — All PRD sections map to specific RFs
- [ ] **Complete Coverage** — No PRD functionality without corresponding RFs
- [ ] **Clear Relationships** — Mapping rationale documented for complex relationships
- [ ] **Gap Identification** — Any coverage gaps identified and addressed

### 3.2 Backward Traceability

- [ ] **RFs to PRD Mapping** — Every RF traces back to PRD source
- [ ] **No Orphan Requirements** — All RFs have clear business justification
- [ ] **Scope Alignment** — No requirements outside defined project scope
- [ ] **Change Impact Analysis** — Impact of RF changes on PRDs documented

### 3.3 Dependencies

- [ ] **RF Dependencies Mapped** — Dependencies between RFs identified
- [ ] **Dependency Graph Valid** — No circular dependencies in RF relationships
- [ ] **External Dependencies** — Dependencies on external systems documented
- [ ] **Critical Path Identified** — Dependencies critical for implementation prioritized

---

## 4. Coherence and Consistency

### 4.1 Internal Coherence

- [ ] **No Contradictory Requirements** — RFs don't conflict with each other
- [ ] **Consistent Terminology** — Same concepts use same terms throughout
- [ ] **Aligned Actors and Roles** — User roles consistent across all requirements
- [ ] **Compatible Workflows** — User journeys flow logically across RFs

### 4.2 External Coherence

- [ ] **PRD Alignment** — Requirements align with the unified PRD (functional + NFR scope)
- [ ] **Architecture Compatibility** — RFs implementable with proposed architecture
- [ ] **Technology Stack Alignment** — Requirements achievable with chosen technologies
- [ ] **Resource Constraints** — Requirements fit within budget and timeline constraints

---

## 5. Epic Breakdown Readiness

### 5.1 Decomposition Preparedness

- [ ] **Implementation Groupings Identified** — RFs grouped by implementation theme
- [ ] **Size Estimation Feasible** — RF groupings suitable for sprint-sized epics
- [ ] **Priority Order Clear** — Implementation sequence based on business priority
- [ ] **Dependency Order Respected** — Epic sequence respects RF dependencies

### 5.2 Sprint Planning Readiness

- [ ] **User Story Decomposition Possible** — RFs granular enough for user story creation
- [ ] **Acceptance Criteria Detailed** — BDD scenarios sufficient for development guidance
- [ ] **Test Planning Ready** — Requirements provide adequate detail for test planning
- [ ] **Definition of Ready Compatible** — Requirements meet criteria for sprint entry

---

## 6. Quality Gates

### 6.1 Gate 2 Criteria

- [ ] **All Mandatory Validations Pass** — No critical validation failures
- [ ] **Stakeholder Review Complete** — PO and technical stakeholders have reviewed
- [ ] **RTM Approved** — Traceability matrix signed off by Product Owner
- [ ] **Technical Feasibility Confirmed** — Tech Lead confirms implementability

### 6.2 Continuous Validation

- [ ] **Change Management Process** — Process for handling requirements changes defined
- [ ] **Version Control** — Requirements versioning and change tracking implemented
- [ ] **Stakeholder Communication** — Process for communicating changes established
- [ ] **Impact Assessment Process** — Process for evaluating change impacts defined

---

## 7. Validation Results

| Result          | Criteria                                          | Action                            |
| --------------- | ------------------------------------------------- | --------------------------------- |
| **VALIDATED**   | All critical checks pass, minor issues documented | Proceed to Epic Breakdown         |
| **CONDITIONAL** | Major issues with mitigation plan                 | Address issues before proceeding  |
| **FAILED**      | Critical issues unresolved                        | Return to requirements refinement |

---

## 8. Connection with SDLC Flow

```
PRD Approved (Gate 1) → RF/NFR Generation → Requirements Validation → Epic Breakdown
    ↓                                                ↓                        ↓
If VALIDATED → Gate 2 passed → Sprint Planning
If FAILED → Requirements refinement → Re-validation
```

---

## Changelog

| Version | Date       | Author                      | Changes                                          |
| ------- | ---------- | --------------------------- | ------------------------------------------------ |
| 1.0.0   | 2026-03-16 | System: Checklist Migration | Initial creation for validate-requirements skill |
