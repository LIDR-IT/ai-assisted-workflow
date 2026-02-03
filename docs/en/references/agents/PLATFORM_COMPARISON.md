# Agent/Subagent Platform Comparison

Comparación completa de formatos de agents/subagents entre Claude Code, Gemini CLI y Cursor.

## Matriz de Campos Soportados

| Campo               | Claude Code                          | Gemini CLI              | Cursor                             | Descripción                                     |
| ------------------- | ------------------------------------ | ----------------------- | ---------------------------------- | ----------------------------------------------- |
| **name**            | ✅ Required                          | ✅ Required             | ⚠️ Optional (defaults to filename) | Identificador único del agent                   |
| **description**     | ✅ Required                          | ✅ Required             | ⚠️ Optional                        | Cuándo invocar este agent                       |
| **model**           | ✅ `sonnet`/`opus`/`haiku`/`inherit` | ✅ Model ID / `inherit` | ✅ `fast`/`inherit`/custom         | Modelo AI a usar                                |
| **tools**           | ✅ Array                             | ✅ Array                | ❌                                 | Lista de tools permitidas                       |
| **disallowedTools** | ✅ Array                             | ❌                      | ❌                                 | Tools denegadas (denylist)                      |
| **temperature**     | ❌                                   | ✅ Number (0.0-2.0)     | ❌                                 | Control de creatividad                          |
| **max_turns**       | ❌                                   | ✅ Number               | ❌                                 | Máximo de turnos autónomos                      |
| **timeout_mins**    | ❌                                   | ✅ Number               | ❌                                 | Timeout de ejecución                            |
| **skills**          | ✅ Array ⭐                          | ❌                      | ❌                                 | **IMPORTANTE:** Preload skills en contexto      |
| **hooks**           | ✅ Object                            | ❌                      | ❌                                 | Lifecycle hooks (PreToolUse, PostToolUse, Stop) |
| **permissionMode**  | ✅ Enum                              | ❌                      | ❌                                 | Modo de permisos                                |
| **color**           | ✅ String                            | ❌                      | ❌                                 | Color UI                                        |
| **kind**            | ❌                                   | ✅ `local`/`remote`     | ❌                                 | Tipo de agent                                   |
| **readonly**        | ❌                                   | ❌                      | ✅ Boolean                         | Restricción write                               |
| **is_background**   | ❌                                   | ❌                      | ✅ Boolean                         | Ejecución async                                 |

## Campos Transversales (Todas las Plataformas)

Estos campos funcionan en **todas las plataformas** y deben ser parte del estándar:

### 1. name ✅

```yaml
name: doc-improver
```

**Reglas:**

- Lowercase + hyphens
- Único por proyecto
- Sin espacios ni caracteres especiales

### 2. description ✅

```yaml
description: Specialized agent for auditing and improving project documentation
```

**Reglas:**

- Una línea concisa
- Sin ejemplos XML (compatibilidad Gemini)
- Describe cuándo invocar

### 3. model ✅

```yaml
# Claude Code
model: inherit    # sonnet, opus, haiku, inherit

# Gemini CLI
model: inherit    # gemini-2.5-pro, inherit

# Cursor
model: inherit    # fast, inherit, custom
```

**Valor recomendado:** `inherit` (funciona en todas)

### 4. tools ✅

```yaml
tools:
  - Read
  - Write
  - Glob
  - Grep
  - Edit
  - Bash
```

**Nota:** Cursor no soporta field, pero no causa error

## Campos Importantes de Claude (Deberíamos Usar)

Estos campos solo funcionan en Claude Code, pero agregan funcionalidad valiosa:

### 1. skills ⭐ **MUY IMPORTANTE**

```yaml
skills:
  - api-conventions
  - error-handling-patterns
  - security-best-practices
```

**Qué hace:**

- Precarga el contenido completo de skills en el contexto del agent
- El agent tiene acceso inmediato a ese conocimiento
- No necesita invocar skills durante ejecución

**Caso de uso:**

```yaml
---
name: api-developer
description: Implement API endpoints following team conventions
skills:
  - api-conventions # Siempre disponible
  - security-patterns # Siempre disponible
tools:
  - Read
  - Write
  - Edit
---
Implement API endpoints. Follow the conventions from preloaded skills.
```

**Por qué es importante:**

- Agents pueden tener conocimiento especializado sin buscarlo
- Mejora consistencia (siempre usa mismas conventions)
- Reduce turnos (no necesita invocar skill)

### 2. temperature

```yaml
temperature: 0.2
```

**Gemini también lo soporta!** Deberíamos incluirlo en estándar.

**Valores recomendados:**

- `0.0-0.2` - Análisis, code review (determinístico)
- `0.3-0.5` - Code generation
- `0.6-0.8` - Creative writing, ideation

### 3. max_turns

```yaml
max_turns: 10
```

**Gemini también lo soporta!** Deberíamos incluirlo en estándar.

**Valores recomendados:**

- `5` - Tareas simples (quick review)
- `10` - Tareas normales (doc improvement)
- `20` - Workflows complejos (multi-step refactor)

### 4. hooks

```yaml
hooks:
  PreToolUse:
    - matcher: "Bash"
      hooks:
        - type: command
          command: "./scripts/validate-command.sh"
  PostToolUse:
    - matcher: "Edit|Write"
      hooks:
        - type: command
          command: "./scripts/run-linter.sh"
```

**Qué hace:**

- Valida tool usage antes de ejecutar
- Ejecuta acciones después de tool calls
- Permite control granular

**Caso de uso:**

```yaml
---
name: db-reader
description: Execute read-only database queries
tools:
  - Bash
hooks:
  PreToolUse:
    - matcher: "Bash"
      hooks:
        - type: command
          command: "./scripts/validate-readonly-query.sh"
---
```

## Formato Estándar Mejorado (Recomendado)

Combinando lo mejor de todas las plataformas:

```yaml
---
# ═══════════════════════════════════════════════
# CAMPOS TRANSVERSALES (todas las plataformas)
# ═══════════════════════════════════════════════
name: agent-name
description: Brief one-line description
model: inherit
tools:
  - Read
  - Write
  - Glob
  - Grep
  - Edit
  - Bash
  - Skill

# ═══════════════════════════════════════════════
# CAMPOS IMPORTANTES (Claude + Gemini)
# ═══════════════════════════════════════════════
temperature: 0.2 # Claude: ❌ | Gemini: ✅ | Cursor: ❌
max_turns: 10 # Claude: ❌ | Gemini: ✅ | Cursor: ❌

# ═══════════════════════════════════════════════
# CAMPOS ESPECÍFICOS CLAUDE (alta valor)
# ═══════════════════════════════════════════════
skills: # Claude: ✅ | Gemini: ❌ | Cursor: ❌
  - skill-name-1
  - skill-name-2

hooks: # Claude: ✅ | Gemini: ❌ | Cursor: ❌
  PreToolUse:
    - matcher: "Bash"
      hooks:
        - type: command
          command: "./scripts/validate.sh"
---
```

### Ejemplo Completo

```yaml
---
name: doc-improver
description: Specialized agent for auditing and improving project documentation
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
skills:
  - documentation-standards
  - markdown-best-practices
---
You are a Documentation Quality Agent...
```

## Comportamiento por Plataforma

### Claude Code

```yaml
# ✅ Usa todos los campos
# ✅ Skills precargadas en contexto
# ✅ Hooks ejecutados
# ✅ Temperature ignorado (no fatal)
# ✅ max_turns ignorado (no fatal)
```

### Gemini CLI

```yaml
# ✅ Usa name, description, model, tools
# ✅ Usa temperature, max_turns (propios)
# ⚠️ Ignora skills (no disponible)
# ⚠️ Ignora hooks (no disponible)
# ❌ FALLA si ejemplos XML en description
```

### Cursor

```yaml
# ✅ Usa name, description, model
# ⚠️ Ignora tools (no soportado)
# ⚠️ Ignora temperature, max_turns
# ⚠️ Ignora skills, hooks
# ✅ Puede usar readonly, is_background (propios)
```

## Estrategia de Sincronización

### Para Claude Code (Symlink)

```bash
# Mantener todos los campos
.claude/agents → ../.agents/agents
```

### Para Gemini CLI (Copy)

```bash
# Copiar pero filtrar campos incompatibles
.gemini/agents/doc-improver.md
# (sin skills, sin hooks)
```

### Para Cursor (Symlink)

```bash
# Mantener todos los campos (ignora lo que no entiende)
.cursor/agents → ../.agents/agents
```

## Decisión: Qué Incluir en el Estándar

### ✅ INCLUIR (transversal o alto valor)

```yaml
---
name: agent-name # Todas ✅
description: Brief desc # Todas ✅
model: inherit # Todas ✅
tools: # Claude ✅, Gemini ✅, Cursor ignora
  - Read
  - Write
temperature: 0.2 # Claude ignora, Gemini ✅, Cursor ignora
max_turns: 10 # Claude ignora, Gemini ✅, Cursor ignora
skills: # Claude ✅, otros ignoran - IMPORTANTE!
  - skill-name
---
```

**Razones:**

1. **temperature** y **max_turns**: Gemini los usa, otros ignoran sin error
2. **skills**: MUY importante en Claude, otros ignoran sin error
3. **tools**: Claude y Gemini usan, Cursor ignora sin error

### ⚠️ OPCIONAL (caso por caso)

```yaml
hooks: # Solo Claude, muy específico
  PreToolUse: [...]

disallowedTools: [...] # Solo Claude

permissionMode: default # Solo Claude

color: blue # Solo Claude (UI)

kind: local # Solo Gemini

readonly: true # Solo Cursor

is_background: true # Solo Cursor
```

**Usar cuando:**

- Necesitas funcionalidad específica de la plataforma
- Documentar claramente que es específico

## Formato Estándar Final Recomendado

```yaml
---
# ═══ CORE (todas las plataformas) ═══
name: agent-name
description: Brief one-line description without examples
model: inherit

# ═══ CAPABILITIES (Claude + Gemini) ═══
tools:
  - Read
  - Write
  - Glob
  - Grep
  - Edit
  - Bash
  - Skill

# ═══ BEHAVIOR TUNING (Gemini lo usa, otros ignoran) ═══
temperature: 0.2
max_turns: 10

# ═══ KNOWLEDGE INJECTION (Claude lo usa, otros ignoran) ═══
skills:
  - skill-name-1
  - skill-name-2

# ═══ PLATFORM-SPECIFIC (opcional, documentar) ═══
# hooks:              # Claude only
# permissionMode:     # Claude only
# kind:               # Gemini only
# readonly:           # Cursor only
# is_background:      # Cursor only
---

System prompt here...

## When You Are Invoked

Examples in body (not frontmatter)
```

## Migración

### Actualizar doc-improver.md

**Antes:**

```yaml
---
name: doc-improver
description: Brief desc
model: inherit
temperature: 0.2
max_turns: 10
tools: [Read, Write]
---
```

**Después (con skills):**

```yaml
---
name: doc-improver
description: Brief desc
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
skills:
  - documentation-standards
  - markdown-best-practices
---
```

## Referencias

- [Claude Code Subagents](https://code.claude.com/docs/en/sub-agents)
- [Gemini CLI Subagents](https://geminicli.com/docs/core/subagents/)
- [Cursor Subagents](https://cursor.com/es/docs/context/subagents)
- [Skills in Claude Code](https://code.claude.com/docs/en/skills)

## Conclusiones

### Campos Obligatorios (Estándar Mínimo)

```yaml
name: agent-name
description: Brief description
```

### Campos Recomendados (Máxima Compatibilidad + Valor)

```yaml
name: agent-name
description: Brief description
model: inherit
tools: [Read, Write, ...]
temperature: 0.2 # Gemini lo usa
max_turns: 10 # Gemini lo usa
skills: [skill-1, ...] # Claude lo usa - MUY IMPORTANTE!
```

### Ventajas del Estándar Mejorado

1. ✅ **Funciona en todas las plataformas** (ignoran lo que no entienden)
2. ✅ **Skills en Claude** precargan conocimiento especializado
3. ✅ **Temperature en Gemini** controla creatividad
4. ✅ **max_turns en Gemini** limita ejecución
5. ✅ **Sin errores** - campos desconocidos son ignorados
6. ✅ **Un solo source of truth** - `.agents/agents/`

### Próximo Paso

Actualizar `.agents/agents/doc-improver.md` con el formato mejorado que incluye **skills**.
