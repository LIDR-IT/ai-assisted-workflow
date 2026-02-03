# MCP Configuration

Source of truth para configuración de MCP servers del proyecto.

## Quick Start

```bash
# 1. Configurar variables de entorno
export CONTEXT7_API_KEY="your-api-key"

# 2. Sincronizar configuración
./.agents/mcp/sync-mcp.sh

# 3. Verificar
claude mcp list
gemini mcp list
```

## Archivos

- **`mcp-servers.json`** - Source of truth de MCP servers
- **`sync-mcp.sh`** - Script de sincronización automática
- **`.env.example`** - Template de variables de entorno

## Servers Configurados

### Context7

Documentación actualizada para frameworks y librerías populares.

**Comando:** `npx -y @upstash/context7-mcp`
**Plataformas:** Cursor, Claude Code, Gemini CLI, Antigravity (global)

## Agregar Nuevo Server

1. Edita `mcp-servers.json`
2. Ejecuta `./sync-mcp.sh`
3. Commit cambios

## Plataformas Soportadas

| Plataforma      | Config                                  | Soporte Proyecto |
| --------------- | --------------------------------------- | ---------------- |
| **Cursor**      | `.cursor/mcp.json`                      | ✅               |
| **Claude Code** | `.claude/mcp.json`                      | ✅               |
| **Gemini CLI**  | `.gemini/settings.json`                 | ✅               |
| **Antigravity** | `~/.gemini/antigravity/mcp_config.json` | ⚠️ Solo global   |

## Documentación

- **Setup completo:** `docs/guides/mcp/mcp-setup-guide.md`
- **Antigravity setup:** `docs/guides/mcp/ANTIGRAVITY_SETUP.md`
- **Validación:** `docs/guides/mcp/VALIDATION.md`
- **Referencias técnicas:** `docs/references/mcp/`

## Troubleshooting

**Server no aparece:**

```bash
# Re-sincronizar
./.agents/mcp/sync-mcp.sh

# Verificar JSON válido
jq '.' .agents/mcp/mcp-servers.json
```

Ver `docs/guides/mcp/` para troubleshooting detallado.
