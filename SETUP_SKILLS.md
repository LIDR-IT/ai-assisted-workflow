# Guía de Setup de Skills

Este proyecto usa skills instalados en `.agents/skills/` como source of truth, accesibles a todos los agentes vía symlinks.

## Quick Start

### 1. Verificar Skills Disponibles

```bash
# Listar skills instalados
ls .agents/skills/
```

**Skills incluidos (7):**
- `agent-development/` - Crear agentes personalizados
- `command-development/` - Crear slash commands
- `find-skills/` - Descubrir e instalar skills
- `hook-development/` - Crear hooks de eventos
- `mcp-integration/` - Integrar MCP servers
- `skill-creator/` - Crear nuevos skills
- `skill-development/` - Desarrollo de skills

### 2. Verificar Symlinks

```bash
# Los symlinks ya están creados por sync-rules.sh
ls -la .cursor/skills
ls -la .claude/skills
ls -la .gemini/skills
```

**Salida esperada:**
```
lrwxr-xr-x  1 user  staff  17 Jan 31 12:00 .claude/skills -> ../.agents/skills
```

### 3. Usar Skills en Agentes

**Claude Code:**
```bash
# Listar skills disponibles
claude /find-skills

# Usar skill
# Los skills se activan automáticamente cuando son relevantes
```

**En conversación:**
```
You: I want to create a new command
Claude: [Automáticamente usa command-development skill]

You: How do I add an MCP server?
Claude: [Automáticamente usa mcp-integration skill]
```

## Descubrir Skills

### Usar /find-skills

```bash
# En Claude Code
claude /find-skills

# En conversación
You: /find-skills
Claude: Shows available skills and installation instructions
```

### Buscar Skills Oficiales

**Fuentes de skills:**
- [skills.sh](https://skills.sh) - Catálogo oficial
- [agents.md](https://agents.md) - Documentación de skills
- Plugin repositories - Skills específicos de plugins

## Instalar Nuevos Skills

### ⚡ Symlinks Bidireccionales

**IMPORTANTE:** Los symlinks funcionan en ambas direcciones para lectura Y escritura.

Puedes crear skills en **cualquiera** de estas ubicaciones:

```bash
# Opción A: Crear en .agents/skills/ (RECOMENDADO)
mkdir -p .agents/skills/custom-skill
cat > .agents/skills/custom-skill/SKILL.md << 'EOF'
---
name: custom-skill
---
# Custom Skill
EOF

# Opción B: Crear en .gemini/skills/
mkdir -p .gemini/skills/custom-skill
cat > .gemini/skills/custom-skill/SKILL.md << 'EOF'
---
name: custom-skill
---
# Custom Skill
EOF

# Opción C: Crear en .cursor/skills/
mkdir -p .cursor/skills/custom-skill
cat > .cursor/skills/custom-skill/SKILL.md << 'EOF'
---
name: custom-skill
---
# Custom Skill
EOF
```

**Todas estas opciones crean el skill en `.agents/skills/`** porque los symlinks son bidireccionales.

### Mejor Práctica: Crear en .agents/skills/

✅ **SIEMPRE crear directamente en `.agents/skills/`**

```bash
# 1. Crear directorio en source of truth
mkdir -p .agents/skills/custom-skill

# 2. Crear SKILL.md
cat > .agents/skills/custom-skill/SKILL.md << 'EOF'
---
name: custom-skill
description: Brief description of what this skill does
version: 0.1.0
---

# Custom Skill

Detailed instructions for Claude on what this skill does...

## Usage

When to use this skill...

## Examples

Example scenarios...
EOF

# 3. Verificar que aparece en todos los agentes
ls .cursor/skills/custom-skill   # ✅ Visible
ls .claude/skills/custom-skill   # ✅ Visible
ls .gemini/skills/custom-skill   # ✅ Visible
ls .agent/skills/custom-skill    # ❌ Necesita symlink manual
```

**Razones para crear en `.agents/skills/`:**
- Es el source of truth explícito
- Claro para otros en el equipo
- Git history más limpio
- Evita confusión sobre dónde está el "original"

### Opción 2: CLI (Experimental)

```bash
# Instalar desde marketplace (scope project)
claude plugin install skill-name@marketplace --scope project

# ❌ NUNCA usar --scope user (inconsistente para el equipo)
```

## Verificar Skills

### Por Plataforma

**Cursor:**
1. Abrir proyecto en Cursor
2. Settings → Skills/Plugins
3. Verificar skills aparecen

**Claude Code:**
```bash
# Ver skills disponibles
claude /find-skills
```

**Gemini CLI:**
```bash
# Listar skills
ls .gemini/skills/

# Usar en conversación
gemini  # Luego mencionar tarea relacionada con skill
```

**Antigravity:**
```bash
# Verificar symlinks selectivos
ls -la .agent/skills/
```

## Estructura de Skills

### Anatomía de un Skill

```
.agents/skills/
└── skill-name/
    ├── SKILL.md              # Instrucciones principales
    ├── examples/             # (Opcional) Ejemplos
    │   └── example-1.md
    └── references/           # (Opcional) Docs de referencia
        └── api-reference.md
```

### SKILL.md Format

```markdown
---
name: skill-name
description: Triggering conditions and what skill does
version: 0.1.0
---

# Skill Title

## Overview
Brief explanation...

## When to Use
Triggering conditions...

## Instructions
Step-by-step instructions for Claude...

## Examples
Usage examples...
```

## Troubleshooting

### Skill No Encontrado

```bash
# Verificar symlink existe
ls -la .claude/skills

# Re-crear symlink si necesario
rm .claude/skills
ln -s ../.agents/skills .claude/skills
```

### Skill No Se Activa

**Verificar description field:**
- Description debe incluir triggering conditions
- Debe ser específico sobre cuándo usar el skill
- Incluir ejemplos de uso

**Ejemplo correcto:**
```yaml
description: Use when user asks to "create a command", "add a slash command", or needs guidance on command structure...
```

### Skills No Sincronizan

```bash
# Verificar que son symlinks, no directorios
file .claude/skills  # Debe decir: "symbolic link"

# Re-ejecutar sync
./.agents/rules/sync-rules.sh
```

## Best Practices

### ✅ Hacer

- Mantener skills en `.agents/skills/` (source of truth)
- Usar nombres descriptivos: `code-review`, `api-docs`
- Documentar triggering conditions claramente
- Versionar skills (en frontmatter)
- Commitear a Git para compartir con equipo

### ❌ No Hacer

- Instalar skills a nivel user (`~/.claude/skills`)
- Duplicar skills en múltiples directorios
- Usar espacios o caracteres especiales en nombres
- Ignorar `.agents/skills/` en `.gitignore`

## Documentación

- **Source of Truth:** `.agents/skills/` (7 skills instalados)
- **Sync Script:** `.agents/rules/sync-rules.sh` (maneja rules Y skills)
- **Guía completa:** `docs/guidelines/team-conventions/skills-management-guidelines.md`
- **Skill Development:** `.agents/skills/skill-development/SKILL.md`
- **Skill Creator:** `.agents/skills/skill-creator/SKILL.md`

## Referencias

- [Skills Management Guidelines](docs/guidelines/team-conventions/skills-management-guidelines.md)
- [skills.sh - Official Catalog](https://skills.sh)
- [agents.md - Skills Documentation](https://agents.md)
- [Skill Development Skill](.agents/skills/skill-development/SKILL.md)
