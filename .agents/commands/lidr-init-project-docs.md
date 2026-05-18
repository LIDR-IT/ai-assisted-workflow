---
description: Initialize project documentation from templates
argument-hint: [project-name]
allowed-tools: Read, Write, Bash(find:*), Bash(mkdir:*), AskUserQuestion
model: sonnet
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
  /init-project-docs my-project
  /init-project-docs {{CLIENT_CODE}}-enrollment

ARGUMENTS:
  project-name: Slug-format name (required). Used for folder and references.

REQUIREMENTS:
  - skills/ directory with self-contained skills
  - .claude/rules/ configured

RELATED COMMANDS:
  /validate-project-docs - Validates docs against template criteria
  /sync-docs             - Updates docs after code changes

SKILLS USED:
  generate-rule          - Generates rule files for .claude/rules/

CHANGELOG:
  v4.0.0 (2026-03-17): Updated for self-contained architecture - templates now in skills/{name}/templates/
  v3.0.0 (2026-03-09): Added rule generation step using generate-rule skill
  v2.0.0 (2025-03-05): Rewritten to official command format
  v1.0.0 (2025-02-20): Initial version
-->

# Initialize Project Docs: $1

Load: @../rules/documentation.md for frontmatter standards.
Load: @../rules/project.md for project context.

## Validate

If "$1" is empty:
❌ Project name required.
Usage: /init-project-docs [project-name]
Example: /init-project-docs {{CLIENT_CODE}}-enrollment
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

- question: "¿Qué documentos necesitas?"
- header: "Docs"
- multiSelect: true
- options:
  - Product Brief (Visión y alcance)
  - PRD (Requisitos detallados)
  - Architecture (Arquitectura técnica)
  - UX Spec (Diseño UX/UI)

## Create Directory Structure

Create: docs/projects/$1/
Create: docs/projects/$1/specs/

## Generate Documents from Self-Contained Templates

Available templates: !`find .claude/skills/*/templates -name "*.md" -type f | head -20`

For each relevant skill template:
Read template file from skills/{skill}/templates/
Generate project-specific version:

- Replace all {placeholders} with project context
- Add frontmatter per @../rules/documentation.md:
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

Files to create (using self-contained templates):

- docs/projects/$1/business-case.md (from .claude/skills/business-case/templates/business-case.md)
- docs/projects/$1/prd-funcional.md (from .claude/skills/prd-funcional/templates/prd.md)
- docs/projects/$1/prd-tecnico.md (from .claude/skills/prd-tecnico/templates/prd-technical.md)
- docs/projects/$1/architecture.md (from .claude/skills/architecture-doc/templates/architecture.md)
- docs/projects/$1/user-stories.md (from .claude/skills/user-stories/templates/user-story.md)
- docs/projects/$1/ux-design-spec.md (from .claude/skills/ux-design-spec/templates/ux-design-spec.md)
- docs/projects/$1/risk-log.md (from .claude/skills/risk-log/templates/risk-log.md)
- docs/projects/$1/change-request.md (from .claude/skills/change-request/templates/change-request.md)
- docs/projects/$1/specs/routes.md (from .claude/skills/architecture-doc/templates/specs/routes.md)
- docs/projects/$1/specs/components.md (from .claude/skills/architecture-doc/templates/specs/components.md)
- docs/projects/$1/specs/storage.md (from .claude/skills/architecture-doc/templates/specs/storage.md)

## Update Project Rule

Update @../rules/project.md to reference new project docs:

- Add: `@../../docs/projects/$1/` as active project context

## Generate Rule Files

Use the `generate-rule` skill to create or update rule files in `.claude/rules/`:

Check if rules exist: !`ls .claude/rules/*.md 2>/dev/null | wc -l`

If no rules exist (new ecosystem):
Use skill `generate-rule` to create all 5 rules from project context:

- .claude/rules/org.md (from company info + regulatory context)
- .claude/rules/tech-stack.md (from stack selection in Question 2)
- .claude/rules/project.md (from project name, type, objectives)
- .claude/rules/documentation.md (standard DTC governance)
- .claude/rules/workflows.md (from commands catalog)
  Template reference: skills/generate-rule/templates/rule.md
  Guide reference: @../../docs/guides/claude-code/rule-development.md

If rules already exist (existing ecosystem):
Use skill `generate-rule` to update `.claude/rules/project.md` only:

- Add new project reference: @../../docs/projects/$1/
- Update current state section

## Report

```
/init-project-docs $1 ✅

Created: docs/projects/$1/
Files:   {N} documents generated
Status:  All in "draft" — ready to fill

TODOs:   {N} sections need project-specific content
         Run /validate-project-docs $1 to check completeness

Next steps:
1. Fill in product-brief.md first (drives everything else)
2. Then architecture.md (technical foundation)
3. Run /validate-project-docs $1 when ready
```
