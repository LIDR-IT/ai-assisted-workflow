---
id: change-request
version: "1.1.0"
last_updated: "2026-03-16"
updated_by: "Tech Lead: System"
status: active
phase: 8
owner_role: "TL"
automation: false
domain_agnostic: true
description: "Generate a Change Request for production deployment following ITIL Change Management (Standard/Normal/Emergency). Domain-agnostic - works for any application type and infrastructure. Essential for any production deployment - no exceptions. Always use before going live, regardless of change size. Required for all releases, infrastructure changes, and configuration updates. Requires QA Sign-off (Gate 5), Security Sign-off (Gate 6), and Rollback Plan as prerequisites. Triggers on "create change request", "prepare deployment", "request production deploy", "CAB approval", "change management". Output in Spanish for CAB approval."
---

# Change Request Generator

Phase: 8 — Deployment | Gate: 7 (Change Approved) | Language: Spanish

## Workflow

1. Read release PRs and release notes
2. Read QA Sign-off evidence (Gate 5)
3. Read Security Sign-off evidence (Gate 6)
4. Read Rollback Plan (mandatory attachment)
5. Classify change type: Standard / Normal / Emergency
6. Generate CR using template below
7. Submit to CAB for approval

## Input

| Input                  | Required | Source                                                |
| ---------------------- | -------- | ----------------------------------------------------- |
| PRs merged for release | ✅       | Git / GitHub                                          |
| Release Notes          | ✅       | skill `release-notes/`                                |
| QA Sign-off            | ✅       | skill `test-execution-report/` (Gate 5)               |
| Security Sign-off      | ✅       | skills `vuln-assessment/`, `pentest-report/` (Gate 6) |
| Rollback Plan          | ✅       | skill `rollback-plan/`                                |
| Architecture / impact  | ✅       | PRD-T / PRs                                           |
| Deployment window      | ✅       | Calendar + team                                       |

## Output Location

Generated documents should be saved to: **`docs/projects/{projectName}/change-request.md`**

Contains ITIL-compliant change request for production deployment approval.

Example: `docs/projects/identity-sdk-v3/change-request.md`

## Change Types

| Type          | When                                      | Approval                  | Documentation            |
| ------------- | ----------------------------------------- | ------------------------- | ------------------------ |
| **Standard**  | Routine (minor, bug fixes)                | Pre-approved, notify only | Simplified CR            |
| **Normal**    | Significant (features, migrations, infra) | CAB approval required     | Full CR                  |
| **Emergency** | Critical hotfix in production             | Fast-track (1-2 people)   | Post-facto documentation |

## Output Template

```markdown
---
id: {project-name}-change-request
version: "1.0.0"
last_updated: "YYYY-MM-DD"            # date of generation
updated_by: "DevOps: {Name}"          # DevOps generates change requests
status: active
type: project
review_cycle: 60                      # days between reviews (project documentation)
next_review: "YYYY-MM-DD"             # calculated: last_updated + review_cycle
owner_role: "DevOps"                  # DevOps maintains change requests
---

# Change Request: CR-{YYYY}-{NNN}

## Metadata

| Field                 | Value                          |
| --------------------- | ------------------------------ |
| **Type**              | Standard / Normal / Emergency  |
| **Release**           | v{X.Y.Z}                       |
| **Requested By**      | [Release Manager]              |
| **Target Date**       | [YYYY-MM-DD HH:MM timezone]    |
| **Deployment Window** | [start — end]                  |
| **Impacted Systems**  | [list]                         |
| **Risk Level**        | Low / Medium / High / Critical |

## 1. Description of Change (what's being deployed — business language)

## 2. Justification (why this change is needed now)

## 3. Scope of Impact

### Components Affected (table: component, change type, risk)

### Users Affected (who, how many, when they'll notice)

### Downtime Required (yes/no, duration, mitigation)

## 4. Prerequisites

- [ ] QA Sign-off: [link to evidence]
- [ ] Security Sign-off: [link to evidence]
- [ ] Rollback Plan: [link to plan]
- [ ] Release Notes: [link]
- [ ] Deployment runbook tested in staging

## 5. Deployment Plan

| Step | Action | Responsible | Duration | Verification |
| ---- | ------ | ----------- | -------- | ------------ |

## 6. Rollback Criteria (when to trigger rollback)

## 7. Communication Plan (who to notify, when, how)

## 8. Post-Deployment Verification (docs/checklists/post-deploy.md)

## Approvals

| Role      | Name | Decision       | Date |
| --------- | ---- | -------------- | ---- |
| CAB Chair |      | Approve/Reject |      |
| Tech Lead |      | Approve/Reject |      |
| PO        |      | Approve/Reject |      |
```

## Example Output

### Complete CR Example: Platform verification v2.1.0

```markdown
# Change Request: CR-2026-047

## Metadata

| Field                 | Value                                                  |
| --------------------- | ------------------------------------------------------ |
| **Type**              | Normal                                                 |
| **Release**           | v2.1.0                                                 |
| **Requested By**      | DevOps Team - García López                             |
| **Target Date**       | 2026-03-15 02:00 CET                                   |
| **Deployment Window** | 02:00 — 04:00 CET (2 horas)                            |
| **Impacted Systems**  | Core API, Mobile SDKs, Dashboard, Document OCR Service |
| **Risk Level**        | Medium                                                 |

## 1. Description of Change

Despliegue de nueva versión del Customer Portal v2.1.0 que incluye:

- Nuevo módulo de dashboard personalizable para usuarios finales
- API mejorada para integración con sistemas de terceros
- Actualización del sistema de notificaciones en tiempo real
- Migración de base de datos para soporte de múltiples organizaciones

## 2. Justification

- Funcionalidad solicitada por 5 clientes enterprise (dashboard personalizable)
- Mejora de performance crítica: reducción 40% tiempo carga páginas
- Resolución de vulnerabilidad media en autenticación de sesiones
- Habilitación de multi-tenancy para expansión comercial

## 3. Scope of Impact

### Components Affected

| Component               | Change Type           | Risk Level |
| ----------------------- | --------------------- | ---------- |
| Web Frontend (React)    | Major UI updates      | Medium     |
| REST API Backend        | New endpoints         | Low        |
| User Management Service | Multi-tenant logic    | High       |
| PostgreSQL Database     | Schema migration      | High       |
| Notification Service    | WebSocket integration | Medium     |

### Users Affected

- **Active Users**: 1,200 usuarios registrados
- **Organizations**: 45 empresas, ~500 usuarios/día promedio
- **End Users**: Nuevas funcionalidades de dashboard y notificaciones
- **Downtime**: 20 minutos durante migración DB + deploy frontend

### Downtime Required

- **Sí**: 20 minutos para migración de BD + despliegue
- **Mitigación**: Maintenance mode con mensaje personalizado y progreso
- **Horario**: 01:00-01:20 CET (mínima actividad de usuarios)

## 4. Prerequisites

- [x] QA Sign-off: [TestRail Report TR-2026-051](link)
- [x] Security Sign-off: [Security Review SR-2026-018](link)
- [x] Rollback Plan: [RP-2026-051](link)
- [x] Release Notes: [RN-v2.1.0](link)
- [x] Deployment runbook tested in staging

## 5. Deployment Plan

| Step | Action                   | Responsible | Duration | Verification                    |
| ---- | ------------------------ | ----------- | -------- | ------------------------------- |
| 1    | Enable maintenance mode  | DevOps      | 2 min    | Status page + user notification |
| 2    | Stop web services        | DevOps      | 3 min    | Load balancer health check      |
| 3    | Backup production DB     | DBA         | 5 min    | Backup verification             |
| 4    | Deploy API backend       | DevOps      | 8 min    | API health checks               |
| 5    | Run DB migrations        | DBA         | 12 min   | Migration logs + data integrity |
| 6    | Deploy frontend build    | DevOps      | 6 min    | CDN deployment verification     |
| 7    | Smoke tests              | QA          | 8 min    | Critical user journeys          |
| 8    | Disable maintenance mode | DevOps      | 2 min    | Full service restoration        |
| 9    | Monitor metrics          | DevOps      | 30 min   | Error rates + performance       |

## 6. Rollback Criteria

- Error rate > 2% during first 30 minutes
- Database migration failure or data corruption
- Critical user authentication failure
- Page load time > 5 seconds sustained
- Customer escalation from enterprise clients

## 7. Communication Plan

- **T-48h**: Email to organization admins (scheduled maintenance)
- **T-24h**: In-app notification to all users
- **T-2h**: Slack #general + status page warning
- **T-15min**: Maintenance mode activation
- **T+30min**: Completion confirmation + new features summary
- **T+24h**: Success report + usage metrics to stakeholders

## 8. Post-Deployment Verification

✅ User authentication and session management working
✅ Dashboard customization features functional
✅ Database performance metrics stable
✅ Notification service delivering messages
✅ Error monitoring alerts silent
✅ Customer support tickets below baseline
✅ Follow checklist: docs/checklists/post-deploy.md

## Approvals

| Role      | Name            | Decision | Date       |
| --------- | --------------- | -------- | ---------- |
| CAB Chair | Director IT     | Approved | 2026-03-12 |
| Tech Lead | Senior Engineer | Approved | 2026-03-12 |
| PO        | Product Manager | Approved | 2026-03-11 |
```

## Troubleshooting Guide

### Common CAB Rejection Reasons

| Rejection Reason                | Root Cause                     | How to Address                                                         |
| ------------------------------- | ------------------------------ | ---------------------------------------------------------------------- |
| "Insufficient testing evidence" | Missing test cases or coverage | Link complete test execution report with pass/fail metrics             |
| "Rollback plan too vague"       | Generic rollback steps         | Provide specific commands, time estimates, and verification steps      |
| "Business impact unclear"       | Technical focus only           | Add business metrics: revenue impact, customer count, SLA implications |
| "Resource availability"         | Key personnel unavailable      | Confirm on-call schedule, backup resources, escalation contacts        |
| "Timing conflict"               | Other changes scheduled        | Check change calendar, reschedule or coordinate with other changes     |
| "Security concerns"             | Vulnerability findings         | Ensure Security Sign-off is complete and current (< 7 days old)        |

### Timeline Guidance by CR Type

| CR Type       | Approval Time   | Prerequisites Lead Time | Planning Window              |
| ------------- | --------------- | ----------------------- | ---------------------------- |
| **Standard**  | 24 hours        | 3-5 days                | 1 week total                 |
| **Normal**    | 5 business days | 1-2 weeks               | 3 weeks total                |
| **Emergency** | 4 hours max     | Concurrent with fix     | Deploy first, document later |

### Missing Prerequisites Checklist

Before submitting CR, verify:

- [ ] **QA Sign-off exists** and is < 7 days old
- [ ] **Security Sign-off exists** and covers this specific release
- [ ] **Rollback Plan** includes specific steps, not just "restore backup"
- [ ] **Release Notes** are customer-ready (no technical jargon)
- [ ] **Impact Assessment** includes business metrics, not just technical
- [ ] **Communication Plan** has all stakeholder groups identified
- [ ] **Deployment Window** avoids business-critical hours
- [ ] **Resource Allocation** confirmed (who's on-call, backup contacts)
- [ ] **Dependencies** mapped (other systems, teams, third parties)
- [ ] **Success Criteria** are measurable and time-bound

### Emergency CR Fast-Track Process

For P1 production incidents requiring immediate deployment:

1. **Verbal approval** from 2 of: CTO, Tech Lead, PO
2. **Document intent** in Slack #incidents with CR number
3. **Deploy immediately** with rollback monitoring
4. **Complete CR documentation** within 24h post-deployment
5. **Schedule post-mortem** within 48h to prevent recurrence

## Key Rules

- **No deploy without CR**: Even "small changes" need at minimum a Standard CR.
- **Evidence-based**: QA + Security sign-offs must be linked, not just claimed.
- **Rollback is mandatory**: No CR without rollback plan attached.
- **Deployment window**: Always specify start, end, and who's on-call.
- **Emergency CRs**: Deploy first, document within 24h. But still need 1-2 approvals.
- **Post-deploy verification**: Reference docs/checklists/post-deploy.md.

## Quality Assurance

### Validation Script

This skill includes automated validation via `scripts/validate-examples.ts`:

```bash
# Validate skill examples and structure
npx tsx scripts/validate-examples.ts
```

**Validation includes:**

- Example completeness and correctness
- Change management and deployment compliance patterns
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
