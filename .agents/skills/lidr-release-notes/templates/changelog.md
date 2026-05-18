---
id: changelog-template
version: "1.0.0"
last_updated: "2026-03-16"
updated_by: "System: Template Migration"
status: active
type: template
review_cycle: 60
next_review: "2026-05-15"
owner_role: "DevOps"
---

# CHANGELOG.md Template

> **Proposito**: Template base para inicializar el CHANGELOG.md de cualquier proyecto.
> **Formato**: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) + [Conventional Commits](https://www.conventionalcommits.org/).
> **Generado por**: `/update-changelog [version]` (automatico desde PRs mergeados).
> **Complementa a**: Skill `release-notes` que genera changelog bi-nivel (negocio + tecnico).

---

## Formato base

```markdown
# Changelog

Todos los cambios notables de este proyecto se documentan en este archivo.

El formato se basa en [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- {Nuevas funcionalidades}

### Changed

- {Cambios en funcionalidades existentes}

### Deprecated

- {Funcionalidades que seran eliminadas}

### Removed

- {Funcionalidades eliminadas}

### Fixed

- {Correcciones de bugs}

### Security

- {Correcciones de vulnerabilidades}

## [1.0.0] - YYYY-MM-DD

### Added

- Release inicial del proyecto
- {Feature 1}
- {Feature 2}

[Unreleased]: https://github.com/{org}/{repo}/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/{org}/{repo}/releases/tag/v1.0.0
```

---

## Reglas del Changelog

| Regla                          | Detalle                                              |
| ------------------------------ | ---------------------------------------------------- |
| **Audiencia**                  | Humanos, no maquinas. Lenguaje claro y directo       |
| **Una entrada por version**    | Agrupada por tipo de cambio (Added, Changed, etc.)   |
| **Unreleased siempre visible** | Seccion en el top para cambios pendientes de release |
| **Links de comparacion**       | Footer con links a GitHub compare entre tags         |
| **Orden cronologico inverso**  | Versiones mas recientes arriba                       |
| **Fecha ISO 8601**             | Formato YYYY-MM-DD                                   |
| **Semver estricto**            | MAJOR.MINOR.PATCH segun impacto                      |

## Mapeo Conventional Commits → Changelog

| Commit type         | Seccion Changelog               |
| ------------------- | ------------------------------- |
| `feat`              | Added                           |
| `fix`               | Fixed                           |
| `docs`              | Changed (si afecta API publica) |
| `refactor`          | Changed                         |
| `perf`              | Changed                         |
| `BREAKING CHANGE`   | Changed (con nota destacada)    |
| `deprecate`         | Deprecated                      |
| `security` / `vuln` | Security                        |

## Flujo de actualizacion

```
1. PRs se mergean a develop con conventional commits
2. Antes de release: /create-release-notes [version]
   → Skill release-notes genera changelog bi-nivel
3. /update-changelog [version]
   → Lee PRs mergeados desde ultimo tag
   → Clasifica por tipo (feat, fix, etc.)
   → Genera entrada en CHANGELOG.md
   → Commit + tag vX.Y.Z
4. Gate 7 valida que CHANGELOG.md este actualizado
```
