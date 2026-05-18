---
name: lidr-poc-report
id: poc-report
version: "1.3.0"
last_updated: "2026-03-25"
updated_by: "TL: tier3-remediation"
status: active
phase: 2
owner_role: "TL"
automation: false
domain_agnostic: true
description: "Essential for technical feasibility validation before committing resources. Always use after technical uncertainty is identified in PRD-T. Critical for performance validation, platform migrations, integration feasibility, and technology evaluation. Structure PoC reports with falsifiable hypothesis, measurable success criteria, evidence-based results, and clear GO/NO-GO recommendation. Triggers on 'structure PoC report', 'PoC results', 'proof of concept', 'technical validation', 'spike report', 'feasibility test', 'performance benchmark', 'technology evaluation'. Output in English (technical) + Spanish (executive summary). Domain-specific examples available in examples/domain-example.md."
---

# PoC Report Structurer

**Essential for technical feasibility validation before committing resources to uncertain solutions.**

Phase: 2 — Discovery (or any phase with technical uncertainty) | Language: English + Spanish (executive)

> **When to use**: Always when PRD-T identifies technical uncertainty marked as `[REQUIRES PoC]`, before implementing unproven integrations or algorithms, when evaluating platform performance, or choosing between technical alternatives with measurable data. Critical for any project's technical validation pipeline.

## Workflow

1. **Trigger identification**: Read technical uncertainty from PRD-T §8 (marked as `[REQUIRES PoC]`) or identified during technical review
2. **Hypothesis formulation**: Help Tech Lead formulate falsifiable hypothesis with measurable performance criteria (latency, accuracy, throughput, error rates)
3. **Success criteria definition**: Define numeric thresholds aligned with project quality standards and technical requirements
4. **Test environment setup**: Document controlled conditions, test data sets, and measurement tools
5. **Evidence collection**: Structure quantitative results with performance benchmarks, comparison matrices, and statistical analysis
6. **GO/NO-GO decision**: Generate recommendation based on evidence, considering technical feasibility, compliance requirements, and business impact
7. **PRD-T update**: If GO, incorporate findings into PRD-T §8 with updated technical specifications and architecture implications
8. **Risk documentation**: If NO-GO, document in risk log with alternative approaches for future consideration

## Hypothesis Quality

### Bad Examples

❌ "Test if the integration with X works"
❌ "Verify if the new algorithm is better"
❌ "Check mobile performance"

### Good Examples (Generic Software Contexts)

✅ **Streaming Media Transcription**: "The AWS Transcribe streaming API achieves ≥95% word accuracy for English speech at 16kHz sample rate, with end-to-end latency <800ms P95 for real-time subtitle generation"

✅ **Real-Time Fraud Detection**: "The ML fraud scoring model classifies transactions in <50ms P99 with ≤0.1% false positive rate and ≥92% recall on the validation dataset representing 6 months of production traffic"

✅ **IoT Device Integration**: "The MQTT broker handles 10K concurrent device connections with message delivery latency <200ms P95 and 99.9% uptime under continuous load testing"

✅ **Database Migration Performance**: "The PostgreSQL→Aurora migration maintains query P95 response time within 15% of baseline for the top-20 queries, with zero data loss verified by row-count + checksum comparison"

> For domain-specific hypothesis examples (e.g., identity verification, authentication systems), see: `examples/domain-example.md`

### Hypothesis Formula

A good hypothesis has: **Subject** (what) + **Conditions** (context) + **Metric** (threshold) + **Timeframe** (if applicable)

## Input

| Input                              | Required      | Source                                                                           |
| ---------------------------------- | ------------- | -------------------------------------------------------------------------------- |
| Hypothesis to validate             | ✅            | PRD-T §8 / technical session                                                     |
| Success criteria (numeric)         | ✅            | TL + PO (performance targets, error rate thresholds, latency SLAs)               |
| PoC constraints (time, budget)     | ✅            | PM / TL (typically 1-2 sprints for complex validations, 1 week for integrations) |
| Technical context                  | ✅            | PRD-T (stack, architecture, existing system constraints)                         |
| Test data / environment            | ✅            | QA / TL (synthetic data, production samples, load testing scenarios)             |
| Baseline metrics                   | If available  | TL / Ops (current system performance for comparison)                             |
| Compliance/regulatory requirements | If applicable | Security / Legal (GDPR, industry standards affecting data processing)            |

## Output Template

```markdown
# PoC Report: {Title}

## Metadata

| Field          | Value                         |
| -------------- | ----------------------------- |
| **ID**         | PoC-{YYYY}-{NNN}              |
| **Hypothesis** | [falsifiable hypothesis]      |
| **Duration**   | [start — end]                 |
| **Engineer**   | [who executed]                |
| **Status**     | GO ✅ / NO-GO ❌ / PARTIAL ⚠️ |

## Executive Summary (Spanish — for PO/Sponsor)

[1 paragraph: what was tested, result, recommendation, impact on project]

## Hypothesis & Success Criteria

| Criteria   | Threshold (GO) | Threshold (NO-GO) | Actual Result    | Verdict |
| ---------- | -------------- | ----------------- | ---------------- | ------- |
| [metric 1] | [≥ X]          | [< Y]             | [measured value] | ✅/❌   |
| [metric 2] | [≤ X]          | [> Y]             | [measured value] | ✅/❌   |

## Methodology

### Setup (environment, tools, configuration)

### Test Protocol (steps executed, data used)

### Limitations (what the PoC did NOT test)

## Results — Evidence

### Data (tables, charts, benchmarks)

### Screenshots / Recordings

### Code / Configuration (minimal reproducible setup)

## Analysis

### What Worked

### What Didn't

### Unexpected Findings

## Recommendation

**Decision: [GO / NO-GO / CONDITIONAL GO]**

- If GO: [update PRD-T with these findings, proceed to implementation]
- If NO-GO: [alternative approach OR reduce scope]
- If CONDITIONAL: [conditions that must be met]

## Impact on Project

- Timeline impact: [none / +X sprints]
- Scope impact: [none / reduced to...]
- Architecture impact: [none / ADR needed for...]
```

## Domain PoC Scenarios

### Typical Software Technology Validations

#### 1. Streaming Media Transcription PoC

**Trigger**: Evaluating real-time speech-to-text for a live streaming or meeting platform.
**Common Hypotheses**:

- Cloud transcription API achieves ≥95% word accuracy for English, processing audio within 600ms of speech completion
- On-device ML model processes audio in <300ms with accuracy within 3% of cloud baseline, eliminating network dependency
- Batched transcription reduces API costs by ≥60% vs real-time without exceeding 5s latency for non-live content

#### 2. Real-Time Fraud Detection PoC

**Trigger**: Evaluating an ML model to replace rule-based fraud scoring in a payments platform.
**Common Hypotheses**:

- ML scoring model returns decision in <50ms P99 with ≤0.1% false positive rate and ≥92% recall on 6-month validation set
- Model drift detection alerts within 2 hours of population shift, maintaining accuracy within 5% of baseline
- A/B test at 10% traffic shows ≥15% fraud reduction without increasing false positive rate above 0.2%

#### 3. IoT Device Integration PoC

**Trigger**: Evaluating MQTT vs HTTP for 10K+ concurrent IoT device connections.
**Common Hypotheses**:

- MQTT broker sustains 10K concurrent connections with message delivery latency <200ms P95 and <0.01% message loss
- Device firmware OTA update via MQTT delivers 500KB payload to 1K devices within 10 minutes with 99.5% success rate
- Auto-reconnect with exponential backoff recovers 95% of disconnected devices within 30 seconds of network restoration

#### 4. Platform Migration Performance PoC

**Trigger**: Cloud migration, infrastructure re-architecture, or database technology change.
**Common Hypotheses**:

- Aurora PostgreSQL maintains query P95 response time within 15% of baseline RDS for top-20 production queries
- Kubernetes auto-scaling responds to 10x load spike within 90 seconds, maintaining P99 response time <2s
- Zero-downtime migration with blue-green deployment switches 100% traffic with <100ms additional latency during cutover

#### 5. Third-Party API Integration PoC

**Trigger**: Evaluating a new vendor API before committing to integration development.
**Common Hypotheses**:

- Shipping carrier API processes batch of 1K rate quotes in <30s with 99.9% uptime measured over 30-day test period
- Payment processor webhook delivery achieves <2s P95 with automatic retry delivering 99.99% of events within 5 minutes
- Maps API geocoding resolves ≥98% of address inputs for the target market within 500ms with acceptable cost per request

## Key Rules for Technical Validation

- **Falsifiable hypothesis**: If it can't fail, it's not a PoC — it's a demo. Define explicit NO-GO criteria with measurable performance thresholds.
- **Numeric thresholds**: "Works well" is not a success criterion. "Latency <200ms P95, error rate <0.1%, throughput ≥1K req/s" IS. Use concrete, measurable metrics.
- **Evidence, not opinions**: Results need quantitative data (performance benchmarks, error rate calculations, comparison matrices), not "it seemed fast."
- **Regulatory context**: Consider compliance requirements relevant to your domain when defining success criteria (GDPR, HIPAA, PCI-DSS, etc.).
- **Real-world conditions**: Test with realistic data volumes, load patterns, and failure scenarios relevant to production deployment.
- **Time-boxed**: PoC has maximum duration (typically 1-2 sprints for complex validations, 1 week for integrations). If inconclusive by deadline, that is the result — document it.
- **Minimal scope**: PoC validates ONE hypothesis. Don't scope-creep performance AND security AND compatibility simultaneously.
- **Security implications**: Document any security findings and potential vulnerabilities discovered during testing.
- **Impact documented**: Regardless of GO/NO-GO, document impact on system architecture, compliance requirements, and user experience.

> For domain-specific PoC scenarios (e.g., identity verification, authentication systems), see: `examples/domain-example.md`

---

## Quality Assurance

### Validation Script

This skill includes automated validation via `scripts/validate-examples.ts`:

```bash
# Validate skill examples and structure
npx tsx scripts/validate-examples.ts
```

**Validation includes:**

- Example completeness and correctness
- PoC validation compliance patterns
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

| Versión | Fecha      | Autor                   | Cambios                                                                                                                                                                                                                          |
| ------- | ---------- | ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1.4.0   | 2026-03-25 | TL: domain-agnostic-fix | Removed remaining domain-specific terminology from active instruction sections; cross-references now use domain-agnostic language                                                                                                |
| 1.3.0   | 2026-03-25 | TL: tier3-remediation   | Domain-agnostic remediation: replaced domain-specific PoC scenarios with generic tech scenarios (streaming, fraud detection, IoT, migration, API), moved domain content to examples/domain-example.md, set domain_agnostic: true |
| 1.2.0   | 2026-03-16 | R&D Lead: Sistema       | Added Quality Assurance section with domain-specific PoC validation patterns                                                                                                                                                     |
| 1.1.0   | 2026-03-09 | TL: Sistema             | Enhanced with domain-specific examples, improved hypothesis quality section, added domain-specific metrics, regulatory context, and realistic PoC scenarios for algorithm validation                                             |
| 1.0.0   | 2025-02-01 | TL: García              | Versión inicial con template básico de PoC                                                                                                                                                                                       |
