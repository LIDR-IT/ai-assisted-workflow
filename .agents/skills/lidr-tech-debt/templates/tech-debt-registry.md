---
id: tpl-tech-debt
version: "1.0.0"
last_updated: "2026-03-16"
updated_by: "System: Template Migration"
status: active
type: template
review_cycle: 30
next_review: "2026-04-15"
owner_role: "Tech Lead"
---

# Tech Debt Registry Template

> **Uso**: Catalogo centralizado de deuda tecnica. Usado por el skill `tech-debt`.
> **Gate**: Transversal (aplica en todas las fases)

---

## Metadatos del Registro

| Campo                | Valor             |
| -------------------- | ----------------- |
| Proyecto             | {nombre_proyecto} |
| Responsable          | {nombre_tl}       |
| Fecha de creacion    | {YYYY-MM-DD}      |
| Ultima actualizacion | {YYYY-MM-DD}      |

---

## Catalogo de Deuda

| ID     | Tipo                                      | Descripcion         | Origen                            | Severidad                     | Esfuerzo estimado | Impacto si no se paga | Estrategia                  | Sprint target        | Estado                                    |
| ------ | ----------------------------------------- | ------------------- | --------------------------------- | ----------------------------- | ----------------- | --------------------- | --------------------------- | -------------------- | ----------------------------------------- |
| TD-001 | code / architecture / test / docs / infra | {descripcion_clara} | deliberada / accidental / bit rot | critica / alta / media / baja | {N}h / {N}d       | {descripcion_impacto} | refactor / rewrite / accept | Sprint {N} / backlog | abierto / en progreso / pagado / aceptado |

---

## Clasificacion de Tipos

| Tipo             | Descripcion                         | Ejemplos                                                         |
| ---------------- | ----------------------------------- | ---------------------------------------------------------------- |
| **code**         | Deuda en codigo fuente              | Duplicacion, complejidad ciclomatica alta, TODO/HACK             |
| **architecture** | Deuda en diseno/arquitectura        | Acoplamiento fuerte, patron inadecuado, monolito sin descomponer |
| **test**         | Deuda en cobertura/calidad de tests | Cobertura < 80%, tests fragiles, sin E2E                         |
| **docs**         | Deuda en documentacion              | PRDs desactualizados, ADRs faltantes, README obsoleto            |
| **infra**        | Deuda en infraestructura/CI/CD      | Pipeline lento, sin IaC, dependencias desactualizadas            |

---

## Metricas Agregadas

| Metrica                         | Valor                             |
| ------------------------------- | --------------------------------- |
| Total items de deuda            | {N}                               |
| Deuda critica/alta              | {N}                               |
| Esfuerzo total estimado         | {N} horas                         |
| Items pagados este quarter      | {N}                               |
| Tendencia (vs quarter anterior) | creciendo / estable / decreciendo |

---

## Tendencia por Sprint

| Sprint     | Items nuevos | Items pagados | Balance neto | Total acumulado |
| ---------- | ------------ | ------------- | ------------ | --------------- |
| Sprint {N} | {N}          | {N}           | +{N} / -{N}  | {N}             |
