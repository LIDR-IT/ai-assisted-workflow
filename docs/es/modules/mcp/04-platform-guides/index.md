# Guías de Plataforma

Documentación específica para cada plataforma que soporta MCP.

## Plataformas Disponibles

### 🤖 [Claude Code](claude-code/)
La CLI oficial de Anthropic con soporte MCP nativo
- Plugins y skills
- Configuración multi-scope
- OAuth dinámico
- Managed MCP para empresas

### 📝 [Cursor](cursor/)
Editor de código con IA y soporte MCP
- Integración con extensiones
- API de extensión
- Debugging de servidores
- Configuración local/proyecto

### 💎 [Gemini CLI](gemini-cli/)
CLI de Google con capacidades MCP avanzadas
- OAuth con Google Cloud
- Contenido rico (imágenes, audio)
- Configuración global/proyecto
- Integración con servicios Google

### 🌀 [Antigravity](antigravity/)
IDE con MCP Store integrado
- UI para gestión de servidores
- Solo configuración global
- Instalación desde MCP Store
- Integración con Google Cloud

---

## Comparativa Rápida

| Característica | Claude Code | Cursor | Gemini CLI | Antigravity |
|----------------|-------------|--------|------------|-------------|
| **Tipo** | CLI | IDE | CLI | IDE |
| **Transporte** | stdio, SSE, HTTP, WS | stdio, SSE, HTTP | stdio, SSE, HTTP | stdio, SSE |
| **Config File** | `.claude/mcp.json` | `.cursor/mcp.json` | `.gemini/settings.json` | `mcp_config.json` |
| **Scopes** | Local/Project/User | Local/Project | Global/Project | Solo Global |
| **OAuth** | ✅ Dinámico | ✅ Estático | ✅ Google/Dinámico | ✅ Dinámico |
| **Plugin System** | ✅ Nativo | ✅ Extensions | ❌ | ❌ |
| **MCP Store** | ❌ | ❌ | ❌ | ✅ UI Store |
| **Managed Config** | ✅ Enterprise | ❌ | ❌ | ❌ |
| **Rich Content** | ✅ | ✅ | ✅ Avanzado | ✅ |

---

## Eligiendo una Plataforma

### Usa Claude Code si:
- Necesitas workflow de CLI
- Quieres integración con plugins
- Trabajas en empresas (managed MCP)
- Prefieres configuración por proyecto

### Usa Cursor si:
- Prefieres un IDE completo
- Necesitas debugging visual
- Quieres extensiones personalizadas
- Trabajas principalmente con código

### Usa Gemini CLI si:
- Necesitas integración con Google Cloud
- Trabajas con contenido multimedia
- Requieres OAuth con servicios Google
- Prefieres CLI con capacidades avanzadas

### Usa Antigravity si:
- Quieres instalación visual (MCP Store)
- Prefieres UI sobre configuración manual
- No necesitas configuración por proyecto
- Buscas simplicidad de uso

---

## Instalación Básica por Plataforma

### Claude Code

```bash
# 1. Instalar Claude Code
npm install -g @anthropic/claude-code

# 2. Configurar servidor MCP
cat > .claude/mcp.json << 'EOF'
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"]
    }
  }
}
EOF

# 3. Verificar
claude mcp list
```

### Cursor

```json
// .cursor/mcp.json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"]
    }
  }
}
```

Ver [Guía Cursor](cursor/) para configuración completa.

### Gemini CLI

```json
// .gemini/settings.json
{
  "mcp_servers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"]
    }
  }
}
```

Ver [Guía Gemini CLI](gemini-cli/) para detalles de OAuth.

### Antigravity

1. Abre Antigravity
2. Ve a MCP Store (UI)
3. Busca e instala servidores
4. O edita `~/.gemini/antigravity/mcp_config.json`

Ver [Guía Antigravity](antigravity/) para limitaciones.

---

## Características Específicas

### OAuth por Plataforma

#### Claude Code - OAuth Dinámico
```json
{
  "mcpServers": {
    "google-service": {
      "command": "npx",
      "args": ["-y", "google-mcp-server"],
      "oauth": {
        "provider": "google",
        "clientId": "${GOOGLE_CLIENT_ID}",
        "clientSecret": "${GOOGLE_CLIENT_SECRET}"
      }
    }
  }
}
```

#### Cursor - OAuth Estático
```json
{
  "mcpServers": {
    "google-service": {
      "command": "npx",
      "args": ["-y", "google-mcp-server"],
      "env": {
        "GOOGLE_ACCESS_TOKEN": "ya29.xxx"
      }
    }
  }
}
```

#### Gemini CLI - OAuth Google Cloud
```bash
gcloud auth application-default login
```

#### Antigravity - OAuth Dinámico
Configuración a través de UI o similar a Claude Code.

---

## Soporte de Transporte

### stdio (Local)
✅ Soportado por todas las plataformas
- Mejor para servidores locales
- Comunicación por stdin/stdout
- Sin configuración de red

```json
{
  "command": "node",
  "args": ["server.js"]
}
```

### SSE (Server-Sent Events)
✅ Soportado por todas las plataformas
- Para servidores remotos
- Streaming unidireccional
- Ideal para notificaciones

```json
{
  "url": "https://api.example.com/sse",
  "transport": "sse"
}
```

### HTTP
✅ Claude Code, Cursor, Gemini CLI
⚠️ Antigravity: Solo con workaround
- APIs REST estándar
- Request/response tradicional

```json
{
  "url": "https://api.example.com/mcp",
  "transport": "http"
}
```

### WebSocket
✅ Solo Claude Code (experimental)
- Bidireccional
- Real-time
- Más complejo

---

## Debugging por Plataforma

### Claude Code
```bash
# Logs del servidor
claude --debug mcp list

# Inspector
npx @modelcontextprotocol/inspector npx -y @upstash/context7-mcp
```

### Cursor
1. Abrir Developer Tools (Cmd+Shift+I)
2. Revisar Console para logs MCP
3. Extensions > MCP > Ver estado de servidores

### Gemini CLI
```bash
# Modo verbose
gemini --verbose

# Logs del sistema
tail -f ~/.gemini/logs/mcp.log
```

### Antigravity
1. MCP Store > Servidor > Ver Logs
2. O revisar `~/.antigravity/logs/`

---

## Recursos de Plataforma

### Documentación Oficial
- [Claude Code Docs](https://docs.anthropic.com/claude-code)
- [Cursor MCP Docs](https://cursor.sh/mcp)
- [Gemini CLI Docs](https://ai.google.dev/gemini-api/docs/cli)
- [Antigravity MCP Store](https://antigravity.dev/mcp)

### Ejemplos de Configuración
Cada guía de plataforma incluye:
- Configuración completa
- Ejemplos de uso
- Troubleshooting específico
- Mejores prácticas

---

## Siguiente Paso

Selecciona tu plataforma y sigue la guía correspondiente:
- [Claude Code →](claude-code/)
- [Cursor →](cursor/)
- [Gemini CLI →](gemini-cli/)
- [Antigravity →](antigravity/)

O explora:
- [Temas Avanzados](../05-advanced/) - Configuraciones complejas
- [Herramientas](../06-ecosystem-tools/) - MCP Inspector y Registry

---

**Navegación:** [← Crear Servidores](../03-creating-servers/) | [Volver a MCP](../README.md) | [Temas Avanzados →](../05-advanced/)
