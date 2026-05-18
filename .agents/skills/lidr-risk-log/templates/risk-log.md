---
id: tpl-risk-log
version: "1.0.0"
last_updated: "2026-03-16"
updated_by: "System: Template Migration"
status: active
type: template
review_cycle: 30
next_review: "2026-04-15"
owner_role: "Tech Lead"
---

# Risk Log Template

> **Uso**: Registro centralizado de riesgos del proyecto. Usado por el skill `risk-log`.
> **Gate**: Gate 1 (Discovery)

---

## Metadatos del Registro

| Campo                | Valor             |
| -------------------- | ----------------- |
| Proyecto             | {nombre_proyecto} |
| Responsable          | {nombre_pme_o_tl} |
| Fecha de creacion    | {YYYY-MM-DD}      |
| Ultima actualizacion | {YYYY-MM-DD}      |

---

## Tabla de Riesgos

| ID    | Categoria                                    | Descripcion         | Probabilidad (1-5) | Impacto (1-5) | Score   | Estrategia                              | Owner    | Estado                                       | Fecha revision |
| ----- | -------------------------------------------- | ------------------- | ------------------ | ------------- | ------- | --------------------------------------- | -------- | -------------------------------------------- | -------------- |
| R-001 | tecnico / negocio / organizacional / externo | {descripcion_clara} | {1-5}              | {1-5}         | {P x I} | mitigar / aceptar / transferir / evitar | {nombre} | abierto / mitigado / cerrado / materializado | {YYYY-MM-DD}   |

---

## Heat Map

```
Impacto →   1       2       3       4       5
Prob ↓
  5       medio   alto    alto    critico critico
  4       bajo    medio   alto    alto    critico
  3       bajo    medio   medio   alto    alto
  2       bajo    bajo    medio   medio   alto
  1       bajo    bajo    bajo    medio   medio
```

---

## Umbrales de Escalamiento

| Score | Nivel   | Accion requerida                                   |
| ----- | ------- | -------------------------------------------------- |
| 20-25 | Critico | Escalar a sponsor + plan de contingencia inmediato |
| 12-19 | Alto    | Escalar a PME + mitigacion activa obligatoria      |
| 6-11  | Medio   | Monitoreo semanal + owner asignado                 |
| 1-5   | Bajo    | Monitoreo quincenal                                |

---

## Historial de Cambios

| Fecha        | Riesgo  | Cambio                   | Responsable |
| ------------ | ------- | ------------------------ | ----------- |
| {YYYY-MM-DD} | R-{NNN} | {descripcion del cambio} | {nombre}    |
