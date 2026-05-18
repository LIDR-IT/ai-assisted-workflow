---
id: tpl-adr
version: "1.0.0"
last_updated: "2026-03-07"
updated_by: "TL: Lead Engineer"
status: active
---

# ADR Template (MADR v3)

> **Uso**: Architecture Decision Record en formato MADR. Usado por el skill `adr`.
> **Gate**: Transversal (principalmente Fase 5 — Desarrollo)

---

## ADR-{NNNN}: {Titulo de la Decision}

### Estado

{proposed | accepted | deprecated | superseded by ADR-NNNN}

### Fecha

{YYYY-MM-DD}

### Contexto

{Describe el contexto tecnico y de negocio que motiva esta decision. Incluye restricciones, requisitos relevantes (RF/NFR) y estado actual del sistema.}

### Problema

{Formula la pregunta o problema arquitectonico que necesita resolucion. Ejemplo: "Necesitamos decidir como gestionar el estado de sesiones en un sistema distribuido."}

### Decision Drivers

- {Driver 1: ej. rendimiento bajo carga (NFR-003)}
- {Driver 2: ej. experiencia de desarrollo del equipo}
- {Driver 3: ej. coste de licencia}
- {Driver 4: ej. compatibilidad con stack existente}

### Opciones Consideradas

#### Opcion 1: {nombre}

- **Pros**: {ventajas}
- **Cons**: {desventajas}

#### Opcion 2: {nombre}

- **Pros**: {ventajas}
- **Cons**: {desventajas}

#### Opcion 3: {nombre}

- **Pros**: {ventajas}
- **Cons**: {desventajas}

### Decision

Se elige **Opcion {N}: {nombre}** porque {justificacion vinculada a los decision drivers}.

### Consecuencias

#### Positivas

- {consecuencia positiva 1}
- {consecuencia positiva 2}

#### Negativas

- {consecuencia negativa 1 + mitigacion planificada}

#### Neutras

- {consecuencia neutra / trade-off aceptado}

### Links

- RF/NFR relacionados: {RF-NNN, NFR-NNN}
- PRD origen: {PRD-T seccion N / PRD-F seccion N}
- ADRs relacionados: {ADR-NNNN (si aplica)}
- Ticket Jira: {PROJ-NNN}
