# Temas Avanzados de MCP

Configuraciones complejas, optimización y casos de uso empresariales.

## Contenido

### 🔄 Gestión de Múltiples Servidores

- **[Múltiples Servidores](multiple-servers.md)**
  Estrategias para manejar muchos servidores MCP
  - Organización de configuración
  - Naming conventions
  - Conflictos de nombres
  - Gestión de dependencias

### 🎯 Filtrado y Control

- **[Filtrado de Herramientas](tool-filtering.md)**
  Control granular con includeTools/excludeTools
  - Lista blanca de tools
  - Lista negra de tools
  - Patrones de filtrado
  - Casos de uso por contexto

### ⚡ Performance

- **[Optimización de Performance](performance.md)**
  Límites de tokens y optimización
  - Gestión de contexto
  - Caching de resultados
  - Lazy loading de recursos
  - Paginación de datos
  - Rate limiting

### 🔌 Transportes Personalizados

- **[Transportes Personalizados](custom-transports.md)**
  Más allá de stdio/SSE/HTTP
  - WebSocket custom
  - gRPC integration
  - Protocol buffers
  - Casos de uso especializados

### 🏢 Deployment Empresarial

- **[Enterprise Deployment](enterprise-deployment.md)**
  Despliegue a nivel organizacional
  - Managed MCP config
  - Políticas de seguridad
  - Auditoría y logging
  - Control de acceso (RBAC)
  - CI/CD para servidores MCP

---

## Escenarios Avanzados

### Arquitectura Multi-Servidor

```json
{
  "mcpServers": {
    // Servicios de datos
    "database": {
      "command": "npx",
      "args": ["-y", "@supabase/mcp-server-supabase"],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "${SUPABASE_TOKEN}"
      }
    },

    // Documentación
    "docs": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"],
      "env": {
        "CONTEXT7_API_KEY": "${CONTEXT7_KEY}"
      }
    },

    // Automatización
    "browser": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp"],
      "includeTools": ["navigate", "screenshot", "extract"]
    },

    // APIs externas
    "github": {
      "command": "npx",
      "args": ["-y", "@github/mcp-server"],
      "oauth": {
        "provider": "github",
        "scopes": ["repo", "user"]
      },
      "excludeTools": ["delete_repository"]
    }
  }
}
```

### Filtrado Contextual

```json
{
  "mcpServers": {
    "production-tools": {
      "command": "node",
      "args": ["prod-server.js"],
      "includeTools": [
        "read_metrics",
        "get_logs",
        "health_check"
      ],
      // Excluir operaciones peligrosas en producción
      "excludeTools": [
        "delete_*",
        "truncate_*",
        "drop_*"
      ]
    }
  }
}
```

### Performance con Caching

```typescript
// Ejemplo de servidor con caching
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { LRUCache } from "lru-cache";

const cache = new LRUCache({
  max: 500,
  ttl: 1000 * 60 * 5 // 5 minutos
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const cacheKey = JSON.stringify(request.params);

  // Verificar cache primero
  const cached = cache.get(cacheKey);
  if (cached) {
    return cached;
  }

  // Ejecutar operación costosa
  const result = await expensiveOperation(request.params);

  // Guardar en cache
  cache.set(cacheKey, result);

  return result;
});
```

### Transport Personalizado (WebSocket)

```typescript
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import WebSocket from "ws";

class WebSocketTransport {
  private ws: WebSocket;

  constructor(url: string) {
    this.ws = new WebSocket(url);
  }

  async send(message: any): Promise<void> {
    this.ws.send(JSON.stringify(message));
  }

  onMessage(handler: (message: any) => void): void {
    this.ws.on("message", (data) => {
      handler(JSON.parse(data.toString()));
    });
  }

  async close(): Promise<void> {
    this.ws.close();
  }
}

// Uso
const transport = new WebSocketTransport("wss://api.example.com/mcp");
await server.connect(transport);
```

---

## Enterprise Patterns

### Configuración Centralizada

```json
// Managed MCP config (Claude Code Enterprise)
{
  "organizationId": "acme-corp",
  "managedServers": {
    "internal-tools": {
      "command": "npx",
      "args": ["-y", "@acme/internal-mcp"],
      "env": {
        "API_ENDPOINT": "https://internal.acme.com/api"
      },
      "required": true,
      "userOverride": false
    }
  },
  "policies": {
    "allowUserServers": true,
    "requireApproval": true,
    "auditLogging": true
  }
}
```

### Auditoría y Logging

```typescript
// Servidor con auditoría completa
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const startTime = Date.now();
  const userId = request.context?.userId;

  // Log inicio
  audit.log({
    event: "tool_call_start",
    userId,
    tool: request.params.name,
    timestamp: new Date().toISOString()
  });

  try {
    const result = await executeTool(request);

    // Log éxito
    audit.log({
      event: "tool_call_success",
      userId,
      tool: request.params.name,
      duration: Date.now() - startTime,
      timestamp: new Date().toISOString()
    });

    return result;
  } catch (error) {
    // Log error
    audit.log({
      event: "tool_call_error",
      userId,
      tool: request.params.name,
      error: error.message,
      duration: Date.now() - startTime,
      timestamp: new Date().toISOString()
    });

    throw error;
  }
});
```

### RBAC (Role-Based Access Control)

```typescript
// Servidor con control de acceso
const permissions = {
  admin: ["*"],
  developer: ["read_*", "write_code", "run_tests"],
  viewer: ["read_*"]
};

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const userRole = request.context?.role || "viewer";
  const toolName = request.params.name;

  // Verificar permisos
  const allowed = permissions[userRole].some(pattern => {
    if (pattern === "*") return true;
    const regex = new RegExp(`^${pattern.replace("*", ".*")}$`);
    return regex.test(toolName);
  });

  if (!allowed) {
    throw new Error(`User role '${userRole}' not authorized for tool '${toolName}'`);
  }

  return await executeTool(request);
});
```

---

## Rate Limiting y Throttling

### Client-Side Rate Limiting

```typescript
import { RateLimiter } from "limiter";

const limiter = new RateLimiter({
  tokensPerInterval: 10,
  interval: "second"
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  // Esperar si excede el límite
  await limiter.removeTokens(1);

  return await executeTool(request);
});
```

### Server-Side Throttling

```typescript
// Throttle por usuario
const userThrottles = new Map();

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const userId = request.context?.userId;
  const throttle = userThrottles.get(userId) || {
    count: 0,
    resetAt: Date.now() + 60000
  };

  if (Date.now() > throttle.resetAt) {
    throttle.count = 0;
    throttle.resetAt = Date.now() + 60000;
  }

  if (throttle.count >= 100) {
    throw new Error("Rate limit exceeded. Try again later.");
  }

  throttle.count++;
  userThrottles.set(userId, throttle);

  return await executeTool(request);
});
```

---

## Paginación de Resultados

### Recursos con Paginación

```typescript
server.setRequestHandler(ListResourcesRequestSchema, async (request) => {
  const { cursor, pageSize = 50 } = request.params;

  const resources = await fetchResources({
    limit: pageSize,
    offset: cursor ? parseInt(cursor) : 0
  });

  return {
    resources,
    nextCursor: resources.length === pageSize
      ? String((cursor ? parseInt(cursor) : 0) + pageSize)
      : undefined
  };
});
```

---

## Monitoreo y Observabilidad

### Métricas con Prometheus

```typescript
import { register, Counter, Histogram } from "prom-client";

const toolCalls = new Counter({
  name: "mcp_tool_calls_total",
  help: "Total number of tool calls",
  labelNames: ["tool", "status"]
});

const toolDuration = new Histogram({
  name: "mcp_tool_duration_seconds",
  help: "Tool execution duration",
  labelNames: ["tool"]
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const end = toolDuration.startTimer({ tool: request.params.name });

  try {
    const result = await executeTool(request);
    toolCalls.inc({ tool: request.params.name, status: "success" });
    return result;
  } catch (error) {
    toolCalls.inc({ tool: request.params.name, status: "error" });
    throw error;
  } finally {
    end();
  }
});

// Endpoint de métricas
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});
```

---

## CI/CD para Servidores MCP

### GitHub Actions

```yaml
name: MCP Server CI/CD

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Test with MCP Inspector
        run: npx @modelcontextprotocol/inspector node dist/index.js

  publish:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'

      - name: Publish to npm
        run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

---

## Siguiente Paso

- Explora [Herramientas del Ecosistema](../06-ecosystem-tools/) para más utilidades
- Revisa [Referencias](../07-reference/) para detalles del protocolo
- Consulta [Guías de Plataforma](../04-platform-guides/) para implementación específica

---

**Navegación:** [← Guías de Plataforma](../04-platform-guides/) | [Volver a MCP](../README.md) | [Herramientas →](../06-ecosystem-tools/)
