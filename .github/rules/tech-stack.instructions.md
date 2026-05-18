---
description: LIDR SDLC: Tech stack conventions — TypeScript strict, React 18+, Node 20 LTS, ESM, Tailwind v4. Load when writing, reviewing or generating code.
applyTo: "src/**/*.ts,  src/**/*.tsx,  *.ts,  *.tsx,  *.js,  *.jsx,  *.mjs,  *.css"
---

# Rule: Convenciones del Stack Tecnológico

> **Nivel**: Técnico (Nivel 1)
> **Carga**: Bajo demanda — se carga automáticamente al trabajar con código (via description + globs).
> **Propósito**: Define CÓMO se escribe código en esta organización. Todo código generado por IA DEBE seguir estas convenciones.
> **Complementa a**: `org.md` (estándares organizacionales) y `project.md` (contexto específico del proyecto)


## 1. Stack Tecnológico Principal

### 1.1 Mapa de Tecnologías

| Capa               | Tecnología           | Versión Mínima        | Notas                                         |
| ------------------ | -------------------- | --------------------- | --------------------------------------------- |
| **Frontend**       | React + TypeScript   | React 18.2+, TS 5.0+  | Funcional con hooks, strict mode              |
| **Estilos**        | Tailwind CSS         | v4.0+                 | Utility-first, design tokens en `theme.css`   |
| **Backend**        | Node.js + TypeScript | Node 20 LTS+, TS 5.0+ | ESM modules, strict mode                      |
| **API**            | REST + OpenAPI       | OpenAPI 3.1           | Contract-first: spec antes de implementar     |
| **Base de Datos**  | PostgreSQL           | 15+                   | Migraciones versionadas, connection pooling   |
| **ORM / Query**    | Prisma o TypeORM     | Latest stable         | Prisma preferido para proyectos nuevos        |
| **Caché**          | Redis                | 7+                    | Session store, cache layer, rate limiting     |
| **Message Queue**  | RabbitMQ / SQS       | —                     | Para procesos asíncronos y eventos            |
| **Contenedores**   | Docker               | 24+                   | Multi-stage builds, non-root user             |
| **Orquestación**   | Kubernetes           | 1.28+                 | Helm charts, HPA, rolling updates             |
| **CI/CD**          | GitHub Actions       | —                     | Pipelines declarativos, secrets en Vault      |
| **Monitoreo**      | Datadog / NewRelic   | —                     | APM, logs, métricas custom, alertas           |
| **Error Tracking** | Sentry               | —                     | Source maps, breadcrumbs, alertas por release |

### 1.2 Decisiones Arquitectónicas Vigentes

- **Microservicios** con API Gateway para dominio core
- **Monolito modular** para backoffice y herramientas internas
- **Event-driven** para procesos asíncronos (procesamiento biométrico, notificaciones)
- **CQRS** para operaciones de lectura intensiva (dashboards, reportes)
- **Repository pattern** para acceso a datos (abstracción de ORM)


## 2. TypeScript — Convenciones Estrictas

### 2.1 Configuración Base

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "exactOptionalPropertyTypes": true,
    "forceConsistentCasingInFileNames": true,
    "isolatedModules": true,
    "moduleResolution": "bundler",
    "target": "ES2022",
    "lib": ["ES2023", "DOM", "DOM.Iterable"]
  }
}
```

### 2.2 Reglas de Tipos

| Regla                            | Correcto                                         | Incorrecto                              | Por Qué                                                        |
| -------------------------------- | ------------------------------------------------ | --------------------------------------- | -------------------------------------------------------------- |
| No `any`                         | `unknown`, tipo explícito, o genérico            | `any`, `as any`                         | Pierde toda seguridad de tipos                                 |
| Interfaces para objetos públicos | `interface UserProps { ... }`                    | `type UserProps = { ... }`              | Interfaces son extensibles, mejores mensajes de error          |
| Types para uniones/utilidades    | `type Status = 'active' \| 'inactive'`           | `enum Status { ... }`                   | Union types son más ligeros y tree-shakeable                   |
| Enums solo para valores fijos    | `enum HttpStatus { OK = 200 }`                   | `enum Color { Red, Blue }` (usar union) | Enums generan código JS; union types solo existen en TS        |
| Readonly por defecto             | `readonly` en props e interfaces                 | Propiedades mutables sin justificación  | Previene mutación accidental                                   |
| Narrowing explícito              | Type guards con `is`                             | Casts con `as`                          | Type guards validan en runtime; `as` solo engaña al compilador |
| No assertion `!`                 | Optional chaining `?.` + nullish coalescing `??` | `user!.name`                            | `!` silencia errores legítimos                                 |

### 2.3 Patrones de Tipos Avanzados

```typescript
// ✅ Result pattern para operaciones falibles
type Result<T, E = Error> = { success: true; data: T } | { success: false; error: E };

// ✅ Branded types para IDs (evita mezclar UserId con ProjectId)
type UserId = string & { readonly __brand: "UserId" };
type ProjectId = string & { readonly __brand: "ProjectId" };

// ✅ Exhaustive checking
function assertNever(x: never): never {
  throw new Error(`Unexpected value: ${x}`);
}

// ✅ Discriminated unions para estados
type AsyncState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: Error };
```


## 3. React — Convenciones de Componentes

### 3.1 Reglas Fundamentales

- **Solo componentes funcionales** con hooks. No class components.
- **Props destructuradas** en la firma de la función
- **Separación presentación / lógica**: componentes "tontos" (UI) + hooks (lógica)
- **Keys estables**: NUNCA usar `index` como key si hay reordenamiento o eliminación
- **Co-locación**: tests, tipos, y estilos junto al componente

### 3.2 Estructura de un Componente

```typescript
// 1. Imports (agrupados: react → librerías → componentes → hooks → utils → types)
import { useState, useCallback, memo } from 'react';
import { Button } from '@/components/ui/button';
import { useUser } from '@/hooks/useUser';
import type { UserProfile } from '@/types/user';

// 2. Types/Interfaces del componente
interface UserCardProps {
  readonly userId: string;
  readonly onSelect?: (user: UserProfile) => void;
  readonly className?: string;
}

// 3. Componente (named export, nunca default export para componentes internos)
export function UserCard({ userId, onSelect, className }: UserCardProps) {
  // 3a. Hooks primero
  const { user, isLoading } = useUser(userId);
  const [isExpanded, setIsExpanded] = useState(false);

  // 3b. Callbacks memoizados
  const handleSelect = useCallback(() => {
    if (user && onSelect) {
      onSelect(user);
    }
  }, [user, onSelect]);

  // 3c. Early returns para estados especiales
  if (isLoading) return <UserCardSkeleton />;
  if (!user) return null;

  // 3d. Render
  return (
    <div className={cn('rounded-lg border p-4', className)}>
      {/* JSX */}
    </div>
  );
}

// 4. Sub-componentes privados (mismo archivo si son pequeños)
function UserCardSkeleton() {
  return <div className="animate-pulse" />;
}
```

### 3.3 Hooks — Cuándo y Cómo

| Hook          | Cuándo Usar                                      | Cuándo NO Usar                                  |
| ------------- | ------------------------------------------------ | ----------------------------------------------- |
| `useState`    | Estado local del componente                      | Estado compartido (usar Context o store)        |
| `useReducer`  | Estado complejo con múltiples transiciones       | Estado simple (boolean, string)                 |
| `useCallback` | Callbacks pasados como props a hijos `memo`      | Callbacks que no causan re-renders innecesarios |
| `useMemo`     | Cómputos costosos (> 1ms) o referencias estables | Todo — memoizar tiene costo propio              |
| `useEffect`   | Sincronización con sistemas externos             | Derivar estado (usar variables computadas)      |
| `useRef`      | DOM refs, valores persistentes sin re-render     | Estado que debe causar re-render                |
| Custom hooks  | Lógica reutilizable, abstracción de side effects | Lógica específica de un componente              |

### 3.4 Anti-patrones React (la IA NUNCA debe generar)

```typescript
// ❌ NUNCA: Definir componentes dentro de otros componentes
function Parent() {
  // Esto crea un nuevo componente en cada render
  function Child() { return <div />; }  // ❌
  return <Child />;
}

// ❌ NUNCA: useEffect para derivar estado
useEffect(() => {
  setFullName(`${firstName} ${lastName}`);  // ❌
}, [firstName, lastName]);
// ✅ CORRECTO: Variable derivada
const fullName = `${firstName} ${lastName}`;

// ❌ NUNCA: Mutar estado directamente
items.push(newItem);  // ❌
setItems(items);      // ❌
// ✅ CORRECTO: Nuevo array/objeto
setItems([...items, newItem]);

// ❌ NUNCA: Fetch en useEffect sin cleanup
useEffect(() => {
  fetch('/api/data').then(setData);  // ❌ Sin AbortController
}, []);
// ✅ CORRECTO: Con AbortController
useEffect(() => {
  const controller = new AbortController();
  fetch('/api/data', { signal: controller.signal }).then(setData);
  return () => controller.abort();
}, []);

// ❌ NUNCA: Index como key con listas dinámicas
items.map((item, index) => <Item key={index} />);  // ❌
// ✅ CORRECTO: ID estable
items.map((item) => <Item key={item.id} />);
```

### 3.5 State Management

| Alcance                  | Solución                            | Ejemplo                            |
| ------------------------ | ----------------------------------- | ---------------------------------- |
| **Componente**           | `useState` / `useReducer`           | Toggle, form local                 |
| **Árbol de componentes** | Context + `useReducer`              | Theme, auth, locale                |
| **Aplicación**           | Zustand (preferido) o Redux Toolkit | Cart, user session, notificaciones |
| **Servidor**             | TanStack Query (React Query)        | Cache de API, optimistic updates   |
| **URL**                  | React Router (searchParams)         | Filtros, paginación, tabs          |


## 4. API Design — REST + OpenAPI

### 4.1 Contract-First

> La API spec (OpenAPI) se escribe ANTES del código. Es la "spec" de SDD aplicada a APIs.

### 4.2 Convenciones REST

| Acción              | Método   | Path                | Status Code                |
| ------------------- | -------- | ------------------- | -------------------------- |
| Listar              | `GET`    | `/api/v1/users`     | `200 OK`                   |
| Obtener uno         | `GET`    | `/api/v1/users/:id` | `200 OK` / `404 Not Found` |
| Crear               | `POST`   | `/api/v1/users`     | `201 Created`              |
| Actualizar completo | `PUT`    | `/api/v1/users/:id` | `200 OK`                   |
| Actualizar parcial  | `PATCH`  | `/api/v1/users/:id` | `200 OK`                   |
| Eliminar            | `DELETE` | `/api/v1/users/:id` | `204 No Content`           |

### 4.3 Formato de Respuesta Estándar

```typescript
// Respuesta exitosa
interface ApiResponse<T> {
  data: T;
  meta?: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}

// Respuesta de error
interface ApiError {
  error: {
    code: string; // 'USER_NOT_FOUND', 'VALIDATION_ERROR'
    message: string; // Mensaje legible para el desarrollador
    details?: unknown[]; // Detalles de validación
    traceId: string; // ID para correlacionar con logs
  };
}
```

### 4.4 Versionado de API

- Versionado en URL: `/api/v1/`, `/api/v2/`
- Mantener máximo 2 versiones activas simultáneamente
- Deprecación con header `Sunset` + 3 meses de aviso


## 5. Manejo de Errores

### 5.1 Filosofía

> Los errores son ciudadanos de primera clase. Se manejan explícitamente, se clasifican, y se reportan con contexto.

### 5.2 Jerarquía de Errores

```typescript
// Error base con contexto
class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 500,
    public readonly isOperational: boolean = true, // true = esperado, false = bug
    public readonly context?: Record<string, unknown>
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

// Errores específicos
class ValidationError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, "VALIDATION_ERROR", 400, true, context);
  }
}

class NotFoundError extends AppError {
  constructor(resource: string, id: string) {
    super(`${resource} with id ${id} not found`, "NOT_FOUND", 404, true, { resource, id });
  }
}

class UnauthorizedError extends AppError {
  constructor(message = "Authentication required") {
    super(message, "UNAUTHORIZED", 401, true);
  }
}

class ForbiddenError extends AppError {
  constructor(message = "Insufficient permissions") {
    super(message, "FORBIDDEN", 403, true);
  }
}
```

### 5.3 Reglas de Manejo

- **Catch específico**: Capturar errores esperados, no genéricos
- **No silenciar**: Nunca `catch (e) {}` vacío. Log o re-throw siempre
- **Error boundaries**: En React, envolver secciones con `ErrorBoundary`
- **Logging**: Errores operacionales → warn; errores de programación → error + alerta
- **No exponer internos**: Mensajes de error al cliente nunca revelan stack, paths, o SQL


## 6. Seguridad en Código

### 6.1 Input Validation

```typescript
// ✅ SIEMPRE validar inputs con zod o joi
import { z } from "zod";

const CreateUserSchema = z.object({
  email: z.string().email().max(255),
  name: z.string().min(2).max(100).trim(),
  role: z.enum(["admin", "user", "viewer"]),
});

// Usar en endpoint:
const parsed = CreateUserSchema.safeParse(req.body);
if (!parsed.success) {
  throw new ValidationError("Invalid input", { errors: parsed.error.flatten() });
}
```

### 6.2 Reglas Críticas de Seguridad

| Regla                  | Implementación                                                               |
| ---------------------- | ---------------------------------------------------------------------------- |
| Queries parametrizadas | Prisma/TypeORM lo hacen automáticamente. NUNCA concatenar SQL                |
| XSS prevention         | React escapa por defecto. NUNCA usar `dangerouslySetInnerHTML` sin sanitizar |
| CSRF                   | Token en headers, `SameSite=Strict` en cookies                               |
| Rate limiting          | Implementar en API Gateway + por endpoint sensible                           |
| CORS                   | Origins específicos, NUNCA `*` en producción                                 |
| Headers de seguridad   | CSP, HSTS, X-Frame-Options, X-Content-Type-Options                           |
| Secrets                | NUNCA en código. Usar variables de entorno + Vault                           |
| Autenticación          | JWT con expiration corta + refresh token seguro                              |
| Autorización           | RBAC verificado en CADA endpoint, no solo en frontend                        |
| File uploads           | Validar tipo MIME real (no solo extensión), límite de tamaño, scan antivirus |

### 6.3 Lo que la IA NUNCA debe generar

```typescript
// ❌ SQL concatenado
`SELECT * FROM users WHERE id = '${userId}'`

// ❌ Secrets hardcoded
const API_KEY = 'sk-live-abc123';

// ❌ Logging de datos sensibles
console.log('User data:', { password, biometricTemplate, ssn });

// ❌ CORS wildcard en producción
app.use(cors({ origin: '*' }));

// ❌ eval() o Function()
eval(userInput);

// ❌ dangerouslySetInnerHTML sin sanitizar
<div dangerouslySetInnerHTML={{ __html: userInput }} />
```


## 7. Testing Strategy

### 7.1 Pirámide de Testing

```
        /  E2E  \          ← Pocos, lentos, frágiles (Cypress/Playwright)
       / Integr.  \        ← Moderados (supertest + testcontainers)
      /  Unitarios  \      ← Muchos, rápidos, estables (Jest + RTL)
```

### 7.2 Herramientas

| Tipo              | Herramienta                      | Alcance                             |
| ----------------- | -------------------------------- | ----------------------------------- |
| Unitarios         | Jest + React Testing Library     | Funciones puras, hooks, componentes |
| Integración       | Jest + supertest                 | Endpoints API, flujos de servicio   |
| E2E               | Playwright (preferido) / Cypress | User journeys críticos              |
| Visual regression | Playwright screenshots           | Componentes UI clave                |
| Performance       | k6 / Artillery                   | Load testing pre-release            |

### 7.3 Convenciones de Testing

```typescript
// Patrón AAA (Arrange, Act, Assert)
describe("UserService", () => {
  describe("createUser", () => {
    it("should create a user with valid data", async () => {
      // Arrange
      const input = { email: "test@example.com", name: "Test User" };

      // Act
      const result = await userService.createUser(input);

      // Assert
      expect(result.success).toBe(true);
      expect(result.data.email).toBe(input.email);
    });

    it("should reject duplicate email", async () => {
      // Arrange
      await userService.createUser({ email: "dup@example.com", name: "First" });

      // Act & Assert
      await expect(
        userService.createUser({ email: "dup@example.com", name: "Second" })
      ).rejects.toThrow(ValidationError);
    });
  });
});
```

### 7.4 Cobertura

| Área                         | Mínimo | Ideal |
| ---------------------------- | ------ | ----- |
| Lógica de negocio (services) | 80%    | 90%+  |
| Utilidades (utils)           | 90%    | 95%+  |
| Componentes React            | 70%    | 80%+  |
| API endpoints                | 80%    | 90%+  |
| Global del proyecto          | 60%    | 75%+  |


## 8. Naming Conventions

### 8.1 Ficheros y Directorios

| Tipo             | Convención                      | Ejemplo                             |
| ---------------- | ------------------------------- | ----------------------------------- |
| Componente React | `PascalCase.tsx`                | `UserCard.tsx`                      |
| Hook             | `useCamelCase.ts`               | `useUserProfile.ts`                 |
| Servicio         | `camelCase.service.ts`          | `user.service.ts`                   |
| Utilidad         | `camelCase.ts`                  | `formatDate.ts`                     |
| Test             | `*.test.ts(x)` o `*.spec.ts(x)` | `UserCard.test.tsx`                 |
| Tipo / Interface | `camelCase.types.ts`            | `user.types.ts`                     |
| Constantes       | `camelCase.constants.ts`        | `api.constants.ts`                  |
| Configuración    | `camelCase.config.ts`           | `database.config.ts`                |
| Migración DB     | `YYYYMMDDHHMMSS_description.ts` | `20250101120000_add_users_table.ts` |

### 8.2 Código

| Tipo                  | Convención                           | Ejemplo                           |
| --------------------- | ------------------------------------ | --------------------------------- |
| Variables y funciones | `camelCase`                          | `getUserById`, `isActive`         |
| Constantes            | `UPPER_SNAKE_CASE`                   | `MAX_RETRY_COUNT`, `API_BASE_URL` |
| Tipos e interfaces    | `PascalCase`                         | `UserProfile`, `ApiResponse`      |
| Enums                 | `PascalCase` + miembros `PascalCase` | `HttpStatus.NotFound`             |
| Booleanos             | Prefijo `is`, `has`, `should`, `can` | `isLoading`, `hasPermission`      |
| Handlers              | Prefijo `handle` o `on`              | `handleSubmit`, `onUserSelect`    |
| API endpoints         | Sustantivos plurales, kebab-case     | `/api/v1/user-profiles`           |


## 9. Git Workflow

### 9.1 Branching Strategy

```
main ──────────────────────────────────────────► (producción)
  │
  ├─ develop ──────────────────────────────────► (integración)
  │    │
  │    ├─ feat/PROJ-123-user-registration ──► merge a develop
  │    ├─ fix/PROJ-456-login-timeout ───────► merge a develop
  │    └─ refactor/PROJ-789-auth-service ───► merge a develop
  │
  ├─ release/1.2.0 ────────────────────────────► merge a main + tag
  │
  └─ hotfix/PROJ-999-critical-fix ─────────────► merge a main + develop
```

### 9.2 Conventional Commits

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

| Type       | Cuándo                               | Ejemplo                                    |
| ---------- | ------------------------------------ | ------------------------------------------ |
| `feat`     | Nueva funcionalidad                  | `feat(auth): add MFA verification flow`    |
| `fix`      | Corrección de bug                    | `fix(api): handle timeout in user service` |
| `docs`     | Solo documentación                   | `docs(readme): update setup instructions`  |
| `style`    | Formato, sin cambio lógico           | `style(lint): fix eslint warnings`         |
| `refactor` | Refactorización sin cambio funcional | `refactor(user): extract validation logic` |
| `test`     | Añadir/corregir tests                | `test(auth): add login flow e2e tests`     |
| `chore`    | Tareas de mantenimiento              | `chore(deps): update typescript to 5.4`    |
| `perf`     | Mejora de performance                | `perf(query): optimize user search index`  |
| `ci`       | Cambios en CI/CD                     | `ci(actions): add SAST step to pipeline`   |

### 9.3 PR Requirements

- **Título**: Sigue conventional commits
- **Descripción**: Generada por skill `pr-description` (qué, por qué, cómo probar)
- **Reviews**: Mínimo 1 peer + Tech Lead para cambios en core
- **CI**: Todo verde (build + tests + lint + SAST)
- **Merge strategy**: Squash merge a develop, merge commit a main
- **Branch cleanup**: Eliminar branch después de merge


## 10. Estructura de Directorios

### 10.1 Frontend (React)

```
src/
├── app/
│   ├── App.tsx                 # Entry point
│   ├── routes.ts               # Configuración de rutas
│   └── components/
│       ├── ui/                 # Componentes base (button, input, card)
│       ├── shared/             # Componentes compartidos con lógica
│       ├── features/           # Componentes por feature/dominio
│       │   ├── auth/
│       │   ├── dashboard/
│       │   └── users/
│       └── layouts/            # Layouts (sidebar, header, footer)
├── hooks/                      # Custom hooks
├── services/                   # API calls y lógica de negocio
├── stores/                     # State management (Zustand)
├── types/                      # TypeScript types compartidos
├── utils/                      # Utilidades puras
├── constants/                  # Constantes de la app
└── __tests__/                  # Tests de integración
```

### 10.2 Backend (Node.js)

```
src/
├── app.ts                      # Bootstrap de la aplicación
├── server.ts                   # Entry point HTTP
├── modules/                    # Módulos de dominio
│   ├── users/
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   ├── users.repository.ts
│   │   ├── users.routes.ts
│   │   ├── users.types.ts
│   │   ├── users.validation.ts
│   │   └── __tests__/
│   └── auth/
├── shared/                     # Código compartido
│   ├── middleware/
│   ├── errors/
│   ├── utils/
│   └── types/
├── config/                     # Configuración
├── database/
│   ├── migrations/
│   └── seeds/
└── __tests__/                  # Tests de integración
```


## 11. Performance Guidelines

### 11.1 Frontend

| Métrica                        | Target          | Cómo Medir              |
| ------------------------------ | --------------- | ----------------------- |
| LCP (Largest Contentful Paint) | < 2.5s          | Lighthouse, Web Vitals  |
| FID (First Input Delay)        | < 100ms         | Lighthouse, Web Vitals  |
| CLS (Cumulative Layout Shift)  | < 0.1           | Lighthouse, Web Vitals  |
| Bundle size (gzipped)          | < 200KB initial | Webpack Bundle Analyzer |
| Time to Interactive            | < 3s            | Lighthouse              |

### 11.2 Backend

| Métrica           | Target                  |
| ----------------- | ----------------------- |
| P95 response time | < 500ms                 |
| P99 response time | < 2s                    |
| Throughput mínimo | 100 req/s por instancia |
| Error rate        | < 0.1%                  |
| DB query time P95 | < 100ms                 |

### 11.3 Optimización React

- **Lazy loading**: `React.lazy()` para rutas y componentes pesados
- **Code splitting**: Separar vendor, common, y route chunks
- **Memoización selectiva**: `memo()` solo donde se mide impacto real
- **Virtualización**: `react-virtualized` o `tanstack-virtual` para listas > 100 items
- **Imágenes**: WebP/AVIF, lazy loading, `srcset` para responsive, CDN
- **Debounce/Throttle**: Para inputs de búsqueda y eventos frecuentes


## 12. Observabilidad

### 12.1 Logging

```typescript
// Niveles de log y cuándo usar
logger.debug("Processing step details", { stepId, input }); // Desarrollo
logger.info("User created", { userId, email }); // Operaciones normales
logger.warn("Rate limit approaching", { userId, count }); // Atención requerida
logger.error("Payment failed", { userId, error, traceId }); // Requiere acción

// ⚠️ NUNCA loguear:
// - Passwords, tokens, API keys
// - Datos biométricos
// - PII sin necesidad operativa justificada
// - Payloads completos de request (pueden contener PII)
```

### 12.2 Tracing

- **traceId**: Propagado en todos los requests (header `X-Trace-Id`)
- **spanId**: Para cada operación significativa dentro del request
- Usar OpenTelemetry para instrumentación estándar

### 12.3 Métricas Custom

```typescript
// Métricas de negocio a instrumentar
metrics.histogram("biometric_verification_duration_ms", duration);
metrics.counter("user_registration_total", { status: "success" });
metrics.gauge("active_sessions", sessionCount);
```


## 13. Instrucciones para la IA

### 13.1 Al Generar Código

1. **Aplicar TODAS las convenciones** de este documento sin excepción
2. **TypeScript strict**: No `any`, no `as` sin justificación, no `!`
3. **Seguridad primero**: Validar inputs, parametrizar queries, no hardcodear secrets
4. **Testing incluido**: Todo código nuevo incluye test (mínimo happy path + error case)
5. **Error handling**: Errores tipados, contexto para debugging, nunca silenciar
6. **Nombres descriptivos**: El código se lee más de lo que se escribe

### 13.2 Al Revisar Código

1. **Verificar convenciones** contra este documento
2. **Buscar anti-patrones** de la sección 3.4 (React) y 6.3 (Seguridad)
3. **Verificar types**: No hay `any` ni casts injustificados
4. **Verificar tests**: Existen, cubren happy path + error, siguen AAA
5. **Verificar seguridad**: Sin secrets, sin SQL concatenado, inputs validados
