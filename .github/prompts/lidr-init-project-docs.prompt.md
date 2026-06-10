---
description: Initialize project documentation from templates
agent: 'agent'
---

<!--
COMMAND: init-project-docs
VERSION: 4.0.0
AUTHOR: SDLC Team
LAST UPDATED: 2026-03-17

PURPOSE:
Creates project documentation scaffold using self-contained skill templates.
Generates all required docs with correct frontmatter and project context.

USAGE:
  /lidr-init-project-docs my-project
  /lidr-init-project-docs {{CLIENT_CODE}}-enrollment

ARGUMENTS:
  project-name: Slug-format name (required). Used for folder and references.

REQUIREMENTS:
  - skills/ directory with self-contained skills
  - .claude/rules/ configured

RELATED COMMANDS:
  /lidr-validate-project-docs - Validates docs against template criteria
  /lidr-sync-docs             - Updates docs after code changes

SKILLS USED:
  lidr-generate-rule     - Generates rule files for .claude/rules/lidr-sdlc/

CHANGELOG:
  v5.0.0 (2026-06-10): "Wrap BMad, don't duplicate" — stopped scaffolding
                        PRD/UX/architecture from removed LIDR templates; those
                        artifacts now DEFER to bmad-prd, bmad-ux, and
                        bmad-create-architecture. Scaffolds only LIDR-genuine
                        docs (business-case, RF/NFR, ADR, DTC specs).
  v4.0.1 (2026-06-10): Repointed skill template paths (lidr-* prefixes, correct
                        filenames product-brief.md/deployment.md); rules generated
                        under lidr-sdlc/; lidr-generate-rule skill name.
  v4.0.0 (2026-03-17): Updated for self-contained architecture - templates now in skills/{name}/templates/
  v3.0.0 (2026-03-09): Added rule generation step using generate-rule skill
  v2.0.0 (2025-03-05): Rewritten to official command format
  v1.0.0 (2025-02-20): Initial version
-->

# Initialize Project Docs: $1

Load: @../rules/lidr-sdlc/documentation.md for frontmatter standards.
Load: @../rules/lidr-sdlc/project.md for project context.

## Validate

If "$1" is empty:
❌ Project name required.
Usage: /lidr-init-project-docs [project-name]
Example: /lidr-init-project-docs {{CLIENT_CODE}}-enrollment
Exit.

Check if docs already exist: !`test -d docs/projects/$1 && echo "EXISTS" || echo "NEW"`

If EXISTS:
Use AskUserQuestion:

- question: "Ya existen docs para '$1'. ¿Qué hacer?"
- header: "Ya existe"
- options:
  - Sobrescribir (Regenerar desde templates — DESTRUCTIVO)
  - Complementar (Solo crear archivos faltantes)
  - Cancelar

## Gather Project Context

Use AskUserQuestion to collect project info:

Question 1:

- question: "¿Qué tipo de proyecto es?"
- header: "Tipo"
- options:
  - Web App (Frontend + Backend)
  - API Service (Backend only)
  - Mobile SDK (Librería móvil)
  - Platform (Infraestructura / Plataforma)

Question 2:

- question: "¿Cuál es el stack tecnológico principal?"
- header: "Stack"
- options:
  - TypeScript + React + Node
  - Kotlin + Spring Boot
  - Swift / Kotlin (Mobile)
  - Python + FastAPI

Question 3:

- question: "¿Qué documentos LIDR-genuine necesitas scaffoldear?"
- header: "Docs"
- multiSelect: true
- options:
  - Business Case (Justificación e inversión)
  - RF / NFR (Requisitos funcionales y no funcionales)
  - DTC Specs (routes / components / storage)
  - ADR (Decisiones arquitectónicas)

> **Nota — PRD, UX y Architecture NO se scaffoldean aquí.** Tras la
> unificación de fases, LIDR envuelve a BMad en lugar de duplicarlo: el PRD
> del proyecto lo produce `bmad-prd`, la spec UX `bmad-ux`, y el documento de
> arquitectura `bmad-create-architecture`. Este comando solo crea los docs
> LIDR-genuine (business-case, RF/NFR, ADR, DTC specs).

## Create Directory Structure

Create: docs/projects/$1/
Create: docs/projects/$1/specs/

## Generate Documents from Self-Contained Templates

Available templates: !`find .claude/skills/*/templates -name "*.md" -type f | head -20`

For each relevant skill template:
Read template file from skills/{skill}/templates/
Generate project-specific version:

- Replace all {placeholders} with project context
- Add frontmatter per @../rules/lidr-sdlc/documentation.md:
  ```yaml
  ---
  id: {doc-type}-$1
  version: "1.0.0"
  last_updated: "{today}"
  updated_by: "IA: init-project-docs"
  status: draft
  type: project
  review_cycle: 60
  owner_role: "Tech Lead"
  ---
  ```
- Mark all sections as ⚠️ TODO where project-specific content needed
- Pre-fill what can be inferred from project context

Files to create (LIDR-genuine docs, using self-contained templates):

- docs/projects/$1/business-case.md (from .claude/skills/lidr-business-case/templates/product-brief.md)
- docs/projects/$1/requirements/rf.md (from .claude/skills/lidr-generate-rf/templates/rf-format.md)
- docs/projects/$1/requirements/nfr.md (from .claude/skills/lidr-generate-nfr/templates/nfr-format.md)
- docs/projects/$1/user-stories.md (from .claude/skills/lidr-user-stories/templates/user-story.md)
- docs/projects/$1/adr/ADR-0001.md (from .claude/skills/lidr-adr/templates/adr.md)
- docs/projects/$1/risk-log.md (from .claude/skills/lidr-risk-log/templates/risk-log.md)
- docs/projects/$1/change-request.md (from .claude/skills/lidr-change-request/templates/deployment.md)
- docs/projects/$1/specs/routes.md (from .agents/\_shared/lidr/templates/architecture/specs/routes.md)
- docs/projects/$1/specs/components.md (from .agents/\_shared/lidr/templates/architecture/specs/components.md)
- docs/projects/$1/specs/storage.md (from .agents/\_shared/lidr/templates/architecture/specs/storage.md)

**Deferred to BMad (do NOT scaffold from LIDR templates):**

- PRD → run `bmad-prd` (produces one unified F+T PRD → `docs/projects/$1/prd.md`)
- UX spec → run `bmad-ux`
- Architecture doc → run `bmad-create-architecture`

These artifacts are BMad-owned; LIDR wraps their output rather than
duplicating their templates.

## Update Project Rule

Update @../rules/lidr-sdlc/project.md to reference new project docs:

- Add: `@../../docs/projects/$1/` as active project context

## Generate Rule Files

Use the `lidr-generate-rule` skill to create or update rule files in `.claude/rules/lidr-sdlc/`:

Check if rules exist: !`ls .claude/rules/lidr-sdlc/*.md 2>/dev/null | wc -l`

If no rules exist (new ecosystem):
Use skill `lidr-generate-rule` to create the 5 core SDLC rules from project context:

- .claude/rules/lidr-sdlc/org.md (from company info + regulatory context)
- .claude/rules/lidr-sdlc/tech-stack.md (from stack selection in Question 2)
- .claude/rules/lidr-sdlc/project.md (from project name, type, objectives)
- .claude/rules/lidr-sdlc/documentation.md (standard DTC governance)
- .claude/rules/lidr-sdlc/workflows.md (from commands catalog)
  Template reference: skills/lidr-generate-rule/templates/rule.md

If rules already exist (existing ecosystem):
Use skill `lidr-generate-rule` to update `.claude/rules/lidr-sdlc/project.md` only:

- Add new project reference: @../../docs/projects/$1/
- Update current state section

## Report

```
/lidr-init-project-docs $1 ✅

Created: docs/projects/$1/
Files:   {N} documents generated
Status:  All in "draft" — ready to fill

TODOs:   {N} sections need project-specific content
         Run /lidr-validate-project-docs $1 to check completeness

Next steps:
1. Fill in business-case.md first (drives everything else)
2. Run bmad-prd for the PRD, bmad-create-architecture for the
   architecture doc, and bmad-ux for the UX spec (BMad-owned artifacts)
3. Fill in requirements/rf.md + requirements/nfr.md and the DTC specs
4. Run /lidr-validate-project-docs $1 when ready
```
