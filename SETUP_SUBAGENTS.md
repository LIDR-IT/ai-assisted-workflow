# Guía de Setup de Subagents

## ⚠️ Estado Actual: En Desarrollo

**Nota importante:** El sistema de subagents está actualmente en desarrollo y puede no funcionar completamente en todas las plataformas. Esta documentación proporciona una guía rápida de setup. Para detalles técnicos completos, consulta `docs/references/agents/`.

**Tareas pendientes:**
- Setup funcional de subagents (actualmente no funciona completamente)
- Documentación completa de creación de subagents
- Ejemplos de subagents probados en producción

Ver `TODO.md` para seguimiento de progreso.

---

## Quick Start

### 1. Verificar Soporte de Plataforma

```bash
# Claude Code - Soporte completo
claude --version
# Debe ser versión reciente con soporte de subagents

# Cursor - Soporte parcial
# Verificar en settings si "agents" está habilitado

# Gemini CLI - Experimental
gemini --version
# Requiere flag --enable-agents
```

**Verificar directorios:**
```bash
# Claude Code (proyecto)
ls -la .claude/agents/

# Claude Code (usuario)
ls -la ~/.claude/agents/

# Cursor
ls -la .cursor/agents/

# Gemini (requiere flag)
ls -la .gemini/agents/
```

### 2. Crear Primer Subagent

```bash
# Para Claude Code (proyecto - compartido con equipo)
mkdir -p .claude/agents

cat > .claude/agents/code-reviewer.md << 'EOF'
---
name: code-reviewer
description: Expert code reviewer. Use proactively after code changes to check quality, security, and best practices.
tools: Read, Grep, Glob
model: inherit
---

You are a senior code reviewer.

When invoked:
1. Run git diff to see recent changes
2. Focus on modified files
3. Begin review immediately

Review checklist:
- Code clarity and readability
- Proper error handling
- No exposed secrets
- Test coverage

Provide feedback by priority:
- **Critical** (must fix)
- **Warnings** (should fix)
- **Suggestions** (consider)
EOF
```

### 3. Probar Subagent

```bash
# Iniciar sesión Claude Code
claude

# En la sesión
You: Review my recent code changes
Claude: [Delega automáticamente al code-reviewer subagent]
```

**Verificar delegación:**
- Claude debe mencionar que usa el subagent
- Output debe incluir resultados del review
- Context principal debe mantenerse limpio

---

## Subagents vs Agents: ¿Cuál Usar?

### Tabla Comparativa

| Característica | Agents | Subagents |
|----------------|--------|-----------|
| **Context Window** | Shared con conversación principal | Separado, independiente |
| **Activación** | Automática según description field | Delegado desde agent principal |
| **Herramientas** | Todas las disponibles | Restringidas (configurable) |
| **Duración** | Múltiples turnos, conversación larga | Task-specific, retorna resultados |
| **Output** | Visible en conversación principal | Solo summary retorna a main |
| **Uso de Tokens** | Consume context principal | Context separado (ahorra tokens) |
| **Mejor para** | Tareas autónomas multi-paso | Research, verbose operations |
| **Ubicación** | `.claude/agents/` (NO .agents/) | `.claude/agents/` (NO .agents/) |

### ¿Cuándo Usar Subagents?

**Usar SUBAGENT cuando:**
- Output es verbose pero solo necesitas summary
- Quieres preservar context principal limpio
- Tarea es autocontenida (no requiere back-and-forth)
- Necesitas restricciones específicas de tools
- Research que genera mucho texto
- Análisis profundo con resultados concisos

**Ejemplos:**
- Code review comprehensivo (mucho análisis → summary)
- Codebase exploration (leer muchos archivos → hallazgos clave)
- Test suite execution (output verbose → solo failures)
- Security scan (muchos checks → issues encontrados)
- Documentation search (leer docs → info relevante)

### ¿Cuándo Usar Agents?

**Usar AGENT cuando:**
- Necesitas conversación multi-turno
- Iteración y refinamiento frecuente
- Fases comparten contexto significativo
- Latencia es crítica
- Back-and-forth con usuario

**Ejemplos:**
- Refactoring asistido (con feedback iterativo)
- Feature implementation guiada
- Debugging interactivo
- Planning colaborativo

### Diferencia Clave

**Agents:** Como **colegas** trabajando en la misma conversación
**Subagents:** Como **especialistas externos** que entregan informes

---

## ⚠️ Subagents NO Usan `.agents/`

### Ubicación Platform-Specific

**Diferencia crítica:** Subagents NO siguen el patrón centralizado `.agents/` como Rules, Skills y Commands.

**Razón:** Cada plataforma tiene:
- Diferentes campos de frontmatter
- Diferentes capacidades de tools
- Diferentes permission models
- Diferentes formatos de configuration

### Estructura de Archivos

```
project-root/
├── .claude/
│   └── agents/               # Claude Code subagents
│       ├── code-reviewer.md
│       ├── debugger.md
│       └── test-runner.md
├── .cursor/
│   └── agents/               # Cursor subagents (diferentes campos)
│       └── verifier.md
├── .gemini/
│   └── agents/               # Gemini CLI subagents (experimental)
│       └── security-auditor.md
│
├── .agents/                  # ❌ Subagents NO van aquí
│   ├── rules/                # ✅ Rules SÍ (synced)
│   ├── skills/               # ✅ Skills SÍ (synced)
│   ├── commands/             # ✅ Commands SÍ (synced)
│   └── mcp/                  # ✅ MCP SÍ (synced)
│
└── ~/ (User home)
    ├── .claude/agents/       # User-level Claude subagents
    ├── .cursor/agents/       # User-level Cursor subagents
    └── .gemini/agents/       # User-level Gemini subagents
```

### Comparación con Otros Componentes

| Componente | Centralizado | Sync Method | Plataformas |
|------------|--------------|-------------|-------------|
| **Rules** | ✅ .agents/rules/ | Symlinks | Cursor, Claude, Gemini, Antigravity |
| **Skills** | ✅ .agents/skills/ | Symlinks | Cursor, Claude, Gemini, Antigravity |
| **Commands** | ✅ .agents/commands/ | Symlinks | Cursor, Claude, Gemini, Antigravity |
| **MCP** | ✅ .agents/mcp/ | Script generation | Cursor, Claude, Gemini |
| **Subagents** | ❌ Platform-specific | No sync | Platform-dependent |

---

## Estructura de Subagents

### Formato Frontmatter Completo

```markdown
---
name: agent-name
description: Expert in X. Use proactively when Y.
tools: Read, Grep, Glob
disallowedTools: Write, Edit
model: inherit
permissionMode: default
skills:
  - skill-name-1
  - skill-name-2
hooks:
  PreToolUse:
    - matcher: "Bash"
      hooks:
        - type: command
          command: "./validate.sh"
---

You are [role description]...

[System prompt defining behavior]
```

### Campos por Plataforma

#### Claude Code (Soporte Completo)

**Campos requeridos:**
- `name` - Identificador único (lowercase, hyphens)
- `description` - Cuándo delegar (con ejemplos proactivos)

**Campos opcionales:**
- `tools` - Lista de herramientas permitidas
- `disallowedTools` - Lista de herramientas denegadas
- `model` - Modelo a usar: inherit, sonnet, opus, haiku
- `permissionMode` - Control de permisos: default, acceptEdits, dontAsk, bypassPermissions, plan
- `skills` - Skills a precargar en context
- `hooks` - Hooks específicos del subagent

#### Cursor (Soporte Parcial)

**Campos soportados:**
- `name`, `description`, `model`
- `readonly` - Boolean (true = no modificaciones)

**No soportado:**
- `tools`, `disallowedTools` (usa readonly)
- `permissionMode` granular
- `hooks`

#### Gemini CLI (Experimental)

**Requiere flag:**
```bash
gemini --enable-agents
```

**Campos soportados:**
- `name`, `description`, `model`
- `tools` (limitado)

**Limitaciones:**
- Background execution no disponible
- Hooks no soportados
- MCP integration limitada

### System Prompt Guidelines

**Estructura recomendada:**

```markdown
You are [role and expertise].

When invoked:
1. [First action]
2. [Second action]
3. [Third action]

[Task-specific checklist or process]

Provide output:
- [Format expectation 1]
- [Format expectation 2]
- [Format expectation 3]

[Any special constraints or focus areas]
```

**Ejemplo:**
```markdown
You are a security auditor specializing in web application vulnerabilities.

When invoked:
1. Identify all user input points
2. Check for common vulnerabilities
3. Analyze authentication flows

Security checklist:
- SQL injection vectors
- XSS vulnerabilities
- CSRF protections
- Exposed secrets
- Insecure dependencies

Provide output:
- **Critical** issues (immediate fix required)
- **High** severity (fix before deployment)
- **Medium** severity (address soon)
- **Low** severity (best practice)

Focus on practical, actionable findings with code examples.
```

---

## Platform Support

### Claude Code (Principal)

**Estado:** ✅ Full support

**Capabilities:**
- Foreground y background execution
- Full tool restrictions
- Permission modes granulares
- Skill preloading
- Hook integration
- MCP tools access
- Resume functionality

**Ejemplo completo:**
```markdown
---
name: test-runner
description: Test execution specialist. Use proactively after code changes to run and analyze tests.
tools: Bash, Read, Grep
model: inherit
permissionMode: acceptEdits
skills:
  - testing-conventions
---

You are a test execution specialist.

When invoked:
1. Identify test framework in use
2. Run appropriate test command
3. Analyze test output for failures
4. Provide detailed failure summaries

Test process:
- Run full test suite
- Capture all output
- Identify failing tests
- Extract error messages
- Suggest fixes if obvious

Report only:
- Failed test count
- Specific failing tests with errors
- Suggested next steps

Do not include successful test output in report.
```

### Cursor (Secundario)

**Estado:** ✅ Partial support

**Differences con Claude Code:**
- Usa `readonly: true` en lugar de `tools`/`disallowedTools`
- No soporta `permissionMode` granular
- No soporta hooks
- No soporta skill preloading

**Ejemplo Cursor:**
```markdown
---
name: code-analyzer
description: Analyze code quality and architecture.
readonly: true
model: sonnet
---

You are a code architecture analyst.

Analyze code structure and provide recommendations.
```

**Field mapping:**

| Claude Code | Cursor | Notas |
|-------------|--------|-------|
| `tools: Read, Grep` | `readonly: true` | Read-only |
| `tools: Read, Write, Edit` | (omit readonly) | Full access |
| `permissionMode: acceptEdits` | N/A | No soportado |
| `skills: [...]` | N/A | No soportado |

### Gemini CLI (Experimental)

**Estado:** ⚠️ Experimental (requires flag)

**Setup:**
```bash
# Habilitar agents
export GEMINI_ENABLE_AGENTS=true

# O usar flag
gemini --enable-agents
```

**Limitations:**
- Solo foreground execution
- Tool restrictions limitadas
- No hooks
- No skill preloading
- MCP integration básica

**Ejemplo Gemini:**
```markdown
---
name: explorer
description: Explore codebase for specific patterns.
tools: Read, Grep, Glob
model: inherit
---

You are a codebase explorer.

Search for patterns and summarize findings.
```

### Antigravity

**Estado:** ❌ NOT supported

**Razón:** Antigravity no soporta subagents system.

**Alternativa:** Usar agents tradicionales o commands en `.agent/workflows/`

---

## Subagents Built-in

### Por Plataforma

#### Claude Code Built-ins

| Subagent | Model | Tools | Purpose |
|----------|-------|-------|---------|
| **Explore** | Haiku | Read-only | Fast codebase exploration |
| **Plan** | Inherit | Read-only | Research for plan mode |
| **General-Purpose** | Inherit | All | Complex multi-step tasks |
| **Bash** | Inherit | Bash | Terminal commands isolated |
| **Claude Code Guide** | Haiku | Read, WebFetch | Answer Claude Code questions |

#### Cursor Built-ins

| Subagent | Purpose |
|----------|---------|
| **Verifier** | Verify code changes |
| **Composer** | Multi-file editing |

#### Gemini Built-ins

Gemini CLI actualmente no incluye built-in subagents (experimental).

---

## Ejemplos de Subagents

### 1. Code Reviewer (Read-Only)

**Use case:** Review comprehensivo sin modificaciones

```markdown
---
name: code-reviewer
description: Senior code reviewer. Use proactively after code changes for quality, security, and maintainability analysis.
tools: Read, Grep, Glob, Bash
model: inherit
---

You are a senior code reviewer ensuring high engineering standards.

When invoked:
1. Run `git diff` to see recent changes
2. Focus on modified files
3. Begin review immediately without asking

Review checklist:
- Code clarity and readability
- Proper naming conventions
- No code duplication
- Proper error handling
- No exposed secrets (API keys, passwords)
- Input validation
- Test coverage
- Performance considerations

Provide feedback categorized by priority:

**Critical** (must fix before merge):
- Security vulnerabilities
- Exposed secrets
- Breaking changes without migration

**Warnings** (should fix):
- Missing error handling
- Poor naming
- Code duplication
- Missing tests

**Suggestions** (consider):
- Performance optimizations
- Readability improvements
- Refactoring opportunities

Include:
- Specific file and line numbers
- Code examples of issues
- Suggested fixes with code
- Rationale for each issue
```

**Usage:**
```
Review my code changes before I commit
```

### 2. Test Runner (Background)

**Use case:** Run tests en background, reportar solo failures

```markdown
---
name: test-runner
description: Test execution specialist. Use proactively after code changes to run tests and report failures.
tools: Bash, Read, Grep
model: inherit
permissionMode: acceptEdits
---

You are a test execution specialist.

When invoked:
1. Detect test framework (Jest, pytest, Go test, etc.)
2. Run appropriate test command
3. Capture all output (but only report failures)
4. Analyze failures for patterns

Test execution process:
- Identify test framework from package.json, requirements.txt, go.mod
- Run full test suite: `npm test`, `pytest`, `go test ./...`
- Parse test output
- Extract failing test names and error messages
- Check if failures are related

Report format:

**Summary:**
- Total tests: X
- Passed: Y
- Failed: Z

**Failures:**
For each failing test:
- Test name and file
- Error message
- Stack trace (relevant parts)
- Suggested fix if obvious

**DO NOT** include successful test output.
**DO** keep verbose test logs in subagent context only.
```

**Usage:**
```
Run the test suite in the background and report any failures
```

### 3. Debugger Specialist (Full Tools)

**Use case:** Debug issues con capacidad de modificar código

```markdown
---
name: debugger
description: Debugging specialist. Use proactively when encountering errors, test failures, or unexpected behavior.
tools: Read, Write, Edit, Bash, Grep, Glob
model: sonnet
permissionMode: acceptEdits
---

You are an expert debugger specializing in root cause analysis.

When invoked:
1. Capture the error message and stack trace
2. Identify reproduction steps
3. Form hypothesis about root cause
4. Test hypothesis (add logging, run tests)
5. Implement minimal fix
6. Verify fix works

Debugging workflow:

**Analysis:**
- Read error messages carefully
- Check stack traces for failure point
- Review recent changes (git diff)
- Identify affected files

**Investigation:**
- Add strategic logging/debugging
- Run code to reproduce issue
- Inspect variable states
- Check assumptions

**Fix:**
- Implement minimal, targeted fix
- Avoid over-engineering
- Add test to prevent regression
- Verify fix resolves issue

**Output:**
For each issue provide:
- Root cause explanation (WHY it failed)
- Supporting evidence (logs, traces)
- Specific code fix implemented
- Test case added (if applicable)
- Prevention recommendations

Focus on fixing the underlying issue, not just symptoms.
```

**Usage:**
```
Debug why the authentication flow is failing
```

---

## Context Management

### Separate Context Windows

**Key concept:** Cada subagent tiene su propio context window, independiente de la conversación principal.

**Implicaciones:**
- Subagent NO ve la conversación principal
- Solo recibe su system prompt
- Verbose output se queda en subagent context
- Solo summary retorna a main conversation

**Benefit:** Main context se mantiene limpio y enfocado

**Example:**
```
Main: "Use code-reviewer to review auth module"
  → Subagent opens fresh context
  → Reads 50 files (10K tokens)
  → Analyzes patterns
  → Generates 5K token report
  → Returns 500 token summary to main
Main context: +500 tokens (not +15K)
```

### Foreground vs Background

#### Foreground (Blocking)

**Características:**
- Bloquea conversación principal
- Permission prompts pasan al usuario
- Puede hacer preguntas clarificadoras
- Full interactividad
- MCP tools disponibles

**Cuándo usar:**
- Necesitas responder preguntas del subagent
- Requires MCP tools
- Permisos dinámicos necesarios

**Invocar:**
```
Use debugger to investigate the error (foreground)
```

#### Background (Concurrent)

**Características:**
- Corre concurrentemente con main
- Solo permisos pre-aprobados
- Auto-deny requests no aprobados
- NO puede hacer preguntas
- NO MCP tools

**Cuándo usar:**
- Tarea autocontenida
- Permisos conocidos de antemano
- No requiere input del usuario
- Operaciones largas (tests, scans)

**Invocar:**
```
Run test suite in background using test-runner
```

**Control manual:**
- Pedir explícitamente: "run this in the background"
- Durante ejecución: **Ctrl+B** para background
- Disable background: `export CLAUDE_CODE_DISABLE_BACKGROUND_TASKS=1`

### Resuming Subagents

**Cada invocación = nueva instancia** con fresh context

**Para continuar trabajo existente:**
```
Use code-reviewer to review auth module
[Subagent completes → returns results]

Continue that review and check authorization logic
[Claude resumes con full subagent context]
```

**Benefits:**
- Retains full conversation history
- Incluye todos tool calls y resultados
- Preserves reasoning
- Picks up donde se detuvo

**Finding Agent IDs:**
```bash
# Transcripts ubicación
~/.claude/projects/{project-hash}/{session-id}/subagents/

# Cada subagent
agent-{agent-id}.jsonl

# Listar
ls -la ~/.claude/projects/*/*/subagents/
```

---

## Troubleshooting

### 1. Subagent No Se Activa

**Síntoma:** Claude no delega automáticamente al subagent

**Diagnóstico:**
```bash
# Verificar archivo existe
ls -la .claude/agents/code-reviewer.md

# Verificar frontmatter válido
cat .claude/agents/code-reviewer.md

# Verificar YAML syntax (debe tener ---)
# ---
# name: code-reviewer
# description: ...
# ---
```

**Solución:**
1. **Mejorar description field** - Debe ser específico y proactivo
2. **Agregar ejemplos** - Include casos de uso concretos
3. **Usar lenguaje proactivo** - "Use proactively when..."
4. **Invocar explícitamente** - "Use code-reviewer to..."

**Ejemplo de description mejorada:**
```yaml
# ❌ Vago
description: Reviews code

# ✅ Específico y proactivo
description: Expert code reviewer. Use proactively after code changes to check quality, security, and best practices. Especially useful before commits or pull requests.
```

### 2. Subagent No Puede Modificar Archivos

**Síntoma:** Subagent intenta editar pero falla o se bloquea

**Diagnóstico:**
```bash
# Verificar fields de permisos
grep -A 5 "^---" .claude/agents/debugger.md

# Check: tools, readonly, permissionMode
```

**Solución por plataforma:**

**Claude Code:**
```yaml
# Incluir tools de escritura
tools: Read, Write, Edit, Bash

# O configurar permissionMode
permissionMode: acceptEdits
```

**Cursor:**
```yaml
# NO incluir readonly: true
# (Omitir = full access)
```

**Gemini:**
```yaml
# Incluir tools necesarios
tools: Read, Write, Edit
```

### 3. Background Subagent Falla

**Síntoma:** Subagent en background termina con error

**Diagnóstico:**
```bash
# Check logs (si disponibles)
cat ~/.claude/logs/latest.log | grep "background"

# Verificar si usa MCP tools
grep -i "mcp\|context7\|database" .claude/agents/subagent.md
```

**Solución:**
1. **NO usar MCP tools en background** - MCP requiere foreground
2. **Pre-aprobar permisos** - Usar `permissionMode: acceptEdits`
3. **Evitar interactividad** - No usar AskUserQuestion
4. **Switch a foreground** - Si necesita MCP o prompts

**Example fix:**
```yaml
# Si usa MCP tools, NO background
# Invocar: "Use explorer in foreground mode"

# Si necesita permisos, pre-aprobar
permissionMode: acceptEdits
```

### 4. MCP Tools No Funcionan

**Síntoma:** Subagent no puede usar MCP servers (Context7, database, etc.)

**Diagnóstico:**
```bash
# Verificar modo de ejecución
# Background = NO MCP

# Verificar tools list
grep "tools:" .claude/agents/researcher.md
```

**Solución:**
1. **Foreground mode** - MCP solo funciona en foreground
2. **Incluir MCP en tools** - Si omites tools, heredan
3. **Verificar MCP config** - `.claude/mcp.json` debe tener server

**Example:**
```yaml
# Subagent que usa Context7 (MCP)
---
name: docs-researcher
description: Research documentation using Context7.
# Omit tools para heredar MCP access
model: inherit
---

# INVOKE IN FOREGROUND:
# "Use docs-researcher in foreground to search React docs"
```

### 5. Frontmatter Error

**Síntoma:** Subagent no se carga, error de parsing

**Diagnóstico:**
```bash
# Verificar YAML syntax
cat .claude/agents/agent.md

# Debe tener exactamente:
# ---
# campo: valor
# ---
#
# System prompt aquí
```

**Errores comunes:**
```yaml
# ❌ Missing closing separator
---
name: agent
description: text
System prompt  # ❌ Falta ---

# ❌ Indentación incorrecta
---
  name: agent  # ❌ No indentar
description: text
---

# ❌ Quotes inconsistentes
---
name: agent
description: "text with "quotes"  # ❌ Escape quotes
---

# ✅ Correcto
---
name: agent
description: Expert in X. Use when Y.
tools: Read, Grep
model: inherit
---

System prompt starts here.
```

**Solución:**
1. Verificar separators `---` exactos (3 hyphens)
2. No indentar frontmatter fields
3. Escape quotes: `"text with \"quotes\""`
4. Separador antes Y después de frontmatter

---

## Best Practices

### ✅ Hacer

- **Platform-specific directories** - Crear en `.claude/agents/`, NO en `.agents/`
- **Focused expertise** - Un subagent = un propósito bien definido
- **Rich descriptions** - Incluir ejemplos concretos de cuándo usar
- **Tool restrictions** - Principle of least privilege (mínimos tools necesarios)
- **Context isolation** - Usar para verbose operations que ensuciarían main context
- **Proactive language** - "Use proactively when..." en description
- **Version control** - Commitear project subagents a Git
- **Test first** - Probar antes de compartir con equipo
- **model: inherit** - Heredar modelo por defecto (más flexible)
- **Background para long ops** - Tests, scans, exploraciones largas

### ❌ No Hacer

- **NO centralizar** - NO crear en `.agents/` (no funcionará)
- **NO duplicar agents** - Si ya tienes agent, no necesitas subagent
- **NO sobre-usar** - Para tareas simples, usar skills o commands
- **NO vago descriptions** - "Helper agent" no dice cuándo usar
- **NO herramientas sin límite** - No dar `tools: "*"` sin razón
- **NO background con MCP** - MCP tools requieren foreground
- **NO background interactivo** - No usar AskUserQuestion en background
- **NO ignorar platform limits** - Cursor/Gemini tienen menos features
- **NO mezclar concepts** - Agents ≠ Subagents ≠ Commands ≠ Skills
- **NO skippear testing** - Probar antes de commitear

---

## Documentación

### Referencias Completas

**En este repositorio:**

- **Sub-Agents Claude Code:** `docs/references/agents/sub-agents-claude-code.md`
  - Documentación técnica completa (20 KB)
  - Todos los campos frontmatter
  - Ejemplos avanzados
  - Hooks integration
  - Context management profundo

- **Cursor Subagents:** `docs/references/agents/cursor-subagents.md`
  - Cursor-specific differences
  - Field mappings
  - Limitations y workarounds

- **Gemini Subagents:** `docs/references/agents/subagents-gemini.md`
  - Experimental features
  - Setup con flags
  - Known issues

- **Agent Development:** `docs/references/agents/agent-development-claude-code.md`
  - Crear autonomous agents
  - Agents vs Subagents
  - Best practices

- **AGENTS.md Format:** `docs/references/agents/agents-md-format.md`
  - Ecosystem standard
  - File format spec
  - Compatibility

### Skills Relacionados

**Disponibles en `.agents/skills/`:**

- **agent-development** - Crear agents y subagents
- **skill-creator** - Crear skills (alternativa a subagents)
- **command-development** - Crear commands (alternativa simple)

**Invocar:**
```
/skill agent-development
/skill skill-creator
```

### Guías Prácticas

**Comparar opciones:**

| Necesidad | Usar | Ubicación |
|-----------|------|-----------|
| Verbose operation isolated | Subagent | `.claude/agents/` |
| Reusable prompt simple | Command | `.agents/commands/` |
| Specialized knowledge | Skill | `.agents/skills/` |
| Multi-turn autonomous | Agent | `.claude/agents/` |

### TODO & Roadmap

**Ver `TODO.md` para:**
- Setup funcional de subagents (en progreso)
- Documentación completa de creación
- Ejemplos probados en producción
- Platform compatibility testing

---

## Referencias

### Documentación Oficial

- **Claude Code Sub-Agents:** [code.claude.com/docs/en/sub-agents](https://code.claude.com/docs/en/sub-agents)
- **Hooks Reference:** [code.claude.com/docs/en/hooks](https://code.claude.com/docs/en/hooks)
- **Skills Documentation:** [code.claude.com/docs/en/skills](https://code.claude.com/docs/en/skills)

### Documentación Interna

- [Sub-Agents Claude Code](docs/references/agents/sub-agents-claude-code.md)
- [Cursor Subagents](docs/references/agents/cursor-subagents.md)
- [Gemini Subagents](docs/references/agents/subagents-gemini.md)
- [Agent Development](docs/references/agents/agent-development-claude-code.md)
- [AGENTS.md Format](docs/references/agents/agents-md-format.md)

### Skills y Commands

- [Agent Development Skill](.agents/skills/agent-development/SKILL.md)
- [Skill Creator](.agents/skills/skill-creator/SKILL.md)
- [Command Development](.agents/skills/command-development/SKILL.md)

---

**Última Actualización:** Febrero 2026
**Estado:** En Desarrollo (ver TODO.md)
**Plataforma Principal:** Claude Code
