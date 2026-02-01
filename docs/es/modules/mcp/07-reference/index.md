# Referencias MCP

Documentación técnica completa, especificaciones y recursos de referencia.

## Contenido

### 📋 Especificaciones

- **[Especificación del Protocolo](protocol-specification.md)**
  Detalles completos del protocolo JSON-RPC de MCP
  - Mensajería request/response
  - Notificaciones
  - Capability negotiation
  - Lifecycle del protocolo

- **[Comparación de Transportes](transport-comparison.md)**
  stdio vs SSE vs HTTP vs WebSocket
  - Ventajas y desventajas
  - Casos de uso ideales
  - Performance
  - Complejidad de implementación

### 🔒 Seguridad

- **[Checklist de Seguridad](security-checklist.md)**
  Mejores prácticas de seguridad para servidores MCP
  - Validación de entrada
  - Autenticación y autorización
  - Gestión de secretos
  - Rate limiting
  - Auditoría

### 🛠️ Configuración

- **[Schema de Configuración](configuration-schema.md)**
  Referencia JSON Schema para archivos de configuración
  - Campos obligatorios y opcionales
  - Tipos de datos
  - Validación
  - Ejemplos

### ❓ Ayuda

- **[Troubleshooting](troubleshooting.md)**
  Problemas comunes y soluciones
  - Errores de conexión
  - Problemas de autenticación
  - Performance issues
  - Debugging tips

- **[FAQ](faq.md)**
  Preguntas frecuentes sobre MCP
  - Conceptos básicos
  - Implementación
  - Deployment
  - Troubleshooting

- **[Glosario](glossary.md)**
  Terminología de MCP
  - Definiciones
  - Acrónimos
  - Conceptos clave

---

## Especificación del Protocolo

### Estructura de Mensajes

#### Request
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/list",
  "params": {}
}
```

#### Response
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "tools": [
      {
        "name": "tool-name",
        "description": "Tool description",
        "inputSchema": {
          "type": "object",
          "properties": {},
          "required": []
        }
      }
    ]
  }
}
```

#### Error
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "error": {
    "code": -32600,
    "message": "Invalid Request",
    "data": {
      "details": "..."
    }
  }
}
```

#### Notification
```json
{
  "jsonrpc": "2.0",
  "method": "notifications/progress",
  "params": {
    "progressToken": "token-123",
    "progress": 50,
    "total": 100
  }
}
```

Ver [especificación completa](protocol-specification.md).

---

## Comparación de Transportes

### stdio (Standard Input/Output)

**Ventajas:**
- ✅ Simple de implementar
- ✅ Sin configuración de red
- ✅ Ideal para desarrollo local
- ✅ Soportado por todas las plataformas

**Desventajas:**
- ❌ Solo local (no remoto)
- ❌ Un cliente por servidor
- ❌ Debugging más complejo

**Casos de uso:**
- Servidores locales
- Herramientas de línea de comandos
- Desarrollo y testing

**Ejemplo:**
```json
{
  "command": "node",
  "args": ["server.js"]
}
```

### SSE (Server-Sent Events)

**Ventajas:**
- ✅ Streaming unidireccional
- ✅ Servidor remoto
- ✅ Múltiples clientes
- ✅ Reconexión automática

**Desventajas:**
- ❌ Solo servidor → cliente
- ❌ Requiere HTTP endpoint
- ❌ Más complejo que stdio

**Casos de uso:**
- Notificaciones en tiempo real
- Actualizaciones de estado
- Logs streaming

**Ejemplo:**
```json
{
  "url": "https://api.example.com/sse",
  "transport": "sse"
}
```

### HTTP

**Ventajas:**
- ✅ Estándar web
- ✅ Fácil debugging (curl, Postman)
- ✅ Balanceo de carga
- ✅ Caching

**Desventajas:**
- ❌ No streaming
- ❌ Overhead de headers
- ❌ Latencia por request

**Casos de uso:**
- APIs REST tradicionales
- Integraciones con servicios web
- Operaciones no real-time

**Ejemplo:**
```json
{
  "url": "https://api.example.com/mcp",
  "transport": "http",
  "headers": {
    "Authorization": "Bearer ${TOKEN}"
  }
}
```

### WebSocket

**Ventajas:**
- ✅ Bidireccional
- ✅ Real-time
- ✅ Bajo overhead
- ✅ Streaming

**Desventajas:**
- ❌ Más complejo
- ❌ Requiere manejo de reconexión
- ❌ Soporte limitado (solo Claude Code)

**Casos de uso:**
- Comunicación real-time
- Aplicaciones colaborativas
- Streaming bidireccional

**Ejemplo:**
```json
{
  "url": "wss://api.example.com/mcp",
  "transport": "websocket"
}
```

Ver [comparación detallada](transport-comparison.md).

---

## Checklist de Seguridad

### ✅ Validación de Entrada

```typescript
// Validar parámetros de tool
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const schema = tools[request.params.name].inputSchema;

  // Validar con JSON Schema
  const valid = ajv.validate(schema, request.params.arguments);
  if (!valid) {
    throw new Error(`Invalid arguments: ${ajv.errorsText()}`);
  }

  // Sanitizar strings
  const sanitized = sanitizeInput(request.params.arguments);

  return await executeTool(request.params.name, sanitized);
});
```

### ✅ Autenticación y Autorización

```typescript
// Verificar token de autenticación
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const token = request.context?.authToken;

  if (!token) {
    throw new Error("Authentication required");
  }

  const user = await verifyToken(token);

  if (!hasPermission(user, request.params.name)) {
    throw new Error("Insufficient permissions");
  }

  return await executeTool(request);
});
```

### ✅ Gestión de Secretos

```typescript
// Nunca hardcodear secretos
// ❌ MAL
const API_KEY = "sk-1234567890";

// ✅ BIEN - Variables de entorno
const API_KEY = process.env.API_KEY;

// ✅ MEJOR - Secrets manager
const API_KEY = await secretsManager.getSecret("api-key");
```

### ✅ Rate Limiting

```typescript
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // límite de 100 requests
});

app.use("/mcp", limiter);
```

### ✅ Auditoría

```typescript
// Log todas las operaciones
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  audit.log({
    timestamp: new Date().toISOString(),
    userId: request.context?.userId,
    tool: request.params.name,
    arguments: request.params.arguments,
    ip: request.context?.ip
  });

  return await executeTool(request);
});
```

Ver [checklist completo](security-checklist.md).

---

## Schema de Configuración

### Estructura Base

```typescript
interface MCPConfig {
  mcpServers: {
    [serverName: string]: {
      // Requerido
      command: string;
      args?: string[];

      // Opcional
      env?: Record<string, string>;
      transport?: "stdio" | "sse" | "http" | "websocket";
      url?: string;

      // Autenticación
      oauth?: {
        provider: string;
        clientId: string;
        clientSecret: string;
        scopes?: string[];
      };

      // Filtrado
      includeTools?: string[];
      excludeTools?: string[];

      // Metadata
      description?: string;
      version?: string;
    };
  };
}
```

### Validación JSON Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["mcpServers"],
  "properties": {
    "mcpServers": {
      "type": "object",
      "patternProperties": {
        ".*": {
          "type": "object",
          "required": ["command"],
          "properties": {
            "command": {
              "type": "string",
              "description": "Command to execute"
            },
            "args": {
              "type": "array",
              "items": { "type": "string" }
            },
            "env": {
              "type": "object",
              "patternProperties": {
                ".*": { "type": "string" }
              }
            }
          }
        }
      }
    }
  }
}
```

Ver [schema completo](configuration-schema.md).

---

## Troubleshooting Rápido

### Servidor no se conecta

```bash
# 1. Verificar que el comando existe
which npx
which node

# 2. Probar el servidor manualmente
npx -y @upstash/context7-mcp

# 3. Revisar logs
# Claude Code
cat ~/.claude/logs/mcp.log

# Cursor
# Developer Tools > Console

# Gemini CLI
cat ~/.gemini/logs/mcp.log

# Antigravity
cat ~/.antigravity/logs/mcp.log
```

### OAuth falla

```bash
# 1. Verificar credenciales
echo $GOOGLE_CLIENT_ID
echo $GOOGLE_CLIENT_SECRET

# 2. Verificar scopes
# Asegurar que coinciden con lo requerido

# 3. Probar OAuth manualmente
gcloud auth application-default login
```

### Variables de entorno no funcionan

```bash
# 1. Verificar formato
# ✅ Correcto
"${VARIABLE_NAME}"

# ❌ Incorrecto
"$VARIABLE_NAME"
"{VARIABLE_NAME}"

# 2. Exportar variable
export VARIABLE_NAME="value"

# 3. Reiniciar cliente MCP
```

Ver [guía completa de troubleshooting](troubleshooting.md).

---

## FAQ Rápidas

**¿Puedo usar múltiples servidores MCP?**
Sí, puedes configurar tantos como necesites en `mcpServers`.

**¿Los servidores MCP requieren internet?**
No si usas stdio. SSE/HTTP sí requieren conectividad.

**¿Puedo crear mi propio servidor MCP?**
Sí, usa el [TypeScript SDK](../06-ecosystem-tools/sdks/typescript-sdk.md) o [Python SDK](../06-ecosystem-tools/sdks/python-sdk.md).

**¿MCP es gratis?**
El protocolo es open source. Los servidores pueden tener sus propios costos.

**¿Cómo depuro problemas de MCP?**
Usa [MCP Inspector](../06-ecosystem-tools/mcp-inspector.md) para testing interactivo.

Ver [FAQ completo](faq.md).

---

## Glosario Rápido

- **MCP**: Model Context Protocol
- **Tool**: Acción que el agente puede ejecutar
- **Resource**: Dato que el agente puede leer
- **Prompt**: Plantilla de conversación predefinida
- **Transport**: Método de comunicación (stdio, SSE, HTTP, WS)
- **Server**: Proceso que implementa MCP
- **Client**: Aplicación que consume MCP (Claude Code, Cursor, etc.)

Ver [glosario completo](glossary.md).

---

## Recursos Adicionales

### Especificaciones Oficiales
- [MCP Specification](https://spec.modelcontextprotocol.io)
- [JSON-RPC 2.0](https://www.jsonrpc.org/specification)
- [JSON Schema](https://json-schema.org/)

### Herramientas
- [MCP Inspector](../06-ecosystem-tools/mcp-inspector.md)
- [TypeScript SDK](../06-ecosystem-tools/sdks/typescript-sdk.md)
- [Python SDK](../06-ecosystem-tools/sdks/python-sdk.md)

### Comunidad
- [GitHub Discussions](https://github.com/modelcontextprotocol/discussions)
- [Discord](https://discord.gg/mcp)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/mcp)

---

**Navegación:** [← Herramientas](../06-ecosystem-tools/) | [Volver a MCP](../README.md) | [Módulos ↑](../../)
