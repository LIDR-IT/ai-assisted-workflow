# Agent Format Cross-Platform Analysis

**Fecha:** 2025-02-01
**Objetivo:** Determinar formato óptimo de agents que funcione en Claude Code, Gemini CLI y Cursor.

## Hallazgos Clave

### Campos Transversales (Todas las Plataformas)

Estos campos funcionan en **todas las plataformas** sin causar errores:

```yaml
name: agent-name # ✅ Claude, Gemini, Cursor
description: Brief desc # ✅ Claude, Gemini, Cursor
model: inherit # ✅ Claude, Gemini, Cursor
tools: [Read, Write] # ✅ Claude, Gemini (Cursor ignora)
```

**Decisión:** Usar estos como base del formato estándar.

### Campo Crítico: skills (Claude Only)

**Hallazgo más importante:**

Claude Code tiene un campo único `skills` que **precarga contenido completo de skills** en el contexto del agent.

```yaml
skills:
  - api-conventions
  - security-patterns
  - documentation-standards
```

**Qué hace:**

- ✅ Skills se cargan en contexto al iniciar agent
- ✅ Agent tiene conocimiento inmediato (no necesita invocar)
- ✅ Mejora consistencia (siempre usa mismas conventions)
- ✅ Reduce turnos (no busca información)

**Por qué es importante:**

- Permite "memory injection" de conocimiento especializado
- Similar al patrón AGENTS.md de Vercel (always-on context)
- Agents pueden seguir team conventions sin buscarlas

**Ejemplo práctico:**

```yaml
---
name: api-developer
skills:
  - api-conventions # Precargado en contexto
  - security-patterns # Precargado en contexto
---
Implement endpoints following the preloaded conventions.
[Agent ya conoce las conventions sin necesidad de Skill() call]
```

**Decisión:** Incluir `skills` en formato estándar aunque solo Claude lo use.
**Razón:** Gemini y Cursor lo ignoran sin error, pero agrega valor significativo en Claude.

### Campos Útiles: temperature & max_turns (Gemini)

Gemini soporta campos de control que Claude no tiene:

```yaml
temperature: 0.2 # Control de creatividad (0.0-2.0)
max_turns: 10 # Límite de turnos autónomos
```

**Valores recomendados:**

**temperature:**

- `0.0-0.2` → Análisis, code review (determinístico)
- `0.3-0.5` → Code generation
- `0.6-0.8` → Creative writing

**max_turns:**

- `5` → Tareas simples
- `10` → Tareas normales
- `20` → Workflows complejos

**Decisión:** Incluir en formato estándar.
**Razón:** Gemini los usa, Claude y Cursor ignoran sin error.

### Campos Específicos de Plataforma

**Claude only:**

- `hooks` - Lifecycle hooks (PreToolUse, PostToolUse)
- `permissionMode` - Modos de permisos
- `disallowedTools` - Denylist de tools
- `color` - Color UI

**Gemini only:**

- `kind` - local/remote
- `timeout_mins` - Timeout

**Cursor only:**

- `readonly` - Restricción write
- `is_background` - Ejecución async

**Decisión:** No incluir en formato estándar base, usar solo cuando sea necesario.
**Razón:** Muy específicos, no transversales.

## Formato Estándar Adoptado

```yaml
---
# ═══════════════════════════════════════════════
# CORE (todas las plataformas)
# ═══════════════════════════════════════════════
name: agent-name
description: Brief one-line description
model: inherit

# ═══════════════════════════════════════════════
# CAPABILITIES (Claude + Gemini)
# ═══════════════════════════════════════════════
tools:
  - Read
  - Write
  - Glob
  - Grep
  - Edit
  - Bash
  - Skill

# ═══════════════════════════════════════════════
# BEHAVIOR TUNING (Gemini usa, otros ignoran)
# ═══════════════════════════════════════════════
temperature: 0.2
max_turns: 10

# ═══════════════════════════════════════════════
# KNOWLEDGE INJECTION (Claude usa, otros ignoran)
# ═══════════════════════════════════════════════
skills:
  - skill-name-1
  - skill-name-2
---

System prompt...

## When You Are Invoked

Examples in body (not frontmatter for Gemini compatibility)
```

## Razones del Formato

### 1. Por qué incluir `skills` aunque solo Claude lo use

**Pro:**

- Valor enorme en Claude (knowledge injection)
- Gemini y Cursor ignoran sin error
- Sigue patrón source-of-truth único

**Con:**

- Campo "muerto" en Gemini/Cursor

**Decisión:** INCLUIR
**Impacto:** Agents en Claude tienen conocimiento precargado, mejora significativa.

### 2. Por qué incluir `temperature` y `max_turns`

**Pro:**

- Gemini los usa
- Claude y Cursor ignoran sin error
- Control útil de comportamiento

**Con:**

- No funcionan en Claude/Cursor

**Decisión:** INCLUIR
**Impacto:** Mejor control en Gemini, sin impacto negativo en otros.

### 3. Por qué NO incluir `hooks` en estándar base

**Pro:**

- Muy poderoso en Claude (validación, automation)

**Con:**

- Solo Claude
- Muy específico a casos de uso
- Complica formato estándar

**Decisión:** NO incluir en base, usar cuando sea necesario
**Impacto:** Mantener simplicidad, agregar cuando se necesite.

## Sincronización entre Plataformas

### Estrategia Actual

```
.agents/subagents/doc-improver.md  (formato estándar completo)
         ↓
    ┌────┴────┬──────────┐
    ↓         ↓          ↓
Cursor    Claude     Gemini
(symlink)  (symlink)  (copy)
```

**Claude Code (symlink):**

- Ve todos los campos
- Usa: name, description, model, tools, skills
- Ignora: temperature, max_turns (no fatal)

**Gemini CLI (copy):**

- Ve todos los campos
- Usa: name, description, model, tools, temperature, max_turns
- Ignora: skills (no disponible)

**Cursor (symlink):**

- Ve todos los campos
- Usa: name, description, model
- Ignora: tools, temperature, max_turns, skills (no fatal)

**Resultado:** Un solo source of truth funciona en todas las plataformas.

## Migración Realizada

### Antes (solo básico)

```yaml
---
name: doc-improver
description: Brief description
model: inherit
temperature: 0.2
max_turns: 10
tools:
  - Read
  - Write
---
```

### Después (formato mejorado)

```yaml
---
name: doc-improver
description: Brief description
model: inherit
tools:
  - Read
  - Write
  - Glob
  - Grep
  - Edit
  - Bash
  - Skill
temperature: 0.2
max_turns: 10
skills: # ⭐ NUEVO - Knowledge injection
  - skill-creator
  - agent-development
---
```

**Mejoras:**

1. ✅ Skills precargadas en Claude
2. ✅ Tools más completa
3. ✅ Comentarios explicativos
4. ✅ Organización por secciones

## Casos de Uso: skills

### Caso 1: API Development Agent

```yaml
---
name: api-developer
description: Implement REST API endpoints
skills:
  - api-conventions # Team API standards
  - security-patterns # Security best practices
  - error-handling # Error response formats
---
Implement endpoints following preloaded conventions.
```

**Beneficio:** Agent siempre sigue team conventions sin necesidad de buscarlas.

### Caso 2: Code Reviewer Agent

```yaml
---
name: code-reviewer
description: Review code for quality and security
skills:
  - code-style # Project code standards
  - security-checklist # Security review items
  - performance-patterns # Performance best practices
---
Review code against preloaded standards.
```

**Beneficio:** Consistencia en reviews, siempre verifica los mismos criterios.

### Caso 3: Documentation Agent

```yaml
---
name: doc-improver
description: Audit and improve documentation
skills:
  - documentation-standards # Doc format requirements
  - markdown-best-practices # Markdown conventions
---
Improve documentation following preloaded standards.
```

**Beneficio:** Documentación consistente con team standards.

## Lecciones Aprendidas

### 1. Campos Ignorados No Causan Errores

**Insight:** Plataformas ignoran campos que no entienden (YAML válido).

**Implicación:** Podemos usar formato "maximalista" que incluya campos de todas las plataformas.

**Excepción:** Gemini FALLA con ejemplos XML en frontmatter (parser YAML estricto).

### 2. Skills es Game-Changer en Claude

**Insight:** Precargar skills en contexto es mucho más poderoso que skills invocables.

**Implicación:** Deberíamos crear skills para conventions comunes del proyecto y precargarlas en agents relevantes.

**Patrón:** Similar a AGENTS.md de Vercel (always-on context vs on-demand).

### 3. temperature y max_turns son Útiles en Gemini

**Insight:** Gemini permite control granular que Claude no tiene.

**Implicación:** Incluir estos campos mejora experiencia en Gemini sin afectar Claude.

### 4. Un Source of Truth es Posible

**Insight:** Con cuidado en formato, un archivo funciona en todas las plataformas.

**Implicación:** No necesitamos archivos separados por plataforma, sync inteligente es suficiente.

## Decisiones de Diseño

### ¿Por qué copias para Gemini en lugar de symlinks?

**Razón 1:** Parser YAML de Gemini más estricto
**Razón 2:** Permite filtrar archivos no-agent (README.md)
**Razón 3:** Evita errores con formatos incompatibles

**Trade-off:** Cambios no son instantáneos, requiere re-sync
**Mitigación:** Script `.agents/sync.sh --only=agents` automatiza el proceso

### ¿Por qué no eliminar skills si solo Claude lo usa?

**Razón 1:** Valor muy alto en Claude (knowledge injection)
**Razón 2:** No causa problemas en otras plataformas
**Razón 3:** Mantiene source of truth único

**Trade-off:** Campo "muerto" en Gemini/Cursor
**Beneficio:** Agents más inteligentes en Claude

### ¿Por qué comentarios en YAML frontmatter?

**Razón 1:** Documentar qué plataformas usan cada sección
**Razón 2:** Ayudar a futuros desarrolladores
**Razón 3:** Explicar por qué ciertos campos

**Trade-off:** Frontmatter más largo
**Beneficio:** Self-documenting format

## Próximos Pasos

### 1. Crear Skills para Precargar

Identificar conocimiento común del proyecto que debería estar siempre disponible:

```yaml
# Candidates for skills:
- api-conventions.md
- security-checklist.md
- code-style-guide.md
- testing-patterns.md
- deployment-procedures.md
```

### 2. Actualizar Agents Existentes

Migrar agents a formato mejorado con skills:

```bash
# Audit current agents
ls .agents/subagents/

# Identify which skills each needs
# Update frontmatter
# Re-sync
```

### 3. Documentar Patterns de Skills

Crear guía de cuándo usar:

- Skills invocables (on-demand)
- Skills precargadas (always-on via agent skills field)
- Rules (always-on via project context)

### 4. Testing Cross-Platform

Verificar agents funcionan correctamente en:

- [ ] Claude Code (verifica skills precargadas)
- [ ] Gemini CLI (verifica temperature/max_turns)
- [ ] Cursor (verifica no hay errores)

## Referencias

- **Documentación comparativa:** `docs/references/agents/PLATFORM_COMPARISON.md`
- **Formato estándar:** `docs/references/agents/AGENT_FORMAT_STANDARD.md`
- **Claude Code Docs:** https://code.claude.com/docs/en/sub-agents
- **Gemini CLI Docs:** https://geminicli.com/docs/core/subagents/
- **Cursor Docs:** https://cursor.com/es/docs/context/subagents
- **Vercel AGENTS.md Pattern:** https://vercel.com/blog/agents-md-outperforms-skills-in-our-agent-evals

## TL;DR

**Formato óptimo:**

```yaml
name: agent-name
description: Brief desc
model: inherit
tools: [Read, Write, ...]
temperature: 0.2
max_turns: 10
skills: [skill-1, ...] # ⭐ Game-changer en Claude
```

**Por qué funciona:**

- Claude: Usa skills (knowledge injection)
- Gemini: Usa temperature/max_turns (control)
- Cursor: Ignora todo extra (sin error)

**Valor principal:**

- Skills precargadas = agents más inteligentes en Claude
- Un source of truth = menos mantenimiento
- Cross-platform = máxima compatibilidad
