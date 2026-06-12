---
id: org-standards
version: "1.0.0"
last_updated: "2026-03-25"
updated_by: "IA: sync-docs"
status: active
type: standard
review_cycle: 90
next_review: "2026-06-23"
owner_role: "Tech Lead"
---

# Estándares de Organización — {{CLIENT_NAME}}

> **Propósito**: Fuente de verdad de estándares organizacionales, metodología, roles, y políticas.
> **Referenciado por**: `.claude/rules/org.md` via `@../standards/org.md`
> **Alcance**: Aplica a todos los equipos, proyectos, y fases del SDLC
> **Owner**: CTO / Engineering Leads
> **Última revisión**: Alineado con la estructura .claude/ completa (34 skills + rules)

---

## 1. Metodología

### 1.1 Framework

| Aspecto               | Estándar                      | Detalle                                                                                          |
| --------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------ |
| **Framework base**    | Scrum                         | Sprints de 2 semanas (lunes a viernes)                                                           |
| **Estimación**        | Horas                         | No story points — horas reales por tarea                                                         |
| **Buffer por sprint** | 15-20%                        | Reserva para bugs, interrupciones, refinement                                                    |
| **Filosofía**         | Spec-Driven Development (SDD) | Las especificaciones (PRD, RF, US) impulsan toda la generación de código, tests, y documentación |
| **Ceremonies**        | Completas                     | Sprint Planning, Daily, Review, Retro, Refinement                                                |
| **Refinement**        | 2 sesiones/sprint             | Semana 1: refinement de siguiente sprint. Semana 2: refinement de buffer                         |
| **Sprint goal**       | Obligatorio                   | 1-2 oraciones que definen el objetivo del sprint                                                 |
| **Velocity tracking** | Horas completadas             | No es métricas de presión — es para capacity planning                                            |

### 1.2 Spec-Driven Development (SDD)

**Principio central**: La especificación es la fuente de verdad. El código implementa la spec, no al revés.

| Fase            | Spec que la impulsa          | Quién genera          | Quién valida      |
| --------------- | ---------------------------- | --------------------- | ----------------- |
| Discovery       | Business Case                | PME + Negocio         | Sponsor           |
| PRD             | PRD Técnico + Funcional      | R&D + Producto        | Cross-review      |
| Especificación  | Requisitos Funcionales       | Producto + IA (skill) | QA + Tech Lead    |
| Sprint Planning | User Stories + criterios BDD | PO + IA (skill)       | Equipo            |
| Desarrollo      | US → Código                  | Dev + IA              | Code Review       |
| Testing         | US → Test Cases              | QA + IA (skill)       | QA Lead           |
| Security        | Compliance Checklist         | Security + IA (skill) | CISO              |
| Deploy          | Change Request               | PME + IA (skill)      | Comité de Cambios |

### 1.3 Integración de IA (Claude Code)

| Principio                     | Detalle                                                                         |
| ----------------------------- | ------------------------------------------------------------------------------- |
| **IA como copiloto**          | La IA genera borradores; el humano valida, ajusta, y decide                     |
| **Conocimiento en skills/**   | Cada tarea tiene un skill con SKILL.md + reference/ + examples/ + scripts/      |
| **Contexto en rules/**        | org + tech-stack + project → la IA siempre sabe quiénes somos y cómo trabajamos |
| **Automatización en hooks**   | Guardias event-driven evalúan checklists de docs/ automáticamente               |
| **Orquestación en commands/** | /slash-commands encadenan skills + MCPs en workflows                            |
| **Fuente de verdad en docs/** | Rules y hooks referencian docs/ via @ — los docs son la verdad, no los prompts  |

---

## 2. Roles y Responsabilidades

### 2.1 Matriz RACI por Fase

| Fase              | PME     | PO      | R&D   | Tech Lead | Dev   | QA Lead | QA    | Security | DevOps | SM    |
| ----------------- | ------- | ------- | ----- | --------- | ----- | ------- | ----- | -------- | ------ | ----- |
| Originación       | **R/A** | C       | C     | C         | —     | —       | —     | —        | —      | I     |
| Discovery/PRD     | C       | **R**   | **R** | C         | —     | I       | —     | —        | —      | I     |
| Especificación RF | I       | **R/A** | C     | C         | —     | C       | —     | —        | —      | I     |
| Sprint Planning   | I       | **R**   | —     | **A**     | C     | C       | —     | —        | —      | **R** |
| Desarrollo        | —       | C       | —     | **A**     | **R** | I       | —     | —        | C      | I     |
| QA & Testing      | —       | I       | —     | C         | C     | **R/A** | **R** | —        | —      | I     |
| Seguridad         | —       | —       | —     | C         | C     | —       | —     | **R/A**  | C      | I     |
| Despliegue        | **A**   | I       | —     | C         | C     | C       | —     | C        | **R**  | I     |

_R = Responsible, A = Accountable, C = Consulted, I = Informed_

### 2.2 Detalle por Rol

| Rol                 | Responsabilidades SDLC                                        | Skills que usa                                                           | Artefactos que produce       |
| ------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------ | ---------------------------- |
| **PME**             | Business Case, Change Requests, Retrospectivas, governance    | business-case, change-request, retrospective                             | BC, CR, Retro report         |
| **PO / Producto**   | PRD Funcional, User Stories, priorización, sign-off funcional | prd-funcional, user-stories, lidr-requirements (per-rf mode)             | PRD-F, US, RFs               |
| **R&D / Core**      | PRD Técnico, PoC, arquitectura, validación técnica            | prd-tecnico, poc-report                                                  | PRD-T, PoC report            |
| **Tech Lead**       | ADR, code review, rules config, DoD enforcement               | adr, tech-debt, pr-description                                           | ADRs, rules/, tech debt log  |
| **Dev**             | Implementación, PR, handoff QA, tech debt tracking            | pr-description, dev-handoff-qa                                           | PRs, handoffs, código        |
| **QA Lead**         | Test plan, sign-off QA, regression strategy                   | test-plan, test-execution-report, regression-suite                       | Test plan, sign-off, reports |
| **QA**              | Test cases, ejecución, bug reports                            | create-test-cases, bug-report                                            | Test cases, bug reports      |
| **Security / CISO** | Vuln assessment, DAST, pen test, sign-off                     | vuln-assessment, dast-interpretation, pentest-report, security-checklist | Vuln reports, sign-off       |
| **DevOps**          | CI/CD, entornos, rollback plans, deploy                       | rollback-plan, release-notes                                             | Pipelines, rollback plans    |
| **Scrum Master**    | Facilitación, capacity, refinement notes, métricas            | sprint-capacity, refinement-notes                                        | Capacity, retro facilitation |

---

## 3. Política de Gates

### 3.1 Principio Fundamental

> **Ningún artefacto avanza sin pasar su gate. Sin excepciones excepto hotfix documentado.**

### 3.2 Gates del SDLC

| Gate           | Fase              | Quién aprueba     | Criterios clave                                                                | Checklist/Signoff                                                                                                       |
| -------------- | ----------------- | ----------------- | ------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| **Gate 0**     | Originación       | Sponsor ejecutivo | BC completo, presupuesto identificado, alineación roadmap                      | —                                                                                                                       |
| **Gate 1**     | Discovery/PRD     | Producto + R&D    | PRDs completos, review cruzado aprobado, riesgos identificados                 | `skills/review-cruzado/checklists/review-cruzado.md`                                                                    |
| **Gate 2**     | Especificación RF | Producto + QA     | RFs completos, coherencia validada, testables, dependency map                  | `skills/lidr-requirements/checklists/rf-coherence.md`                                                                   |
| **Gate 3**     | Sprint Planning   | PO + Tech Lead    | US cumplen DoR, estimación completada, capacity confirmada, commitment firmado | `skills/refinement-notes/checklists/dor.md`, `docs/standards/sprint-commitment.md`                                      |
| **Gate 4**     | Desarrollo        | Tech Lead + peers | Code review aprobado, tests green, SAST/SCA limpio, handoff generado           | `skills/pr-description/checklists/dod.md`                                                                               |
| **Gate 5**     | QA                | QA Lead           | Todos los TC ejecutados, 0 bugs bloqueantes/críticos, sign-off firmado         | `skills/test-execution-report/signoffs/qa-signoff.md`                                                                   |
| **Gate 6**     | Seguridad         | CISO              | DAST + pen test completos, 0 vuln críticas/altas, compliance verificado        | `skills/security-checklist/signoffs/security-signoff.md`, `skills/security-checklist/checklists/security-compliance.md` |
| **Gate Final** | Deploy            | Comité de Cambios | Change request aprobado, rollback plan documentado, release notes listas       | —                                                                                                                       |

### 3.3 Override de Emergencia (Hotfix)

| Condición                  | Proceso                                                                                                                                                                      |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Incidente P1 en producción | Se permite bypass de gates con: (1) Ticket Hotfix, (2) Aprobación Tech Lead + CISO, (3) Deuda de gates registrada como follow-up, (4) Postmortem obligatorio post-resolución |

---

## 4. Política de Seguridad

### 4.1 Zero Tolerance

| Regla                                           | Detalle                                            | Enforced por                                          |
| ----------------------------------------------- | -------------------------------------------------- | ----------------------------------------------------- |
| 0 vulnerabilidades Críticas/Altas en producción | No negociable — siempre se remedia antes de deploy | Skill security-checklist (manual) + Security sign-off |
| SAST/SCA en cada PR                             | SonarQube obligatorio, resultados revisados        | CI pipeline + Hook dtc-write-guard (PreToolUse)       |
| DAST obligatorio pre-release                    | OWASP ZAP mínimo, Burp Suite recomendado           | Gate 6 criteria                                       |
| Pen testing para features sensibles             | Datos biométricos, pagos, auth, admin              | Security Lead decide scope                            |

### 4.2 Datos Biométricos

| Regulación      | Requisito                                                      | Verificación     |
| --------------- | -------------------------------------------------------------- | ---------------- |
| **GDPR Art. 9** | Consentimiento explícito para datos biométricos                | Legal + DPIA     |
| **eIDAS**       | Estándares de identidad electrónica si aplica                  | Legal + Security |
| **Cifrado**     | AES-256-GCM para templates biométricos, keys en KMS            | Security review  |
| **Retención**   | Política de retención definida, derecho al olvido implementado | Audit            |
| **Acceso**      | Logging completo de accesos a datos biométricos                | SIEM monitoring  |

### 4.3 Secrets Management

| Regla                  | Detalle                                                |
| ---------------------- | ------------------------------------------------------ |
| 0 secrets en código    | API keys, passwords, tokens → Vault/KMS exclusivamente |
| Key rotation           | Mínimo cada 90 días para keys de producción            |
| Separación de entornos | Keys diferentes para dev/staging/prod                  |
| Audit trail            | Todo acceso a secrets loggeado                         |

---

## 5. Política de Documentación

### 5.1 Idioma

| Tipo                     | Idioma  | Ejemplo                                        |
| ------------------------ | ------- | ---------------------------------------------- |
| Documentación de negocio | Español | Business Case, PRDs, release notes ejecutivas  |
| Código y docs técnicos   | Inglés  | Variables, funciones, comments, ADRs, README   |
| Commits                  | Inglés  | Conventional Commits: `feat:`, `fix:`, `docs:` |
| Skills/Rules/Commands    | Español | SKILL.md, rules, docs/                         |

### 5.2 Ubicación

| Artefacto                | Ubicación             | Formato                      |
| ------------------------ | --------------------- | ---------------------------- |
| Documentación de negocio | Confluence            | Wiki pages                   |
| Tracking                 | Jira                  | Issues, Epics, User Stories  |
| Código                   | GitHub                | Repos con branching strategy |
| Skills y rules           | `.claude/` en el repo | Markdown                     |
| Fuente de verdad         | `docs/` en el repo    | Markdown                     |
| Test cases               | TestRail / Xray       | Test management format       |

### 5.3 Versionado y Trazabilidad

| Principio               | Detalle                                                  |
| ----------------------- | -------------------------------------------------------- |
| Todo versionado         | Documentos con historial de cambios (quién, cuándo, qué) |
| Trazabilidad end-to-end | Business Case → PRD → RF → US → PR → Test Case → Release |
| Conventional Commits    | `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:` |
| Semantic Versioning     | Releases siguen SemVer: MAJOR.MINOR.PATCH                |

---

## 6. Política de Métricas

### 6.1 Métricas de Proceso (Sprint-level)

| Métrica                      | Target                | Medición                                  | Fuente       |
| ---------------------------- | --------------------- | ----------------------------------------- | ------------ |
| Velocity (horas completadas) | Estable ±10%          | Sprint over sprint                        | Jira         |
| Carryover %                  | ≤15%                  | US no completadas / comprometidas         | Jira         |
| Bug count per sprint         | Tendencia descendente | Bugs reportados en sprint                 | Jira         |
| DoR compliance               | 100%                  | US que pasan DoR / US en sprint           | Skill + Jira |
| DoD compliance               | ≥95%                  | Tickets que pasan DoD / total completados | Hook + Jira  |

### 6.2 Métricas de Entrega (Release-level)

| Métrica             | Target                | Medición                                    | Fuente            |
| ------------------- | --------------------- | ------------------------------------------- | ----------------- |
| Lead time           | Tendencia descendente | Días desde commit hasta producción          | GitHub + CI/CD    |
| Deploy frequency    | ≥1/sprint             | Deploys a producción por sprint             | CI/CD             |
| Gate pass rate      | ≥90% first attempt    | Gates pasados al primer intento / total     | Tracking manual   |
| Change failure rate | ≤5%                   | Deploys que causan rollback / total deploys | CI/CD + Incidents |
| MTTR                | ≤4 horas              | Tiempo medio de restauración post-incidente | Incident tracking |

### 6.3 Métricas de Calidad

| Métrica                | Target                 | Fuente                                |
| ---------------------- | ---------------------- | ------------------------------------- |
| Test pass rate         | ≥95%                   | TestRail                              |
| Bug escape rate        | ≤2%                    | Bugs en prod / total bugs encontrados |
| SAST/SCA clean rate    | 100% (0 Critical/High) | SonarQube                             |
| Code review turnaround | ≤4 horas               | GitHub                                |

---

## 7. Política de Comunicación

### 7.1 Canales

| Canal           | Uso                                 | SLA respuesta |
| --------------- | ----------------------------------- | ------------- |
| #engineering    | Anuncios técnicos, decisiones       | —             |
| #releases       | Deploy notifications, release notes | —             |
| #incidents      | Incidentes P1/P2 en tiempo real     | 15 min        |
| #standup-{team} | Async standups diarios              | EOD           |
| Jira comments   | Discusiones de tickets, decisiones  | 4 horas       |
| PR comments     | Code review, technical discussion   | 4 horas       |

### 7.2 Escalamiento

| Nivel       | Criterio                           | A quién                   | Tiempo    |
| ----------- | ---------------------------------- | ------------------------- | --------- |
| L1          | Impedimento resuelto por el equipo | Scrum Master              | Inmediato |
| L2          | Impedimento entre equipos          | Tech Lead + SM            | 4 horas   |
| L3          | Impedimento organizacional         | Engineering Manager       | 1 día     |
| P1 Incident | Producción afectada                | On-call → Tech Lead → CTO | 15 min    |

---

## 8. Conexión con el Ecosistema .claude/

Este documento es la fuente de verdad organizacional. La rule `org.md` lo referencia:

```
# En .claude/rules/org.md:
@../standards/org.md    → Este documento (estándares de organización)
skills/refinement-notes/checklists/dor.md   → Definition of Ready (self-contained)
skills/pr-description/checklists/dod.md   → Definition of Done (self-contained)
skills/test-execution-report/signoffs/qa-signoff.md → Sign-off QA (self-contained)
skills/security-checklist/signoffs/security-signoff.md → Sign-off Seguridad (self-contained)
```

### Inventario Completo

| Tipo                  | Cantidad | Ubicación                              |
| --------------------- | -------- | -------------------------------------- |
| Skills                | 38       | `.claude/skills/*/SKILL.md`            |
| Rules                 | 5        | `.claude/rules/*.md` → refs `docs/`    |
| Commands              | 12       | `.claude/commands/*.md`                |
| Hooks                 | 4        | `.claude/settings.json`                |
| MCPs                  | 5        | `.mcp.json`                            |
| Docs (checklists)     | 0 ✨     | Integrated into `skills/*/checklists/` |
| Docs (signoffs)       | 0 ✨     | Integrated into `skills/*/signoffs/`   |
| Docs (standards)      | 4        | `docs/standards/*.md`                  |
| Docs (templates)      | 0 ✨     | Integrated into `skills/*/templates/`  |
| Docs (projects)       | 1        | `docs/projects/*.md`                   |
| Docs (audits)         | 1        | `docs/audits/*.md`                     |
| Agents (planificados) | 6        | Evolución futura de commands           |
| **Total artefactos**  | **191**  | **Actualizado - ver CLAUDE.md**        |

---

_Documento mantenido por CTO / Engineering Leads._
_Cambios requieren revisión y aprobación. Se re-evalúa trimestralmente._
