# Agent Format Standard

Este documento define el formato estándar para agents que funciona en **todas las plataformas**: Cursor, Claude Code, y Gemini CLI.

## Formato Estándar (Compatible con Todas las Plataformas)

### Estructura del Archivo

```markdown
---
name: agent-name
description: Brief description without examples
model: inherit
temperature: 0.2
max_turns: 10
tools:
  - Read
  - Write
  - Glob
  - Grep
---

System prompt content here...

## When You Are Invoked

Examples in the body (not frontmatter)
```

### Ejemplo Completo

```markdown
---
name: doc-improver
description: Specialized agent for auditing, analyzing, and improving project documentation. Invoked by /improve-docs command or documentation review requests.
model: inherit
temperature: 0.2
max_turns: 10
tools:
  - Read
  - Glob
  - Grep
  - Edit
  - Write
  - Bash
  - Skill
---

You are a **Documentation Quality Agent** specialized in auditing, analyzing, and improving project documentation.

## When You Are Invoked

This agent should be triggered in these scenarios:

**Example 1: Direct Command**

- User: `/improve-docs`
- Action: Launch agent to audit project documentation

**Example 2: Specific Directory**

- User: "Review docs/guides"
- Action: Analyze guides documentation

## Your Core Responsibilities

1. Audit documentation quality
2. Identify gaps
3. Suggest improvements
   ...
```

## Reglas del Formato Estándar

### ✅ DO: Frontmatter Simple

```yaml
---
name: agent-name
description: Single line description
model: inherit
temperature: 0.2
max_turns: 10
tools:
  - Read
  - Write
---
```

**Por qué:**

- Compatible con todos los parsers YAML
- Sin caracteres especiales problemáticos
- Descripción concisa en una línea

### ❌ DON'T: Ejemplos XML en Frontmatter

```yaml
# ❌ MAL - Causa errores en Gemini
---
name: agent-name
description: Description with examples

<example>
user: "command"
assistant: "response"
</example>
---
```

**Por qué:**

- Tags XML confunden parser YAML de Gemini
- Causa error: "multiline key may not be an implicit key"

### ✅ DO: Ejemplos en el Cuerpo

```markdown
---
name: agent-name
description: Brief description
---

System prompt...

## When You Are Invoked

**Example 1:**

- User: "command"
- Action: What agent does
```

**Por qué:**

- Compatible con todas las plataformas
- Más legible
- Parte del system prompt (ayuda al agent)

### ✅ DO: Tools como Lista YAML

```yaml
tools:
  - Read
  - Write
  - Glob
  - Grep
  - Edit
  - Bash
  - Skill
```

**Por qué:**

- Formato YAML estándar
- Compatible con Gemini
- Fácil de parsear

### ❌ DON'T: Tools como String JSON

```yaml
# ❌ MAL - Formato no estándar
tools: ["Read", "Write", "Glob"]
```

**Por qué:**

- Aunque válido en YAML, preferir formato lista
- Más legible con múltiples tools

## Campos del Frontmatter

### Campos Obligatorios

| Campo         | Tipo   | Descripción                   | Ejemplo                        |
| ------------- | ------ | ----------------------------- | ------------------------------ |
| `name`        | string | Identificador único del agent | `doc-improver`                 |
| `description` | string | Descripción breve (una línea) | `Audits project documentation` |
| `tools`       | array  | Lista de tools disponibles    | `[Read, Write]`                |

### Campos Opcionales

| Campo         | Tipo   | Default | Descripción                                  |
| ------------- | ------ | ------- | -------------------------------------------- |
| `model`       | string | inherit | Modelo a usar (`inherit`, `sonnet`, `haiku`) |
| `temperature` | number | 0.5     | Creatividad (0.0-1.0)                        |
| `max_turns`   | number | 5       | Máximo de turnos autónomos                   |
| `color`       | string | blue    | Color UI (solo Claude Code)                  |

### Ejemplos de Campos

**Model:**

```yaml
model: inherit      # Usa el modelo del parent
model: sonnet       # Claude Sonnet
model: haiku        # Claude Haiku (rápido)
```

**Temperature:**

```yaml
temperature: 0.0    # Determinístico (análisis)
temperature: 0.2    # Poco creativo (code)
temperature: 0.7    # Creativo (writing)
```

**Max Turns:**

```yaml
max_turns: 5        # Tareas simples
max_turns: 10       # Tareas complejas
max_turns: 20       # Workflows largos
```

## Tools Disponibles

### Core Tools

```yaml
tools:
  - Read # Leer archivos
  - Write # Escribir archivos
  - Edit # Editar archivos existentes
  - Glob # Buscar archivos por patrón
  - Grep # Buscar en contenido
  - Bash # Ejecutar comandos bash
```

### Special Tools

```yaml
tools:
  - Skill # Invocar skills
  - Task # Lanzar subagents
  - AskUserQuestion # Preguntar al usuario
```

### Ejemplo Completo

```yaml
tools:
  - Read
  - Glob
  - Grep
  - Edit
  - Write
  - Bash
  - Skill
```

## System Prompt (Cuerpo del Markdown)

### Estructura Recomendada

```markdown
You are a [ROLE] specialized in [PURPOSE].

## When You Are Invoked

[Examples of triggering conditions]

## Your Core Responsibilities

1. Responsibility 1
2. Responsibility 2
3. Responsibility 3

## Working Process

### Phase 1: Discovery

[Steps]

### Phase 2: Analysis

[Steps]

### Phase 3: Reporting

[Steps]

### Phase 4: Implementation

[Steps]

## Rules You MUST Follow

1. Rule 1
2. Rule 2

## Output Format

[Expected output format]
```

### Mejores Prácticas

**✅ DO:**

- Rol claro al inicio
- Ejemplos de cuándo se invoca
- Proceso estructurado en fases
- Reglas explícitas
- Formato de output definido

**❌ DON'T:**

- Prompt demasiado largo (>5000 palabras)
- Instrucciones ambiguas
- Ejemplos contradictorios
- Asumir conocimiento previo

## Diferencias entre Plataformas

### Cursor

**Soporte:**

- ✅ Frontmatter YAML estándar
- ✅ Tools como lista
- ✅ Symlinks desde `.agents/agents/`

**Peculiaridades:**

- Ninguna diferencia significativa con estándar

### Claude Code

**Soporte:**

- ✅ Frontmatter YAML estándar
- ✅ Tools como lista
- ✅ Campo `color` adicional
- ✅ Symlinks desde `.agents/agents/`

**Peculiaridades:**

- Puede usar `color` para UI
- Soporta ejemplos XML en description (pero evitar por compatibilidad)

### Gemini CLI

**Soporte:**

- ✅ Frontmatter YAML estándar
- ✅ Tools como lista
- ✅ **Requiere copias** (no symlinks)

**Restricciones:**

- ❌ NO soporta ejemplos XML en frontmatter
- ❌ NO soporta symlinks (usa copias)
- ⚠️ Parser YAML más estricto

**Por qué copias:**

- Gemini requiere formato YAML puro
- Evita errores con archivos que tienen README.md
- Permite filtrar archivos no-agent

### Antigravity

**Soporte:**

- ❌ NO soporta agents a nivel de proyecto

## Sincronización entre Plataformas

### Script: sync-agents.sh

**Comportamiento:**

```bash
# Cursor - Symlink
.cursor/agents → ../.agents/agents

# Claude Code - Symlink
.claude/agents → ../.agents/agents

# Gemini CLI - Copias filtradas
.gemini/agents/
  ├── doc-improver.md      # Copiado
  └── (NO README.md)       # Filtrado
```

**Archivos Excluidos de Gemini:**

- `README.md` (documentación, no agent)
- `sync-*.sh` (scripts, no agent)
- Cualquier archivo que no sea `*.md` agent

### Flujo de Trabajo

1. **Editar source of truth:**

```bash
vim .agents/agents/doc-improver.md
```

2. **Sincronizar:**

```bash
./.agents/agents/sync-agents.sh
# O
/sync-setup
```

3. **Resultado:**

- Cursor: Ve cambios inmediatamente (symlink)
- Claude: Ve cambios inmediatamente (symlink)
- Gemini: Copia actualizada del agent

## Validación de Formato

### Checklist antes de Commit

- [ ] Frontmatter YAML válido
- [ ] Description en una línea (sin ejemplos)
- [ ] Tools como lista YAML
- [ ] Name sin espacios ni caracteres especiales
- [ ] Ejemplos en cuerpo (no en frontmatter)
- [ ] System prompt claro y estructurado

### Herramienta de Validación

```bash
# Validar YAML frontmatter
head -20 .agents/agents/doc-improver.md | grep -A 15 "^---$"

# Verificar no tiene ejemplos XML en frontmatter
head -50 .agents/agents/doc-improver.md | grep "<example>" && echo "❌ XML en frontmatter" || echo "✅ OK"

# Verificar tools como lista
grep -A 10 "^tools:" .agents/agents/doc-improver.md
```

## Migración de Formato Antiguo

### Si tienes agents con ejemplos XML en frontmatter:

**Antes:**

```yaml
---
name: agent
description: Description

<example>
user: "command"
</example>
---
```

**Después:**

```yaml
---
name: agent
description: Brief description
---

System prompt...

## When You Are Invoked

**Example:**
- User: "command"
```

### Script de Migración

```bash
# Mover ejemplos de frontmatter al cuerpo
# (Hacer manualmente, cada agent es único)
```

## Referencias

- [Agent Development Skill](../../../.agents/skills/agent-development/)
- [Agents README](../../../.agents/agents/README.md)
- [Gemini Experimental Features](../../notes/gemini-experimental-features.md)
- [Agents Sync Setup](../../guides/sync/AGENTS_SYNC_SETUP.md)
