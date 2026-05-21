---
id: tpl-rule
version: "1.0.0"
last_updated: "2026-03-09"
updated_by: "TL: Lead Engineer"
status: active
---

# Template: Rule File

> **Tipo**: Template
> **Uso**: Plantilla base para crear archivos de rule en `.claude/rules/`
> **Skill asociado**: `generate-rule` (genera rules desde contexto del proyecto)
> **Guia SDK**: `docs/guides/claude-code/rule-development.md`

---

## Instrucciones de Uso

1. Copiar la plantilla correspondiente al tipo de rule que se necesita
2. Reemplazar los placeholders `{...}` con datos reales del proyecto
3. Agregar `@` references a documentos existentes en `docs/`
4. Validar con `/validate-project-docs`

---

## Plantilla: org.md (Organizacion)

```markdown
# Rule: Estandares de Organizacion — {Nombre Empresa}

> **Nivel**: Organizacional (Nivel 1)
> **Carga**: SIEMPRE — este fichero se inyecta en cada sesion de IA sin excepcion.
> **Proposito**: Define como trabaja la empresa, que valores rigen las decisiones, y que estandares no son negociables.
> **Fuente de verdad extendida**: @../standards/org.md

---

## 1. Identidad Organizacional

### 1.1 Quienes Somos

{Descripcion breve de la empresa, mercado, producto principal}

### 1.2 Regulacion Aplicable

| Mercado     | Regulacion   | Implicacion para Desarrollo |
| ----------- | ------------ | --------------------------- |
| {Mercado 1} | {Regulacion} | {Implicacion}               |

### 1.3 Datos Sensibles

{Tipo de datos sensibles que maneja la empresa y restricciones NUNCA/SIEMPRE}

---

## 2. Filosofia de Desarrollo

{Metodologia: SDD, Agile, SAFe, etc. Principios fundamentales.}

---

## 3. Quality Gates

| Gate   | Fase   | Evaluador | Criterio   |
| ------ | ------ | --------- | ---------- |
| Gate 0 | {Fase} | {Rol}     | {Criterio} |

---

## 4. Roles y Responsabilidades

| Rol   | Responsabilidad Principal | Commands Autorizados |
| ----- | ------------------------- | -------------------- |
| {Rol} | {Responsabilidad}         | {Commands}           |

---

## 5. Politicas de Seguridad

{Referencia a checklists y signoffs:}

- @../checklists/security-compliance.md
- @../signoffs/security-signoff.md
```

---

## Plantilla: tech-stack.md (Stack Tecnico)

```markdown
# Rule: Convenciones del Stack Tecnologico

> **Nivel**: Tecnico (Nivel 1)
> **Carga**: SIEMPRE — la IA aplica estas convenciones en cada linea de codigo generada.
> **Proposito**: Define COMO se escribe codigo en esta organizacion.
> **Complementa a**: org.md (estandares organizacionales) y project.md (contexto del proyecto)

---

## 1. Stack Principal

| Capa     | Tecnologia    | Version Minima | Notas   |
| -------- | ------------- | -------------- | ------- |
| Frontend | {Framework}   | {Version}      | {Notas} |
| Backend  | {Framework}   | {Version}      | {Notas} |
| DB       | {Motor}       | {Version}      | {Notas} |
| CI/CD    | {Herramienta} | —              | {Notas} |

---

## 2. TypeScript — Convenciones

- strict: true SIEMPRE
- any: PROHIBIDO — usar unknown + type guards
- {Agregar convenciones especificas del equipo}

---

## 3. {Framework Frontend} — Convenciones

{Patrones, componentes, estado, routing, etc.}

---

## 4. Naming Conventions

| Elemento    | Convencion          | Ejemplo         |
| ----------- | ------------------- | --------------- |
| Componentes | PascalCase          | UserProfile.tsx |
| Hooks       | camelCase con "use" | useAuthStatus   |
| Constantes  | UPPER_SNAKE_CASE    | MAX_RETRY_COUNT |

---

## 5. Testing

| Tipo        | Cobertura Minima | Herramienta   |
| ----------- | ---------------- | ------------- |
| Unit        | {%}              | {Herramienta} |
| Integration | {Alcance}        | {Herramienta} |
| E2E         | {Alcance}        | {Herramienta} |

---

## 6. Git Conventions

- Branch strategy: {Git Flow / Trunk-based / etc.}
- Commits: {Conventional Commits / otro}
- PRs: {Reviewers minimos, template}
```

---

## Plantilla: project.md (Contexto del Proyecto)

```markdown
# Rule: Contexto del Proyecto Activo

> **Nivel**: Proyecto (Nivel 1)
> **Carga**: SIEMPRE — la IA necesita este contexto para entender en que proyecto trabaja.
> **Proposito**: Define el dominio, el equipo, la arquitectura y el estado actual del proyecto.
> **Fuente de verdad extendida**: @../projects/{nombre-proyecto}.md

---

## 1. Ficha del Proyecto

| Campo             | Valor                                          |
| ----------------- | ---------------------------------------------- |
| **Nombre**        | {Nombre del proyecto}                          |
| **Codigo Jira**   | {PROJ-XXX}                                     |
| **Objetivo**      | {Objetivo en 1-2 lineas}                       |
| **Product Owner** | {Nombre / Rol}                                 |
| **Tech Lead**     | {Nombre / Rol}                                 |
| **Estado**        | {En ejecucion / Planificacion / Mantenimiento} |
| **Inicio**        | {Fecha}                                        |

---

## 2. Dominio de Negocio

### 2.1 Glosario

| Termino     | Definicion   |
| ----------- | ------------ |
| {Termino 1} | {Definicion} |

---

## 3. Arquitectura

{Patron: microservicios, monolito, serverless, etc.}
{Diagrama o referencia a @../templates/architecture.md}

---

## 4. Reglas Especificas del Proyecto

{Restricciones, decisiones arquitectonicas, convenciones locales}

---

## 5. Estado Actual

| Sprint   | Estado              | Notas   |
| -------- | ------------------- | ------- |
| Sprint N | {Activo/Completado} | {Notas} |
```

---

## Plantilla: documentation.md (Gobernanza)

```markdown
# Rule: Documentation Governance

> **Nivel**: Rule (contexto persistente — SIEMPRE cargado)
> **Proposito**: Estandares de documentacion — frontmatter, versionado, staleness, DTC enforcement.
> **La IA aplica esta rule SIEMPRE que crea o modifica un archivo .md**

---

## 1. Regla de Oro: Docs Travel with Code (DTC)

> La documentacion viaja con el codigo. El Dev que cambia codigo, actualiza la documentacion afectada EN EL MISMO PR.

---

## 2. Frontmatter Obligatorio

Todo archivo .md requiere YAML frontmatter con:

- id: identificador unico
- version: semver
- last_updated: fecha ISO
- updated_by: rol
- status: active | draft | deprecated

---

## 3. Staleness Detection

| Tipo       | TTL      | Accion si caduca  |
| ---------- | -------- | ----------------- |
| Skills     | 90 dias  | Review por owner  |
| Rules      | 180 dias | Review por TL     |
| Templates  | 120 dias | Review por PO/TL  |
| Checklists | 90 dias  | Review por QA/Sec |

---

## 4. Matriz de Impacto DTC

| Si cambias...    | DEBES actualizar... |
| ---------------- | ------------------- |
| {Tipo de cambio} | {Docs afectados}    |
```

---

## Plantilla: workflows.md (Orquestacion)

```markdown
# Rule: Workflow Orchestration Map

> **Nivel**: Rule (contexto persistente — SIEMPRE cargado)
> **Proposito**: Define QUIEN puede ejecutar QUE comando, en que ORDEN, y como se encadenan.
> **La IA lee esta rule ANTES de ejecutar cualquier command**

---

## 1. Catalogo de Commands por Tier

### Tier 1 — Orchestrators

| Command    | Proposito   | Roles Autorizados | Precondicion   |
| ---------- | ----------- | ----------------- | -------------- |
| {/command} | {Proposito} | {Roles}           | {Precondicion} |

### Tier 2 — Tactical

| Command    | Proposito   | Roles Autorizados | Precondicion   |
| ---------- | ----------- | ----------------- | -------------- |
| {/command} | {Proposito} | {Roles}           | {Precondicion} |

---

## 2. Flujo de Gates

{Diagrama ASCII o tabla del flujo de gates}

---

## 3. Encadenamiento de Commands

| Despues de... | Ejecutar... | Condicion |
| ------------- | ----------- | --------- |
| {Command A}   | {Command B} | {Cuando}  |
```
