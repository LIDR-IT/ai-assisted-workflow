---
id: phases-template
version: "1.0.0"
last_updated: "2026-03-16"
updated_by: "System: Template Migration"
status: active
type: template
review_cycle: 60
next_review: "2026-05-15"
owner_role: "Tech Lead"
---

# Template: Implementation Phases

> **Propósito**: Plan de implementación por fases — qué se construye, en qué orden, y qué se entrega en cada fase.
> **Cuándo se crea**: Fase 3 — Después de PRD + Épicas aprobados, antes de Sprint Planning
> **Quién lo llena**: Tech Lead + PO con skill `implementation-phases`
> **Quién lo valida**: PO (valor incremental) + Tech Lead (viabilidad) + QA (testabilidad)
> **Gate asociado**: Gate 2-3 (informa Sprint Planning)
> **Instancias**: `docs/projects/{proyecto}/phases.md`

---

## Secciones del Documento

### 1. Resumen del Plan

```markdown
## Resumen

**Proyecto**: {nombre}
**Total fases**: {N}
**Timeline total**: {N sprints / N semanas}
**Estrategia**: {MVP first / Core-out / Layer-by-layer / Feature-based}

### Principio de Entrega

{Describir la filosofía de entrega incremental: qué valor se entrega primero y por qué}
```

### 2. Fases de Implementación

```markdown
## Fase {N}: {Nombre} — "{Tagline de 1 línea}"

### Objetivo

{Qué valor se entrega al completar esta fase — perspectiva de negocio}

### Épicas / Features

| Épica  | Feature             | Prioridad   | Sprints |
| ------ | ------------------- | ----------- | ------- |
| EP-XXX | {descripción corta} | Must/Should | N       |

### Entregable

{Qué puede demostrarse al final de esta fase}

- [ ] {Entregable 1 — ej: API de enrolamiento funcionando en staging}
- [ ] {Entregable 2 — ej: UI de captura facial end-to-end}
- [ ] {Entregable 3}

### Dependencias de la Fase

| Dependencia | Tipo                   | Responsable | Fecha límite | Status |
| ----------- | ---------------------- | ----------- | ------------ | ------ |
|             | Técnica/Equipo/Externa |             |              |        |

### Criterios de Completitud de Fase

- [ ] Todos los entregables demostrados en staging
- [ ] QA ejecutó test cases de las US de la fase
- [ ] 0 bugs bloqueantes/críticos abiertos
- [ ] Documentación actualizada (architecture, db-schema si cambió)
- [ ] Demo a stakeholders completada

### Riesgos de la Fase

| Riesgo | Prob. | Impacto | Mitigación |
| ------ | ----- | ------- | ---------- |
|        |       |         |            |
```

### 3. Diagrama de Fases

```markdown
## Timeline Visual

### Diagrama de Gantt (simplificado)

| Fase               | Sprint 1 | Sprint 2 | Sprint 3 | Sprint 4 | Sprint 5 | Sprint 6 |
| ------------------ | -------- | -------- | -------- | -------- | -------- | -------- |
| Fase 1: Foundation | ████████ | ████████ |          |          |          |          |
| Fase 2: Core       |          | ████████ | ████████ | ████████ |          |          |
| Fase 3: Polish     |          |          |          |          | ████████ | ████████ |

### Dependencias entre Fases

Fase 1 → Fase 2 → Fase 3
↘ Fase 2b (paralelo si hay equipo) ↗

### Milestones

| Milestone               | Fecha Target | Fase   | Entregable Clave |
| ----------------------- | ------------ | ------ | ---------------- |
| M1: Foundation complete | Sprint 2 end | Fase 1 | {qué}            |
| M2: Core feature ready  | Sprint 4 end | Fase 2 | {qué}            |
| M3: MVP launch          | Sprint 6 end | Fase 3 | {qué}            |
```

### 4. Stack Técnico por Fase

```markdown
## Stack por Fase

### Fase 1: {qué se configura}

- [ ] Proyecto inicializado con stack base
- [ ] CI/CD pipeline funcional
- [ ] Entornos dev + staging configurados
- [ ] Auth básica implementada
- [ ] DB schema inicial migrado
- [ ] Monitoring básico activo

### Fase 2: {qué se construye}

- [ ] {Componente técnico 1}
- [ ] {Componente técnico 2}
- [ ] {Integración con servicio X}

### Fase N: {qué se completa}

- [ ] {Feature final}
- [ ] Performance optimization
- [ ] Security hardening
- [ ] Documentation complete
```

### 5. Criterios de Go/No-Go por Fase

```markdown
## Go/No-Go

### Criterios para avanzar a Fase {N+1}

| Criterio                 | Peso        | Quién evalúa |
| ------------------------ | ----------- | ------------ |
| Entregables completados  | Obligatorio | Tech Lead    |
| QA sin bloqueantes       | Obligatorio | QA Lead      |
| Demo a stakeholders      | Obligatorio | PO           |
| Métricas de calidad      | Deseable    | Tech Lead    |
| Deuda técnica controlada | Deseable    | Tech Lead    |

### Si No-Go

| Situación               | Acción                                   |
| ----------------------- | ---------------------------------------- |
| Bug bloqueante abierto  | Sprint adicional de fix antes de avanzar |
| Feature incompleta      | Mover a fase siguiente, ajustar scope    |
| Dependencia no resuelta | Escalar, re-planificar fases             |
```

---

## Criterios de Completitud del Documento

| Criterio                                | Obligatorio | Validación                  |
| --------------------------------------- | ----------- | --------------------------- |
| Todas las épicas asignadas a una fase   | Sí          | Cruzar con epics.md         |
| Cada fase con entregable concreto       | Sí          | Automática                  |
| Timeline con sprints                    | Sí          | Automática                  |
| Dependencias entre fases identificadas  | Sí          | Automática (DAG)            |
| Milestones definidos                    | Sí          | ≥1 por fase                 |
| Criterios Go/No-Go por fase             | Sí          | Automática                  |
| Total timeline ≤ Product Brief timeline | Sí          | Cruzar con product-brief.md |

---

## Skills que Asisten

- **Generación**: Skill `implementation-phases` descompone épicas en fases
- **Input**: `epics.md` + `architecture.md` + `product-brief.md` (timeline)
- **Validación**: `/validate-project-docs` verifica trazabilidad épicas→fases
- **Siguiente**: Sprint Planning con `skills/sprint-capacity`

---

_Template — instancia en `docs/projects/{proyecto}/phases.md`_
