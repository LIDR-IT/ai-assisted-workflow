# MCP Configuration

Este directorio contiene la configuración centralizada de MCP servers para el proyecto.

## Source of Truth

**`mcp-servers.json`** - Configuración única de todos los MCP servers del proyecto.

## Servers Configurados

### Context7

- **Descripción:** Documentación actualizada para frameworks y librerías populares
- **Package:** `@upstash/context7-mcp`
- **Tipo:** stdio (NPX)
- **Plataformas:** Cursor, Claude Code, Gemini CLI, Antigravity

## Setup

### 1. Configurar Variable de Entorno

Context7 requiere API key (opcional pero recomendado para higher rate limits):

```bash
# Agregar a tu ~/.zshrc o ~/.bashrc
export CONTEXT7_API_KEY="tu-api-key"

# Obtener API key gratis en: https://context7.com/dashboard
```

### 2. Sincronizar Configuración

```bash
# Ejecutar script de sincronización
./.agents/mcp/sync-mcp.sh
```

Esto genera los archivos de configuración específicos por plataforma:

- `.cursor/mcp.json` - Cursor
- `.claude/mcp.json` - Claude Code
- `.gemini/settings.json` - Gemini CLI
- `.gemini/mcp_config.json` - Antigravity (solo referencia)

**Nota:** El directorio `.gemini/` contiene DOS archivos MCP:

- `settings.json` es usado por **Gemini CLI** ✅
- `mcp_config.json` es **solo referencia** para Antigravity ⚠️

**⚠️ IMPORTANTE - Antigravity:**
Antigravity NO lee configuración MCP a nivel de proyecto. Solo usa `~/.gemini/antigravity/mcp_config.json` (global).

📖 **Guías:**

- `.agents/mcp/ANTIGRAVITY_SETUP.md` - Cómo configurar MCP en Antigravity
- `.agents/mcp/ANTIGRAVITY_LIMITATION.md` - Por qué existe esta limitación

### 3. Verificar Instalación

**Cursor:**

- Abrir Cursor
- Verificar que Context7 aparece en MCP servers

**Claude Code:**

```bash
claude mcp list
```

**Gemini CLI:**

```bash
gemini /mcp
```

## Agregar Nuevo MCP Server

1. Editar `mcp-servers.json`:

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

2. Ejecutar sync:

```bash
./.agents/mcp/sync-mcp.sh
```

3. Commit cambios:

```bash
git add .agents/mcp/ .cursor/ .claude/ .gemini/ .agent/
git commit -m "feat: add nuevo-server MCP"
```

## Uso de Context7

Context7 proporciona documentación actualizada. Ejemplo:

**En Cursor/Claude:**

```
@context7 How do I use React hooks?
@context7 What's new in Next.js 15?
@context7 Best practices for TypeScript
```

## Troubleshooting

**Server no aparece:**

```bash
# Verificar que NPX funciona
npx -y @upstash/context7-mcp --help

# Verificar variable de entorno
echo $CONTEXT7_API_KEY

# Re-sincronizar
./.agents/mcp/sync-mcp.sh
```

**Rate limit:**

- Obtener API key gratis en context7.com/dashboard
- Agregar a variables de entorno

## Referencias

- [Context7 GitHub](https://github.com/upstash/context7)
- [Context7 Dashboard](https://context7.com/dashboard)
- `docs/references/mcp/` - Documentación MCP por plataforma
