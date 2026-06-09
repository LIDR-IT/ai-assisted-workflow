---
name: lidr-sprint-capacity
id: sprint-capacity
version: "1.2.1"
last_updated: "2026-06-09"
updated_by: "TL: BMAD-coherence batch-fix"
status: active
phase: 4
owner_role: "TL"
automation: false
domain_agnostic: true
language_default: en
integrations: [tracking]
description: "Essential for software project sprint planning - ALWAYS use before committing to new feature development, platform enhancements, API integrations, or infrastructure work. CRITICAL for accurately planning team capacity including backend development, frontend work, QA testing, DevOps tasks, and compliance effort. Use when estimating feature complexity, integration testing, security validation, or cross-team dependency work. Mandatory for Sprint Planning Gate 3 approval. Domain-specific examples available in examples/client-domain-example.md for regulated identity verification contexts."
---

# Sprint Capacity Calculator

Phase: 4 — Sprint Planning | Content authored in English; artifact language follows the client `language` setting (see `_shared/lidr/integrations/`). The Spanish column headers in the templates/examples below are illustrative — the bound client `language` drives the emitted artifact.

Tools resolve via the central registry `_shared/lidr/integrations/tool-registry.yaml`; the active client binds concrete tools in `clients/<CODE>.yaml`.

## Relationship to BMad

This skill is a **LIDR-native artifact** (no BMad equivalent). It produces the team capacity calculation (productive-hours, buffer, tech-debt reserve) that is a **required input to Gate 3 (Sprint committed)** and feeds `bmad-sprint-planning`, which consumes the committable-capacity figure when generating the sprint plan.

## Workflow

1. **List team members** with roles and dedication %
   - Backend developers (API, database, services)
   - Frontend developers (UI, integration, accessibility)
   - QA engineers (manual testing, automation, regression)
   - DevOps engineers (CI/CD, infrastructure, monitoring)
   - Security/compliance engineers (audits, vulnerability remediation)
2. **Account for project-specific time allocations**:
   - Research and spike work for uncertain technical areas
   - Compliance documentation and audit preparation
   - Security testing and vulnerability remediation
   - Integration testing with third-party systems
3. **Apply productive hours** considering team context (default: 6h for standard work; 5.5h for research-heavy tasks)
4. **Apply buffer** (15-20% depending on project complexity and uncertainty)
5. **Allocate compliance work** (10-15% if regulatory compliance tasks are in scope)
6. **Reserve tech debt capacity** (15-20% for dependency updates, refactors, security patches)
7. **Calculate net capacity** for new feature development
8. **Validate User Stories** meet DoR criteria with acceptance criteria

## Input

| Input                             | Required      | Source                                                       |
| --------------------------------- | ------------- | ------------------------------------------------------------ |
| Team members + roles              | ✅            | Org chart / team roster                                      |
| Sprint duration                   | ✅            | Scrum config (default: 2 weeks = 10 business days)           |
| Dedication % per member           | ✅            | PM / contracts                                               |
| Vacations / absences              | ✅            | Shared calendar                                              |
| Holidays for period               | ✅            | Labor calendar                                               |
| Historical velocity (3-5 sprints) | Desirable     | {{TRACKING_TOOL}} metrics                                    |
| Buffer policy                     | Desirable     | Team agreement (default: 15-20% based on project complexity) |
| Compliance allocation             | If applicable | Regulatory/audit work allocation (10-15% when required)      |
| Research/spike time               | If applicable | Team estimates for technical uncertainty spikes              |
| Security testing allocation       | If applicable | Penetration testing, vulnerability remediation               |
| Tech debt allocation              | Desirable     | Dependency updates, refactors, security patches (15-20%)     |
| Sprint commitment format          | ✅            | `@docs/standards/sprint-commitment.md`                       |
| DoR checklist (US readiness)      | ✅            | `@../refinement-notes/checklists/dor.md`                     |

## Output Template

```markdown
# Sprint Capacity: Sprint {N} — [{start_date} to {end_date}]

## Team Availability

| Miembro | Rol | Dedicación | Días Disponibles | Ausencias | Días Netos | Horas Brutas (×6h) |
| ------- | --- | ---------- | ---------------- | --------- | ---------- | ------------------ |

## Capacity Calculation

| Concepto                               | Horas     |
| -------------------------------------- | --------- |
| Horas brutas del equipo                | {total}   |
| − Buffer interrupciones (15%)          | −{buffer} |
| = Horas para trabajo planificado       | {planned} |
| − Tech debt allocation (15-20%)        | −{td}     |
| = **Horas disponibles para US nuevas** | **{net}** |

## Historical Comparison

| Sprint       | Committed | Completed | Velocity   | Notes |
| ------------ | --------- | --------- | ---------- | ----- |
| Sprint {N-3} | {X}h      | {Y}h      | {Y/X}%     |       |
| Sprint {N-2} | {X}h      | {Y}h      | {Y/X}%     |       |
| Sprint {N-1} | {X}h      | {Y}h      | {Y/X}%     |       |
| **Average**  |           |           | **{avg}%** |       |

## Recommendation

- Committable capacity: **{net}h**
- Target utilization: **80-85%** of capacity (don't commit 100%)
- Suggested commitment: **{net × 0.85}h** of new US
```

## Key Rules (software projects)

- **6 productive hours/day standard**: Account for meetings, interruptions, and context switching
- **5.5 productive hours/day for research-heavy work**: Spikes, architecture design, and complex integrations need focus time
- **15-20% buffer**: Adjust based on project complexity — higher for greenfield, lower for maintenance
- **Compliance allocation when applicable**: 10-15% for regulatory or audit-driven work
- **Research/spike work is time-boxed**: If a spike is inconclusive after the allocated time, that is the result
- **Security work is uncompressible**: Penetration testing, vulnerability remediation cannot be rushed
- **Never commit 100% of capacity**: Target 80-85% for standard projects; 75-80% for high-uncertainty projects
- **Cross-functional dependencies**: Full-stack features require backend + frontend + QA coordination — plan for it

## Generic Team Capacity Example

### Sprint 12: E-Commerce Checkout v2.0 - Payment Gateway Integration

```markdown
## Team Availability

| Miembro   | Rol            | Dedicación | Días Disponibles | Ausencias | Días Netos | Horas Brutas (×6h) |
| --------- | -------------- | ---------- | ---------------- | --------- | ---------- | ------------------ |
| Ana M.    | Backend Dev    | 100%       | 10 días          | 0         | 10         | 60h                |
| Carlos R. | Frontend Dev   | 80%        | 10 días          | 1 (conf)  | 9          | 43.2h              |
| Luis G.   | Full-Stack Dev | 100%       | 10 días          | 0         | 10         | 60h                |
| Sofia P.  | QA Engineer    | 100%       | 10 días          | 0         | 10         | 60h                |
| David L.  | DevOps         | 50%        | 10 días          | 0         | 10         | 30h                |

## Capacity Calculation

| Concepto                               | Horas    |
| -------------------------------------- | -------- |
| Horas brutas del equipo                | 253.2h   |
| − Buffer interrupciones (15%)          | −38h     |
| = Horas para trabajo planificado       | 215h     |
| − Integration testing allocation (10%) | −22h     |
| − Tech debt allocation (15%)           | −32h     |
| = **Horas disponibles para US nuevas** | **161h** |

## Project-Specific Allocations

- **Payment gateway API spike**: 16h (Ana M.)
- **E2E test automation setup**: 20h (Sofia P.)
- **CI/CD pipeline updates**: 12h (David L.)
- **Cross-browser compatibility testing**: 16h (Carlos R. + Sofia P.)
- **Performance load testing**: 8h (Ana M. + DevOps)

## Recommendation

- Committable capacity: **161h** for new feature development
- Target utilization: **85%** for this sprint
- Suggested commitment: **137h** of new features
```

> For regulated identity and compliance-heavy domain capacity patterns, see: `examples/client-domain-example.md`

## Quality Assurance

### Validation Script

This skill includes automated validation via `scripts/validate-examples.ts`:

```bash
# Validate skill examples and structure
npx tsx scripts/validate-examples.ts
```

**Validation includes:**

- Example completeness and correctness
- Sprint planning and capacity management compliance patterns
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
