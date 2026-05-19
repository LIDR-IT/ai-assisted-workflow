---
id: guidelines
version: "2.1.0"
last_updated: "2026-03-17"
updated_by: "IA: sync-docs"
status: active
owner_role: "Tech Lead"
---

# Directrices de Desarrollo — Ecosistema SDLC {{CLIENT_NAME}}

> **Propósito**: Guía operativa para el equipo de desarrollo. Resume las reglas, convenciones y decisiones más importantes del ecosistema en un documento de referencia rápida.
> **Alcance**: Todos los roles (Dev, QA, TL, PO, PME, Sec, DevOps)
> **Complementa a**: `rules/tech-stack.md` (stack técnico), `rules/org.md` (organización), `rules/workflows.md` (orquestación)

---

## 1. Principios Fundamentales

### 1.1 Spec-Driven Development (SDD)

La especificación es la **fuente de verdad**. El código implementa la spec, no al revés.

| Principio            | Descripción                                                                       |
| -------------------- | --------------------------------------------------------------------------------- |
| **Spec → Code**      | Todo código se genera desde una especificación aprobada (PRD, RF, US)             |
| **Traceability**     | Cada artefacto tiene un link explícito a su fuente: US → RF → PRD → Business Case |
| **Gates formales**   | Nada avanza sin pasar el quality gate de su fase (8 gates, 0-7)                   |
| **IA como copiloto** | La IA genera borradores; el humano valida, aporta contexto real, y firma          |

### 1.2 Quality Gates — Regla de Oro

```
NUNCA avanzar de fase sin evaluar el gate correspondiente.
Un gate FAIL bloquea el avance. CONDITIONAL permite avanzar con action items.
Solo /advance-gate puede evaluar y transicionar formalmente.
```

Los 8 gates del ciclo SDLC:

| Gate   | Fase                             | Evaluador | Criterio clave                            |
| ------ | -------------------------------- | --------- | ----------------------------------------- |
| Gate 0 | Intake → Discovery               | PME       | Business Case aprobado, épica creada      |
| Gate 1 | Discovery → Especificación       | PO        | PRDs aprobados, review cruzado OK         |
| Gate 2 | Especificación → Sprint Planning | PO        | RFs con BDD completos, coherentes         |
| Gate 3 | Sprint Planning → Desarrollo     | PO + TL   | Sprint committed, capacity OK, DoR        |
| Gate 4 | Desarrollo → QA                  | TL        | Todos los tickets PASS DoD                |
| Gate 5 | QA → Seguridad                   | QA Lead   | QA sign-off, cobertura OK                 |
| Gate 6 | Seguridad → Despliegue           | Sec Lead  | Security sign-off, OWASP OK               |
| Gate 7 | Despliegue → Producción          | PME       | CR aprobado, rollback plan, release notes |

---

## 2. Convenciones de Código

### 2.1 Stack principal

- **Frontend**: React 18+ con TypeScript strict, hooks funcionales, Tailwind CSS v4
- **Backend**: Node.js 20 LTS+ con TypeScript, ESM modules
- **API**: REST con OpenAPI 3.1 (contract-first)
- **DB**: PostgreSQL 15+ con migraciones versionadas
- **Contenedores**: Docker multi-stage, usuario non-root
- **CI/CD**: GitHub Actions con secrets en Vault

### 2.2 TypeScript

```
- strict: true siempre activado
- any: PROHIBIDO — usar unknown + type guards
- Interfaces para contratos públicos, Types para uniones/intersecciones
- Enums: NO — usar const objects con as const
- Non-null assertion (!): PROHIBIDO — usar optional chaining + narrowing
```

### 2.3 React

```
- Solo componentes funcionales con hooks
- Props: interface explícita, desestructurada en parámetros
- Estado global: Context + useReducer para estado simple, Zustand si escala
- Side effects: useEffect solo para sincronización con sistemas externos
- Memoización: useMemo/useCallback solo cuando hay evidencia de re-render costoso
- Keys: siempre ID estable, NUNCA index de array
```

### 2.4 Naming

| Elemento         | Convención                 | Ejemplo                                 |
| ---------------- | -------------------------- | --------------------------------------- |
| Componentes      | PascalCase                 | `UserProfile.tsx`                       |
| Hooks custom     | camelCase con "use"        | `useAuthStatus`                         |
| Utilidades       | camelCase                  | `formatCurrency.ts`                     |
| Constantes       | UPPER_SNAKE_CASE           | `MAX_RETRY_COUNT`                       |
| Tipos/Interfaces | PascalCase con sufijo      | `UserDTO`, `AuthConfig`                 |
| Archivos test    | `.test.ts` / `.spec.ts`    | `auth.service.test.ts`                  |
| Feature branches | `feature/PROJ-{ID}-{desc}` | `feature/SDLC-123-add-gate-eval`        |
| Commits          | Conventional Commits       | `feat(auth): add domain-specific login` |

### 2.5 Git

```
- Branch strategy: Git Flow (main, develop, feature/*, release/*, hotfix/*)
- Commits: Conventional Commits obligatorio (feat, fix, docs, refactor, test, chore)
- PRs: Mínimo 1 reviewer, template auto-generado por skill pr-description
- Merge: Squash merge a develop, merge commit a main
- Tags: Semver (vX.Y.Z), creados automáticamente por CI
```

---

## 3. Seguridad — No Negociables

Dado que {{CLIENT_NAME}} trabaja con **datos biométricos** (categoría especial GDPR Art. 9):

### 3.1 Reglas absolutas

| Regla                                   | Detalle                                         |
| --------------------------------------- | ----------------------------------------------- |
| **NUNCA** loguear PII/biométricos       | Ni en logs, ni en consola, ni en error tracking |
| **SIEMPRE** cifrar en tránsito          | TLS 1.2+ mínimo                                 |
| **SIEMPRE** cifrar en reposo            | AES-256 mínimo                                  |
| **NUNCA** secrets en código             | Usar Vault/env vars, referenciados en CI/CD     |
| **SIEMPRE** DPIA para datos biométricos | Data Protection Impact Assessment obligatorio   |
| **SIEMPRE** mecanismo de revocación     | Derecho al olvido implementado                  |

### 3.2 Checklist pre-deploy obligatorio

El skill `security-checklist` evalúa automáticamente:

- OWASP Top 10 (2021)
- Security headers (CSP, HSTS, X-Frame-Options)
- Gestión de sesiones (HttpOnly, Secure, SameSite)
- API security (rate limiting, input validation, auth)
- Secrets scanning (no hardcoded credentials)
- Dependency audit (SCA - vulnerabilidades conocidas)

---

## 4. Testing — Estándares

### 4.1 Cobertura mínima

| Tipo              | Cobertura                       | Herramienta      |
| ----------------- | ------------------------------- | ---------------- |
| Unit tests        | 80% líneas                      | Jest/Vitest      |
| Integration tests | Flujos críticos                 | Supertest        |
| E2E tests         | Happy paths principales         | Playwright       |
| BDD scenarios     | 100% de criterios de aceptación | Cucumber/Gherkin |

### 4.2 Principios de testing

```
- Tests son ciudadanos de primera clase: se escriben ANTES o JUNTO al código
- BDD: los criterios de aceptación de las US definen los test cases
- Regression suite: se actualiza automáticamente con impact analysis
- Flaky tests: se marcan, se investigan, se corrigen o se eliminan
- Test data: factories/fixtures, NUNCA datos de producción
```

---

## 5. Documentación — Gobierno

### 5.1 Frontmatter obligatorio

Todo archivo `.md` del ecosistema requiere frontmatter YAML con: `id`, `version`, `last_updated`, `updated_by`, `status`.

### 5.2 Estructura de skills

Cada skill en `.claude/skills/` sigue esta estructura:

```
skills/{skill-name}/
  SKILL.md          ← Instrucciones para la IA (frontmatter + prompt)
  reference/        ← Material de apoyo, estándares, ejemplos de referencia
  examples/         ← Outputs modelo (la IA aprende el formato esperado)
  scripts/          ← Automatizaciones (analysis, validation, generation)
```

### 5.3 Staleness detection

| Tipo       | TTL máximo | Acción si caduca                 |
| ---------- | ---------- | -------------------------------- |
| Skills     | 90 días    | Review por owner + re-validación |
| Rules      | 180 días   | Review por TL + actualización    |
| Templates  | 120 días   | Review por PO/TL                 |
| Checklists | 90 días    | Review por QA/Sec                |

---

## 6. MCPs — Model Context Protocol

### 6.1 MCPs Activos (4)

Conexiones externas configuradas para la IA:

| MCP            | Descripción                       | Capabilities                                            | Usado por                                          |
| -------------- | --------------------------------- | ------------------------------------------------------- | -------------------------------------------------- |
| **filesystem** | Operaciones locales de archivos   | read_files, write_files, search_files, list_directories | implement-ticket, sync-docs, validate-project-docs |
| **memory**     | Grafo de conocimiento persistente | store_knowledge, retrieve_knowledge, search_knowledge   | all-skills                                         |
| **atlassian**  | Integración Jira/Confluence       | create_ticket, update_ticket, search_issues             | implement-ticket, advance-gate, track-sdlc         |
| **playwright** | Automatización de navegador       | navigate, click, screenshot, form_fill                  | playwright-cli, dast-interpretation, testing       |

### 6.2 Tool Integrations (Practical)

Herramientas externas integradas via scripts y CLI:

- **jira**: Tickets, subtareas, transiciones (manual + API scripts)
- **xray**: Test management via CSV export/import + API scripts
- **github**: PRs, branches, diffs, releases via GitHub CLI (gh)

---

## 7. Workflows — Referencia rápida

### 7.1 Flujo estándar de un ticket

```
/create-branch PROJ-123
  → Dev implementa (manual o con /implement-ticket)
    → skill: pr-description (auto-genera PR)
    → skill: dev-handoff-qa (genera handoff)
    → hook: dtc-write-guard (valida DTC + DoD)
  → /create-pr PROJ-123
  → Code review (TL approves)
  → /prepare-testing PROJ-123
    → skill: test-plan + create-test-cases + execution report
  → QA sign-off (/advance-gate 5)
```

### 7.2 Hotfix

```
/create-branch PROJ-999 (desde main)
  → /implement-ticket PROJ-999
  → /create-pr PROJ-999
  → QA fast-track
  → /create-release-notes + /update-changelog
  → /advance-gate 7 (fast-track)
```

### 7.3 Comandos más usados

| Comando                         | Cuándo usarlo                                     |
| ------------------------------- | ------------------------------------------------- |
| `/help [query]`                 | Cualquier momento — busca en el ecosistema        |
| `/advance-gate [N]`             | Al completar una fase — evalúa y transiciona      |
| `/implement-ticket [ID]`        | Al empezar un ticket de desarrollo                |
| `/validate-requirements [name]` | Al completar Discovery — orquesta Fase 3 completa |
| `/prepare-testing [ID]`         | Al recibir handoff Dev → QA                       |
| `/create-release-notes`         | Antes de deploy a producción                      |

---

## 8. Métricas del Ecosistema

| Métrica                          | Valor actual |
| -------------------------------- | ------------ |
| Skills activos                   | 57           |
| Commands disponibles             | 23           |
| Rules cargadas                   | 5            |
| Hooks configurados               | 4            |
| MCPs conectados                  | 4            |
| Validation Scripts               | 55           |
| Templates                        | 0 ✨         |
| Checklists                       | 0 ✨         |
| Signoffs                         | 0 ✨         |
| Agents (specs completas)         | 6            |
| Quality Gates                    | 8 (0-7)      |
| **Total Artefactos**             | **195**      |
| Artefactos totales en HelpCenter | 195          |
| Self-Containment                 | 100%         |
| Workflows recomendados           | 17           |
| Integrity Tests                  | 32 (T1-T32)  |

### 8.1 Skills Automatizados (ROI Alto)

Los siguientes 9 skills han sido potenciados con scripts Python para automatización completa:

| Skill                      | Automatización        | ROI (Tiempo ahorrado) | Descripción                                                         |
| -------------------------- | --------------------- | --------------------- | ------------------------------------------------------------------- |
| 🤖 `project-classifier`    | Pattern detection     | 2h → 5min             | Clasificación automática de proyectos, detección de dominio y stack |
| 🤖 `validate-requirements` | 5-pass validation     | 6h → 5min             | Validación cruzada RFs/NFRs, RTM automático, detección de gaps      |
| 🤖 `tech-debt`             | SonarQube integration | 6h → 5min             | Análisis de 847+ issues, clasificación automática, User Stories     |
| 🤖 `user-stories`          | RF slicing            | 3h → 15min            | 8 patrones de slice, validación INVEST, criterios BDD automáticos   |
| 🤖 `regression-suite`      | Impact analysis       | 8h → 30min            | Análisis git diff, mapeo de dependencias, selección automática      |
| 🤖 `security-checklist`    | Compliance analysis   | 4h → 5min             | SAST/SCA/DAST integration, GDPR Article 9, Gate 6 automation        |
| 🤖 `test-plan`             | Risk analysis         | 3h → 5min             | Project discovery, risk assessment, comprehensive test strategy     |
| 🤖 `release-notes`         | Git analysis          | 2h → 5min             | PR metadata extraction, business impact, dual-format generation     |
| 🤖 `rollback-plan`         | Deployment analysis   | 4h → 5min             | Risk assessment, executable procedures, <15 minute rollback plans   |

**Total ROI**: 775+ horas/año ahorradas al equipo con automatización-first approach.

---

## 9. Dónde encontrar más información

| Necesitas...                  | Busca en...                                                  |
| ----------------------------- | ------------------------------------------------------------ |
| Stack técnico detallado       | `rules/tech-stack.md`                                        |
| Quién ejecuta qué comando     | `rules/workflows.md`                                         |
| Estándares organizacionales   | `rules/org.md` + `docs/standards/org.md`                     |
| Gobierno de documentación     | `rules/documentation.md`                                     |
| Contexto del proyecto activo  | `rules/project.md` + `docs/projects/sdlc-{{CLIENT_CODE}}.md` |
| Buscar cualquier artefacto    | HelpCenter (`/help`) o ruta `/help` en la app                |
| Estado de auditorías          | `docs/audits/audit-catalog.md`                               |
| Árbol completo del filesystem | SitemapView en la app                                        |
