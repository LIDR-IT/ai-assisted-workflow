# Cursor Rules - Sistema de Contexto en Cursor

Este documento explica el sistema de reglas (rules) en Cursor, un editor de código con IA integrada que utiliza instrucciones persistentes a nivel de sistema para guiar al agente de IA.

## Vista General

Cursor Rules proporciona instrucciones persistentes a nivel de sistema que agrupan prompts, scripts y workflows juntos. Como indica la documentación oficial: "Rules provide system-level instructions to Agent" y permite a los equipos "manage and share workflows across your codebase."

## ¿Por Qué Existen las Rules?

Los modelos de lenguaje grandes (LLMs) no retienen memoria entre completaciones. Las reglas resuelven esto insertando contexto persistente a nivel de prompt, asegurando que "the AI consistent guidance for generating code, interpreting edits, or helping with workflows."

## Tipos de Rules

Cursor soporta **cuatro mecanismos** distintos de reglas:

| Tipo                 | Ubicación                            | Alcance                         | Uso                                          |
| -------------------- | ------------------------------------ | ------------------------------- | -------------------------------------------- |
| **1. Project Rules** | `.cursor/rules/*.md` o `.mdc`        | Específico del codebase         | Reglas versionadas compartidas con el equipo |
| **2. User Rules**    | Cursor Settings (global)             | Todos los proyectos del usuario | Preferencias personales globales             |
| **3. Team Rules**    | Cursor Dashboard (organización)      | Toda la organización            | Estándares corporativos (Team/Enterprise)    |
| **4. AGENTS.md**     | `AGENTS.md` en raíz o subdirectorios | Proyecto o subdirectorio        | Alternativa simple a `.cursor/rules`         |

## 1. Project Rules

### Ubicación y Estructura

Las reglas de proyecto residen en `.cursor/rules/` como archivos markdown con extensiones `.md` o `.mdc`.

```
mi-proyecto/
├── .cursor/
│   └── rules/
│       ├── frontend-standards.mdc
│       ├── api-guidelines.md
│       ├── testing.mdc
│       └── security.md
├── src/
└── package.json
```

### Formato .mdc con Frontmatter

El formato `.mdc` soporta metadata en YAML frontmatter:

```markdown
---
description: "Standards for frontend components"
alwaysApply: false
globs: ["src/components/**/*.tsx", "src/pages/**/*.tsx"]
---

# Frontend Component Standards

## Component Structure

All React components must:

- Use functional components (no class components)
- Include TypeScript prop types
- Export prop interfaces
- Include unit tests

## File Naming

- Components: PascalCase (e.g., `UserProfile.tsx`)
- Hooks: camelCase with "use" prefix (e.g., `useAuth.ts`)
- Utils: camelCase (e.g., `formatDate.ts`)
```

### Campos de Frontmatter

| Campo         | Tipo    | Descripción                                                         |
| ------------- | ------- | ------------------------------------------------------------------- |
| `description` | string  | Descripción breve de la regla                                       |
| `alwaysApply` | boolean | Si la regla se aplica siempre (`true`) o inteligentemente (`false`) |
| `globs`       | array   | Patrones de archivos donde aplicar la regla                         |

### Formato .md Simple

Para reglas sin metadata, usa archivos `.md` normales:

```markdown
# API Development Guidelines

- All endpoints must validate input using Zod schemas
- Use standard error response format
- Include OpenAPI documentation comments
- Implement rate limiting on public endpoints
```

## 2. User Rules

### Configuración

Las User Rules se configuran globalmente en **Cursor Settings** y aplican a todos los proyectos del usuario.

**Acceso:**

1. Abrir Cursor Settings (Cmd/Ctrl + ,)
2. Buscar "Rules"
3. Agregar reglas en "User Rules"

### Casos de Uso

Preferencias personales que quieres en todos tus proyectos:

```markdown
# Mis Preferencias de Desarrollo

## Estilo General

- Siempre usar const/let, nunca var
- Preferir arrow functions sobre function declarations
- Usar single quotes para strings

## Comentarios y Documentación

- Explicar el "por qué" en comentarios, no el "qué"
- Incluir JSDoc para funciones públicas
- Usar TODO: para tareas pendientes

## Testing

- Escribir tests para toda lógica de negocio
- Usar descriptive test names
- Seguir patrón Arrange-Act-Assert
```

## 3. Team Rules

### Gestión Organizacional

Disponible solo en planes **Team/Enterprise**, las Team Rules se gestionan a través del **Cursor Dashboard**.

**Características:**

- **Centralizado**: Administrado por administradores del equipo
- **Enforced**: Las reglas pueden ser requeridas (obligatorias) u opcionales
- **Precedencia más alta**: Sobrescriben Project Rules y User Rules

### Configuración de Team Rules

1. Acceder a Cursor Dashboard
2. Navegar a Team Settings → Rules
3. Crear/editar reglas organizacionales
4. Marcar como "Required" para hacer obligatorias

### Ejemplo: Reglas de Seguridad Corporativas

```markdown
# Security Standards (REQUIRED)

## Authentication

- Never commit API keys, tokens, or credentials
- Use environment variables for sensitive data
- Implement OAuth 2.0 for user authentication

## Data Validation

- Sanitize all user inputs
- Use parameterized queries (no string concatenation in SQL)
- Validate file uploads (type, size, content)

## Dependencies

- Keep all dependencies up to date
- Run `npm audit` before commits
- Use only approved packages from corporate registry
```

## 4. AGENTS.md

### Alternativa Simple

`AGENTS.md` es un archivo markdown plano sin metadata ni configuraciones complejas, diseñado como alternativa más simple a `.cursor/rules`.

### Ubicación

- **Raíz del proyecto**: `./AGENTS.md`
- **Subdirectorios**: `./src/components/AGENTS.md`

### Soporte Anidado

AGENTS.md soporta archivos anidados en subdirectorios con precedencia en cascada:

```
mi-proyecto/
├── AGENTS.md                      # Reglas generales del proyecto
├── src/
│   ├── components/
│   │   └── AGENTS.md              # Específico de componentes
│   ├── api/
│   │   └── AGENTS.md              # Específico de API
│   └── utils/
│       └── AGENTS.md              # Específico de utilidades
```

**Precedencia:** Las reglas de subdirectorios se combinan con las de niveles superiores, siendo más específicas las de subdirectorio.

### Ejemplo: AGENTS.md de Proyecto

```markdown
# Mi Aplicación E-commerce

## Stack Tecnológico

- Frontend: React 18 + TypeScript + Vite
- Backend: Node.js + Express + PostgreSQL
- Testing: Vitest + React Testing Library

## Comandos Comunes

\`\`\`bash
npm run dev # Desarrollo
npm run build # Build producción
npm test # Tests
npm run lint # Linter
\`\`\`

## Estructura del Proyecto

\`\`\`
src/
├── components/ # Componentes React
├── hooks/ # Custom hooks
├── services/ # API services
├── utils/ # Utilidades
├── types/ # TypeScript types
└── **tests**/ # Tests
\`\`\`

## Convenciones de Código

- Indentación de 2 espacios
- Single quotes para strings
- Trailing commas en objetos/arrays
- Nombres: PascalCase para componentes, camelCase para funciones
```

### Ejemplo: AGENTS.md de Subdirectorio

**`src/components/AGENTS.md`:**

```markdown
# React Components Guidelines

## Component Structure

- Functional components only (no class components)
- TypeScript for all props
- Export prop types separately
- Co-locate tests with components

## File Naming

- Components: PascalCase (e.g., `UserProfile.tsx`)
- Tests: Same name + `.test.tsx` (e.g., `UserProfile.test.tsx`)
- Styles: Same name + `.module.css` (e.g., `UserProfile.module.css`)

## Template

\`\`\`typescript
import { FC } from 'react';
import styles from './ComponentName.module.css';

interface IComponentNameProps {
// props here
}

export const ComponentName: FC<IComponentNameProps> = ({ props }) => {
return (

<div className={styles.container}>
{/_ content _/}
</div>
);
};
\`\`\`
```

## Modos de Aplicación de Reglas

Cursor ofrece **cuatro modos** para controlar cuándo las reglas se activan:

| Modo                        | Configuración            | Cuándo se Aplica                            |
| --------------------------- | ------------------------ | ------------------------------------------- |
| **Always Apply**            | `alwaysApply: true`      | En cada sesión de chat                      |
| **Apply Intelligently**     | `alwaysApply: false`     | Cuando el agente determina relevancia       |
| **Apply to Specific Files** | `globs: [patterns]`      | Solo en archivos que coincidan con patrones |
| **Apply Manually**          | Referencias `@rule-name` | Solo cuando se menciona explícitamente      |

### Ejemplos de Configuración

**Always Apply (Reglas Globales):**

```markdown
---
description: "TypeScript coding standards"
alwaysApply: true
---

# TypeScript Standards

- Strict mode enabled
- No `any` types without justification
- Prefer interfaces over types for objects
```

**Apply Intelligently (Detección Automática):**

```markdown
---
description: "API endpoint security"
alwaysApply: false
---

# API Security Guidelines

When working with API endpoints:

- Validate all inputs
- Implement rate limiting
- Use authentication middleware
```

**Apply to Specific Files (Glob Patterns):**

```markdown
---
description: "React component standards"
alwaysApply: false
globs: ["src/components/**/*.tsx", "src/pages/**/*.tsx"]
---

# React Component Standards

Components in this directory must:

- Use functional components
- Include TypeScript props
- Have co-located tests
```

**Apply Manually (On-Demand):**

```markdown
---
description: "Database migration guidelines"
alwaysApply: false
---

# Database Migrations

Use `@database-migrations` to apply these rules:

- Always backup before migrations
- Test migrations on staging first
- Include rollback scripts
```

En el chat: `@database-migrations How do I create a new migration?`

## Jerarquía y Precedencia

Cuando múltiples reglas están activas, la precedencia es:

**Team Rules** (más alta) → **Project Rules** → **User Rules** (más baja)

### Comportamiento de Precedencia

1. **Team Rules obligatorias** siempre se aplican y no pueden ser deshabilitadas
2. **Team Rules opcionales** pueden ser sobrescritas por Project Rules
3. **Project Rules** aplican a todo el equipo vía control de versiones
4. **User Rules** solo afectan al usuario individual

### Ejemplo de Conflicto

**Team Rule (enforced):**

```markdown
# Security: No console.log in production

alwaysApply: true
```

**User Rule:**

```markdown
# I prefer using console.log for debugging
```

**Resultado:** Team Rule prevalece, `console.log` será flagged por el agente.

## Patrones Glob Soportados

Los patrones glob en el campo `globs` soportan sintaxis estándar:

| Patrón                | Coincide                                         |
| --------------------- | ------------------------------------------------ |
| `**/*.ts`             | Todos los archivos `.ts` en cualquier directorio |
| `src/**/*.tsx`        | Todos los archivos `.tsx` bajo `src/`            |
| `*.test.ts`           | Archivos de test en directorio actual            |
| `src/components/**/*` | Todos los archivos en `src/components/`          |
| `{src,lib}/**/*.ts`   | Archivos `.ts` en `src/` o `lib/`                |
| `src/**/*.{ts,tsx}`   | Archivos `.ts` o `.tsx` en `src/`                |

### Ejemplos de Uso

**Reglas específicas para tests:**

```markdown
---
description: "Testing standards"
globs: ["**/*.test.ts", "**/*.test.tsx", "**/*.spec.ts"]
---

# Testing Guidelines

- Use descriptive test names
- Follow Arrange-Act-Assert pattern
- Mock external dependencies
- Aim for 80%+ coverage
```

**Reglas para archivos de configuración:**

```markdown
---
description: "Config file standards"
globs: ["*.config.{js,ts}", ".*rc.{js,json}"]
---

# Configuration Files

- Include comments explaining each option
- Use TypeScript for config when possible
- Validate config with schemas
```

## Mejores Prácticas

### ✅ Mantener Reglas Enfocadas y Acotadas

**Bien:**

```markdown
# API Validation Rules

- All endpoints must use Zod for input validation
- Return 400 for validation errors
- Include field-specific error messages
```

**Mal:**

```markdown
# Everything About Our API

[500 lines covering validation, authentication, database queries, testing, deployment, monitoring, logging, error handling...]
```

### ✅ Límite de Tamaño

La documentación recomienda: **"Keep rules under 500 lines"**

Si una regla supera 500 líneas:

- Dividir en múltiples archivos temáticos
- Usar componibilidad (referencias entre reglas)
- Considerar si parte del contenido pertenece a documentación estándar

### ✅ Referenciar Archivos en Vez de Copiar Contenido

**Bien:**

```markdown
# Code Style

See our TypeScript style guide: `docs/typescript-style.md`

Key points:

- Strict mode enabled
- No implicit any
- Prefer interfaces for objects
```

**Mal:**

```markdown
# Code Style

[Copiar y pegar 300 líneas del style guide existente]
```

### ✅ Evitar Redundancia

No dupliques lo que ya existe en:

- Linters (ESLint, Prettier)
- Documentación oficial
- README del proyecto
- Comentarios en el código

**Ejemplo de redundancia innecesaria:**

```markdown
# TypeScript Rules

- Variables should be in camelCase ← Ya lo hace ESLint
- Use semicolons ← Ya lo hace Prettier
- Functions should have JSDoc ← Ya está en el style guide
```

### ✅ Empezar Simple

**Recomendación oficial:** "Start simple. Add rules only when you notice Agent making the same mistake repeatedly"

**Flujo de trabajo recomendado:**

1. **Observar**: Nota cuando el agente comete el mismo error repetidamente
2. **Documentar**: Crea una regla específica para ese caso
3. **Iterar**: Refina la regla basado en resultados
4. **Expandir**: Solo agrega más reglas cuando surja la necesidad

### ✅ Composición de Reglas

Para reglas complejas, compón múltiples archivos:

**.cursor/rules/main.mdc:**

```markdown
---
description: "Main project standards"
alwaysApply: true
---

# Project Standards

See specific guidelines:

- Components: @frontend-standards
- API: @api-guidelines
- Testing: @testing-standards
```

**.cursor/rules/frontend-standards.mdc:**

```markdown
---
description: "Frontend component standards"
globs: ["src/components/**/*.tsx"]
---

# Frontend Standards

[Reglas específicas de frontend]
```

## Gestión de Reglas en el Workflow

### Agregar Rules

**Project Rules:**

1. Crear archivo en `.cursor/rules/`
2. Nombrar descriptivamente (e.g., `api-standards.mdc`)
3. Agregar frontmatter si necesitas configuración
4. Commit al repositorio para compartir con equipo

**User Rules:**

1. Cursor Settings → Rules → User Rules
2. Agregar reglas globales personales
3. Aplican a todos tus proyectos

**Team Rules:**

1. Cursor Dashboard → Team Settings → Rules
2. Crear regla organizacional
3. Marcar como "Required" si es obligatoria
4. Se distribuye automáticamente a todo el equipo

### Usar Rules en Chat

**Aplicación automática:**

- Always Apply rules se incluyen automáticamente
- Intelligent rules se aplican cuando son relevantes

**Aplicación manual:**

```
@rule-name How do I implement authentication?
```

**Ver reglas activas:**
El agente considerará todas las reglas aplicables en el contexto actual.

## Soporte Legacy: .cursorrules

### Estado Actual

El archivo `.cursorrules` en la raíz del proyecto sigue siendo soportado pero está **en proceso de deprecación**.

### Migración Recomendada

**De:**

```
mi-proyecto/
├── .cursorrules     # Legacy
└── src/
```

**A (opción 1 - Project Rules):**

```
mi-proyecto/
├── .cursor/
│   └── rules/
│       └── standards.md
└── src/
```

**A (opción 2 - AGENTS.md):**

```
mi-proyecto/
├── AGENTS.md
└── src/
```

### Proceso de Migración

1. Copiar contenido de `.cursorrules`
2. Crear `.cursor/rules/main.md` o `AGENTS.md`
3. Pegar y ajustar contenido
4. Agregar frontmatter si usas `.mdc`
5. Eliminar `.cursorrules` (opcional pero recomendado)

## Comparación con Otros Sistemas

| Aspecto                  | Cursor Rules                                    | Claude Code (CLAUDE.md)                          | Gemini CLI (GEMINI.md)                     |
| ------------------------ | ----------------------------------------------- | ------------------------------------------------ | ------------------------------------------ |
| **Tipos de reglas**      | 4 tipos (Project, User, Team, AGENTS.md)        | 5 niveles (Managed, Project, Rules, User, Local) | 3 niveles (Global, Project, Sub-directory) |
| **Formato**              | `.md` o `.mdc` con frontmatter                  | `.md` con imports                                | `.md` con imports                          |
| **Ubicación project**    | `.cursor/rules/` o `AGENTS.md`                  | `CLAUDE.md` o `.claude/rules/`                   | `GEMINI.md`                                |
| **Reglas condicionales** | `globs` en frontmatter                          | YAML `paths` en `.claude/rules/`                 | No soportado                               |
| **Modos de aplicación**  | 4 modos (Always, Intelligent, Specific, Manual) | Automático por jerarquía                         | Automático por directorio                  |
| **Team management**      | Dashboard (Team/Enterprise)                     | Managed policy (archivos sistema)                | No mencionado                              |
| **Referencias**          | `@rule-name` en chat                            | `@path` imports                                  | `@./path` imports                          |
| **Legacy support**       | `.cursorrules` (deprecated)                     | N/A                                              | N/A                                        |
| **Límite recomendado**   | 500 líneas por regla                            | No especificado                                  | No especificado                            |

## Casos de Uso Completos

### Caso 1: Startup con Equipo Pequeño

**Estructura:**

```
startup-app/
├── AGENTS.md                    # Simple, todo en un archivo
└── src/
```

**AGENTS.md:**

```markdown
# Startup App Development

## Stack

- Next.js 14, TypeScript, Tailwind CSS
- Supabase (auth + database)
- Vercel deployment

## Commands

\`\`\`bash
npm run dev
npm run build
npm test
\`\`\`

## Standards

- Use App Router (not Pages Router)
- Server Components by default
- Client Components only when needed (use "use client")
- Tailwind for styling (no CSS modules)
```

### Caso 2: Empresa con Múltiples Equipos

**Estructura:**

```
enterprise-app/
├── .cursor/
│   └── rules/
│       ├── corporate-security.mdc      # Team Rule (enforced)
│       ├── typescript-standards.mdc    # Project Rule
│       ├── react-components.mdc        # Project Rule
│       └── api-guidelines.mdc          # Project Rule
└── src/
```

**.cursor/rules/corporate-security.mdc (Team Rule):**

```markdown
---
description: "Corporate security standards (REQUIRED)"
alwaysApply: true
---

# Security Standards

## Authentication

- OAuth 2.0 only (no custom auth)
- Use corporate SSO
- JWT tokens expire in 1 hour

## Data Handling

- Encrypt PII at rest and in transit
- No credentials in code
- Use approved secret management (Vault)
```

**.cursor/rules/typescript-standards.mdc:**

```markdown
---
description: "TypeScript coding standards"
alwaysApply: true
---

# TypeScript Standards

- Strict mode enabled
- No `any` without `// @ts-expect-error` + justification
- Prefer `interface` over `type` for objects
- Export types from `*.types.ts` files
```

**.cursor/rules/react-components.mdc:**

```markdown
---
description: "React component standards"
globs: ["src/components/**/*.tsx", "src/app/**/*.tsx"]
---

# React Component Standards

## Structure

- Functional components only
- TypeScript props required
- Props interface named `I{ComponentName}Props`

## File organization

\`\`\`
ComponentName/
├── ComponentName.tsx
├── ComponentName.test.tsx
├── ComponentName.module.css
└── index.ts
\`\`\`
```

### Caso 3: Proyecto con Arquitectura Modular

**Estructura:**

```
modular-app/
├── AGENTS.md                           # General
├── packages/
│   ├── ui/
│   │   └── AGENTS.md                   # UI-specific
│   ├── api/
│   │   └── AGENTS.md                   # API-specific
│   └── shared/
│       └── AGENTS.md                   # Shared utilities
```

**packages/ui/AGENTS.md:**

```markdown
# UI Package

Design system components built with Radix UI + Tailwind.

## Component Development

- All components in `src/components/`
- Use Radix UI primitives as base
- Style with Tailwind classes
- Export from `src/index.ts`

## Storybook

- Every component must have a story
- Include all variants
- Document props with JSDoc
```

**packages/api/AGENTS.md:**

```markdown
# API Package

REST API with Express + PostgreSQL.

## Endpoint Development

- Route handlers in `src/routes/`
- Business logic in `src/services/`
- Database queries in `src/repositories/`
- Validate with Zod schemas

## Testing

- Integration tests for all endpoints
- Use test database (`.env.test`)
- Reset database between tests
```

## Comandos y Atajos

| Acción                    | Método                                  |
| ------------------------- | --------------------------------------- |
| Aplicar regla manualmente | `@rule-name` en chat                    |
| Ver reglas activas        | No hay comando específico               |
| Editar Project Rules      | Abrir archivos en `.cursor/rules/`      |
| Editar User Rules         | Cursor Settings → Rules                 |
| Editar Team Rules         | Cursor Dashboard → Team Settings        |
| Migrar desde .cursorrules | Copiar a `.cursor/rules/` o `AGENTS.md` |

## Troubleshooting

### Problema: Reglas no se aplican

**Soluciones:**

1. Verificar que el archivo está en `.cursor/rules/` o es `AGENTS.md`
2. Revisar frontmatter (sintaxis YAML correcta)
3. Comprobar patrones glob si usas `globs`
4. Reiniciar Cursor

### Problema: Regla se aplica demasiado frecuentemente

**Soluciones:**

1. Cambiar `alwaysApply: true` a `alwaysApply: false`
2. Agregar `globs` para limitar a archivos específicos
3. Convertir a aplicación manual (remover `alwaysApply` y `globs`)

### Problema: Conflicto entre Team y Project Rules

**Solución:**

- Las Team Rules tienen precedencia
- Si una Team Rule es "Required", no puede ser sobrescrita
- Contactar al admin del equipo para modificar Team Rules

### Problema: Archivo muy largo (>500 líneas)

**Soluciones:**

1. Dividir en múltiples archivos temáticos
2. Mover contenido extenso a documentación separada
3. Referenciar documentación en vez de copiarla
4. Usar AGENTS.md anidados en subdirectorios

## Referencias

- [Documentación Oficial - Cursor Rules](https://cursor.com/docs/context/rules)
- [Cursor Documentation](https://cursor.com/docs)
- [AGENTS.md Standard](https://agents.md)
- [Comparación con CLAUDE.md](./memory-and-rules.md)
- [Comparación con GEMINI.md](./gemini-md.md)

---

**Nota:** Cursor Rules es uno de los sistemas más completos de contexto para editores con IA, ofreciendo múltiples niveles de configuración (user, project, team) y modos de aplicación flexibles. La combinación de `.cursor/rules/` para reglas estructuradas y `AGENTS.md` para simplicidad proporciona opciones para equipos de todos los tamaños, desde startups hasta empresas con múltiples equipos.
