---
layout: home

hero:
  name: LIDR
  text: Documentación Interna
  tagline: Best practices, guías y referencias del equipo
  actions:
    - theme: brand
      text: Comenzar
      link: /modules/skills/
    - theme: alt
      text: Ver Guías
      link: /guides/

features:
  - icon: 🎓
    title: Módulos de Aprendizaje
    details: Documentación estructurada sobre Skills, MCP, Agents y más
    link: /modules/skills/

  - icon: 📚
    title: Guías Paso a Paso
    details: Instrucciones detalladas para configurar y usar las herramientas del equipo
    link: /guides/

  - icon: 📖
    title: Referencias Técnicas
    details: Documentación técnica de agents, MCP servers, y herramientas de desarrollo
    link: /references/

  - icon: ✨
    title: Guidelines
    details: Estándares de código, diseño y convenciones del equipo
    link: /guidelines/

  - icon: 🔬
    title: Notas de Investigación
    details: Análisis comparativos y exploraciones de nuevas tecnologías
    link: /notes/
---

## Inicio Rápido

Esta documentación está organizada en secciones principales:

### 🎓 [Módulos](/modules/skills/)
Documentación estructurada y completa sobre diferentes temas.

**Destacados:**
- [Skills Module](/modules/skills/) - Todo sobre Skills y su ecosistema

### 📚 [Guías](/guides/)
Instrucciones paso a paso para tareas específicas.

### 📖 [Referencias](/references/)
Documentación técnica detallada sobre sistemas, APIs y arquitectura.

### ✨ [Guidelines](/guidelines/)
Estándares y mejores prácticas del equipo.

### 🔬 [Notas](/notes/)
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
├── modules/         # Módulos de aprendizaje (español)
├── guides/          # Guías prácticas (español)
├── references/      # Referencias técnicas (español)
└── en/              # English version
```

## Contribuir

Para mejorar esta documentación:

1. Edita los archivos en `docs/` (español) o `docs/en/` (inglés)
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
