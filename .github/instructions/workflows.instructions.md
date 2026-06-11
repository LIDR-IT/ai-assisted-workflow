---
description: LIDR SDLC: Workflow orchestration map — authorized roles per command, gate preconditions, skill chaining. Load when executing a command, evaluating a gate, or checking role permissions.
applyTo: "**"
---

# Rule: Workflow Orchestration Map

> **Nivel**: Rule (contexto bajo demanda)
> **Carga**: Bajo demanda — se carga automáticamente cuando se ejecuta un command o se consulta el workflow SDLC.
> **Propósito**: Define QUIÉN puede ejecutar QUÉ comando, en qué ORDEN, y cómo se encadenan.
> **La IA lee esta rule ANTES de ejecutar cualquier command** para verificar:
>
> 1. ¿El rol del humano tiene permiso para este command?
> 2. ¿Las precondiciones (gates anteriores) se cumplieron?
> 3. ¿Qué commands se encadenan después?


## 1. Catálogo de Commands por Tier

### Tier 1 — Orchestrators (encadenan múltiples skills + MCPs)

| Command                              | Propósito                                                                             | Roles Autorizados                                  | Precondición                      |
| ------------------------------------ | ------------------------------------------------------------------------------------- | -------------------------------------------------- | --------------------------------- |
| `/lidr-advance-gate [N]`             | Evalúa gate, genera handoff, transiciona fase                                         | PME, PO, Tech Lead, QA Lead, Security Lead, DevOps | Gate N-1 PASS                     |
| `/lidr-implement-ticket [ID]`        | Dev workflow completo: ticket → PR → handoff QA                                       | Dev, Tech Lead                                     | Ticket status "Ready for Dev"     |
| `/lidr-prepare-testing [ID]`         | Genera suite de testing completa                                                      | QA, QA Lead                                        | Ticket status "Ready for QA"      |
| `/lidr-validate-requirements [name]` | Orquesta Fase 3: genera RFs + NFRs, valida RTM, epic breakdown                        | PO, Tech Lead                                      | Gate 1 PASS (PRDs aprobados)      |
| `/lidr-validate-prd [name]`          | LIDR SDLC PRD quality validation con scoring automático y recomendaciones accionables | PO, Tech Lead, QA Lead, PME                        | PRDs en draft completados         |
| `/lidr-init-project-docs [name]`     | Crea documentación de proyecto desde templates                                        | Tech Lead, PO, PME                                 | Proyecto nuevo aprobado           |
| `/lidr-validate-project-docs [name]` | Valida docs contra criterios de templates                                             | Tech Lead, PO, QA Lead, PME                        | Docs existentes en docs/projects/ |

> **Nota — `lidr-validate-requirements` (verbo vs motor):** `/lidr-validate-requirements` es el **comando orquestador** de Fase 3 (encadena `lidr-generate-rf` + `lidr-generate-nfr` + el motor RTM + `bmad-create-epics-and-stories`). Existe además una **skill** homónima `lidr-validate-requirements` que es el motor RTM / validación 5-pass; está marcada `user-invocable: false`, así que el slash `/lidr-validate-requirements` siempre resuelve al comando y la skill se alcanza por delegación. Ver `docs/adr/ADR-0007-command-skill-name-resolution.md`.

### Tier 2 — Tactical (workflow enfocado, pueden invocarse standalone o encadenados)

| Command                            | Propósito                                                     | Roles Autorizados                  | Precondición                   |
| ---------------------------------- | ------------------------------------------------------------- | ---------------------------------- | ------------------------------ |
| `/lidr-create-release-notes`       | Genera changelog desde PRs mergeados                          | DevOps, Tech Lead, Release Manager | PRs mergeados desde último tag |
| `/lidr-create-branch [ID]`         | Crea feature branch desde ticket Jira                         | Dev, Tech Lead                     | Ticket asignado al dev         |
| `/lidr-create-pr [ID]`             | Crea PR con description auto-generada                         | Dev, Tech Lead                     | Branch con commits listos      |
| `/lidr-quick-spec [feature]`       | Especificación ligera para features ≤40h                      | PO, Tech Lead, Dev                 | Feature < 40h effort estimate  |
| `/lidr-update-changelog [version]` | Actualiza CHANGELOG.md con version nueva                      | DevOps, Tech Lead, Release Manager | Release notes generadas        |
| `/lidr-sync-docs [scope]`          | Sincroniza documentación tras cambios de código               | Dev, Tech Lead, QA Lead            | Cambios mergeados              |
| `/lidr-sprint-health [sprint-id]`  | Monitoreo activo de salud del sprint con detección de riesgos | SM, PME, Tech Lead, QA Lead        | Sprint activo en progreso      |

### Tier 2 — LIDR Spec Lifecycle (granular per-change workflow, Phase 4 · development)

Native LIDR change-lifecycle commands — paridad con el patrón specboot, implementado dentro del ecosistema LIDR sin dependencias externas. Cada change es un directorio versionable en `docs/projects/{cliente}/changes/<name>/` con artefactos `proposal.md`, `design.md`, `spec.md`, `tasks.md`, `test-report.md` y `reports/`.

| Command                          | Propósito                                                                                | Roles Autorizados | Precondición                                      |
| -------------------------------- | ---------------------------------------------------------------------------------------- | ----------------- | ------------------------------------------------- |
| `/lidr-spec-new [name]`          | Crea el change container con scaffold vacío                                              | Dev, Tech Lead    | Ticket asignado o decisión técnica clara          |
| `/lidr-spec-ff [name]`           | Fast-forward planning: genera proposal+design+spec+tasks en un pase (requiere Opus high) | Dev, Tech Lead    | Container creado + Enriched US disponible         |
| `/lidr-spec-apply [name]`        | Implementa task-by-task; AGENT MUST EXECUTE unit + curl + Playwright                     | Dev, Tech Lead    | tasks.md válido (post-ff)                         |
| `/lidr-spec-verify [name]`       | Verificación final: re-ejecuta tests, detecta docs drift, escribe test-report.md         | Dev, Tech Lead    | Apply completo                                    |
| `/lidr-spec-archive [name]`      | Mueve a `changes/archive/YYYY-MM-DD-<name>/` y actualiza índices                         | Dev, Tech Lead    | test-report verdict PASSED (o WARNINGS aceptadas) |
| `/lidr-spec-continue [name]`     | Diagnostica estado y retoma change pausado                                               | Dev, Tech Lead    | Container existente                               |
| `/lidr-spec-bulk-archive [glob]` | Archiva todos los changes con verdict PASSED                                             | Tech Lead         | Múltiples changes verificados                     |

> El subagent **`lidr-spec-orchestrator`** orquesta el lifecycle end-to-end (new → ff → apply → verify → archive) cuando el usuario quiere ejecutar todo en un shot.
>
> La skill **`lidr-run-parallel-tasks`** lanza N changes en paralelo en worktrees aislados (usa `lidr-using-git-worktrees`).
>
> Rules aplicables: `lidr-sdlc/spec-execution.md` (mandatory steps) y `lidr-sdlc/model-selection.md` (Opus high para planning).

### Tier 3 — Utility (informacional, sin efectos secundarios)

| Command              | Propósito                                                       | Roles Autorizados | Precondición |
| -------------------- | --------------------------------------------------------------- | ----------------- | ------------ |
| `/lidr-help [query]` | Busca en el ecosistema y recomienda skills, commands, workflows | TODOS             | Ninguna      |


## 2. Matriz de Roles → Commands

```
                                PME  PO  TL  Dev  QA  Sec  DevOps  SM
/lidr-advance-gate               ✅   ✅   ✅   ❌   ✅   ✅   ✅    ❌
/lidr-implement-ticket           ❌   ❌   ✅   ✅   ❌   ❌   ❌    ❌
/lidr-prepare-testing            ❌   ❌   ❌   ❌   ✅   ❌   ❌    ❌
/lidr-validate-requirements      ❌   ✅   ✅   ❌   ❌   ❌   ❌    ❌
/lidr-validate-prd               ✅   ✅   ✅   ❌   ✅   ❌   ❌    ❌
/lidr-init-project-docs          ✅   ✅   ✅   ❌   ❌   ❌   ❌    ❌
/lidr-validate-project-docs      ✅   ✅   ✅   ❌   ✅   ❌   ❌    ❌
/lidr-create-release-notes       ❌   ❌   ✅   ❌   ❌   ❌   ✅    ❌
/lidr-create-branch              ❌   ❌   ✅   ✅   ❌   ❌   ❌    ❌
/lidr-create-pr                  ❌   ❌   ✅   ✅   ❌   ❌   ❌    ❌
/lidr-quick-spec                 ❌   ✅   ✅   ✅   ❌   ❌   ❌    ❌
/lidr-update-changelog           ❌   ❌   ✅   ❌   ❌   ❌   ✅    ❌
/lidr-sync-docs                  ❌   ❌   ✅   ✅   ✅   ❌   ❌    ❌
/lidr-sprint-health              ✅   ❌   ✅   ❌   ✅   ❌   ❌    ✅
/lidr-spec-new                   ❌   ❌   ✅   ✅   ❌   ❌   ❌    ❌
/lidr-spec-ff                    ❌   ❌   ✅   ✅   ❌   ❌   ❌    ❌
/lidr-spec-apply                 ❌   ❌   ✅   ✅   ❌   ❌   ❌    ❌
/lidr-spec-verify                ❌   ❌   ✅   ✅   ❌   ❌   ❌    ❌
/lidr-spec-archive               ❌   ❌   ✅   ✅   ❌   ❌   ❌    ❌
/lidr-spec-continue              ❌   ❌   ✅   ✅   ❌   ❌   ❌    ❌
/lidr-spec-bulk-archive          ❌   ❌   ✅   ❌   ❌   ❌   ❌    ❌
/lidr-help                       ✅   ✅   ✅   ✅   ✅   ✅   ✅    ✅
```

### Roles Definidos

| Abrev. | Rol Completo                | Responsabilidad Principal                               |
| ------ | --------------------------- | ------------------------------------------------------- |
| PME    | Project Manager / Execution | Governance, gates, stakeholders                         |
| PO     | Product Owner               | Valor de negocio, priorización, validación funcional    |
| TL     | Tech Lead / R&D Lead        | Decisiones técnicas, architecture, calidad de código    |
| Dev    | Developer                   | Implementación, tests, PRs                              |
| QA     | QA Engineer / QA Lead       | Testing, calidad, sign-off                              |
| Sec    | Security Lead / CISO        | Vulnerabilidades, compliance, security sign-off         |
| DevOps | DevOps Engineer             | CI/CD, despliegue, infraestructura, monitoring          |
| SM     | Scrum Master                | Facilitación, impedimentos, sprint ceremonies, capacity |


## 3. Flujo Completo del SDLC — Quién ejecuta qué, cuándo

> **Taxonomía unificada** (ver `.agents/_shared/lidr/UNIFIED-PHASES.md`): las fases
> siguen la numeración BMad — Phase 0 Context & Anytime, Phase 1 Analysis, Phase 2
> Planning, Phase 3 Solutioning (stages: specification + sprint-planning), Phase 4
> Implementation (stages: development + qa + security + release). Los gates G0-G7
> conservan sus IDs. Las etiquetas "ex-Fase N" referencian la antigua numeración LIDR.

```
PHASE 0 — CONTEXT (obligatoria en brownfield; opcional en greenfield)
  TL ejecuta:
    bmad-document-project          → Inventario de docs del proyecto existente
    bmad-generate-project-context  → project-context.md (contexto LLM)
    /lidr-init-project-docs        → Scaffold docs/projects/{cliente}/
    (rules org/project/tech-stack configuradas para el cliente activo)
  ▸ Checklist "Context Ready" — evidencia brownfield evaluada en Gate 0

PHASE 1 — ANALYSIS (ex-Fase 1 Originación)
  PME ejecuta:
    lidr-business-case     → Genera Business Case
    lidr-kickoff           → Genera Acta de Kick-off
    lidr-stakeholder-map   → Genera Stakeholder Map
    lidr-tracking-integration → Crea proyecto en herramienta de seguimiento (Jira/Linear/Notion)
  PME ejecuta:
    /lidr-advance-gate 0          → Valida Gate 0, genera Handoff Package
                              → AUTO: crea subtareas PRD en Jira
                              → AUTO: notifica PO + R&D

PHASE 2 — PLANNING (ex-Fase 2 Discovery & PRD; BMad-driven, LIDR wrappers)
  PO + TL ejecutan:
    bmad-prd                 → PRD unificado (F+T en un solo doc)
    lidr-review-cruzado    → 🔴 Gate 1 enforcer: valida F+T sections completas
    lidr-risk-log          → 🟡 Risk registry (LIDR-formal)
    bmad-technical-research  → PoC si aplica (con GO/NO-GO format)
  PO + QA + TL ejecutan:
    /lidr-validate-prd my-project → LIDR SDLC 13-step validation, scoring, recomendaciones
                              → AUTO: detecta gaps críticos, genera action plan
                              → AUTO: scoring cuantitativo para Gate 1 decision
  PO ejecuta:
    /lidr-advance-gate 1          → Valida Gate 1, genera Handoff
                              → AUTO: invoca skill lidr-generate-rf (borrador)
                              → AUTO: notifica equipo de Especificación

PHASE 3 — SOLUTIONING · stage specification (ex-Fase 3 Especificación)
  PO ejecuta:
    lidr-generate-rf       → Genera RFs con BDD desde PRDs
  TL ejecuta:
    lidr-generate-nfr      → Genera NFRs standalone medibles desde PRD-T §5
  PO + TL ejecutan:
    lidr-validate-requirements → Valida RFs + NFRs, genera RTM, detecta gaps
    (verifican coherencia con checklists)
  PO + TL ejecutan:
    bmad-create-epics-and-stories    → Descompone épica master en sub-épicas desde requisitos validados
  PO ejecuta:
    /lidr-advance-gate 2          → Valida Gate 2 (coherencia, testabilidad, RTM completo)
                              → AUTO: invoca skill lidr-user-stories (borrador)
                              → AUTO: notifica SM para Sprint Planning

PRE-IMPLEMENTACIÓN (readiness = evidencia de Gate 3, ya no un command aparte)
  PO/TL ejecuta:
    bmad-check-implementation-readiness → completitud de specs (PRD/UX/Arch/Epics)
    lidr-sprint-capacity              → capacidad con buffer 15-20%
    /lidr-advance-gate 3            → evalúa readiness vía _shared/lidr/gate-evidence.yaml (G3):
      ├── specs completas (bmad-check-implementation-readiness)
      ├── capacidad confirmada (lidr-sprint-capacity)
      ├── checklist: equipo asignado, skill-gap, infra/deps externas, DoR por US
      └── verdicto PASS/CONDITIONAL/FAIL = go/no-go (role-gated)

PHASE 3 — SOLUTIONING · stage sprint-planning (ex-Fase 4 Sprint Planning)
  PO ejecuta:
    lidr-user-stories      → Genera US con BDD desde RFs (refina el esqueleto épica→story de
                             bmad-create-epics-and-stories de G2; las US LIDR son el backlog
                             comprometido que consume bmad-sprint-planning — no es un backlog paralelo)
  SM ejecuta:
    lidr-sprint-capacity   → Calcula capacidad (input de bmad-sprint-planning: aporta la cifra de
                             capacidad comprometible — productor→consumidor, no solapan)
    lidr-refinement-notes  → Documenta refinement + checklist DoR (item bloqueante del G3)
  PO + TL ejecutan:
    (firman sprint commitment)
  PO ejecuta:
    /lidr-advance-gate 3          → Valida Gate 3 (DoR, capacity, commitment)
                              → AUTO: crea sprint en Jira
                              → AUTO: asigna US a devs
                              → AUTO: notifica equipo de Dev

PHASE 4 — IMPLEMENTATION · stage development (ex-Fase 5; por cada ticket)
  Dev ejecuta:
    /lidr-create-branch [ID]      → Crea feature branch desde Jira
    /lidr-implement-ticket [ID]   → Workflow completo (o ejecuta pasos individuales):
      ├── skill: lidr-pr-description    → Auto-genera PR description
      ├── skill: lidr-dev-handoff-qa    → Genera handoff
      ├── skill: lidr-tech-debt         → Registra deuda si la detecta
      ├── skill: lidr-adr               → Genera ADR si hay decisión arquitectónica
      ├── hook: lidr-frontmatter-guard  → Valida frontmatter docs (DTC) en PreToolUse:Write|Edit
      └── /lidr-create-pr [ID]          → Crea PR (puede ser standalone)

  Dev ejecuta (LIDR Spec Lifecycle — granular per-change, opcional):
    /lidr-spec-new <name>    → Crea docs/projects/<cliente>/changes/<name>/ con scaffold
    /lidr-spec-ff <name>     → Fast-forward planning (Opus high reasoning)
                              ├── skill: bmad-prd           → proposal.md (+ lidr-review-cruzado Gate-1)
                              ├── skill: bmad-create-architecture → design.md (+ lidr-adr)
                              ├── skill: lidr-generate-rf   → spec.md (RFs + NFRs)
                              └── skill: lidr-user-stories  → tasks.md (con mandatory steps)
    /lidr-spec-apply <name>  → Implementa task-by-task (Sonnet medium)
                              ├── rule: spec-execution.md   → AGENT MUST EXECUTE tests
                              ├── reports/                  → un report por mandatory step
                              └── tasks.md                  → [x] tras cada task completada
    /lidr-spec-verify <name> → Re-ejecuta tests, detecta docs drift, escribe test-report.md
    /lidr-spec-archive <name>→ Mueve a changes/archive/YYYY-MM-DD-<name>/
    /lidr-create-pr [ID]          → PR referencia el ticket + el change archivado

  TL ejecuta (paralelización opcional):
    skill: lidr-run-parallel-tasks → Lanza N changes en worktrees aislados
                                   → cada sub-agente corre el pipeline completo

  TL ejecuta:
    /lidr-advance-gate 4          → Agregador: ¿todos los tickets del sprint PASS?
                              → AUTO: notifica QA team

PHASE 4 — IMPLEMENTATION · stage qa (ex-Fase 6; por cada ticket)
  QA ejecuta:
    /lidr-prepare-testing [ID]    → Genera suite de testing
      ├── skill: bmad-testarch-test-design → Test plan
      ├── skill: lidr-create-test-cases → Test cases BDD
      ├── skill: lidr-bug-report        → Estructura bug reports
      ├── skill: lidr-test-execution-report → Interpreta resultados
      └── skill: bmad-testarch-automate    → Suite de regresión
  QA Lead ejecuta:
    /lidr-advance-gate 5          → Valida Gate 5 (QA sign-off)
                              → AUTO: invoca skill lidr-security-checklist
                              → AUTO: notifica Security team

PHASE 4 — IMPLEMENTATION · stage security (ex-Fase 7)
  Sec ejecuta:
    lidr-vuln-assessment     → Interpreta SAST/SCA
    lidr-dast-interpretation → Interpreta DAST
    lidr-pentest-report      → Pen test report
    lidr-security-checklist  → OWASP Top 10
  Sec ejecuta:
    /lidr-advance-gate 6          → Valida Gate 6 (Security sign-off)
                              → AUTO: invoca skill lidr-change-request + lidr-rollback-plan
                              → AUTO: notifica DevOps + PME

PHASE 4 — IMPLEMENTATION · stage release (ex-Fase 8)
  DevOps ejecuta:
    /lidr-create-release-notes    → Genera changelog
    /lidr-update-changelog [ver]  → Actualiza CHANGELOG.md
  PME ejecuta:
    /lidr-advance-gate 7          → Valida Gate Final (CR aprobado, rollback, release notes)
                              → AUTO: deploy pipeline
                              → AUTO: hook notify alerta al equipo
                              → AUTO: notifica #releases

POST-DEPLOY
  TL ejecuta:
    /lidr-sync-docs               → Actualiza docs con cambios del release
    /lidr-validate-project-docs   → Verifica que docs reflejan realidad
  PME + TL ejecutan:
    bmad-retrospective       → Review de épica + retro data-driven (cubre lo que era epic-review + retrospective)
  PME ejecuta:
    lidr-postmortem        → 🔴 Postmortem solo si hubo incidente (Five Whys blameless)
```


## 4. Encadenamiento de Commands

### Cadena típica: Nuevo Proyecto

```
/lidr-init-project-docs my-project           → PME/TL crea docs
  ↓
(equipo trabaja en docs)
  ↓
/lidr-validate-project-docs my-project       → TL valida completitud
  ↓
/lidr-advance-gate 0                         → PME abre Discovery
  ↓
...ciclo SDLC continúa...
```

### Cadena típica: Sprint Completo

```
/lidr-advance-gate 3                         → PO confirma sprint
  ↓
/lidr-create-branch PROJ-123                 → Dev crea branch
/lidr-implement-ticket PROJ-123              → Dev implementa
/lidr-create-pr PROJ-123                     → Dev crea PR (o auto desde implement)
  ↓
/lidr-advance-gate 4                         → TL confirma sprint dev completo
  ↓
/lidr-prepare-testing PROJ-123               → QA prepara testing
/lidr-advance-gate 5                         → QA sign-off
  ↓
/lidr-advance-gate 6                         → Security sign-off
  ↓
/lidr-create-release-notes                   → DevOps genera release notes
/lidr-update-changelog v1.2.0               → DevOps actualiza CHANGELOG
/lidr-advance-gate 7                         → PME deploy a PROD
  ↓
/lidr-sync-docs architecture                 → TL actualiza docs
/lidr-validate-project-docs my-project       → TL verifica docs
```

### Cadena típica: LIDR Spec Lifecycle (per-change granular)

```
ENRICHED USER STORY (de Jira o inline)
  ↓
/lidr-spec-new add-item-soft-delete       → Dev/TL crea container
  ↓
/lidr-spec-ff add-item-soft-delete        → Genera proposal+design+spec+tasks (Opus high)
  ↓
/lidr-spec-apply add-item-soft-delete     → Implementa task-by-task (Sonnet medium)
                                            AGENT MUST EXECUTE unit + curl + Playwright
                                            Reports en changes/<name>/reports/
  ↓
/lidr-spec-verify add-item-soft-delete    → Re-ejecuta tests, escribe test-report.md
                                            Verdict: PASSED | WARNINGS | CRITICAL
  ↓ (si PASSED)
/lidr-spec-archive add-item-soft-delete   → Mueve a changes/archive/YYYY-MM-DD-<name>/
  ↓
/lidr-create-pr PROJ-123                        → PR referencia ticket + change archivado
```

End-to-end equivalente vía subagent:

```
"Implement add-item-soft-delete end-to-end"
  → lidr-spec-orchestrator subagent corre todo el ciclo
  → pausa en verdict WARNINGS/CRITICAL para decisión humana
```

Paralelización (sprint denso, varios changes a la vez):

```
parallel-tasks.md (con N task blocks)
  ↓
"run parallel-tasks.md"
  → skill lidr-run-parallel-tasks lanza N sub-agentes
  → cada uno en .worktrees/<name>/ aislado
  → pipeline completo por sub-agente, stop antes de archive
  ↓
TL inspecciona cada worktree, decide archive/PR manual
```

### Cadena típica: Hotfix

```
/lidr-create-branch PROJ-999                 → Dev crea branch desde hotfix
/lidr-implement-ticket PROJ-999              → Dev implementa fix
/lidr-create-pr PROJ-999                     → Dev crea PR a main
(QA fast-track testing)
/lidr-create-release-notes                   → DevOps genera patch notes
/lidr-update-changelog v1.2.1               → DevOps actualiza CHANGELOG
/lidr-advance-gate 7                         → PME fast-track deploy
/lidr-sync-docs                              → TL actualiza docs si aplica
```

### Cadena típica: Especificación Completa (Fase 3)

```
/lidr-advance-gate 1                         → PO confirma Discovery
  ↓
/lidr-validate-requirements my-project       → Orquesta Fase 3 completa:
  ├── skill: lidr-generate-rf                → RFs con BDD desde PRDs
  ├── skill: lidr-generate-nfr               → NFRs medibles desde PRD-T §5
  ├── skill: lidr-validate-requirements      → RTM + gap detection
  └── skill: bmad-create-epics-and-stories → Sub-épicas (rules: .agents/_shared/lidr/references/epic-decomposition-rules.md)
  ↓
/lidr-advance-gate 2                         → PO + TL validan Gate 2
  ↓
...Sprint Planning continúa...
```

### Cadena típica: Brownfield primera vez (Phase 0 Context primero)

```
bmad-document-project                   → Inventario docs + clasificación del proyecto
bmad-generate-project-context           → project-context.md (contexto LLM persistente)
/lidr-init-project-docs my-project           → Scaffold docs/projects/{cliente}/
(rules org/project/tech-stack configuradas para el cliente)
  ↓ Checklist "Context Ready" (evidencia brownfield de Gate 0)
lidr-business-case                    → BC de la iniciativa (no del producto entero)
/lidr-advance-gate 0                         → G0 con checklist Context Ready
  ↓
bmad-prd (update intent)                → PRD delta sobre docs existentes
  ↓ ...ciclo normal Phase 2 → 4 (regresión obligatoria en stage qa)...
```

### Cadena típica: Feature sobre producto en marcha (PRD desde funcionalidad extra)

```
PRE: Context Ready (Phase 0 viva) + producto con ≥1 ciclo completo
/lidr-enrich-ticket FEAT-123                 → Ticket enriquecido (completitud validada)
  ↓ bifurcación por tamaño
≤40h: /lidr-quick-spec feature               → Spec ligera → /lidr-spec-new → ff → apply →
                                          verify → archive → /lidr-create-pr (G4–G7 por ticket)
>40h: bmad-prd (feature PRD)            → Hereda project-context + PRD maestro
      /lidr-validate-requirements            → RFs del feature + epics delta + RTM incremental
      /lidr-advance-gate 2 → 3               → Specs + readiness del feature
      ...pipeline normal Phase 4...     → G4–G7
POST: PRD maestro actualizado en el mismo PR (DTC)
```

Ver `.agents/_shared/lidr/UNIFIED-PHASES.md` §3 para los flow audits completos
(greenfield/brownfield/feature/hotfix) con la cadena input/output de cada skill.

### Cadena típica: Catch-up (proyecto en marcha sin docs formales)

```
bmad-prd                                → PRD retroactivo (unificado F+T)
lidr-review-cruzado                   → Validación F+T sections
lidr-risk-log                         → Riesgos no documentados
/lidr-advance-gate 1                         → Gate 1 retroactivo (probablemente CONDITIONAL)
  ↓
/lidr-validate-requirements my-project       → RFs + NFRs + RTM + epic breakdown
/lidr-advance-gate 2                         → Gate 2 retroactivo
  ↓
lidr-user-stories                     → US con BDD desde RFs retroactivos
lidr-sprint-capacity                  → Capacidad real
/lidr-advance-gate 3                         → Sprint committed con DoR
  ↓
lidr-tech-debt                        → Cataloga deuda acumulada
lidr-adr                              → ADRs retroactivos
/lidr-validate-project-docs my-project       → Valida completitud final
```

### Cadena típica: Gestión de deuda técnica

```
lidr-tech-debt                        → Cataloga deuda del codebase (TL)
lidr-adr                              → ADR: estrategia refactor vs rewrite
lidr-user-stories                     → US técnicas con BDD
lidr-sprint-capacity                  → Reserva 20% capacity para debt
/lidr-implement-ticket PROJ-456              → Implementa refactoring
/lidr-create-pr PROJ-456                     → PR con descripción del debt payoff
/lidr-sync-docs                              → Actualiza docs afectados
```

### Cadena típica: Postmortem de incidente

```
lidr-bug-report                       → Documenta incidente
lidr-postmortem                       → Five Whys + root cause (blameless)
lidr-tech-debt                        → Registra deuda que causó incidente
lidr-adr                              → Decisión correctiva arquitectónica
bmad-testarch-automate                 → Amplía suite con caso del incidente
bmad-retrospective                    → Lecciones + action items
/lidr-sync-docs                              → Actualiza runbooks afectados
```

### Cadena típica: Onboarding de nuevo miembro

```
/lidr-help                                   → Explorar ecosistema interactivamente
rules/project.md                        → Contexto proyecto activo
rules/org.md                            → Estándares organizacionales
rules/tech-stack.md                     → Convenciones de código
rules/workflows.md                      → Quién ejecuta qué y cuándo
bmad-create-architecture                 → Revisar doc de arquitectura
/lidr-validate-project-docs my-project       → Estado actual de documentación
```

### Cadena típica: Scaffolding de repositorio

```
/lidr-init-project-docs my-project           → Scaffold desde templates (TL)
bmad-create-architecture                 → Doc arquitectura (Arc42/C4)
lidr-adr                              → ADR inicial: stack + patrón
/lidr-validate-project-docs my-project       → Audita repo vs cl-repo-structure
/lidr-advance-gate 0                         → Gate 0 con repo-structure checklist
```

### Cadena típica: Cerrar una épica (Epic Review)

```
bmad-retrospective                      → Plan vs actual + lecciones + retro data-driven
lidr-tech-debt                        → Consolida deuda acumulada
/lidr-sync-docs                              → Sincroniza docs final
/lidr-validate-project-docs my-project       → Valida completitud
```


## 5. Skills Cross-Cutting (no atados a una sola fase)

Los siguientes skills se usan transversalmente y no aparecen en una fase específica del flujo:

| Skill                      | Fases donde aplica                  | Descripción                                                                                                                                                               |
| -------------------------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `bmad-create-architecture` | F2 Discovery → F5 Dev → POST-DEPLOY | Genera/actualiza el doc de arquitectura (BMad-owned). Las DTC specs LIDR (`routes`/`components`/`storage`) viven en `.agents/_shared/lidr/templates/architecture/specs/`. |
| `bmad-ux`                  | F2 Discovery → F4 Planning          | Spec UX/UI desde PRD + wireframes (BMad-owned; LIDR envuelve su output, sin template propio)                                                                              |
| `bmad-sprint-planning`     | F4 Planning → F5 Dev                | Descompone proyecto en fases incrementales                                                                                                                                |
| `bmad-retrospective`       | POST-DEPLOY                         | Post-epic retro: plan vs actual, lecciones, follow-up (cubre lo que era epic-review)                                                                                      |


## 6. Hooks — Guardias automáticos activos

| Hook                             | Evento Claude Code       | Cuándo se dispara                               | Acción                                                                 |
| -------------------------------- | ------------------------ | ----------------------------------------------- | ---------------------------------------------------------------------- |
| `lidr-frontmatter-guard`         | PreToolUse: Write\|Edit  | Al escribir/editar .md en docs/ o .agents/      | Bloquea .md sin frontmatter YAML; warn por `last_updated` stale        |
| `lidr-load-context`              | SessionStart             | Al iniciar sesión                               | Carga docs de `context-manifest.yaml` (PROJECT_TYPE, DTC, counters)    |
| `lidr-validate-ecosystem-counts` | Stop                     | Al finalizar sesión                             | Sincroniza las 8 fuentes de verdad de counts; bloquea si detecta drift |
| `protect-secrets`                | PreToolUse: Write\|Edit  | Antes de tocar archivos sensibles               | Bloquea edición de `.env`, `.key`, `.pem`, secrets/                    |
| `auto-format`                    | PostToolUse: Edit\|Write | Tras cada Edit/Write                            | Ejecuta prettier sobre el archivo editado                              |
| `notify`                         | Notification             | Cuando la IA necesita input o termina una tarea | Notificación desktop macOS/Linux                                       |


## 7. Reglas de Ejecución para la IA

### Antes de ejecutar CUALQUIER command:

```
1. VERIFICAR ROL: ¿El humano tiene permiso? (ver matriz arriba)
   → Si NO: "Este comando requiere rol {X}. Tu rol actual: {Y}."

2. VERIFICAR PRECONDICIONES: ¿Gates anteriores PASS?
   → Si NO: "Gate {N-1} no pasado. Ejecutar /lidr-advance-gate {N-1} primero."
   → EXCEPCIÓN: Dev puede ejecutar /lidr-create-branch sin gate previo si tiene ticket asignado

3. VERIFICAR HERRAMIENTAS: ¿Herramientas necesarias disponibles?
   → Si acceso a Jira falta: DEGRADE (operar con contexto manual)
   → Si GitHub CLI falta: DEGRADE (instrucciones manuales para git)

4. CARGAR RULES: SIEMPRE antes de ejecutar
   → org.md → estándares
   → tech-stack.md → convenciones
   → project.md → contexto del proyecto
   → documentation.md → estándares de documentación
   → workflows.md → ESTA rule (para verificar permisos)
```

### Detección de rol del humano

```
La IA infiere el rol del humano por:
1. Contexto explícito: "Soy el QA Lead" → QA
2. Comando ejecutado: /lidr-prepare-testing → probablemente QA
3. Contexto del proyecto: rules/project.md define equipo y roles
4. Pregunta directa: "¿Cuál es tu rol en el equipo?"

Si el rol no está claro → PREGUNTAR antes de ejecutar commands restringidos
```


## 8. Evolución: De Commands a Agents

| Command                       | Cuándo evoluciona a Agent         | Señal de activación                                |
| ----------------------------- | --------------------------------- | -------------------------------------------------- |
| `/lidr-advance-gate`          | Tras ≥24 ejecuciones (3 por gate) | Artefactos completos detectados en Jira/Confluence |
| `/lidr-implement-ticket`      | Tras ≥30 tickets implementados    | Ticket asignado al dev + status "In Progress"      |
| `/lidr-prepare-testing`       | Tras ≥20 suites generadas         | Ticket con status "Ready for QA"                   |
| `/lidr-create-release-notes`  | Tras ≥10 releases                 | Tag creado en GitHub                               |
| `/lidr-sync-docs`             | Tras ≥10 syncs manuales           | PR mergeado con cambios en src/                    |
| `/lidr-validate-project-docs` | Tras ≥10 validaciones             | Commit en docs/projects/                           |

**Un command se promueve a agent cuando:**

1. ≥N ejecuciones exitosas sin intervención correctiva del humano
2. 0 falsos positivos o acciones incorrectas
3. El responsable del proceso confirma confianza
4. Se documenta en `.claude/agents/` con criterios de activación


## Changelog

| Versión | Fecha      | Autor                   | Cambios                                                                                                      |
| ------- | ---------- | ----------------------- | ------------------------------------------------------------------------------------------------------------ |
| 1.1.0   | 2026-06-10 | TL: ecosystem coherence | Commands/skills normalizados a nombres reales (`lidr-*`); §6 reescrita con los 6 hooks reales del ecosistema |
| 1.0.0   | 2026-03-25 | IA: sync-docs           | Versión base                                                                                                 |


_Esta rule se carga bajo demanda (via description) cuando se ejecuta un command o se consulta el workflow SDLC._
_Referencia: docs/standards/org.md para detalle de roles y gates._
