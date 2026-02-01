# Claude Code - Guía MCP

Documentación completa de MCP para Claude Code CLI.

## Contenido

### 📦 Instalación
- **Instalación básica** - Configurar Claude Code con MCP
- **Plugins** - Sistema de plugins nativo
- **Managed MCP** - Configuración empresarial

### ⚙️ Configuración
- **Archivo de configuración** - `.claude/mcp.json`
- **Scopes** - Local, Project, User
- **Variables de entorno** - Interpolación con ${VAR}

### 🔐 Autenticación
- **OAuth dinámico** - Soporte nativo
- **API Keys** - Gestión de credenciales

### 🛠️ Herramientas
- **MCP Inspector** - Testing y debugging
- **CLI Commands** - `claude mcp list`, etc.

---

## Quick Start

```bash
# 1. Instalar Claude Code
npm install -g @anthropic/claude-code

# 2. Configurar servidor MCP
mkdir -p .claude
cat > .claude/mcp.json << 'EOF'
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"],
      "env": {
        "CONTEXT7_API_KEY": "${CONTEXT7_API_KEY}"
      }
    }
  }
}
EOF

# 3. Configurar variable de entorno
export CONTEXT7_API_KEY="tu-api-key"

# 4. Verificar
claude mcp list
```

---

**Navegación:** [← Guías de Plataforma](../index.md) | [Volver a MCP](../../README.md)
