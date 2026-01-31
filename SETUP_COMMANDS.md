# Guía de Setup de Commands

Los slash commands son prompts frecuentemente usados definidos como archivos Markdown que Claude ejecuta durante sesiones interactivas.

## Quick Start

### 1. Crear Directorio de Commands

```bash
# Para proyecto (compartido con equipo)
mkdir -p .claude/commands

# Para uso personal (solo tú)
mkdir -p ~/.claude/commands
```

### 2. Crear Primer Command

```bash
# Crear command simple
cat > .claude/commands/review.md << 'EOF'
---
description: Review code for security vulnerabilities
---

Review this code for security issues including:
- SQL injection
- XSS attacks
- Authentication bypass
- Insecure data handling

Provide specific line numbers and severity ratings.
EOF
```

### 3. Probar Command

```bash
# En Claude Code
claude

# En la sesión
You: /review
Claude: [Ejecuta el command y revisa código]
```

## Estructura de Commands

### ⚠️ Commands NO Usan `.agents/`

**Diferencia importante:** A diferencia de Rules y Skills, Commands NO usan el patrón `.agents/` con symlinks.

**Razón:** Commands son específicos de cada agente (Claude Code, Cursor, etc.) y no están diseñados para compartirse automáticamente entre plataformas.

### Ubicaciones

**Project commands** (`.claude/commands/`):
- Creados directamente en `.claude/commands/`
- Compartidos con equipo (versionados en Git)
- Específicos del proyecto
- Mostrados como "(project)" en `/help`
- **NO hay `.agents/commands/`**

**Personal commands** (`~/.claude/commands/`):
- Solo para ti
- Disponibles en todos tus proyectos
- No versionados
- Mostrados como "(user)" en `/help`

**Plugin commands** (`plugin-name/commands/`):
- Incluidos con plugins
- Mostrados como "(plugin-name)" en `/help`

### Comparación con Rules/Skills

```
Rules:   .agents/rules/    → .cursor/rules (symlink)
                           → .claude/rules (symlink)

Skills:  .agents/skills/   → .cursor/skills (symlink)
                           → .claude/skills (symlink)

Commands: .claude/commands/  (directorio real, NO symlink)
          .cursor/commands/  (directorio real, separado)
```

### Formato de Archivo

**Simple (sin frontmatter):**
```markdown
Review this code for best practices and suggest improvements.
```

**Con frontmatter (recomendado):**
```markdown
---
description: Review code quality
allowed-tools: Read, Grep
model: sonnet
---

Review this code for:
1. Code quality
2. Best practices
3. Performance issues
```

## YAML Frontmatter

### Campos Comunes

**description** - Descripción breve en `/help`:
```yaml
description: Review pull request for code quality
```

**allowed-tools** - Herramientas permitidas:
```yaml
allowed-tools: Read, Write, Edit, Bash(git:*)
```

**model** - Modelo a usar:
```yaml
model: sonnet  # o haiku, opus
```

**argument-hint** - Ayuda para argumentos:
```yaml
argument-hint: <file-path>
```

## Ejemplos de Commands

### Command Simple

```markdown
# .claude/commands/explain.md
---
description: Explain code in simple terms
---

Explain this code in simple terms that a beginner can understand.
Use analogies and examples where helpful.
```

**Uso:** `/explain`

### Command con Argumentos

```markdown
# .claude/commands/test.md
---
description: Generate tests for file
argument-hint: <file-path>
---

Generate comprehensive unit tests for: $ARGUMENTS

Include:
- Happy path tests
- Edge cases
- Error handling
- Mock data setup
```

**Uso:** `/test src/utils.ts`

### Command con Bash

```markdown
# .claude/commands/commit.md
---
description: Create git commit with AI message
allowed-tools: Bash(git:*)
---

Analyze staged changes and create a commit:

1. Run git diff --staged
2. Analyze the changes
3. Generate conventional commit message
4. Execute: git commit -m "[message]"
```

**Uso:** `/commit`

### Command Interactivo

```markdown
# .claude/commands/setup-feature.md
---
description: Interactive feature setup wizard
---

Guide me through setting up a new feature:

Use AskUserQuestion to gather:
1. Feature name
2. Components needed (API, UI, Tests)
3. Dependencies required

Then create the necessary files and structure.
```

**Uso:** `/setup-feature`

## Argumentos Dinámicos

### $ARGUMENTS Variable

Commands pueden recibir argumentos del usuario:

```markdown
---
description: Search codebase for pattern
argument-hint: <search-pattern>
---

Search the codebase for: $ARGUMENTS

Show matching files with context.
```

**Uso:** `/search "function handleAuth"`

### Referencias a Archivos

Los argumentos pueden referenciar archivos:

```markdown
---
description: Optimize file
argument-hint: <file-path>
---

Optimize the file: $ARGUMENTS

Focus on:
- Performance
- Readability
- Best practices
```

**Uso:** `/optimize src/utils.ts`

## Organización

### Naming Conventions

**Usar verbos para acciones:**
- `review.md` - Review code
- `test.md` - Generate tests
- `deploy.md` - Deploy application
- `explain.md` - Explain code

**Usar sustantivos para recursos:**
- `status.md` - Show project status
- `docs.md` - Generate documentation

### Agrupar por Categoría

```
.claude/commands/
├── code/
│   ├── review.md
│   ├── refactor.md
│   └── optimize.md
├── git/
│   ├── commit.md
│   └── pr.md
└── docs/
    ├── readme.md
    └── api.md
```

## Troubleshooting

### Command No Encontrado

```bash
# Verificar archivo existe
ls .claude/commands/review.md

# Verificar extensión .md
ls .claude/commands/*.md

# Re-iniciar sesión de Claude
claude
```

### Syntax Error en Frontmatter

```bash
# Verificar YAML válido
cat .claude/commands/review.md

# Formato correcto:
# ---
# description: text
# ---
#
# Command content
```

### Command No Ejecuta Herramientas

**Agregar allowed-tools:**
```yaml
---
allowed-tools: Read, Write, Bash
---
```

**O usar wildcard:**
```yaml
---
allowed-tools: "*"
---
```

### Argumentos No Funcionan

**Verificar $ARGUMENTS está en el prompt:**
```markdown
Process the file: $ARGUMENTS
```

**Verificar argument-hint para ayuda:**
```yaml
argument-hint: <file-path>
```

## Best Practices

### ✅ Hacer

- Escribir commands como instrucciones PARA Claude
- Usar frontmatter para configuración
- Dar descriptions claras en `/help`
- Commitear project commands a Git
- Usar nombres descriptivos y consistentes
- Incluir examples en commands complejos

### ❌ No Hacer

- Escribir commands como mensajes al usuario
- Olvidar el separator `---` en frontmatter
- Usar `allowed-tools: "*"` sin necesidad
- Duplicar commands entre project y user
- Usar caracteres especiales en nombres

## Documentación

- **Skill:** `.agents/skills/command-development/SKILL.md` - Guía completa
- **References:** `docs/references/commands/command-development.md` - Documentación técnica
- **Examples:** Ver `.agents/skills/command-development/examples/`

## Referencias

- [Command Development Skill](.agents/skills/command-development/SKILL.md)
- [Command Development Reference](docs/references/commands/command-development.md)
- [Cursor Commands](docs/references/commands/cursor-commands.md)
- [Antigravity Workflows](docs/references/commands/antigravity-workflows.md)
