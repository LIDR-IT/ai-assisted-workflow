---
id: vuln-assessment
version: "1.1.0"
last_updated: "2026-03-16"
updated_by: "System: QA Enhancement"
status: active
phase: 7
owner_role: "TL"
automation: false
domain_agnostic: true
description: "Essential for application security assessment - ALWAYS use when SAST/SCA scanners flag findings in platform APIs, web applications, mobile apps, or data processing systems. CRITICAL for interpreting security scan results in sensitive data processing contexts, ensuring data protection regulation compliance, and protecting user data, authentication workflows, and document processing systems. Use continuously for CI security gates, pre-release for Gate 6 Security Sign-off, and post-incident analysis. Essential for financial services, government systems, and enterprise application security posture."
---

# Vulnerability Assessment Interpreter

Phase: 7 — Security | Gate: contributes to Gate 6 | Language: English + Spanish (executive)

## Workflow

1. **Read security scan reports**: SAST (SonarQube/Semgrep/CodeQL) + SCA (Snyk/npm audit)
2. **Analyze application context**: Data sensitivity, data protection regulation requirements, regulatory compliance
   - Sensitive data storage and encryption
   - API endpoints handling user data
   - Document processing workflows
   - Cross-border data transfer mechanisms
3. **Classify by business impact**: OWASP Top 10 + domain-specific attack vectors
4. **Prioritize by business criticality**:
   - Financial Services = Critical (regulatory + financial impact)
   - Government Systems = Critical (citizen privacy + national security)
   - Consumer Applications = High (brand + data protection regulation fines)
5. **Generate context-aware remediation**: Code fixes + compliance requirements
6. **Trend analysis**: Security posture improvement for systems
7. **Compliance validation**: Ensure fixes maintain GDPR/eIDAS/PSD2 compliance

## Input

| Input             | Required  | Source                         |
| ----------------- | --------- | ------------------------------ |
| SAST report       | ✅        | SonarQube / Semgrep / CodeQL   |
| SCA report        | ✅        | Snyk / npm audit / Dependabot  |
| Project context   | ✅        | `rules/project.md`, PRD-T §5.4 |
| Tech stack        | ✅        | `rules/tech-stack.md`          |
| Previous baseline | Desirable | Prior assessment               |
| Threat model      | Desirable | Security architecture docs     |

## Output Template

```markdown
# Vulnerability Assessment: [PROJECT] — [DATE]

## Executive Summary (Spanish)

- Total findings: {N} ({critical}, {high}, {medium}, {low})
- New since baseline: {N}
- Gate 6 readiness: ✅ PASS / ⚠️ CONDITIONAL / ❌ FAIL
- Top 3 risks: [business-language summary]

## Findings by Severity

### 🔴 Critical ({N})

| #   | CWE | OWASP | File:Line | Description | CVSS | Remediation | Effort |
| --- | --- | ----- | --------- | ----------- | ---- | ----------- | ------ |

### 🟠 High ({N})

[same table]

### 🟡 Medium ({N})

[same table]

### 🟢 Low / Info ({N})

[condensed table]

## Remediation Plan

| Priority | Finding | Fix | Owner | Deadline | Status |
| -------- | ------- | --- | ----- | -------- | ------ |

## Trend (vs Baseline)

| Category | Previous | Current | Δ   | Trend |
| -------- | -------- | ------- | --- | ----- |

## Risk Acceptance (if any Critical/High deferred)

| Finding | Justification | Accepted By | Expiry Date |
| ------- | ------------- | ----------- | ----------- |
```

## Key Rules (Sensitive Data Context)

- **Sensitive data elevates severity**: Any vulnerability affecting sensitive data storage, core processing workflows, or document handling is automatically +1 severity level (Medium→High, High→Critical)
- **GDPR amplifies impact**: Data exposure vulnerabilities in systems risk regulatory fines up to 4% global revenue
- **Regulated context = Critical**: Vulnerabilities in financial, healthcare, or government systems are always Critical due to regulatory requirements
- **Sensitive data encryption mandatory**: Any finding that could expose unencrypted sensitive data records is Critical regardless of CVSS
- **Cross-border compliance**: Vulnerabilities affecting data residency or cross-region transfer are High+ due to legal implications
- **API security priority**: Authentication bypasses on core service endpoints are Critical (service integrity core)
- **Mobile/client-side considerations**: Client-side vulnerabilities in data capture components are High (device compromise risk)
- **Actionable remediation**: "Encrypt data templates with AES-256-GCM" not "improve encryption"
- **Zero tolerance for sensitive data exposure**: 0 Critical/High findings involving sensitive data without immediate remediation

## Application Vulnerability Example

### User Authentication Platform - Security Assessment Report

```markdown
# Vulnerability Assessment: User Authentication Platform v3.0 — 2026-03-09

## Executive Summary (Spanish)

- Total findings: 23 (2 críticos, 5 altos, 12 medios, 4 bajos)
- New since baseline: 3 (1 crítico nuevo en SDK móvil)
- Gate 6 readiness: ⚠️ CONDITIONAL (pendiente remediación 2 críticos)
- Top 3 risks: Exposición datos sensibles, bypass autenticación API, transferencia datos no cifrada

## Findings by Severity

### 🔴 Critical (2)

| #   | CWE     | OWASP | File:Line              | Description                                           | CVSS | Remediation                                                        | Effort |
| --- | ------- | ----- | ---------------------- | ----------------------------------------------------- | ---- | ------------------------------------------------------------------ | ------ |
| 1   | CWE-522 | A02   | UserDataService.ts:156 | sensitive user data stored unencrypted in Redis cache | 9.1  | Implement AES-256-GCM encryption for all sensitive data operations | 3d     |
| 2   | CWE-306 | A07   | /api/verify:23         | Missing authentication on user verification endpoint  | 8.7  | Add OAuth2 + API key validation to all authentication endpoints    | 2d     |

### 🟠 High (5)

| #   | CWE     | OWASP | File:Line          | Description                                  | CVSS | Remediation                                           | Effort |
| --- | ------- | ----- | ------------------ | -------------------------------------------- | ---- | ----------------------------------------------------- | ------ |
| 3   | CWE-89  | A03   | UserService.ts:89  | SQL injection in user search (user metadata) | 7.5  | Replace with parameterized queries + input validation | 1d     |
| 4   | CWE-200 | A01   | ErrorHandler.ts:45 | data processing errors leak sensitive paths  | 6.8  | Generic error messages + secure logging               | 0.5d   |

## Remediation Plan

| Priority | Finding             | Fix                                          | Owner         | Deadline   | Status      |
| -------- | ------------------- | -------------------------------------------- | ------------- | ---------- | ----------- |
| P0       | Template encryption | Implement HSM integration + AES-256-GCM      | Security Team | 2026-03-12 | In Progress |
| P0       | API authentication  | Add OAuth2 middleware to verification routes | Backend Team  | 2026-03-11 | Pending     |
| P1       | SQL injection       | Parameterized queries + validation           | Dev Team      | 2026-03-13 | Assigned    |

## GDPR Compliance Impact

- **Finding #1**: Template exposure violates data protection regulation → Potential €20M fine
- **Finding #2**: Unauthorized access to verification → Data breach notification required
- **Recommendation**: Emergency remediation required before production deployment
```

## Quality Assurance

### Validation Script

This skill includes automated validation via `scripts/validate-examples.ts`:

```bash
# Validate skill examples and structure
npx tsx scripts/validate-examples.ts
```

**Validation includes:**

- Example completeness and correctness
- Security vulnerability assessment compliance patterns
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

## Industry-Specific Risk Context

### Banking/Fintech (PSD2 + AML/KYC)

- verification bypass = Critical (regulatory non-compliance)
- Template exposure = Critical (customer financial data linkage)
- API vulnerabilities = High (payment authentication impact)

### Government/eID (GDPR + National Security)

- Citizen identity data exposure = Critical (national security implications)
- Cross-border data leaks = Critical (sovereignty violations)
- Accessibility bypasses = Medium (digital inclusion requirements)

### Healthcare/Insurance (GDPR + HIPAA)

- Sensitive health data linkage = Critical (double privacy protection)
- User correlation attacks = High (patient identification risk)
- Audit trail tampering = High (compliance reporting integrity)

## Resources

- **Security patterns**: `references/security-patterns.md`
- **GDPR vulnerability mapping**: `references/gdpr-security-compliance.md`
- **Industry-specific threats**: `references/industry-threat-models.md`
- **Remediation templates**: `references/remediation-patterns.md`
