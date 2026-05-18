---
id: contributing-template
version: "1.0.0"
last_updated: "2026-03-16"
updated_by: "System: Template Migration"
status: active
type: template
review_cycle: 90
next_review: "2026-06-14"
owner_role: "Tech Lead"
---

# CONTRIBUTING.md Template

> **Proposito**: Template para generar el CONTRIBUTING.md de cualquier proyecto.
> **Compilado desde**: `rules/tech-stack.md` seccion 9 (Git), `rules/org.md`, `Guidelines.md` seccion 2 (Convenciones de Codigo).
> **Usado por**: `/init-project-docs` al crear scaffold de proyecto.

---

## Estructura recomendada

````markdown
# Contribuir a {Nombre del Proyecto}

Gracias por tu interes en contribuir. Este documento describe las reglas y procesos
que seguimos para mantener la calidad del codigo.

## Requisitos previos

- Leer [README.md](./README.md) y poder ejecutar el proyecto localmente
- Acceso a Jira para el tracking de tickets
- Acceso a GitHub para PRs

## Branching Strategy (Git Flow)

\```
main ───────────────────────────► (produccion)
|
├─ develop ───────────────────► (integracion)
| |
| ├─ feat/PROJ-123-desc ──► merge a develop
| ├─ fix/PROJ-456-desc ───► merge a develop
| └─ refactor/PROJ-789 ───► merge a develop
|
├─ release/1.2.0 ────────────► merge a main + tag
|
└─ hotfix/PROJ-999-desc ─────► merge a main + develop
\```

### Naming de branches

- `feat/PROJ-{ID}-{descripcion-breve}`
- `fix/PROJ-{ID}-{descripcion-breve}`
- `refactor/PROJ-{ID}-{descripcion-breve}`
- `hotfix/PROJ-{ID}-{descripcion-breve}`

## Conventional Commits

Todos los commits deben seguir el formato:

\```
<type>(<scope>): <descripcion>

[body opcional]
[footer opcional]
\```

| Type       | Cuando                    |
| ---------- | ------------------------- |
| `feat`     | Nueva funcionalidad       |
| `fix`      | Correccion de bug         |
| `docs`     | Solo documentacion        |
| `refactor` | Sin cambio funcional      |
| `test`     | Tests nuevos o corregidos |
| `chore`    | Mantenimiento             |
| `perf`     | Mejora de performance     |
| `ci`       | Cambios en CI/CD          |

## Pull Requests

### Proceso

1. Crear branch desde `develop` (o `main` para hotfix)
2. Implementar cambios con commits convencionales
3. Ejecutar tests localmente: `npm test`
4. Crear PR hacia `develop`
5. La descripcion se auto-genera con el skill `pr-description`
6. Minimo 1 reviewer (Tech Lead para cambios en core)
7. CI debe pasar: build + tests + lint + SAST
8. Squash merge a develop

### Checklist del PR (DoD)

- [ ] Tests pasan (unit + integration)
- [ ] Cobertura >= 80%
- [ ] Sin warnings de linter
- [ ] SAST/SCA limpio
- [ ] Documentacion actualizada si hay cambio de API
- [ ] No hay secrets en el codigo

## Convenciones de Codigo

### TypeScript

- `strict: true` siempre activado
- `any` PROHIBIDO — usar `unknown` + type guards
- Interfaces para contratos publicos, Types para uniones
- Enums: NO — usar `const` objects con `as const`

### React (si aplica)

- Solo componentes funcionales con hooks
- Props: interface explicita, desestructurada
- Keys: siempre ID estable, NUNCA index de array

### Naming

| Elemento    | Convencion          | Ejemplo             |
| ----------- | ------------------- | ------------------- |
| Componentes | PascalCase          | `UserProfile.tsx`   |
| Hooks       | camelCase con "use" | `useAuthStatus`     |
| Utilidades  | camelCase           | `formatCurrency.ts` |
| Constantes  | UPPER_SNAKE_CASE    | `MAX_RETRY_COUNT`   |

## Testing

- Tests se escriben ANTES o JUNTO al codigo
- Unit tests: 80% cobertura minima
- Integration tests: flujos criticos
- BDD: criterios de aceptacion definen test cases

## Seguridad

- NUNCA loguear PII/datos sensibles
- NUNCA hardcodear secrets
- Ver [SECURITY.md](./SECURITY.md) para reporte de vulnerabilidades
````

---

## Notas para el generador

- Las convenciones de Git, TypeScript, React y Naming se extraen directamente de `rules/tech-stack.md` y `Guidelines.md`
- Si el proyecto no usa React, omitir la seccion de React
- Si el proyecto usa un stack diferente (Go, Python, etc.), adaptar las secciones de convenciones
- La checklist del PR debe alinearse con el contenido de `docs/checklists/dod.md`
