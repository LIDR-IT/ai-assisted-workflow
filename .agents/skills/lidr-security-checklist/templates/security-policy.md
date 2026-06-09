---
id: security-policy-template
version: "1.0.0"
last_updated: "2026-03-16"
updated_by: "System: Template Migration"
status: active
type: template
review_cycle: 90
next_review: "2026-06-14"
owner_role: "Security Lead"
---

# SECURITY.md Template

> **Purpose**: Template to generate the security policy (SECURITY.md) for any project.
> **Criticality**: HIGH — Handling sensitive data requires clear policies.
> **Compiled from**: Security conventions, GDPR, OWASP guidelines.

---

## Recommended structure

```markdown
# Security Policy — {Project Name}

## Supported versions

| Version | Supported |
| ------- | --------- |
| x.y.z   | Yes       |
| < x.0.0 | No        |

## Reporting a vulnerability

If you discover a security vulnerability, please **do NOT open a public issue**.

### Reporting channel

1. **Email**: security@{domain}.com
2. **Subject**: `[SECURITY] {project} — {brief description}`
3. **PGP**: {Attach PGP public key or link if applicable}

### What to include in the report

- Vulnerability type (e.g.: XSS, SQLi, IDOR, privilege escalation)
- Steps to reproduce
- Estimated impact (confidentiality, integrity, availability)
- Affected version
- Possible mitigation (if known)

### Response SLA

| Action                  | Time              |
| ----------------------- | ----------------- |
| Acknowledgement         | 24 business hours |
| Initial assessment      | 72 business hours |
| Remediation plan        | 7 business days   |
| Fix deployed (critical) | 14 business days  |
| Fix deployed (high)     | 30 business days  |

### Acknowledgement

We thank responsible researchers. If you wish, we will include your name
in our security Hall of Fame (unless you prefer anonymity).

## Project security practices

### Sensitive data

This project may process sensitive data. We apply:

- **Encryption in transit**: TLS 1.2+ minimum
- **Encryption at rest**: AES-256 minimum
- **Logging**: PII/sensitive data is NEVER logged
- **Retention**: Minimum retention policy documented

### OWASP Top 10

We continuously evaluate against OWASP Top 10 (2021) via:

- Automated SAST on every PR
- SCA (dependency audit) on every build
- Periodic DAST on staging
- Pen testing before major releases

### Security headers

- Content-Security-Policy (CSP)
- Strict-Transport-Security (HSTS)
- X-Frame-Options
- X-Content-Type-Options

### Dependencies

- Automatic audit in CI/CD via {{CODE_QUALITY_TOOL}} — Example (Snyk): `npm audit` / `snyk` / equivalent
- Automatic dependency updates — Example (Dependabot/Renovate)
- SCA scanning via {{CODE_QUALITY_TOOL}} for known vulnerabilities
```

---

## Notes for the generator

- Response SLAs must align with the corporate policy
- The security email must be validated with the security team
- Adapt the sensitive-data section according to the project type
- The `security-checklist` skill validates that these practices are met pre-deploy
