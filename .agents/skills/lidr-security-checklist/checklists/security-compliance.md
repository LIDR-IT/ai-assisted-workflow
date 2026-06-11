---
id: security-compliance-checklist
version: "1.1.0"
last_updated: "2026-06-12"
updated_by: "TL: domain-agnostic leak fix"
status: active
type: checklist
review_cycle: 30
next_review: "2026-07-12"
owner_role: "Security Lead"
---

# Security Compliance Checklist

> **Purpose**: Security compliance evaluated pre-deploy and as part of Gate 6.
> **Evaluated by**: Skill `security-checklist` + manual inspection by Security Lead
> **Associated Gate**: Gate 6 — Security Sign-off
> **Trigger**: Evaluated automatically before each deploy to pre-production/production

---

## 1. OWASP Top 10 (2021) Compliance

### A01 — Broken Access Control

- [ ] **Principle of Least Privilege** — Users only access authorized resources. RBAC/ABAC implemented correctly
- [ ] **Server-side Controls** — Authorization verified on backend, not just frontend. Don't trust client headers/cookies
- [ ] **Restrictive CORS** — Specific origins, no wildcard (`*`) in production. Explicit methods and headers
- [ ] **Path Traversal Prevention** — User paths not accepted without sanitization. No direct filesystem access
- [ ] **IDOR Protection** — Insecure Direct Object References: non-predictable IDs, per-resource authorization verified
- [ ] **Rate Limiting** — Implemented on public endpoints, authentication, and sensitive APIs

### A02 — Cryptographic Failures

- [ ] **TLS 1.2+ Mandatory** — All communications encrypted. No plain HTTP. HSTS enabled
- [ ] **Data at Rest Encrypted** — AES-256 for sensitive data in DB. Keys managed in KMS, not hardcoded
- [ ] **No Weak Algorithms** — No MD5, SHA1 for password hashing. Use bcrypt/scrypt/argon2
- [ ] **Secrets Management** — 0 secrets in code/config files. Use vault (HashiCorp, AWS Secrets Manager)
- [ ] **Valid Certificates** — TLS certificates not expired, complete chain, no self-signed in production

### A03 — Injection

- [ ] **SQL Injection Prevention** — Parameterized queries mandatory. 0 string concatenation in SQL
- [ ] **XSS Prevention** — Output encoding mandatory. Restrictive CSP. No `innerHTML`/`dangerouslySetInnerHTML` without sanitization
- [ ] **Command Injection** — No system command execution from user input
- [ ] **LDAP/NoSQL Injection** — Inputs sanitized for LDAP and NoSQL queries
- [ ] **Input Validation** — Server-side validation of type, length, format, range for ALL inputs

### A04 — Insecure Design

- [ ] **Threat Modeling** — Threat modeling done for functionalities handling sensitive data (STRIDE/PASTA)
- [ ] **Security Patterns** — Security patterns implemented: defense in depth, fail-safe defaults, complete mediation
- [ ] **Business Logic Abuse** — Business flows protected against abuse (e.g., mass creation, step bypass)

### A05 — Security Misconfiguration

- [ ] **Defaults Changed** — No default credentials, no debug features in production
- [ ] **Secure Error Handling** — Errors don't expose stack traces, queries, internal paths to user
- [ ] **Security Headers** — All headers configured (see section 2 of this document)
- [ ] **File Permissions** — Configuration files with restrictive permissions (600/640)
- [ ] **Unnecessary Features Disabled** — No debug endpoints, exposed admin panels, or unwanted public API documentation

### A06 — Vulnerable and Outdated Components

- [ ] **Updated Dependencies** — No Critical or High CVEs in direct or transitive dependencies
- [ ] **Component Inventory** — SBOM (Software Bill of Materials) generated and updated
- [ ] **EOL Components** — No End-of-Life components without security support

### A07 — Identification and Authentication Failures

- [ ] **Robust Authentication** — MFA where applicable (admin, sensitive operations). No custom auth implementations without review
- [ ] **Password Policy** — Minimum 12 characters, complexity, no common passwords (check against lists)
- [ ] **Session Management** — See section 3 of this document (session management)
- [ ] **Brute Force Protection** — Account lockout or progressive delays after N failed attempts

### A08 — Software and Data Integrity Failures

- [ ] **Secure CI/CD** — Pipeline doesn't allow code without code review. Signed artifacts
- [ ] **Dependency Integrity** — Lock files committed (package-lock.json / pnpm-lock.yaml). Checksums verified
- [ ] **Secure Deserialization** — No deserialization of untrusted data without validation

### A09 — Security Logging and Monitoring Failures

- [ ] **Security Events Logged** — Login, logout, failed auth, privilege changes, data access — all logged
- [ ] **No Sensitive Data in Logs** — 0 passwords, tokens, PII, biometric data in logs. Masking implemented
- [ ] **Active Log Monitoring** — SIEM or equivalent configured with alerts for security events
- [ ] **Audit Trail** — Critical operations have complete and immutable audit trail

### A10 — Server-Side Request Forgery (SSRF)

- [ ] **SSRF Prevention** — User-provided URLs validated against allowlist. No access to metadata services
- [ ] **DNS Rebinding** — Protection against DNS rebinding if resolving user URLs

---

## 2. Security Headers

| Header                      | Expected Value                                                          | Status |
| --------------------------- | ----------------------------------------------------------------------- | ------ |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains; preload`                          | [ ]    |
| `Content-Security-Policy`   | Restrictive policy without `unsafe-inline`/`unsafe-eval` where possible | [ ]    |
| `X-Content-Type-Options`    | `nosniff`                                                               | [ ]    |
| `X-Frame-Options`           | `DENY` or `SAMEORIGIN`                                                  | [ ]    |
| `X-XSS-Protection`          | `0` (disabled — CSP replaces it)                                        | [ ]    |
| `Referrer-Policy`           | `strict-origin-when-cross-origin`                                       | [ ]    |
| `Permissions-Policy`        | Restrict camera, microphone, geolocation as needed                      | [ ]    |
| `Cache-Control`             | `no-store` for responses with sensitive data                            | [ ]    |

---

## 3. Session Management

- [ ] **Session Timeout** — 30 min inactivity (configurable). Absolute timeout: 8 hours
- [ ] **Session Fixation Prevention** — Regenerate session ID post-login. Don't accept pre-established session IDs
- [ ] **Secure Cookies** — Flags: `Secure`, `HttpOnly`, `SameSite=Lax` (or `Strict` where possible)
- [ ] **Secure JWT** — Reasonable expiration (15-60 min access, 7d refresh). RS256 or ES256 algorithm, not HS256 with weak secret. Refresh token rotation
- [ ] **Complete Logout** — Logout invalidates session server-side, doesn't just delete client cookie
- [ ] **Concurrent Sessions** — Concurrent session policy defined (limit or allow with notification)

---

## 4. Privacy and Data Protection

- [ ] **GDPR Art. 9 Compliance** _(if processing special-category data — e.g. biometric/health)_ — Explicit consent documented for special-category data
- [ ] **eIDAS Compliance** — If applicable: electronic identity standards compliance
- [ ] **Minimized PII** — Only strictly necessary data collected and stored
- [ ] **Right to be Forgotten** — Data deletion mechanism implemented and verified (hard delete, not soft)
- [ ] **Data Residency** — Data stored in correct jurisdiction according to regulation
- [ ] **Special-Category Data Encryption** _(if applicable — e.g. biometric/health)_ — Dedicated encryption in transit and at rest with key separation
- [ ] **Privacy by Design** — Architecture designed with privacy from the start, not as afterthought

---

## 5. Scoring and Decision

### Global Result

| Result          | Criteria                                                           | Action                            |
| --------------- | ------------------------------------------------------------------ | --------------------------------- |
| **PASS**        | 0 BLOCK, 0 critical WARN, manual review completed                  | Deploy authorized                 |
| **CONDITIONAL** | 0 BLOCK, ≤3 minor WARN with documented mitigation                  | Deploy authorized with conditions |
| **FAIL**        | ≥1 BLOCK, or WARNs without mitigation, or incomplete manual review | Deploy NOT authorized             |

---

## 6. Connection with SDLC Flow

```
QA Sign-off (Gate 5) → Security evaluation → Security Compliance Check
    ↓                                                    ↓
If PASS → Security Sign-off → Gate 6
If FAIL → Remediation → Re-evaluate
```

---

## Changelog

| Version | Date       | Author                       | Changes                                                                                                                                        |
| ------- | ---------- | ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| 1.1.0   | 2026-06-12 | TL: domain-agnostic leak fix | GDPR Art. 9 + special-category-data encryption items made conditional "if applicable" (were ungated biometric mandatory) — agnostic by default |
| 1.0.0   | 2026-03-16 | System: Checklist Migration  | Initial migration from docs/checklists/security-compliance.md                                                                                  |
