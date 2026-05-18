---
id: kickoff
version: "1.4.0"
last_updated: "2026-03-25"
updated_by: "System: Domain-Agnostic Normalization"
status: active
phase: 1
owner_role: "SM"
automation: false
domain_agnostic: true
description: "Generate comprehensive project kickoff meeting documentation: agenda, stakeholder roles, timeline, constraints, risks, decisions, and action items. Domain-agnostic — works for any project type, technology stack, or industry vertical. Use for project initiation, stakeholder alignment, and discovery phase preparation. ALWAYS use at project start to align team on objectives before work begins."
  Essential when Gate 0 has passed and Business Case is approved.
  Always use when starting a new project formally, always use when sponsor requests project initiation documentation.
  Do NOT use for ongoing projects past Originación phase, for sprint ceremonies (use sprint-capacity), or for incident reports (use postmortem).
  Triggers on "prepare kick-off", "generate kick-off agenda", "meeting minutes", "project kick-off", "Gate 0 passed now what", "start project", "begin discovery prep", "stakeholder alignment meeting", "project initiation documents".
  Output in Spanish (document), English (code references).
  Audience: Scrum Master (facilitates), PME (governance), Tech Lead (technical commitments).
---

# Skill: Project Kickoff Meeting Orchestrator

**🎯 ESSENTIAL FOR PROJECT INITIATION — ALWAYS USE AFTER GATE 0 APPROVAL**

**Critical for stakeholder alignment and project launch success. Must be executed before Discovery phase begins.**

> **Phase**: 1 (Originación) — Post Gate 0 | **Language**: Spanish | **Owner**: Scrum Master
> **Triggers on**: "prepare kick-off", "generate kick-off agenda", "meeting minutes", "project kick-off", "Gate 0 passed now what", "start project", "begin discovery prep", "stakeholder alignment meeting"

## Purpose

This skill generates comprehensive kickoff meeting documentation for any project after Gate 0 approval, ensuring proper project initiation, team alignment, and clear success criteria before Discovery phase begins.

## Workflow

### Pre-Meeting Phase (AI-Generated)

1. **Load Business Case data** — Extract objective, scope, team, timeline from approved BC
2. **Verify Gate 0 status** — Confirm approval and any conditions
3. **Generate pre-filled agenda** — Structure meeting with all essential topics
4. **Identify stakeholders** — Map roles and responsibilities from project context
5. **Prepare compliance context** — Include applicable regulatory or compliance considerations

### During/Post-Meeting Phase (Human-Completed)

6. **Facilitate discussion** — Guide team through agenda systematically
7. **Capture decisions** — Document all project decisions with rationale
8. **Record action items** — SMART goals with owners and deadlines
9. **Identify risks** — Project-specific risks (regulatory, technical, market, organizational)
10. **Generate final minutes** — Ready for knowledge-base publication and team distribution

## Input

| Input                      | Required | Source                       | Context                                                    |
| -------------------------- | -------- | ---------------------------- | ---------------------------------------------------------- |
| **Approved Business Case** | ✅       | skill `business-case` output | Complete BC with all sections                              |
| **Gate 0 Resolution**      | ✅       | `/advance-gate 0` output     | Approval status + conditions                               |
| **Participant List**       | ✅       | PME / SM                     | Names, roles, dedication %, expertise areas                |
| **Meeting Date/Time**      | ✅       | Calendar invite              | Include timezone for distributed teams                     |
| **Project Code (Jira)**    | ✅       | PME                          | Format: {PRODUCT}-{NUMBER} (e.g., PROJ-2024)               |
| **Known Constraints**      | Optional | Sponsor / PME                | Budget, timeline, resource limitations                     |
| **Regulatory Context**     | Optional | Legal / Compliance           | Applicable data protection regulations, industry standards |

> **Domain note**: When executing for regulated industries ({{APPLICABLE_DOMAINS}}), the regulatory context becomes required input. Replace placeholders in the output template with your project's actual regulatory framework.

## Output Template

Uses: templates/kickoff.md

```markdown
# Acta de Kick-off: [PROJECT NAME]

| Campo                     | Valor                               |
| ------------------------- | ----------------------------------- |
| **Proyecto**              | [Código Jira] — [Nombre Completo]   |
| **Línea de Producto**     | [product line or component name]    |
| **Fecha**                 | [YYYY-MM-DD HH:MM Timezone]         |
| **Duración**              | [HH:MM] (objetivo: máx 90 minutos)  |
| **Facilitador**           | [SM name]                           |
| **Asistentes**            | [Name — Role — Área — % Dedicación] |
| **Ausentes justificados** | [Name — Role — Área]                |

## 1. Contexto y Objetivo del Proyecto

**Problema de negocio**: [from BC §2 Problem Statement]
**Oportunidad**: [from BC §4 Market Opportunity]
**Objetivo**: [from BC §1 Executive Summary]
**Alineación estratégica**: [from BC §5 Strategic Alignment]

## 2. Alcance y Entregables Confirmados

### ✅ In Scope (from BC §3 Proposed Solution)

- [Entregable 1 — Criterio de éxito]
- [Entregable 2 — Criterio de éxito]

### ❌ Out of Scope (Explicit Exclusions)

- [Exclusión 1 — Razón]
- [Exclusión 2 — Razón]

### 🔮 Future Scope (Post-MVP Considerations)

- [Funcionalidad futura 1]
- [Funcionalidad futura 2]

## 3. Equipo del Proyecto y Responsabilidades

| Rol               | Nombre  | Área     | Dedicación | Responsabilidad Principal               |
| ----------------- | ------- | -------- | ---------- | --------------------------------------- |
| **PME**           | [Name]  | PME      | [%]        | Governance, gates, stakeholders         |
| **Product Owner** | [Name]  | Producto | [%]        | PRD, priorización, validación funcional |
| **R&D/Core Lead** | [Name]  | R&D      | [%]        | Arquitectura, PoCs, decisiones técnicas |
| **Tech Lead**     | [Name]  | Dev      | [%]        | Code quality, mentoring, DoD            |
| **Developers**    | [Names] | Dev      | [%]        | Implementación, PRs, handoffs           |
| **QA Lead**       | [Name]  | QA       | [%]        | Test strategy, sign-off                 |
| **Security Lead** | [Name]  | Sec      | [%]        | Vuln assessment, compliance             |
| **DevOps**        | [Name]  | Ops      | [%]        | CI/CD, deploy, monitoreo                |
| **Scrum Master**  | [Name]  | PME      | [%]        | Facilitación, impedimentos              |

## 4. Timeline y Hitos Críticos

**Duración total**: [N semanas/meses] — [Fecha inicio] a [Fecha fin]
**Sprints**: [N sprints de 2 semanas]

| Hito                    | Fecha Target | Owner    | Gate   |
| ----------------------- | ------------ | -------- | ------ |
| Discovery completa      | [YYYY-MM-DD] | PO + R&D | Gate 1 |
| Especificación aprobada | [YYYY-MM-DD] | PO + QA  | Gate 2 |
| Primer sprint committed | [YYYY-MM-DD] | SM       | Gate 3 |
| Desarrollo completo     | [YYYY-MM-DD] | TL       | Gate 4 |
| QA Sign-off             | [YYYY-MM-DD] | QA Lead  | Gate 5 |
| Security Sign-off       | [YYYY-MM-DD] | Security | Gate 6 |
| Release a Producción    | [YYYY-MM-DD] | DevOps   | Gate 7 |

## 5. Restricciones y Dependencias Críticas

### Restricciones (No Negociables)

- **Presupuesto**: [€ amount] — aprobado por [Sponsor]
- **Timeline**: [Fecha máxima] — razón: [driver de negocio]
- **Recursos**: [Limitaciones de equipo o tecnología]
- **Compliance**: [Regulaciones aplicables: {{APPLICABLE_REGULATIONS}}]

### Dependencias Externas

| Dependencia              | Owner              | Fecha Crítica | Riesgo si Falla     |
| ------------------------ | ------------------ | ------------- | ------------------- |
| [Sistema/API externo]    | [Área/Vendor]      | [YYYY-MM-DD]  | [Impact assessment] |
| [Aprobación regulatoria] | [Legal/Compliance] | [YYYY-MM-DD]  | [Impact assessment] |

## 6. Riesgos Iniciales Identificados (Top 5 from BC)

| ID    | Riesgo                                   | Probabilidad      | Impacto           | Mitigación Propuesta | Owner  |
| ----- | ---------------------------------------- | ----------------- | ----------------- | -------------------- | ------ |
| R-001 | [Riesgo técnico específico del proyecto] | [Alta/Media/Baja] | [Alto/Medio/Bajo] | [Plan de mitigación] | [Role] |
| R-002 | [Riesgo regulatorio/compliance]          | [Alta/Media/Baja] | [Alto/Medio/Bajo] | [Plan de mitigación] | [Role] |
| R-003 | [Riesgo de mercado/competencia]          | [Alta/Media/Baja] | [Alto/Medio/Bajo] | [Plan de mitigación] | [Role] |

## 7. Decisiones Tomadas en la Reunión

| #     | Decisión                  | Contexto/Alternativas   | Responsable | Justificación           |
| ----- | ------------------------- | ----------------------- | ----------- | ----------------------- |
| D-001 | [Decisión arquitectónica] | [Opciones consideradas] | [TL]        | [Razón técnica/negocio] |
| D-002 | [Decisión de proceso]     | [Alternativas]          | [SM]        | [Justificación]         |

## 8. Preguntas Abiertas / Escalamiento Requerido

| #     | Pregunta                      | Contexto                | Escalar a       | Fecha Límite |
| ----- | ----------------------------- | ----------------------- | --------------- | ------------ |
| Q-001 | [Pregunta técnica específica] | [Por qué es importante] | [Tech Lead/R&D] | [YYYY-MM-DD] |
| Q-002 | [Pregunta regulatoria]        | [Impacto en proyecto]   | [Legal/CISO]    | [YYYY-MM-DD] |

## 9. Action Items (SMART)

| #      | Acción                                      | Owner      | Fecha Límite | Criterio de Completitud                       | Status |
| ------ | ------------------------------------------- | ---------- | ------------ | --------------------------------------------- | ------ |
| AI-001 | Crear épica master en Jira con sub-épicas   | [PME]      | [YYYY-MM-DD] | Jira epic visible al equipo                   | 📝     |
| AI-002 | Iniciar PRD Técnico (skill prd-tecnico)     | [R&D Lead] | [YYYY-MM-DD] | Borrador PRD-T v0.1 en Confluence             | 📝     |
| AI-003 | Iniciar PRD Funcional (skill prd-funcional) | [PO]       | [YYYY-MM-DD] | Borrador PRD-F v0.1 en Confluence             | 📝     |
| AI-004 | Setup proyecto en herramientas              | [DevOps]   | [YYYY-MM-DD] | Repo, CI/CD, entornos DEV/STG                 | 📝     |
| AI-005 | Análisis de compliance inicial              | [Security] | [YYYY-MM-DD] | Evaluación de impacto de privacidad si aplica | 📝     |

## 10. Próximos Pasos y Gate 1 Preparation

**Inmediato (esta semana)**:

1. Completar action items AI-001 a AI-005
2. Agendar sesiones de Discovery (PO + R&D)
3. Identificar stakeholders clave para entrevistas

**Sprint 1 (próximas 2 semanas)**:

1. Ejecutar skill `prd-funcional` con PO
2. Ejecutar skill `prd-tecnico` con R&D Lead
3. Identificar PoCs técnicos críticos

**Objetivo Gate 1** (en [N] semanas):

- PRD Funcional y Técnico completos
- Review cruzado aprobado (skill `review-cruzado`)
- Risk log actualizado (skill `risk-log`)
- PoC reports de viabilidad técnica (si aplica)

## 11. Criterios de Éxito del Proyecto

### Métricas de Negocio

- [ ] [KPI específico 1 — valor numérico objetivo]
- [ ] [KPI específico 2 — valor numérico objetivo]
- [ ] [KPI específico 3 — valor numérico objetivo]

### Métricas Técnicas

- [ ] Performance: [métrica específica]
- [ ] Availability: [SLA objetivo]
- [ ] Security: 0 vulnerabilidades críticas/altas
- [ ] Compliance: Certificaciones obtenidas

### Métricas de Proceso

- [ ] Timeline: ±5% de fecha target
- [ ] Budget: ±5% de presupuesto aprobado
- [ ] Quality: >85% gate pass rate en primer intento

## 12. Firmas y Compromisos

| Rol               | Nombre | Firma | Fecha        | Compromiso                               |
| ----------------- | ------ | ----- | ------------ | ---------------------------------------- |
| **Sponsor**       | [Name] | ⭐    | [YYYY-MM-DD] | Presupuesto y escalamiento garantizados  |
| **Product Owner** | [Name] | ⭐    | [YYYY-MM-DD] | PRDs y priorización comprometidas        |
| **Tech Lead**     | [Name] | ⭐    | [YYYY-MM-DD] | Calidad técnica y mentoring garantizados |
| **Scrum Master**  | [Name] | ⭐    | [YYYY-MM-DD] | Facilitación y métricas comprometidas    |

---

**Documento generado por**: skill `kickoff` v1.1.0
**Próxima revisión**: Post Gate 1 o en 30 días
**Storage**: Confluence → [URL a completar post-meeting]
```

## Execution Rules

### Pre-Meeting (AI Automation)

- **Sections 1-6**: Auto-populated from approved Business Case data
- **Regulatory context**: Automatically identify compliance requirements based on product line
- **Stakeholder mapping**: Include all critical roles for project success
- **Risk seeding**: Pre-populate with typical project risks from knowledge base

### During Meeting (Human Facilitation)

- **Max 90 minutes**: Structure prevents scope creep and ensures focus
- **Decision recording**: Every decision must have rationale and responsible party
- **SMART action items**: Specific, Measurable, Achievable, Relevant, Time-bound
- **Regulatory awareness**: Address compliance early, especially for sensitive data

### Post-Meeting (Documentation)

- **Immediate distribution**: Share within 24h of meeting
- **Confluence storage**: Centralized knowledge management
- **Jira epic creation**: Link meeting outcomes to trackable work
- **Gate 1 preparation**: Clear next steps toward Discovery phase completion

## Examples

See `examples/` directory for domain-specific kickoff examples:

- `examples/project-kickoff-output.md` — Generic kickoff output example
- `examples/domains/` — Domain-specific examples (e.g., {{DOMAIN_EXAMPLES}})
- `examples/domain-example.md` — Domain-specific examples for {{DOMAIN_TYPE}} projects

## Dependencies and References

### Required Skills

- **Prerequisite**: `business-case` — Must have approved BC before kickoff
- **Prerequisite**: `/advance-gate 0` — Gate 0 must pass before kickoff meeting
- **Follow-up**: `prd-funcional` — Action item for PO post-kickoff
- **Follow-up**: `prd-tecnico` — Action item for R&D Lead post-kickoff
- **Follow-up**: `tracking-integration` — Create project structure in tracking tool

### Templates and Documents

- **Main template**: templates/kickoff.md — Structured agenda format
- **README template**: templates/readme.md — Project setup documentation
- **Contributing template**: templates/contributing.md — Development guidelines

### Checklists and Standards

- **Team formation**: docs/checklists/repo-structure.md — Team setup requirements
- **Compliance validation**: docs/checklists/security-compliance.md — Regulatory requirements
- **Process adherence**: docs/standards/org.md — Organizational standards
- **Sprint structure**: docs/standards/sprint-commitment.md — Sprint commitment format

### Project-Specific References

- **Domain knowledge**: Client configuration and industry context (if available)
- **Project context**: docs/projects/ — Project-specific compliance and context
- **Technology standards**: rules/tech-stack.md — Technical constraints
- **Team structure**: rules/project.md — Role definitions and responsibilities

## Common Kickoff Scenarios

### When to Use This Skill

✅ **ALWAYS use when**: Gate 0 has passed approval
✅ **ALWAYS use when**: Business Case is approved and team is assigned
✅ **ALWAYS use when**: Starting any new technology project formally
✅ **ALWAYS use when**: Project sponsor requests formal project initiation
✅ **ALWAYS use when**: Regulatory compliance project requires formal documentation

### Triggering Phrases

- "Prepare kick-off meeting"
- "Generate kick-off agenda"
- "Project kick-off documentation"
- "Gate 0 passed, now what?"
- "Start project formally"
- "Begin discovery preparation"
- "Stakeholder alignment meeting"
- "Project initiation documents"
- "Team formation meeting"

### Integration with SDLC Workflow

```
Business Case → Gate 0 → KICKOFF SKILL → Discovery Phase
                ↑                        ↓
            (PME approval)        (PO + R&D start PRDs)
```

## Quality Criteria

### Meeting Success Metrics

- [ ] All key stakeholders present (attendance >90%)
- [ ] All sections 1-11 completed with real data
- [ ] Minimum 5 action items with SMART criteria
- [ ] Risk register seeded with 3+ identified risks
- [ ] Next steps clearly defined for Discovery phase
- [ ] Document published to Confluence within 24h

### Handoff to Discovery Phase

- [ ] PRD initiation action items assigned
- [ ] Jira epic created with proper structure
- [ ] Team roles and responsibilities confirmed
- [ ] Compliance requirements identified and documented
- [ ] Risk log initialized with monitoring plan

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
- Project kickoff orchestration compliance patterns
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

| Versión | Fecha      | Autor             | Cambios                                                                                      |
| ------- | ---------- | ----------------- | -------------------------------------------------------------------------------------------- |
| 1.1.0   | 2026-03-09 | TL: Lead Engineer | Enhanced with domain examples, expanded template, regulatory context, comprehensive workflow |
| 1.0.0   | 2025-02-01 | SM: Scrum Master  | Versión inicial básica                                                                       |
