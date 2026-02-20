# Gemini CLI - Experimental Features

Notas sobre configuraciones experimentales y características especiales de Gemini CLI.

## Configuración en settings.json

**Ubicación:** `.gemini/settings.json`

### 1. Agents Experimentales

Los subagents en Gemini CLI requieren flag experimental:

```json
{
  "experimental": {
    "enableAgents": true
  }
}
```

**Qué habilita:**

- ✅ Soporte para agents en `.gemini/agents/`
- ✅ Permite invocar agents autónomos
- ✅ Workflow multi-paso con subprocesos

**Estado:** Experimental (puede cambiar en futuras versiones)

**Sincronización:** El script `.agents/sync.sh --only=mcp` **preserva** esta configuración

## 2. Context Files (Memoria)

Gemini CLI puede leer archivos de contexto automáticamente:

```json
{
  "context": {
    "fileName": ["AGENTS.md", "CONTEXT.md", "GEMINI.md", "CLAUDE.md"]
  }
}
```

### Cómo Funciona

**Archivos de Memoria:**

- Gemini busca estos archivos en el directorio del proyecto
- Se cargan automáticamente como contexto adicional
- Similar al patrón AGENTS.md de Vercel

**Nombres configurables:**

- `AGENTS.md` - Información sobre agents disponibles
- `CONTEXT.md` - Contexto general del proyecto
- `GEMINI.md` - Instrucciones específicas para Gemini
- `CLAUDE.md` - Instrucciones para Claude (si usa Gemini)

### Agregar Más Archivos de Memoria

Puedes agregar más archivos editando `.gemini/settings.json`:

```json
{
  "context": {
    "fileName": [
      "AGENTS.md",
      "CONTEXT.md",
      "GEMINI.md",
      "CLAUDE.md",
      "PROJECT_RULES.md", // Nuevo
      "ARCHITECTURE.md", // Nuevo
      "CONVENTIONS.md" // Nuevo
    ]
  }
}
```

**Importante:** Los cambios en `settings.json` son **preservados** por `.agents/sync.sh --only=mcp`

### Cambiar Archivo de Memoria

Para usar un archivo diferente:

1. **Editar settings.json:**

```json
{
  "context": {
    "fileName": ["MI_CONTEXTO.md", "MI_PROYECTO.md"]
  }
}
```

2. **Crear los archivos:**

```bash
touch MI_CONTEXTO.md
touch MI_PROYECTO.md
```

3. **Contenido ejemplo:**

```markdown
# MI_CONTEXTO.md

## Proyecto: Template Best Practices

Este proyecto demuestra...

## Arquitectura

- .agents/ - Source of truth
- .gemini/ - Gemini-specific configs
  ...

## Convenciones

- Usar kebab-case para archivos
- Preferir symlinks sobre copias
  ...
```

## 3. Configuración Completa

Ejemplo de `.gemini/settings.json` con todas las configuraciones:

```json
{
  "experimental": {
    "enableAgents": true
  },
  "context": {
    "fileName": ["AGENTS.md", "CONTEXT.md", "GEMINI.md", "CLAUDE.md"]
  },
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"],
      "env": {
        "CONTEXT7_API_KEY": "${env:CONTEXT7_API_KEY}"
      }
    }
  }
}
```

## Sincronización y Preservación

### Script .agents/sync.sh --only=mcp

El script de sincronización **preserva** configuraciones importantes:

```bash
# Ejecutar sync
./.agents/sync.sh --only=mcp

# Resultado:
# ✅ Preserva: experimental
# ✅ Preserva: context
# ✅ Actualiza: mcpServers (desde mcp-servers.json)
```

### Cómo Funciona

1. **Si `.gemini/settings.json` existe:**
   - Lee configuración actual
   - Merge nueva sección `mcpServers`
   - **Preserva** `experimental` y `context`

2. **Si NO existe:**
   - Crea con configuración por defecto:
     - `enableAgents: true`
     - `fileName: ["AGENTS.md", ...]`
     - `mcpServers` generados

### Verificar Preservación

```bash
# Antes de sync
cat .gemini/settings.json

# Sync
./.agents/sync.sh --only=mcp

# Después de sync - verificar
cat .gemini/settings.json

# Debe mantener experimental y context ✅
```

## Casos de Uso

### Caso 1: Proyecto con Reglas Específicas

**Archivo:** `PROJECT_RULES.md`

```markdown
# Project Rules

## Code Style

- Use TypeScript strict mode
- Prefer functional components
- Always handle errors

## Git Workflow

- Feature branches: feature/name
- Commit format: type: description
  ...
```

**Config:**

```json
{
  "context": {
    "fileName": ["PROJECT_RULES.md", "AGENTS.md"]
  }
}
```

### Caso 2: Arquitectura Compleja

**Archivo:** `ARCHITECTURE.md`

```markdown
# Architecture

## System Components

- Frontend: React + TypeScript
- Backend: Node.js + Express
- Database: PostgreSQL
- Cache: Redis

## Data Flow

1. Client → API Gateway
2. Gateway → Services
3. Services → Database
   ...
```

**Config:**

```json
{
  "context": {
    "fileName": ["ARCHITECTURE.md", "CONTEXT.md"]
  }
}
```

### Caso 3: Multi-Agent Coordination

**Archivo:** `AGENTS.md`

```markdown
# Available Agents

## doc-improver

- Purpose: Documentation quality
- Invoked by: /improve-docs
- Reads: documentation.md rule

## code-reviewer

- Purpose: Code quality checks
- Invoked by: /review-code
- Reads: code-style.md rule
  ...
```

**Config:**

```json
{
  "experimental": {
    "enableAgents": true
  },
  "context": {
    "fileName": ["AGENTS.md", "CONTEXT.md"]
  }
}
```

## Mejores Prácticas

### 1. Archivos de Memoria Concisos

**Evitar:**

```markdown
# BAD: Muy largo

<!-- 10,000 líneas de documentación detallada -->
```

**Preferir:**

```markdown
# GOOD: Conciso y referencial

## Quick Reference

- Architecture: See docs/architecture.md
- Conventions: See .agents/rules/
- Agents: See .agents/subagent-readme.md
```

### 2. Actualizar al Cambiar Proyecto

Si cambias arquitectura, actualiza los archivos de memoria:

```bash
# Editar archivo de memoria
vim ARCHITECTURE.md

# Gemini lo leerá automáticamente en próxima sesión
```

### 3. Versionado en Git

Commitear archivos de memoria:

```bash
git add AGENTS.md CONTEXT.md GEMINI.md
git commit -m "docs: Update context files for Gemini CLI"
```

### 4. Team Alignment

Asegúrate que todo el equipo sepa:

- Qué archivos son de memoria
- Cuándo actualizarlos
- Qué información va en cada uno

## Limitaciones

### Context Size

**Límite de tokens:**

- Archivos de memoria consumen tokens del contexto
- Mantener archivos concisos (< 2KB recomendado)
- Usar como "índice" con referencias

**Ejemplo eficiente:**

```markdown
# CONTEXT.md (Conciso)

## Project: template-best-practices

Multi-agent AI configuration template

## Key Locations

- Rules: .agents/rules/
- Agents: .agents/subagents/
- Full docs: docs/

## Core Principle

Single source of truth in .agents/
```

### No Dynamic Loading

**Los archivos se cargan al iniciar sesión:**

- Cambios durante sesión NO se reflejan
- Reiniciar Gemini CLI para recargar

## Troubleshooting

### Agents No Funcionan

**Problema:** Agents no se activan

**Solución:**

```bash
# Verificar flag experimental
cat .gemini/settings.json | jq .experimental

# Debe mostrar:
# {
#   "enableAgents": true
# }

# Si falta, agregar:
jq '.experimental = {enableAgents: true}' .gemini/settings.json
```

### Context Files No Se Cargan

**Problema:** Archivos de memoria no se leen

**Solución:**

```bash
# 1. Verificar configuración
cat .gemini/settings.json | jq .context

# 2. Verificar archivos existen
ls -la AGENTS.md CONTEXT.md

# 3. Reiniciar Gemini CLI
gemini exit
gemini
```

### Sync Sobrescribe Config

**Problema:** .agents/sync.sh --only=mcp elimina experimental/context

**Solución:**

```bash
# Verificar versión del script
grep -A 10 "generate_gemini_config" .agents/sync.sh

# Debe tener lógica de merge
# Si no, actualizar desde template
```

## Referencias

- [Gemini CLI Documentation](https://ai.google.dev/gemini-api/docs/cli)
- [MCP Sync Setup](../guides/mcp/mcp-setup-guide.md)
- [Agents Sync Setup](../guides/sync/AGENTS_SYNC_SETUP.md)
- [Vercel AGENTS.md Pattern](https://vercel.com/blog/agents-md-outperforms-skills-in-our-agent-evals)

## Changelog

**2025-02-01:**

- ✅ Documentado `enableAgents: true` experimental flag
- ✅ Documentado `context.fileName` para memory files
- ✅ Explicado cómo agregar/cambiar archivos de memoria
- ✅ Confirmado que .agents/sync.sh --only=mcp preserva configuraciones
