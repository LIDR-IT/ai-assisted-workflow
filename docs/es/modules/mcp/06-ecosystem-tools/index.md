# Herramientas del Ecosistema MCP

Herramientas, SDKs y recursos para desarrollar y usar servidores MCP.

## Contenido

### 🔍 Herramientas de Desarrollo

- **[MCP Inspector](mcp-inspector.md)**
  Herramienta de testing y debugging interactivo
  - Probar servidores localmente
  - Inspeccionar mensajes del protocolo
  - Validar schemas
  - Debugging en tiempo real

- **[MCP Registry](mcp-registry.md)**
  Directorio de servidores MCP disponibles
  - Buscar servidores existentes
  - Publicar tus servidores
  - Métricas de uso
  - Ratings y reviews

### 📚 SDKs Oficiales

- **[TypeScript SDK](sdks/typescript-sdk.md)**
  SDK oficial para TypeScript/JavaScript
  - Instalación y setup
  - API reference
  - Ejemplos completos
  - Best practices

- **[Python SDK](sdks/python-sdk.md)**
  SDK oficial para Python
  - Instalación y setup
  - API reference
  - Ejemplos completos
  - Best practices

### 🌐 Servidores Disponibles

- **[Catálogo de Servidores](available-servers.md)**
  Índice de servidores MCP comunes
  - Por categoría
  - Instrucciones de instalación
  - Casos de uso
  - Ejemplos de configuración

---

## MCP Inspector

### ¿Qué es?

MCP Inspector es una herramienta interactiva para testing y debugging de servidores MCP.

### Características

- ✅ Interfaz web interactiva
- ✅ Inspección de mensajes del protocolo
- ✅ Testing de tools, resources y prompts
- ✅ Validación de JSON schemas
- ✅ Logs en tiempo real

### Instalación

```bash
npm install -g @modelcontextprotocol/inspector
```

### Uso Básico

```bash
# Iniciar con servidor local
npx @modelcontextprotocol/inspector node dist/index.js

# Con servidor npm
npx @modelcontextprotocol/inspector npx -y @upstash/context7-mcp

# Con parámetros
npx @modelcontextprotocol/inspector node server.js --port 3000
```

### Interfaz

```
http://localhost:5173
┌─────────────────────────────────────┐
│ MCP Inspector                       │
├─────────────────────────────────────┤
│ Server: context7-mcp                │
│ Status: Connected ✅                │
├─────────────────────────────────────┤
│ Tools (5)                           │
│ ├─ search_docs                      │
│ ├─ get_code_example                 │
│ └─ ...                              │
│                                     │
│ Resources (2)                       │
│ ├─ docs://README                    │
│ └─ ...                              │
│                                     │
│ [Test Tool] [View Logs]             │
└─────────────────────────────────────┘
```

Ver [guía completa](mcp-inspector.md) para detalles.

---

## MCP Registry

### ¿Qué es?

Directorio oficial de servidores MCP publicados por la comunidad.

### Explorar Servidores

```bash
# Buscar en registry
npm search mcp-server

# Por categoría
# - Databases: @supabase/mcp-server-supabase
# - Documentation: @upstash/context7-mcp
# - Automation: @playwright/mcp
# - Cloud: @browserbasehq/mcp
```

### Publicar tu Servidor

1. **Preparar package.json**
```json
{
  "name": "@tuorg/mcp-server-tuservidor",
  "version": "1.0.0",
  "keywords": ["mcp", "mcp-server", "categoria"],
  "main": "dist/index.js",
  "bin": {
    "mcp-server-tuservidor": "dist/index.js"
  }
}
```

2. **Publicar en npm**
```bash
npm publish --access public
```

3. **Registrar en MCP**
```bash
# Crear PR en repositorio oficial
git clone https://github.com/modelcontextprotocol/registry
cd registry
# Agregar metadata de tu servidor
git add servers/tuservidor.json
git commit -m "Add tuservidor MCP server"
git push
```

Ver [guía completa](mcp-registry.md) para detalles.

---

## SDKs

### TypeScript SDK

```bash
npm install @modelcontextprotocol/sdk
```

**Características:**
- ✅ Type-safe APIs
- ✅ Soporte stdio, SSE, HTTP, WebSocket
- ✅ Helpers para tools, resources, prompts
- ✅ Validación automática de schemas

**Quick Example:**
```typescript
import { Server } from "@modelcontextprotocol/sdk/server/index.js";

const server = new Server({
  name: "my-server",
  version: "1.0.0"
});

// Tu código aquí...
```

Ver [documentación completa](sdks/typescript-sdk.md).

### Python SDK

```bash
pip install mcp
```

**Características:**
- ✅ Pythonic API
- ✅ Async/await support
- ✅ Type hints
- ✅ Decorators para tools

**Quick Example:**
```python
from mcp.server import Server

app = Server("my-server")

@app.call_tool()
async def call_tool(name: str, arguments: dict):
    # Tu código aquí...
    pass
```

Ver [documentación completa](sdks/python-sdk.md).

---

## Servidores Populares por Categoría

### 📊 Bases de Datos
```json
{
  "supabase": {
    "package": "@supabase/mcp-server-supabase",
    "description": "Supabase database access",
    "features": ["queries", "auth", "storage"]
  },
  "postgres": {
    "package": "@postgres/mcp-server",
    "description": "PostgreSQL direct access",
    "features": ["sql", "migrations"]
  }
}
```

### 📚 Documentación
```json
{
  "context7": {
    "package": "@upstash/context7-mcp",
    "description": "Library documentation search",
    "features": ["search", "examples", "api-reference"]
  }
}
```

### 🌐 Automatización Web
```json
{
  "playwright": {
    "package": "@playwright/mcp",
    "description": "Browser automation",
    "features": ["navigate", "screenshot", "extract"]
  },
  "browserbase": {
    "package": "@browserbasehq/mcp",
    "description": "Cloud browser automation",
    "features": ["stealth", "captcha", "proxy"]
  }
}
```

### ☁️ Cloud Services
```json
{
  "github": {
    "package": "@github/mcp-server",
    "description": "GitHub integration",
    "features": ["repos", "issues", "prs"]
  },
  "google-drive": {
    "package": "@google/drive-mcp",
    "description": "Google Drive access",
    "features": ["files", "search", "share"]
  }
}
```

Ver [catálogo completo](available-servers.md) para más opciones.

---

## Instalación Rápida de Servidores Comunes

### Context7 (Documentación)

```json
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

### Supabase (Database)

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase",
        "--access-token",
        "${SUPABASE_ACCESS_TOKEN}"
      ]
    }
  }
}
```

### Playwright (Browser)

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp"]
    }
  }
}
```

### GitHub

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@github/mcp-server"],
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}"
      }
    }
  }
}
```

---

## Recursos de la Comunidad

### Repositorios Oficiales
- [MCP GitHub](https://github.com/modelcontextprotocol) - Organización oficial
- [TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [Python SDK](https://github.com/modelcontextprotocol/python-sdk)
- [Inspector](https://github.com/modelcontextprotocol/inspector)

### Comunidad
- [Discord](https://discord.gg/mcp) - Chat de la comunidad
- [Reddit](https://reddit.com/r/mcp) - Discusiones
- [Stack Overflow](https://stackoverflow.com/questions/tagged/mcp) - Q&A
- [Awesome MCP](https://github.com/awesome-mcp/awesome-mcp) - Lista curada

### Blogs y Tutoriales
- [Official Blog](https://modelcontextprotocol.io/blog) - Anuncios y tutoriales
- [Dev.to #mcp](https://dev.to/t/mcp) - Artículos de la comunidad
- [YouTube](https://youtube.com/modelcontextprotocol) - Video tutoriales

---

## Herramientas de Terceros

### Desarrollo
- **mcp-dev-tools** - DevTools para desarrollo de servidores
- **mcp-test** - Framework de testing para MCP
- **mcp-lint** - Linter para configuraciones MCP

### Deployment
- **mcp-deploy** - CLI para deployment de servidores
- **docker-mcp** - Imágenes Docker para servidores MCP
- **k8s-mcp** - Helm charts para Kubernetes

### Monitoreo
- **mcp-monitor** - Dashboard de monitoreo
- **mcp-metrics** - Exportador de métricas Prometheus
- **mcp-trace** - Distributed tracing para MCP

---

## Siguiente Paso

- Prueba servidores con [MCP Inspector](mcp-inspector.md)
- Explora [SDKs](sdks/) para desarrollo
- Revisa [Servidores Disponibles](available-servers.md) para casos de uso
- Consulta [Referencias](../07-reference/) para detalles del protocolo

---

**Navegación:** [← Temas Avanzados](../05-advanced/) | [Volver a MCP](../README.md) | [Referencias →](../07-reference/)
