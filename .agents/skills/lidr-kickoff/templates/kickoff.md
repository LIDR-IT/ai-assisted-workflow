---
id: tpl-kickoff
version: "1.0.0"
last_updated: "2026-03-16"
updated_by: "System: Template Migration"
status: active
type: template
review_cycle: 60
next_review: "2026-05-15"
owner_role: "Scrum Master"
---

# Kickoff / Acta de Inicio Template

> **Uso**: Acta formal de kick-off de proyecto. Usado por el skill `kickoff`.
> **Gate**: Gate 0 (Intake)

---

## Datos del Proyecto

| Campo               | Valor             |
| ------------------- | ----------------- |
| Nombre del proyecto | {nombre_proyecto} |
| Sponsor             | {nombre_sponsor}  |
| Product Owner       | {nombre_po}       |
| Tech Lead           | {nombre_tl}       |
| Fecha kick-off      | {YYYY-MM-DD}      |
| Duracion estimada   | {N semanas/meses} |

---

## Asistentes

| Nombre   | Rol   | Area          | Presente |
| -------- | ----- | ------------- | -------- |
| {nombre} | {rol} | {area/equipo} | Si / No  |

---

## Objetivo del Proyecto

{Descripcion clara del objetivo principal del proyecto en 2-3 oraciones. Debe responder: Que se construye y para quien.}

---

## Alcance

### In Scope

- {funcionalidad/entregable 1}
- {funcionalidad/entregable 2}
- {funcionalidad/entregable 3}

### Out of Scope

- {exclusion explicita 1}
- {exclusion explicita 2}

---

## Contexto de Negocio

{Resumen del Business Case: problema de negocio, oportunidad, metricas de exito esperadas. Referencia al BC aprobado.}

---

## Decisiones Tomadas

| #   | Decision   | Responsable | Justificacion   |
| --- | ---------- | ----------- | --------------- |
| 1   | {decision} | {nombre}    | {justificacion} |

---

## Riesgos Iniciales Identificados

| ID    | Riesgo   | Probabilidad    | Impacto         | Mitigacion propuesta |
| ----- | -------- | --------------- | --------------- | -------------------- |
| R-001 | {riesgo} | alta/media/baja | alto/medio/bajo | {mitigacion}         |

---

## Proximos Pasos

| #   | Accion   | Owner    | Fecha limite |
| --- | -------- | -------- | ------------ |
| 1   | {accion} | {nombre} | {YYYY-MM-DD} |

---

## Criterios de Exito

- [ ] {criterio medible 1}
- [ ] {criterio medible 2}
- [ ] {criterio medible 3}

---

## Firmas

| Rol           | Nombre   | Firma          | Fecha        |
| ------------- | -------- | -------------- | ------------ |
| Sponsor       | {nombre} | \***\*\_\*\*** | {YYYY-MM-DD} |
| Product Owner | {nombre} | \***\*\_\*\*** | {YYYY-MM-DD} |
| Tech Lead     | {nombre} | \***\*\_\*\*** | {YYYY-MM-DD} |
