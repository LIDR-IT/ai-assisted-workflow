---
id: qa-signoff-record
version: "1.0.0"
last_updated: "2026-03-16"
updated_by: "System: Signoff Migration"
status: active
type: signoff
review_cycle: 90
next_review: "2026-06-15"
owner_role: "QA Lead"
---

# QA Sign-off Record

> **Purpose**: Official QA Lead sign-off format to authorize advance to Gate 5.
> **Pre-filled by**: Skill `test-execution-report` with CSV export data from test management tool
> **Associated Gate**: Gate 5 — QA Sign-off
> **Policy**: No release advances to Security without this signed sign-off

---

## 1. Release Information

| Field                   | Value | Notes                           |
| ----------------------- | ----- | ------------------------------- |
| **Project**             |       | Project/product name            |
| **Version**             |       | Semantic version (e.g., v2.3.1) |
| **Sprint**              |       | Sprint N (e.g., Sprint 14)      |
| **Build/Tag**           |       | Git tag or CI build number      |
| **Testing Start Date**  |       | YYYY-MM-DD                      |
| **Testing End Date**    |       | YYYY-MM-DD                      |
| **QA Lead**             |       | Full name                       |
| **QA Team**             |       | Names of testers involved       |
| **Environment Tested**  |       | Staging / Pre-production / UAT  |
| **Environment Version** |       | URL or environment identifier   |

---

## 2. Execution Summary

### 2.1 Global Metrics

| Metric               | Value | Target                      | Status |
| -------------------- | ----- | --------------------------- | ------ |
| **Total Test Cases** |       |                             | —      |
| **Executed**         |       | 100%                        | ✅/❌  |
| **Passed**           |       |                             | —      |
| **Failed**           |       | 0 (blockers/critical)       | ✅/❌  |
| **Blocked**          |       | 0                           | ✅/❌  |
| **Not Executed**     |       | 0                           | ✅/❌  |
| **Pass Rate**        |       | ≥95%                        | ✅/❌  |
| **Coverage**         |       | 100% committed user stories | ✅/❌  |

### 2.2 Metrics by Testing Type

| Type               | Executed | Pass | Fail | Blocked | Pass Rate |
| ------------------ | -------- | ---- | ---- | ------- | --------- |
| **Functional**     |          |      |      |         | %         |
| **BDD/Acceptance** |          |      |      |         | %         |
| **Regression**     |          |      |      |         | %         |
| **Integration**    |          |      |      |         | %         |
| **Performance**    |          |      |      |         | %         |
| **Exploratory**    |          |      |      |         | %         |
| **Total**          |          |      |      |         | **%**     |

---

## 3. Coverage by User Story

| US ID | Title | RF Origin | Test Cases | Pass | Fail | Blocked | Status                         |
| ----- | ----- | --------- | ---------- | ---- | ---- | ------- | ------------------------------ |
|       |       |           |            |      |      |         | ✅ PASS / ❌ FAIL / ⚠️ PARTIAL |

### Status Criteria per US

| Status         | Criteria                                          |
| -------------- | ------------------------------------------------- |
| ✅ **PASS**    | 100% test cases pass, 0 open bugs for this US     |
| ⚠️ **PARTIAL** | >90% pass, minor bugs accepted with justification |
| ❌ **FAIL**    | <90% pass, or blocker/critical bugs open          |

---

## 4. Bugs Found

### 4.1 Bug Summary

| Severity     | Found | Resolved | Pending  | Accepted | Re-test Pass |
| ------------ | ----- | -------- | -------- | -------- | ------------ |
| **Blocker**  |       |          | 0 (req.) | N/A      |              |
| **Critical** |       |          | 0 (req.) | N/A      |              |
| **High**     |       |          |          |          |              |
| **Medium**   |       |          |          |          |              |
| **Low**      |       |          |          |          |              |
| **Total**    |       |          |          |          |              |

### 4.2 Resolved Bugs Detail

| Bug ID | Severity | Affected US | Summary | Fix PR | Re-test | Status |
| ------ | -------- | ----------- | ------- | ------ | ------- | ------ |
|        |          |             |         |        | ✅/❌   | Closed |

### 4.3 Pending Bugs with Risk Acceptance

_(Only for Medium/Low bugs accepted to go to production)_

| Bug ID | Severity | Affected US | Description | User Impact | Residual Risk | Acceptance Justification | Planned Fix Sprint |
| ------ | -------- | ----------- | ----------- | ----------- | ------------- | ------------------------ | ------------------ |
|        |          |             |             |             | Low/Medium    |                          | Sprint N+1         |

**Conditions for accepting pending bugs:**

1. Severity ≤Medium (never Blocker, Critical, or High)
2. Workaround available for user
3. Planned fix sprint committed
4. PO explicitly accepts residual risk

---

## 5. Regression

### 5.1 Execution

| Criteria                             | Status | Detail                       |
| ------------------------------------ | ------ | ---------------------------- |
| Regression suite executed completely | ✅/❌  | Total: N test cases          |
| Regressions detected                 |        | N regressions (detail below) |
| Regressions resolved                 |        | N resolved, N pending        |
| High-risk areas covered              | ✅/❌  | List areas                   |

### 5.2 Regressions Found (if any)

| #   | Test Case ID | Affected Area | Severity | Cause                          | Status           | Bug ID |
| --- | ------------ | ------------- | -------- | ------------------------------ | ---------------- | ------ |
| 1   |              |               |          | New code / Config / Dependency | Resolved/Pending |        |

### 5.3 Risk Areas Evaluated

| Area                      | Method             | Result | Notes           |
| ------------------------- | ------------------ | ------ | --------------- |
| Core authentication       | Automated + Manual | ✅/❌  |                 |
| Payment/Transaction flows | Automated + Manual | ✅/❌  |                 |
| Core business processing  | Manual             | ✅/❌  | Domain-specific |
| API integrations          | Automated          | ✅/❌  |                 |
| Data persistence          | Automated          | ✅/❌  |                 |

---

## 6. Performance Testing (if applicable)

| Metric                | Baseline | Post-change | Delta | Acceptable    |
| --------------------- | -------- | ----------- | ----- | ------------- |
| Response time P50     | ms       | ms          | %     | ✅ ≤+15% / ❌ |
| Response time P95     | ms       | ms          | %     | ✅ ≤+20% / ❌ |
| Response time P99     | ms       | ms          | %     | ✅ ≤+25% / ❌ |
| Throughput (req/s)    |          |             | %     | ✅ ≥-10% / ❌ |
| Error rate under load | %        | %           |       | ✅ ≤1% / ❌   |
| Memory usage          | MB       | MB          | %     | ✅ ≤+20% / ❌ |

---

## 7. QA Lead Recommendation

### 7.1 Decision

- [ ] **GO** — All criteria met, no blocker/critical bugs open, clean regression
- [ ] **GO with conditions** — Minor bugs accepted with documented justification (see section 4.3)
- [ ] **NO GO** — Critical bugs open, insufficient coverage, or unresolved regressions

### 7.2 Justification (mandatory for GO with conditions and NO GO)

```
[QA Lead writes detailed justification here, including:
- Summary of quality status
- Identified risks and their mitigation
- Conditions under which it's accepted (if GO with conditions)
- What must be resolved before re-evaluation (if NO GO)]
```

### 7.3 Residual Risks

| #   | Risk | Probability     | Impact          | Mitigation | Accepted by    |
| --- | ---- | --------------- | --------------- | ---------- | -------------- |
| 1   |      | High/Medium/Low | High/Medium/Low |            | PO / Tech Lead |

---

## 8. Sign-off

### QA Lead Signature

| Field         | Value                           |
| ------------- | ------------------------------- |
| **QA Lead**   |                                 |
| **Decision**  | GO / GO with conditions / NO GO |
| **Date**      | YYYY-MM-DD                      |
| **Signature** |                                 |

### Acknowledgement (for GO with conditions)

| Role          | Name | Accepts residual risk | Signature | Date |
| ------------- | ---- | --------------------- | --------- | ---- |
| Product Owner |      | Yes / No              |           |      |
| Tech Lead     |      | Yes / No              |           |      |

---

## 9. Pre-signature Checklist

Before signing, QA Lead verifies:

- [ ] All test cases executed (0 "Not Executed" without justification)
- [ ] 0 Blocker or Critical bugs open
- [ ] Pending bugs (if any) with justification and fix sprint
- [ ] Regression suite executed completely without open regressions
- [ ] Performance within acceptable thresholds
- [ ] Test execution report generated and synchronized with test management tool
- [ ] Sign-off data pre-filled by AI and verified manually
- [ ] Conversation with PO about residual risks (if applicable)

---

## 10. Connection with SDLC Flow

```
Complete testing → Test Execution Report → QA Sign-off
    ↓                                          ↓
If GO → Gate 5 passed → Security → Gate 6
If NO GO → Fix bugs → Re-test → Re-evaluate sign-off
```

---

## Changelog

| Version | Date       | Author                    | Changes                                            |
| ------- | ---------- | ------------------------- | -------------------------------------------------- |
| 1.0.0   | 2026-03-16 | System: Signoff Migration | Initial migration from docs/signoffs/qa-signoff.md |
