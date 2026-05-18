---
id: guides-claude-code-index
version: '1.0.1'
last_updated: '2026-05-15'
updated_by: 'audit-standards skill'
status: active
type: standard
owner_role: 'TL'
review_cycle: 90
next_review: '2026-08-13'
---

# Guias de Desarrollo Claude Code — SDK Reference

> **Documentacion tecnica para crear y mantener artefactos del ecosistema.**
> Estas guias son la referencia para construir skills, commands, hooks, agents y MCPs.

## Indice de Guias (15)

### Creacion de Rules (1)

| Archivo               | Contenido                                                                                    |
| --------------------- | -------------------------------------------------------------------------------------------- |
| `rule-development.md` | Anatomia de rules, 5 tipos, referencias @../../, header block, mantenimiento, staleness 180d |

### Creacion de Skills (3)

| Archivo                      | Contenido                                                                  |
| ---------------------------- | -------------------------------------------------------------------------- |
| `skill-development-guide.md` | Anatomia de SKILL.md, frontmatter, resources, progressive disclosure       |
| `skill-creator-guide.md`     | Principios de diseno: "Concise is Key", grados de libertad, context window |
| `output-patterns.md`         | Patrones de output: template pattern, strict vs flexible formatting        |

### Creacion de Commands (5)

| Archivo                           | Contenido                                                                   |
| --------------------------------- | --------------------------------------------------------------------------- |
| `command-development.md`          | Formato completo: frontmatter, $1/$ARGUMENTS, @file, !backtick              |
| `command-frontmatter-ref.md`      | Referencia de campos YAML: description, allowed-tools, model, argument-hint |
| `command-docs.md`                 | Patrones de auto-documentacion (HTML comment block)                         |
| `command-testing-strategies.md`   | 4 niveles de testing: syntax, functional, edge case, integration            |
| `interactive-command-patterns.md` | AskUserQuestion: cuando usar, parametros, multi-select                      |

### Creacion de Hooks (4)

| Archivo                      | Contenido                                                                 |
| ---------------------------- | ------------------------------------------------------------------------- |
| `hook-development.md`        | Tipos (prompt vs command), eventos, multi-platform (Claude/Gemini/Cursor) |
| `common-hook-patterns.md`    | Patrones probados: security validation, test enforcement, context loading |
| `advanced-hook-use-cases.md` | Multi-stage validation, layered hooks (command + prompt)                  |
| `migrate-hooks-guide.md`     | Migracion de hooks basicos a prompt-based avanzados                       |

### Creacion de Agents y MCPs (2)

| Archivo                | Contenido                                                      |
| ---------------------- | -------------------------------------------------------------- |
| `agent-development.md` | Frontmatter, system prompts, triggering, model/color, tools    |
| `mcp-integration.md`   | .mcp.json, tipos de server (SSE, stdio, HTTP), OAuth, bundling |

## Cuando Usar Estas Guias

- **Crear un nuevo skill**: Lee `skill-development-guide.md` + `skill-creator-guide.md`
- **Crear un nuevo command**: Lee `command-development.md` + `command-frontmatter-ref.md`
- **Crear o modificar hooks**: Lee `hook-development.md` + `common-hook-patterns.md`
- **Crear o mantener rules**: Lee `rule-development.md`
- **Crear agents (futuro)**: Lee `agent-development.md`
- **Integrar nuevo MCP**: Lee `mcp-integration.md`
- **Mejorar output de skills**: Lee `output-patterns.md`
- **Hacer commands interactivos**: Lee `interactive-command-patterns.md`

## Relacion con el Ecosistema

Estas guias fueron la base para construir los 148 artefactos actuales.
Cuando el ecosistema crezca (nuevos skills, agents activados, nuevos MCPs),
estas guias definen el "como" de la construccion.
