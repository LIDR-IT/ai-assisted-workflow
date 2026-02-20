# Minimal Agent Format Standard

Formato **mínimo viable** que funciona en **todas las plataformas** sin errores ni transformaciones.

## Formato Estándar Mínimo

```yaml
---
name: agent-name
description: Brief one-line description of when to invoke this agent
model: inherit
---

System prompt content here...

## When You Are Invoked

Examples in body (not in frontmatter)
```

## Campos Universales

### Campos que TODAS las plataformas aceptan

| Campo         | Claude | Gemini | Cursor | Descripción         |
| ------------- | ------ | ------ | ------ | ------------------- |
| `name`        | ✅     | ✅     | ✅     | Identificador único |
| `description` | ✅     | ✅     | ✅     | Cuándo invocar      |
| `model`       | ✅     | ✅     | ✅     | Modelo a usar       |

### Valores Válidos

**name:**

```yaml
name: agent-name # lowercase + hyphens
```

**description:**

```yaml
description: Brief one-line description without XML examples
```

**model:**

```yaml
model: inherit # Funciona en todas las plataformas
```

## Por Qué Este Formato Mínimo

### Decisión: Simplicidad sobre Features

**Antes (maximalista):**

```yaml
---
name: agent-name
description: Brief desc
model: inherit
tools: [Read, Write] # ❌ Gemini rechaza
temperature: 0.2 # ⚠️ Solo Gemini usa
max_turns: 10 # ⚠️ Solo Gemini usa
skills: [skill-1] # ⚠️ Solo Claude usa
---
```

**Problema:**

- Gemini rechaza `tools` en formato PascalCase
- Requiere transformación Python
- Source y destino son diferentes
- Complejidad innecesaria

**Ahora (minimalista):**

```yaml
---
name: agent-name
description: Brief description
model: inherit
---
```

**Ventajas:**

- ✅ Funciona en todas sin transformación
- ✅ Source = Destino (symlinks simples)
- ✅ Sin dependencias (Python)
- ✅ Sin errores de validación

### Trade-off Aceptado

**Perdemos:**

- ❌ Skills precargadas en Claude
- ❌ Temperature control en Gemini
- ❌ max_turns en Gemini
- ❌ Tools específicas

**Ganamos:**

- ✅ Simplicidad total
- ✅ Sin errores de formato
- ✅ Sin transformaciones
- ✅ Symlinks para todas las plataformas
- ✅ Mantenimiento cero

**Decisión:** Simplicidad > Features específicas

## Sincronización Simplificada

### Todas Usan Symlinks

```
.agents/subagents/doc-improver.md  (formato mínimo)
         ↓
    ┌────┴────┬──────────┐
    ↓         ↓          ↓
Cursor    Claude     Gemini
(symlink)  (symlink)  (native)

✅ Todas ✅ Todas  ✅ Todas
aceptan  aceptan  aceptan
```

**No más copias, no más transformaciones.**

### Script Actualizado

```bash
# sync.sh --only=agents (simplificado)
# Crear symlinks para Cursor y Claude; Gemini lee nativamente

ln -s ../.agents/subagents .cursor/agents
ln -s ../.agents/subagents .claude/agents
# Gemini CLI lee nativamente desde .agents/subagents/ (no necesita symlink)
```

## Ejemplo Completo

```yaml
---
name: doc-improver
description: Specialized agent for auditing, analyzing, and improving project documentation. Invoked by /improve-docs command or documentation review requests.
model: inherit
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
4. Generate missing docs
5. Ensure compliance with standards

## Working Process

### Phase 1: Discovery
- Read `.agents/rules/process/documentation.md`
- Explore target with Glob
- Map documentation structure

### Phase 2: Analysis
- Check quality
- Check coverage
- Check standards compliance

### Phase 3: Reporting
- Present findings
- Prioritize issues
- Recommend improvements

### Phase 4: Implementation
- Ask for approval
- Make approved changes
- Verify results
```

## Features Específicas (Opcional)

Si necesitas features específicas de una plataforma, documéntalas claramente:

### Para Claude: Skills

**Opción 1 - Plugin específico de Claude:**

```bash
# .claude/agents/doc-improver-claude.md
---
name: doc-improver-enhanced
description: Enhanced with preloaded skills
model: inherit
skills:
  - documentation-standards
  - markdown-best-practices
---
```

**Opción 2 - Usar Skills invocables:**

```markdown
When you need documentation standards:
Use Skill("documentation-standards")
```

### Para Gemini: Temperature

**Opción 1 - Config global en settings.json:**

```json
{
  "temperature": 0.2
}
```

**Opción 2 - Mencionar en system prompt:**

```markdown
Operate with high precision (low temperature).
```

## Reglas del Formato Mínimo

### ✅ DO

```yaml
---
name: agent-name
description: Brief one-line description
model: inherit
---
```

- Usa solo name, description, model
- Una línea para description
- model: inherit siempre
- Ejemplos en body (no frontmatter)

### ❌ DON'T

```yaml
---
name: agent-name
description: Multi-line
  with examples
tools: [Read, Write]        # ❌ Causa error en Gemini
temperature: 0.2            # ⚠️ Solo Gemini
skills: [skill-1]           # ⚠️ Solo Claude
<example>...</example>      # ❌ Causa error en Gemini
---
```

## Migración

### Actualizar Agents Existentes

```bash
# 1. Backup
cp .agents/subagents/doc-improver.md .agents/subagents/doc-improver.md.bak

# 2. Editar - remover campos extras
vim .agents/subagents/doc-improver.md

# Solo dejar:
# - name
# - description
# - model

# 3. Sync (ahora simple)
./.agents/sync.sh --only=agents

# 4. Verificar
head -10 .agents/subagents/doc-improver.md
head -10 .agents/subagents/doc-improver.md  # Gemini lee nativamente desde aquí
```

### Actualizar sync.sh --only=agents

Simplificar para usar symlinks para todas:

```bash
#!/bin/bash
# Simplified sync - symlinks for all platforms

ln -sf ../.agents/subagents .cursor/agents
ln -sf ../.agents/subagents .claude/agents
# Gemini CLI reads natively from .agents/subagents/ (no symlink needed)
```

## Verificación

```bash
# Todos deben mostrar el mismo contenido
cat .agents/subagents/doc-improver.md
cat .cursor/agents/doc-improver.md     # Via symlink
cat .claude/agents/doc-improver.md     # Via symlink
cat .agents/subagents/doc-improver.md  # Gemini reads natively from .agents/

# Debe ser IDÉNTICO
```

## Conclusión

**Filosofía:**

> Simplicidad > Features específicas

**Resultado:**

- Formato que funciona en TODAS las plataformas
- Sin transformaciones
- Sin errores
- Mantenimiento cero

**Si necesitas features específicas:**

- Úsalas en plugins específicos de plataforma
- O en configuración global
- O mencionadas en system prompt

**El 90% de casos solo necesita:**

```yaml
name: agent-name
description: Brief description
model: inherit
```

**Y eso es suficiente. ✅**
