---
id: rf-coherence-checklist
version: "1.0.0"
last_updated: "2026-03-16"
updated_by: "System: Checklist Migration"
status: active
type: checklist
review_cycle: 30
next_review: "2026-04-15"
owner_role: "PO"
---

# Coherence Checklist — Functional Requirements

> **Purpose**: Validation of internal coherence (between RFs) and external coherence (with the unified PRD — functional + NFR scope — and the architecture doc).
> **Evaluated by**: Skill the per-rf mode (post-generation) + manual review by Product + QA
> **Associated Gate**: Gate 2 — RF Complete
> **Frequency**: After each RF generation/modification and before Gate 2

---

## 1. Internal Coherence (between RFs)

### 1.1 Semantic Consistency

- [ ] **No Contradictions** — No RF contradicts another in behavior, business rules, or flows
- [ ] **Consistent Terminology** — Same concepts use same terms across all RFs
- [ ] **Consistent Actors** — Referenced actors exist in stakeholder map with coherent roles
- [ ] **Non-Contradictory Business Rules** — Business rules in one RF do not contradict rules in another
- [ ] **Consistent States** — If multiple RFs handle entity states, resulting state diagram is coherent with no impossible transitions

### 1.2 Structural Consistency

- [ ] **Connected Flows** — Alternative/error flows of one RF do not contradict main flows of other RFs handling same entity
- [ ] **Correct Dependencies** — Dependencies declared in Dependency Matrix are bidirectional and form a DAG (no circular dependencies)
- [ ] **No Duplicates** — No RFs describe same behavior with different ID (semantic similarity <80%)
- [ ] **Sequential Numbering** — IDs follow RF-{PROJ}-{NNN} sequential format without gaps or duplicates
- [ ] **Fulfillable Prerequisites** — Prerequisites declared in each RF exist as other RFs and are reachable in order

### 1.3 Completeness

- [ ] **All Flows Have Happy Path** — Each RF has at least one main flow documented
- [ ] **Error Flows Documented** — Each RF has at least 1 error flow
- [ ] **Explicit Business Rules** — Business rules are not implicit in BDD criteria — they are explicitly declared in RN section
- [ ] **Actors for All Flows** — Each flow (main, alternative, error) has a responsible actor

---

## 2. External Coherence (with the unified PRD + architecture doc)

### 2.1 Coverage

- [ ] **Complete PRD→RF Coverage** — Everything described in the PRD is covered by at least 1 RF
- [ ] **No Scope Creep** — No RF describes functionality outside scope declared in the PRD
- [ ] **Complete RF→PRD Coverage** — Every RF has at least 1 PRD section that originated it

### 2.2 Technical Feasibility

- [ ] **Limitations Respected** — RFs do not require capabilities excluded by the PRD's stated limitations
- [ ] **Architecture Compatible** — RF flows are implementable with the proposed architecture (architecture doc)
- [ ] **APIs Aligned** — RFs involving APIs are compatible with the architecture doc's API design
- [ ] **Performance Achievable** — Implicit performance requirements in RFs are achievable with proposed stack
- [ ] **Integrations Covered** — RFs requiring external integrations have that integration contemplated in the architecture doc

### 2.3 Coherence with the PRD's functional scope

- [ ] **User Journeys Covered** — User journeys from the PRD are completely decomposed into RFs
- [ ] **Traceable Success Metrics** — Success metrics from the PRD are measurable through implemented RFs
- [ ] **Consistent Prioritization** — RFs derived from P0 functionalities in PRD are marked as mandatory, not optional

---

## 3. BDD Acceptance Criteria Quality

- [ ] **Correct Format** — All criteria follow strict Given/When/Then format
- [ ] **Testable** — Each criterion can be verified automatically or manually clearly
- [ ] **No Ambiguities** — No "should", "could", "normally", "approximately", etc. Only concrete behavior
- [ ] **Specific Data** — Criteria include concrete example data: quantities, exact message texts, specific times
- [ ] **Scenario Coverage** — Minimum: 1 happy path + 1 alternative + 1 error per RF
- [ ] **Verifiable Preconditions** — "Given" describes achievable states, not abstract conditions
- [ ] **Atomic Actions** — "When" describes 1 action, not complex sequences
- [ ] **Observable Results** — "Then" describes results that QA can verify (UI, API response, DB state)

---

## 4. Common Anti-patterns

| Anti-pattern               | How Detected                                  | Corrective Action                                     |
| -------------------------- | --------------------------------------------- | ----------------------------------------------------- |
| **Catch-all RF**           | 1 RF covers too many flows (>5 main flows)    | Split into more granular RFs                          |
| **Vague BDD Criteria**     | "System works correctly"                      | Rewrite with concrete data and observable results     |
| **Circular Dependency**    | RF-01 depends on RF-05 which depends on RF-01 | Refactor to break cycle                               |
| **Silent Scope Creep**     | RF without originating PRD section            | Validate with PO: necessary? If yes, update PRD first |
| **Copy-paste between RFs** | >80% similarity between 2 RFs                 | Extract base RF and reference, don't duplicate        |

---

## 5. Connection with SDLC Flow

```
PRD approved (Gate 1) → RFs generated (per-rf mode) → Coherence check
    ↓                                                              ↓
If COHERENT → Gate 2: RF Complete → Sprint Planning
If ISSUES → Fix incoherences → Re-generate/adjust RFs → Re-evaluate
```

---

## Changelog

| Version | Date       | Author                      | Changes                                                |
| ------- | ---------- | --------------------------- | ------------------------------------------------------ |
| 1.0.0   | 2026-03-16 | System: Checklist Migration | Initial migration from docs/checklists/rf-coherence.md |
