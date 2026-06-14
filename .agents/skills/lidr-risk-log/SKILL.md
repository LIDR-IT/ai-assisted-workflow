---
name: lidr-risk-log
id: risk-log
version: "1.2.1"
last_updated: "2026-06-09"
updated_by: "TL: BMad-coherence batch-fix"
status: active
phase: 2
stage: planning
owner_role: "TL"
automation: false
domain_agnostic: true
language_default: en
integrations: []
description: "Essential for software project risk management - ALWAYS use during Discovery and maintain throughout project lifecycle. CRITICAL for identifying project risks including compliance failures, third-party dependency issues, integration risks, data migration challenges, and regulatory changes. Use when building web applications, SaaS platforms, mobile apps, APIs, or data processing systems. Essential for e-commerce, healthcare, fintech, IoT, and enterprise software projects. Suggests industry-specific risk patterns and mitigation strategies. Domain-specific examples available in the examples/ directory."
---

# Risk Log Manager

Phase: 2 — Discovery (creation) → all phases (maintenance) | Language: English by default; artifact language follows the client `language` setting (see `_shared/lidr/integrations/`)

Tools resolve via the central registry `_shared/lidr/integrations/tool-registry.yaml`; the active client binds concrete tools in `clients/<CODE>.yaml`.

## Relationship to BMad

LIDR-unique: BMad has no formal risk-registry artifact. This skill consumes the risk-relevant sections of the unified PRD (prd.md §8 Open Questions, §9 Assumptions Index, Risk & Mitigations Adapt-In) plus `lidr-business-case` §6, and produces a living risk log that feeds Gate 1 evidence and is maintained across all phases.

## Workflow

1. **Read Business Case** §6 (initial project risks)
2. **Read prd.md** §8/§9 + Risk & Mitigations (Adapt-In)
3. **Analyze project-specific risk patterns**:
   - Third-party API integration failures and vendor dependency risks
   - Data migration complexity and data integrity risks
   - Compliance and regulatory requirements for the project domain
   - Performance and scalability under production load
4. **Review industry-specific risks** by vertical (e-commerce, SaaS, fintech, healthcare, IoT)
5. **Classify risks** using Probability × Impact matrix
6. **Assign risk owners** (Security, QA, Compliance, TL) and mitigation strategies
7. **Generate living risk log** with monitoring triggers per risk
8. **Schedule reviews** aligned with Gate evaluations and sprint ceremonies

## Input

| Input                                        | Required     | Source                                  |
| -------------------------------------------- | ------------ | --------------------------------------- |
| Business Case §6 (risks)                     | ✅           | skill `business-case/`                  |
| prd.md §8/§9 + Risk & Mitigations (Adapt-In) | ✅           | skill `bmad-prd/`                       |
| Tech stack                                   | Desirable    | `rules/tech-stack.md`                   |
| Project type                                 | Desirable    | BC (new product, migration, regulatory) |
| Historical risks from past projects          | If available | PME / retros                            |

## Output Location

Generated documents should be saved to: **`docs/projects/{projectName}/risk-log.md`**

Contains comprehensive software project risk log with industry-specific patterns and mitigation strategies.

Example: `docs/projects/identity-sdk-v3/risk-log.md`

## Risk Categories

| Category            | Generic Examples                                                                                                             |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| **Technical**       | Third-party API breaking changes, data migration failure, algorithm/model accuracy degradation, API latency SLA breach       |
| **Compliance**      | Data privacy regulation violation (GDPR, CCPA, HIPAA), industry-specific non-compliance, cross-border data transfer blocking |
| **Security**        | Sensitive data exposure, injection vulnerabilities, man-in-the-middle attacks, credential compromise                         |
| **Integration**     | External service unavailability, SDK/library compatibility breaks, webhook delivery failures, schema drift                   |
| **Operational**     | Vendor pricing/license changes, cloud region unavailability, key dependency deprecation                                      |
| **Regulatory**      | New privacy laws, data classification changes, audit findings requiring immediate remediation                                |
| **User Experience** | Accessibility compliance failure, mobile device incompatibility, performance degradation under load                          |
| **Business**        | User adoption rates below threshold, competitive feature gap, key stakeholder departure                                      |

> For domain-specific examples, see: `examples/` directory.

## Output Template

```markdown
---
id: {project-name}-risk-log
version: "1.0.0"
last_updated: "YYYY-MM-DD"            # date of generation
updated_by: "PME: {Name}"             # PME/TL generates and maintains risk logs
status: active
type: project
review_cycle: 60                      # days between reviews (project documentation)
next_review: "YYYY-MM-DD"             # calculated: last_updated + review_cycle
owner_role: "PME"                     # PME maintains risk logs
---

# Risk Log: [PROJECT NAME]

| Field            | Value                      |
| ---------------- | -------------------------- |
| **Project**      | [Name]                     |
| **Created**      | [YYYY-MM-DD]               |
| **Last updated** | [YYYY-MM-DD]               |
| **Next review**  | [Gate N / Sprint N Review] |

## Summary

| Status                    | Count |
| ------------------------- | ----- |
| 🔴 Active — Critical/High | {N}   |
| 🟡 Active — Medium        | {N}   |
| 🟢 Active — Low           | {N}   |
| ⚫ Closed / Mitigated     | {N}   |
| 🔵 Materialized           | {N}   |

## Risk Register

| ID    | Risk          | Category  | Prob  | Impact | Score | Owner  | Mitigation | Status | Updated |
| ----- | ------------- | --------- | ----- | ------ | ----- | ------ | ---------- | ------ | ------- |
| R-001 | [description] | Technical | H/M/L | H/M/L  | [PxI] | [name] | [strategy] | Active | [date]  |

## Probability × Impact Matrix
```

         HIGH IMPACT
              │

MEDIUM │ CRITICAL
(monitor) │ (active mitigation)
│
─────────────┼───────────────
│
LOW │ MEDIUM
(accept) │ (contingency plan)
│
LOW IMPACT
HIGH PROB ←──→ LOW PROB

```

## Risk History (materialized risks)
| Risk | When | Actual Impact | Response | Lessons |
|------|------|--------------|----------|---------|

## Next Review
[Date + context: which Gate or ceremony]
```

## Key Rules

- **Living risk tracking**: Update at every Sprint Review, after audit findings, and when regulatory changes occur
- **Data privacy risks are always High Impact**: Any personal data exposure is critical regardless of probability
- **Technical risks need metrics**: Define degradation thresholds, not just "performance drops"
- **Security risks include attack vectors**: Document specific attack types, not just "security issue"
- **Compliance risks track regulatory changes**: Monitor relevant regulatory updates continuously
- **Vendor risks include specifics**: License changes, API versioning, deprecation timelines
- **Performance risks have SLA context**: Specify uptime targets (99.95% enterprise vs. 99.5% consumer)

## Generic Risk Examples

### E-Commerce Platform — Payment Gateway Integration

**R-001: Third-Party Payment API Breaking Change** (🔴 Critical)

- **Probability**: Medium — Payment provider has quarterly breaking change cadence
- **Impact**: Critical — Complete checkout failure, revenue loss
- **Owner**: Backend TL + DevOps
- **Mitigation**: API versioning strategy + canary release + automated contract tests

**R-002: Data Migration Integrity Failure** (🟡 Medium)

- **Probability**: Low — Migration script has been tested in staging
- **Impact**: High — Historical order data inconsistency, customer complaints
- **Owner**: TL + QA Lead
- **Mitigation**: Dry-run validation + checksums + rollback plan + parallel run period

**R-003: GDPR Compliance Gap in User Data Export** (🔴 Critical)

- **Probability**: High — Feature not yet implemented
- **Impact**: Critical — Regulatory fine + reputational damage
- **Owner**: PO + Legal + Dev
- **Mitigation**: DPIA + legal review + data portability implementation before launch

**R-004: Mobile Performance on Low-End Devices** (🟢 Low)

- **Probability**: High — Target market includes emerging markets
- **Impact**: Low — Degraded experience on <2GB RAM devices
- **Owner**: Frontend Dev + QA
- **Mitigation**: Device testing matrix + progressive enhancement + performance budgets

> For domain-specific examples, see: `examples/` directory.

## Quality Assurance

### Validation Script

This skill includes automated validation via `scripts/validate-examples.ts`:

```bash
# Validate skill examples and structure
npx tsx scripts/validate-examples.ts
```

**Validation includes:**

- Example completeness and correctness
- Risk management compliance patterns
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

| Version | Date       | Author                       | Changes                                                                                                  |
| ------- | ---------- | ---------------------------- | -------------------------------------------------------------------------------------------------------- |
| 1.2.1   | 2026-06-09 | TL: BMad-coherence batch-fix | Added "Relationship to BMad" note (LIDR-unique; consumes bmad-prd risk sections + business-case)         |
| 1.2.0   | 2026-06-09 | TL: lang+tool agnostic       | Language to English-default-configurable; added registry-resolution note (no concrete tools to abstract) |
