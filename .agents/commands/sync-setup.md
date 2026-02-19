---
description: Sincroniza toda la configuración de AI (rules, skills, commands, agents, MCP, hooks)
allowed-tools: Bash
model: sonnet
---

# Workflow de Sincronización AI Setup

Ejecuta el proceso completo de sincronización de la configuración multi-agente.

## Tareas a realizar:

1. **Ejecutar sync.sh**
   - Sincroniza orchestrator desde `.agents/orchestrator/`
   - Sincroniza rules desde `.agents/rules/`
   - Sincroniza skills desde `.agents/skills/`
   - Sincroniza commands desde `.agents/commands/`
   - Sincroniza subagents desde `.agents/subagents/`
   - Sincroniza MCP configs desde `.agents/mcp/`
   - Sincroniza hooks desde `.agents/hooks/` (workflow automation)
     - **Cursor:** `auto-format.sh` (afterFileEdit)
     - **Claude/Gemini:** `protect-secrets.sh` + `auto-format.sh` + `notify.sh`
     - **Copilot:** `protect-secrets.sh` + `auto-format.sh`

2. **Verificar sincronización**
   - Verificar symlinks de Cursor, Claude, Gemini, Copilot
   - Verificar Antigravity native .agents/ detection
   - Mostrar resumen del estado

3. **Reportar resultado**
   - Indicar éxito o errores
   - Mostrar componentes sincronizados
   - Sugerir acciones si hay problemas

## Proceso:

Ejecuta los siguientes comandos en orden:

```bash
# 1. Ejecutar sincronización completa
./.agents/sync.sh

# 2. Verificar symlinks del orchestrator
ls -la AGENTS.md CLAUDE.md GEMINI.md

# 3. Verificar symlinks principales
ls -la .cursor/rules .cursor/skills .cursor/commands .cursor/agents
ls -la .claude/rules .claude/skills .claude/commands .claude/agents
ls -la .gemini/rules .gemini/skills .gemini/commands .gemini/agents
ls -la .github/rules .github/skills .github/prompts .github/agents

# 4. Verificar Antigravity (native .agents/ detection, no soporta subagents)
ls -la .agents/rules/ | head -5
ls -la .agents/skills/ | head -5
readlink .agents/workflows  # Should: commands

# 5. Verificar MCP configs existen
ls -la .cursor/mcp.json .claude/mcp.json .gemini/settings.json .vscode/mcp.json

# 6. Verificar hooks (git workflow automation)
ls -la .cursor/hooks/
ls -la .claude/hooks/
ls -la .gemini/hooks/
ls -la .github/hooks/

# 7. Validar configuraciones de hooks
jq . .cursor/hooks.json
jq .hooks .claude/settings.json
jq .hooks .gemini/settings.json
jq . .github/hooks/hooks.json
```

Presenta un resumen claro del resultado con:

- ✅ Componentes sincronizados exitosamente
- ⚠️ Advertencias si las hay
- ❌ Errores que requieran atención
- 📋 Siguiente paso recomendado (si aplica)

## Opciones avanzadas

El nuevo `sync.sh` soporta sync selectivo:

```bash
# Solo una plataforma
./.agents/sync.sh --platform=copilot

# Solo ciertos componentes
./.agents/sync.sh --only=rules,mcp

# Combinado
./.agents/sync.sh --platform=cursor,claude --only=rules

# Preview sin cambios
./.agents/sync.sh --dry-run

# Ayuda
./.agents/sync.sh --help
```

## ⚠️ IMPORTANTE - Antigravity

Si estás usando Antigravity, **cierra y reabre el proyecto** después del sync para que detecte los cambios.

**Limitaciones de Antigravity:**

- Hooks solo soportados a nivel global (`~/.gemini/antigravity/hooks/`), no a nivel proyecto
- Subagents no soportados (directorio `.agents/subagents/` no se sincroniza)
- MCP solo configuración global

**Workflow recomendado:**

1. Ejecutar sync: `./.agents/sync.sh`
2. Cerrar proyecto en Antigravity
3. Reabrir proyecto
4. Las rules actualizadas se cargarán automáticamente

## Hooks por Plataforma

| Hook                   | Claude Code     | Gemini CLI      | Copilot         | Cursor           |
| ---------------------- | --------------- | --------------- | --------------- | ---------------- |
| **protect-secrets.sh** | ✅ PreToolUse   | ✅ BeforeTool   | ✅ preToolUse   | ❌ No soportado  |
| **auto-format.sh**     | ✅ PostToolUse  | ✅ AfterTool    | ✅ postToolUse  | ✅ afterFileEdit |
| **notify.sh**          | ✅ Notification | ✅ Notification | ❌ No soportado | ❌ No soportado  |
