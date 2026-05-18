---
id: tpl-stakeholder-map
version: "1.0.0"
last_updated: "2026-03-16"
updated_by: "System: Template Migration"
status: active
type: template
review_cycle: 60
next_review: "2026-05-15"
owner_role: "PME"
---

# Stakeholder Map Template

> **Uso**: Mapa de interesados con matriz poder-interes. Usado por el skill `stakeholder-map`.
> **Gate**: Gate 0 (Intake)

---

## Metadatos

| Campo                | Valor             |
| -------------------- | ----------------- |
| Proyecto             | {nombre_proyecto} |
| Responsable          | {nombre_pme}      |
| Fecha de creacion    | {YYYY-MM-DD}      |
| Ultima actualizacion | {YYYY-MM-DD}      |

---

## Mapa de Interesados

| Nombre   | Rol   | Organizacion | Influencia      | Interes         | Estrategia                                                | Canal preferido                  | Frecuencia                             | Notas   |
| -------- | ----- | ------------ | --------------- | --------------- | --------------------------------------------------------- | -------------------------------- | -------------------------------------- | ------- |
| {nombre} | {rol} | {org/area}   | alto/medio/bajo | alto/medio/bajo | manage closely / keep satisfied / keep informed / monitor | email / slack / meeting / report | diaria / semanal / quincenal / mensual | {notas} |

---

## Matriz Poder-Interes (2x2)

```
Influencia ↑

  ALTA  │  Keep Satisfied    │  Manage Closely     │
        │  {nombres}         │  {nombres}          │
        │                    │                     │
  ──────┼────────────────────┼─────────────────────┤
        │                    │                     │
  BAJA  │  Monitor           │  Keep Informed      │
        │  {nombres}         │  {nombres}          │
        │                    │                     │
        └────────────────────┴─────────────────────→
              BAJO                 ALTO          Interes
```

---

## Estrategias de Gestion

| Cuadrante                                          | Estrategia              | Acciones tipicas                                              |
| -------------------------------------------------- | ----------------------- | ------------------------------------------------------------- |
| **Manage Closely** (alta influencia, alto interes) | Engagement activo       | Reuniones regulares, decision-making conjunto, feedback loops |
| **Keep Satisfied** (alta influencia, bajo interes) | Informar proactivamente | Reportes ejecutivos, escalamiento temprano de riesgos         |
| **Keep Informed** (baja influencia, alto interes)  | Comunicacion regular    | Newsletters, demos, acceso a dashboards                       |
| **Monitor** (baja influencia, bajo interes)        | Observacion pasiva      | Comunicaciones generales, informes trimestrales               |

---

## Plan de Comunicacion Derivado

| Audiencia      | Mensaje clave   | Canal   | Frecuencia   | Responsable |
| -------------- | --------------- | ------- | ------------ | ----------- |
| {grupo/nombre} | {que comunicar} | {canal} | {frecuencia} | {nombre}    |

---

## Historial de Cambios

| Fecha        | Cambio                                                                  | Responsable |
| ------------ | ----------------------------------------------------------------------- | ----------- |
| {YYYY-MM-DD} | {descripcion del cambio: nuevo stakeholder, cambio de estrategia, etc.} | {nombre}    |
