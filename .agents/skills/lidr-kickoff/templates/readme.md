---
id: readme-template
version: "1.0.0"
last_updated: "2026-03-16"
updated_by: "System: Template Migration"
status: active
type: template
review_cycle: 90
next_review: "2026-06-14"
owner_role: "Tech Lead"
---

# README Template

> **Proposito**: Template base para generar el README.md de cualquier proyecto del ecosistema.
> **Usado por**: `/init-project-docs` al crear scaffold de proyecto.
> **Formato**: Markdown con secciones estandar. Adaptar al stack concreto.

---

## Estructura recomendada

````markdown
# {Nombre del Proyecto}

> Descripcion breve en 1-2 lineas: que hace, para quien, por que existe.

## Quick Start

### Prerrequisitos

- Node.js >= 20 LTS (o runtime del proyecto)
- {DB si aplica}
- {Otras dependencias de sistema}

### Instalacion

\```bash
git clone {url}
cd {proyecto}
{comando de instalacion: npm install / pnpm install / etc.}
cp .env.example .env
{comando de setup: migrations, seeds, etc.}
\```

### Ejecucion

\```bash
{comando de dev: npm run dev / etc.}
\```

## Arquitectura

Diagrama o resumen de alto nivel (1 parrafo + link a docs/architecture/).

## Stack Tecnologico

| Capa          | Tecnologia                        |
| ------------- | --------------------------------- |
| Frontend      | {React, Vue, etc.}                |
| Backend       | {Node.js, Go, etc.}               |
| Base de datos | {PostgreSQL, MongoDB, etc.}       |
| CI/CD         | {GitHub Actions, GitLab CI, etc.} |

## Estructura del Proyecto

\```
src/
api/ # Controladores y rutas
core/ # Logica de dominio
components/ # Componentes UI (si frontend)
utils/ # Utilidades transversales
tests/ # Tests
docs/ # Documentacion
\```

## Contribuir

Ver [CONTRIBUTING.md](./CONTRIBUTING.md) para convenciones de codigo, branching, PRs y testing.

## Seguridad

Ver [SECURITY.md](./SECURITY.md) para politica de reporte de vulnerabilidades.

## Licencia

Ver [LICENSE](./LICENSE).

## Enlaces

- [Arquitectura detallada](./docs/architecture/)
- [ADRs](./docs/adrs/)
- [Changelog](./CHANGELOG.md)
- {Link a Jira/Confluence si aplica}
````

---

## Principios del README

1. **Puerta de entrada**: Un dev nuevo debe poder clonar, instalar y ejecutar en <15 min leyendo solo el README
2. **Conciso**: No duplicar documentacion — enlazar a docs/ para detalles
3. **Actualizado**: Revisar en cada release major. El comando `/sync-docs` detecta drift
4. **Badges**: Opcional pero recomendado — CI status, coverage, version, license
