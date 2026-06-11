---
name: lidr-test-execution-report
id: test-execution-report
version: "1.7.1"
last_updated: "2026-06-11"
updated_by: "TL: phase-prose normalization"
status: active
phase: 4
stage: qa
owner_role: "TL"
automation: false
domain_agnostic: true
language_default: en
integrations: [tracking, test_management]
description: >
  Essential for QA sign-off documentation — ALWAYS use before Gate 5 approval for any
  software release, feature deployment, or service update. CRITICAL for consolidating
  test results, validation outcomes, compliance testing, security assessments, and
  performance benchmarks into executive GO/NO-GO decisions. Domain-agnostic — works for
  any software system, platform, or application type. Mandatory for production deployment approval.
---

# Test Execution Report Generator

Phase: 4 — Implementation · qa (ex-Fase 6) | Gate: **G5 (QA Sign-off), `required: false`** (complementary consolidation — G5 QA evidence may be BMad TEA trace/automate OR this report; the QA Lead sign-off is the hard gate) | Output: English-authored; artifact language follows the client `language` setting (see `_shared/lidr/integrations/`).

Tools resolve via the central registry `_shared/lidr/integrations/tool-registry.yaml` (`{{TRACKING_TOOL}}`, `{{TEST_MGMT_TOOL}}`); the active client binds concrete tools in `clients/<CODE>.yaml`.

> **BMad relationship (extension):** BMad's `bmad-testarch-trace` emits a traceability matrix + quality-gate decision, `bmad-testarch-automate` runs the automated suite, and `bmad-tea` is the Test Architect advisor. This skill is the LIDR gap-filler that consolidates all of that (plus compliance / security / performance evidence) into a **formal executive GO/NO-GO QA sign-off** — an artifact BMad has no single concept for. Wired into `_shared/lidr/gate-evidence.yaml` → **G5** (`required: false` — complementary; QA evidence may be BMad TEA OR this report).

## Output Location

The QA sign-off report MUST be published to the per-client path Gate 5 reads (`gate-evidence.yaml` G5 `lidr-test-execution-report` glob `{client_root}/test-execution-report*.md`, `required: false` — complementary consolidation):

**`docs/projects/{CLIENT_CODE}/test-execution-report.md`** (or `test-execution-report-{release}.md` per release/cycle)

`{CLIENT_CODE}` is the active client (see `rules/lidr-sdlc/project.md`). The QA Lead sign-off record is written separately to `docs/projects/{CLIENT_CODE}/signoffs/qa-signoff.md` (the G5 sign-off artifact).

Example: `docs/projects/docline/test-execution-report-v1.4.0.md`

> **Gate 5 contract**: `test-execution-report*.md` at the per-client root is REQUIRED evidence for G5. Publish the final GO/NO-GO report here so `/lidr-advance-gate 5` and `lidr-gate-evaluation` resolve it.

## Workflow

1. **Read test execution data**: {{TEST_MGMT_TOOL}} export (e.g. CSV) with functional, integration, and system test results
2. **Analyze system {{PRIMARY_ACCURACY_METRIC}} results**: {{METRIC_TYPE_1}}/{{METRIC_TYPE_2}} rate measurements, validation success rates, quality analysis
3. **Review compliance testing outcomes**: {{COMPLIANCE_FLOW_1}} consent flows, {{COMPLIANCE_FLOW_2}} validation, audit trail verification
4. **Evaluate security test results**: Data encryption validation, API authentication tests, attack detection tests
5. **Assess performance benchmarks**: Response time SLAs, throughput under load, mobile device compatibility
6. **Cross-reference with exit criteria**: Acceptance thresholds, compliance requirements, security standards
7. **Analyze quality trends**: System performance regression, security posture improvement, compliance drift
8. **Generate industry-specific GO/NO-GO**: Banking = stricter criteria, consumer = balanced, internal = relaxed
9. **Prepare formal QA sign-off** with test evidence and compliance attestation

## Input

| Input                        | Required      | Source                      |
| ---------------------------- | ------------- | --------------------------- |
| {{TEST_MGMT_TOOL}} export    | ✅            | bound test-mgmt adapter     |
| Bug list (severity + status) | ✅            | {{TRACKING_TOOL}}           |
| Test Plan exit criteria      | ✅            | `bmad-testarch-test-design` |
| Performance test results     | If applicable | k6 / Datadog                |
| Security scan results        | If applicable | ZAP / Burp                  |
| Previous sprint reports      | Desirable     | For trend analysis          |

## Output Template

```markdown
# Test Execution Report: [PROJECT] — [Sprint/Release]

## Executive Summary

| Field              | Value                                |
| ------------------ | ------------------------------------ |
| **Test Cycle**     | Sprint {N} / Release v{X.Y}          |
| **Period**         | [{start} — {end}]                    |
| **QA Lead**        | [name]                               |
| **Recommendation** | ✅ GO / ⚠️ CONDITIONAL GO / ❌ NO-GO |

## Test Execution Results

| Metric       | Value      | Target | Status |
| ------------ | ---------- | ------ | ------ |
| Total TCs    | {N}        |        |        |
| Passed       | {N} ({X}%) | ≥95%   | ✅/❌  |
| Failed       | {N} ({X}%) |        |        |
| Blocked      | {N} ({X}%) | <5%    | ✅/❌  |
| Not Executed | {N} ({X}%) | 0%     | ✅/❌  |

## Bug Summary

| Severity | Open | Fixed | Verified | Deferred | Target   |
| -------- | ---- | ----- | -------- | -------- | -------- |
| Blocker  | {N}  | {N}   | {N}      | —        | 0 open   |
| Critical | {N}  | {N}   | {N}      | —        | 0 open   |
| Major    | {N}  | {N}   | {N}      | {N}      | ≤2 open  |
| Minor    | {N}  | {N}   | {N}      | {N}      | No limit |

## Exit Criteria Evaluation

| #   | Criterion            | Threshold   | Actual   | Status |
| --- | -------------------- | ----------- | -------- | ------ |
| 1   | Pass rate            | ≥95%        | {X}%     | ✅/❌  |
| 2   | Blockers open        | 0           | {N}      | ✅/❌  |
| 3   | Criticals open       | 0           | {N}      | ✅/❌  |
| 4   | Regression pass rate | 100%        | {X}%     | ✅/❌  |
| 5   | Performance NFRs     | Per PRD-T   | [detail] | ✅/❌  |
| 6   | Security scan clean  | 0 High/Crit | {N}      | ✅/❌  |

## Trends (vs previous cycles)

| Metric | Sprint N-2 | Sprint N-1 | Current | Trend |
| ------ | ---------- | ---------- | ------- | ----- |

## Risks & Observations

- [Risk 1 — what could still go wrong]
- [Observation — things to monitor post-deploy]

## Recommendation

**[GO / CONDITIONAL GO / NO-GO]**

- If CONDITIONAL: [list conditions + deadlines]
- If NO-GO: [blocking issues + remediation plan]

## QA Sign-off

[If GO: fill @signoffs/qa-signoff.md]
```

## Key Rules

- **System {{PRIMARY_ACCURACY_METRIC}} is binary**: {{METRIC_TYPE_1}}/{{METRIC_TYPE_2}} rate thresholds either met or not — no "close enough"
- **{{COMPLIANCE_FRAMEWORK_1}} compliance is zero-tolerance**: 100% pass rate required for any {{SENSITIVE_DATA_TYPE}} handling functionality
- **Security vulnerabilities block release**: 0 Critical/High findings for {{PRIMARY_WORKFLOW}} handling
- **Performance SLAs are industry-specific**: {{INDUSTRY_TIER_1}} <300ms, {{INDUSTRY_TIER_2}} <500ms, {{INDUSTRY_TIER_3}} <1s
- **Quality testing mandatory**: Results must show consistency across {{VERIFICATION_TARGET}} groups
- **Cross-platform consistency required**: Same system behavior across iOS/Android/Web platforms
- **{{SECURITY_FEATURE}} simulation validation**: {{VERIFICATION_METHOD}} detection must pass standard attack vectors
- **Compliance trends monitored**: {{COMPLIANCE_FRAMEWORK_2}} audit readiness improving over time, not degrading
- **Regulatory context influences criteria**: {{INDUSTRY_TIER_1}} = stricter than {{INDUSTRY_TIER_3}}, {{INDUSTRY_TIER_2}} = audit-ready

## Test Execution Report Example

### Test Execution Report: Customer Portal v2.1.0 Release — Sprint 24

```markdown
## Executive Summary

| Field              | Value                                      |
| ------------------ | ------------------------------------------ |
| **Test Cycle**     | Sprint 24 / Customer Portal v2.1.0 Release |
| **Period**         | [2026-03-01 — 2026-03-15]                  |
| **QA Lead**        | Sofia Martínez                             |
| **Recommendation** | ⚠️ CONDITIONAL GO                          |

## System Component Results

| System Component        | Metric                      | Target  | Actual | Status |
| ----------------------- | --------------------------- | ------- | ------ | ------ |
| {{COMPONENT_1}} Engine  | {{PRIMARY_ACCURACY_METRIC}} | ≥95%    | 96.2%  | ✅     |
| {{COMPONENT_2}} Service | {{METRIC_TYPE_1}} Rate      | ≤0.005% | 0.003% | ✅     |
| {{COMPONENT_2}} Service | {{METRIC_TYPE_2}} Rate      | ≤2%     | 1.8%   | ✅     |
| {{COMPONENT_3}} Module  | Accuracy                    | ≥98%    | 97.5%  | ❌     |
| {{COMPONENT_4}} Gateway | Error Rate                  | ≤5%     | 4.2%   | ✅     |

## Test Execution Results

| Metric       | Value         | Target | Status |
| ------------ | ------------- | ------ | ------ |
| Total TCs    | 1,247         |        |        |
| Passed       | 1,189 (95.3%) | ≥95%   | ✅     |
| Failed       | 31 (2.5%)     |        |        |
| Blocked      | 15 (1.2%)     | <5%    | ✅     |
| Not Executed | 12 (1.0%)     | 0%     | ❌     |

## {{COMPLIANCE_FRAMEWORK_1}} Compliance Results

| Test Category               | Total | Passed | Failed | Pass Rate | Target | Status |
| --------------------------- | ----- | ------ | ------ | --------- | ------ | ------ |
| {{COMPLIANCE_FLOW_1}} Flows | 45    | 45     | 0      | 100%      | 100%   | ✅     |
| {{COMPLIANCE_FLOW_2}}       | 12    | 12     | 0      | 100%      | 100%   | ✅     |
| {{COMPLIANCE_FLOW_3}}       | 8     | 8      | 0      | 100%      | 100%   | ✅     |
| Audit Logging               | 23    | 23     | 0      | 100%      | 100%   | ✅     |

## Security Assessment Results

| Category                           | Critical | High | Medium | Low | Status |
| ---------------------------------- | -------- | ---- | ------ | --- | ------ |
| {{SENSITIVE_DATA_TYPE}} Security   | 0        | 0    | 2      | 3   | ✅     |
| API Authentication                 | 0        | 0    | 1      | 1   | ✅     |
| {{SENSITIVE_DATA_TYPE}} Encryption | 0        | 0    | 0      | 2   | ✅     |
| {{SECURITY_FEATURE}} Testing       | 0        | 1    | 0      | 0   | ❌     |

## Bug Summary

| Severity | Open | Fixed | Verified | Deferred | Target   | Status |
| -------- | ---- | ----- | -------- | -------- | -------- | ------ |
| Blocker  | 0    | 2     | 2        | 0        | 0 open   | ✅     |
| Critical | 0    | 3     | 3        | 0        | 0 open   | ✅     |
| Major    | 2    | 8     | 6        | 2        | ≤2 open  | ✅     |
| Minor    | 5    | 12    | 10       | 7        | No limit | ✅     |

## Exit Criteria Evaluation

| #   | Criterion                                                   | Threshold       | Actual | Status |
| --- | ----------------------------------------------------------- | --------------- | ------ | ------ |
| 1   | system {{PRIMARY_ACCURACY_METRIC}} ({{METRIC_TYPE_1}} rate) | ≤0.005%         | 0.003% | ✅     |
| 2   | system {{PRIMARY_ACCURACY_METRIC}} ({{METRIC_TYPE_2}} rate) | ≤2%             | 1.8%   | ✅     |
| 3   | {{SENSITIVE_DATA_TYPE}} validation accuracy                 | ≥95%            | 96.2%  | ✅     |
| 4   | {{COMPONENT_3}} accuracy                                    | ≥98%            | 97.5%  | ❌     |
| 5   | {{COMPLIANCE_FRAMEWORK_1}} compliance tests                 | 100%            | 100%   | ✅     |
| 6   | Security vulnerabilities                                    | 0 Critical/High | 1 High | ❌     |
| 7   | Performance SLA ({{INDUSTRY_TIER_1}})                       | P95 <300ms      | 285ms  | ✅     |
| 8   | Cross-platform consistency                                  | ≥98%            | 99.1%  | ✅     |

## Quality Analysis Results

| {{VERIFICATION_TARGET}} Group | Sample Size | {{METRIC_TYPE_1}} Rate | {{METRIC_TYPE_2}} Rate | Quality Score | Status |
| ----------------------------- | ----------- | ---------------------- | ---------------------- | ------------- | ------ |
| Category A                    | 2,500       | 0.002%                 | 1.5%                   | Acceptable    | ✅     |
| Category B                    | 3,000       | 0.003%                 | 1.8%                   | Acceptable    | ✅     |
| Category C                    | 1,500       | 0.004%                 | 2.1%                   | Acceptable    | ✅     |
| Type 1                        | 3,500       | 0.003%                 | 1.7%                   | Acceptable    | ✅     |
| Type 2                        | 3,500       | 0.003%                 | 1.9%                   | Acceptable    | ✅     |

## Risks & Observations

- **High Risk**: {{SECURITY_FEATURE}} testing detected 1 bypass scenario for {{VERIFICATION_METHOD}} attacks
- **Medium Risk**: {{COMPONENT_3}} accuracy below threshold may affect {{DOMAIN_SYSTEMS}} processing
- **Observation**: Performance improving but still close to {{INDUSTRY_TIER_1}} SLA limits under peak load
- **Observation**: {{COMPLIANCE_FRAMEWORK_1}} compliance testing shows excellent maturity and consistency

## Recommendation: ⚠️ CONDITIONAL GO

**Conditions for release:**

1. **Security**: Fix High-severity {{VERIFICATION_METHOD}} attack bypass (ETA: 2026-03-18, Owner: Security Team)
2. **{{COMPONENT_3}}**: Improve {{DOMAIN_SYSTEMS}} processing to ≥98% accuracy (ETA: 2026-03-19, Owner: R&D Team)

**Rationale:**

- Core system and {{SENSITIVE_DATA_TYPE}} validation exceed {{INDUSTRY_TIER_1}} standards
- {{COMPLIANCE_FRAMEWORK_1}} compliance is exemplary and audit-ready
- Identified security issue is addressable within release timeline
- {{COMPONENT_3}} improvement can be achieved with additional training data

**Post-fix validation required:**

- Re-run {{SECURITY_FEATURE}} testing suite (2h)
- Validate {{DOMAIN_SYSTEMS}} processing with 500 additional samples (4h)
- Security sign-off on remediated vulnerability

**Alternative**: Defer {{DOMAIN_SYSTEMS}} support to v2.2 if {{COMPONENT_3}} fix not ready by 2026-03-19
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
- Test execution reporting and QA compliance patterns
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

## Changelog

| Version | Date       | Author                                    | Changes                                                                                                                                                                                                                                         |
| ------- | ---------- | ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1.7.1   | 2026-06-11 | TL: phase-prose normalization             | Normalized body `Phase:` prose to the unified 0-4 numbering (`Phase: <0-4> — <Unified> · <stage> (ex-Fase N)`); now guarded by ecosystem-coherence.test.ts                                                                                      |
| 1.7.0   | 2026-06-10 | TL: Gate-evidence contract fix            | Added "## Output Location": publishes to `docs/projects/{CLIENT_CODE}/test-execution-report*.md` (required G5 gate-evidence path)                                                                                                               |
| 1.6.0   | 2026-06-09 | TL: lang+tool agnostic                    | Language to English-default-configurable; abstracted tracking/test_management via tool-registry                                                                                                                                                 |
| 1.4.0   | 2026-04-06 | System: Phase 4 Python Script Remediation | Complete domain-agnostic remediation: Lines 26-28 (workflow terminology), 105-114 (8 Key Rules with template variables), 117-214 (complete example rewrite from biometric banking to generic Customer Portal), achieving 72→95/100 target score |
| 1.3.0   | 2026-03-26 | IA: domain-agnostic-fix                   | Previous domain-agnostic improvements                                                                                                                                                                                                           |
