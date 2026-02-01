# Fundamentos de MCP

Comprende los conceptos básicos del Model Context Protocol y cómo funciona.

## Contenido

### 📖 Conceptos Básicos

- **[¿Qué es MCP?](what-is-mcp.md)**
  Introducción al protocolo, casos de uso y beneficios principales

- **[Arquitectura del Protocolo](protocol-architecture.md)**
  Cómo está estructurado MCP: cliente-servidor, transporte y mensajería

- **[Primitivas Básicas](core-primitives.md)**
  Herramientas (Tools), Recursos (Resources) y Prompts - los bloques de construcción de MCP

- **[Ciclo de Vida](lifecycle.md)**
  Cómo se conectan, inicializan y comunican clientes y servidores

---

## Ruta de Aprendizaje

### Nivel 1: Conceptos
1. Empieza con [¿Qué es MCP?](what-is-mcp.md) para entender el propósito
2. Lee [Arquitectura del Protocolo](protocol-architecture.md) para ver cómo funciona

### Nivel 2: Componentes
3. Aprende las [Primitivas Básicas](core-primitives.md) - Tools, Resources, Prompts
4. Comprende el [Ciclo de Vida](lifecycle.md) de una conexión MCP

### Siguiente Paso
Una vez que domines los fundamentos, continúa con:
- [Usando MCP](../02-using-mcp/) - Instalar y configurar servidores MCP
- [Creando Servidores](../03-creating-servers/) - Construir tus propios servidores MCP

---

## Preguntas Frecuentes

**¿Necesito conocimientos de programación para usar MCP?**
No para usar servidores existentes. Solo necesitas entender cómo configurar archivos JSON. Para crear servidores, necesitarás conocimientos de TypeScript o Python.

**¿MCP funciona con cualquier modelo de IA?**
MCP es un estándar abierto, pero la implementación depende de cada plataforma. Claude Code, Cursor, Gemini CLI y Antigravity tienen soporte nativo.

**¿Cuál es la diferencia entre Tools, Resources y Prompts?**
- **Tools**: Acciones que el agente puede ejecutar
- **Resources**: Datos que el agente puede leer
- **Prompts**: Plantillas de conversación predefinidas

---

**Navegación:** [← Volver a MCP](../README.md) | [Usando MCP →](../02-using-mcp/)
