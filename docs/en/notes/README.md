# Project Notes

Este directorio contiene notas de investigación, análisis y decisiones tomadas durante el desarrollo del proyecto.

## Índice de Notas

### Agent Development

#### [Agent Format Cross-Platform Analysis](./agent-format-cross-platform-analysis.md)

**Fecha:** 2025-02-01

Análisis completo de formatos de agents/subagents entre Claude Code, Gemini CLI y Cursor.

**Temas clave:**

- Campos transversales (todas las plataformas)
- Campo crítico `skills` de Claude (knowledge injection)
- Campos útiles `temperature` y `max_turns` de Gemini
- Formato estándar adoptado
- Decisiones de diseño y razones

**Hallazgo principal:**
El campo `skills` de Claude permite precargar conocimiento especializado en el contexto del agent, similar al patrón AGENTS.md de Vercel.

---

#### [Agents vs Skills](./agents-vs-skills.md)

Comparación entre usar agents y skills para diferentes casos de uso.

**Temas:**

- Cuándo usar agents
- Cuándo usar skills
- Patterns de combinación

---

### Platform-Specific Features

#### [Gemini Experimental Features](./gemini-experimental-features.md)

**Fecha:** 2025-02-01

Configuraciones experimentales y características especiales de Gemini CLI.

**Temas clave:**

- `experimental.enableAgents: true` - Habilita subagents
- `context.fileName` - Archivos de memoria (AGENTS.md, CONTEXT.md)
- Cómo agregar/cambiar archivos de memoria
- Preservación de configs en sync

**Hallazgo principal:**
Gemini puede cargar archivos de contexto automáticamente (memory files) como AGENTS.md, similar al patrón de Vercel.

---

#### [Antigravity Agent Modes Settings](./antigravity-agent-modes-settings.md)

Configuraciones específicas de Antigravity y sus modos de operación.

**Temas:**

- Modos de agent
- Limitaciones de Antigravity
- Configuración específica

---

### Multi-Platform Compatibility

#### [Command Platform Differences](./command-platform-differences.md)

Diferencias entre plataformas en el manejo de comandos.

**Temas:**

- Formatos de comandos por plataforma
- Conversión TOML (Gemini)
- Symlinks vs copias
- Workflows en Antigravity

---

#### [Skills Installation and MCP Comparison](./skills-installation-and-mcp-comparison.md)

Comparación entre skills tradicionales y MCP servers.

**Temas:**

- Skills vs MCP servers
- Cuándo usar cada uno
- Instalación y configuración
- Trade-offs

---

## Cómo Usar las Notas

### Para Developers

**Antes de implementar features:**

1. Revisa notas relacionadas para entender decisiones previas
2. Lee análisis de compatibilidad cross-platform
3. Verifica patterns establecidos

**Después de investigación:**

1. Documenta hallazgos en nueva nota
2. Actualiza este índice
3. Referencia decisiones en código/docs

### Para Team Leads

**Planning:**

- Consulta notas para entender trade-offs
- Revisa decisiones arquitectónicas
- Identifica deuda técnica documentada

**Onboarding:**

- Asigna notas relevantes como lectura
- Usa notas para explicar "por qué" de decisiones
- Referencia patterns establecidos

## Estructura de una Nota

Las notas siguen este formato:

```markdown
# Título de la Nota

**Fecha:** YYYY-MM-DD
**Objetivo:** Qué investiga/resuelve esta nota

## Hallazgos Clave

Insights principales descubiertos.

## Análisis Detallado

Deep dive en el tema.

## Decisiones Tomadas

Qué decidimos y por qué.

## Lecciones Aprendidas

Qué aprendimos del proceso.

## Referencias

- Links a documentación
- PRs relacionados
- Otros recursos
```

## Categorías de Notas

### 🔍 Investigación

Análisis de opciones, comparaciones, exploraciones.

**Ejemplos:**

- agent-format-cross-platform-analysis.md
- skills-installation-and-mcp-comparison.md
- command-platform-differences.md

### 📋 Decisiones

Decisiones arquitectónicas y sus razones.

**Ejemplos:**

- Usar skills en formato estándar
- Copias vs symlinks para Gemini
- Source of truth centralizado

### 💡 Hallazgos

Descubrimientos importantes, features útiles.

**Ejemplos:**

- Campo `skills` de Claude
- Memory files de Gemini
- Limitaciones de Antigravity

### ⚙️ Configuraciones

Settings y configs específicas de plataforma.

**Ejemplos:**

- gemini-experimental-features.md
- antigravity-agent-modes-settings.md

## Timeline de Notas

### 2025-02-01

- **agent-format-cross-platform-analysis.md** - Análisis completo cross-platform
- **gemini-experimental-features.md** - Features experimentales Gemini

### Anteriores

- **agents-vs-skills.md** - Comparación agents vs skills
- **command-platform-differences.md** - Diferencias de comandos
- **skills-installation-and-mcp-comparison.md** - Skills vs MCP
- **antigravity-agent-modes-settings.md** - Configs Antigravity

## Notas por Plataforma

### Claude Code

- [Agent Format Analysis](./agent-format-cross-platform-analysis.md) - Campo `skills`
- [Agents vs Skills](./agents-vs-skills.md) - Cuándo usar cada uno

### Gemini CLI

- [Gemini Experimental Features](./gemini-experimental-features.md) - enableAgents, memory files
- [Agent Format Analysis](./agent-format-cross-platform-analysis.md) - temperature, max_turns

### Cursor

- [Agent Format Analysis](./agent-format-cross-platform-analysis.md) - Compatibilidad
- [Command Platform Differences](./command-platform-differences.md) - Comandos

### Antigravity

- [Antigravity Agent Modes](./antigravity-agent-modes-settings.md) - Configuraciones
- [Command Platform Differences](./command-platform-differences.md) - Workflows

## Referencias Relacionadas

### Documentación del Proyecto

- [Agent Format Standard](../references/agents/AGENT_FORMAT_STANDARD.md)
- [Platform Comparison](../references/agents/PLATFORM_COMPARISON.md)
- [Agents README](../../.agents/agents/README.md)

### Documentación Externa

- [Claude Code Docs](https://code.claude.com/docs)
- [Gemini CLI Docs](https://geminicli.com/docs)
- [Cursor Docs](https://cursor.com/docs)
- [Vercel AGENTS.md Pattern](https://vercel.com/blog/agents-md-outperforms-skills-in-our-agent-evals)

## Contribuir

### Crear Nueva Nota

1. **Nombre del archivo:** `kebab-case-description.md`
2. **Ubicación:** `docs/notes/`
3. **Formato:** Seguir estructura estándar
4. **Fecha:** Incluir fecha de creación
5. **Índice:** Actualizar este README

### Actualizar Nota Existente

1. Agregar fecha de actualización
2. Marcar secciones obsoletas
3. Referenciar cambios en commits

### Best Practices

- **Conciso pero completo:** Balance entre detalle y brevedad
- **Decisiones documentadas:** Explicar el "por qué"
- **Referencias:** Link a fuentes y docs
- **Ejemplos:** Incluir code samples cuando sea útil
- **Timeline:** Mantener cronología de decisiones
