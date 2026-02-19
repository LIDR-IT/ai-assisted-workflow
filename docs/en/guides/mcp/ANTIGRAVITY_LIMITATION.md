# Antigravity MCP Limitation

## ⚠️ Antigravity NO Soporta MCP a Nivel de Proyecto

**Fecha:** Enero 2026
**Estado:** Limitación conocida de la plataforma

---

## El Problema

Antigravity actualmente **NO lee archivos de configuración MCP a nivel de proyecto**.

**No funciona:**

- `.gemini/mcp_config.json` (proyecto)
- Ningún archivo en el directorio del proyecto

**Sí funciona:**

- `~/.gemini/antigravity/mcp_config.json` (global/usuario)

---

## Por Qué Sucede Esto

Según la arquitectura actual de Antigravity:

- MCP servers se configuran SOLO a nivel de usuario
- No existe API para configuración por workspace
- Está en [discusión en el foro oficial](https://discuss.ai.google.dev/t/support-for-per-workspace-mcp-config-on-antigravity/111952)

---

## Solución Actual: Configuración Global

### Opción 1: Via UI (Recomendado)

1. Abre Antigravity
2. Click en sesión Agent → "..." (menú)
3. Selecciona "MCP Servers"
4. Click "Manage MCP Servers"
5. Click "View raw config"
6. Agrega tu configuración MCP

### Opción 2: Edición Manual

Edita directamente el archivo:

**macOS/Linux:**

```bash
~/.gemini/antigravity/mcp_config.json
```

**Windows:**

```
C:\Users\<USER_NAME>\.gemini\antigravity\mcp_config.json
```

**Ejemplo - Context7:**

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"],
      "env": {
        "CONTEXT7_API_KEY": "your-api-key"
      }
    }
  }
}
```

---

## Impacto en el Proyecto

### Lo que SÍ funciona con sync:

- ✅ Cursor (`.cursor/mcp.json`)
- ✅ Claude Code (`.claude/mcp.json`)
- ✅ Gemini CLI (`.gemini/settings.json`)

### Lo que NO funciona:

- ❌ Antigravity - requiere configuración manual global

---

## Script de Sync Actualizado

El script `.agents/sync.sh --only=mcp` ahora:

- ✅ Genera configuraciones para Cursor, Claude, Gemini CLI
- ⚠️ **Genera `.gemini/mcp_config.json` como referencia**
- ⚠️ Antigravity NO lo lee (solo para documentación)

---

## Estado de la Funcionalidad

**Actual (Enero 2026):**

- ❌ No soportado a nivel de proyecto
- ✅ Disponible solo a nivel global

**Futuro:**

- 🔄 En discusión en foros de Google
- 📝 Sin timeline confirmado

---

## Referencias

- [Forum: Support for per-workspace MCP config](https://discuss.ai.google.dev/t/support-for-per-workspace-mcp-config-on-antigravity/111952)
- [How to Add MCP Servers to Antigravity](https://lilys.ai/en/notes/google-antigravity-20260129/mcp-servers-antigravity-ide)
- [Antigravity MCP Documentation](https://antigravity.google/docs/mcp)

---

## Recomendación

**Para equipos que usan Antigravity:**

1. Documenta los MCP servers necesarios en el README del proyecto
2. Cada desarrollador debe configurarlos manualmente en su Antigravity
3. Considera usar `.gemini/mcp_config.json` como **referencia** (aunque no sea leído)
4. Monitorea el foro oficial para cuando se agregue soporte per-workspace
