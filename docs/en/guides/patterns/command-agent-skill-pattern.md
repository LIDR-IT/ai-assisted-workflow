# Command → Agent → Skill Pattern

Este documento explica el patrón arquitectónico para crear comandos que invocan agentes autónomos, los cuales utilizan skills especializadas y siguen las reglas del proyecto.

## Arquitectura del Patrón

```
┌─────────────────────────────────────────────────────────────┐
│ USER                                                         │
│   ↓                                                         │
│   /improve-docs docs/                                       │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ COMMAND (.agents/commands/improve-docs.md)                  │
│                                                              │
│ - Interfaz de usuario                                       │
│ - Acepta argumentos                                         │
│ - Documenta qué hace                                        │
│ - Invoca el agente correspondiente                          │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ AGENT (.agents/agents/doc-improver.md)                      │
│                                                              │
│ - Proceso autónomo                                          │
│ - Lógica de negocio                                         │
│ - Workflow multi-paso                                       │
│ - Usa tools (Read, Write, Glob, Grep, Skill)               │
│ - Sigue rules del proyecto                                  │
│                                                              │
│   ↓                              ↓                          │
│   READ RULES                     USE SKILLS (si necesario)  │
└─────────────────────────────────────────────────────────────┘
         ↓                                    ↓
┌──────────────────────┐        ┌──────────────────────────┐
│ RULES                │        │ SKILLS                   │
│ (.agents/rules/)     │        │ (.agents/skills/)        │
│                      │        │                          │
│ - Siempre activas   │        │ - Invocables on-demand   │
│ - Restricciones     │        │ - Conocimiento profundo  │
│ - Estándares        │        │ - Procedimientos         │
│ - Convenciones      │        │ - Ejemplos bundled       │
└──────────────────────┘        └──────────────────────────┘
```

## Ejemplo Completo: /improve-docs

### 1. Command: Interfaz de Usuario

**Archivo:** `.agents/commands/improve-docs.md`

```markdown
---
name: improve-docs
description: Audits and improves project documentation
args:
  - name: path
    description: Optional path to document or directory
    required: false
---

# Improve Documentation Command

This command launches the doc-improver agent...
```

**Propósito:**
- ✅ Documenta qué hace el comando
- ✅ Define argumentos aceptados
- ✅ Explica uso y ejemplos
- ✅ Se registra como `/improve-docs` en CLI

### 2. Agent: Lógica Autónoma

**Archivo:** `.agents/agents/doc-improver.md`

```markdown
---
name: doc-improver
description: Use this agent when the user invokes /improve-docs...

Examples:
<example>
user: "/improve-docs"
assistant: "I'll launch the doc-improver agent..."
</example>

tools: ["Read", "Glob", "Grep", "Edit", "Write", "Skill"]
---

You are a Documentation Quality Agent...

## Phase 1: Discovery
1. Read `.agents/rules/process/documentation.md`
2. Explore target with Glob
3. Map documentation structure

## Phase 2: Analysis
1. Content quality checks
2. Coverage checks
3. Standards compliance

...
```

**Propósito:**
- ✅ Contiene la lógica del workflow
- ✅ Define cuándo se activa (description + examples)
- ✅ Especifica qué tools puede usar
- ✅ Incluye system prompt detallado
- ✅ **Lee rules para restricciones**
- ✅ **Puede invocar skills para conocimiento profundo**

### 3. Rules: Restricciones del Proyecto

**Archivo:** `.agents/rules/process/documentation.md`

```markdown
# Documentation Standards

## README Structure
- Use H1 for title
- Include What, Why, How, Where sections
...

## File Naming
- Use kebab-case: setup-guide.md
- Markdown extension: .md
...
```

**Propósito:**
- ✅ **Siempre disponibles** en contexto del agente
- ✅ Define estándares del proyecto
- ✅ Restricciones que DEBE seguir el agente
- ✅ Específicas del proyecto actual

### 4. Skills: Conocimiento Especializado (Opcional)

**Si existiera:** `.agents/skills/doc-generator/skill.md`

```markdown
---
name: doc-generator
description: Use when generating API documentation from code
---

# API Documentation Generator

## Patterns for Different Languages

### JavaScript/TypeScript
- Use JSDoc comments
- Extract from function signatures
...

### Python
- Use docstrings
- Follow PEP 257
...
```

**Propósito:**
- ✅ Conocimiento profundo sobre dominio específico
- ✅ Invocable on-demand (no siempre en contexto)
- ✅ Puede incluir ejemplos, templates, scripts
- ✅ Reusable en múltiples agentes

## Flujo de Ejecución Completo

### Usuario Invoca Comando

```bash
$ /improve-docs docs/guides
```

### 1. Command Layer (Interfaz)

El comando `improve-docs.md` se ejecuta y su contenido se pasa al sistema.

### 2. Agent Layer (Lógica)

El agente `doc-improver` se activa porque:
- User invocó `/improve-docs` (detectado en examples)
- O preguntó por documentación (detectado en description)

**El agente ejecuta su workflow:**

```
┌─────────────────────────────────────────────────┐
│ Phase 1: Discovery                              │
│                                                  │
│ 1. Read(.agents/rules/process/documentation.md) │
│    → Obtiene estándares del proyecto           │
│                                                  │
│ 2. Glob("docs/guides/**/*.md")                  │
│    → Encuentra todos los archivos              │
│                                                  │
│ 3. Map estructura                               │
└─────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────┐
│ Phase 2: Analysis                               │
│                                                  │
│ For each file:                                  │
│   Read(file)                                    │
│   Check against rules:                          │
│     - Header structure (H1, H2, H3)            │
│     - Code blocks have language tags           │
│     - Links are relative/absolute correctly    │
│     - File naming (kebab-case)                 │
│                                                  │
│ ¿Necesita conocimiento especializado?          │
│   → Skill("doc-generator") (si existe)         │
└─────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────┐
│ Phase 3: Reporting                              │
│                                                  │
│ Present findings:                               │
│   ✅ Strengths                                  │
│   ⚠️  Issues (High/Medium/Low)                  │
│   💡 Recommendations                            │
└─────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────┐
│ Phase 4: Implementation (with approval)         │
│                                                  │
│ Ask user which improvements to apply            │
│ User approves subset                            │
│                                                  │
│ For each approved:                              │
│   Edit(file) or Write(new_file)                │
│   Verify changes                                │
│                                                  │
│ Report results                                  │
└─────────────────────────────────────────────────┘
```

## Cuándo Usar Cada Componente

### Command (Siempre)

Crea un command cuando:
- ✅ Quieres interfaz invocable (`/nombre`)
- ✅ Necesitas aceptar argumentos del usuario
- ✅ Quieres documentar uso para el equipo

**Ejemplos:**
- `/improve-docs [path]`
- `/review-code [file]`
- `/generate-tests [module]`

### Agent (Para Lógica Compleja)

Crea un agent cuando:
- ✅ Workflow multi-paso autónomo
- ✅ Necesita tomar decisiones
- ✅ Requiere múltiples tools
- ✅ Lógica de negocio compleja

**Ejemplos:**
- `doc-improver` - Audita y mejora docs
- `code-reviewer` - Revisa código vs estándares
- `test-generator` - Genera tests automáticamente

### Skill (Para Conocimiento Profundo)

Crea un skill cuando:
- ✅ Conocimiento especializado reutilizable
- ✅ Muy grande para estar siempre en contexto
- ✅ Múltiples agentes necesitan ese conocimiento
- ✅ Incluye ejemplos, templates, scripts

**Ejemplos:**
- `api-doc-generator` - Cómo documentar APIs
- `test-patterns` - Patrones de testing por framework
- `deployment-procedures` - Procedimientos de deploy

### Rule (Para Restricciones del Proyecto)

Crea un rule cuando:
- ✅ **Debe estar siempre disponible**
- ✅ Convenciones del proyecto
- ✅ Estándares de código
- ✅ Restricciones arquitectónicas

**Ejemplos:**
- `documentation.md` - Estándares de docs
- `code-style.md` - Estilo de código
- `git-workflow.md` - Flujo de Git

## Ejemplo Transversal: /review-code

Otro ejemplo que funciona en cualquier proyecto:

### Command: `.agents/commands/review-code.md`

```markdown
---
name: review-code
description: Reviews code against project standards
args:
  - name: file
    description: File to review (or current file)
    required: false
---

# Review Code Command

Launches code-reviewer agent to analyze code quality.
```

### Agent: `.agents/agents/code-reviewer.md`

```markdown
---
name: code-reviewer
description: Use when user invokes /review-code or asks to review code quality
tools: ["Read", "Grep", "Skill"]
---

You are a Code Quality Reviewer...

## Process:
1. Read `.agents/rules/code/style.md`
2. Read target file
3. Check against standards:
   - Naming conventions
   - Code structure
   - Comments
   - Error handling
4. Use Skill("security-patterns") if security concerns
5. Report findings
```

### Rules: `.agents/rules/code/style.md`

```markdown
# Code Style Guidelines

## Naming Conventions
- Functions: camelCase
- Classes: PascalCase
- Constants: UPPER_SNAKE_CASE
...
```

### Skills (opcional): `.agents/skills/security-patterns/skill.md`

```markdown
---
name: security-patterns
description: Security best practices and vulnerability patterns
---

# Security Patterns

## Common Vulnerabilities
- SQL Injection
- XSS
- CSRF
...
```

## Ventajas de Este Patrón

### 1. Separación de Responsabilidades

```
Command    → Interfaz (qué invocar)
Agent      → Lógica (cómo ejecutar)
Rules      → Restricciones (qué cumplir)
Skills     → Conocimiento (cómo hacerlo bien)
```

### 2. Reutilización

- **Múltiples comandos → Mismo agente**
  - `/improve-docs` → `doc-improver`
  - `/audit-docs` → `doc-improver`

- **Múltiples agentes → Mismas skills**
  - `doc-improver` → `doc-generator`
  - `api-creator` → `doc-generator`

- **Todos los agentes → Mismas rules**
  - `doc-improver` lee `documentation.md`
  - `code-reviewer` lee `code-style.md`
  - `test-generator` lee `testing.md`

### 3. Mantenibilidad

- **Cambio en estándares:** Actualiza rule, todos los agentes lo ven
- **Mejora en lógica:** Actualiza agent, todos los comandos benefician
- **Nuevo conocimiento:** Crea skill, múltiples agentes pueden usarla

### 4. Transversalidad

Este patrón funciona para **cualquier proyecto** porque:
- ✅ No depende de tecnología específica
- ✅ Rules definen las convenciones del proyecto
- ✅ Agents implementan workflows universales
- ✅ Skills proveen conocimiento especializado

## Plantilla Rápida

### 1. Crea Command

```bash
# .agents/commands/tu-comando.md
---
name: tu-comando
description: Brief description
args:
  - name: arg1
    required: false
---

# Command documentation
```

### 2. Crea Agent

```bash
# .agents/agents/tu-agente.md
---
name: tu-agente
description: Use when [conditions]. Examples: [...]
tools: ["Read", "Write", "Skill"]
---

You are [agent role]...

## Process:
1. Read rules
2. Execute workflow
3. Use skills if needed
4. Report results
```

### 3. Referencia Rules Existentes

El agente debe leer:
- `.agents/rules/code/style.md`
- `.agents/rules/process/documentation.md`
- `.agents/rules/quality/testing.md`
- Etc.

### 4. Crea Skills (Solo Si Necesario)

```bash
# .agents/skills/tu-skill/skill.md
---
name: tu-skill
description: When to invoke this skill
---

# Deep knowledge here
```

## Testing del Patrón

### Test 1: Invoke Command

```bash
$ /improve-docs
→ Should trigger doc-improver agent
→ Agent should read documentation.md rule
→ Agent should analyze and report
```

### Test 2: Agent Uses Rules

```bash
# Verify agent reads rules
$ /improve-docs
→ Agent output should mention standards from documentation.md
→ Recommendations should align with project rules
```

### Test 3: Agent Uses Skills (si aplica)

```bash
$ /improve-docs
→ Agent invokes /doc-generator skill when needed
→ Skill provides specialized patterns
```

## Sincronización

Después de crear estos archivos, sincroniza:

```bash
# Sincronizar todo
/sync-setup

# O manualmente
./.agents/rules/sync-rules.sh    # Sincroniza rules
./.agents/skills/sync-skills.sh  # Sincroniza skills
# Commands y agents se sincronizan automáticamente en .agents/
```

## Referencias

- [Command Development Skill](/.agents/skills/command-development/)
- [Agent Development Skill](/.agents/skills/agent-development/)
- [Skill Creator](/.agents/skills/skill-creator/)
- [Documentation Standards](/.agents/rules/process/documentation.md)
