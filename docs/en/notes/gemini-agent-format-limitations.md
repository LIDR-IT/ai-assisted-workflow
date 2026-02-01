# Gemini Agent Format Limitations

**Fecha:** 2025-02-01
**Problema:** Gemini rechaza campos y valores que Claude Code y Cursor aceptan.

## Errores Encontrados

### Error 1: Invalid Tool Names

```
tools.0: Invalid tool name
tools.1: Invalid tool name
...
```

**Causa:** Gemini no acepta nombres de tools en PascalCase.

**Tools rechazados:**
```yaml
tools:
  - Read        # ❌ Rechazado
  - Write       # ❌ Rechazado
  - Glob        # ❌ Rechazado
  - Grep        # ❌ Rechazado
  - Edit        # ❌ Rechazado
  - Bash        # ❌ Rechazado
  - Skill       # ❌ Rechazado
```

**Tools válidos en Gemini:**
```yaml
tools:
  - read_file            # ✅ Válido (snake_case)
  - search_file_content  # ✅ Válido (snake_case)
```

### Error 2: Unrecognized Keys

```
Unrecognized key(s) in object: 'skills'
```

**Causa:** Gemini no soporta el campo `skills` de Claude Code.

**Campos rechazados:**
```yaml
skills: [...]           # ❌ No existe en Gemini
hooks: [...]            # ❌ No existe en Gemini
disallowedTools: [...]  # ❌ No existe en Gemini
permissionMode: [...]   # ❌ No existe en Gemini
color: [...]            # ❌ No existe en Gemini
```

## Solución Implementada

### Transformación Automática

El script `sync-agents.sh` ahora **transforma** agents al copiarlos a Gemini:

```python
# Elimina campos incompatibles:
- skills
- tools (nombres inválidos)
- hooks
- disallowedTools
- permissionMode
- color
- Comentarios (#)

# Preserva campos compatibles:
- name
- description
- model
- temperature
- max_turns
```

### Resultado

**Source (.agents/agents/doc-improver.md):**
```yaml
---
# Comentarios explicativos
name: doc-improver
description: Brief description
model: inherit
tools:                    # Será removido en Gemini
  - Read
  - Write
temperature: 0.2
max_turns: 10
skills:                   # Será removido en Gemini
  - skill-creator
---
```

**Gemini (.gemini/agents/doc-improver.md):**
```yaml
---
name: doc-improver
description: Brief description
model: inherit
temperature: 0.2
max_turns: 10
---
```

## Campos Soportados por Gemini

### Campos Válidos

| Campo | Tipo | Ejemplo |
|-------|------|---------|
| `name` | string | `doc-improver` |
| `description` | string | `Brief description` |
| `kind` | string | `local` o `remote` |
| `model` | string | `gemini-2.5-pro` o `inherit` |
| `temperature` | number | `0.2` |
| `max_turns` | number | `10` |
| `timeout_mins` | number | `5` |
| `tools` | array | `[read_file, search_file_content]` |

### Campos NO Válidos

| Campo | Razón |
|-------|-------|
| `skills` | No existe en Gemini |
| `hooks` | No existe en Gemini |
| `disallowedTools` | Específico de Claude |
| `permissionMode` | Específico de Claude |
| `color` | Específico de Claude |
| `readonly` | Específico de Cursor |
| `is_background` | Específico de Cursor |

## Tools Válidos en Gemini

Gemini usa nombres en **snake_case**:

```yaml
tools:
  - read_file
  - search_file_content
  - write_file
  - list_directory
  - execute_command
```

**Nota:** La lista completa de tools de Gemini puede variar por versión.

## Impacto en Formato Estándar

### Source of Truth Mantiene Todos los Campos

El archivo en `.agents/agents/` mantiene formato completo:

```yaml
---
name: agent-name
description: Brief description
model: inherit
tools: [Read, Write, ...]    # Para Claude/Cursor
temperature: 0.2             # Para Gemini
max_turns: 10                # Para Gemini
skills: [skill-1, ...]       # Para Claude
---
```

**Ventajas:**
- ✅ Claude Code usa `skills` (knowledge injection)
- ✅ Gemini usa `temperature` y `max_turns`
- ✅ Un solo source of truth

### Transformación es Transparente

Al sincronizar:
1. Cursor y Claude → **Symlink** (sin transformación)
2. Gemini → **Copy + Transform** (remueve incompatibles)

```bash
./.agents/agents/sync-agents.sh

# Resultado:
# .cursor/agents → ../.agents/agents (symlink completo)
# .claude/agents → ../.agents/agents (symlink completo)
# .gemini/agents/doc-improver.md (transformado, sin skills/tools)
```

## Decisión de Diseño

### Por qué NO eliminar fields del source?

**Opción 1 (Rechazada):** Source mínimo común denominador
```yaml
# Solo campos que TODAS las plataformas aceptan
name: agent-name
description: Brief desc
model: inherit
# Sin skills, sin tools, sin nada específico
```

**Opción 2 (Adoptada):** Source maximalista + transformación
```yaml
# Todos los campos valiosos
name: agent-name
description: Brief desc
model: inherit
tools: [...]      # Claude/Cursor
temperature: 0.2  # Gemini
skills: [...]     # Claude (MUY valioso)
```

**Razones:**
1. **Skills es muy valioso en Claude** (knowledge injection)
2. **Transformación es automática** (script Python)
3. **Single source of truth** mantenido
4. **Máxima funcionalidad** en cada plataforma

### Trade-offs Aceptados

**Pro:**
- ✅ Claude tiene skills (huge value)
- ✅ Gemini tiene temperature/max_turns
- ✅ Un source file para todas

**Con:**
- ⚠️ Requires transformación al sync
- ⚠️ Python dependency (con fallback)
- ⚠️ Archivos diferentes en cada plataforma

**Balance:** Beneficios superan costos.

## Troubleshooting

### Error: Tools Invalid

**Síntoma:**
```
tools.0: Invalid tool name
```

**Causa:** Tools en formato Claude (PascalCase)

**Solución:** Re-sincronizar
```bash
./.agents/agents/sync-agents.sh
```

### Error: Unrecognized Key 'skills'

**Síntoma:**
```
Unrecognized key(s) in object: 'skills'
```

**Causa:** Campo no transformado

**Solución:** Re-sincronizar con script actualizado
```bash
./.agents/agents/sync-agents.sh
```

### Transformación No Aplicada

**Síntoma:** Archivo en Gemini tiene skills/tools

**Causa:** Python no disponible, usó fallback (copy simple)

**Solución:**
```bash
# Instalar Python
brew install python3  # macOS
apt install python3   # Linux

# Re-sync
./.agents/agents/sync-agents.sh
```

## Verificación

### Check Transformación Funcionó

```bash
# Ver frontmatter en Gemini
head -20 .gemini/agents/doc-improver.md

# Debe tener:
# ✅ name, description, model
# ✅ temperature, max_turns
# ❌ NO skills
# ❌ NO tools
# ❌ NO comentarios
```

### Test en Gemini

```bash
# Listar agents
gemini /agents

# Debe aparecer doc-improver sin errores
```

## Lecciones Aprendidas

1. **Gemini tiene validación estricta** de campos y valores
2. **Tool names son platform-specific** (PascalCase vs snake_case)
3. **Transformación automática es necesaria** para compatibilidad
4. **Source of truth puede ser maximalista** si hay transformación
5. **Python es útil** para transformaciones complejas (YAML parsing)

## Referencias

- [Gemini CLI Subagents Docs](https://geminicli.com/docs/core/subagents/)
- [Agent Format Standard](../references/agents/AGENT_FORMAT_STANDARD.md)
- [Platform Comparison](../references/agents/PLATFORM_COMPARISON.md)
- [Sync Agents Script](../../.agents/agents/sync-agents.sh)

## TL;DR

**Problema:** Gemini rechaza `skills`, `tools` (PascalCase), y otros campos.

**Solución:** Transformación automática al sync (Python script).

**Resultado:**
- Source: Formato completo (skills, tools, etc.)
- Gemini: Formato limpio (solo campos válidos)
- Un source of truth funciona para todas las plataformas
