# Planning & Memory Setup Guide

Este proyecto usa múltiples sistemas de planning y memoria para diferentes agentes: **Cursor Plan Mode** y **Gemini CLI Memory/GEMINI.md**.

## Quick Start

### 1. Cursor Plan Mode

**Activar:**
```
Shift+Tab desde el chat input
```

**Cuándo usar:**
- Features complejas con múltiples enfoques
- Cambios multi-archivo
- Decisiones arquitectónicas
- Requisitos poco claros que requieren exploración

**Proceso:**
1. Agent hace preguntas de clarificación
2. Investiga el codebase
3. Crea plan comprensivo
4. Revisas y editas el plan
5. Click "Build" para ejecutar

**Storage:**
- Plans se guardan en `.cursor/plans/`
- Click "Save to workspace" para persistir

### 2. Gemini CLI Memory

**Guardar información:**
```bash
# Durante conversación, el agente puede guardar
save_memory(fact="User prefiere TypeScript sobre JavaScript")
```

**Ver memoria:**
```bash
/memory show
```

**Refrescar:**
```bash
/memory refresh
```

**Storage:**
- Memoria global: `~/.gemini/GEMINI.md`
- Sección: `## Gemini Added Memories`

### 3. GEMINI.md Hierarchy

**Crear contextos:**
```bash
# Global (todas las proyectos)
~/.gemini/GEMINI.md

# Project (proyecto actual)
my-project/GEMINI.md

# Subdirectory (módulo específico)
my-project/components/GEMINI.md
```

**Ver contexto cargado:**
```bash
/memory show
```

**Formato:**
```markdown
# Project Context

## Tech Stack
- Next.js 14, TypeScript, Tailwind CSS v4

## Coding Standards
- Use TypeScript strict mode
- Prefer functional components
- Write tests for business logic
```

## Uso de Plan Mode (Cursor)

**Ejemplo: Nueva Feature**

```
User: Shift+Tab + "Add user authentication system"

Agent: (Plan Mode)
1. Clarification:
   - What auth method? (JWT/OAuth/Session)
   - Password requirements?
   - Social login needed?

2. Research:
   - Analiza user model actual
   - Revisa middleware existente
   - Verifica DB schema

3. Plan:
   - Crear auth middleware
   - Actualizar user model
   - Implementar token service
   - Proteger rutas

4. Review:
   - Usuario refina: agregar rate limiting
   - Especifica token expiration

5. Build:
   - Agent implementa plan aprobado
```

**Best Practice:**
- Iterar en el plan, no en el código
- Si output falla, refinar plan y re-ejecutar
- Guardar plans importantes en `.cursor/plans/`

## Uso de Memory (Gemini CLI)

**Preferencias Personales:**

```bash
gemini> Prefiero usar const sobre let cuando las variables no cambian

# Agent guarda automáticamente:
save_memory(fact="User prefiere const sobre let para variables inmutables")
```

**Detalles del Proyecto:**

```bash
gemini> Este proyecto usa pnpm en lugar de npm

# Agent guarda:
save_memory(fact="Proyecto actual usa pnpm en lugar de npm")
```

**Verificar memoria:**
```bash
# Nueva sesión
gemini> ¿Recuerdas qué package manager uso?

# Agent: "Sí, usas pnpm en lugar de npm"
```

## Uso de GEMINI.md

**Estructura recomendada:**

```
my-project/
├── GEMINI.md                    # Estándares del proyecto
├── components/
│   └── GEMINI.md                # Patrones de componentes
└── app/
    └── api/
        └── GEMINI.md            # Convenciones API
```

**Global (`~/.gemini/GEMINI.md`):**
```markdown
# Mis Preferencias

- TypeScript sobre JavaScript
- Functional programming cuando sea posible
- Tests para toda lógica de negocio
```

**Project (`my-app/GEMINI.md`):**
```markdown
# My App

## Tech Stack
- Next.js 14, TypeScript, Tailwind v4

## Standards
- Server Components por defecto
- "use client" solo cuando sea necesario
- 80% coverage mínimo
```

**Imports modulares:**
```markdown
# Project Config

@./docs/code-style.md
@./docs/architecture.md
```

## Comparación de Sistemas

| Feature | Cursor Plan Mode | Gemini Memory | GEMINI.md |
|---------|------------------|---------------|-----------|
| **Scope** | Single task | All sessions | Project/Global |
| **Storage** | `.cursor/plans/` | `~/.gemini/GEMINI.md` | Hierarchical files |
| **Best for** | Complex features | Personal prefs | Project standards |
| **Updates** | Per task | Agent can write | Manual editing |
| **Sharing** | Team (git) | Personal only | Team (git) |

**Cuándo usar cada uno:**

- **Plan Mode:** Features complejas, decisiones arquitectónicas, multi-paso
- **Memory:** Preferencias personales, patrones de trabajo recurrentes
- **GEMINI.md:** Estándares de proyecto, convenciones de equipo, tech stack

## Agregar Contexto al Proyecto

**1. Crear GEMINI.md del proyecto:**
```bash
touch GEMINI.md
```

**2. Definir estándares:**
```markdown
# My Project

## Tech Stack
- [Lista de tecnologías]

## Coding Standards
- [Convenciones de código]

## Architecture
- [Patrones arquitectónicos]
```

**3. Crear contextos por módulo:**
```bash
mkdir -p components && touch components/GEMINI.md
mkdir -p app/api && touch app/api/GEMINI.md
```

**4. Verificar carga:**
```bash
gemini> /memory show
# Debe mostrar contextos combinados
```

## Troubleshooting

**Cursor Plan Mode:**
- Plan no se guarda: Click "Save to workspace"
- Output incorrecto: Refinar plan, no iterar en código
- Plans muy largos: Dividir en subtasks más pequeñas

**Gemini Memory:**
- Memoria no persiste: Verificar `~/.gemini/GEMINI.md` existe
- Memoria no se carga: `/memory refresh`
- Demasiada memoria: Editar file manualmente, limpiar hechos obsoletos

**GEMINI.md:**
- Contexto no carga: Verificar filename exacto (case-sensitive)
- Footer no muestra archivos: `/memory refresh`
- Conflictos entre niveles: Más específico prevalece (subdirectory > project > global)

## Documentación

### Cursor Plan Mode
- **Referencia completa:** `docs/references/planning-tasks/cursor-plan-mode.md`
- **Storage:** `.cursor/plans/`
- **Official Docs:** https://cursor.com/docs/agent/modes#plan

### Gemini Memory
- **Referencia completa:** `docs/references/planning-tasks/gemini-memory.md`
- **Storage global:** `~/.gemini/GEMINI.md`
- **Official Docs:** https://geminicli.com/docs/tools/memory/

### GEMINI.md Hierarchy
- **Referencia completa:** `docs/references/planning-tasks/gemini-md-hierarchy.md`
- **Locations:** Global, Project, Subdirectory
- **Official Docs:** https://geminicli.com/docs/cli/gemini-md/

## Links Útiles

- [Cursor Agent Modes](https://cursor.com/docs/agent/modes)
- [Gemini CLI Memory Tool](https://geminicli.com/docs/tools/memory/)
- [GEMINI.md Context Files](https://geminicli.com/docs/cli/gemini-md/)
