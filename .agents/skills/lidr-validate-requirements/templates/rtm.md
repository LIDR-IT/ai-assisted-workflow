# Template: Requirements Traceability Matrix (RTM)

> **Purpose**: Complete bidirectional traceability: Business Case → PRDs → RFs + NFRs → Epics → US.
> **When it is created**: Phase 3 — Specification, after generating and validating RFs + NFRs
> **Who fills it in**: PO + TL with skill `validate-requirements`
> **Associated Gate**: Gate 2 — Requirements Complete and Coherent
> **Instances**: `docs/projects/{project}/rtm.md`

---

## Document Sections

### 1. Coverage Summary

```markdown
## Coverage Summary

| Source                | Total Items | Covered | Gaps | Coverage |
| --------------------- | ----------- | ------- | ---- | -------- |
| PRD-F Functionalities | N           | N       | N    | N%       |
| PRD-T NFR Categories  | N           | N       | N    | N%       |
| RFs with BDD          | N           | N       | N    | N%       |
| NFRs with Metrics     | N           | N       | N    | N%       |

**Overall Status**: ✅ PASS / ⚠️ CONDITIONAL / ❌ FAIL
```

### 2. Forward Traceability (BC → PRD → RF/NFR)

```markdown
## Forward: Business → Requirements

| Need (BC)         | PRD Functionality | RF(s)                | NFR(s)          | Status     |
| ----------------- | ----------------- | -------------------- | --------------- | ---------- |
| {BC objective §X} | F-001: {name}     | RF-XX-001, RF-XX-002 | NFR-XX-PERF-001 | ✅ Covered |
| {BC objective §Y} | F-002: {name}     | —                    | —               | ❌ GAP     |
```

### 3. Backward Traceability (RF/NFR → PRD → BC)

```markdown
## Backward: Requirements → Business

| RF/NFR         | PRD Reference    | BC Objective | Validated   |
| -------------- | ---------------- | ------------ | ----------- |
| RF-XX-001      | PRD-F §2.4 F-001 | {objective}  | ✅          |
| NFR-XX-SEC-001 | PRD-T §5.2       | {security}   | ✅          |
| RF-XX-015      | —                | —            | ❌ Orphaned |
```

### 4. NFR → RF Impact Matrix

```markdown
## NFR → RF Impact

| NFR             | Applies to RFs         | Type        | Notes                |
| --------------- | ---------------------- | ----------- | -------------------- |
| NFR-XX-PERF-001 | RF-001, RF-005, RF-010 | Specific    | Critical latency     |
| NFR-XX-SEC-001  | ALL                    | System-wide | Mandatory encryption |
| NFR-XX-ACC-001  | RF-020, RF-021         | Specific    | UI-facing RFs        |
```

### 5. Implementation Clusters

```markdown
## Clusters for Sprint Planning

| Cluster         | RFs         | Applicable NFRs          | Est. Sprints | Dependencies | Team     |
| --------------- | ----------- | ------------------------ | ------------ | ------------ | -------- |
| Auth & Security | RF-001..005 | NFR-SEC-\*, NFR-PERF-001 | 2-3          | None         | Backend  |
| Core Biometrics | RF-010..020 | NFR-PERF-\*, NFR-SEC-002 | 3-4          | Cluster 1    | Core     |
| UI/UX           | RF-030..035 | NFR-ACC-\*, NFR-PERF-003 | 2            | Cluster 1, 2 | Frontend |
```

### 6. Gap Report

```markdown
## Detected Gaps

### Critical (block Gate 2)

| #   | Type       | Description | Action      | Owner | Deadline |
| --- | ---------- | ----------- | ----------- | ----- | -------- |
| 1   | Functional | F-XXX no RF | Generate RF | PO    | {date}   |

### Warnings (do not block)

| #   | Type         | Description         | Recommendation       |
| --- | ------------ | ------------------- | -------------------- |
| 1   | Low coverage | F-XXX has only 1 RF | Consider decomposing |
```

---

## Completeness Criteria

| Criterion                                    | Mandatory | Gate     |
| -------------------------------------------- | --------- | -------- |
| 100% of PRD functionalities covered by ≥1 RF | Yes       | Gate 2   |
| All mandatory NFR categories present         | Yes       | Gate 2   |
| 0 orphaned RFs (no traceability to PRD)      | Yes       | Gate 2   |
| 0 NFRs without measurement method            | Yes       | Gate 2   |
| Clusters identified with estimates           | Yes       | Gate 2→3 |
| Gap report with 0 critical items             | Yes       | Gate 2   |

---

## Assisting Skills

- **RFs**: `skills/generate-rf/SKILL.md`
- **NFRs**: `skills/generate-nfr/SKILL.md`
- **Validation**: `skills/validate-requirements/SKILL.md` (generates this document)
- **Coherence**: `docs/checklists/rf-coherence.md`
- **Next**: `skills/epic-breakdown/SKILL.md` (uses clusters from this RTM)

---

_Template — each project creates an instance in `docs/projects/{project}/rtm.md`_
