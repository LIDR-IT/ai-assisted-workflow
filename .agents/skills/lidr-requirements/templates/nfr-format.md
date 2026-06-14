# Standard Format: Non-Functional Requirement (NFR)

> **Purpose**: Mandatory format for standalone, measurable, and testable NFRs.
> **Referenced by**: `workflows/nfr.md (nfr mode)` as the output format
> **Associated gate**: Gate 2 — Requirements Complete
> **Complements**: `docs/templates/rf-format.md` (functional requirements)
> **Instances**: `docs/projects/{project}/nfrs/NFR-{PROJ}-{CAT}-{NNN}.md`

---

## NFR Structure

### 1. Header (Mandatory)

```markdown
---
id: NFR-{PROJ}-{CAT}-{NNN}
title: { Descriptive title — maximum 15 words }
category: Performance | Security | Scalability | Availability | Compliance | Accessibility | Observability
version: { 1.0 }
status: Draft | In Review | Approved | Obsolete
prd_source: { PRD → Cross-Cutting NFRs / feature NFR section }
author: { Full name }
created_date: { YYYY-MM-DD }
priority: Must Have | Should Have | Could Have
criticality: Blocking | High | Medium | Low
---
```

**ID convention:**

- `{CAT}` = Category code: `PERF`, `SEC`, `SCAL`, `AVAIL`, `COMP`, `ACC`, `OBS`
- `{NNN}` = Sequential per category
- Example: `NFR-SDLC-PERF-001`, `NFR-SDLC-SEC-003`

### 2. Definition (Mandatory)

```markdown
## Definition

{What quality is required — 1-2 sentences. Unambiguous.}
```

**Rule**: If you cannot define it in 2 sentences, the NFR is too broad → split it.

### 3. Metric and Threshold (Mandatory)

```markdown
## Metric and Threshold

| Metric | Baseline  | Target   | Max. Acceptable | Measurement Method | Frequency   |
| ------ | --------- | -------- | --------------- | ------------------ | ----------- |
| {name} | {current} | {target} | {limit}         | {tool/method}      | {how often} |
```

**Rules:**

- **Baseline** = current measured value (or "N/A — new system")
- **Target** = design objective
- **Max. Acceptable** = threshold that, if exceeded, counts as a failure
- **Method** = how it is measured (a specific tool, not "testing")

### 4. Validation Scenarios (Mandatory)

```markdown
## Validation Scenarios

### Normal (expected load)

- Conditions: {load profile}
- Expected result: {meets target}

### Stress (peak load)

- Conditions: {peak profile}
- Expected result: {degradation acceptable within max.}

### Failure (error mode)

- Conditions: {failure scenario}
- Expected result: {graceful degradation / failover}
```

### 5. Traceability (Mandatory)

```markdown
## Traceability

| Reference     | Value                                   |
| ------------- | --------------------------------------- |
| PRD source    | PRD → Cross-Cutting NFRs / feature NFRs |
| PRD metrics   | PRD success metrics (if applicable)     |
| Affected RFs  | RF-{PROJ}-{NNN}, RF-{PROJ}-{NNN}        |
| Related risks | RISK-{NNN} (from risk-log)              |
| Regulation    | {GDPR Art. X, OWASP A-XX, eIDAS §X}     |
```

### 6. Architecture Implications (Mandatory)

```markdown
## Architecture Implications

{Which architectural decisions it requires — caching, CDN, replication, encryption, etc.}
{Reference to existing ADRs if applicable}
```

### 7. Dependencies (If applicable)

```markdown
## Dependencies

| Type           | Resource              | Status             | Owner  |
| -------------- | --------------------- | ------------------ | ------ |
| Infrastructure | {e.g., Redis cluster} | Available/Pending  | DevOps |
| Third parties  | {e.g., CDN provider}  | Contracted/Pending | PME    |
```

---

## Categories by Domain (example — replace with your project's domain)

> Illustrative NFR targets for a generic web/API product. Each project replaces
> these with domain-specific, measurable values from its industry pack.

### Performance

- API read latency: P95 <500ms
- API write latency: P95 <800ms
- Throughput: >100 requests/second per instance
- Critical operation latency: <200ms

### Security

- Sensitive data encryption: AES-256 at rest
- Transmission: TLS 1.2+ mandatory
- No PII or sensitive data in logs: NEVER
- Data revocation: mechanism implemented (if special-category data — GDPR Art. 9)

### Compliance (Regulatory)

- DPIA completed (if processing special-category data — e.g. biometric/health)
- Applicable sector/identity standards documented (if applicable)
- Right to be forgotten: response time <72h
- Data retention: documented and automated policy

---

_Template — each project creates instances in `docs/projects/{project}/nfrs/`_
