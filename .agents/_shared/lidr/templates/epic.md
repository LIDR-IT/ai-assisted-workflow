# Template: Epics Breakdown

> **Propósito**: Descomposición del producto en épicas con trazabilidad a funcionalidades del PRD.
> **Cuándo se crea**: Fase 2-3 — Entre PRD aprobado y Sprint Planning
> **Quién lo llena**: PO + Tech Lead con skill `epic-breakdown` (detallado) o `tracking-integration` (master project)
> **Gate asociado**: Gate 2 (alineado con RF Completos) → Gate 3 (Sprint Planning)
> **Instancias**: `docs/projects/{proyecto}/epics.md`

---

## Secciones del Documento

### 1. Resumen de Épicas

```markdown
## Resumen

**Proyecto**: {nombre}
**Total épicas**: {N}
**Timeline**: Sprint {inicio} — Sprint {fin}
**PRD ref**: {link al PRD aprobado}

### Mapa Visual

{Diagrama de dependencias entre épicas — orden de implementación}
```

### 2. Tabla de Épicas

```markdown
## Épicas

| ID     | Nombre | Descripción (1 oración) | Funcionalidades PRD | Prioridad | Sprints Est. | Dependencias | Owner |
| ------ | ------ | ----------------------- | ------------------- | --------- | ------------ | ------------ | ----- |
| EP-001 |        |                         | F-001, F-002        | Must      | 2-3          | —            |       |
| EP-002 |        |                         | F-003               | Must      | 1-2          | EP-001       |       |
| EP-003 |        |                         | F-004, F-005        | Should    | 2            | EP-001       |       |
```

### 3. Detalle por Épica

```markdown
## EP-{NNN}: {Nombre}

### Objetivo

{Qué valor entrega esta épica al completarse — 1-2 oraciones}

### Funcionalidades Cubiertas

| ID PRD | Funcionalidad | Prioridad   | Notas |
| ------ | ------------- | ----------- | ----- |
| F-XXX  |               | Must/Should |       |

### User Stories Previstas

| US ID | Título                                    | Estimación | RF     | Sprint Tentativo |
| ----- | ----------------------------------------- | ---------- | ------ | ---------------- |
|       | Como [actor] quiero [acción] para [valor] | Xh         | RF-XXX | Sprint N         |

### Criterios de Aceptación de la Épica

- [ ] {Criterio 1 — observable y medible}
- [ ] {Criterio 2}

### Dependencias

| Tipo    | Descripción                            | Estado | Bloqueante |
| ------- | -------------------------------------- | ------ | ---------- |
| Técnica | {ej: API X debe estar lista}           |        | Sí/No      |
| Equipo  | {ej: equipo de diseño entrega mockups} |        | Sí/No      |

### Riesgos

| Riesgo | Prob. | Impacto | Mitigación |
| ------ | ----- | ------- | ---------- |
|        |       |         |            |

### Definition of Done de la Épica

- [ ] Todas las US completadas y pasaron DoD
- [ ] QA sign-off para todas las US de esta épica
- [ ] Documentación actualizada
- [ ] Feature deployable (detrás de feature flag si es necesario)
```

### 4. Orden de Implementación

```markdown
## Orden de Implementación

### Diagrama de Dependencias

EP-001 → EP-002 → EP-004
↘ EP-003 → EP-005

### Timeline por Sprint

| Sprint     | Épicas Activas | Entregable       |
| ---------- | -------------- | ---------------- |
| Sprint 1-2 | EP-001         | {qué se entrega} |
| Sprint 3   | EP-002, EP-003 | {qué se entrega} |

### Entregables Incrementales

{Qué puede demostrarse al final de cada épica — valor incremental}
```

---

## Criterios de Completitud

| Criterio                                                 | Obligatorio | Validación |
| -------------------------------------------------------- | ----------- | ---------- |
| Toda funcionalidad PRD (Must/Should) mapeada a ≥1 épica  | Sí          | Automática |
| Cada épica con ≥1 US prevista                            | Sí          | Automática |
| Dependencias entre épicas identificadas (DAG sin ciclos) | Sí          | Automática |
| Orden de implementación definido                         | Sí          | Automática |
| Estimación en sprints por épica                          | Sí          | Automática |
| Owner asignado por épica                                 | Sí          | Automática |
| Total sprints estimados ≤ timeline del Product Brief     | Sí          | Semi-auto  |

---

## Skills que Asisten

- **Generación**: Skill `tracking-integration` genera estructura de proyecto desde PRD
- **User Stories**: Skill `user-stories` descompone épicas en US
- **Validación**: `/validate-project-docs` verifica trazabilidad PRD→Épicas→US
- **Anterior**: PRD aprobado + RFs generados
- **Siguiente**: Sprint Planning con `skills/sprint-capacity`

---

_Template — instancia en `docs/projects/{proyecto}/epics.md`_
