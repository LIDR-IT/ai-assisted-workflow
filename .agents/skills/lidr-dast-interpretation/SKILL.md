---
name: lidr-dast-interpretation
id: dast-interpretation
version: "1.1.1"
last_updated: "2026-06-09"
updated_by: "TL: BMad-coherence batch-fix"
status: active
phase: 7
owner_role: "TL"
automation: false
domain_agnostic: true
language_default: en
description: "Interpret DAST (Dynamic Application Security Testing) scan reports from OWASP ZAP, Burp Suite, or Nuclei against running applications. Unlike SAST, DAST tests the app at runtime (black-box) finding configuration issues, missing headers, CORS problems, and runtime vulnerabilities. Use for any dynamic security testing or runtime vulnerability assessment. Essential for production security validation and compliance reporting. Always use before releases and after infrastructure changes. Use pre-release before Gate 6 against staging, post-deployment for production smoke, after infrastructure changes, or when new public endpoints are added. Triggers on "interpret DAST results", "ZAP scan report", "Burp scan", "security headers check", "DAST findings", "runtime security scan"."
---

# DAST Scan Interpreter

Phase: 7 — Security | Gate: contributes to Gate 6 | Language: English

## Workflow

1. Read DAST report (ZAP HTML/JSON or Burp XML)
2. Read target URLs scanned to confirm coverage
3. Read server configuration (Nginx/Apache, middleware, headers)
4. Classify findings: true positive vs config-mitigated (WAF, reverse proxy)
5. Prioritize by exploitability and business impact
6. Generate fix suggestions (config-level, not code-level)
7. Compare with baseline if available

## Input

| Input                  | Required      | Source                             |
| ---------------------- | ------------- | ---------------------------------- |
| DAST report (ZAP/Burp) | ✅            | Scanner output                     |
| Target URLs scanned    | ✅            | Scan config                        |
| Server configuration   | ✅            | Nginx/Apache config, headers       |
| OpenAPI spec           | Desirable     | For endpoint coverage verification |
| Previous baseline      | Desirable     | Prior DAST report                  |
| WAF rules              | If applicable | CloudFlare / AWS WAF               |

## Output Template

```markdown
# DAST Interpretation: [PROJECT] — [DATE]

## Scan Overview

| Field             | Value                 |
| ----------------- | --------------------- |
| Scanner           | [ZAP / Burp / Nuclei] |
| Target            | [URLs scanned]        |
| Scan Type         | [Full / API / Quick]  |
| Duration          | [X min]               |
| Endpoint Coverage | [X/Y endpoints — {%}] |

## Findings Summary

| Severity | Count | New | Fixed since baseline |
| -------- | ----- | --- | -------------------- |

## Findings Detail

### 🔴 High ({N})

| #   | Alert | URL | Evidence | OWASP | Fix | Config Change |
| --- | ----- | --- | -------- | ----- | --- | ------------- |

### 🟡 Medium ({N})

[same table]

### 🟢 Low / Informational ({N})

[condensed]

## Configuration Fixes

| Finding | Current Config | Recommended Config | File |
| ------- | -------------- | ------------------ | ---- |

## Endpoint Coverage Analysis

| Endpoint | Scanned? | Findings | Notes |
| -------- | -------- | -------- | ----- |

## False Positives / Mitigated

| Finding | Why False/Mitigated | Evidence |
| ------- | ------------------- | -------- |
```

## Key Rules

- **DAST ≠ SAST**: DAST finds runtime/config issues. Don't expect code-level findings.
- **Config fixes are primary**: Most DAST findings are fixed in Nginx/Apache config, not code.
- **WAF mitigation is valid**: If WAF blocks an attack, note it but verify the WAF rule is permanent.
- **Coverage matters**: If only 50% of endpoints were scanned, the report is incomplete — flag it.
- **Headers checklist**: Always verify: CSP, X-Frame-Options, X-Content-Type-Options, HSTS, Referrer-Policy, Permissions-Policy.
- **Compare with baseline**: Show trend — are we improving or regressing?

## Example Analysis: Web Application Platform

### Sample DAST Report Findings

```
🔴 HIGH: Missing X-Frame-Options Header
URL: https://api.example-platform.com/auth/verify
Evidence: Response lacks X-Frame-Options header
Risk: Clickjacking attacks on authentication pages
Impact: Attacker could overlay invisible frames during user login

🔴 HIGH: Insecure Content-Type Sniffing
URL: https://api.example-platform.com/users/upload
Evidence: X-Content-Type-Options header missing
Risk: Browser MIME sniffing could execute uploaded content as script
Impact: Potential XSS via malicious file upload during user onboarding

🟡 MEDIUM: HTTP Security Headers Missing
URL: https://platform.example-platform.com/dashboard
Evidence: Missing Referrer-Policy, Permissions-Policy
Risk: Information leakage, excessive browser permissions
Impact: User privacy exposure, unauthorized browser permission grants

🟢 LOW: Verbose Error Messages
URL: https://api.example-platform.com/users/register
Evidence: Stack trace in 500 response
Risk: Information disclosure about backend architecture
Impact: Assists reconnaissance for targeted attacks
```

### Step-by-Step Interpretation Process

#### 1. Context Analysis for Web Application Systems

```
Application Type: Web Application Platform
Critical Assets:
- Sensitive user data (encrypted at rest, access-controlled)
- User account credentials (PII, authentication data)
- Authentication tokens (session hijacking risk)
- API endpoints (public-facing attack surface)

Compliance Requirements:
- GDPR (data protection and privacy)
- ISO 27001 (information security management)
- OWASP Top 10 (web application security standards)
- SOC 2 (security, availability, confidentiality)
```

#### 2. True Positive vs False Positive Classification

**TRUE POSITIVE Example:**

```
Finding: Missing X-Frame-Options on /auth/register
Analysis: ✅ VALID
Reasoning: User registration UI susceptible to clickjacking
Business Impact: HIGH - Attacker could trick users into submitting data via overlaid frames
Action Required: Add X-Frame-Options: DENY header
```

**FALSE POSITIVE Example:**

```
Finding: SQL Injection on /api/users/{id}
Analysis: ❌ FALSE POSITIVE
Reasoning:
- Endpoint uses parameterized queries (verified in code review)
- WAF rule blocks SQL injection patterns
- Input validation sanitizes user ID parameter
Evidence: WAF logs show 403 responses for malicious payloads
Action: Document as mitigated, verify WAF rule permanence
```

## False Positive Identification

### CDN/WAF Protection Scenarios

| DAST Finding        | False Positive Indicator        | Verification Method                 |
| ------------------- | ------------------------------- | ----------------------------------- |
| SQL Injection       | WAF returns 403 Forbidden       | Check WAF logs for blocked requests |
| XSS Reflection      | Content filtered/escaped        | Inspect response for sanitization   |
| Directory Traversal | CDN blocks ../ patterns         | Review CDN security rules           |
| Command Injection   | Input validation errors         | Test with benign payloads           |
| File Upload Vulns   | File type restrictions enforced | Upload legitimate files             |

### Application-Specific Misconfigurations vs Real Vulnerabilities

**Misconfiguration (Not Vulnerability):**

```
Finding: Hashed data exposure in API response
Reality: Values are already irreversibly hashed (bcrypt/Argon2 standard)
Risk Assessment: LOW - Hashed values cannot be reverse-engineered to sensitive data
Action: Document hashing algorithm used and confirm it meets current standards
```

**Real Vulnerability:**

```
Finding: Authentication threshold configurable via API parameter
Reality: Parameter manipulation could bypass authentication checks
Risk Assessment: CRITICAL - Authentication bypass potential
Action: Remove configurable threshold from API, enforce secure value server-side
```

### Context-Aware Analysis Techniques

1. **Endpoint Classification**
   - Public (marketing, docs): Lower security requirements
   - Authentication (login, register): High security requirements
   - Sensitive data processing: Critical security requirements

2. **Request Pattern Analysis**
   - Normal user flow vs scanner artificial requests
   - Rate limiting behavior during scan
   - Authentication state maintenance

3. **Response Analysis**
   - Error message consistency across endpoints
   - Response timing analysis for information leakage
   - Content-type validation and enforcement

## Priority Assessment Matrix

### CVSS + Business Impact for systems

| CVSS Score     | Traditional Risk | Application Context                                       | Business Impact                          | Final Priority       |
| -------------- | ---------------- | --------------------------------------------------------- | ---------------------------------------- | -------------------- |
| 9.0+ Critical  | Critical         | Account takeover, mass data breach, authentication bypass | Regulatory violations, reputation damage | **P0 - Immediate**   |
| 7.0-8.9 High   | High             | Single user impersonation, sensitive data exposure        | Service disruption, compliance risk      | **P1 - 24 hours**    |
| 4.0-6.9 Medium | Medium           | Information disclosure, session hijacking                 | User privacy violation                   | **P2 - 72 hours**    |
| 0.1-3.9 Low    | Low              | Verbose errors, missing headers                           | Reconnaissance assistance                | **P3 - Next sprint** |

### Risk Prioritization for Web Applications

#### Critical Priority (P0) - Same Day Fix

- Sensitive data exposure or manipulation via API
- Authentication bypass in user verification flow
- PII exposure in user onboarding processes
- Remote code execution on application servers

#### High Priority (P1) - 24-48 Hour Fix

- Session fixation in authentication flows
- CSRF on account creation/modification
- Missing rate limiting on authentication attempts
- Insecure direct object references to user profiles

#### Medium Priority (P2) - Within Sprint

- Missing security headers on user-facing pages
- Information disclosure in error messages
- Insufficient logging of security events
- Weak SSL/TLS configuration

#### Low Priority (P3) - Next Sprint

- Verbose error messages without sensitive data
- Missing CORS headers on non-critical endpoints
- Information leakage in HTTP responses
- Outdated software versions without known exploits

### Remediation Timeline Recommendations

```
| Risk Level | Business Hours | Calendar Days | Rationale |
|------------|---------------|---------------|-----------|
| P0 Critical | 4-8 hours | Same day | Regulatory compliance, user safety |
| P1 High | 24-48 hours | 1-2 business days | Prevent account compromise |
| P2 Medium | 72-96 hours | 3-5 business days | Reduce attack surface |
| P3 Low | 1-2 sprints | 2-4 weeks | Security hygiene |
```

## Security Remediation Templates

### Configuration Fixes for Common Findings

#### Missing Security Headers

```nginx
# Nginx configuration for application API endpoints
location /api/ {
    # Prevent clickjacking attacks on authentication UI
    add_header X-Frame-Options "DENY" always;

    # Prevent MIME sniffing on uploaded files
    add_header X-Content-Type-Options "nosniff" always;

    # Enable XSS protection for legacy browsers
    add_header X-XSS-Protection "1; mode=block" always;

    # Strict HTTPS enforcement for sensitive data
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Minimize referrer information leakage
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Content Security Policy for application pages
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' wss: https:; media-src 'self' blob:;" always;

    # Restrict browser permissions for security
    add_header Permissions-Policy "geolocation=(), payment=(), usb=()" always;
}
```

#### Secure Cookie Configuration

```nginx
# Session cookies for authenticated operations
proxy_cookie_path / "/; HTTPOnly; Secure; SameSite=Strict";
proxy_cookie_flags ~ secure httponly samesite=strict;

# Additional cookie security for session tokens
location /auth/ {
    proxy_set_header Cookie $http_cookie;
    proxy_cookie_flags "SessionToken" secure httponly samesite=strict;
}
```

### Security Header Recommendations

#### User-Facing Application Pages

```
Content-Security-Policy: default-src 'self';
                        script-src 'self' 'unsafe-inline';
                        style-src 'self' 'unsafe-inline';
                        img-src 'self' data: blob:;
                        media-src 'self' blob:;
                        connect-src 'self' wss: https:

Permissions-Policy: geolocation=(),
                   payment=(),
                   usb=(),
                   magnetometer=(),
                   gyroscope=()
```

#### File Upload Endpoints

```
X-Content-Type-Options: nosniff
Content-Security-Policy: default-src 'none';
                        form-action 'self'
X-Frame-Options: DENY
```

### Infrastructure Hardening Suggestions

#### API Gateway Configuration

```yaml
# Rate limiting for sensitive endpoints
rate_limit:
  - path: "/api/auth/verify"
    limit: "10 requests per minute per IP"
    burst: 3
  - path: "/api/users/process"
    limit: "5 requests per minute per user"
    burst: 2

# Request size limits for file uploads
body_size_limit:
  - path: "/api/users/upload"
    max_size: "10MB"
  - path: "/api/auth/register"
    max_size: "2MB"

# IP allowlisting for admin endpoints
ip_restrictions:
  - path: "/admin/*"
    allow: ["10.0.0.0/8", "192.168.0.0/16"]
    deny: ["0.0.0.0/0"]
```

#### Database Security Configuration

```sql
-- Create dedicated read-only user for data queries
CREATE USER 'app_reader'@'%' IDENTIFIED BY 'strong_random_password';
GRANT SELECT ON sensitive_data TO 'app_reader'@'%';

-- Enable audit logging for sensitive data access
SET GLOBAL general_log = 'ON';
SET GLOBAL log_output = 'TABLE';

-- Configure secure SSL for database connections
REQUIRE SSL;
```

#### Monitoring and Alerting

```yaml
# Security event monitoring
alerts:
  - name: "Sensitive Data Access Anomaly"
    condition: "SELECT queries on sensitive_data table exceeding baseline"
    threshold: "> 1000 queries/hour"
    action: "alert security team"

  - name: "Failed Authentication Attempts"
    condition: "HTTP 401 responses from /api/auth/*"
    threshold: "> 50 failures/minute from single IP"
    action: "temporary IP ban + alert"

  - name: "File Upload Anomalies"
    condition: "Large or suspicious file uploads to upload endpoints"
    threshold: "> 10MB or disallowed file types"
    action: "block upload + log incident"
```

#### Backup and Recovery Security

```bash
#!/bin/bash
# Secure sensitive data backup script

# Encrypt backup with AES-256
gpg --symmetric --cipher-algo AES256 --compress-algo 2 \
    --output app_backup_$(date +%Y%m%d).gpg \
    sensitive_data.sql

# Verify backup integrity
sha256sum app_backup_$(date +%Y%m%d).gpg > backup_checksum.txt

# Secure transfer to offsite storage
scp -i ~/.ssh/backup_key app_backup_*.gpg backup@secure-server:encrypted/

# Remove local backup file
shred -vfz -n 3 sensitive_data.sql
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
- DAST security testing and vulnerability assessment compliance patterns
- Progressive disclosure adherence
- Resource organization standards

**When to use:**

- Before skill release/packaging
- In CI/CD pipeline (quality gates)
- After major example updates
- During skill maintenance cycles

**Integration with ecosystem:**

- Used by `bmad-eval-runner` for ecosystem validation
- Supports quality gates in SDLC workflow
- Provides consistent validation across all skills
