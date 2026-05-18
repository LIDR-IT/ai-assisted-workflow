---
name: lidr-bug-report
id: bug-report
version: "1.3.0"
last_updated: "2026-03-25"
updated_by: "TL: tier3-remediation"
status: active
phase: 6
owner_role: "QA Lead"
automation: false
domain_agnostic: true
description: >
  Structure comprehensive bug reports that enable developers to reproduce issues in under 5 minutes without questions.
  Domain-agnostic — works for any application type, technology stack, or platform.
  Use for unexpected behavior, performance issues, production incidents, or user complaints.
  Essential for QA-to-Dev communication during testing phase and production issue reporting.
  Always use when behavior differs from expected test results, always use when users report production issues or when developers self-report bugs.
  Do NOT use for feature requests (use business-case), for design changes (use ux-design-spec), or for enhancement requests.
  Triggers on "report bug", "create bug report", "found a bug", "defect report", "file issue", "production issue", "unexpected behavior".
  Output in Spanish (functional description), English (technical data, logs), structured for Jira/tracking tools.
  Audience: Developer (reproduces and fixes), QA Lead (triages priority), PO (assesses business impact).
---

# Bug Report Structurer

Phase: 6 — QA | Gate: contributes to Gate 5 (0 P1/P2 open) | Language: Spanish + English

**Principle:** A good bug report lets the developer reproduce the bug in <5 minutes without asking anything.

## Workflow

1. Capture: what happened vs what should happen
2. Identify: reproduction steps with concrete data
3. Classify: severity and priority
4. Enrich: screenshots, logs, network traces, environment info
5. Link: to test case, US, RF that failed
6. Output: structured report ready for Jira

## Input

| Input                          | Required       | Source                     |
| ------------------------------ | -------------- | -------------------------- |
| Problem description            | ✅             | Direct QA observation      |
| Reproduction steps             | ✅             | Test case execution        |
| Screenshots / video            | ✅ (if visual) | Browser / recording        |
| Linked test case               | Desirable      | skill `create-test-cases/` |
| Browser console / network logs | Desirable      | DevTools                   |
| Environment details            | ✅             | Staging / prod             |

## Output Template

```markdown
# BUG-{PROJ}-{NNN}: {Short descriptive title — what's wrong}

## Metadata

| Field               | Value                                                               |
| ------------------- | ------------------------------------------------------------------- |
| **Severity**        | Blocker / Critical / Major / Minor / Trivial                        |
| **Priority**        | P1 (immediate) / P2 (this sprint) / P3 (next sprint) / P4 (backlog) |
| **Environment**     | [Staging / Pre-prod / Production] — [URL]                           |
| **Browser/Device**  | [Chrome 120 / Safari 17 / iPhone 15]                                |
| **OS**              | [macOS 14 / Windows 11 / iOS 17]                                    |
| **User**            | [test account used]                                                 |
| **Reproducibility** | Always / Intermittent (~X%) / Once                                  |
| **Test Case**       | TC-{PROJ}-{NNN} (if applicable)                                     |
| **US / RF**         | US-{PROJ}-{NNN} / RF-{PROJ}-{NNN}                                   |

## Description

**Actual behavior:** [What happens — observable, factual]
**Expected behavior:** [What SHOULD happen — per test case / BDD criteria]
**Business impact:** [Who is affected and how — for PO prioritization]

## Steps to Reproduce

1. [Concrete step with specific data]
2. [Concrete step]
3. [Concrete step]
4. **Result:** [What actually happens]

**Test data used:** [specific files, users, inputs]

## Evidence

### Screenshots

[Annotated screenshots showing the problem]

### Console Logs
```

[Relevant browser console errors]

```

### Network (if API related)
```

[Request/Response that shows the problem]

```

### Server Logs (if available)
```

[Relevant server-side error logs]

```

## Additional Context
- **First seen:** [date / commit / deploy]
- **Regression?** [Yes — worked in v{X} / No — new feature]
- **Workaround:** [None / description of workaround]
- **Related bugs:** [BUG-PROJ-XXX]
```

## Severity Classification

| Severity     | Criteria                                       | Examples                                     |
| ------------ | ---------------------------------------------- | -------------------------------------------- |
| **Blocker**  | System unusable, no workaround, blocks testing | App crashes, login broken, data loss         |
| **Critical** | Core functionality broken, workaround exists   | Payment fails but can retry, upload corrupts |
| **Major**    | Important feature broken, non-core             | Search returns wrong results, export fails   |
| **Minor**    | Feature works but with cosmetic/UX issues      | Alignment off, wrong icon, slow animation    |
| **Trivial**  | Cosmetic only, no functional impact            | Typo, color mismatch, extra whitespace       |

## Key Rules

- **Observed, not interpreted**: "Button doesn't work" → "Clicking 'Submit' shows spinner for 30s then returns to form without error message or submission"
- **Concrete reproduction**: "Enter invalid data" → "Enter `abc` in the phone field and click Submit"
- **One bug per report**: Don't combine. If 2 issues found → 2 reports.
- **Include comparison**: "Actual vs Expected" makes the bug unambiguous.
- **Regression flag**: Explicitly state if this worked before (and in which version).

## Example Report

```markdown
# BUG-AUTH-045: Login button unresponsive on mobile Safari after session validation

## Metadata

| Field               | Value                                           |
| ------------------- | ----------------------------------------------- |
| **Severity**        | Critical                                        |
| **Priority**        | P1 (immediate)                                  |
| **Environment**     | Staging — https://staging.example.com/auth/demo |
| **Browser/Device**  | Safari 17.1 / iPhone 15 Pro                     |
| **OS**              | iOS 17.1.1                                      |
| **User**            | test@example.com (test account)                 |
| **Reproducibility** | Always                                          |
| **Test Case**       | TC-AUTH-012 (Mobile Authentication Flow)        |
| **US / RF**         | US-AUTH-034 / RF-AUTH-007                       |

## Description

**Actual behavior:** After completing session validation on mobile Safari, the "Continue to Login" button shows pressed state but no navigation occurs. User remains on the success screen indefinitely.

**Expected behavior:** Per TC-AUTH-012 and RF-AUTH-007, clicking "Continue to Login" should navigate to dashboard within 2 seconds after successful authentication.

**Business impact:** Mobile users (40% of traffic) cannot complete login flow. Affects demo environment for client presentations and user acceptance testing.

## Steps to Reproduce

1. Open https://staging.example.com/auth/demo in Mobile Safari (iPhone)
2. Enter credentials: `test@example.com` / `Demo2024!`
3. Complete two-factor authentication step
4. Wait for "Authentication Successful" screen (green checkmark appears)
5. Tap "Continue to Login" button
6. **Result:** Button shows pressed animation but no navigation occurs

**Test data used:** test@example.com test account, standard authentication flow

## Evidence

### Screenshots

- screenshot_001.png: Authentication success screen with button ready to tap
- screenshot_002.png: Button in pressed state (darker blue background)
- screenshot_003.png: Same screen after 30 seconds - no change

### Console Logs
```

Uncaught TypeError: Cannot read properties of undefined (reading 'redirectUrl')
at AuthenticationService.handleAuthSuccess (auth.service.js:142:18)
at LoginComponent.onContinueClick (login.component.js:89:24)

```

### Network (if API related)
```

POST /api/v1/auth/verify-complete
Status: 200 OK
Response: {
"success": true,
"sessionId": "sess_12345",
"sessionToken": "eyJ0eXAiOiJKV1QiLCJhb...",
"redirectUrl": undefined // ← PROBLEM: should contain dashboard URL
}

```

### Server Logs (if available)
```

2026-03-09 14:23:15 [WARN] AuthController: redirectUrl configuration missing for mobile client
2026-03-09 14:23:15 [INFO] Authentication completed for user test@example.com

```

## Additional Context
- **First seen:** 2026-03-07 (after deploy v1.2.3)
- **Regression?** Yes — worked correctly in v1.2.2
- **Workaround:** Desktop browser works fine. Users can rotate phone to landscape to trigger desktop view.
- **Related bugs:** None known
```

## Triage Process

### Priority Matrix

Use this matrix to triage multiple bugs when resources are limited:

| Severity     | High Business Impact | Medium Business Impact | Low Business Impact |
| ------------ | -------------------- | ---------------------- | ------------------- |
| **Blocker**  | P1 (Drop everything) | P1 (Drop everything)   | P1 (Same day)       |
| **Critical** | P1 (Same day)        | P1 (Same day)          | P2 (This sprint)    |
| **Major**    | P1 (Same day)        | P2 (This sprint)       | P2 (This sprint)    |
| **Minor**    | P2 (This sprint)     | P3 (Next sprint)       | P3 (Next sprint)    |
| **Trivial**  | P3 (Next sprint)     | P4 (Backlog)           | P4 (Backlog)        |

### Business Impact Assessment

| Impact Level | Criteria                                                   | Examples                                                   |
| ------------ | ---------------------------------------------------------- | ---------------------------------------------------------- |
| **High**     | >25% users affected, revenue impact, regulatory compliance | Login broken, payment failures, data loss, GDPR violations |
| **Medium**   | Core workflow affected, workaround exists                  | Search broken but browse works, mobile-only issues         |
| **Low**      | Nice-to-have features, cosmetic issues                     | Dashboard widgets, notification preferences, UI polish     |

### Triage Questions

1. **How many users affected?** (1 user / <10% / 25%+ / All users)
2. **Can they complete their main goal?** (Yes with workaround / No / Partially)
3. **Revenue impact?** (Direct / Indirect / None)
4. **Security implications?** (Data exposure / None)
5. **Client demo impact?** (Blocks demo / Embarrassing / Minor / None)

### Escalation Rules

- **P1 bugs**: Notify Tech Lead + QA Lead immediately
- **Production P1**: Add Security Lead if data involved
- **Client-facing environments**: Add PO for business impact assessment
- **Regression bugs**: Auto-escalate priority by 1 level

## Edge Cases

### Intermittent Bugs (Hard to Reproduce)

| Challenge                        | Strategy                              | Template Addition                            |
| -------------------------------- | ------------------------------------- | -------------------------------------------- |
| Happens <50% of time             | Record video of multiple attempts     | Add "Reproduction rate: X attempts out of Y" |
| Browser-specific race conditions | Test across multiple browsers/devices | List all tested environments with results    |
| Load-dependent issues            | Test under different load conditions  | Include time of day, concurrent users        |

**Template enhancement for intermittent bugs:**

```markdown
## Intermittent Behavior

- **Observed frequency:** X failures out of Y attempts (Z% reproduction rate)
- **Patterns noticed:** [Time of day / User load / Specific data / Browser state]
- **Attempts logged:** [Link to video recording or detailed log file]
```

### Environment-Specific Issues (Only in Prod)

| Challenge                              | Strategy                           | Template Addition                |
| -------------------------------------- | ---------------------------------- | -------------------------------- |
| Can't reproduce in staging             | Compare environment configurations | Document environment differences |
| Prod-only data causes issue            | Use production-like test data      | Request sanitized data dump      |
| Load-related (only under real traffic) | Synthetic load testing             | Document traffic patterns        |

**Template enhancement for environment-specific bugs:**

```markdown
## Environment Analysis

- **Affected environments:** [Prod only / Prod + Pre-prod / All except Dev]
- **Environment differences:** [Data volume / External integrations / Load balancer settings]
- **Data specific:** [Production user patterns / Large datasets / External API responses]
```

### Performance Bugs (Gradual Degradation)

| Challenge                  | Strategy                           | Template Addition                 |
| -------------------------- | ---------------------------------- | --------------------------------- |
| Slow degradation over time | Baseline vs current metrics        | Include performance benchmarks    |
| Memory/CPU creep           | Resource monitoring data           | Add system resource usage         |
| Database query slowdown    | Execution plans and query analysis | Include database performance data |

**Template enhancement for performance bugs:**

```markdown
## Performance Analysis

- **Baseline performance:** [Response time / Memory usage / CPU usage] from [Date]
- **Current performance:** [Current measurements]
- **Degradation pattern:** [Linear / Exponential / Step function / Threshold-based]
- **Performance thresholds:** [SLA requirements vs actual]
```

### Integration Bugs (Third-Party Services)

| Challenge                   | Strategy                             | Template Addition                 |
| --------------------------- | ------------------------------------ | --------------------------------- |
| External API changes        | Document API version differences     | Include external service versions |
| Network timeout issues      | Test with different timeout settings | Document network conditions       |
| Authentication/token expiry | Test token refresh scenarios         | Include auth flow state           |

**Template enhancement for integration bugs:**

```markdown
## External Dependencies

- **Service:** [Name and version of external service]
- **API endpoint:** [Specific endpoint failing]
- **Authentication:** [Token valid / Expired / Invalid scope]
- **Network conditions:** [Latency / Packet loss / Firewall issues]
- **Service status:** [Check external service status page]
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
- QA testing and bug reporting compliance patterns
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

## Changelog

| Versión | Fecha      | Autor                 | Cambios                                                                                                                       |
| ------- | ---------- | --------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| 1.3.1   | 2026-03-25 | TL: tier3-remediation | Tier 3 domain-agnostic remediation: replaced domain-specific example with generic web application authentication flow example |
| 1.3.0   | 2026-03-16 | Tech Lead: System     | Added Quality Assurance section with validation framework                                                                     |
| 1.1.0   | 2026-03-09 | QA: Enhancement       | Añadidas secciones de ejemplo, proceso de triage, y casos edge                                                                |
| 1.0.0   | 2026-02-15 | QA: Initial           | Versión inicial con template y reglas básicas                                                                                 |
