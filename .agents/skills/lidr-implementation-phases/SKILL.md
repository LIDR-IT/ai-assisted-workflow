---
name: lidr-implementation-phases
id: implementation-phases
version: "2.2.0"
last_updated: "2026-03-16"
updated_by: "Tech Lead: System"
status: active
phase: 0
owner_role: "TL"
automation: false
domain_agnostic: true
description: >
  Decompose a project or epic into incremental implementation phases with clear milestones, dependencies, risk checkpoints, and team assignments.
  Domain-agnostic — works for any software project, migration, or platform launch.
  Use for large projects requiring phased delivery, risk-gated rollouts, or incremental value delivery.
  Essential when a single epic is too large to deliver in one sprint cycle and needs phased planning.
  Always use when planning multi-sprint implementations, always use when stakeholders need a phased roadmap before full commitment.
  Do NOT use for single-sprint features (use user-stories), for sprint capacity planning (use sprint-capacity), or for epic decomposition into sub-epics (use epic-breakdown).
  Triggers on "implementation phases", "phased delivery", "rollout plan", "incremental implementation", "implementation roadmap", "phase plan", "delivery phases".
  Output in Spanish (plan document) or English (per team conventions).
  Audience: Tech Lead (designs phases), PME (tracks milestones), Dev (implements per phase).
---

# Implementation Phases Planner

> **Essential for every complex software project** — Critical for breaking down large implementations into deliverable increments. **Always use when planning incremental delivery** of platforms, SDKs, migrations, or compliance initiatives. **Mandatory before Sprint Planning** to ensure phased rollouts minimize risk and maximize early value.

**Phase**: 3 — Post PRD + Epics, pre Sprint Planning | **Language**: Spanish

**Triggers**: "plan implementation phases", "decompose into phases", "project phasing", "release planning", "incremental delivery plan", "how to break down this project", "rollout phases", "SDK migration", "Platform delivery phases", "SDK integration phases"

## Workflow

1. Read Product Brief (timeline, milestones, constraints)
2. Read Epics (priority, estimation, dependencies)
3. Read Architecture (stack, complexity, risks)
4. Read team capacity (if available)
5. Evaluate which phasing strategy fits best
6. Generate phase plan with deliverables and go/no-go criteria
7. Fill template `@templates/phases.md`

## Phasing Strategies for software projects

| Strategy           | When to Use                             | Domain Example                                                                   | Real Scenario                                                                          |
| ------------------ | --------------------------------------- | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| **MVP First**      | New product, validate market fit        | Core feature + basic UI (validate market need)                                   | Launch minimal version to validate user acceptance before adding advanced capabilities |
| **Core-Out**       | Complex system, build incrementally     | Phase 1: core backend, Phase 2: primary features, Phase 3: advanced capabilities | Platform core algorithms first, then UI/UX layer, then compliance features             |
| **Layer-by-Layer** | Multiple independent functional modules | Phase 1: infrastructure, Phase 2: module A + module B in parallel                | Independent workstreams deployed simultaneously with shared infrastructure layer       |
| **Risk-First**     | High technical/regulatory uncertainty   | Phase 1: compliance PoC + legal validation, Phase 2: production implementation   | New market with unknown regulatory requirements - validate compliance approach first   |

## Input

| Input                                 | Required | Source                                       | Context                                      |
| ------------------------------------- | -------- | -------------------------------------------- | -------------------------------------------- |
| Product Brief (timeline, milestones)  | ✅       | PO / PM                                      | Business constraints and market windows      |
| Projects (priority, estimation, deps) | ✅       | Tracking tool / skill `tracking-integration` | Technical scope breakdown                    |
| Architecture (complexity, risks)      | ✅       | skill `prd-tecnico`                          | Technical constraints and integrations       |
| Team capacity                         | ✅       | skill `sprint-capacity`                      | Development velocity and resource allocation |
| Regulatory requirements               | ✅       | Discovery docs                               | GDPR, eIDAS, banking compliance constraints  |
| Phases template                       | ✅       | templates/phases.md                          | Output format structure                      |

## Output Template

```markdown
---
id: {project-name}-phases
version: "1.0.0"
last_updated: "YYYY-MM-DD"            # date of generation
updated_by: "TL: {Name}"              # Tech Lead generates implementation phases
status: active
type: project
review_cycle: 60                      # days between reviews (project documentation)
next_review: "YYYY-MM-DD"             # calculated: last_updated + review_cycle
owner_role: "TL"                      # Tech Lead maintains implementation phases
---

# Implementation Phases: [PROJECT]

## Strategy Selected: [MVP First / Core-Out / Layer-by-Layer / Risk-First]

### Justification: [why this strategy fits]

## Phase Overview

| Phase | Name   | Duration    | Epics          | Deliverable        | Go/No-Go   |
| ----- | ------ | ----------- | -------------- | ------------------ | ---------- |
| 1     | [name] | [X sprints] | [E-001, E-002] | [what's delivered] | [criteria] |
| 2     | [name] | [X sprints] | [E-003]        | [what's delivered] | [criteria] |

## Phase Details

### Phase {N}: {Name}

| Field            | Value                                      |
| ---------------- | ------------------------------------------ |
| **Duration**     | Sprint {X} — Sprint {Y}                    |
| **Goal**         | [what this phase achieves]                 |
| **Epics**        | [list with priorities]                     |
| **Dependencies** | [what must be done before / external deps] |
| **Team**         | [who's needed]                             |
| **Risks**        | [phase-specific risks]                     |

**Deliverables:**

- [ ] [Deliverable 1 — concrete, verifiable]
- [ ] [Deliverable 2]

**Go/No-Go Criteria:**

- [ ] [Criterion 1 — measurable]
- [ ] [Criterion 2]

## Dependency Map (between phases)

## Timeline (visual: phases on timeline with milestones)

## Risk Mitigation per Phase
```

## Key Rules for Project Phasing

- **Each phase delivers user value**: No "infrastructure only" phases without user-visible functionality (unless Risk-First regulatory strategy)
- **Go/No-Go is measurable**: "Phase complete" is not a criterion. "KPIs meet spec + PO demo approved + compliance checklist 100%" IS
- **Dependencies are explicit**: Internal (core logic → UI → compliance), external (regulatory approval, SDK dependencies, cloud services)
- **Regulatory gates integrated**: Each phase includes compliance checkpoints relevant to the project's domain (consent, data minimization, audit logs)
- **Performance criteria per phase**: Each feature has measurable accuracy, speed, and security targets
- **Buffer per phase**: 20-25% buffer for software projects (complex integrations are unpredictable, regulatory changes occur)
- **Strategy is justified**: Document WHY this phasing strategy fits the project's domain use case and market timing

## Phasing Examples

> **Note**: The following examples use patterns common to platform and SDK projects. Adapt phases, durations, and criteria to your project's domain and constraints.

### Example 1: SDK Feature Rollout (MVP First → Core-Out)

**Strategy**: MVP First → Core-Out

- **Phase 1** (2 sprints): Core feature + basic UI (validate market need)
- **Phase 2** (3 sprints): Advanced capabilities + security hardening (competitive differentiation)
- **Phase 3** (2 sprints): Premium features + compliance certification
- **Phase 4** (1 sprint): Performance optimization + production hardening

### Example 2: Platform Migration (v2 → v3)

**Strategy**: Layer-by-Layer

- **Phase 1** (4 sprints): New authentication layer + backward compatibility
- **Phase 2** (3 sprints): Core module migration (parallel workstreams where independent)
- **Phase 3** (2 sprints): Dashboard migration + deprecate v2 endpoints
- **Phase 4** (1 sprint): v2 sunset + monitoring migration

### Example 3: Regulated-Industry Compliance Initiative

**Strategy**: Risk-First → Core-Out

- **Phase 1** (1 sprint): Compliance PoC + legal validation
- **Phase 2** (3 sprints): Core processing pipeline with audit logging
- **Phase 3** (2 sprints): Regulatory API integration + industry-standard authentication
- **Phase 4** (1 sprint): Production deployment + penetration testing

## Resources

- **Template**: templates/phases.md
- **Reference**: Client configuration and project context
- **Standards**: docs/standards/org.md (SDLC governance)
- **Related Skills**: epic-breakdown, sprint-capacity, architecture-doc

## Project Phasing Considerations

### Technical Phasing Factors

- **Core system complexity**: Core algorithms and critical paths in early phases for early validation
- **Data pipeline**: Secure data flow established before UI layers (PII/sensitive data protection)
- **Integration points**: Third-party services, cloud providers, compliance services
- **Performance testing**: Load testing critical endpoints under realistic conditions
- **Security hardening**: Sensitive data security, data encryption, key rotation

### Regulatory Phasing Factors

- **Data protection compliance**: Data minimization, consent management, right to be forgotten (GDPR or applicable regulation)
- **Industry regulations**: Banking (PSD2), Government (eIDAS), Healthcare (HIPAA) — apply as relevant to domain
- **Certification requirements**: ISO 27001, SOC 2, industry-specific certifications
- **Audit trail**: Immutable logging for regulatory compliance and forensics

### Market Phasing Factors

- **Competitive timing**: Feature parity vs differentiation vs speed-to-market
- **Customer feedback loops**: Early customer validation of core functionality and UX
- **Market education**: Gradual rollout to build customer confidence in new capabilities
- **Partnership readiness**: SDK/API readiness for partner integrations

## Quality Assurance

### Validation Script

This skill includes automated validation via `scripts/validate-examples.ts`:

```bash
# Validate skill examples and structure
npx tsx scripts/validate-examples.ts
```

**Validation includes:**

- Example completeness and correctness
- Implementation planning and phased delivery compliance patterns
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

---

## Changelog

| Versión | Fecha      | Autor             | Cambios                                                                     |
| ------- | ---------- | ----------------- | --------------------------------------------------------------------------- |
| 2.2.0   | 2026-03-16 | Tech Lead: System | Added Quality Assurance section with validation framework                   |
| 2.0.0   | 2026-03-09 | TL: Claude        | Added domain phasing examples, improved triggers, regulatory considerations |
| 1.0.0   | 2025-02-01 | TL: García        | Versión inicial                                                             |
