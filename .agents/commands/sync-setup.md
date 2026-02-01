---
description: Sincroniza toda la configuración de AI (rules, skills, commands, agents, MCP)
allowed-tools: Bash
model: sonnet
---

# Workflow de Sincronización AI Setup

Ejecuta el proceso completo de sincronización de la configuración multi-agente.

## Tareas a realizar:

1. **Ejecutar sync-all.sh**
   - Sincroniza rules desde `.agents/rules/`
   - Sincroniza skills desde `.agents/skills/`
   - Sincroniza commands desde `.agents/commands/`
   - Sincroniza agents desde `.agents/agents/`
   - Sincroniza MCP configs desde `.agents/mcp/`

2. **Verificar sincronización**
   - Verificar symlinks de Cursor, Claude, Gemini
   - Verificar symlinks selectivos de Antigravity
   - Mostrar resumen del estado

3. **Reportar resultado**
   - Indicar éxito o errores
   - Mostrar componentes sincronizados
   - Sugerir acciones si hay problemas

## Proceso:

Ejecuta los siguientes comandos en orden:

```bash
# 1. Ejecutar sincronización completa
./.agents/sync-all.sh

# 2. Verificar symlinks principales
ls -la .cursor/rules .cursor/skills .cursor/commands .cursor/agents
ls -la .claude/rules .claude/skills .claude/commands .claude/agents
ls -la .gemini/rules .gemini/skills .gemini/commands .gemini/agents

# 3. Verificar Antigravity (no soporta agents)
ls -la .agent/rules/ | grep "\->"
ls -la .agent/skills/ | grep "\->"
ls -la .agent/workflows/ | grep "\->"

# 4. Verificar MCP configs existen
ls -la .cursor/mcp.json .claude/mcp.json .gemini/settings.json
```

Presenta un resumen claro del resultado con:
- ✅ Componentes sincronizados exitosamente
- ⚠️ Advertencias si las hay
- ❌ Errores que requieran atención
- 📋 Siguiente paso recomendado (si aplica)

## ⚠️ IMPORTANTE - Antigravity

Si estás usando Antigravity, **cierra y reabre el proyecto** después del sync para que detecte los cambios.

**Por qué:** Antigravity carga las rules en memoria al inicio y solo detecta cambios en archivos que se modifican DESPUÉS de haberlos cargado. El sync actualiza timestamps, pero Antigravity ya tiene las rules cacheadas.

**Workflow recomendado:**
1. Ejecutar sync: `./.agents/sync-all.sh`
2. Cerrar proyecto en Antigravity
3. Reabrir proyecto
4. Las rules actualizadas se cargarán automáticamente
