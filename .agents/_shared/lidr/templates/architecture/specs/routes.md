# Template: Routes Specification

> **Propósito**: Documentación de rutas de la aplicación — páginas (frontend) y endpoints (API).
> **Quién lo llena**: Tech Lead + Frontend/Backend Lead con skill `architecture-doc`
> **Instancias**: `docs/projects/{proyecto}/specs/routes.md`
> **Complementa**: `architecture.md`, `components.md`

---

## 1. Páginas (Frontend Routes)

```markdown
## Frontend Routes

| Ruta       | Componente    | Layout        | Auth       | Descripción          |
| ---------- | ------------- | ------------- | ---------- | -------------------- |
| /          | HomePage      | MainLayout    | No         | Landing / Dashboard  |
| /login     | LoginPage     | AuthLayout    | No         | Autenticación        |
| /dashboard | DashboardPage | AppLayout     | Sí         | Panel principal      |
| /settings  | SettingsPage  | AppLayout     | Sí         | Configuración        |
| /admin/\*  | AdminLayout   | AdminLayout   | Sí (admin) | Panel administración |
| /\*        | NotFoundPage  | MinimalLayout | No         | 404                  |

### Layouts

| Layout     | Componentes                | Usado por        |
| ---------- | -------------------------- | ---------------- |
| MainLayout | Header + Footer            | Páginas públicas |
| AppLayout  | Sidebar + Header + Content | App autenticada  |
| AuthLayout | Centered card              | Login/Register   |

### Redirects

| Condición      | Desde      | Hacia                      |
| -------------- | ---------- | -------------------------- |
| No autenticado | /dashboard | /login?redirect=/dashboard |
| Ya autenticado | /login     | /dashboard                 |
| Sin permisos   | /admin     | /403                       |

### Route Guards

| Guard           | Aplica a                   | Verifica                   |
| --------------- | -------------------------- | -------------------------- |
| AuthGuard       | /dashboard, /settings, ... | Token válido + no expirado |
| AdminGuard      | /admin/\*                  | Role === 'admin'           |
| OnboardingGuard | /app/\*                    | Onboarding completado      |
```

## 2. API Routes

```markdown
## API Endpoints

### Auth

| Método | Ruta               | Auth  | Rate Limit | Descripción              |
| ------ | ------------------ | ----- | ---------- | ------------------------ |
| POST   | /api/auth/login    | No    | 5/min      | Login con email+password |
| POST   | /api/auth/register | No    | 3/min      | Registro nuevo usuario   |
| POST   | /api/auth/refresh  | Token | 10/min     | Refresh access token     |
| POST   | /api/auth/logout   | Token | —          | Invalidar sesión         |

### {Recurso}

| Método | Ruta               | Auth          | Request Body       | Response         | Descripción       |
| ------ | ------------------ | ------------- | ------------------ | ---------------- | ----------------- |
| GET    | /api/{recurso}     | Token         | —                  | Array<{Recurso}> | Listar (paginado) |
| GET    | /api/{recurso}/:id | Token         | —                  | {Recurso}        | Obtener por ID    |
| POST   | /api/{recurso}     | Token         | Create{Recurso}DTO | {Recurso}        | Crear             |
| PUT    | /api/{recurso}/:id | Token         | Update{Recurso}DTO | {Recurso}        | Actualizar        |
| DELETE | /api/{recurso}/:id | Token (admin) | —                  | void             | Eliminar          |

### Paginación

| Parámetro | Tipo   | Default         | Descripción                 |
| --------- | ------ | --------------- | --------------------------- |
| page      | number | 1               | Página actual               |
| limit     | number | 20              | Items por página (max: 100) |
| sort      | string | created_at:desc | Campo y dirección           |
| filter    | string | —               | Filtros (sintaxis definida) |

### Error Responses

| Status | Significado        | Body                                            |
| ------ | ------------------ | ----------------------------------------------- |
| 400    | Validación fallida | `{ error: "VALIDATION_ERROR", details: [...] }` |
| 401    | No autenticado     | `{ error: "UNAUTHORIZED" }`                     |
| 403    | Sin permisos       | `{ error: "FORBIDDEN" }`                        |
| 404    | No encontrado      | `{ error: "NOT_FOUND" }`                        |
| 429    | Rate limit         | `{ error: "RATE_LIMITED", retryAfter: N }`      |
| 500    | Error interno      | `{ error: "INTERNAL_ERROR", requestId: "..." }` |
```

## 3. Webhooks / Events (si aplica)

```markdown
## Webhooks

| Evento       | Payload                        | Retry Policy   | Destino |
| ------------ | ------------------------------ | -------------- | ------- |
| user.created | `{ userId, email, createdAt }` | 3x con backoff | {URL}   |
|              |                                |                |         |
```

---

## Criterios de Completitud

| Criterio                                            | Obligatorio        |
| --------------------------------------------------- | ------------------ |
| Todas las páginas con ruta, layout, y auth          | Sí                 |
| Todos los endpoints con método, auth, y descripción | Sí                 |
| Error responses estandarizados                      | Sí                 |
| Rate limiting definido para endpoints públicos      | Sí                 |
| Route guards documentados                           | Sí                 |
| Paginación estándar definida                        | Sí (si hay listas) |

---

_Template — instancia en `docs/projects/{proyecto}/specs/routes.md`_
