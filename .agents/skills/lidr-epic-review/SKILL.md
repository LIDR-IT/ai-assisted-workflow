---
id: epic-review
version: "1.1.0"
last_updated: "2026-03-16"
updated_by: "System: Quality Assurance Integration"
status: active
phase: 0
owner_role: "PME"
automation: false
domain_agnostic: true
description: "Review epic execution vs original plan after delivery. Captures scope delivered vs planned, NFR achievement, tech debt accumulated, lessons learned, and generates follow-up epic proposals. Feeds back into portfolio management (PME) and continuous improvement. Triggers on review epic, epic retrospective, close epic, epic learnings, what did we learn, epic post-mortem, epic wrap-up, next steps from epic. Use post-deploy or when epic is considered complete. Different from retrospective (sprint-level) and postmortem (incident-based). ALWAYS use after epic delivery to capture plan vs actual variance and lessons learned."
---

# Epic Review Generator

Phase: Cross-cutting (Post-Deploy) | Gate: Post-Gate 7 | Language: Spanish

## Context: Three Review Skills

| Skill           | Scope          | When                           | Focus                                 |
| --------------- | -------------- | ------------------------------ | ------------------------------------- |
| `retrospective` | Sprint-level   | End of each sprint             | Team dynamics, process improvement    |
| `postmortem`    | Incident-level | After outage/failure           | Root cause, corrective actions        |
| `epic-review`   | Epic-level     | After epic completion/delivery | Plan vs actual, learnings, next steps |

## Workflow

1. Read original epic plan (from `epic-breakdown` or Jira)
2. Read all sprint retrospectives within this epic's timeline
3. Read tech-debt log entries generated during development
4. Read QA metrics (test coverage, bugs found, pass rates)
5. Read NFR validation results (actual vs target)
6. Read release notes for all releases within this epic
7. Generate Epic Review using template `templates/epic-review.md`
8. Generate Next Steps / Follow-up Epic proposals
9. Generate Portfolio Feedback for PME

## Input

| Input                     | Required  | Source                            |
| ------------------------- | --------- | --------------------------------- |
| Epic plan (original)      | ✅        | skill `epic-breakdown/` or Jira   |
| Sprint retrospectives     | ✅        | skill `retrospective/`            |
| Tech debt log             | Desirable | skill `tech-debt/`                |
| QA metrics / test reports | Desirable | skill `test-execution-report/`    |
| NFR validation results    | Desirable | Performance/security test results |
| Release notes             | Desirable | skill `release-notes/`            |
| Jira ticket data          | Desirable | Manual or script                  |

## Output Template

```markdown
---
id: {project-name}-epic-review-{epic-id}
version: "1.0.0"
last_updated: "YYYY-MM-DD"            # date of generation
updated_by: "PME: {Name}"             # PME generates epic reviews
status: active
type: project
review_cycle: 90                      # days between reviews (epic documentation)
next_review: "YYYY-MM-DD"             # calculated: last_updated + review_cycle
owner_role: "PME"                     # PME maintains epic reviews
---

# Epic Review: {EPIC_NAME}

| Campo                  | Valor                                     |
| ---------------------- | ----------------------------------------- |
| **Epic ID**            | {PROJ-NNN}                                |
| **Fecha de Review**    | {YYYY-MM-DD}                              |
| **Autor**              | {PME/TL + IA}                             |
| **Sprints ejecutados** | Sprint {N} — Sprint {M} ({total} sprints) |
| **Participantes**      | {roles que participaron}                  |

---

## 1. Scope: Plan vs Actual

### 1.1 RFs Delivered vs Planned

| RF ID      | Planned  | Delivered | Status      | Notes                   |
| ---------- | -------- | --------- | ----------- | ----------------------- |
| RF-XXX-001 | Sprint 1 | Sprint 1  | ✅ On time  |                         |
| RF-XXX-002 | Sprint 2 | Sprint 3  | ⚠️ Delayed  | Dependency issue        |
| RF-XXX-005 | Sprint 3 | —         | ❌ Deferred | Moved to follow-up epic |

### 1.2 Summary

| Metric                | Planned | Actual | Delta |
| --------------------- | ------- | ------ | ----- |
| Total RFs             | N       | N      | +/-N  |
| Sprints               | N       | N      | +/-N  |
| Story Points / Hours  | N       | N      | +/-N% |
| RFs delivered on time | —       | N%     | —     |
| RFs deferred          | 0       | N      | —     |

---

## 2. NFR Achievement

| NFR ID        | Category     | Target            | Actual      | Met? |
| ------------- | ------------ | ----------------- | ----------- | ---- |
| NFR-PERF-001  | Performance  | P95 <500ms        | P95 = 420ms | ✅   |
| NFR-SEC-001   | Security     | AES-256 + TLS 1.2 | Implemented | ✅   |
| NFR-AVAIL-001 | Availability | 99.9%             | 99.7%       | ⚠️   |

### NFR Risk Items

{NFRs not fully met — impact assessment and remediation plan}

---

## 3. Quality Metrics

| Metric                     | Value   | Benchmark | Assessment |
| -------------------------- | ------- | --------- | ---------- |
| Bug density (bugs/RF)      | N       | <2        | ✅/⚠️/❌   |
| Test coverage              | N%      | ≥80%      | ✅/⚠️/❌   |
| Critical bugs in prod      | N       | 0         | ✅/⚠️/❌   |
| Security findings resolved | N/N     | 100%      | ✅/⚠️/❌   |
| Code review turnaround     | N hours | <24h      | ✅/⚠️/❌   |

---

## 4. Tech Debt Incurred

| ID     | Description            | Impact         | Priority      | Proposed Resolution              |
| ------ | ---------------------- | -------------- | ------------- | -------------------------------- |
| TD-001 | {from tech-debt skill} | {High/Med/Low} | {Must/Should} | {follow-up epic or backlog item} |

### Tech Debt Budget

| Metric                          | Value     |
| ------------------------------- | --------- |
| Debt items created during epic  | N         |
| Debt items resolved during epic | N         |
| Net debt                        | +/-N      |
| Estimated remediation effort    | N sprints |

---

## 5. Lessons Learned

### 5.1 What Went Well (Keep)

| #   | Learning                                | Evidence                  | Applicable To    |
| --- | --------------------------------------- | ------------------------- | ---------------- |
| 1   | {e.g., BDD scenarios reduced QA rework} | {QA metrics improved 30%} | All future epics |

### 5.2 What Didn't Go Well (Improve)

| #   | Issue                  | Root Cause                              | Action Item                                     | Owner |
| --- | ---------------------- | --------------------------------------- | ----------------------------------------------- | ----- |
| 1   | {e.g., Sprint 2 delay} | {Dependency not identified in planning} | {Improve dependency analysis in epic-breakdown} | TL    |

### 5.3 What We Should Try (Experiment)

| #   | Proposal                                 | Expected Benefit            | Risk              |
| --- | ---------------------------------------- | --------------------------- | ----------------- |
| 1   | {e.g., Pair programming for complex RFs} | {Reduce code review cycles} | {Capacity impact} |

---

## 6. Next Steps & Follow-up Epics

### 6.1 Deferred Scope (from this epic)

| RF/NFR     | Reason Deferred          | Priority | Proposed Epic  |
| ---------- | ------------------------ | -------- | -------------- |
| RF-XXX-005 | Scope creep / complexity | Must     | Follow-up EP-A |

### 6.2 New Scope Discovered

| Item                      | Description | Source         | Priority | Proposed Epic  |
| ------------------------- | ----------- | -------------- | -------- | -------------- |
| {feature request from QA} |             | QA feedback    | Should   | Follow-up EP-B |
| {tech debt remediation}   |             | TD-001, TD-003 | Must     | Tech Debt EP-C |

### 6.3 Follow-up Epic Proposals

| Epic                   | Scope                | Priority | Est. Sprints | Dependencies |
| ---------------------- | -------------------- | -------- | ------------ | ------------ |
| EP-A: {Deferred scope} | RF-XXX-005 + related | Must     | 1-2          | None         |
| EP-B: {New features}   | {description}        | Should   | 2-3          | EP-A         |
| EP-C: {Tech debt}      | TD-001, TD-003       | Must     | 1            | None         |

---

## 7. Portfolio Feedback (for PME)

| Metric                  | Value                          | Portfolio Implication      |
| ----------------------- | ------------------------------ | -------------------------- |
| Velocity trend          | {increasing/stable/decreasing} | {capacity planning impact} |
| Estimation accuracy     | {actual vs planned %}          | {improve estimation model} |
| Cross-team dependencies | {N resolved, N pending}        | {coordination needs}       |
| Budget consumption      | {N% of allocated}              | {financial impact}         |

---

## Sign-off

| Rol | Nombre | Firma | Fecha |
| --- | ------ | ----- | ----- |
| PME |        |       |       |
| PO  |        |       |       |
| TL  |        |       |       |
```

## Key Rules

- **Epic review is NOT a sprint retro**: It's higher-level, covering the FULL epic lifecycle
- **Data-driven**: Use actual metrics from Jira, QA tools, monitoring — not opinions
- **Follow-up epics are CONCRETE**: Each proposal has scope, priority, and effort estimate
- **Tech debt is TRACKED**: Every debt item incurred is documented with remediation path
- **NFR achievement is VERIFIED**: Not just "we think it works" — actual measurements
- **Portfolio feedback**: PME uses this to adjust capacity, priorities, and expectations
- **Blameless**: Focus on process improvement, not individual blame

## When to Execute

| Trigger                                   | Recommended                                      |
| ----------------------------------------- | ------------------------------------------------ |
| Epic fully delivered                      | Always — mandatory for Must-Have epics           |
| Epic partially delivered (deferred items) | Always — critical for deferred scope tracking    |
| Epic cancelled                            | Optional — document reasons and learnings        |
| Quarterly review                          | PME aggregates epic reviews for portfolio health |

## Quality Assurance

### Validation Script

This skill includes automated validation via `scripts/validate-examples.ts`:

```bash
# Validate skill examples and structure
npx tsx scripts/validate-examples.ts
```

**Validation includes:**

- Example completeness and correctness
- Epic review analysis compliance patterns
- Progressive disclosure adherence
- Resource organization standards

**When to use:**

- Before skill release/packaging
- In CI/CD pipeline (quality gates)
- After major example updates
- During skill maintenance cycles

**Integration with ecosystem:**

- Used by `/multi-agent-audit` for ecosystem validation
- Supports quality gates in SDLC workflow
- Provides consistent validation across all skills
