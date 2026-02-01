# Creando Servidores MCP

Guía completa para construir tus propios servidores MCP desde cero.

## Contenido

### 🎯 Primeros Pasos

- **[Iniciando](getting-started.md)**
  Investigación, planificación y diseño de tu servidor MCP
  - Identificar casos de uso
  - Elegir lenguaje (TypeScript vs Python)
  - Definir herramientas y recursos

### 🏗️ Estructura del Proyecto

- **[Configuración TypeScript](project-structure/typescript-setup.md)**
  Estructura de proyecto y configuración para servidores TS
  - Setup con SDK oficial
  - Estructura de carpetas
  - Configuración tsconfig.json

- **[Configuración Python](project-structure/python-setup.md)**
  Estructura de proyecto y configuración para servidores Python
  - Setup con SDK oficial
  - Estructura de carpetas
  - Gestión de dependencias

### 🛠️ Implementación

- **[Guía de Implementación](implementation-guide.md)**
  Construcción paso a paso de tu servidor MCP
  - Inicializar servidor
  - Registrar capacidades
  - Implementar handlers
  - Gestión de errores

- **[Herramientas y Schemas](tools-and-schemas.md)**
  Definir herramientas con JSON Schema para validación
  - Definir parámetros de tools
  - Validación con JSON Schema
  - Tipos de retorno
  - Manejo de errores

### ✅ Testing y Mejores Prácticas

- **[Testing](testing.md)**
  Workflow de pruebas con MCP Inspector
  - Pruebas locales
  - Debugging con Inspector
  - Pruebas de integración

- **[Mejores Prácticas](best-practices.md)**
  Guías para desarrollo de servidores de calidad
  - Patrones de diseño
  - Seguridad
  - Performance
  - Documentación

---

## Ruta de Desarrollo

### Fase 1: Planificación (getting-started.md)
1. **Define el propósito**
   - ¿Qué problema resuelve tu servidor?
   - ¿Qué herramientas/recursos necesitas?

2. **Elige la tecnología**
   - TypeScript: Mejor soporte de tipos, ecosistema Node.js
   - Python: Más simple, ideal para data science

3. **Diseña la interfaz**
   - Lista de tools a implementar
   - Schemas de parámetros
   - Recursos a exponer

### Fase 2: Setup (project-structure/)
1. **Crea el proyecto**
   ```bash
   # TypeScript
   npm create @modelcontextprotocol/server my-server

   # Python
   pip install mcp
   ```

2. **Estructura las carpetas**
   ```
   my-server/
   ├── src/
   │   ├── index.ts      # Entry point
   │   ├── tools/        # Tool implementations
   │   └── resources/    # Resource handlers
   ├── package.json
   └── tsconfig.json
   ```

### Fase 3: Implementación (implementation-guide.md)
1. **Inicializa el servidor**
   ```typescript
   import { Server } from "@modelcontextprotocol/sdk/server/index.js";

   const server = new Server({
     name: "my-server",
     version: "1.0.0"
   });
   ```

2. **Registra herramientas**
   ```typescript
   server.setRequestHandler(ListToolsRequestSchema, async () => ({
     tools: [{
       name: "mi-herramienta",
       description: "Descripción clara",
       inputSchema: { /* JSON Schema */ }
     }]
   }));
   ```

3. **Implementa handlers**
   ```typescript
   server.setRequestHandler(CallToolRequestSchema, async (request) => {
     // Implementación de la herramienta
   });
   ```

### Fase 4: Testing (testing.md)
1. **Pruebas con Inspector**
   ```bash
   npx @modelcontextprotocol/inspector node dist/index.js
   ```

2. **Prueba cada tool**
   - Casos normales
   - Casos edge
   - Manejo de errores

### Fase 5: Publicación
1. **Documenta tu servidor**
   - README con ejemplos
   - Listado de tools y resources
   - Instrucciones de instalación

2. **Publica en npm** (TypeScript)
   ```bash
   npm publish
   ```

3. **Registra en MCP Registry**
   - Envía PR a repositorio oficial
   - Incluye metadata y ejemplos

---

## Ejemplos de Código

### Servidor Básico (TypeScript)

```typescript
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const server = new Server({
  name: "ejemplo-server",
  version: "1.0.0",
}, {
  capabilities: {
    tools: {},
  },
});

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [{
    name: "saludar",
    description: "Saluda a una persona",
    inputSchema: {
      type: "object",
      properties: {
        nombre: {
          type: "string",
          description: "Nombre de la persona"
        }
      },
      required: ["nombre"]
    }
  }]
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "saludar") {
    const nombre = String(request.params.arguments?.nombre);
    return {
      content: [{
        type: "text",
        text: `¡Hola, ${nombre}!`
      }]
    };
  }
  throw new Error("Herramienta no encontrada");
});

const transport = new StdioServerTransport();
await server.connect(transport);
```

### Servidor Básico (Python)

```python
from mcp.server import Server
from mcp.types import Tool, TextContent

app = Server("ejemplo-server")

@app.list_tools()
async def list_tools() -> list[Tool]:
    return [
        Tool(
            name="saludar",
            description="Saluda a una persona",
            inputSchema={
                "type": "object",
                "properties": {
                    "nombre": {
                        "type": "string",
                        "description": "Nombre de la persona"
                    }
                },
                "required": ["nombre"]
            }
        )
    ]

@app.call_tool()
async def call_tool(name: str, arguments: dict) -> list[TextContent]:
    if name == "saludar":
        nombre = arguments["nombre"]
        return [TextContent(
            type="text",
            text=f"¡Hola, {nombre}!"
        )]
    raise ValueError(f"Herramienta no encontrada: {name}")
```

---

## Recursos y SDKs

### SDKs Oficiales
- [TypeScript SDK](../06-ecosystem-tools/sdks/typescript-sdk.md) - SDK oficial para TypeScript/JavaScript
- [Python SDK](../06-ecosystem-tools/sdks/python-sdk.md) - SDK oficial para Python

### Herramientas de Desarrollo
- [MCP Inspector](../06-ecosystem-tools/mcp-inspector.md) - Testing y debugging interactivo
- [MCP Registry](../06-ecosystem-tools/mcp-registry.md) - Encuentra y publica servidores

### Ejemplos de Servidores
- [Servidores Disponibles](../06-ecosystem-tools/available-servers.md) - Código de ejemplo de la comunidad

---

## Mejores Prácticas Rápidas

### Diseño de Herramientas
✅ **HACER:**
- Nombres descriptivos y claros
- Descripciones detalladas
- JSON Schemas completos
- Validación de entrada

❌ **EVITAR:**
- Nombres genéricos ("tool1", "process")
- Descripciones vagas
- Parámetros sin validar
- Errores sin contexto

### Seguridad
✅ **HACER:**
- Validar toda entrada del usuario
- Limitar acceso a archivos/red
- Usar variables de entorno para secretos
- Registrar operaciones sensibles

❌ **EVITAR:**
- Ejecutar comandos sin validar
- Hardcodear credenciales
- Acceso ilimitado a filesystem
- Operaciones sin rate limiting

### Performance
✅ **HACER:**
- Cachear resultados cuando sea posible
- Usar async/await apropiadamente
- Implementar timeouts
- Paginar resultados grandes

❌ **EVITAR:**
- Operaciones síncronas bloqueantes
- Cargar datos grandes en memoria
- Bucles infinitos
- Operaciones sin timeout

---

## Siguiente Paso

Después de crear tu servidor:
- Consulta [Guías de Plataforma](../04-platform-guides/) para integrarlo
- Revisa [Temas Avanzados](../05-advanced/) para optimización
- Usa [MCP Inspector](../06-ecosystem-tools/mcp-inspector.md) para debugging

---

**Navegación:** [← Usando MCP](../02-using-mcp/) | [Volver a MCP](../README.md) | [Guías de Plataforma →](../04-platform-guides/)
