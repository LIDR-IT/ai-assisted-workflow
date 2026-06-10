---
name: lidr-generate-nfr
id: generate-nfr
version: "2.7.0"
last_updated: "2026-06-10"
updated_by: "TL: Gate-evidence contract fix"
status: active
phase: 3
stage: specification
owner_role: "TL"
automation: false
domain_agnostic: true
language_default: en
integrations: []
description: >
  Generate measurable Non-Functional Requirements (NFRs) covering performance, scalability, security, availability, and maintainability from the Technical PRD.
  Domain-agnostic — works for any software system, platform, or API type.
  Use for defining verifiable quality constraints that complement functional requirements.
  Essential at Gate 2: NFRs must be measurable and testable before Sprint Planning.
  Always use when Technical PRD section 5 (NFRs) exists, always use when defining SLAs, performance targets, or security baselines.
  Do NOT use for functional requirements (use generate-rf), for test cases (use create-test-cases), or for compliance checklists (use security-checklist).
  Triggers on "non-functional requirements", "NFR", "performance requirements", "scalability requirements", "security NFR", "availability SLA", "quality attributes".
  Output: English by default; artifact language follows the client `language` setting (see `_shared/lidr/integrations/`). Metrics and thresholds stay in English.
  Audience: Tech Lead (owns NFRs), QA (verifies compliance), Security (validates security NFRs).
---

# Non-Functional Requirements Generator

> **Essential for defining system quality attributes**. **Always use when specifying measurable performance, security, and availability targets**. **Critical for compliance requirements and architectural constraints**.

**Triggers**: "generate NFRs", "non-functional requirements", "create NFRs", "performance requirements", "security requirements", "SLA definition", "quality attributes", "compliance requirements", "latency targets"

Phase: 3 — Specification | Gate: 2 (with RFs) | Language: English by default; artifact language follows the client `language` setting (see `_shared/lidr/integrations/`). Metrics stay in English.

Tools resolve via the central registry `_shared/lidr/integrations/tool-registry.yaml`; the active client binds concrete tools in `clients/<CODE>.yaml`.

## Relationship to BMad

LIDR-unique: authors measurable, testable NFRs at Gate 2 (Specification) — a contract that `bmad-testarch-nfr` later audits against implementation evidence. Consumes the Technical PRD from `bmad-prd` (§5) and feeds `lidr-validate-requirements` (RTM coverage + gap detection).

## Output Location

Generated requirements are saved as **one file per NFR** under the per-client requirements directory — this is the exact path Gate 2 reads (`gate-evidence.yaml` G2 `lidr-generate-nfr` glob `{client_root}/requirements/NFR-*.md`):

**`docs/projects/{CLIENT_CODE}/requirements/NFR-{PROJ}-{CAT}-{NNN}.md`** (one file per NFR)

`{CLIENT_CODE}` is the active client (see `rules/lidr-sdlc/project.md`). RFs and NFRs share the `requirements/` directory so `lidr-validate-requirements` can build the RTM from a single location. The NFR Summary Matrix is written alongside as **`docs/projects/{CLIENT_CODE}/requirements/nfr-summary-matrix.md`**.

Examples:

- `docs/projects/docline/requirements/NFR-API-PERF-001.md`
- `docs/projects/docline/requirements/NFR-FIN-SEC-002.md`
- `docs/projects/docline/requirements/nfr-summary-matrix.md`

> **Gate 2 contract**: the gate's optional NFR evidence is the presence of `requirements/NFR-*.md` files with measurable content. Do NOT write to a separate `nfrs/` directory — keep NFRs in `requirements/` so the gate glob and RTM resolve correctly.

## Workflow

1. Read PRD-T §5 (high-level NFRs) — source of categories and initial targets
2. Read PRD-F §2.5 (success metrics) — business-driven quality targets
3. Read `rules/tech-stack.md` — infrastructure constraints and capabilities
4. Read `rules/org.md` §1.3 — data criticality rules (sensitive data, compliance)
5. **Domain Analysis**: Identify specific workflows and data flows that drive quality constraints
6. **Regulatory Mapping**: Map business requirements to specific compliance mandates (GDPR, HIPAA, PCI-DSS, etc.)
7. Generate NFRs per category using template `templates/nfr-format.md`
8. **Performance Modeling**: Calculate expected throughput for critical operations under peak load
9. **Security Assessment**: Define encryption, access control, and audit requirements for sensitive data
10. Cross-reference each NFR with applicable RFs (which RFs does this NFR constrain?)
11. Generate NFR Summary Matrix for validate-requirements skill
12. Ready for validation with skill `validate-requirements`

### Domain-Specific Workflow Steps

When generating NFRs, **always include**:

- **Performance baselines**: Current system measurements or industry benchmarks
- **Regulatory compliance**: Identify applicable regulations (GDPR, HIPAA, PCI-DSS, SOC2) and map to NFRs
- **Security boundaries**: Encryption requirements, access control, and audit logging for sensitive data
- **Scalability projections**: Peak traffic analysis for critical system operations
- **Data sensitivity**: Retention periods, deletion SLAs, and cross-border data requirements

> **Domain-specific examples**: For domain-specific NFR patterns (accuracy thresholds, authenticity detection, data template security), see `examples/domain-example.md`.

## Input

| Input                     | Required     | Source                            |
| ------------------------- | ------------ | --------------------------------- |
| Technical PRD (approved)  | ✅           | skill `bmad-prd/` §5              |
| Functional PRD (approved) | ✅           | skill `bmad-prd/` §2.5            |
| Risk Log                  | Desirable    | skill `risk-log/`                 |
| Current architecture docs | Desirable    | skill `bmad-create-architecture/` |
| Existing SLAs / OLAs      | If available | Operations / DevOps               |
| NFR Compliance Checklist  | ✅           | `@checklists/nfr-compliance.md`   |

## NFR Categories

### Mandatory Categories (always generate)

| Category         | Key Metrics                                | Generic Standards                                                                                      |
| ---------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| **Performance**  | P95 latency, throughput, concurrency       | Critical APIs <500ms P95, batch operations <2s, background jobs within SLA window                      |
| **Security**     | Auth, encryption, OWASP, compliance        | Data encrypted at rest (AES-256) and in transit (TLS 1.3+), zero PII in logs, RBAC enforced            |
| **Scalability**  | Max users, growth projection, auto-scaling | Horizontal scaling for peak traffic, queue-based load leveling for spikes                              |
| **Availability** | Uptime SLA, RTO, RPO, failover             | 99.9%–99.99% depending on criticality, <30s failover, cross-region redundancy for critical paths       |
| **Compliance**   | Regulatory, audit, data retention          | Applicable regulations (GDPR, HIPAA, PCI-DSS, SOC2), audit trail, data retention and deletion policies |

### Conditional Categories (generate if applicable)

| Category             | When to Include                       | Key Metrics                                                                                     |
| -------------------- | ------------------------------------- | ----------------------------------------------------------------------------------------------- |
| **Accessibility**    | User-facing UI                        | WCAG 2.1 AA compliance, screen reader support, keyboard navigation, color contrast ≥4.5:1       |
| **Observability**    | Production systems                    | Error rate alerting, latency dashboards, anomaly detection, SLO burn rate alerts                |
| **Interoperability** | Multi-vendor or API-first systems     | OpenAPI 3.1 compliance, standard data formats (JSON:API, GraphQL), versioning policy            |
| **Maintainability**  | Long-lived or complex systems         | Cyclomatic complexity limits, test coverage minimums, dependency update cadence                 |
| **Portability**      | Multi-cloud or on-premise deployments | Container-based deployment (Docker/K8s), cloud-agnostic storage interfaces, data export formats |
| **Accuracy**         | ML/AI-powered systems                 | Precision/recall targets, false positive/negative rate, bias testing across demographic groups  |

## Output Template — Per NFR

```markdown
# NFR-{PROJ}-{CAT}-{NNN}: {Title}

| Field           | Value                                                                                            |
| --------------- | ------------------------------------------------------------------------------------------------ |
| **ID**          | NFR-{PROJ}-{CAT}-{NNN}                                                                           |
| **Category**    | Performance / Security / Scalability / Availability / Compliance / Accessibility / Observability |
| **Version**     | 1.0                                                                                              |
| **Status**      | Draft / In Review / Approved                                                                     |
| **Priority**    | Must / Should / Could                                                                            |
| **Criticality** | Blocking / High / Medium / Low                                                                   |

## Traceability

| Reference         | Value                            |
| ----------------- | -------------------------------- |
| **PRD-T source**  | PRD-T §5.X                       |
| **PRD-F metrics** | PRD-F §2.5                       |
| **Affected RFs**  | RF-{PROJ}-{NNN}, RF-{PROJ}-{NNN} |
| **Related risks** | RISK-{NNN} (from risk-log)       |

## Definition

{What is required — 1-2 clear, unambiguous sentences}

## Metric and Threshold

| Metric        | Current Value (baseline) | Target   | Maximum Acceptable | Measurement Method |
| ------------- | ------------------------ | -------- | ------------------ | ------------------ |
| {metric name} | {current}                | {target} | {max acceptable}   | {how to measure}   |

## Validation Scenarios

### Normal Scenario (expected load)

- Conditions: {load profile}
- Expected result: {meets target}

### Stress Scenario (peak load)

- Conditions: {peak profile}
- Expected result: {degradation acceptable within max}

### Failure Scenario (failure mode)

- Conditions: {failure scenario}
- Expected result: {graceful degradation / failover}

## Architecture Implications

{Which architectural decisions this NFR requires — caching, CDN, DB tuning, etc.}

## Dependencies

| Type           | Resource              | Status               |
| -------------- | --------------------- | -------------------- |
| Infrastructure | {e.g., Redis cluster} | Available / Pending  |
| Third parties  | {e.g., CDN provider}  | Contracted / Pending |
| Team           | {e.g., DevOps config} | Assigned / Pending   |
```

## Output — NFR Summary Matrix

After all individual NFRs, generate:

```markdown
# NFR Summary Matrix: {PROJECT}

## By Category

| Category    | # NFRs | Must | Should | Could | Blocking |
| ----------- | ------ | ---- | ------ | ----- | -------- |
| Performance | N      | N    | N      | N     | N        |
| Security    | N      | N    | N      | N     | N        |
| ...         |        |      |        |       |          |

## NFR → RF Map

| NFR ID          | Affected RFs         | Impact                    |
| --------------- | -------------------- | ------------------------- |
| NFR-XX-PERF-001 | RF-XX-001, RF-XX-005 | Latency constraint on API |
| NFR-XX-SEC-001  | ALL                  | Encryption mandatory      |

## Risks of Unmet NFRs

| NFR ID | Consequence if unmet | Mitigation |
| ------ | -------------------- | ---------- |
|        |                      |            |
```

## Key Rules

- **NFRs are MEASURABLE**: "Good performance" is NEVER acceptable. Always: metric + threshold + method.
- **NFRs affect architecture**: Each NFR should state its architectural implications.
- **NFRs are testable**: QA must be able to verify each NFR with the defined method.
- **Compliance NFRs are MANDATORY**: Any system handling sensitive data MUST have compliance NFRs (GDPR, HIPAA, PCI-DSS as applicable).
- **One NFR = One measurable quality**: If it has multiple metrics, consider splitting.
- **NFRs complement RFs**: RFs say WHAT the system does; NFRs say HOW WELL it does it.

## Domain NFR Examples

### Example 1: High-Traffic API — Response Time (Performance)

```markdown
NFR-API-PERF-001: Search API Response Time

Metric: End-to-end search query latency (request to response)

- Baseline: 750ms (current system under normal load)
- Target: <200ms P95
- Max Acceptable: <500ms P95
- Method: k6 load testing with 5,000 concurrent users
- Validation: 95th percentile under 200ms sustained for 1 hour during peak simulation
```

### Example 2: Fintech Platform — Data Encryption (Security)

```markdown
NFR-FIN-SEC-002: Payment Data Encryption Standards

Metric: Customer payment data protection level

- Target: AES-256-GCM encryption at rest + TLS 1.3 in transit
- Max Acceptable: No unencrypted PII or card data at any layer
- Method: Security audit + penetration testing + automated secret scanning
- Validation: 100% payment records encrypted; HSM key rotation every 90 days; PCI-DSS Level 1 audit pass
```

### Example 3: Healthcare System — Availability SLA

```markdown
NFR-HEALTH-AVAIL-001: Patient Record Access Availability

Metric: System uptime for patient-facing portal and clinical APIs

- Baseline: 99.5% (last 12 months)
- Target: 99.9% uptime (≤8.7h downtime/year)
- Max Acceptable: 99.7% (≤26h downtime/year)
- Method: Synthetic monitoring every 60 seconds from 3 regions; automated failover testing quarterly
- Validation: Monthly SLO report; P1 incidents trigger RCA within 48h
```

### Example 4: SaaS Platform — Concurrent User Capacity (Scalability)

```markdown
NFR-SAAS-SCAL-001: Peak Concurrent Session Handling

Metric: Concurrent active user sessions without degradation

- Baseline: 1,200 concurrent sessions (current production peak)
- Target: 10,000+ concurrent sessions
- Max Acceptable: <3s P95 response degradation under peak load
- Method: Locust/k6 load test simulating realistic user journeys (login → search → checkout)
- Validation: Quarterly load test; auto-scaling triggers validated before each major release
```

### Example 5: GDPR-Compliant System — Data Deletion SLA (Compliance)

```markdown
NFR-COMP-001: Data Subject Deletion Request SLA

Metric: Time to complete personal data deletion across all systems

- Target: <24 hours for complete PII removal from all live databases and caches
- Max Acceptable: <72 hours (GDPR Article 17 requirement)
- Method: Automated deletion workflow integration test covering all data stores
- Validation: End-to-end deletion audit trail; monthly drill with synthetic data; right-to-erasure compliance report
```

## Industry Benchmarks by System Type

### High-Traffic APIs and Web Applications

- **Response time**: <200ms P95 for read APIs, <500ms P95 for write APIs
- **Availability**: 99.9% for standard SaaS, 99.95%+ for business-critical platforms
- **Error rate**: <0.1% 5xx errors under normal load

### Fintech and Payment Platforms

- **Transaction latency**: <300ms P95 for payment authorization
- **Security**: PCI-DSS Level 1 compliance, TLS 1.3 minimum, HSM for key management
- **Availability**: 99.95%+ with <15 min RTO, <1 min RPO for core transaction flows

### Healthcare Systems

- **Availability**: 99.9% for patient portals, 99.99% for critical clinical systems
- **Compliance**: HIPAA audit log retention ≥6 years, BAA required for all data processors
- **Access control**: RBAC enforced at field level for PHI, MFA required for clinical staff

### General SaaS Platforms

- **Onboarding**: Account creation <5s, email confirmation <30s
- **Data export**: User data export <24h (GDPR Article 20)
- **Scalability**: Auto-scaling activates within 60s of threshold breach

> **Domain-specific examples**: For domain-specific NFR patterns (accuracy thresholds, authenticity detection accuracy, data template encryption, regulatory compliance), see `examples/domain-example.md`.

## Validation Checklist

Validate each NFR against `@checklists/nfr-compliance.md` before marking as complete.

Per NFR:

- [ ] Has measurable metric with specific threshold (not vague)
- [ ] Has validation method (how to test)
- [ ] Maps to at least one RF or is system-wide
- [ ] Architectural implications documented
- [ ] For Security/Compliance: references specific regulation (GDPR article, OWASP item, PCI requirement)
- [ ] For Performance: has baseline, target, AND maximum acceptable
- [ ] Criticality assigned (Blocking = cannot deploy without meeting this)
- [ ] For ML/AI systems: includes accuracy metric and test methodology when applicable
- [ ] For systems handling personal data: includes explicit data handling and retention requirements

## Domain-Specific NFR Validation Checklist

Additional validation by system type — select the checklist(s) applicable to your domain:

**For data-sensitive systems (any domain with PII/regulated data)**:

- [ ] **Encryption NFRs**: At-rest and in-transit encryption standards specified
- [ ] **Retention NFRs**: Data retention periods and automated deletion SLAs defined
- [ ] **Access Control NFRs**: RBAC/ABAC model and enforcement points documented
- [ ] **Compliance NFRs**: Applicable regulation cited (GDPR, HIPAA, PCI-DSS, SOC2)
- [ ] **Cross-Border**: Data residency requirements for international deployments

**For high-traffic platforms (APIs, e-commerce, SaaS)**:

- [ ] **Scalability NFRs**: Peak load capacity defined with auto-scaling triggers
- [ ] **Performance NFRs**: P95/P99 latency targets under realistic concurrent load
- [ ] **Availability NFRs**: SLA uptime, RTO, and RPO explicitly stated

**For ML/AI-powered systems**:

- [ ] **Accuracy NFRs**: Precision/recall or equivalent thresholds with test methodology
- [ ] **Bias Testing**: Demographic or data distribution fairness requirements
- [ ] **Drift Monitoring**: Model performance degradation alerting thresholds

> **Domain-specific checklist**: For authenticity detection, accuracy thresholds, data template security, and domain-specific compliance validation, see `examples/domain-example.md`.

## Generated Artifacts

After execution, this skill produces:

1. **Individual NFRs**: `docs/projects/{CLIENT_CODE}/requirements/NFR-{PROJ}-{CAT}-{NNN}.md` (one file per NFR — matches G2 gate-evidence glob)
2. **NFR Summary Matrix**: `docs/projects/{CLIENT_CODE}/requirements/nfr-summary-matrix.md` — cross-reference with RFs and risk assessment
3. **Architecture Impact Report**: Infrastructure and design implications
4. **Compliance Mapping**: Regulatory requirements to technical implementation

Ready for validation with `/validate-requirements` command.

## Quality Assurance

### Validation Script

This skill includes automated validation via `scripts/validate-examples.ts`:

```bash
# Validate skill examples and structure
npx tsx scripts/validate-examples.ts
```

**Validation includes:**

- Example completeness and correctness
- Non-functional requirements compliance patterns
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

| Version | Date       | Author                                | Changes                                                                                                                                                                                                                                                                    |
| ------- | ---------- | ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2.7.0   | 2026-06-10 | TL: Gate-evidence contract fix        | Added "## Output Location": NFRs now emit to `docs/projects/{CLIENT_CODE}/requirements/NFR-*.md` (matching G2 gate-evidence glob) instead of `nfrs/`; summary matrix to `requirements/nfr-summary-matrix.md`                                                               |
| 2.6.0   | 2026-06-09 | TL: BMad-coherence batch-fix          | Added "Relationship to BMad" note (LIDR-unique NFR authoring; consumes bmad-prd, audited by bmad-testarch-nfr, feeds lidr-validate-requirements)                                                                                                                           |
| 2.5.0   | 2026-06-09 | TL: lang+tool agnostic                | Language to English-default-configurable; abstracted tools via tool-registry                                                                                                                                                                                               |
| 2.4.0   | 2026-03-25 | TL: domain-agnostic-fix               | Removed remaining domain-specific terminology from active instruction cross-references; changelog entries neutralized                                                                                                                                                      |
| 2.3.0   | 2026-03-25 | TL: tier3-remediation                 | Domain-agnostic migration: replaced domain-specific categories with high-traffic API/fintech/healthcare examples; moved domain-specific content to examples/domain-example.md; replaced domain-specific validation checklist with Domain-Specific NFR Validation Checklist |
| 2.2.0   | 2026-03-16 | System: Quality Assurance Integration | Quality assurance integration                                                                                                                                                                                                                                              |
| 2.1.0   | 2026-03-09 | System: Improvement                   | Added domain-specific NFR examples and accuracy benchmarks                                                                                                                                                                                                                 |
| 2.0.0   | 2026-02-15 | TL: García                            | Added NFR Summary Matrix and architectural implications                                                                                                                                                                                                                    |
| 1.0.0   | 2026-01-20 | TL: García                            | Initial version of the skill                                                                                                                                                                                                                                               |
