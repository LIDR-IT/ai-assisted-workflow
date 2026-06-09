---
name: lidr-sdlc-workflows
description: "LIDR SDLC: Workflow orchestration map — authorized roles per command, gate preconditions, skill chaining. Load when executing a command, evaluating a gate, or checking role permissions."
id: workflows
version: "1.0.0"
last_updated: "2026-03-25"
updated_by: "IA: sync-docs"
status: active
scope: workflow
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

---

## 1. Catálogo de Commands por Tier

### Tier 1 — Orchestrators (encadenan múltiples skills + MCPs)

| Command                         | Propósito                                                                             | Roles Autorizados                                  | Precondición                      |
| ------------------------------- | ------------------------------------------------------------------------------------- | -------------------------------------------------- | --------------------------------- |
| `/advance-gate [N]`             | Evalúa gate, genera handoff, transiciona fase                                         | PME, PO, Tech Lead, QA Lead, Security Lead, DevOps | Gate N-1 PASS                     |
| `/implement-ticket [ID]`        | Dev workflow completo: ticket → PR → handoff QA                                       | Dev, Tech Lead                                     | Ticket status "Ready for Dev"     |
| `/prepare-testing [ID]`         | Genera suite de testing completa                                                      | QA, QA Lead                                        | Ticket status "Ready for QA"      |
| `/validate-requirements [name]` | Orquesta Fase 3: genera RFs + NFRs, valida RTM, epic breakdown                        | PO, Tech Lead                                      | Gate 1 PASS (PRDs aprobados)      |
| `/validate-prd [name]`          | LIDR SDLC PRD quality validation con scoring automático y recomendaciones accionables | PO, Tech Lead, QA Lead, PME                        | PRDs en draft completados         |
| `/init-project-docs [name]`     | Crea documentación de proyecto desde templates                                        | Tech Lead, PO, PME                                 | Proyecto nuevo aprobado           |
| `/validate-project-docs [name]` | Valida docs contra criterios de templates                                             | Tech Lead, PO, QA Lead, PME                        | Docs existentes en docs/projects/ |

### Tier 2 — Tactical (workflow enfocado, pueden invocarse standalone o encadenados)

| Command                       | Propósito                                                     | Roles Autorizados                  | Precondición                   |
| ----------------------------- | ------------------------------------------------------------- | ---------------------------------- | ------------------------------ |
| `/create-release-notes`       | Genera changelog desde PRs mergeados                          | DevOps, Tech Lead, Release Manager | PRs mergeados desde último tag |
| `/create-branch [ID]`         | Crea feature branch desde ticket Jira                         | Dev, Tech Lead                     | Ticket asignado al dev         |
| `/create-pr [ID]`             | Crea PR con description auto-generada                         | Dev, Tech Lead                     | Branch con commits listos      |
| `/quick-spec [feature]`       | Especificación ligera para features ≤40h                      | PO, Tech Lead, Dev                 | Feature < 40h effort estimate  |
| `/update-changelog [version]` | Actualiza CHANGELOG.md con version nueva                      | DevOps, Tech Lead, Release Manager | Release notes generadas        |
| `/sync-docs [scope]`          | Sincroniza documentación tras cambios de código               | Dev, Tech Lead, QA Lead            | Cambios mergeados              |
| `/sprint-health [sprint-id]`  | Monitoreo activo de salud del sprint con detección de riesgos | SM, PME, Tech Lead, QA Lead        | Sprint activo en progreso      |

### Tier 2 — LIDR Spec Lifecycle (granular per-change workflow, Fase 5)

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

---

## 2. Matriz de Roles → Commands

```
                          PME  PO  TL  Dev  QA  Sec  DevOps  SM
/advance-gate              ✅   ✅   ✅   ❌   ✅   ✅   ✅    ❌
/implement-ticket          ❌   ❌   ✅   ✅   ❌   ❌   ❌    ❌
/prepare-testing           ❌   ❌   ❌   ❌   ✅   ❌   ❌    ❌
/validate-requirements     ❌   ✅   ✅   ❌   ❌   ❌   ❌    ❌
/validate-prd              ✅   ✅   ✅   ❌   ✅   ❌   ❌    ❌
/init-project-docs         ✅   ✅   ✅   ❌   ❌   ❌   ❌    ❌
/validate-project-docs     ✅   ✅   ✅   ❌   ✅   ❌   ❌    ❌
/create-release-notes      ❌   ❌   ✅   ❌   ❌   ❌   ✅    ❌
/create-branch             ❌   ❌   ✅   ✅   ❌   ❌   ❌    ❌
/create-pr                 ❌   ❌   ✅   ✅   ❌   ❌   ❌    ❌
/quick-spec                ❌   ✅   ✅   ✅   ❌   ❌   ❌    ❌
/update-changelog          ❌   ❌   ✅   ❌   ❌   ❌   ✅    ❌
/sync-docs                 ❌   ❌   ✅   ✅   ✅   ❌   ❌    ❌
/sprint-health             ✅   ❌   ✅   ❌   ✅   ❌   ❌    ✅
/lidr-spec-new             ❌   ❌   ✅   ✅   ❌   ❌   ❌    ❌
/lidr-spec-ff              ❌   ❌   ✅   ✅   ❌   ❌   ❌    ❌
/lidr-spec-apply           ❌   ❌   ✅   ✅   ❌   ❌   ❌    ❌
/lidr-spec-verify          ❌   ❌   ✅   ✅   ❌   ❌   ❌    ❌
/lidr-spec-archive         ❌   ❌   ✅   ✅   ❌   ❌   ❌    ❌
/lidr-spec-continue        ❌   ❌   ✅   ✅   ❌   ❌   ❌    ❌
/lidr-spec-bulk-archive    ❌   ❌   ✅   ❌   ❌   ❌   ❌    ❌
/lidr-help                      ✅   ✅   ✅   ✅   ✅   ✅   ✅    ✅
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

---

## 3. Flujo Completo del SDLC — Quién ejecuta qué, cuándo

```
FASE 1: ORIGINACIÓN
  PME ejecuta:
    skills/business-case     → Genera Business Case
    skills/kickoff           → Genera Acta de Kick-off
    skills/stakeholder-map   → Genera Stakeholder Map
    skills/tracking-integration → Crea proyecto en herramienta de seguimiento (Jira/Linear/Notion)
  PME ejecuta:
    /advance-gate 0          → Valida Gate 0, genera Handoff Package
                              → AUTO: crea subtareas PRD en Jira
                              → AUTO: notifica PO + R&D

FASE 2: DISCOVERY (BMad-driven, LIDR wrappers)
  PO + TL ejecutan:
    bmad-prd                 → PRD unificado (F+T en un solo doc)
    skills/review-cruzado    → 🔴 Gate 1 enforcer: valida F+T sections completas
    skills/risk-log          → 🟡 Risk registry (LIDR-formal)
    bmad-technical-research  → PoC si aplica (con GO/NO-GO format)
  PO + QA + TL ejecutan:
    /validate-prd my-project → LIDR SDLC 13-step validation, scoring, recomendaciones
                              → AUTO: detecta gaps críticos, genera action plan
                              → AUTO: scoring cuantitativo para Gate 1 decision
  PO ejecuta:
    /advance-gate 1          → Valida Gate 1, genera Handoff
                              → AUTO: invoca skill generate-rf (borrador)
                              → AUTO: notifica equipo de Especificación

FASE 3: ESPECIFICACIÓN
  PO ejecuta:
    skills/generate-rf       → Genera RFs con BDD desde PRDs
  TL ejecuta:
    skills/generate-nfr      → Genera NFRs standalone medibles desde PRD-T §5
  PO + TL ejecutan:
    skills/validate-requirements → Valida RFs + NFRs, genera RTM, detecta gaps
    (verifican coherencia con checklists)
  PO + TL ejecutan:
    bmad-create-epics-and-stories    → Descompone épica master en sub-épicas desde requisitos validados
  PO ejecuta:
    /advance-gate 2          → Valida Gate 2 (coherencia, testabilidad, RTM completo)
                              → AUTO: invoca skill user-stories (borrador)
                              → AUTO: notifica SM para Sprint Planning

PRE-IMPLEMENTACIÓN (readiness = evidencia de Gate 3, ya no un command aparte)
  PO/TL ejecuta:
    bmad-check-implementation-readiness → completitud de specs (PRD/UX/Arch/Epics)
    skills/sprint-capacity              → capacidad con buffer 15-20%
    /advance-gate 3            → evalúa readiness vía _shared/lidr/gate-evidence.yaml (G3):
      ├── specs completas (bmad-check-implementation-readiness)
      ├── capacidad confirmada (lidr-sprint-capacity)
      ├── checklist: equipo asignado, skill-gap, infra/deps externas, DoR por US
      └── verdicto PASS/CONDITIONAL/FAIL = go/no-go (role-gated)

FASE 4: SPRINT PLANNING
  PO ejecuta:
    skills/user-stories      → Genera US con BDD desde RFs
  SM ejecuta:
    skills/sprint-capacity   → Calcula capacidad
    skills/refinement-notes  → Documenta refinement
  PO + TL ejecutan:
    (firman sprint commitment)
  PO ejecuta:
    /advance-gate 3          → Valida Gate 3 (DoR, capacity, commitment)
                              → AUTO: crea sprint en Jira
                              → AUTO: asigna US a devs
                              → AUTO: notifica equipo de Dev

FASE 5: DESARROLLO (por cada ticket)
  Dev ejecuta:
    /create-branch [ID]      → Crea feature branch desde Jira
    /implement-ticket [ID]   → Workflow completo (o ejecuta pasos individuales):
      ├── skill: pr-description    → Auto-genera PR description
      ├── skill: dev-handoff-qa    → Genera handoff
      ├── skill: tech-debt         → Registra deuda si la detecta
      ├── skill: adr               → Genera ADR si hay decisión arquitectónica
      ├── hook: dtc-write-guard   → Valida DTC + DoD en PreToolUse:Write|Edit
      └── /create-pr [ID]          → Crea PR (puede ser standalone)

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
    /create-pr [ID]          → PR referencia el ticket + el change archivado

  TL ejecuta (paralelización opcional):
    skill: lidr-run-parallel-tasks → Lanza N changes en worktrees aislados
                                   → cada sub-agente corre el pipeline completo

  TL ejecuta:
    /advance-gate 4          → Agregador: ¿todos los tickets del sprint PASS?
                              → AUTO: notifica QA team

FASE 6: QA (por cada ticket)
  QA ejecuta:
    /prepare-testing [ID]    → Genera suite de testing
      ├── skill: bmad-testarch-test-design → Test plan
      ├── skill: create-test-cases → Test cases BDD
      ├── skill: bug-report        → Estructura bug reports
      ├── skill: test-execution-report → Interpreta resultados
      └── skill: bmad-testarch-automate    → Suite de regresión
  QA Lead ejecuta:
    /advance-gate 5          → Valida Gate 5 (QA sign-off)
                              → AUTO: invoca skill security-checklist
                              → AUTO: notifica Security team

FASE 7: SEGURIDAD
  Sec ejecuta:
    skills/vuln-assessment     → Interpreta SAST/SCA
    skills/dast-interpretation → Interpreta DAST
    skills/pentest-report      → Pen test report
    skills/security-checklist  → OWASP Top 10
  Sec ejecuta:
    /advance-gate 6          → Valida Gate 6 (Security sign-off)
                              → AUTO: invoca skill change-request + rollback-plan
                              → AUTO: notifica DevOps + PME

FASE 8: DESPLIEGUE
  DevOps ejecuta:
    /create-release-notes    → Genera changelog
    /update-changelog [ver]  → Actualiza CHANGELOG.md
  PME ejecuta:
    /advance-gate 7          → Valida Gate Final (CR aprobado, rollback, release notes)
                              → AUTO: deploy pipeline
                              → AUTO: hook notify-desktop alerta al equipo
                              → AUTO: notifica #releases

POST-DEPLOY
  TL ejecuta:
    /sync-docs               → Actualiza docs con cambios del release
    /validate-project-docs   → Verifica que docs reflejan realidad
  PME + TL ejecutan:
    bmad-retrospective       → Review de épica + retro data-driven (cubre lo que era epic-review + retrospective)
  PME ejecuta:
    skills/postmortem        → 🔴 Postmortem solo si hubo incidente (Five Whys blameless)
```

---

## 4. Encadenamiento de Commands

### Cadena típica: Nuevo Proyecto

```
/init-project-docs my-project           → PME/TL crea docs
  ↓
(equipo trabaja en docs)
  ↓
/validate-project-docs my-project       → TL valida completitud
  ↓
/advance-gate 0                         → PME abre Discovery
  ↓
...ciclo SDLC continúa...
```

### Cadena típica: Sprint Completo

```
/advance-gate 3                         → PO confirma sprint
  ↓
/create-branch PROJ-123                 → Dev crea branch
/implement-ticket PROJ-123              → Dev implementa
/create-pr PROJ-123                     → Dev crea PR (o auto desde implement)
  ↓
/advance-gate 4                         → TL confirma sprint dev completo
  ↓
/prepare-testing PROJ-123               → QA prepara testing
/advance-gate 5                         → QA sign-off
  ↓
/advance-gate 6                         → Security sign-off
  ↓
/create-release-notes                   → DevOps genera release notes
/update-changelog v1.2.0               → DevOps actualiza CHANGELOG
/advance-gate 7                         → PME deploy a PROD
  ↓
/sync-docs architecture                 → TL actualiza docs
/validate-project-docs my-project       → TL verifica docs
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
/create-pr PROJ-123                        → PR referencia ticket + change archivado
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
/create-branch PROJ-999                 → Dev crea branch desde hotfix
/implement-ticket PROJ-999              → Dev implementa fix
/create-pr PROJ-999                     → Dev crea PR a main
(QA fast-track testing)
/create-release-notes                   → DevOps genera patch notes
/update-changelog v1.2.1               → DevOps actualiza CHANGELOG
/advance-gate 7                         → PME fast-track deploy
/sync-docs                              → TL actualiza docs si aplica
```

### Cadena típica: Especificación Completa (Fase 3)

```
/advance-gate 1                         → PO confirma Discovery
  ↓
/validate-requirements my-project       → Orquesta Fase 3 completa:
  ├── skill: generate-rf                → RFs con BDD desde PRDs
  ├── skill: generate-nfr               → NFRs medibles desde PRD-T §5
  ├── skill: validate-requirements      → RTM + gap detection
  └── skill: bmad-create-epics-and-stories → Sub-épicas (rules: .agents/_shared/lidr/references/epic-decomposition-rules.md)
  ↓
/advance-gate 2                         → PO + TL validan Gate 2
  ↓
...Sprint Planning continúa...
```

### Cadena típica: Catch-up (proyecto en marcha sin docs formales)

```
bmad-prd                                → PRD retroactivo (unificado F+T)
skills/review-cruzado                   → Validación F+T sections
skills/risk-log                         → Riesgos no documentados
/advance-gate 1                         → Gate 1 retroactivo (probablemente CONDITIONAL)
  ↓
/validate-requirements my-project       → RFs + NFRs + RTM + epic breakdown
/advance-gate 2                         → Gate 2 retroactivo
  ↓
skills/user-stories                     → US con BDD desde RFs retroactivos
skills/sprint-capacity                  → Capacidad real
/advance-gate 3                         → Sprint committed con DoR
  ↓
skills/tech-debt                        → Cataloga deuda acumulada
skills/adr                              → ADRs retroactivos
/validate-project-docs my-project       → Valida completitud final
```

### Cadena típica: Gestión de deuda técnica

```
skills/tech-debt                        → Cataloga deuda del codebase (TL)
skills/adr                              → ADR: estrategia refactor vs rewrite
skills/user-stories                     → US técnicas con BDD
skills/sprint-capacity                  → Reserva 20% capacity para debt
/implement-ticket PROJ-456              → Implementa refactoring
/create-pr PROJ-456                     → PR con descripción del debt payoff
/sync-docs                              → Actualiza docs afectados
```

### Cadena típica: Postmortem de incidente

```
skills/bug-report                       → Documenta incidente
skills/postmortem                       → Five Whys + root cause (blameless)
skills/tech-debt                        → Registra deuda que causó incidente
skills/adr                              → Decisión correctiva arquitectónica
bmad-testarch-automate                 → Amplía suite con caso del incidente
bmad-retrospective                    → Lecciones + action items
/sync-docs                              → Actualiza runbooks afectados
```

### Cadena típica: Onboarding de nuevo miembro

```
/lidr-help                                   → Explorar ecosistema interactivamente
rules/project.md                        → Contexto proyecto activo
rules/org.md                            → Estándares organizacionales
rules/tech-stack.md                     → Convenciones de código
rules/workflows.md                      → Quién ejecuta qué y cuándo
bmad-create-architecture                 → Revisar doc de arquitectura
/validate-project-docs my-project       → Estado actual de documentación
```

### Cadena típica: Scaffolding de repositorio

```
/init-project-docs my-project           → Scaffold desde templates (TL)
bmad-create-architecture                 → Doc arquitectura (Arc42/C4)
skills/adr                              → ADR inicial: stack + patrón
/validate-project-docs my-project       → Audita repo vs cl-repo-structure
/advance-gate 0                         → Gate 0 con repo-structure checklist
```

### Cadena típica: Cerrar una épica (Epic Review)

```
bmad-retrospective                      → Plan vs actual + lecciones + retro data-driven
skills/tech-debt                        → Consolida deuda acumulada
/sync-docs                              → Sincroniza docs final
/validate-project-docs my-project       → Valida completitud
```

---

## 5. Skills Cross-Cutting (no atados a una sola fase)

Los siguientes skills se usan transversalmente y no aparecen en una fase específica del flujo:

| Skill                      | Fases donde aplica                  | Descripción                                                                                             |
| -------------------------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `bmad-create-architecture` | F2 Discovery → F5 Dev → POST-DEPLOY | Genera/actualiza doc de arquitectura (templates LIDR en `.agents/_shared/lidr/templates/architecture/`) |
| `bmad-ux`                  | F2 Discovery → F4 Planning          | Spec UX/UI desde PRD + wireframes (template LIDR en `.agents/_shared/lidr/templates/ux-design-spec.md`) |
| `bmad-sprint-planning`     | F4 Planning → F5 Dev                | Descompone proyecto en fases incrementales                                                              |
| `bmad-retrospective`       | POST-DEPLOY                         | Post-epic retro: plan vs actual, lecciones, follow-up (cubre lo que era epic-review)                    |

---

## 6. Hooks — Guardias automáticos activos

| Hook                | Evento Claude Code      | Cuándo se dispara                                   | Acción                                         |
| ------------------- | ----------------------- | --------------------------------------------------- | ---------------------------------------------- |
| `dtc-write-guard`   | PreToolUse: Write\|Edit | Cada vez que la IA intenta escribir/editar archivos | Valida DTC + DoD + detecta secrets             |
| `dtc-session-check` | Stop                    | Al finalizar sesión                                 | Verifica sincronización de 8 fuentes de verdad |
| `notify-desktop`    | Notification            | Eventos relevantes (build roto, vuln crítica)       | Alerta desktop macOS/Linux                     |
| `context-loader`    | SessionStart            | Al iniciar sesión                                   | Carga contexto proyecto + DTC status           |

---

## 7. Reglas de Ejecución para la IA

### Antes de ejecutar CUALQUIER command:

```
1. VERIFICAR ROL: ¿El humano tiene permiso? (ver matriz arriba)
   → Si NO: "Este comando requiere rol {X}. Tu rol actual: {Y}."

2. VERIFICAR PRECONDICIONES: ¿Gates anteriores PASS?
   → Si NO: "Gate {N-1} no pasado. Ejecutar /advance-gate {N-1} primero."
   → EXCEPCIÓN: Dev puede ejecutar /create-branch sin gate previo si tiene ticket asignado

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
2. Comando ejecutado: /prepare-testing → probablemente QA
3. Contexto del proyecto: rules/project.md define equipo y roles
4. Pregunta directa: "¿Cuál es tu rol en el equipo?"

Si el rol no está claro → PREGUNTAR antes de ejecutar commands restringidos
```

---

## 8. Evolución: De Commands a Agents

| Command                  | Cuándo evoluciona a Agent         | Señal de activación                                |
| ------------------------ | --------------------------------- | -------------------------------------------------- |
| `/advance-gate`          | Tras ≥24 ejecuciones (3 por gate) | Artefactos completos detectados en Jira/Confluence |
| `/implement-ticket`      | Tras ≥30 tickets implementados    | Ticket asignado al dev + status "In Progress"      |
| `/prepare-testing`       | Tras ≥20 suites generadas         | Ticket con status "Ready for QA"                   |
| `/create-release-notes`  | Tras ≥10 releases                 | Tag creado en GitHub                               |
| `/sync-docs`             | Tras ≥10 syncs manuales           | PR mergeado con cambios en src/                    |
| `/validate-project-docs` | Tras ≥10 validaciones             | Commit en docs/projects/                           |

**Un command se promueve a agent cuando:**

1. ≥N ejecuciones exitosas sin intervención correctiva del humano
2. 0 falsos positivos o acciones incorrectas
3. El responsable del proceso confirma confianza
4. Se documenta en `.claude/agents/` con criterios de activación

---

_Esta rule se carga bajo demanda (via description) cuando se ejecuta un command o se consulta el workflow SDLC._
_Referencia: docs/standards/org.md para detalle de roles y gates._
