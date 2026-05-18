---
id: product-brief-template
version: "1.0.0"
last_updated: "2026-03-16"
updated_by: "System: Template Migration"
status: active
type: template
review_cycle: 90
next_review: "2026-06-14"
owner_role: "Product Owner"
---

# Template: Product Brief

> **Propósito**: Documento de arranque que captura la visión, problema, y alcance inicial de un producto/proyecto.
> **Cuándo se crea**: Fase 1 — Originación, antes del kick-off
> **Quién lo llena**: PME / Product Owner con asistencia de skill `business-case`
> **Quién lo valida**: Sponsor ejecutivo + stakeholders clave
> **Gate asociado**: Gate 0 — Intake Aprobado
> **Instancias por proyecto**: `docs/projects/{proyecto}/product-brief.md`

---

## Secciones del Documento

### 1. Resumen Ejecutivo

```markdown
## Resumen Ejecutivo

**Nombre del producto/proyecto**: {nombre}
**Sponsor**: {nombre y rol}
**Product Owner**: {nombre}
**Fecha**: {YYYY-MM-DD}
**Estado**: Borrador | En Revisión | Aprobado

### Elevator Pitch (2-3 oraciones)

{Qué es, para quién, qué problema resuelve, y por qué ahora}
```

**Criterio de validación**: Elevator pitch ≤3 oraciones. Debe responder QUÉ, PARA QUIÉN, POR QUÉ.

### 2. Problema

```markdown
## Problema

### Situación Actual

{Describir el estado actual — qué existe hoy, cómo funciona, qué dolor causa}

### Impacto del Problema

| Dimensión | Impacto                           | Evidencia                          |
| --------- | --------------------------------- | ---------------------------------- |
| Usuarios  | {cuántos afectados, cómo}         | {datos, métricas, feedback}        |
| Negocio   | {revenue, eficiencia, riesgo}     | {datos financieros si disponibles} |
| Técnico   | {deuda, escalabilidad, seguridad} | {métricas técnicas}                |

### Raíz del Problema

{Análisis causal — por qué existe el problema, no solo los síntomas}
```

**Criterios de validación**:

- [ ] Situación actual describe el status quo sin proponer soluciones
- [ ] Impacto cuantificado con al menos 1 métrica o dato concreto
- [ ] Raíz del problema identificada (no solo síntomas)

### 3. Solución Propuesta

```markdown
## Solución Propuesta

### Visión del Producto

{1-2 párrafos describiendo la solución en lenguaje de negocio}

### Objetivos Clave (máximo 5)

| #   | Objetivo | Métrica de Éxito | Target |
| --- | -------- | ---------------- | ------ |
| O1  |          |                  |        |
| O2  |          |                  |        |

### Alcance Inicial (MVP)

#### Incluye

- {Funcionalidad 1}
- {Funcionalidad 2}

#### Excluye (explícitamente)

- {Funcionalidad fuera de scope} — razón: {justificación}

### Anti-scope (lo que NUNCA será)

- {Funcionalidad que no se construirá bajo ninguna circunstancia}
```

**Criterios de validación**:

- [ ] Objetivos SMART (Specific, Measurable, Achievable, Relevant, Time-bound)
- [ ] ≤5 objetivos (foco)
- [ ] Alcance con inclusiones Y exclusiones explícitas
- [ ] Cada exclusión tiene justificación

### 4. Usuarios y Stakeholders

```markdown
## Usuarios y Stakeholders

### Usuarios Primarios

| Persona | Rol | Necesidad Principal | Frecuencia de Uso          |
| ------- | --- | ------------------- | -------------------------- |
|         |     |                     | Diaria / Semanal / Mensual |

### Stakeholders

| Nombre | Rol | Influencia      | Interés         | Canal de Comunicación |
| ------ | --- | --------------- | --------------- | --------------------- |
|        |     | Alta/Media/Baja | Alto/Medio/Bajo |                       |
```

**Criterios de validación**:

- [ ] Al menos 1 usuario primario identificado con necesidad concreta
- [ ] Stakeholders con nivel de influencia e interés mapeados
- [ ] Sponsor ejecutivo identificado

### 5. Contexto Técnico Inicial

```markdown
## Contexto Técnico (Alto Nivel)

### Stack Propuesto (si se conoce)

{Tecnologías principales propuestas o restricciones técnicas conocidas}

### Integraciones Necesarias

| Sistema | Tipo                  | Criticidad      | Estado                    |
| ------- | --------------------- | --------------- | ------------------------- |
|         | API / SDK / DB / File | Alta/Media/Baja | Disponible / Por negociar |

### Restricciones Técnicas Conocidas

- {Restricción 1 — ej: debe funcionar offline}
- {Restricción 2 — ej: compatibilidad con sistema legacy X}

### Requisitos de Seguridad/Compliance

- {Regulación aplicable — ej: GDPR, HIPAA}
- {Datos sensibles — ej: PII, financieros}
```

**Criterios de validación**:

- [ ] Integraciones identificadas con criticidad
- [ ] Restricciones técnicas explícitas
- [ ] Requisitos de compliance identificados si aplica

### 6. Timeline y Recursos

```markdown
## Timeline y Recursos

### Hitos Clave

| Hito      | Fecha Target | Dependencia |
| --------- | ------------ | ----------- |
| Kick-off  |              |             |
| MVP listo |              |             |
| Go-live   |              |             |

### Recursos Necesarios

| Rol | Cantidad | Dedicación | Disponibilidad |
| --- | -------- | ---------- | -------------- |
|     |          | %          | Desde {fecha}  |

### Presupuesto Estimado (si aplica)

| Concepto        | Estimación | Notas |
| --------------- | ---------- | ----- |
| Desarrollo      |            |       |
| Infraestructura |            |       |
| Licencias       |            |       |
```

### 7. Riesgos Iniciales

```markdown
## Riesgos Iniciales

| #   | Riesgo | Probabilidad    | Impacto         | Mitigación Propuesta |
| --- | ------ | --------------- | --------------- | -------------------- |
| R1  |        | Alta/Media/Baja | Alto/Medio/Bajo |                      |
```

### 8. Aprobación

```markdown
## Aprobación

| Rol     | Nombre | Decisión                     | Firma | Fecha |
| ------- | ------ | ---------------------------- | ----- | ----- |
| Sponsor |        | Aprobar / Rechazar / Diferir |       |       |
| PO      |        | Aprobar / Rechazar           |       |       |
```

---

## Criterios de Completitud Global

| Criterio                              | Obligatorio | Validación                |
| ------------------------------------- | ----------- | ------------------------- |
| Elevator pitch presente               | Sí          | Automática (≤3 oraciones) |
| Problema con impacto cuantificado     | Sí          | Semi-auto                 |
| ≤5 objetivos SMART                    | Sí          | Automática                |
| Alcance con inclusiones + exclusiones | Sí          | Automática                |
| Al menos 1 usuario primario           | Sí          | Automática                |
| Sponsor identificado                  | Sí          | Automática                |
| Timeline con ≥3 hitos                 | Sí          | Automática                |
| Al menos 1 riesgo identificado        | Sí          | Automática                |
| Aprobación del sponsor                | Sí          | Manual                    |

---

## Skills que Asisten

- **Generación**: Skill `business-case` genera borrador desde el problema de negocio
- **Stakeholders**: Skill `stakeholder-map` sugiere mapa de interesados
- **Validación**: Command `/validate-project-docs` verifica criterios de completitud
- **Siguiente paso**: Skill `kickoff` genera acta de kick-off desde este brief

---

_Template de formato — cada proyecto crea su instancia en `docs/projects/{proyecto}/product-brief.md`_
