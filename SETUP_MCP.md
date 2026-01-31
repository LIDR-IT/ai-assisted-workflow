# MCP Setup Guide

Este proyecto usa **Context7** como MCP server de referencia, con un sistema de sincronización centralizado para múltiples plataformas.

## Quick Start

### 1. Configurar API Key (Opcional)

```bash
# Obtener API key gratis
# Ir a: https://context7.com/dashboard

# Agregar a tu shell profile
echo 'export CONTEXT7_API_KEY="tu-api-key"' >> ~/.zshrc
source ~/.zshrc
```

### 2. Sincronizar Configuración

```bash
# Ejecutar script de sync
./.agents/mcp/sync-mcp.sh
```

Esto genera configs para:
- ✅ Cursor (`.cursor/mcp.json`)
- ✅ Claude Code (`.claude/mcp.json`)
- ✅ Gemini CLI (`.gemini/settings.json`)
- ⚠️ Antigravity (`.gemini/mcp_config.json` - solo referencia, requiere configuración manual global)

### 3. Verificar

**Cursor:**
- Abrir proyecto en Cursor
- Settings → MCP Servers
- Verificar "context7" aparece

**Claude Code:**
```bash
claude mcp list
```

**Gemini CLI:**
```bash
gemini /mcp
```

**Antigravity:**
⚠️ Requiere configuración manual en `~/.gemini/antigravity/mcp_config.json`
Ver: `docs/guides/mcp/ANTIGRAVITY_SETUP.md`

## Uso de Context7

Context7 proporciona documentación actualizada para frameworks y librerías.

**Ejemplos:**
```
@context7 How do I use React hooks?
@context7 What's new in Next.js 15?
@context7 Best practices for TypeScript
@context7 How to setup Tailwind CSS?
```

## Agregar Más MCP Servers

1. Editar `.agents/mcp/mcp-servers.json`:
```json
{
  "servers": {
    "nuevo-server": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "package-name"],
      "platforms": ["cursor", "claude", "gemini"]
    }
  }
}
```

2. Sincronizar:
```bash
./.agents/mcp/sync-mcp.sh
```

3. Commit:
```bash
git add .agents/mcp/ .cursor/ .claude/ .gemini/
git commit -m "feat: add nuevo-server MCP"
```

**Nota:** Antigravity requiere configuración manual global en `~/.gemini/antigravity/mcp_config.json` (no se versiona en git).

## Troubleshooting

**Ver:** `.agents/mcp/VALIDATION.md` para guía completa de validación y troubleshooting.

**Issues comunes:**
- Script falla: Instalar `jq` con `brew install jq`
- API key no encontrada: `export CONTEXT7_API_KEY="tu-key"`
- Server no aparece: Re-ejecutar sync y reiniciar aplicación

## Documentación

- **Source of Truth:** `.agents/mcp/mcp-servers.json`
- **Script:** `.agents/mcp/sync-mcp.sh`
- **Guía completa:** `.agents/mcp/README.md`
- **Validación:** `.agents/mcp/VALIDATION.md`
- **Docs MCP:** `docs/references/mcp/`

## Context7 Links

- [GitHub](https://github.com/upstash/context7)
- [Dashboard](https://context7.com/dashboard)
- [Documentation](https://upstash.com/docs/oss/context7/overview)
