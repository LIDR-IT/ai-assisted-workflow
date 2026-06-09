---
id: security-signoff-record
version: "1.0.0"
last_updated: "2026-03-16"
updated_by: "System: Signoff Migration"
status: active
type: signoff
review_cycle: 90
next_review: "2026-06-15"
owner_role: "Security Lead"
---

# Security Sign-off Record

> **Purpose**: Official security/CISO sign-off format to authorize production deploy.
> **Pre-filled by**: Skills `vuln-assessment`, `dast-interpretation`, `security-checklist`
> **Associated Gate**: Gate 6 — Security Sign-off
> **Policy**: Zero tolerance — 0 Critical or High vulnerabilities open in production

---

## 1. Release Information

| Field                     | Value | Notes                                       |
| ------------------------- | ----- | ------------------------------------------- |
| **Project**               |       | Project/product name                        |
| **Version**               |       | Semantic version evaluated                  |
| **Build/Tag**             |       | Git tag evaluated                           |
| **Evaluation Start Date** |       | YYYY-MM-DD                                  |
| **Evaluation End Date**   |       | YYYY-MM-DD                                  |
| **Security Lead**         |       | Full name                                   |
| **CISO**                  |       | Full name                                   |
| **Environment Evaluated** |       | Pre-production (mandatory)                  |
| **Previous QA Sign-off**  |       | Yes (ref: Gate 5) — mandatory               |
| **Release Scope**         |       | Brief description of what's being evaluated |

---

## 2. Evaluations Performed

### 2.1 SAST — Static Application Security Testing

| Tool                                        | Executed   | Date       | Scope               |
| ------------------------------------------- | ---------- | ---------- | ------------------- |
| {{CODE_QUALITY_TOOL}} — Example (SonarQube) | Yes/No     | YYYY-MM-DD | New + modified code |
| Custom SAST rules                           | Yes/No/N/A |            | Specific rules      |

**SAST Results:**

| Severity     | Found | Resolved | False Positives | Pending    | Status |
| ------------ | ----- | -------- | --------------- | ---------- | ------ |
| **Critical** |       |          |                 | **0 req.** | ✅/❌  |
| **High**     |       |          |                 | **0 req.** | ✅/❌  |
| **Medium**   |       |          |                 |            | ✅/⚠️  |
| **Low**      |       |          |                 |            | ✅/⚠️  |
| **Info**     |       |          |                 |            | —      |

### 2.2 SCA — Software Composition Analysis

| Tool                                              | Executed | Date       | Scope                            |
| ------------------------------------------------- | -------- | ---------- | -------------------------------- |
| {{CODE_QUALITY_TOOL}} — Example (Dependabot/Snyk) | Yes/No   | YYYY-MM-DD | Direct + transitive dependencies |
| License check                                     | Yes/No   |            | Compatible licenses              |

**SCA Results:**

| Severity     | CVEs Found | Resolved (update/patch) | Mitigated | Pending    | Status |
| ------------ | ---------- | ----------------------- | --------- | ---------- | ------ |
| **Critical** |            |                         |           | **0 req.** | ✅/❌  |
| **High**     |            |                         |           | **0 req.** | ✅/❌  |
| **Medium**   |            |                         |           |            | ✅/⚠️  |
| **Low**      |            |                         |           |            | —      |

**EOL Components (End-of-Life):**

| Component | Current Version | EOL Date | Migration Plan | Status                         |
| --------- | --------------- | -------- | -------------- | ------------------------------ |
|           |                 |          |                | Migrated/Planned/Risk accepted |

### 2.3 DAST — Dynamic Application Security Testing

| Tool                                        | Executed | Date       | Environment | Scope                |
| ------------------------------------------- | -------- | ---------- | ----------- | -------------------- |
| {{CODE_QUALITY_TOOL}} — Example (OWASP ZAP) | Yes/No   | YYYY-MM-DD | Pre-prod    | Full scan/Targeted   |
| Example (Burp Suite)                        | Yes/No   |            | Pre-prod    | Manual + Active scan |

**DAST Results:**

| Severity     | Found | Resolved | False Positives | Pending    | Status |
| ------------ | ----- | -------- | --------------- | ---------- | ------ |
| **Critical** |       |          |                 | **0 req.** | ✅/❌  |
| **High**     |       |          |                 | **0 req.** | ✅/❌  |
| **Medium**   |       |          |                 |            | ✅/⚠️  |
| **Low**      |       |          |                 |            | —      |
| **Info**     |       |          |                 |            | —      |

### 2.4 Manual Pen Testing

| Evaluator | Certification          | Start Date | End Date | Scope |
| --------- | ---------------------- | ---------- | -------- | ----- |
|           | OSCP/CEH/GPEN/Internal |            |          |       |

**Pen Testing Results:**

| #     | Finding | Severity                 | OWASP Category | Reproducible | Status           | Fix PR |
| ----- | ------- | ------------------------ | -------------- | ------------ | ---------------- | ------ |
| PT-01 |         | Critical/High/Medium/Low | A01-A10        | Yes/No       | Resolved/Pending |        |

---

## 3. Compliance Checklist

### 3.1 OWASP Top 10 Verification

Cross-evaluation against security compliance checklist:

| OWASP Category                | SAST      | DAST      | Pen Test  | Manual Review | Overall |
| ----------------------------- | --------- | --------- | --------- | ------------- | ------- |
| A01 Broken Access Control     | ✅/❌/N/A | ✅/❌/N/A | ✅/❌/N/A | ✅/❌         | ✅/❌   |
| A02 Cryptographic Failures    | ✅/❌/N/A | ✅/❌/N/A | ✅/❌/N/A | ✅/❌         | ✅/❌   |
| A03 Injection                 | ✅/❌/N/A | ✅/❌/N/A | ✅/❌/N/A | ✅/❌         | ✅/❌   |
| A04 Insecure Design           | N/A       | N/A       | ✅/❌/N/A | ✅/❌         | ✅/❌   |
| A05 Security Misconfiguration | ✅/❌/N/A | ✅/❌/N/A | ✅/❌/N/A | ✅/❌         | ✅/❌   |
| A06 Vulnerable Components     | N/A       | N/A       | N/A       | ✅/❌ (SCA)   | ✅/❌   |
| A07 Auth Failures             | ✅/❌/N/A | ✅/❌/N/A | ✅/❌/N/A | ✅/❌         | ✅/❌   |
| A08 Integrity Failures        | ✅/❌/N/A | N/A       | ✅/❌/N/A | ✅/❌         | ✅/❌   |
| A09 Logging Failures          | ✅/❌/N/A | N/A       | N/A       | ✅/❌         | ✅/❌   |
| A10 SSRF                      | ✅/❌/N/A | ✅/❌/N/A | ✅/❌/N/A | ✅/❌         | ✅/❌   |

### 3.2 Corporate Security Policies

- [ ] **Password policy**: Compliant (minimum 12 chars, complexity, no common)
- [ ] **Encryption in transit**: TLS 1.2+ in all communications
- [ ] **Encryption at rest**: AES-256 for sensitive data, keys in KMS
- [ ] **Session management**: Timeout, secure cookies, JWT with expiration
- [ ] **Security headers**: All configured (HSTS, CSP, X-Frame-Options, etc.)
- [ ] **Security logging**: Auth events, privilege changes, data access logged
- [ ] **No PII in logs**: Verified — masking implemented
- [ ] **Secrets management**: 0 secrets in code, vault/KMS in use

### 3.3 Regulatory Compliance

- [ ] **GDPR compliance**: Personal data handled according to GDPR (consent, minimization, access)
- [ ] **GDPR Art. 9**: Biometric data as special category — explicit consent documented
- [ ] **eIDAS compliance**: If applicable — electronic identity standards compliant
- [ ] **Data residency**: Data stored in correct jurisdiction
- [ ] **Right to be forgotten**: Functional and verified deletion mechanism
- [ ] **DPIA completed**: Data Protection Impact Assessment done if high-risk data

---

## 4. Pending Findings — Accepted Risk

_(Only for Medium/Low findings. NEVER for Critical or High.)_

| #     | Source | Severity   | Description | Residual Risk | Justification | Temporary Mitigation | Remediation Plan | Deadline   |
| ----- | ------ | ---------- | ----------- | ------------- | ------------- | -------------------- | ---------------- | ---------- |
| RA-01 |        | Medium/Low |             |               |               |                      |                  | YYYY-MM-DD |

**Accepted risk policy:**

1. Only Medium or Low severity (NEVER Critical or High)
2. Temporary mitigation implemented that reduces exposure
3. Remediation plan with deadline ≤30 days
4. CISO explicitly accepts residual risk
5. Re-evaluated in next security assessment

---

## 5. Security Lead Recommendation

### 5.1 Decision

- [ ] **APPROVED** — 0 Critical/High vulnerabilities open, compliance verified, pen test clean
- [ ] **APPROVED WITH CONDITIONS** — Medium/Low residual risk accepted with justification and plan (see section 4)
- [ ] **REJECTED** — Critical/High vulnerabilities unresolved, compliance not met, or pen test with serious findings

### 5.2 Justification (mandatory)

```
[Security Lead writes here:
- General security status of release
- Most relevant findings and their resolution
- Residual risks and their mitigation
- Conditions (if approved with conditions)
- What needs to be resolved (if rejected)
- Comparison with previous evaluation (improvement/degradation)]
```

### 5.3 Recommended Improvements (don't block deploy)

| #   | Recommendation | Priority        | Area | Suggested Sprint |
| --- | -------------- | --------------- | ---- | ---------------- |
| 1   |                | High/Medium/Low |      |                  |

---

## 6. Sign-off

### Security Lead Signature

| Field             | Value                                          |
| ----------------- | ---------------------------------------------- |
| **Security Lead** |                                                |
| **Decision**      | APPROVED / APPROVED WITH CONDITIONS / REJECTED |
| **Date**          | YYYY-MM-DD                                     |
| **Signature**     |                                                |

### CISO Signature

| Field                      | Value                                          |
| -------------------------- | ---------------------------------------------- |
| **CISO**                   |                                                |
| **Decision**               | APPROVED / APPROVED WITH CONDITIONS / REJECTED |
| **Residual risk accepted** | Yes (see section 4) / Not applicable           |
| **Date**                   | YYYY-MM-DD                                     |
| **Signature**              |                                                |

---

## 7. Pre-signature Checklist

Before signing, Security Lead and CISO verify:

- [ ] SAST executed with 0 Critical/High pending
- [ ] SCA executed with 0 Critical/High CVEs pending
- [ ] DAST executed in pre-production with 0 Critical/High
- [ ] Pen testing completed (if applicable per scope)
- [ ] OWASP Top 10 compliance verified
- [ ] Security headers configured correctly
- [ ] Regulatory compliance verified (GDPR, eIDAS if applicable)
- [ ] Pending findings (if any) with risk ≤Medium and remediation plan
- [ ] Previous QA Sign-off obtained (Gate 5 passed)
- [ ] AI-prefilled data verified manually

---

## 8. Connection with SDLC Flow

```
QA Sign-off (Gate 5) → Security evaluation → Security Sign-off
    ↓                                                    ↓
If APPROVED → Gate 6 passed → Deploy
If REJECTED → Remediation → Re-evaluation
```

---

## Changelog

| Version | Date       | Author                    | Changes                                                  |
| ------- | ---------- | ------------------------- | -------------------------------------------------------- |
| 1.0.0   | 2026-03-16 | System: Signoff Migration | Initial migration from docs/signoffs/security-signoff.md |
