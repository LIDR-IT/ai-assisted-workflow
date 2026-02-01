# Cursor - Guía MCP

Documentación completa de MCP para Cursor IDE.

## Contenido

### 📦 Instalación
- **Configuración básica** - Setup de MCP en Cursor
- **Extensiones** - Sistema de extensiones
- **API de extensión** - Desarrollar extensiones MCP

### ⚙️ Configuración
- **Archivo de configuración** - `.cursor/mcp.json`
- **Scopes** - Local, Project
- **Variables de entorno** - Soporte de ${VAR}

### 🔐 Autenticación
- **OAuth estático** - Configuración manual
- **API Keys** - Gestión en config

### 🐛 Debugging
- **Developer Tools** - Chrome DevTools integrado
- **Extension debugging** - Debug de servidores MCP
- **Logs** - Acceso a logs del sistema

---

## Quick Start

```json
// .cursor/mcp.json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"],
      "env": {
        "CONTEXT7_API_KEY": "tu-api-key"
      }
    }
  }
}
```

Luego reinicia Cursor y verifica en Extensions > MCP.

---

**Navegación:** [← Guías de Plataforma](../index.md) | [Volver a MCP](../../README.md)
