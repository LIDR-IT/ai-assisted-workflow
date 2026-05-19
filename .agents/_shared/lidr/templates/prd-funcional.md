---
id: prd-funcional-template
version: "1.0.0"
last_updated: "2026-03-16"
updated_by: "System: Template Migration"
status: active
type: template
review_cycle: 60
next_review: "2026-05-15"
owner_role: "Product Owner"
---

# Template: PRD Funcional

> **Propósito**: Especificación funcional del producto desde perspectiva de negocio y usuario.
> **Cuándo se crea**: Fase 2 — Discovery, después del Product Brief aprobado
> **Quién lo llena**: Product Owner con skill `prd-funcional`
> **Gate asociado**: Gate 1 — PRD Aprobado (junto con PRD Técnico)

---

## Estructura del Documento

### 1. Encabezado

```markdown
---
proyecto: { nombre }
version: { 1.0 }
estado: Borrador | En Revisión | Aprobado
autor_funcional: { PO nombre }
fecha_creacion: { YYYY-MM-DD }
product_brief_ref: { link al product-brief aprobado }
---
```

### 2. Overview del Producto

```markdown
## Overview del Producto

### Visión

{Visión del producto — derivada del Product Brief}

### Propuesta de Valor

{Qué valor único aporta este producto}

### Scope

{Qué incluye y qué no incluye}
```

### 3. User Personas

```markdown
## User Personas

| Persona  | Descripción             | Necesidades            | Pain Points              | Goals       |
| -------- | ----------------------- | ---------------------- | ------------------------ | ----------- |
| {nombre} | {descripción detallada} | {lista de necesidades} | {frustraciones actuales} | {objetivos} |
```

### 4. User Journeys

```markdown
## User Journeys

### Journey 1: {nombre descriptivo}

| Paso | Actor     | Acción              | Touchpoint       | Emoción                    | Oportunidad        |
| ---- | --------- | ------------------- | ---------------- | -------------------------- | ------------------ |
| 1    | {persona} | {acción específica} | {interfaz/canal} | {frustración/satisfacción} | {mejora potencial} |
| 2    |           |                     |                  |                            |                    |
```

### 5. Funcionalidades Clave

```markdown
## Funcionalidades Clave

| ID    | Funcionalidad | Prioridad (MoSCoW)      | Persona   | Journey   | Descripción             |
| ----- | ------------- | ----------------------- | --------- | --------- | ----------------------- |
| F-001 | {nombre}      | Must/Should/Could/Won't | {persona} | {journey} | {descripción detallada} |
```

### 6. Métricas de Éxito

```markdown
## Métricas de Éxito

| Métrica              | Baseline       | Target     | Método de Medición    | Frecuencia               |
| -------------------- | -------------- | ---------- | --------------------- | ------------------------ |
| {métrica de negocio} | {valor actual} | {objetivo} | {herramienta/proceso} | {diario/semanal/mensual} |
```

### 7. Roadmap Funcional

```markdown
## Roadmap Funcional

| Fase | Funcionalidades | Timeline | Dependencias              |
| ---- | --------------- | -------- | ------------------------- |
| MVP  | F-001, F-002    | {fecha}  | {dependencias externas}   |
| v1.1 | F-003           | {fecha}  | {funcionalidades previas} |
```

---

## Criterios de Completitud

| Criterio                           | Obligatorio | Validación                        |
| ---------------------------------- | ----------- | --------------------------------- |
| Al menos 1 persona                 | Sí          | Con necesidades y pain points     |
| Al menos 1 journey                 | Sí          | End-to-end con ≥5 pasos           |
| Funcionalidades con MoSCoW         | Sí          | Al menos 1 "Must Have"            |
| Métricas de éxito                  | Sí          | ≥3 métricas con target y baseline |
| Overview derivado de Product Brief | Sí          | Consistencia verificada           |

---

## Skills que Asisten

- **Generación**: Skill `prd-funcional` genera borrador completo
- **Validación**: Command `/validate-prd` verifica completitud
- **Review Cruzado**: Skill `review-cruzado` alinea con PRD Técnico

---

_Template — instancia en `docs/projects/{proyecto}/prd-funcional.md`_
