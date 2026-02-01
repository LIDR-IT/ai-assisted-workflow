# Antigravity - Guía MCP

Documentación completa de MCP para Antigravity IDE.

## Contenido

### 📦 Instalación
- **MCP Store** - Instalación visual de servidores
- **Configuración manual** - Editar `mcp_config.json`
- **Limitaciones** - Solo configuración global

### ⚙️ Configuración
- **Archivo de configuración** - `~/.gemini/antigravity/mcp_config.json`
- **Scopes** - Solo Global (no soporta proyecto)
- **Variables de entorno** - Interpolación ${VAR}

### 🔐 Autenticación
- **OAuth dinámico** - Soporte nativo
- **Google Cloud** - Integración GCP
- **API Keys** - Gestión en config

### 🏪 MCP Store
- **Búsqueda** - Explorar servidores disponibles
- **Instalación** - Un click para instalar
- **Gestión** - UI para habilitar/deshabilitar

---

## Quick Start

### Opción 1: MCP Store (Recomendado)

1. Abre Antigravity
2. Ve a MCP Store (icono en sidebar)
3. Busca "Context7"
4. Click en "Install"
5. Configura API key en el diálogo

### Opción 2: Configuración Manual

```json
// ~/.gemini/antigravity/mcp_config.json
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
```

Luego reinicia Antigravity.

---

## ⚠️ Limitaciones

- **No soporta configuración por proyecto** - Solo global
- **HTTP transport limitado** - Requiere workarounds
- **No plugin system** - Sin extensiones personalizadas

Ver documentación de limitaciones para detalles.

---

**Navegación:** [← Guías de Plataforma](../index.md) | [Volver a MCP](../../README.md)
