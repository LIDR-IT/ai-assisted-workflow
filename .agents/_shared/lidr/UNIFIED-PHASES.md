---
id: unified-phases
version: "1.2.0"
last_updated: "2026-06-11"
updated_by: "TL: Phase 0 context — doc-lifecycle + ADR baseline"
status: active
type: standard
review_cycle: 90
next_review: "2026-09-08"
owner_role: "Tech Lead"
---

# Unified Phase Model — BMad phases × LIDR gates

> **Fuente de verdad** del modelo de fases unificado. BMad aporta la taxonomía de
> fases (el MOTOR que produce artefactos); LIDR aporta los gates, roles y
> compliance (la GOBERNANZA que verifica evidencia). Una sola taxonomía, dos capas.

## 1. El modelo

**5 fases (numeración BMad) · 9 etapas internas (granularidad LIDR) · 8 gates (G0–G7, sin renumerar).**

```
Phase 0 — Context & Anytime        [stage: context | anytime]
Phase 1 — Analysis                  [stage: analysis]          → G0: Intake
Phase 2 — Planning                  [stage: planning]          → G1: PRD Approved
Phase 3 — Solutioning               [stage: specification]     → G2: Specs Complete
                                    [stage: sprint-planning]   → G3: Ready to Implement
Phase 4 — Implementation            [stage: development]       → G4: Code Quality (DoD)
                                    [stage: qa]                → G5: QA Sign-off
                                    [stage: security]          → G6: Security Sign-off
                                    [stage: release]           → G7: Release (Gate Final)
```

### Mapping fases LIDR antiguas (0–8) → modelo unificado

| Fase LIDR antigua | Fase unificada   | Stage             | Gate de salida      |
| ----------------- | ---------------- | ----------------- | ------------------- |
| 0 Preparación     | 0 Context        | `context`         | — (checklist en G0) |
| (cross-cutting)   | 0 Anytime        | `anytime`         | —                   |
| 1 Originación     | 1 Analysis       | `analysis`        | G0                  |
| 2 Discovery & PRD | 2 Planning       | `planning`        | G1                  |
| 3 Especificación  | 3 Solutioning    | `specification`   | G2                  |
| 4 Sprint Planning | 3 Solutioning    | `sprint-planning` | G3                  |
| 5 Desarrollo      | 4 Implementation | `development`     | G4                  |
| 6 QA & Testing    | 4 Implementation | `qa`              | G5                  |
| 7 Seguridad       | 4 Implementation | `security`        | G6                  |
| 8 Despliegue      | 4 Implementation | `release`         | G7                  |

### Por qué los gates NO se renumeran

`gate-evidence.yaml`, `/lidr-advance-gate`, los handoffs `gate-N-handoff.md` y los
sign-offs referencian G0–G7. Renumerar rompería trazabilidad histórica sin ganancia.
La regla mnemónica nueva: **G0–G1 cierran fases 1–2; G2–G3 viven en Solutioning;
G4–G7 son stage-gates dentro de Implementation.**

### Frontmatter de skills

Todo skill `lidr-*` declara fase unificada + stage:

```yaml
phase: 4 # 0-4, numeración BMad unificada
stage: qa # context|anytime|analysis|planning|specification|sprint-planning|development|qa|security|release
```

Los skills `bmad-*` no se tocan (BMad is NEVER modified); su fase viene de
`_bmad/_config/bmad-help.csv` (`1-analysis`…`4-implementation`, `anytime`) y mapea
1:1 al modelo unificado. `anytime` ≡ Phase 0.

### Excepciones deliberadas al mapeo CSV→fase unificada

El mapeo CSV→fase unificada es 1:1 **salvo dos casos donde LIDR ancla el GATE en una
fase distinta de la que BMad usa para archivar el skill**. No se modifica el CSV de BMad;
LIDR simplemente sitúa el gate donde corresponde en su modelo de gobernanza:

- **`bmad-sprint-planning`** — CSV lo cataloga `4-implementation` (genera `sprint-status.yaml`
  en `implementation_artifacts`), pero LIDR ancla su **gate en G3 (final de Phase 3 Solutioning
  / stage sprint-planning)**: el sprint debe comprometerse ANTES de cruzar a Implementation.
  Es evidencia `required: true` de G3 en `gate-evidence.yaml`. La salida BMad sí vive en
  `implementation-artifacts` (de ahí el glob `{bmad_impl}/sprint-status*.yaml`).
- **`bmad-testarch-test-design`** — CSV lo cataloga `3-solutioning` y LIDR lo usa como evidencia
  **opcional de G2**; su salida vive en `test_artifacts` (módulo TEA), no en `planning_artifacts`.
  Coherente, pero se documenta para que el glob `{bmad_test}/test-design/**` no sorprenda.

## 2. Skills por fase unificada (LIDR + BMad fusionados)

| Fase / Stage            | BMad (motor)                                                                                                                                         | LIDR (gobernanza + gap-fillers)                                                                                                                                                                                                                                                                                                                                               |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **0 / context**         | `bmad-document-project`, `bmad-generate-project-context`, `bmad-shard-doc`, `bmad-index-docs`                                                        | `lidr-adr` (ADR baseline brownfield; home principal en 4/development), `/lidr-init-project-docs`, rules (org/project/tech-stack), `context-manifest.yaml`                                                                                                                                                                                                                     |
| **0 / anytime**         | `bmad-quick-dev`, `bmad-correct-course`, `bmad-spec`, tech-writer, reviews, CIS                                                                      | `lidr-gate-evaluation`, `lidr-audit-standards`, `lidr-sdlc-tracking`, `lidr-external-sync`, `lidr-playwright-cli`, meta-tooling (`lidr-mcp-integration`, `lidr-hook-development`, `lidr-generate-rule`), `lidr-ticket-validation`, `lidr-commit-management`                                                                                                                   |
| **1 / analysis**        | `bmad-brainstorming`, `bmad-market-research`, `bmad-domain-research`, `bmad-technical-research`, `bmad-product-brief` \| `bmad-prfaq`                | `lidr-business-case` ⭐G0, `lidr-kickoff`, `lidr-stakeholder-map`, `lidr-tracking-integration`                                                                                                                                                                                                                                                                                |
| **2 / planning**        | `bmad-prd` ⭐G1, `bmad-ux`                                                                                                                           | `lidr-review-cruzado` (F+T enforcer), `lidr-risk-log`, `/lidr-validate-prd`, `lidr-propuesta-builder`                                                                                                                                                                                                                                                                         |
| **3 / specification**   | `bmad-create-architecture` ⭐G2, `bmad-create-epics-and-stories` ⭐G2, `bmad-testarch-test-design`, `bmad-testarch-framework`, `bmad-testarch-ci`    | `lidr-generate-rf` ⭐G2, `lidr-generate-nfr`, `lidr-validate-requirements` (RTM) ⭐G2, `lidr-adr`                                                                                                                                                                                                                                                                             |
| **3 / sprint-planning** | `bmad-check-implementation-readiness` ⭐G3, `bmad-sprint-planning` ⭐G3                                                                              | `lidr-user-stories`, `lidr-sprint-capacity` ⭐G3, `lidr-refinement-notes`                                                                                                                                                                                                                                                                                                     |
| **4 / development**     | `bmad-create-story`, `bmad-dev-story`, `bmad-sprint-status`, `bmad-code-review`, `bmad-testarch-atdd`, `bmad-investigate`, `bmad-checkpoint-preview` | `/lidr-spec-*` lifecycle (envuelve `bmad-dev-story` en secuencia → `test-report.md`, evidencia opcional del G4), `lidr-adr`, `lidr-tech-debt`, `lidr-pr-description`, `lidr-impact-analysis` (contract impact G4 · variant compatibility consumida en G2; requiere registries del cliente), `lidr-dev-handoff-qa` ⭐G4, `lidr-using-git-worktrees`, `lidr-run-parallel-tasks` |
| **4 / qa**              | `bmad-testarch-automate`, `bmad-testarch-trace`, `bmad-testarch-test-review`, `bmad-qa-generate-e2e-tests`, `bmad-testarch-nfr`                      | `lidr-create-test-cases`, `lidr-bug-report`, `lidr-test-execution-report` ⭐G5                                                                                                                                                                                                                                                                                                |
| **4 / security**        | —                                                                                                                                                    | `lidr-vuln-assessment` ⭐G6, `lidr-dast-interpretation`, `lidr-pentest-report`, `lidr-security-checklist` ⭐G6                                                                                                                                                                                                                                                                |
| **4 / release**         | `bmad-retrospective` (post-deploy)                                                                                                                   | `lidr-change-request` ⭐G7, `lidr-rollback-plan` ⭐G7, `lidr-release-notes` ⭐G7, `lidr-postmortem` (si incidente)                                                                                                                                                                                                                                                            |

⭐GN = evidencia required del gate N en `gate-evidence.yaml`.

> **`bmad-teach-me-testing` (CSV phase `0-learning`)** — módulo TEA Academy (formación
> progresiva en testing). No produce artefacto de gate; es un skill de aprendizaje
> transversal → mapea a **Phase 0 / anytime** en el modelo unificado. No aparece en una
> fila de flujo porque no participa en la cadena input/output de ningún gate.
>
> Skills BMad meta/builder/utility (`bmad-agent-*`, `bmad-module-builder`, `bmad-workflow-builder`,
> `bmad-bmb-setup`, `bmad-customize`, `bmad-party-mode`, `bmad-help`, CIS `bmad-cis-*`) son todos
> `anytime` ≡ Phase 0; no se listan fila-a-fila por ser herramientas de autoría/exploración fuera
> de la cadena de gates. Excepción doc-lifecycle: `bmad-shard-doc` y `bmad-index-docs` se anclan
> al stage `context` (fila 0/context) porque sostienen el levantamiento de contexto — shardean
> docs heredadas para consumo LLM y mantienen `docs/index.md` (checklist Context Ready).

## 3. Flow audit — escenarios end-to-end con cadena input/output

Convención: `skill (INPUT) → OUTPUT [→ consumidor]`.

### 3.1 Greenfield (producto nuevo, arranca en Phase 1)

```
PHASE 1 — ANALYSIS
  bmad-brainstorming / *-research (idea) → research docs            [→ product-brief]
  lidr-business-case (problema+research) → business-case.md ⭐G0    [→ bmad-prd contexto negocio]
  bmad-product-brief | bmad-prfaq (research) → product-brief.md     [→ bmad-prd INPUT principal]
  lidr-stakeholder-map → stakeholder-map.md                         [→ kickoff, comms plan]
  lidr-kickoff (BC+stakeholders) → kickoff.md
  lidr-tracking-integration → épica en {{TRACKING_TOOL}}            [→ todo el tracking posterior]
  ▸ G0 Intake (PME+Sponsor): BC aprobado + brief poblado
─────────────────────────────────────────────────────────────────────
PHASE 2 — PLANNING
  bmad-prd (product-brief + business-case) → PRD.md ⭐G1            [→ ux, architecture, generate-rf]
  bmad-ux (PRD) → ux-design.md                                      [→ architecture, user-stories]
  lidr-review-cruzado (PRD) → review-cruzado.md (F+T completas)     [→ evidencia G1]
  lidr-risk-log (PRD+BC) → risk-log.md                              [→ evidencia G1, sprint-capacity buffer]
  /lidr-validate-prd → scoring + action plan                        [→ decisión G1]
  ▸ G1 PRD Approved (PO+TL): PRD F+T + review cruzado + riesgos
─────────────────────────────────────────────────────────────────────
PHASE 3 — SOLUTIONING / specification
  bmad-create-architecture (PRD+UX) → architecture.md ⭐G2          [→ epics, ADRs, spec-ff design]
  lidr-adr (decisiones arq.) → ADR-NNNN.md                          [→ contexto dev]
  lidr-generate-rf (PRD-F) → RF-*.md con BDD ⭐G2                   [→ user-stories, test-cases, RTM]
  lidr-generate-nfr (PRD-T §5) → NFR-*.md medibles                  [→ testarch-nfr, security]
  bmad-create-epics-and-stories (PRD+architecture) → epics.md ⭐G2  [→ sprint-planning, user-stories]
  lidr-validate-requirements (RFs+NFRs+epics) → rtm.md ⭐G2         [→ evidencia G2+G5 trazabilidad]
  bmad-testarch-test-design (epics+NFRs) → test-design.md           [→ create-test-cases, automate]
  ▸ G2 Specs Complete (PO+QA): RF 100% BDD + RTM sin huérfanos + epics 2-40h
PHASE 3 — SOLUTIONING / sprint-planning
  lidr-user-stories (RFs + skeleton de bmad-create-epics) → backlog US comprometido  [refina la story-skeleton de BMad, NO la alimenta]
  lidr-sprint-capacity (equipo+risk-log) → sprint-capacity.md ⭐G3  [→ cifra de capacidad comprometible (gobernanza), input humano del commitment]
  lidr-refinement-notes (backlog US) → refinement-notes.md          [→ DoR, evidencia G3]
  bmad-check-implementation-readiness (PRD+UX+arch+epics) → readiness-report.md ⭐G3
  bmad-sprint-planning (epics) → sprint-status.yaml ⭐G3            [→ create-story; consume epics — la capacity LIDR la usa el humano al comprometer, no es input de archivo]
  ▸ G3 Ready to Implement (PO+TL): readiness + capacity ≤90% + DoR por US
─────────────────────────────────────────────────────────────────────
PHASE 4 — IMPLEMENTATION / development  (por ticket/story — UNA secuencia: motor BMad → envoltura LIDR)
  bmad-create-story (sprint plan+US) → story.md contextualizada     [→ tasks.md vía /lidr-spec-ff]
  bmad-dev-story (story) → código + loop unit/regresión + DoD       [motor BMad: ejecuta los tests]
  /lidr-spec-apply envuelve dev-story → + Step 0 branch + curl + Playwright E2E + DTC docs + reports
  /lidr-spec-verify → test-report.md (verdict PASSED)               [→ evidencia G4; required:false]
  bmad-code-review (diff) → findings                                 [→ fix antes de PR]
  lidr-pr-description (commits) → PR description
  lidr-adr / lidr-tech-debt (si aplica) → ADR / debt registry
  lidr-dev-handoff-qa (PR+tests) → dev-qa-handoff.md ⭐G4           [→ INPUT de create-test-cases]
  ▸ G4 Code Quality (TL): DoD checklist (gate duro, route-agnostic) + test-report.md PASSED (evidencia LIDR, required:false) + DTC docs
PHASE 4 — IMPLEMENTATION / qa
  lidr-create-test-cases (handoff+RFs+test-design) → test-cases/*.md [→ ejecución]
  bmad-testarch-automate (test-design) → suite regresión
  lidr-bug-report (defectos) → bug tickets                           [→ dev fixes]
  lidr-test-execution-report (resultados) → test-execution-report.md ⭐G5
  bmad-testarch-trace (RTM+resultados) → traceability + gate decision [→ evidencia G5]
  ▸ G5 QA Sign-off (QA Lead): 100% ejecutados + 0 bloqueantes + regresión verde
PHASE 4 — IMPLEMENTATION / security
  lidr-vuln-assessment (SAST/SCA) → vuln-assessment.md ⭐G6
  lidr-dast-interpretation (DAST pre-prod) → dast-report.md
  lidr-pentest-report (pen test) → pentest-report.md
  lidr-security-checklist (OWASP+compliance) → security-checklist.md ⭐G6
  ▸ G6 Security Sign-off (CISO): 0 crit/high + DAST limpio
PHASE 4 — IMPLEMENTATION / release
  lidr-change-request (sign-offs G5+G6) → change-request.md ⭐G7
  lidr-rollback-plan (architecture+deploy) → rollback-plan.md ⭐G7
  lidr-release-notes (PRs mergeados) → release-notes.md ⭐G7
  ▸ G7 Release (Change Committee) → deploy
  POST: bmad-retrospective → lessons; lidr-postmortem (solo si incidente)
```

**Verificación I/O**: cada output ⭐ es input declarado de ≥1 skill de la fase
siguiente o evidencia de gate. Sin huérfanos detectados tras la corrección de
G1/G2 (architecture movida a G2, ver §5).

### 3.2 Brownfield (proyecto existente: contexto primero)

```
PHASE 0 — CONTEXT  (OBLIGATORIA en brownfield, antes de cualquier análisis)
  bmad-document-project (codebase) → docs/index.md + project docs   [→ INPUT de prd/architecture/epics]
  bmad-shard-doc (docs heredadas grandes) → docs shardeadas por sección [→ consumo LLM de manuales/specs legacy]
  bmad-index-docs (docs/) → docs/index.md regenerado                [→ inventario vivo tras cada cambio (DTC)]
  bmad-generate-project-context (codebase) → project-context.md     [→ contexto LLM de TODA sesión]
  lidr-adr (decisiones heredadas hard-to-reverse) → ADR baseline    [→ "why" del sistema existente; INPUT de arch deltas]
  /lidr-init-project-docs → docs/projects/{client}/ scaffold        [→ destino de artefactos LIDR]
  Rules definidas: org.md, project.md (cliente activo), tech-stack.md
  context-manifest.yaml actualizado (lidr-load-context lo carga al SessionStart)
  ▸ Checklist "Context Ready" (evidencia brownfield de G0):
    [ ] project-context.md existe y refleja el stack real
    [ ] docs/index.md inventaría la documentación existente
    [ ] docs grandes shardeadas para consumo LLM (bmad-shard-doc si aplica)
    [ ] decisiones arquitectónicas heredadas críticas documentadas (lidr-adr baseline si aplica)
    [ ] rules/project.md apunta al cliente correcto
    [ ] deuda técnica conocida catalogada (lidr-tech-debt si aplica)
─────────────────────────────────────────────────────────────────────
PHASE 1 — ANALYSIS (alcance: la iniciativa, no el producto entero)
  lidr-business-case (iniciativa) → business-case.md ⭐G0
  bmad-product-brief (project-context + iniciativa) → brief
  ▸ G0 (incluye checklist Context Ready)
PHASE 2 — PLANNING
  bmad-prd UPDATE intent (PRD existente | project docs) → PRD delta
  lidr-review-cruzado + lidr-risk-log (riesgos de regresión ↑)
  ▸ G1
PHASE 3 — SOLUTIONING
  bmad-create-architecture UPDATE (architecture existente + delta) → arch delta + lidr-adr
  lidr-generate-rf (solo RFs nuevos/modificados) + RTM incremental
  bmad-create-epics-and-stories (delta) → epics delta
  ▸ G2 → sprint-planning → G3
PHASE 4 — IMPLEMENTATION
  Igual que greenfield; regresión obligatoria en qa stage
  (bmad-testarch-automate sobre flujos existentes afectados).
```

### 3.3 Feature adicional sobre producto en marcha (PRD desde funcionalidad extra)

```
PRE: Phase 0 ya cumplida (contexto vivo); producto ya pasó ≥1 ciclo completo.

ENTRADA: idea de feature / ticket / feedback de cliente
  /lidr-enrich-ticket → ticket enriquecido (validación de completitud)
  ── bifurcación por tamaño ──
  ≤40h  → /lidr-quick-spec → spec ligera → Phase 4 directo (/lidr-implement-ticket
          o /lidr-spec-new → ff → apply → verify → archive). Gates G4–G7 por ticket.
  >40h  → mini-ciclo completo:
          Phase 1 (light): lidr-business-case SOLO si pide presupuesto/equipo nuevo;
                           si no, el ticket enriquecido es la evidencia de intake
          Phase 2: bmad-prd (feature PRD, hereda project-context + PRD maestro)
          Phase 3: lidr-generate-rf (RFs del feature) + epics delta + RTM incremental → G2, G3
          Phase 4: pipeline normal → G4…G7
SALIDA: feature en PROD + change archivado en changes/archive/ + PRD maestro actualizado (DTC)
```

### 3.4 Hotfix (excepción de emergencia)

```
Incidente P1 → aprobación verbal CTO → /lidr-create-branch → fix → /lidr-create-pr
→ QA fast-track (G5 reducido) → G7 fast-track → deploy
→ retroactivo <24h: documentación + lidr-postmortem obligatorio (org.md §4.2)
```

## 4. Reglas de entrada por escenario

| Escenario                        | Entra en                  | Prerequisito                                      |
| -------------------------------- | ------------------------- | ------------------------------------------------- |
| Greenfield                       | Phase 1                   | Ninguno (Phase 0 opcional: solo rules + scaffold) |
| Brownfield primera vez           | Phase 0                   | Codebase accesible                                |
| Feature ≤40h sobre producto vivo | Phase 4 (vía quick-spec)  | Context Ready + ticket enriquecido                |
| Feature >40h sobre producto vivo | Phase 2 (PRD del feature) | Context Ready + intake evidence                   |
| Hotfix P1                        | Phase 4 / development     | Aprobación CTO                                    |
| Catch-up (proyecto sin docs)     | Phase 0 → retro-gates     | Codebase + equipo disponible                      |

## 5. Cambios aplicados a los gates (changelog del audit)

1. **G0** — añade evidencia brownfield: `bmad-generate-project-context` (project-context.md)
   y checklist "Context Ready". Transición renombrada: `Analysis → Planning (Intake)`.
2. **G1** — `bmad-create-architecture` **removida** (era incoherente: architecture es
   3-Solutioning en BMad, no Planning). Añadida `bmad-ux` (optional). Transición:
   `Planning → Solutioning (PRD approved)`.
3. **G2** — `bmad-create-architecture` **añadida como required** (su fase correcta).
   Añadida `bmad-testarch-test-design` (optional: estrategia de test se diseña en
   Solutioning). Transición: `Solutioning: specification → sprint-planning (Specs complete)`.
4. **G3** — sin cambios de evidencia. Transición: `Solutioning → Implementation (Ready to implement)`.
5. **G4** — añadida `bmad-code-review` (optional). Transición: `Implementation: development → qa (DoD)`.
6. **G5** — añadida `bmad-testarch-trace` (optional: matriz de trazabilidad + gate decision).
   Transición: `Implementation: qa → security (QA sign-off)`.
7. **G6** — sin cambios de evidencia. Transición: `Implementation: security → release (Security sign-off)`.
8. **G7** — checklist añade retro post-deploy (`bmad-retrospective`). Transición:
   `Implementation: release → Production (Gate Final)`.

## Changelog

| Versión | Fecha      | Autor                             | Cambios                                                                                                                                                                                                                                                                              |
| ------- | ---------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1.3.0   | 2026-06-11 | TL: SDD single-sequence coherence | §2/§3.1 development colapsa el doble-camino (motor BMad vs lifecycle LIDR) en UNA secuencia: bmad-dev-story (motor) → /lidr-spec-apply lo envuelve; el lifecycle envuelve, no compite. Gate duro G4 route-agnostic (DoD)                                                             |
| 1.2.0   | 2026-06-11 | TL: Phase 0 context enrichment    | 0/context suma doc-lifecycle (`bmad-shard-doc`, `bmad-index-docs`, antes nota anytime) y `lidr-adr` como ADR baseline brownfield (cross-ref; home en 4/development); §3.2 flow + checklist Context Ready ampliados; gate-evidence G0 añade lidr-adr opcional                         |
| 1.1.1   | 2026-06-10 | TL: Gate-evidence contract fix    | §1 nota de excepciones deliberadas (sprint-planning gate@G3 vs CSV 4-implementation; test-design test_artifacts); §2 +`bmad-testarch-framework`/`-ci`/`-sprint-status` y nota `0-learning`/meta-builder; §3.1 RUTA A pasa G4 vía DoD (test-report RUTA B opcional, `required:false`) |
| 1.1.0   | 2026-06-10 | TL: Capability gap closure        | `lidr-impact-analysis` closes PP-05/PP-06-class gaps (contract impact + variant compatibility; evidencia opcional G2/G4)                                                                                                                                                             |
| 1.0.0   | 2026-06-10 | TL: Phase Unification BMad-LIDR   | Creación: modelo unificado 5 fases × 8 gates + flow audit                                                                                                                                                                                                                            |
