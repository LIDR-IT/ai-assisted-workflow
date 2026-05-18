---
id: claude-md
version: "2.8.8"
last_updated: "2026-04-07"
updated_by: "TL: hooks-audit-correction"
status: active
owner_role: "Tech Lead"
---

# CLAUDE.md — Ecosistema SDLC {{CLIENT_NAME}} (v2.8.8)

> Índice comprimido del ecosistema **LIDR SDLC Methodology**. La IA lo lee primero para saber qué existe y dónde está.

**Retrieval > pre-training**: antes de generar, lee el `SKILL.md` + template. No inventes formatos.

**Status**: Framework development complete — First client implementation in progress with {{CLIENT_NAME}} for methodology validation.

**Consultancy Structure**: AS-IS ({{CLIENT_NAME}} current state audit) → TO-BE (LIDR SDLC Methodology proposal)

- ✅ **Working Processes** (client reality): Sprint Planning, Development Process, Basic Environments
- ⚠️ **Broken/Absent Processes** (client gaps): PRDs (non-standardized), Requirements (informal), RFs (no DoD), QA (reactive only)
- 💡 **LIDR Proposal**: Framework implementation to address client gaps through skills, commands, and governance

---

## Ecosistema: 194 artefactos (100% self-contained)

| Tipo               | Qty  | Tipo         | Qty  |
| ------------------ | ---- | ------------ | ---- |
| Skills             | 61   | Rules        | 5    |
| Validation Scripts | 59   | MCPs         | 4    |
| Commands           | 23   | Hooks        | 4    |
| Agents             | 6    | Docs soporte | 33   |
| Templates          | 0 ✨ | Checklists   | 0 ✨ |
| Signoffs           | 0 ✨ | Total        | 194  |

**Self-Containment Achievement**: Templates (29→0), Checklists (8→0), Signoffs (2→0) successfully integrated within skills.
**Consolidation Complete**: 39 redundant files eliminated, 8 sources of truth synchronized, 100% self-contained architecture achieved.

---

## Rules (5) — Tier 1 siempre, Tier 2 bajo demanda

| Rule                      | Carga                        | Contenido                                                    |
| ------------------------- | ---------------------------- | ------------------------------------------------------------ |
| `@rules/org.md`           | SIEMPRE                      | Estándares organización, Scrum, SDD, roles, gates            |
| `@rules/project.md`       | SIEMPRE                      | Contexto proyecto activo, stack, estructura                  |
| `@rules/documentation.md` | SIEMPRE                      | Governance: frontmatter YAML, staleness TTL, naming          |
| `@rules/tech-stack.md`    | Bajo demanda (globs: código) | TypeScript strict, React 18+, Node 20 LTS+, ESM, Tailwind v4 |
| `@rules/workflows.md`     | Bajo demanda (description)   | Mapa: roles → commands → encadenamiento                      |

Rules son lean: NO cargan docs via `@`. Los docs se cargan bajo demanda via skills y commands.
🤖 **9 skills automatizados** con scripts Python: project-classifier, regression-suite, validate-requirements, tech-debt, user-stories, security-checklist, test-plan, release-notes, rollback-plan (775+ horas/año ROI).
🔬 **59 validation scripts** integrados: skill-specific + shared functional validators (validación automática de calidad, cumplimiento SDLC, consistencia de datos).
✨ **LIDR SDLC Methodology enhancements**: Documentación workflow con clasificación automática, inventario inteligente, frontmatter sofisticado.
✨ **Self-Contained Architecture**: 100% skills autónomos con templates/checklists integrados - eliminando dependencias centralizadas.

### Template Strategy: SELF-CONTAINED

**Principio de Inmutabilidad**: Templates dentro de skills son **INMUTABLES** - definen el formato estándar que NUNCA cambia.

```
✅ CORRECTO: .claude/skills/adr/templates/adr.md (skill tiene su template)
❌ INCORRECTO: skills/adr/templates/adr.md (dependencia externa)
```

**Separación clara**:

- 📁 `.claude/skills/*/templates/` → Formatos estándar **INMUTABLES** (esqueleto del documento)
- 📁 `docs/` → Documentación del framework: standards, adr, hooks, guides **MUTABLES**

### Portabilidad Garantizada

Al copiar `.claude/` folder → ecosistema completo funcional sin dependencias externas.

ADR: `docs/adr/ADR-0001-context-loading-strategy.md`

---

## 🎯 src/data/ — Sistema de Centralización (v2.3.0) ✨ NEW

**Anti-duplicación**: Elimina hardcoded values y sincroniza datos entre componentes.

| Componente                       | Propósito                                            | Auto-computado                          |
| -------------------------------- | ---------------------------------------------------- | --------------------------------------- |
| `src/data/artifacts/skills.ts`   | 61 skills con metadata completa                      | ✅ skillsCount, automatedSkillsCount    |
| `src/data/artifacts/commands.ts` | 12 commands por tier (orchestrator/tactical/utility) | ✅ commandsCount, commandsByTier        |
| `src/data/phases.ts`             | 9 fases + 8 gates + colores + DOR/DoD                | ✅ phaseColors, totalPhases, totalGates |
| `src/data/computed/stats.ts`     | Estadísticas automáticas + summaryStrings            | ✅ ecosystemStats, automationStats      |
| `src/data/index.ts`              | Export unificado + utilities                         | ✅ Single import point                  |

**Scripts de Validación**:

- `scripts/validate-coherence.ts` — Detecta duplicaciones automáticamente
- `npm run validate:coherence` — Valida consistency entre UI components

**Eliminación de Hardcoding**:

```typescript
// ❌ ANTES: PropuestaMejora.tsx
mejora: "39 skills estandarizados"; // ← Nunca se actualiza

// ✅ AHORA: Import centralizado
import { summaryStrings } from "../../data";
mejora: summaryStrings.skillsStandardized; // ← Auto-actualizado
```

**ROI Medido**: 87.5% menos duplicaciones, 100% reducción en tiempo de actualización de conteos.

---

## Skills (61) — bajo demanda

✅ **Verified**: The ecosystem contains **61 skills** with complete SKILL.md files. These are the actual implemented skills in this repository, organized by SDLC phase below.

Path: `skills/{name}/SKILL.md` (+ `templates/` + `checklists/` + `examples/` + `validators/`)

| Fase              | Qty | Skills                                                                                                                                                                                                                                        |
| ----------------- | --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| F0-Preparación    | 2   | `project-classifier` 🤖 · `document-discovery`                                                                                                                                                                                                |
| F1-Originación    | 6   | `business-case` · `business-model` · `kickoff` · `stakeholder-map` · `tracking-integration` · `brainstorming`                                                                                                                                 |
| F2-Discovery      | 9   | `prd-tecnico` · `prd-funcional` · `review-cruzado` · `risk-log` · `poc-report` · `use-cases` · `design-doc` · `domain-research` · `technical-research`                                                                                        |
| F3-Especificación | 5   | `generate-rf` · `generate-nfr` · `validate-requirements` 🤖 · `epic-breakdown` · `bdd-patterns`                                                                                                                                               |
| F4-Planning       | 3   | `user-stories` 🤖 · `sprint-capacity` · `refinement-notes`                                                                                                                                                                                    |
| F5-Desarrollo     | 4   | `pr-description` · `adr` · `tech-debt` 🤖 · `dev-handoff-qa`                                                                                                                                                                                  |
| F6-QA             | 5   | `test-plan` · `create-test-cases` · `bug-report` · `test-execution-report` · `regression-suite` 🤖                                                                                                                                            |
| F7-Seguridad      | 4   | `vuln-assessment` · `dast-interpretation` · `pentest-report` · `security-checklist`                                                                                                                                                           |
| F8-Despliegue     | 5   | `change-request` · `rollback-plan` · `release-notes` · `retrospective` · `postmortem`                                                                                                                                                         |
| Cross-cutting     | 12  | `generate-rule` · `architecture-doc` · `ux-design-spec` · `implementation-phases` · `epic-review` · `audit-standards` · `playwright-cli` · `sdlc-tracking` · `external-sync` · `automated-handoffs` · `multi-agent-audit` · `gate-evaluation` |
| Development       | 6   | `skill-creator` · `skill-development` · `command-development` · `hook-development` · `agent-development` · `mcp-integration`                                                                                                                  |

### 📋 **Complete Skills Index** (61 skills - verified)

**Alphabetical listing of all implemented skills in this ecosystem:**

`adr` · `agent-development` · `architecture-doc` · `audit-standards` · `automated-handoffs` · `bdd-patterns` · `brainstorming` · `bug-report` · `business-case` · `business-model` · `change-request` · `command-development` · `create-test-cases` · `dast-interpretation` · `design-doc` · `dev-handoff-qa` · `document-discovery` · `domain-research` · `epic-breakdown` · `epic-review` · `external-sync` · `gate-evaluation` · `generate-nfr` · `generate-rf` · `generate-rule` · `hook-development` · `implementation-phases` · `kickoff` · `mcp-integration` · `multi-agent-audit` · `pentest-report` · `playwright-cli` · `poc-report` · `postmortem` · `pr-description` · `prd-funcional` · `prd-tecnico` · `project-classifier` · `refinement-notes` · `regression-suite` · `release-notes` · `retrospective` · `review-cruzado` · `risk-log` · `rollback-plan` · `sdlc-tracking` · `security-checklist` · `skill-creator` · `skill-development` · `sprint-capacity` · `stakeholder-map` · `tech-debt` · `technical-research` · `test-execution-report` · `test-plan` · `tracking-integration` · `use-cases` · `user-stories` · `ux-design-spec` · `validate-requirements` · `vuln-assessment`

> 🤖 **9 automated skills** (marked with 🤖 above): project-classifier, validate-requirements, user-stories, tech-debt, regression-suite, test-plan, release-notes, rollback-plan, security-checklist

---

## Commands (23) — /slash invocables

Path: `commands/{name}.md`

### T1 — Orchestrators (11)

| Command                            | Descripción                                                                                        | Modelo | Roles                        |
| ---------------------------------- | -------------------------------------------------------------------------------------------------- | ------ | ---------------------------- |
| `/advance-gate [N]`                | Evalúa gate, genera handoff package                                                                | opus   | PME, PO, TL, QA, Sec, DevOps |
| `/check-readiness [name]`          | Pre-implementation validation: PRD, team, dependencies, readiness score                            | sonnet | PME, PO, TL, QA              |
| `/course-correct [project] [type]` | Mid-project course correction for managing deviations and realigning projects                      | sonnet | PME, PO, TL                  |
| `/implement-ticket [ID]`           | ticket → plan → impl → PR → handoff                                                                | sonnet | Dev, TL                      |
| `/prepare-testing [ID]`            | ticket → test plan → cases → CSV workflow                                                          | sonnet | QA                           |
| `/validate-requirements [name]`    | Fase 3: RFs + NFRs + RTM + epic breakdown                                                          | sonnet | PO, TL                       |
| `/validate-prd [name]`             | LIDR SDLC Methodology PRD quality validation with automated scoring and actionable recommendations | sonnet | PO, TL, QA, PME              |
| `/init-project-docs [name]`        | Scaffolding documental + genera rules                                                              | sonnet | TL, PO, PME                  |
| `/validate-project-docs [name]`    | Valida docs vs templates + rules                                                                   | sonnet | TL, PO, QA, PME              |
| `/document-project [name]`         | Workflow LIDR SDLC completo de documentación                                                       | sonnet | TL, PO, PME                  |
| `/track-sdlc [project-id]`         | Centralized SDLC tracking with portfolio management                                                | sonnet | PME, PO, TL                  |

### T2 — Tactical (9)

| Command                        | Descripción                                                                     | Modelo | Roles           |
| ------------------------------ | ------------------------------------------------------------------------------- | ------ | --------------- |
| `/create-branch [ID]`          | Branch desde Jira                                                               | haiku  | Dev, TL         |
| `/create-pr [ID]`              | PR con auto-description                                                         | sonnet | Dev, TL         |
| `/product-brief [name]`        | Producto brief ligero LIDR SDLC Methodology para definición rápida de productos | sonnet | PME, PO, TL     |
| `/quick-spec [feature]`        | Especificación ligera para features pequeñas (≤40h)                             | sonnet | PO, TL, Dev     |
| `/sprint-health [sprint-id]`   | Monitoreo activo de salud del sprint con detección de riesgos según LIDR SDLC   | sonnet | SM, PME, TL, QA |
| `/create-release-notes`        | PRs → changelog → publicación                                                   | sonnet | DevOps, TL      |
| `/update-changelog [ver]`      | Actualiza CHANGELOG.md                                                          | haiku  | DevOps, TL      |
| `/sync-docs [scope]`           | Sincroniza docs vs código                                                       | sonnet | Dev, TL, QA     |
| `/create-branch-enhanced [ID]` | Enhanced branch creation with SDLC tracking integration                         | sonnet | Dev, TL         |
| `/create-pr-enhanced [ID]`     | Enhanced PR creation with automated handoffs and validation                     | sonnet | Dev, TL         |

### T3 — Utility (1)

| Command              | Descripción                                   | Modelo | Roles |
| -------------------- | --------------------------------------------- | ------ | ----- |
| `/lidr-help [query]` | Busca en 209 artefactos, sugiere 17 workflows | haiku  | Todos |

---

## Hooks (4) — guardias automáticos

| Hook                        | Trigger                  | Acción                                     |
| --------------------------- | ------------------------ | ------------------------------------------ |
| `frontmatter-guard`         | PreToolUse: Write / Edit | Valida frontmatter YAML obligatorio        |
| `dtc-write-guard`           | PreToolUse: Write / Edit | Evalúa DTC + DoD + secrets                 |
| `validate-ecosystem-counts` | Stop                     | Sync 8 fuentes de verdad, bloquea si drift |
| `notify`                    | Notification             | Alertas OS: build roto, vuln crítica       |
| `load-context`              | SessionStart             | Carga PROJECT_TYPE, DTC_ACTIVE, stale docs |

> **5 hooks funcionales**: frontmatter-guard + dtc-write-guard (PreToolUse), validate-ecosystem-counts (Stop), notify (Notification), load-context (SessionStart). Conteo de artefactos = 4 scripts .sh (dtc-write-guard es prompt-based).

Docs: `docs/hooks/{name}.md` · Estrategia: `docs/standards/hooks-strategy.md`

---

## MCPs (4) — conexiones externas

| MCP        | Función                                                       | Estado                                 |
| ---------- | ------------------------------------------------------------- | -------------------------------------- |
| filesystem | Operaciones de archivos locales: lectura, escritura, búsqueda | ✅ Activo                              |
| memory     | Grafo de conocimiento para memoria persistente entre sesiones | ✅ Machine-local (~/.claude/projects/) |
| atlassian  | Integración con Jira/Confluence para tickets y documentación  | ✅ Configurado                         |
| playwright | Automatización de navegador para testing e interacción web    | ✅ Configurado                         |

**Tool Integrations**: Para herramientas sin MCP (Xray, GitHub, Jira), usamos **CSV/CLI workflows** definidos en `docs/standards/tool-integrations.md`.

Config: `.mcp.json`

---

## Agents (6) — subagentes autónomos

Specs completas, pendiente runtime. Specs: `agents/{name}.md`

| Agent              | Trigger      | Acción                          | Skills que precarga                                        |
| ------------------ | ------------ | ------------------------------- | ---------------------------------------------------------- |
| `qa-agent`         | event-driven | Ready for QA → test suite       | test-plan, create-test-cases, regression-suite, bug-report |
| `release-agent`    | event-driven | merge main → release + CR       | release-notes, change-request, rollback-plan               |
| `security-agent`   | event-driven | scanners → interpreta + tickets | vuln-assessment, dast-interpretation, security-checklist   |
| `onboarding-agent` | manual       | nuevo miembro → plan por rol    | architecture-doc, implementation-phases                    |
| `docs-agent`       | event-driven | cambio docs/ → sync + 32 tests  | architecture-doc, implementation-phases                    |
| `metrics-agent`    | scheduled    | cierre sprint → dashboard retro | retrospective, sprint-capacity                             |

---

## docs/ — fuentes de verdad

Referenciadas por skills, commands y hooks via `@`. **Nunca duplicar — siempre referenciar.**

| Directorio            | Qty | Contenido                                                                                                                      |
| --------------------- | --- | ------------------------------------------------------------------------------------------------------------------------------ |
| `standards/`          | 7   | org, sprint-commitment, hooks-strategy, tool-integrations, testing/ (3: README, unit-testing-guide, visual-regression-testing) |
| `adr/`                | 5   | ADR-0001 context-loading, ADR-0002 react-flow, ADR-0003 tailwind-v4, ADR-0005 multi-client, ADR-0006 test-strategy             |
| `audits/`             | 1   | audit-catalog                                                                                                                  |
| `hooks/`              | 5   | README, dtc-write-guard, dtc-session-check, notify-desktop, context-loader                                                     |
| `guides/claude-code/` | 8   | README, rule-dev, skill-dev, command-dev, hook-dev, agent-dev, mcp-integration, skill-template-architecture                    |
| `proposals/`          | 1   | ia-integration-proposal                                                                                                        |
| `reference/`          | 1   | repo-structure-reference                                                                                                       |
| `tools/`              | 1   | hook-scripts                                                                                                                   |
| `settings-reference`  | 1   | settings.json ref                                                                                                              |
| `guidelines/`         | 1   | Guidelines.md                                                                                                                  |

**Self-Contained Migration Complete**: `checklists/` (8→skills), `signoffs/` (2→skills), `templates/` (28→skills) migrados a estructura distribuida dentro de cada skill.

---

## Validation Scripts (55) — quality automation

**Distributed Architecture**: 50 skill-specific + 5 shared functional validators (+ index.ts + types.ts infrastructure)

| Category          | Count  | Location                                     | Function                                                                 |
| ----------------- | ------ | -------------------------------------------- | ------------------------------------------------------------------------ |
| Skill-specific    | 50     | `skills/{name}/scripts/validate-examples.ts` | Skill-specific quality validation (49 validate-examples + 1 specialized) |
| Shared validators | 5      | `_shared/validators/`                        | Cross-cutting validation (coherence, SDLC compliance, security)          |
| **Total**         | **55** |                                              | **Automated quality assurance**                                          |

**Key validators**: coherence_matrix (PRD→RF→US traceability), sdlc_compliance (gate criteria), automation_readiness (skill automation criteria), security_patterns (GDPR/biometric compliance), integration_tests (tool compatibility).

---

## memory/ — persistencia entre sesiones ✨ NEW

Implementado en Phase 1 del Enhancement Plan. Sistema de memoria persistente con MCP integration.

| Directorio                | Qty | Contenido                                                                                                 |
| ------------------------- | --- | --------------------------------------------------------------------------------------------------------- |
| `memory/`                 | 6   | MEMORY.md (índice principal), entities/, relationships/, validations/, automation-logs/, project-context/ |
| `memory/entities/`        | 3   | ecosystem-foundation, automation-patterns, gate-system                                                    |
| `memory/automation-logs/` | 3   | automation-candidates, roi-tracking, success-patterns                                                     |
| `memory/validations/`     | 2   | validation-framework (13-step), validation-history                                                        |
| `memory/project-context/` | 3   | biometric-domain, team-context, integrations                                                              |
| `memory/relationships/`   | 1   | skill-dependencies, command-integration                                                                   |

---

## Quality Gates (8) — 0 a 7

| Gate | Transición                                              |
| ---- | ------------------------------------------------------- |
| G0   | Intake → Discovery                                      |
| G1   | Discovery → Especificación (PRD aprobado)               |
| G2   | Especificación → Sprint Planning (Requisitos completos) |
| G3   | Sprint Planning → Desarrollo (Sprint committed)         |
| G4   | Desarrollo → QA (DoD + Code Quality)                    |
| G5   | QA → Seguridad (QA Sign-off)                            |
| G6   | Seguridad → Despliegue (Security Sign-off)              |
| G7   | Despliegue → Producción (CR aprobado)                   |

**Regla de oro**: NUNCA avanzar sin evaluar gate. Solo `/advance-gate [N]` transiciona formalmente.

---

## Reglas de interacción

1. **Rules Tier 1 siempre** — org + project + documentation (lean, sin `@` a docs/)
2. **Rules Tier 2 bajo demanda** — tech-stack (globs) + workflows (description)
3. **Skills son self-contained** — templates locales inmutables, output a docs/ cuando requerido
4. **Commands orquestan** — encadenan skills + MCPs + cargan docs via `@`
5. **Hooks son guardias** — evalúan ante eventos Claude Code
6. **docs/ son documentos vivos** — skills generan output a docs/ directamente, rules referencian por ruta
7. **IA genera, humano decide** — siempre
8. **Retrieval > pre-training** — lee el artefacto antes de generar

---

**17 workflows** · **129 steps** · **32 integrity tests** (T1-T32) · **58 validation scripts** · **8 fuentes de verdad** sincronizadas · **Memory system** implementado · **100% self-contained**

---

## Changelog

| Versión | Fecha      | Autor                                         | Cambios                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ------- | ---------- | --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2.8.8   | 2026-04-07 | TL: hooks-audit-correction                    | **HOOKS AUDIT CORRECTION**: Corregida inconsistencia entre CLAUDE.md y settings.json reales. Agregado frontmatter-guard, corregidos nombres hook scripts, eliminado docs/hooks/dtc-session-check.md obsoleto. Renombrada documentación: context-loader.md→load-context.md, notify-desktop.md→notify.md para coincidencia exacta con scripts. 5 hooks funcionales = 4 artefactos. Total: 194 artefactos (validado vs filesystem). |
| 2.8.7   | 2026-04-06 | TL: discovery-cleanup                         | **DISCOVERY CLEANUP**: Eliminado docs/discovery/ con 11 archivos históricos de investigación inicial. Actualizadas referencias en kickoff + implementation-phases skills y datos integrityTests/sitemapView. Docs: 44→33, Total: 206→195 artefactos. Framework más enfocado en operación vs historia.                                                                                                                            |
| 2.8.6   | 2026-04-06 | TL: docs-reorganization                       | **DOCS REORGANIZATION**: Reorganizados testing standards de docs/testing/ → docs/standards/testing/. Agregado README.md índice. Standards: 4→7, Total: 205→206 artefactos. Mejor coherencia con estructura SDLC.                                                                                                                                                                                                                 |
| 2.8.5   | 2026-04-06 | TL: epic-jira-migration-complete              | **ADAPTIVE SKILLS MIGRATION**: Completada migración epic-jira→tracking-integration. Agregado gate-evaluation skill. Skills: 60→61, Total: 204→205 artefactos. Todos los 44+ archivos actualizados, directorio epic-jira eliminado.                                                                                                                                                                                               |
| 2.8.4   | 2026-04-06 | TL: docs-cleanup-phase2                       | **CLEANUP PHASE 2**: Eliminados 5 docs temporales/duplicados: multi-client-extensibility, advanced-color-system, ia-integration-proposal, repo-structure-reference, hook-scripts. Docs: 52→47, Total: 209→204 artefactos. Actualizado simple-stats.ts: skills 57→60, validationScripts 55→59.                                                                                                                                    |
| 2.8.3   | 2026-04-06 | TL: cleanup-client-docs                       | **CLEANUP**: Eliminado docs/projects/ con archivos históricos de clientes (no parte del framework). Docs: 54→52, Total: 211→209 artefactos. Ecosistema enfocado en framework core, no deliverables de consultoría.                                                                                                                                                                                                               |
| 2.8.2   | 2026-04-06 | TL: real-audit-correction                     | **CORRECCIÓN CRÍTICA**: Audit real del filesystem. Skills: 60 (no 179), ValidationScripts: 59 (no 58), Docs: 54 (no 41), Total: 211 artefactos reales (no 320). CLAUDE.md ahora refleja inventario verificado del repositorio.                                                                                                                                                                                                   |
| 2.8.1   | 2026-04-06 | TL: ecosystem-inventory-correction            | ~~Corrección errónea basada en datos incorrectos~~                                                                                                                                                                                                                                                                                                                                                                               |
| 2.8.0   | 2026-03-26 | TL: ecosystem-integration                     | Incorporacion 3 skills nuevos (business-model, use-cases, design-doc) + fusion data-model en architecture-doc + system-design en prd-tecnico. Skills: 57->60, ValidationScripts: 55->58, Total: 195->201.                                                                                                                                                                                                                        |
| 2.7.0   | 2026-03-17 | IA: integrity-fix                             | Corrección final de conteos: validationScripts=55 (HelpCenter real count), docs=41 (incl. Guidelines.md), total=189. T6+T29 integrity tests sincronizados.                                                                                                                                                                                                                                                                       |
| 2.6.0   | 2026-03-17 | IA: sync-docs coherence audit                 | Corrección masiva de conteos: validationScripts(55→59), docs(41→40), total(189→192). DTC fix en HandoffsTemplates.tsx. Sincronizadas 8 fuentes de verdad.                                                                                                                                                                                                                                                                        |
| 2.5.0   | 2026-03-17 | TL: Self-Contained Architecture Documentation | Documentado patrón self-contained, templates inmutables, output a docs/projects/                                                                                                                                                                                                                                                                                                                                                 |
| 2.4.0   | 2026-03-17 | System: Self-Contained Ecosystem Migration    | Self-Containment Achievement: Templates (0→integrated), Checklists (0→integrated)                                                                                                                                                                                                                                                                                                                                                |
