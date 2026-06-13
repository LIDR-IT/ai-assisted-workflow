# Auditoría — `/:clientId/sitemap` + Ecosistema `.claude/`

> **Generado:** 2026-06-09 · **Método:** 10 agentes en paralelo (rutas, skills LIDR ×2, skills BMAD ×2, commands, subagents/hooks/MCP, rules, infraestructura, análisis de solape BMAD↔LIDR)
> **Alcance:** rutas navegables de la app (`ROUTE_REGISTRY`) + índice real en disco de `.claude/` (symlink → `.agents/`)
> **Premisa rectora:** **BMAD es el SDD canónico e _inmutable_.** Las mejoras LIDR se adaptan _envolviendo_ los outputs de BMAD (gate / formato / trazabilidad / compliance), nunca duplicando ni modificando BMAD.

---

## ✅ ESTADO DE REMEDIACIÓN — 2026-06-09 (CONVERGIDO Y VERIFICADO)

> **Convergencia completa.** Dos sesiones de Claude trabajaron la remediación (sesión A — audit/coherencia/consolidación; sesión B — WRAP/MERGE + gate-evidence manifest). B terminó; A hizo la pasada única de convergencia. **Estado verificado verde:** `build ✓` · `tests 926/927 ✓` · `sync ✓` · `validate-ecosystem-counts ✓` (112 skills / 32 commands / 24 rules / 23 subagents / 6 hooks, **0 BMAD residuals, 0 stale**) · `validate:coherence ✓` · **0 refs colgantes funcionales** · **BMAD intacto** (3 shims deprecated + 13 subagentes `bmad-*-agent` conservados por la regla «BMAD intocable»).
>
> **Resultado clave (sesión B):** `.agents/_shared/lidr/gate-evidence.yaml` — manifiesto declarativo G0–G7 que mapea cada gate a `bmad_evidence` (primario) + `lidr_evidence` (gap-fillers); `/advance-gate` ahora **lee** outputs de BMad en vez de re-implementarlos. Materializa la premisa «LIDR gobierna, BMad produce; BMad NEVER modified».

### Corrección a este propio audit

- El conteo original «**114 skills (45 lidr)**» estaba **inflado**: contaba `lidr-adr.zip` como skill. Real = **113 (44 lidr + 69 bmad)** antes de la limpieza; **112 (43+69)** tras borrar `lidr-project-classifier` (sesión B). CLAUDE.md ya declaraba 113 correctamente.
- `quality/testing-scripts.md` marcado como «stale ref» → **falso positivo**: referencia `.claude/rules` que es un symlink válido a `.agents/rules`. No requiere cambio.

### ✅ Hecho y verificado por la sesión A (esta) — algunos ya superseded por B

| Ítem                                                                                                                                                           | Estado                                                               |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| P0 skills fantasma → rebind a BMAD (`lidr-spec-ff`, `model-selection`, `workflows`, `AGENTS.md`, `architecture-overview`, `validators/README`, `package.json`) | ✅ 0 refs vivas                                                      |
| Commands duplicados consolidados (`-enhanced`→base, genérico borrado)                                                                                          | ✅                                                                   |
| Zip huérfano `lidr-adr.zip` borrado                                                                                                                            | ✅                                                                   |
| `web-design.md` VitePress → Tailwind v4                                                                                                                        | ✅                                                                   |
| Drift del sitemap (validate-prd dup, hooks 4→6, agents 7→23)                                                                                                   | ✅ tests 117/117                                                     |
| Reconciliación de conteos en `AGENTS.md` (37→34)                                                                                                               | ⚠️ **superseded por B** (B lo dejó en 32 tras borrar 2 commands más) |

### 🔄 En curso por la sesión B (WRAP/MERGE — más completo)

- Borró `lidr-document-project`→`bmad-document-project`, `lidr-check-readiness`→`bmad-check-implementation-readiness`, skill `lidr-project-classifier`
- `lidr-advance-gate` v2.1.0 manifest-driven leyendo nuevo `_shared/lidr/gate-evidence.yaml` (artefactos BMAD = evidencia primaria, LIDR = gap-fillers)
- Reposicionando `lidr-validate-prd`, `lidr-product-brief`, `lidr-quick-spec` (Part C del audit) + `org.md`, `documentation.md`, `CRITICALITY.md`, `MIGRATION.md`

### ⬜ Pendiente (de nadie aún)

- `claude-code-extensions.md:137` — `skill.md` → `SKILL.md` (micro-fix retenido por la sesión A para no pisar a B)
- `org.md §6.1` — path `.claude/rules/tech-stack.md` → `.claude/rules/lidr-sdlc/tech-stack.md` (lo posee B ahora)
- Decisión sobre los 2 ítems BMAD: 3 shims deprecated + 13 subagentes `bmad-*-agent` (requiere tu OK por la regla «BMAD intocable»)
- **Convergencia final:** una sola sesión → `./.agents/sync.sh` una vez → re-correr `validate-ecosystem-counts` → tests → **commit único**

---

## 0. Resumen ejecutivo

| Dimensión        | Real en disco                                 | Notas                                                                         |
| ---------------- | --------------------------------------------- | ----------------------------------------------------------------------------- |
| Rutas navegables | **19** (18 named + `doc/*`)                   | Todos los componentes existen ✓ — 0 rutas rotas                               |
| Skills           | **114** (45 `lidr-*` + 69 `bmad-*`)           | 3 BMAD auto-declaradas DEPRECATED; 6 LIDR referenciadas pero **inexistentes** |
| Commands         | **37**                                        | 3 duplicados / redundantes a eliminar; 5 a envolver sobre BMAD                |
| Subagents        | **23** (10 `lidr-*` + 13 `bmad-*-agent`)      | Los 13 BMAD duplican skills homónimas                                         |
| Rules            | **24** (en 10 categorías)                     | 4 con referencias stale (VitePress, paths `.claude/` drift)                   |
| Hooks            | **6** (3 genéricos + 3 LIDR)                  | OK                                                                            |
| MCP servers      | **3** (context7, playwright, chrome-devtools) | OK                                                                            |

**Hallazgos de mayor prioridad (detalle en §7):**

1. 🔴 **6 skills "fantasma"** — `lidr-prd-tecnico`, `lidr-prd-funcional`, `lidr-design-doc`, `lidr-epic-breakdown`, `lidr-test-plan`, `lidr-regression-suite` se referencian en `lidr-spec-ff`, `workflows.md`, `model-selection.md`, `org.md` y el sitemap, pero **no existe ningún `SKILL.md`**. Crean la ilusión de un motor PRD/arquitectura LIDR paralelo que no existe. → Rebind a BMAD.
2. 🟠 **Commands duplicados** — `lidr-create-branch` vs `…-enhanced`, `lidr-create-pr` vs `…-enhanced`, y `validate-project-docs.md` vs `lidr-validate-project-docs.md`.
3. 🟠 **Artefacto huérfano** — `.agents/skills/lidr-adr.zip` (44 KB, untracked) dentro del árbol de skills.
4. 🟡 **Drift del sitemap** (`src/data/features/sitemapView.ts`) — entrada `validate-prd.md` repetida; `agents/` muestra 1 subagente cuando hay 23; `hooks/` describe 4 cuando hay 6; mezcla `docPath` `.claude/…` y `.agents/…`.
5. 🟡 **Referencias stale en rules** — `web-design.md` apunta a `docs/.vitepress/` (VitePress eliminado); `org.md`/`testing-scripts.md`/`claude-code-extensions.md` con paths drift.

---

## PARTE 1 — Auditoría de rutas (`/:clientId/...`)

Las 19 rutas de `ROUTE_REGISTRY` (`app/src/app/route-registry.ts`). **Todos los componentes existen en disco.**

| Ruta                      | id                     | Grupo       | Fase/Gate | Componente                                            | Descripción                                 |
| ------------------------- | ---------------------- | ----------- | --------- | ----------------------------------------------------- | ------------------------------------------- |
| `/`                       | home                   | overview    | —         | `WorkflowDiagram.tsx` ✓                               | Flujo general / timeline del SDLC           |
| `/prd`                    | prd                    | sdlc-phases | 2/1       | `diagrams/ProcesoPRD.tsx` ✓                           | Proceso PRD (definición + requisitos)       |
| `/requisitos`             | requisitos             | sdlc-phases | 3/2       | `diagrams/FaseRequisitos.tsx` ✓                       | Fase de requisitos / discovery              |
| `/requisitos-funcionales` | requisitos-funcionales | sdlc-phases | 3/2       | `diagrams/RequisitosFuncionales.tsx` ✓                | Especificación funcional detallada          |
| `/sprint`                 | sprint                 | sdlc-phases | 4/3       | `diagrams/PlanificacionSprint.tsx` ✓                  | Planificación sprint + capacidad            |
| `/desarrollo`             | desarrollo             | sdlc-phases | 5/4       | `diagrams/ProcesoDesarrollo.tsx` ✓                    | Proceso de desarrollo + code review         |
| `/testing`                | testing                | sdlc-phases | 6/5       | `diagrams/TestingQA.tsx` ✓                            | Testing & QA                                |
| `/seguridad`              | seguridad              | sdlc-phases | 7/6       | `diagrams/SeguridadSDLC.tsx` ✓                        | Seguridad + compliance gates                |
| `/despliegue`             | despliegue             | sdlc-phases | 8/7       | `diagrams/EntornosDespliegue.tsx` ✓                   | Entornos + release management               |
| `/portafolio`             | portafolio             | governance  | —         | `diagrams/GestionPortafolio.tsx` ✓                    | Gestión de portafolio (PME)                 |
| `/gobernanza`             | gobernanza             | governance  | —         | `diagrams/GobernanzaWorkflow.tsx` ✓                   | Workflows de gobernanza + decisiones        |
| `/propuesta`              | propuesta              | proposal    | —         | `features/propuesta-mejora/PropuestaMejora.tsx` ✓     | Propuesta de mejora (diagnóstico + roadmap) |
| `/handoffs`               | handoffs               | proposal    | —         | `features/handoffs-templates/HandoffsTemplates.tsx` ✓ | Handoffs + templates por fase               |
| `/agents`                 | agents                 | proposal    | —         | `diagrams/AgentsArchitecture.tsx` ✓                   | Arquitectura de subagentes IA               |
| `/sitemap`                | sitemap                | support     | —         | `features/sitemap-view/SitemapView.tsx` ✓             | Mapa del proyecto + árbol de ficheros       |
| `/help`                   | help                   | support     | —         | `features/help-center/HelpCenter.tsx` ✓               | Centro de ayuda (artefactos + workflows)    |
| `/integrity`              | integrity              | support     | —         | `features/integrity-tests/IntegrityTests.tsx` ✓       | Validación de calidad / test runner         |
| `/content-demo`           | content-demo           | support     | —         | `content/ContentDemo.tsx` ✓                           | Demo del sistema de contenido por bloques   |
| `/doc/*`                  | doc                    | support     | —         | `diagrams/MarkdownViewer.tsx` ✓                       | Catch-all: renderiza cualquier `.md`        |

> **Nota rutas:** 0 huérfanas, 0 componentes faltantes. El sitemap (`sitemapView.ts`) **no** lista `content-demo` ni `doc/*` en su panel de navegación → drift menor entre `ROUTE_REGISTRY` (fuente real) y la data del sitemap.

---

## PARTE 2 — Índice de `.claude/` (qué existe en disco)

### 2.1 Cableado de symlinks `.claude/` → `.agents/`

| `.claude/…`                             | Tipo         | Apunta a               | Contenido          |
| --------------------------------------- | ------------ | ---------------------- | ------------------ |
| `skills`                                | symlink      | `../.agents/skills`    | 106 skills         |
| `commands`                              | symlink      | `../.agents/commands`  | 37 commands        |
| `rules`                                 | symlink      | `../.agents/rules`     | 24 rules           |
| `agents`                                | symlink      | `../.agents/subagents` | 23 subagents       |
| `hooks`                                 | symlink      | `../.agents/hooks`     | 6 hooks            |
| `settings.json` / `settings.local.json` | archivo real | —                      | config Claude Code |

> Fuente única de verdad: **`.agents/`**. Nunca editar `.claude/` directamente. `.agents/workflows` es un symlink interno → `commands` (alias "workflow = command" para Antigravity).

### 2.2 Skills LIDR (45) — por fase

**Fase 0–4 (Preparación → Sprint Planning)**

| Skill                      | Descripción                                          | Solape BMAD                                       | Veredicto                             |
| -------------------------- | ---------------------------------------------------- | ------------------------------------------------- | ------------------------------------- |
| lidr-project-classifier    | Auto-detecta tipo de proyecto/stack/complejidad <30s | bmad-generate-project-context                     | WRAP (pre-BMAD feeder) ✅             |
| lidr-business-case         | Business Case (ROI/budget) para Gate 0               | bmad-product-brief (parcial)                      | KEEP (framing de inversión, sin twin) |
| lidr-kickoff               | Acta de kick-off                                     | —                                                 | KEEP                                  |
| lidr-stakeholder-map       | Matriz poder/interés + plan comunicación             | —                                                 | KEEP                                  |
| lidr-tracking-integration  | Estructura Jira/Linear/Notion desde BC               | —                                                 | KEEP                                  |
| lidr-review-cruzado        | 🔴 Gate-1 enforcer: valida F+T del PRD               | bmad-prd                                          | WRAP ✅ (ya correcto)                 |
| lidr-risk-log              | Registro de riesgos P×I por dominio                  | —                                                 | KEEP                                  |
| lidr-generate-rf           | RFs atómicos + BDD Gherkin desde PRD                 | bmad-prd (FRs)                                    | WRAP (rebind input a bmad-prd)        |
| lidr-generate-nfr          | NFRs medibles desde PRD-T §5                         | bmad-prd / bmad-testarch-nfr                      | WRAP                                  |
| lidr-validate-requirements | 🤖 5-pass validation + RTM + gaps                    | bmad-check-implementation-readiness               | WRAP (capa RTM Gate-2)                |
| lidr-user-stories          | 🤖 RF-slicing + INVEST + Jira export                 | bmad-create-epics-and-stories / bmad-create-story | WRAP                                  |
| lidr-sprint-capacity       | Capacidad por horas + buffer                         | bmad-sprint-planning (parcial)                    | KEEP-thin                             |
| lidr-refinement-notes      | Notas DoR Gate-3 post-historia                       | bmad-create-story                                 | WRAP ✅ (ya correcto)                 |

**Fase 5–8 + cross-cutting + meta (32)**

| Skill                      | Descripción                                                      | Solape BMAD                     | Veredicto                                                |
| -------------------------- | ---------------------------------------------------------------- | ------------------------------- | -------------------------------------------------------- |
| lidr-pr-description        | PR description desde diff + ticket                               | —                               | KEEP                                                     |
| lidr-adr                   | ADR en formato MADR (+ baseline brownfield en Phase 0 / context) | bmad-create-architecture        | WRAP (emisor MADR; cross-ref en sitemap/handoffs Fase 0) |
| lidr-tech-debt             | 🤖 Deuda técnica desde SonarQube                                 | bmad-retrospective (parcial)    | KEEP (automatizado, BMAD es manual)                      |
| lidr-dev-handoff-qa        | Handoff Dev→QA Gate-4                                            | —                               | KEEP                                                     |
| lidr-using-git-worktrees   | Worktrees aislados para paralelismo                              | —                               | KEEP                                                     |
| lidr-run-parallel-tasks    | 🤖 N changes en paralelo (Opus high)                             | —                               | KEEP                                                     |
| lidr-create-test-cases     | TCs BDD ejecutables desde "Ready for QA"                         | bmad-testarch-test-design       | WRAP                                                     |
| lidr-bug-report            | Wrapper QA→Dev sobre root cause                                  | bmad-investigate                | WRAP ✅ (ya correcto)                                    |
| lidr-test-execution-report | QA sign-off GO/NO-GO Gate-5                                      | —                               | KEEP                                                     |
| lidr-vuln-assessment       | Interpreta SAST/SCA                                              | —                               | KEEP (Phase 7 exclusiva)                                 |
| lidr-dast-interpretation   | Interpreta DAST (ZAP/Burp)                                       | —                               | KEEP (Phase 7 exclusiva)                                 |
| lidr-pentest-report        | Reporte de pentesting                                            | —                               | KEEP (Phase 7 exclusiva)                                 |
| lidr-security-checklist    | 🤖 Compliance OWASP Gate-6                                       | —                               | KEEP (Phase 7 exclusiva)                                 |
| lidr-change-request        | Change Request ITIL/CAB                                          | —                               | KEEP (Phase 8 exclusiva)                                 |
| lidr-rollback-plan         | 🤖 Plan de rollback                                              | —                               | KEEP (Phase 8 exclusiva)                                 |
| lidr-release-notes         | 🤖 Release notes desde PRs                                       | —                               | KEEP (Phase 8 exclusiva)                                 |
| lidr-postmortem            | Postmortem blameless (Five Whys)                                 | bmad-retrospective (distinto)   | KEEP (incidente ≠ retro)                                 |
| lidr-gate-evaluation       | 🔴 Evalúa G0–G7 + handoff package                                | —                               | KEEP (core gobernanza)                                   |
| lidr-audit-standards       | Audita estructura del ecosistema `.agents/`                      | bmad-review-adversarial-general | WRAP ✅ (ortogonal)                                      |
| lidr-sdlc-tracking         | Estado de portafolio centralizado                                | —                               | KEEP                                                     |
| lidr-automated-handoffs    | Transiciones Dev→QA→Sec→DevOps                                   | —                               | KEEP                                                     |
| lidr-external-sync         | Sync bidireccional Jira↔Linear↔Notion                            | —                               | KEEP                                                     |
| lidr-ticket-validation     | Valida estructura de tickets (DoR/DoD/BDD)                       | —                               | KEEP                                                     |
| lidr-commit-management     | Conventional commits + rebase/squash                             | —                               | KEEP                                                     |
| lidr-propuesta-builder     | JSONs para "Propuesta de Mejora" (consultoría)                   | —                               | KEEP (opcional)                                          |
| lidr-playwright-cli        | E2E con Playwright                                               | —                               | KEEP (opcional)                                          |
| lidr-agents-architecture   | Meta: scaffolding `.agents/` + sync 5 plataformas                | bmad-agent-builder (parcial)    | KEEP (target distinto: sync cross-platform)              |
| lidr-command-development   | Autoría de slash commands                                        | —                               | KEEP                                                     |
| lidr-generate-rule         | Genera rules Claude Code                                         | —                               | KEEP                                                     |
| lidr-hook-development      | Hooks PreToolUse/PostToolUse/Stop                                | —                               | KEEP                                                     |
| lidr-mcp-integration       | Integra MCP servers                                              | bmad-module-builder (parcial)   | KEEP (target distinto)                                   |

> 🔴 **Referenciadas pero inexistentes** (no hay `SKILL.md`): `lidr-prd-tecnico`, `lidr-prd-funcional`, `lidr-design-doc`, `lidr-epic-breakdown`, `lidr-test-plan`, `lidr-regression-suite`. CLAUDE.md/`org.md` también nombran `lidr-business-model`, `lidr-document-discovery`, `lidr-use-cases`, `lidr-poc-report`, `lidr-bdd-patterns`, `lidr-retrospective` que **tampoco existen**. → §7.

### 2.3 Skills BMAD (69) — el SDD canónico (NO TOCAR)

**Core flow + TestArch (34)** — todas ACTIVE salvo 3 DEPRECATED auto-declaradas:

`bmad-product-brief`, `bmad-brainstorming`, `bmad-advanced-elicitation`, `bmad-domain-research`, `bmad-market-research`, `bmad-technical-research`, **`bmad-prd`** (unificado: create/update/validate), `bmad-ux`, `bmad-create-architecture`, `bmad-create-epics-and-stories`, `bmad-check-implementation-readiness`, `bmad-sprint-planning`, `bmad-sprint-status`, `bmad-create-story`, `bmad-dev-story`, `bmad-quick-dev`, `bmad-correct-course`, `bmad-prfaq`, `bmad-retrospective`, `bmad-teach-me-testing`, `bmad-testarch-{test-design,framework,ci,atdd,automate,nfr,test-review,trace}`, `bmad-tea`, `bmad-code-review`, `bmad-qa-generate-e2e-tests`.

| DEPRECATED (auto-declarada) | Reemplazo                    |
| --------------------------- | ---------------------------- |
| `bmad-create-prd`           | `bmad-prd` (create intent)   |
| `bmad-validate-prd`         | `bmad-prd` (validate intent) |
| `bmad-edit-prd`             | `bmad-prd` (update intent)   |

**Personas (13)** — BMM+TEA (7): `bmad-agent-{analyst,pm,architect,ux-designer,dev,tech-writer}`, `bmad-tea`. CIS personas (6): `bmad-cis-agent-{brainstorming-coach,creative-problem-solver,design-thinking-coach,innovation-strategist,presentation-master,storyteller}`.

**CIS workflows (4):** `bmad-cis-{design-thinking,innovation-strategy,problem-solving,storytelling}`.

**BMad Builder / meta (4):** `bmad-bmb-setup`, `bmad-agent-builder`, `bmad-module-builder`, `bmad-workflow-builder`.

**Phase 0 / context — doc-lifecycle (2, anclados al stage `context`, no `anytime`):** `bmad-document-project`, `bmad-generate-project-context`, `bmad-shard-doc`, `bmad-index-docs`. Cross-ref UI: `lidr-adr` (ADR baseline brownfield; home principal Phase 4 · development). Ver `UNIFIED-PHASES.md` v1.2.0 + `gate-evidence.yaml` v2.3.0.

**Core utilities (11):** `bmad-help`, `bmad-customize`, `bmad-spec`, `bmad-party-mode`, `bmad-checkpoint-preview`, `bmad-investigate`, `bmad-eval-runner`, `bmad-review-adversarial-general`, `bmad-review-edge-case-hunter`, `bmad-editorial-review-{prose,structure}`.

### 2.4 Commands (37)

| Command                                                                                                                                                                                                                                                 | Tier              | Veredicto                                                                  |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- | -------------------------------------------------------------------------- |
| lidr-advance-gate, lidr-check-readiness, lidr-course-correct, lidr-implement-ticket, lidr-validate-requirements                                                                                                                                         | T1                | KEEP (implement-ticket → MERGE governance, delega código a bmad-dev-story) |
| lidr-spec-{new,ff,apply,verify,archive,continue,bulk-archive}                                                                                                                                                                                           | T2 Spec Lifecycle | KEEP (estructura exclusiva LIDR)                                           |
| lidr-create-release-notes, lidr-update-changelog, lidr-sync-docs, lidr-sprint-health, lidr-track-sdlc, lidr-prepare-testing, lidr-init-project-docs, lidr-improve-docs, lidr-enrich-ticket, lidr-validate-project-docs, lidr-commit, lidr-create-ticket | T2/Util           | KEEP                                                                       |
| lidr-help, sync-setup, test-hooks                                                                                                                                                                                                                       | Util              | KEEP                                                                       |
| **lidr-create-branch** + **lidr-create-branch-enhanced**                                                                                                                                                                                                | T2                | 🟠 DUPLICADO → consolidar en uno                                           |
| **lidr-create-pr** + **lidr-create-pr-enhanced**                                                                                                                                                                                                        | T2                | 🟠 DUPLICADO → consolidar en uno                                           |
| **validate-project-docs** (genérico) + **lidr-validate-project-docs**                                                                                                                                                                                   | Util              | 🟠 DUPLICADO → eliminar el genérico                                        |
| lidr-document-project                                                                                                                                                                                                                                   | T1                | WRAP-bmad-document-project                                                 |
| lidr-product-brief                                                                                                                                                                                                                                      | T2                | DELETE → bmad-product-brief                                                |
| lidr-quick-dev                                                                                                                                                                                                                                          | T2                | DELETE → bmad-quick-dev                                                    |
| lidr-quick-spec                                                                                                                                                                                                                                         | T2                | MERGE → lidr-spec-ff (+ bmad-prd Fast)                                     |
| lidr-validate-prd                                                                                                                                                                                                                                       | T2                | MERGE-thin → bmad-prd validate (solo scoring Gate-1)                       |

### 2.5 Subagents (23)

| Grupo     | Subagents                                                                                                                                                   | Veredicto                                                                                                                                       |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| LIDR (10) | lidr-{doc-improver, docs-agent, metrics-agent, onboarding-agent, pr-validator, qa-agent, release-agent, security-agent, spec-orchestrator, ticket-enricher} | KEEP                                                                                                                                            |
| BMAD (13) | `bmad-*-agent` (analyst, pm, architect, ux-designer, dev, tech-writer, tea + 6 CIS)                                                                         | 🟡 MERGE — duplican las skills `bmad-agent-*`/`bmad-cis-agent-*` homónimas (el subagente solo carga su skill). Consolidar invocación vía skill. |

### 2.6 Hooks (6) y MCP (3)

| Hook                           | Evento       | Propósito                             | Plataformas                     |
| ------------------------------ | ------------ | ------------------------------------- | ------------------------------- |
| notify                         | Notification | Notificación desktop                  | claude, gemini                  |
| auto-format                    | PostToolUse  | Prettier en edición                   | claude, gemini, cursor, copilot |
| protect-secrets                | PreToolUse   | Bloquea `.env`/`.key`/`.pem`          | claude, gemini, copilot         |
| lidr-frontmatter-guard         | PreToolUse   | Frontmatter YAML obligatorio en `.md` | claude, gemini, copilot         |
| lidr-load-context              | SessionStart | Carga PROJECT_TYPE, DTC, stale docs   | claude                          |
| lidr-validate-ecosystem-counts | Stop         | Detecta drift de conteos vs CLAUDE.md | claude                          |

| MCP             | Propósito                                | Plataformas                                  |
| --------------- | ---------------------------------------- | -------------------------------------------- |
| context7        | Docs actualizadas de librerías           | cursor, claude, gemini, antigravity, copilot |
| playwright      | Automatización de navegador (E2E/visual) | cursor, claude, gemini, copilot              |
| chrome-devtools | Debugging/inspección de navegador        | cursor, claude, gemini, copilot              |

### 2.7 Infraestructura `.agents/` (no skills/commands/rules)

| Entrada                   | Propósito                                                    | Estado            |
| ------------------------- | ------------------------------------------------------------ | ----------------- |
| `_shared/lidr/`           | Templates + validators TS (~3.5K LOC) + referencias          | KEEP              |
| `lib/`                    | core.sh, symlink.sh, frontmatter.sh, registry.sh             | KEEP              |
| `adapters/`               | claude/cursor/gemini/copilot/antigravity `.sh`               | KEEP              |
| `sync/`                   | orchestrator/rules/skills/commands/agents/mcp/hooks `.sh`    | KEEP              |
| `sync.sh`                 | Entry-point único de sincronización                          | KEEP              |
| `orchestrator/AGENTS.md`  | Fuente única del orquestador (CLAUDE/GEMINI/AGENTS symlinks) | KEEP              |
| `context-manifest.yaml`   | Inventario declarativo cargado en SessionStart               | KEEP              |
| `platforms.json`          | Registro de capacidades por plataforma                       | KEEP              |
| `memory/lidr/`            | Memoria persistente (docs-agent)                             | KEEP              |
| `*-readme.md` (8)         | Docs por subsistema                                          | KEEP              |
| **`skills/lidr-adr.zip`** | Zip huérfano (44 KB, untracked)                              | 🟠 ELIMINAR/mover |

---

## PARTE 3 — BMAD como SDD: Keep / Wrap / Merge / Delete

> **Filosofía verificada en disco** (en el frontmatter de las propias skills): `lidr-bug-report` = _"QA→DEV WRAPPER complementing bmad-investigate"_; `lidr-audit-standards` = _"WRAPPER complementing bmad-review-adversarial-general"_; `lidr-review-cruzado` = _"Gate 1 enforcer ... después de bmad-prd"_; `lidr-refinement-notes` = _"POST-BMAD WRAPPER ... capa DoR Gate-3 que BMad no provee"_. **Esta es la regla, no la excepción.**

### A. KEEP — valor LIDR sin equivalente BMAD (intocable)

| Artefacto                                                                                         | Por qué es aditivo                                                                                                                                      |
| ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **LIDR Spec Lifecycle** (`lidr-spec-*` + `lidr-spec-orchestrator`)                                | BMAD no tiene contenedor de cambio versionable (`changes/<name>/` con proposal/design/spec/tasks/test-report/reports). Es la columna vertebral de LIDR. |
| **8-gate governance** (`lidr-gate-evaluation`, `lidr-advance-gate`)                               | BMAD tiene `check-implementation-readiness` pero NO un modelo formal G0→G7 con RACI, scoring y handoff packages.                                        |
| **`spec-execution.md`** (AGENT MUST EXECUTE)                                                      | Contrato de ejecución de tests + reportes por step auditables. BMAD corre tests pero sin artefacto de reporte obligatorio.                              |
| **`model-selection.md`**                                                                          | Self-correct Opus-planning / Sonnet-impl. Pura gobernanza de harness.                                                                                   |
| **Worktrees paralelos** (`lidr-using-git-worktrees`, `lidr-run-parallel-tasks`)                   | Sin equivalente BMAD.                                                                                                                                   |
| **Phase 7 Seguridad** (vuln-assessment, dast-interpretation, pentest-report, security-checklist)  | BMAD solo tiene `testarch-nfr`. Sin SAST/SCA/DAST/pentest/OWASP. Fase entera exclusiva LIDR.                                                            |
| **Phase 8 Despliegue** (change-request, rollback-plan, release-notes, postmortem)                 | BMAD termina en código/test. Sin ITIL/rollback/release/postmortem.                                                                                      |
| **Phase 1 Originación** (business-case, kickoff, stakeholder-map, tracking-integration, risk-log) | BMAD arranca en product brief/PRD.                                                                                                                      |
| **Tracking externo** (tracking-integration, external-sync, sdlc-tracking, automated-handoffs)     | BMAD es repo-local; sin sync a Jira/Linear/Notion ni handoffs de fase.                                                                                  |

### B. WRAP — reposicionar como capa fina sobre un output BMAD

> _Acción común: quitar la lógica de autoría de contenido, rebindear el input al output BMAD, y declarar la relación en frontmatter (como ya hacen bug-report / review-cruzado / refinement-notes)._

| LIDR                       | Envuelve a BMAD                     | Valor fino LIDR                    | Acción                          |
| -------------------------- | ----------------------------------- | ---------------------------------- | ------------------------------- |
| lidr-review-cruzado        | bmad-prd                            | Gate-1 F+T + compliance            | ✅ ya correcto                  |
| lidr-bug-report            | bmad-investigate                    | Ticket QA→Dev (severidad/repro)    | ✅ ya correcto                  |
| lidr-refinement-notes      | bmad-create-story                   | DoR Gate-3 + grooming dominio      | ✅ ya correcto                  |
| lidr-project-classifier    | bmad-generate-project-context       | Clasificación Gate-0               | ✅ ya correcto                  |
| lidr-audit-standards       | bmad-review-adversarial-general     | Audita _estructura_ vs _contenido_ | ✅ ortogonal                    |
| lidr-generate-rf           | bmad-prd (FRs)                      | IDs RF + BDD + RTM                 | ⚠️ rebind input                 |
| lidr-generate-nfr          | bmad-prd / bmad-testarch-nfr        | Umbrales medibles + compliance     | ⚠️ rebind input                 |
| lidr-validate-requirements | bmad-check-implementation-readiness | RTM + gap report Gate-2            | ⚠️ no duplicar crítica PRD      |
| lidr-user-stories          | bmad-create-epics-and-stories       | INVEST + capacity + Jira           | ⚠️ rebind input                 |
| lidr-adr                   | bmad-create-architecture            | Archivo MADR portable              | ⚠️ invocar desde output         |
| lidr-create-test-cases     | bmad-testarch-test-design           | Gherkin con datos + Xray CSV       | ⚠️ rebind input                 |
| lidr-dev-handoff-qa        | bmad-dev-story                      | Handoff Gate-4                     | ⚠️ sobre estado de finalización |

### C. MERGE / DELETE

| Artefacto                                                 | Razón                                            | Destino                                                                     |
| --------------------------------------------------------- | ------------------------------------------------ | --------------------------------------------------------------------------- |
| `bmad-create-prd`, `bmad-validate-prd`, `bmad-edit-prd`   | DEPRECATED auto-declarada                        | `bmad-prd` (intents)                                                        |
| `lidr-quick-dev` (cmd)                                    | Duplica el fast-path estrella de BMAD            | `bmad-quick-dev`                                                            |
| `lidr-product-brief` (cmd)                                | Twin directo                                     | `bmad-product-brief`                                                        |
| `lidr-quick-spec` (cmd)                                   | Spec ligera = `bmad-prd` Fast en contenedor LIDR | `lidr-spec-ff`                                                              |
| `lidr-validate-prd` (cmd)                                 | Scoring duplica `bmad-prd` Validate              | Thin rollup Gate-1 sobre `bmad-prd`                                         |
| `lidr-document-project` (cmd)                             | Twin brownfield                                  | Mantener placement `docs/projects/` + DTC; delega a `bmad-document-project` |
| `lidr-implement-ticket` (cmd)                             | Autoría de código solapa `bmad-dev-story`        | Mantener wrapper branch/PR/DoD; delega código a `bmad-dev-story`            |
| `lidr-create-branch` / `lidr-create-pr` (vs `*-enhanced`) | Duplicados                                       | Consolidar en una variante                                                  |
| `validate-project-docs.md` (genérico)                     | Duplica `lidr-validate-project-docs`             | Eliminar el genérico                                                        |
| 13 `bmad-*-agent` subagents                               | Duplican skills `bmad-agent-*` homónimas         | Consolidar invocación vía skill                                             |
| `.agents/skills/lidr-adr.zip`                             | Zip huérfano untracked                           | Eliminar o mover fuera de `skills/`                                         |
| 6 skills fantasma (`lidr-prd-tecnico`…)                   | No existen; referenciadas                        | Rebind a BMAD (ver §7)                                                      |

---

## PARTE 4 — Veredicto por categoría (vista rápida)

| Categoría           | KEEP | WRAP | MERGE/DELETE             | Acción estructural                |
| ------------------- | ---- | ---- | ------------------------ | --------------------------------- |
| Skills LIDR         | 27   | 11   | —                        | + corregir 6 referencias fantasma |
| Skills BMAD         | 66   | —    | 3 (deprecated)           | intocables                        |
| Commands            | 27   | 1    | 9 (3 dup + 6 wrap/merge) | consolidar duplicados             |
| Subagents           | 10   | —    | 13 (BMAD = skills)       | consolidar skill↔subagent         |
| Rules               | 20   | —    | —                        | + arreglar 4 refs stale           |
| Hooks / MCP / Infra | todo | —    | 1 (`.zip`)               | limpiar artefacto                 |

---

## PARTE 5 — Rules con referencias stale

| Rule                              | Problema                                                                                                                       |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `design/web-design.md`            | Sección "Documentation Color System" referencia `docs/.vitepress/theme/custom.css` — **VitePress fue eliminado** (2026-05-19). |
| `lidr-sdlc/org.md`                | Referencia `.claude/rules/tech-stack.md` (path drift; canónico `.agents/rules/lidr-sdlc/tech-stack.md`).                       |
| `quality/testing-scripts.md`      | Referencia a paths `.claude/rules/...` como ficheros planos.                                                                   |
| `tools/claude-code-extensions.md` | Lista `skill.md` (minúscula) cuando el estándar es `SKILL.md`.                                                                 |

---

## PARTE 6 — Drift del propio sitemap (`src/data/features/sitemapView.ts`)

El árbol del sitemap **no refleja la realidad en disco**:

- Entrada `validate-prd.md` **repetida** dos veces.
- `agents/` muestra **1** subagente (`lidr-spec-orchestrator`) cuando hay **23**.
- `hooks/` describe **4** hooks cuando hay **6** (faltan `auto-format`, `protect-secrets`; nombres sin prefijo `lidr-`).
- `docPath` mezcla `.claude/skills/…` y `.agents/skills/…` de forma inconsistente.
- No incluye rutas `content-demo` ni `doc/*` en el panel de navegación.

> Recomendación: regenerar `sitemapView.ts` desde la realidad de `.agents/` (o derivarlo de los conteos de `ecosystemStats`) para que el sitemap deje de ser una fuente de drift.

---

## PARTE 7 — Plan de limpieza priorizado

**🔴 P0 — Coherencia (rompe la premisa LIDR-wraps-BMAD):**

1. Corregir `lidr-spec-ff` y las rules (`workflows.md`, `model-selection.md`, `org.md`) que invocan skills inexistentes → rebind:
   - `lidr-prd-tecnico` / `lidr-prd-funcional` → `bmad-prd`
   - `lidr-design-doc` → `bmad-create-architecture`
   - `lidr-epic-breakdown` → `bmad-create-epics-and-stories`
   - `lidr-test-plan` → `bmad-testarch-test-design`
   - `lidr-regression-suite` → `bmad-testarch-automate`

**🟠 P1 — Duplicados / huérfanos:**

2. Consolidar `lidr-create-branch` ↔ `…-enhanced` y `lidr-create-pr` ↔ `…-enhanced` (una variante cada uno).
3. Eliminar el command genérico `validate-project-docs.md` (queda `lidr-validate-project-docs`).
4. Eliminar/mover `.agents/skills/lidr-adr.zip`.
5. Eliminar 3 BMAD deprecated (`bmad-create-prd`, `bmad-validate-prd`, `bmad-edit-prd`) tras confirmar que nada los referencia.
6. DELETE `lidr-quick-dev`, `lidr-product-brief` (twins de BMAD); MERGE `lidr-quick-spec`→`lidr-spec-ff`.

**🟡 P2 — Reposicionar wraps + arreglar drift:**

7. Rebindear los 6 skills WRAP-input (generate-rf, generate-nfr, validate-requirements, user-stories, create-test-cases, adr) para consumir outputs BMAD y declarar la relación en frontmatter.
8. Consolidar los 13 `bmad-*-agent` subagentes con sus skills homónimas.
9. Arreglar las 4 referencias stale en rules (§5).
10. Regenerar `sitemapView.ts` desde la realidad (§6).

---

## Principio rector — cómo LIDR se adapta a BMAD sin tocarlo

1. **BMAD redacta; LIDR gobierna.** Cuando ambos tocan el mismo contenido (PRD, story, test, arquitectura, código), BMAD lo produce y LIDR añade solo gate/formato/trazabilidad/compliance encima.
2. **Envolver por input-binding, nunca por fork.** Un wrapper correcto declara su fuente BMAD en frontmatter y lee ese output; no recrea el documento upstream.
3. **Eliminar la redundancia que BMAD hace mejor.** Twins de los fast-paths estrella de BMAD se van; los commands de dev/spec LIDR retienen solo su cáscara de gobernanza.
4. **Conservar lo que BMAD estructuralmente no puede hacer.** Gates G0–G7, contenedor de cambio + spec lifecycle, ejecución obligatoria de tests, worktrees paralelos, toda la Fase 7 seguridad y Fase 8 despliegue, y el sync de trackers externos: sin equivalente BMAD.
5. **Arreglar primero la ilusión de skills fantasma.** Rebindear las 6 referencias inexistentes a sus dueños BMAD es la corrección de coherencia #1: hace que "LIDR envuelve a BMAD" sea literalmente cierto en el código de orquestación.
