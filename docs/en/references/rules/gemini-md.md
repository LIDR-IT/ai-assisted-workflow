# GEMINI.md - Sistema de Contexto en Gemini CLI

Este documento explica el sistema de archivos GEMINI.md en Gemini CLI, un mecanismo similar a CLAUDE.md que permite proporcionar contexto e instrucciones persistentes al modelo Gemini.

## Vista General

Los archivos GEMINI.md proporcionan contexto instruccional al modelo Gemini. En lugar de repetir instrucciones en cada prompt, los desarrolladores pueden definirlas una vez en un archivo de contexto para asegurar que las respuestas del AI sean "más precisas y adaptadas a sus necesidades".

## Propósito

El sistema GEMINI.md permite:

- ✅ Definir instrucciones una sola vez, reutilizarlas en todas las conversaciones
- ✅ Mantener consistencia en estilos de código y convenciones
- ✅ Proporcionar contexto específico del proyecto sin repetición
- ✅ Personalizar el comportamiento del modelo por proyecto o módulo
- ✅ Compartir convenciones con el equipo vía control de versiones

## Jerarquía de Archivos

Gemini CLI usa un sistema jerárquico de tres niveles:

| Nivel | Ubicación | Alcance | Uso |
|-------|-----------|---------|-----|
| **1. Global Context** | `~/.gemini/GEMINI.md` | Todos los proyectos del usuario | Preferencias personales globales |
| **2. Project-Level** | `GEMINI.md` en directorio actual o padres hasta raíz `.git` | Todo el proyecto | Convenciones del equipo, estándares del proyecto |
| **3. Sub-directory Context** | `GEMINI.md` en subdirectorios | Componente o módulo específico | Guías específicas por módulo/componente |

### Características de la Jerarquía

- **Cascada**: El contexto se acumula desde global → proyecto → subdirectorio
- **Respeta .gitignore**: Los archivos GEMINI.md respetan reglas de `.gitignore` y `.geminiignore`
- **Búsqueda hacia arriba**: Desde el directorio actual sube hasta encontrar la raíz `.git`
- **Footer activo**: El CLI muestra cuántos archivos de contexto están activos

## Contenido Típico

Los archivos GEMINI.md suelen incluir:

### 1. Preferencias de Estilo de Código

```markdown
# Estilo de Código

- Usar indentación de 2 espacios
- Preferir single quotes para strings
- Añadir trailing commas en objetos y arrays
- Nombres de variables en camelCase
- Nombres de constantes en UPPER_SNAKE_CASE
```

### 2. Guías Específicas de Lenguaje

```markdown
# Convenciones TypeScript

- Todas las interfaces deben tener prefijo "I" (ej: `IUser`, `IProduct`)
- Usar type aliases para unions complejos
- Exportar tipos desde archivos `*.types.ts`
- Preferir `interface` sobre `type` para objetos
```

### 3. Personas del Proyecto

```markdown
# Contexto del Proyecto

Este es un proyecto de e-commerce en React + TypeScript.

**Stack:**
- Frontend: React 18, TypeScript, Vite
- Backend: Node.js, Express, PostgreSQL
- Testing: Vitest, React Testing Library

**Arquitectura:**
- Componentes en `src/components/`
- Hooks en `src/hooks/`
- Servicios API en `src/services/`
```

### 4. Requisitos de Documentación

```markdown
# Documentación

- Todas las funciones públicas deben incluir JSDoc comments
- Incluir ejemplos en JSDoc para funciones complejas
- Documentar parámetros, returns y throws

**Formato JSDoc:**

\`\`\`typescript
/**
 * Calcula el precio total con impuestos.
 * @param subtotal - Precio sin impuestos
 * @param taxRate - Tasa de impuesto (ej: 0.16 para 16%)
 * @returns Precio total incluyendo impuestos
 * @throws {Error} Si taxRate es negativo
 * @example
 * calculateTotal(100, 0.16) // 116
 */
function calculateTotal(subtotal: number, taxRate: number): number {
  // ...
}
\`\`\`
```

## Comandos de Gestión

El comando `/memory` controla el contexto:

### `/memory show`
Muestra el contenido concatenado de todos los archivos de contexto activos.

```bash
> /memory show
```

**Salida:**
```
=== Global Context (~/. gemini/GEMINI.md) ===
[contenido del archivo global]

=== Project Context (./GEMINI.md) ===
[contenido del archivo de proyecto]

=== Sub-directory Context (./components/GEMINI.md) ===
[contenido del subdirectorio]
```

### `/memory refresh`
Recarga todos los archivos GEMINI.md desde el disco.

```bash
> /memory refresh
```

Útil cuando:
- Has editado archivos GEMINI.md fuera del CLI
- Cambiaste de directorio y quieres actualizar el contexto
- Agregaste nuevos archivos GEMINI.md

### `/memory add <text>`
Agrega texto al archivo GEMINI.md global.

```bash
> /memory add Preferir async/await sobre promises con .then()
```

Esto añade la línea al final de `~/.gemini/GEMINI.md`.

## Modularización

Los archivos GEMINI.md grandes pueden dividirse usando sintaxis de importación de archivos:

```markdown
# Mi Proyecto

## Documentación General
@./docs/overview.md

## Estándares de Código
@./docs/code-standards.md

## Arquitectura
@./docs/architecture.md

## Guías Específicas
@./docs/api-guidelines.md
@./docs/testing-guidelines.md
```

### Características de Imports

- **Rutas relativas**: `@./path/to/file.md`
- **Rutas absolutas**: `@/absolute/path/to/file.md`
- **Cualquier extensión**: Soporta `.md`, `.txt`, o cualquier archivo de texto
- **Recursivo**: Los archivos importados pueden importar otros archivos

## Configuración Personalizada

El nombre de archivo por defecto puede personalizarse en `settings.json`:

### Ubicación
`~/.gemini/settings.json`

### Configuración de Nombre de Archivo

```json
{
  "context": {
    "fileName": ["AGENTS.md", "CONTEXT.md", "GEMINI.md"]
  }
}
```

**Características:**
- Acepta **array de nombres**: El CLI buscará cualquiera de los nombres especificados
- **Orden de precedencia**: El primer archivo encontrado se usa
- **Flexibilidad**: Permite migración desde otros sistemas (AGENTS.md, CONTEXT.md, etc.)

### Ejemplo de Uso Mixto

```json
{
  "context": {
    "fileName": ["CLAUDE.md", "GEMINI.md", "AGENTS.md"]
  }
}
```

Esto permite usar el mismo archivo de contexto para múltiples CLIs de IA.

## Casos de Uso

### 1. Desarrollo Individual

**Archivo:** `~/.gemini/GEMINI.md`

```markdown
# Mis Preferencias Globales

- Siempre explicar el razonamiento detrás de las soluciones
- Preferir soluciones simples sobre complejas
- Incluir ejemplos de uso en explicaciones
- Usar emojis para mejor legibilidad: ✅ ❌ ⚠️ 💡
```

### 2. Proyecto de Equipo

**Archivo:** `./GEMINI.md`

```markdown
# Proyecto E-commerce

## Comandos Comunes

\`\`\`bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm test             # Tests
npm run lint         # Linter
npm run type-check   # TypeScript check
\`\`\`

## Estructura del Proyecto

\`\`\`
src/
├── components/      # Componentes React
├── hooks/           # Custom hooks
├── services/        # API services
├── utils/           # Utilidades
├── types/           # Type definitions
└── __tests__/       # Tests
\`\`\`

## Convenciones

- Componentes: PascalCase (ej: `UserProfile.tsx`)
- Hooks: camelCase con prefijo "use" (ej: `useAuth.ts`)
- Utilidades: camelCase (ej: `formatDate.ts`)
- Tests: `*.test.ts` o `*.test.tsx`
```

### 3. Contexto por Módulo

**Archivo:** `./src/components/GEMINI.md`

```markdown
# Componentes React

## Reglas de Componentes

1. Todos los componentes deben ser funcionales (no class components)
2. Usar TypeScript para todas las props
3. Exportar tipos de props junto al componente
4. Incluir PropTypes solo para componentes publicados

## Estructura de Archivo

\`\`\`typescript
import { FC } from 'react';

// Types
interface IButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

// Component
export const Button: FC<IButtonProps> = ({
  label,
  onClick,
  variant = 'primary'
}) => {
  return (
    <button className={variant} onClick={onClick}>
      {label}
    </button>
  );
};
\`\`\`

## Testing

- Cada componente debe tener archivo de test correspondiente
- Usar React Testing Library
- Testear comportamiento, no implementación
```

## Mejores Prácticas

### ✅ Organización Clara

**Bien:**
```markdown
# Estilo de Código

## JavaScript
- Usar const/let, no var
- Preferir arrow functions

## CSS
- Usar BEM naming
- Mobile-first approach
```

**Mal:**
```markdown
Usa const y let. También arrow functions. Para CSS usa BEM y piensa en mobile primero.
```

### ✅ Especificidad

**Bien:**
```markdown
- Máximo 80 caracteres por línea
- Indentación de 2 espacios
```

**Mal:**
```markdown
- Código limpio y legible
```

### ✅ Ejemplos Cuando Sea Útil

**Bien:**
```markdown
## Manejo de Errores

Siempre envolver API calls en try-catch:

\`\`\`typescript
try {
  const data = await fetchUser(id);
  return data;
} catch (error) {
  logger.error('Failed to fetch user', error);
  throw new UserFetchError(error);
}
\`\`\`
```

### ✅ Modularización para Proyectos Grandes

En lugar de un GEMINI.md gigante:

```
.
├── GEMINI.md                 # Imports y overview
├── docs/
│   ├── code-style.md        # Importado
│   ├── architecture.md      # Importado
│   ├── testing.md           # Importado
│   └── deployment.md        # Importado
```

**GEMINI.md:**
```markdown
# Mi Proyecto

@./docs/code-style.md
@./docs/architecture.md
@./docs/testing.md
@./docs/deployment.md
```

### ✅ Actualización Regular

- Revisar GEMINI.md cuando cambien convenciones
- Remover reglas obsoletas
- Mantener sincronizado con la realidad del proyecto

## Comparación con Otros Sistemas

| Característica | Gemini CLI (GEMINI.md) | Claude Code (CLAUDE.md) |
|----------------|------------------------|-------------------------|
| **Jerarquía** | Global → Proyecto → Subdirectorio | Managed → Project → Project Rules → User → Local |
| **Modularización** | `@./path` imports | `@path` imports + `.claude/rules/` |
| **Comandos** | `/memory show/refresh/add` | `/memory`, `/init` |
| **Configuración** | `settings.json` - array de nombres | Nombres fijos por tipo |
| **Reglas condicionales** | No mencionado | YAML frontmatter con `paths` |
| **Gitignore** | Respeta `.gitignore` y `.geminiignore` | `CLAUDE.local.md` auto-gitignored |

## Flujo de Trabajo Recomendado

### 1. Inicialización de Proyecto

```bash
# Crear GEMINI.md en proyecto
echo "# Mi Proyecto" > GEMINI.md
echo "" >> GEMINI.md
echo "## Comandos Comunes" >> GEMINI.md
echo "\`\`\`bash" >> GEMINI.md
echo "npm run dev" >> GEMINI.md
echo "\`\`\`" >> GEMINI.md
```

### 2. Configuración Personal

```bash
# Editar contexto global
> /memory add Siempre explicar el código paso a paso
```

### 3. Durante Desarrollo

```bash
# Ver contexto activo
> /memory show

# Actualizar después de editar archivos
> /memory refresh
```

### 4. Por Módulo

```bash
# En directorio de componentes
cd src/components
cat > GEMINI.md << 'EOF'
# Componentes

- Usar TypeScript
- Componentes funcionales
- Incluir tests
EOF
```

## Indicador de Contexto Activo

El footer del CLI muestra cuántos archivos de contexto están activos:

```
📄 Context: 3 files active
```

Esto indica:
- 1 archivo global (`~/.gemini/GEMINI.md`)
- 1 archivo de proyecto (`./GEMINI.md`)
- 1 archivo de subdirectorio (ej: `./src/components/GEMINI.md`)

## Limitaciones y Consideraciones

### ⚠️ Sin Reglas Condicionales Nativas

A diferencia de Claude Code que soporta YAML frontmatter con `paths`, Gemini CLI no tiene sintaxis nativa para reglas condicionales por archivo.

**Workaround:** Usar subdirectorios con GEMINI.md específicos.

### ⚠️ Orden de Carga

El orden exacto de precedencia cuando hay múltiples archivos no está documentado explícitamente. Se asume que es:
1. Global
2. Proyecto (de raíz hacia subdirectorio)
3. Subdirectorio actual

### ⚠️ Límites de Tamaño

No hay límites documentados sobre el tamaño de archivos GEMINI.md, pero archivos muy grandes pueden:
- Consumir tokens del contexto
- Afectar rendimiento
- Reducir espacio para conversación

**Recomendación:** Mantener archivos concisos y usar modularización.

## Ejemplo Completo: Proyecto React

```
my-react-app/
├── .git/
├── .gitignore
├── GEMINI.md                          # Contexto principal
├── docs/
│   ├── code-standards.md              # Importado desde GEMINI.md
│   └── architecture.md                # Importado desde GEMINI.md
├── src/
│   ├── components/
│   │   ├── GEMINI.md                  # Contexto de componentes
│   │   ├── Button.tsx
│   │   └── Button.test.tsx
│   ├── hooks/
│   │   ├── GEMINI.md                  # Contexto de hooks
│   │   └── useAuth.ts
│   └── services/
│       ├── GEMINI.md                  # Contexto de servicios
│       └── api.ts
└── package.json
```

**./GEMINI.md:**
```markdown
# My React App

E-commerce application built with React, TypeScript, and Vite.

## Project Commands
@./docs/commands.md

## Code Standards
@./docs/code-standards.md

## Architecture
@./docs/architecture.md

## Stack
- React 18
- TypeScript 5
- Vite
- React Router
- TanStack Query
```

**./src/components/GEMINI.md:**
```markdown
# React Components

- Functional components only
- TypeScript for all props
- Export prop types
- Co-locate tests with components
- Use React Testing Library
```

**./src/hooks/GEMINI.md:**
```markdown
# Custom Hooks

- Prefix with "use" (e.g., `useAuth`, `useCart`)
- Return objects, not arrays (for better naming)
- Document hook purpose and params with JSDoc
- Include usage example in JSDoc
```

## Referencias

- [Documentación Oficial - GEMINI.md](https://geminicli.com/docs/cli/gemini-md/)
- [Gemini CLI Documentation](https://geminicli.com/docs)
- [Comparación con CLAUDE.md](./memory-and-rules.md)
- [AGENTS.md Standard](https://agents.md)

---

**Nota:** El sistema GEMINI.md es conceptualmente similar a CLAUDE.md y otros sistemas de contexto para CLIs de IA. La elección entre uno u otro depende principalmente del CLI que uses, aunque existe la posibilidad de usar archivos compartidos configurando nombres personalizados en `settings.json`.
