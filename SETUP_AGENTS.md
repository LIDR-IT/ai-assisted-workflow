# Guía de Setup de Agents

Los agents son subprocesos autónomos que manejan tareas complejas y multi-paso de forma independiente.

## Quick Start

### 1. Crear Directorio de Agents

```bash
# Para proyecto (compartido con equipo)
mkdir -p .claude/agents

# Para uso personal (solo tú)
mkdir -p ~/.claude/agents
```

### 2. Crear Primer Agent

```bash
# Crear agent simple
cat > .claude/agents/code-reviewer.md << 'EOF'
---
name: code-reviewer
description: Use this agent when the user requests a code review. Examples:

<example>
Context: User has changes in multiple files
user: "Review my changes for quality issues"
assistant: "I'll use the code-reviewer agent to analyze your changes."
<commentary>
Code review requires analyzing multiple files, checking patterns,
and providing comprehensive feedback - ideal for autonomous agent.
</commentary>
</example>

model: inherit
color: blue
tools: ["Read", "Grep", "Bash"]
---

You are a code review specialist.

**Your Core Responsibilities:**
1. Analyze code for quality, security, and best practices
2. Check for common anti-patterns
3. Verify test coverage
4. Suggest improvements with examples

**Review Process:**
1. Read all changed files
2. Check for security vulnerabilities
3. Verify coding standards compliance
4. Assess test coverage
5. Provide actionable feedback

**Output Format:**
- Summary of findings
- Categorized issues (Critical, Major, Minor)
- Specific line numbers for each issue
- Suggested fixes with code examples
EOF
```

### 3. Probar Agent

```bash
# En Claude Code
claude

# En la sesión
You: Review my code changes
Claude: [Automáticamente activa code-reviewer agent]
```

## ⚠️ Agents NO Usan `.agents/`

**Diferencia importante:** Al igual que Commands, Agents NO usan el patrón `.agents/` con symlinks.

**Razón:** Agents son específicos de cada plataforma y tienen diferentes formatos/capacidades según el agente AI (Claude Code, Cursor, etc.).

### Ubicaciones de Agents

```
Agents:  .claude/agents/   (directorio real, NO symlink)
         .cursor/agents/   (directorio real, separado)

Rules:   .agents/rules/    → .cursor/rules (symlink)
Skills:  .agents/skills/   → .cursor/skills (symlink)
```

**Project agents** (`.claude/agents/`):
- Creados directamente en `.claude/agents/`
- Compartidos con equipo (versionados en Git)
- Específicos de Claude Code

**Personal agents** (`~/.claude/agents/`):
- Solo para ti
- Disponibles en todos tus proyectos

## Agent vs Command

### ¿Cuándo Usar Agent?

**Usar AGENT cuando:**
- Tarea requiere múltiples pasos autónomos
- Necesitas investigación o análisis profundo
- Proceso toma decisiones basadas en contexto
- Ejecución puede tomar varios turnos
- Requiere iteración y refinamiento

**Ejemplos:**
- Code review comprehensivo
- Test generation con coverage analysis
- Security audit multi-archivo
- Refactoring asistido
- Documentation generation

### ¿Cuándo Usar Command?

**Usar COMMAND cuando:**
- Acción directa y específica
- Usuario controla el flujo
- Ejecución en single-turn
- Prompt reutilizable simple
- No requiere autonomía

**Ejemplos:**
- `/commit` - Crear commit message
- `/explain` - Explicar código
- `/format` - Formatear archivo
- `/status` - Mostrar estado

## Estructura de Agents

### Formato Completo

```markdown
---
name: agent-name
description: Use this agent when [conditions]. Examples:

<example>
Context: [Situation]
user: "[User request]"
assistant: "[Response with agent usage]"
<commentary>
[Why this agent is appropriate]
</commentary>
</example>

<example>
[More examples...]
</example>

model: inherit
color: blue
tools: ["Read", "Write"]
---

You are [agent role]...

[System prompt defining behavior]
```

## Frontmatter Fields

### name (requerido)

Identificador del agent (lowercase, hyphens only):

```yaml
name: test-generator
```

**Bueno:** `code-reviewer`, `api-analyzer`, `security-auditor`
**Malo:** `helper`, `my_agent`, `ag`

### description (requerido - CRÍTICO)

Define cuándo Claude debe activar este agent.

**Debe incluir:**
1. Condiciones de activación ("Use this agent when...")
2. Múltiples bloques `<example>`
3. Context, user request, assistant response
4. `<commentary>` explicando el porqué

```yaml
description: Use this agent when user requests comprehensive testing. Examples:

<example>
Context: User added new feature without tests
user: "Generate tests for the new login feature"
assistant: "I'll use the test-generator agent to create comprehensive tests."
<commentary>
Generating tests requires analyzing code structure, identifying edge cases,
and writing multiple test scenarios - ideal for autonomous agent work.
</commentary>
</example>
```

### model (requerido)

Modelo a usar:
- `inherit` - Mismo que conversación padre (recomendado)
- `sonnet` - Claude Sonnet (balanceado)
- `opus` - Claude Opus (más capaz)
- `haiku` - Claude Haiku (rápido, económico)

```yaml
model: inherit
```

### color (requerido)

Color visual en UI:

```yaml
color: blue  # blue, cyan, green, yellow, magenta, red
```

**Guía de colores:**
- Blue/Cyan: Análisis, review
- Green: Success-oriented, generation
- Yellow: Validation, warnings
- Red: Security, critical
- Magenta: Creative, refactoring

### tools (opcional)

Restringir tools disponibles:

```yaml
tools: ["Read", "Write", "Grep", "Bash"]
```

## Ejemplos de Agents

### Agent de Testing

```markdown
---
name: test-generator
description: Use when user needs comprehensive test generation. Examples:

<example>
user: "Add tests for the authentication module"
assistant: "I'll use test-generator to create comprehensive tests."
</example>

model: inherit
color: green
tools: ["Read", "Write", "Grep"]
---

You are a test generation specialist.

**Generate:**
- Unit tests for all functions
- Integration tests for workflows
- Edge case coverage
- Mock data and fixtures

**Process:**
1. Analyze code structure
2. Identify test scenarios
3. Generate test files
4. Verify coverage
```

### Agent de Documentación

```markdown
---
name: docs-writer
description: Use when user requests API documentation or README generation.

<example>
user: "Generate API documentation for the new endpoints"
assistant: "I'll use docs-writer to create comprehensive API docs."
</example>

model: inherit
color: cyan
---

You are an API documentation specialist.

**Create:**
- API endpoint documentation
- Request/response examples
- Authentication guides
- Error code references

**Format:**
Use clear markdown with code examples and tables.
```

### Agent de Refactoring

```markdown
---
name: refactor-assistant
description: Use when user needs code refactoring guidance.

<example>
user: "This component is too complex, help me refactor it"
assistant: "I'll use refactor-assistant to analyze and improve the code."
</example>

model: inherit
color: magenta
tools: ["Read", "Write", "Edit", "Bash"]
---

You are a refactoring specialist.

**Analyze:**
1. Code complexity metrics
2. Duplication patterns
3. Responsibility boundaries
4. Naming clarity

**Suggest:**
- Extract functions/components
- Rename for clarity
- Simplify logic
- Improve structure

Implement changes step by step with explanation.
```

## Triggering Conditions

### Escribir Buenos Examples

**Incluir múltiples scenarios:**

```yaml
description: Use for security analysis. Examples:

<example>
Context: Pre-deployment security check
user: "Audit the codebase for security issues"
assistant: "I'll run the security-auditor agent."
</example>

<example>
Context: After code review feedback
user: "Check for common vulnerabilities"
assistant: "Starting security audit with security-auditor."
</example>
```

### Proactive vs Reactive

**Proactive (agent se activa solo):**
```yaml
description: Use when detecting potential security issues. Examples:

<example>
Context: User writes code with SQL queries
assistant: "I notice SQL queries. Let me run security-auditor to check for injection risks."
</example>
```

**Reactive (usuario solicita):**
```yaml
description: Use when user explicitly requests code review.
```

## Troubleshooting

### Agent No Se Activa

**Verificar description field:**
```yaml
# Debe ser específico y con examples
description: Use this agent when...

<example>
[Concrete example]
</example>
```

**Mejorar examples:**
- Incluir 2-4 examples mínimo
- Cubrir diferentes phrasings
- Mostrar context claro

### Agent Falla en Ejecución

**Verificar tools permitidos:**
```yaml
# Si agent usa Bash pero no está en tools
tools: ["Read", "Write", "Bash"]
```

**Verificar system prompt:**
- Instrucciones claras
- Proceso paso a paso
- Output format definido

### Frontmatter Error

```bash
# Verificar YAML válido
cat .claude/agents/agent-name.md

# Verificar separators ---
# Formato:
# ---
# name: agent-name
# description: ...
# ---
#
# System prompt
```

## Best Practices

### ✅ Hacer

- Usar agents para tareas multi-paso autónomas
- Escribir descriptions con examples concretos
- Incluir commentary explicando reasoning
- Definir clear system prompts con proceso
- Usar `model: inherit` por defecto
- Elegir color descriptivo del propósito
- Commitear agents a Git (project agents)

### ❌ No Hacer

- Usar agents para tareas simples (usar commands)
- Escribir description vago sin examples
- Omitir `<commentary>` en examples
- Dar system prompt ambiguo
- Usar `model: opus` sin razón (costoso)
- Duplicar agents entre project y user

## Documentación

- **Skill:** `.agents/skills/agent-development/SKILL.md` - Guía completa
- **References:** `docs/references/agents/agent-development-claude-code.md` - Documentación técnica
- **Examples:** Ver `.agents/skills/agent-development/examples/`
- **Subagent Development:** `docs/references/agents/sub-agents-claude-code.md`

## Referencias

- [Agent Development Skill](.agents/skills/agent-development/SKILL.md)
- [Agent Development - Claude Code](docs/references/agents/agent-development-claude-code.md)
- [Subagents - Claude Code](docs/references/agents/sub-agents-claude-code.md)
- [AGENTS.md Format](docs/references/agents/agents-md-format.md)
- [Cursor Subagents](docs/references/agents/cursor-subagents.md)
