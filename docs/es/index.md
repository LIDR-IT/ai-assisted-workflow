---
layout: home

hero:
  name: LIDR
  text: Documentación Interna
  tagline: Best practices, guías y referencias del equipo
  actions:
    - theme: brand
      text: Comenzar
      link: /es/modules/skills/
    - theme: alt
      text: Ver Guías
      link: /es/guides/

features:
  - icon: 🎓
    title: Módulos de Aprendizaje
    details: Documentación estructurada sobre Skills, MCP, Agents y más
    link: /es/modules/skills/

  - icon: 📚
    title: Guías Paso a Paso
    details: Instrucciones detalladas para configurar y usar las herramientas del equipo
    link: /es/guides/

  - icon: 📖
    title: Referencias Técnicas
    details: Documentación técnica de agents, MCP servers, y herramientas de desarrollo
    link: /es/references/

  - icon: ✨
    title: Guidelines
    details: Estándares de código, diseño y convenciones del equipo
    link: /es/guidelines/

  - icon: 🔬
    title: Notas de Investigación
    details: Análisis comparativos y exploraciones de nuevas tecnologías
    link: /es/notes/
---

## Inicio Rápido

Esta documentación está organizada en secciones principales:

### 🎓 [Módulos](/es/modules/skills/)
Documentación estructurada y completa sobre diferentes temas.

**Destacados:**
- [Skills Module](/es/modules/skills/) - Todo sobre Skills y su ecosistema
- [MCP Module](/es/modules/mcp/) - Model Context Protocol

### 📚 [Guías](/es/guides/)
Instrucciones paso a paso para tareas específicas.

**Destacados:**
- [MCP Setup Guide](/es/guides/mcp/mcp-setup-guide)
- [Antigravity Setup](/es/guides/mcp/ANTIGRAVITY_SETUP)

### 📖 [Referencias](/es/references/)
Documentación técnica detallada sobre sistemas, APIs y arquitectura.

**Destacados:**
- [Agent Format Standard](/es/references/agents/AGENT_FORMAT_STANDARD)
- [MCP Integration](/es/references/mcp/mcp-usage-claude-code)

### ✨ [Guidelines](/es/guidelines/)
Estándares y mejores prácticas del equipo.

### 🔬 [Notas](/es/notes/)
Investigaciones y análisis técnicos.

## Estructura del Proyecto

```
.agents/              # Configuraciones centralizadas
├── mcp/             # MCP server configs
├── rules/           # Reglas del proyecto
├── skills/          # Agent skills
├── commands/        # Slash commands
└── agents/          # Subagents

docs/                # Esta documentación
├── es/              # Español
│   ├── modules/     # Módulos de aprendizaje
│   ├── guides/      # Guías prácticas
│   └── references/  # Referencias técnicas
└── en/              # English
```

## Contribuir

Para mejorar esta documentación:

1. Edita los archivos en `docs/es/` (español) o `docs/en/` (inglés)
2. Los cambios se reflejan automáticamente en desarrollo
3. Crea un PR con tus mejoras

```bash
# Desarrollo local
npm run docs:dev

# Build para producción
npm run docs:build
```

---

::: tip Búsqueda Rápida
Usa `Cmd/Ctrl + K` para buscar en toda la documentación
:::
