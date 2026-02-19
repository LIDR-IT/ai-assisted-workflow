# Sistemas de Contexto y Memoria para AI Tools

Este directorio contiene documentación de referencia sobre sistemas de memoria y reglas en herramientas de IA, incluyendo:

- **Claude Code** (CLAUDE.md) - CLI de Anthropic
- **Gemini CLI** (GEMINI.md) - CLI de Google
- **Cursor** (.cursor/rules, AGENTS.md) - Editor con IA integrada
- **Antigravity** (.agents/rules, .agents/workflows) - IDE Agentic de Google

Estos sistemas permiten gestionar preferencias, convenciones y configuraciones persistentes a través de sesiones.

## Arquitectura de Memory

![Memory and Rules Architecture](memory-and-rules.png)

El sistema de memoria de Claude Code se organiza en una jerarquía de archivos que permite:

### 1. Memoria Organizacional

- **Managed Policies**: Políticas gestionadas centralmente por IT/DevOps
- Aplicables a toda la organización
- Desplegadas vía MDM, Group Policy, o sistemas de configuración

### 2. Memoria de Proyecto

- **CLAUDE.md**: Instrucciones compartidas del equipo
- **.claude/rules/**: Reglas modulares por tema
- Versionado en control de código
- Compartido entre todos los miembros del equipo

### 3. Memoria Personal

- **User memory** (`~/.claude/CLAUDE.md`): Preferencias globales
- **User rules** (`~/.claude/rules/`): Reglas personales reutilizables
- **CLAUDE.local.md**: Preferencias locales del proyecto (no versionadas)

## Componentes Clave

### CLAUDE.md

Archivo principal de memoria que puede contener:

- ✅ Comandos frecuentemente usados
- ✅ Preferencias de estilo de código
- ✅ Convenciones de nombres
- ✅ Patrones arquitectónicos
- ✅ Imports a otros archivos de documentación

**Ubicaciones posibles:**

- `./CLAUDE.md` - Raíz del proyecto
- `./.claude/CLAUDE.md` - Dentro de directorio `.claude`
- `~/.claude/CLAUDE.md` - Memoria personal global

### Sistema de Rules (.claude/rules/)

Sistema modular para organizar instrucciones por tema:

```
.claude/rules/
├── frontend/
│   ├── react.md
│   └── styling.md
├── backend/
│   ├── api.md
│   └── database.md
├── testing.md
└── security.md
```

**Características:**

- **Modular**: Un archivo por tema
- **Path-specific**: Reglas que aplican solo a ciertos archivos
- **Recursivo**: Soporta subdirectorios
- **Symlinks**: Compartir reglas entre proyectos (ver [Sincronización](#sincronización-de-rules-y-skills))
- **Glob patterns**: Patrones flexibles para matching

### Sincronización de Rules y Skills

Este proyecto implementa un sistema de sincronización centralizada para distribuir rules y skills:

**Script:** `.agents/rules/sync-rules.sh`

**Arquitectura:**

- **Source of truth:** `.agents/rules/` y `.agents/skills/`
- **Método:** Symlinks (Cursor/Claude/Gemini) o Copy (Antigravity)
- **Guía completa:** [docs/guides/rules/SYNC_SETUP.md](../../guides/rules/SYNC_SETUP.md)

**Uso básico:**

```bash
# Sincronizar rules y skills a todos los agentes
./.agents/rules/sync-rules.sh

# Modo dry-run (previsualizar cambios)
./.agents/rules/sync-rules.sh --dry-run
```

**Core rules incluidas:**

- `core-principles.md` - Arquitectura y decisiones de diseño
- `code-style.md` - Convenciones de código
- `documentation.md` - Estándares de documentación
- `git-workflow.md` - Flujo de trabajo Git
- `testing.md` - Prácticas de testing
- `use-context7.md` - Uso de Context7 MCP server

### Reglas Condicionales

Usando YAML frontmatter para aplicar reglas solo a archivos específicos:

```markdown
---
paths:
  - "src/api/**/*.ts"
  - "src/routes/**/*.ts"
---

# Reglas de API

- Validar todas las entradas
- Usar formato estándar de errores
- Documentar con OpenAPI
```

## Jerarquía y Precedencia

De mayor a menor prioridad:

1. **Managed Policy** - Políticas organizacionales
2. **Project Memory** - CLAUDE.md del proyecto
3. **Project Rules** - .claude/rules/\*.md
4. **User Memory** - ~/.claude/CLAUDE.md
5. **Project Memory (local)** - CLAUDE.local.md

Los archivos más altos en la jerarquía se cargan primero y proporcionan la base que las memorias más específicas complementan.

## Flujo de Trabajo

### 1. Inicialización

```bash
> /init
```

Crea estructura base de CLAUDE.md en el proyecto

### 2. Gestión

```bash
> /memory
```

Abre archivos de memoria en el editor del sistema

### 3. Carga Automática

- Claude Code lee recursivamente desde el directorio actual hacia arriba
- Descubre y carga todos los CLAUDE.md y archivos en .claude/rules/
- Los imports se evalúan automáticamente (máximo 5 niveles)

### 4. Aplicación Contextual

- Reglas globales siempre activas
- Reglas condicionales (con `paths`) solo cuando se trabaja con archivos coincidentes
- Memorias de subdirectorios solo al trabajar en esos subdirectorios

## Imports y Modularidad

Los archivos CLAUDE.md soportan imports con sintaxis `@`:

```markdown
# Documentación del Proyecto

Ver @README.md para overview y @package.json para comandos npm.

# Workflows

- Flujo Git @docs/git-workflow.md
- Deployment @docs/deployment.md

# Preferencias Personales

- @~/.claude/my-preferences.md
```

**Características:**

- Rutas relativas y absolutas
- Recursión hasta 5 niveles
- No se evalúan en code blocks
- Útil para separar concerns

## Casos de Uso

### Uso Individual

- Preferencias personales de estilo
- Atajos y comandos favoritos
- Configuraciones de herramientas

### Uso de Equipo

- Estándares de código del proyecto
- Arquitectura y patrones
- Convenciones de testing
- Flujos de trabajo de git

### Uso Organizacional

- Políticas de seguridad
- Estándares corporativos
- Requisitos de compliance
- Configuraciones obligatorias

## Mejores Prácticas

### ✅ Organización

- Un tema por archivo en `.claude/rules/`
- Nombres descriptivos
- Agrupar en subdirectorios

### ✅ Especificidad

- Ser concreto en las instrucciones
- Usar ejemplos cuando sea útil
- Evitar ambigüedades

### ✅ Mantenimiento

- Revisar y actualizar regularmente
- Remover reglas obsoletas
- Mantener sincronizado con el proyecto

### ✅ Scope Apropiado

- Reglas condicionales solo cuando necesario
- User memory para preferencias personales
- Project memory para convenciones del equipo
- Managed policy para políticas organizacionales

## Antigravity Rules & Workflows - IDE Agentic de Google

Antigravity es un IDE agentic que evoluciona el concepto de editor tradicional hacia la era de agentes autónomos, con un sistema único que separa **Rules** (guías persistentes) y **Workflows** (comandos on-demand).

### Concepto Dual: Rules + Workflows

**Rules** = System instructions (siempre activas, pasivas)
**Workflows** = Saved prompts (activación manual con `/`, activas)

### Ubicaciones de Archivos

| Tipo          | Global                                    | Workspace                |
| ------------- | ----------------------------------------- | ------------------------ |
| **Rules**     | `~/.gemini/GEMINI.md`                     | `.agents/rules/*.md`     |
| **Workflows** | `~/.gemini/antigravity/global_workflows/` | `.agents/workflows/*.md` |

### Características Únicas

- 🤖 **Agentes autónomos** que planifican y ejecutan
- 📋 **Mission-driven**: Archivo `mission.md` para objetivos de alto nivel
- 🎯 **Artifact-first philosophy**: Documentación antes del código
- 🧠 **Deep Think protocol**: Razonamiento profundo con `<thought>` blocks
- 🌐 **Browser control**: Navegación web con límites definidos

### Workflows Nativos

A diferencia de otros sistemas, Antigravity tiene workflows como concepto de primera clase:

```markdown
# .agents/workflows/generate-tests.md

Generate comprehensive unit tests for current file.
[Template y requirements...]
```

**Activación:** `/generate-tests` en el chat

### Directivas del Agente

Archivo `.antigravity/rules.md` define:

- Type hints obligatorios
- Pydantic models para validación
- Google-style docstrings
- Límites de browser/terminal control

### Conflicto con Gemini CLI

⚠️ Ambas herramientas usan `~/.gemini/GEMINI.md` - puede causar conflictos si se usan simultáneamente.

## Cursor Rules - Sistema de Contexto en Cursor Editor

Cursor, un editor de código con IA integrada, implementa un sistema robusto de reglas con múltiples niveles:

### Tipos de Rules en Cursor

1. **Project Rules** - `.cursor/rules/*.md` o `.mdc` (versionado con el proyecto)
2. **User Rules** - Configuración global en Cursor Settings
3. **Team Rules** - Gestión organizacional vía Dashboard (planes Team/Enterprise)
4. **AGENTS.md** - Alternativa simple sin metadata

### Formato .mdc con Frontmatter

```markdown
---
description: "Standards for frontend components"
alwaysApply: false
globs: ["src/components/**/*.tsx"]
---

# Frontend Component Standards

[Contenido de la regla]
```

### Modos de Aplicación

| Modo                        | Cuándo se Aplica                              |
| --------------------------- | --------------------------------------------- |
| **Always Apply**            | En cada sesión de chat                        |
| **Apply Intelligently**     | Cuando el agente determina relevancia         |
| **Apply to Specific Files** | Solo archivos que coincidan con glob patterns |
| **Apply Manually**          | Solo con referencias `@rule-name`             |

### Jerarquía y Precedencia

**Team Rules** (más alta) → **Project Rules** → **User Rules** (más baja)

Las Team Rules pueden ser marcadas como "Required" (obligatorias) y no pueden ser sobrescritas.

### Características Distintivas

- **Límite recomendado**: 500 líneas por regla
- **Composabilidad**: Referencias entre reglas con `@rule-name`
- **Legacy support**: `.cursorrules` soportado pero en deprecación
- **Gestión empresarial**: Dashboard centralizado para Team Rules
- **Glob patterns**: Aplicación condicional basada en patrones de archivos

## GEMINI.md - Sistema de Contexto en Gemini CLI

Similar a CLAUDE.md, Gemini CLI implementa un sistema de archivos GEMINI.md con su propia jerarquía:

### Jerarquía en Gemini CLI

1. **Global Context**: `~/.gemini/GEMINI.md` - Aplica a todos los proyectos
2. **Project-Level**: `GEMINI.md` en directorio actual o padres hasta `.git` root
3. **Sub-directory Context**: `GEMINI.md` en subdirectorios para contexto específico de módulo

### Comandos en Gemini CLI

| Comando              | Función                      |
| -------------------- | ---------------------------- |
| `/memory show`       | Mostrar contexto concatenado |
| `/memory refresh`    | Recargar archivos GEMINI.md  |
| `/memory add <text>` | Agregar al archivo global    |

### Características Distintivas

- **Imports modulares**: Sintaxis `@./path/to/file.md` para dividir archivos grandes
- **Configuración flexible**: Nombres de archivo personalizables en `settings.json`
- **Respeta .gitignore**: Los archivos respetan `.gitignore` y `.geminiignore`
- **Indicador activo**: Footer muestra cuántos archivos de contexto están activos

## Comparación Completa: Claude Code vs Gemini CLI vs Cursor vs Antigravity

| Aspecto                  | Claude Code                              | Gemini CLI                         | Cursor                                          | Antigravity                                 |
| ------------------------ | ---------------------------------------- | ---------------------------------- | ----------------------------------------------- | ------------------------------------------- |
| **Tipo de herramienta**  | CLI                                      | CLI                                | Editor/IDE                                      | IDE Agentic                                 |
| **Niveles de jerarquía** | 5 (Managed, Project, Rules, User, Local) | 3 (Global, Project, Sub-directory) | 4 (Team, Project, User, AGENTS.md)              | 2 (Global, Workspace)                       |
| **Archivo principal**    | `CLAUDE.md`                              | `GEMINI.md`                        | `.cursor/rules/*.md`                            | `.agents/rules/*.md`                        |
| **Ubicación project**    | `./CLAUDE.md` o `./.claude/CLAUDE.md`    | `./GEMINI.md`                      | `.cursor/rules/` o `AGENTS.md`                  | `.agents/rules/`                            |
| **Workflows nativos**    | ❌ No                                    | ❌ No                              | ❌ No                                           | ✅ `.agents/workflows/`                     |
| **Modularización**       | `@path` imports + `.claude/rules/`       | `@./path` imports                  | Múltiples archivos                              | Múltiples archivos `.md`                    |
| **Reglas condicionales** | YAML `paths` en `.claude/rules/`         | No soportado                       | YAML `globs` en `.mdc`                          | No mencionado                               |
| **Modos de aplicación**  | Automático por jerarquía                 | Automático por directorio          | 4 modos (Always, Intelligent, Specific, Manual) | Rules (siempre) + Workflows (`/` on-demand) |
| **Comandos**             | `/init`, `/memory`                       | `/memory show/refresh/add`         | `@rule-name`                                    | `/workflow-name`                            |
| **Gestión de equipo**    | Managed policy (sistema)                 | No mencionado                      | Dashboard (Team/Enterprise)                     | No mencionado                               |
| **Configuración global** | `~/.claude/CLAUDE.md`                    | `~/.gemini/GEMINI.md`              | Cursor Settings                                 | `~/.gemini/GEMINI.md` ⚠️                    |
| **Gitignore automático** | `CLAUDE.local.md`                        | Manual                             | Manual                                          | Manual                                      |
| **Path matching**        | Glob patterns                            | Basado en directorios              | Glob patterns                                   | No mencionado                               |
| **Symlinks**             | Soportado                                | Soportado                          | No mencionado                                   | No mencionado                               |
| **Límite recomendado**   | No especificado                          | No especificado                    | 500 líneas por regla                            | No especificado                             |
| **Legacy support**       | N/A                                      | N/A                                | `.cursorrules` (deprecated)                     | N/A                                         |
| **Mission file**         | ❌ No                                    | ❌ No                              | ❌ No                                           | ✅ `mission.md`                             |
| **Artifact system**      | ❌ No                                    | ❌ No                              | ❌ No                                           | ✅ `artifacts/`                             |
| **Deep Think**           | ❌ No                                    | ❌ No                              | ❌ No                                           | ✅ Gemini 3 Deep Think                      |
| **Browser control**      | ❌ No                                    | ❌ No                              | ❌ No                                           | ✅ Con límites                              |
| **Agentes autónomos**    | ❌ No                                    | ❌ No                              | ❌ No                                           | ✅ Mission Control                          |

**Nota:** ⚠️ Antigravity y Gemini CLI comparten `~/.gemini/GEMINI.md` - puede causar conflictos.

### Compatibilidad Cruzada y AGENTS.md Standard

**AGENTS.md** emerge como un estándar universal que puede ser usado por múltiples herramientas:

| Herramienta     | Soporte AGENTS.md                                   |
| --------------- | --------------------------------------------------- |
| **Cursor**      | ✅ Nativo (alternativa a `.cursor/rules`)           |
| **Claude Code** | ⚠️ Puede ser configurado vía nombres personalizados |
| **Gemini CLI**  | ✅ Vía `settings.json`                              |

**Configuración para compartir contexto:**

**Gemini CLI `settings.json`:**

```json
{
  "context": {
    "fileName": ["AGENTS.md", "CLAUDE.md", "GEMINI.md"]
  }
}
```

**Cursor:** Usa `AGENTS.md` nativamente sin configuración adicional.

**Ventajas de AGENTS.md:**

- ✅ Simple y sin metadata compleja
- ✅ Funciona en múltiples herramientas
- ✅ Fácil de entender y mantener
- ✅ No requiere configuración especial
- ✅ Estándar emergente en la comunidad

## Contenido de este Directorio

- **memory-and-rules.md**: Guía completa del sistema CLAUDE.md en Claude Code (13KB, 384 líneas)
- **gemini-md.md**: Guía completa del sistema GEMINI.md en Gemini CLI (14KB, 567 líneas)
- **cursor-rules.md**: Guía completa del sistema de reglas en Cursor (22KB, 827 líneas)
- **antigravity-rules-workflows.md**: Guía completa de Rules & Workflows en Antigravity (26KB, 900+ líneas) ✨
- **memory-and-rules.png**: Diagrama de la arquitectura
- **README.md**: Este archivo (overview comparativo de los cuatro sistemas)

## Referencias

### Claude Code

- [Documentación Oficial - Memory](https://code.claude.com/docs/en/memory)
- [Claude Code Docs](https://code.claude.com/docs)

### Gemini CLI

- [Documentación Oficial - GEMINI.md](https://geminicli.com/docs/cli/gemini-md/)
- [Gemini CLI Documentation](https://geminicli.com/docs)

### Cursor

- [Documentación Oficial - Rules](https://cursor.com/docs/context/rules)
- [Cursor Documentation](https://cursor.com/docs)

### Antigravity

- [Documentación Oficial - Rules & Workflows](https://antigravity.google/docs/rules-workflows)
- [Getting Started with Antigravity - Codelabs](https://codelabs.developers.google.com/getting-started-google-antigravity)
- [Customize Antigravity with Rules and Workflows - Mete Atamel](https://atamel.dev/posts/2025/11-25_customize_antigravity_rules_workflows/)
- [Antigravity Workspace Template - GitHub](https://github.com/study8677/antigravity-workspace-template)
- [Gemini Superpowers for Antigravity - GitHub](https://github.com/anthonylee991/gemini-superpowers-antigravity)

### Estándares y Arquitectura

- [AGENTS.md Standard](https://agents.md) - Estándar universal para archivos de contexto
- [Agent Skills Architecture](../skills/README.md)
- [Model Context Protocol](https://modelcontextprotocol.io)

---

## Recomendaciones por Caso de Uso

### Para CLIs (Terminal)

- **Claude Code**: Si trabajas principalmente con Claude y necesitas reglas sofisticadas condicionales por path
- **Gemini CLI**: Si prefieres Google Gemini y quieres un sistema simple de imports

### Para Editores (IDE)

- **Cursor**: Sistema más completo con múltiples niveles, ideal para equipos empresariales con gestión centralizada
- **Antigravity**: IDE agentic con workflows nativos, ideal para desarrollo con agentes autónomos

### Para Desarrollo Agentic

- **Antigravity**: Única herramienta con workflows nativos, mission.md, artifact-first philosophy, y Deep Think protocol
- Características únicas: Browser control, agentes autónomos, Mission Control

### Para Workflows Reutilizables

- **Antigravity**: Única herramienta con workflows como concepto de primera clase
- Activación con `/workflow-name` en el chat
- Separación clara entre Rules (persistentes) y Workflows (on-demand)

### Para Portabilidad

- **AGENTS.md**: Funciona nativamente en Cursor y vía config en Gemini CLI
- Antigravity usa `.agents/rules/` (no directamente compatible)

### Para Equipos Grandes

- **Cursor Team Rules**: Gestión centralizada vía Dashboard con reglas obligatorias
- **Claude Code Managed Policy**: Despliegue vía sistemas corporativos (MDM, Group Policy)
- **Antigravity**: Mejor para equipos que trabajan con agentes autónomos y mission-driven development

### Para Proyectos Complejos

- **Antigravity**: Mission.md para contexto de alto nivel + artifact system para documentación estructurada
- **Cursor**: Reglas condicionales con glob patterns para proyectos multi-módulo
- **Claude Code**: Sistema de rules modulares con path-specific rules

---

**Nota:** Los sistemas de memoria y reglas (CLAUDE.md, GEMINI.md, Cursor Rules, Antigravity Rules/Workflows, AGENTS.md) son complementarios a Skills y MCP servers, formando parte integral de la arquitectura Agent + Skills + Computer.

Mientras **Skills** proporcionan conocimiento procedimental y **MCP servers** extienden capacidades de conexión a sistemas externos, los **archivos de contexto** personalizan el comportamiento y mantienen consistencia en el trabajo del agente.

### Evolución de los Sistemas

Los cuatro sistemas documentados representan diferentes etapas de evolución:

1. **Claude Code & Gemini CLI**: CLIs tradicionales con sistema de memoria por archivos
2. **Cursor**: Editor con IA integrada, múltiples niveles de rules y gestión empresarial
3. **Antigravity**: IDE agentic con workflows nativos, representando la próxima generación de desarrollo asistido por agentes autónomos

### Características Diferenciadoras

**Antigravity** destaca por ser el único sistema con:

- ✅ **Workflows nativos** separados de rules
- ✅ **Mission-driven development** con archivo `mission.md`
- ✅ **Artifact-first philosophy** para documentación estructurada
- ✅ **Deep Think protocol** integrado
- ✅ **Browser control** con límites definidos
- ✅ **Agentes autónomos** vía Mission Control

Estos cuatro sistemas comparten conceptos fundamentales similares pero con diferentes implementaciones y niveles de complejidad, permitiendo a los equipos elegir la herramienta de IA que mejor se adapte a sus necesidades mientras mantienen prácticas consistentes de gestión de contexto.

La convergencia hacia **AGENTS.md** como estándar universal (soportado nativamente en Cursor y configurable en Gemini CLI) sugiere una dirección hacia la interoperabilidad entre herramientas, mientras que **Antigravity** señala el futuro del desarrollo agentic con su enfoque único en workflows y mission-driven development.
