---
id: sprint-commitment
version: '1.0.0'
last_updated: '2026-03-25'
updated_by: 'IA: sync-docs'
status: active
type: standard
review_cycle: 90
next_review: '2026-06-23'
owner_role: 'Tech Lead'
---

# Formato Estándar: Sprint Commitment Record

> **Propósito**: Formato oficial de compromiso de sprint firmado por PO + Tech Lead.
> **Referenciado por**: `.claude/rules/org.md` via `@../standards/sprint-commitment.md`
> **Pre-llenado por**: Skill `sprint-capacity` (capacity) + Skill `user-stories` (US)
> **Gate asociado**: Gate 3 — Sprint Committed
> **Política**: No se inicia implementación sin commitment firmado. PO y Tech Lead son co-responsables.

---

## 1. Información del Sprint

| Campo            | Valor                       | Notas                                 |
| ---------------- | --------------------------- | ------------------------------------- |
| **Sprint**       | Sprint {N}                  | Secuencial desde inicio del proyecto  |
| **Fecha inicio** | {YYYY-MM-DD} (Lunes)        | Siempre inicia en lunes               |
| **Fecha fin**    | {YYYY-MM-DD} (Viernes)      | 2 semanas = 10 días hábiles           |
| **Sprint Goal**  | {Objetivo en 1-2 oraciones} | Comunicable a stakeholders en 30 seg  |
| **Proyecto**     |                             | Proyecto/producto                     |
| **Equipo**       | {Nombres}                   | Todos los miembros que participan     |
| **Scrum Master** |                             | Responsable de facilitar y documentar |

### Sprint Goal Guidelines

| Criterio          | Ejemplo bueno                                            | Ejemplo malo                           |
| ----------------- | -------------------------------------------------------- | -------------------------------------- |
| Orientado a valor | "Entregar enrolamiento facial end-to-end"                | "Hacer tickets del backlog"            |
| Medible           | "3 endpoints de API de biometría funcionando en staging" | "Avanzar en el proyecto"               |
| Comunicable       | Stakeholders entienden qué se entrega                    | Solo el equipo entiende                |
| Alcanzable        | Cabe en la capacity del sprint                           | Requiere más capacity de la disponible |

---

## 2. Capacidad del Equipo

### 2.1 Cálculo de Capacity

| Miembro             | Rol       | Días disponibles | % Dedicación | Horas efectivas/día | Horas sprint   | Notas                                |
| ------------------- | --------- | ---------------- | ------------ | ------------------- | -------------- | ------------------------------------ |
|                     | Dev       | /10              | %            | 6h                  |                |                                      |
|                     | Dev       | /10              | %            | 6h                  |                | Vacaciones X días                    |
|                     | QA        | /10              | %            | 6h                  |                |                                      |
|                     | Tech Lead | /10              | %            | 4h (coding)         |                | 2h/día en reviews + meetings         |
| **Subtotal bruto**  |           |                  |              |                     | **{total}h**   |                                      |
| **Buffer (15-20%)** |           |                  |              |                     | **-{buffer}h** | 15% estándar, 20% si hay riesgo alto |
| **Capacity neta**   |           |                  |              |                     | **{neto}h**    | ← Esta es la capacity real           |

### 2.2 Reglas de Cálculo

| Regla                   | Detalle                                                                      |
| ----------------------- | ---------------------------------------------------------------------------- |
| **Horas efectivas/día** | Dev: 6h (descontando daily, meetings). Tech Lead: 4h (coding) + 2h (reviews) |
| **% Dedicación**        | 100% = full time en el proyecto. Ajustar si comparte con otros proyectos     |
| **Días disponibles**    | 10 - vacaciones - formación - días libres                                    |
| **Buffer mínimo**       | 15% para sprints normales, 20% si hay sprint con PoC/spike/deuda técnica     |
| **No over-commit**      | Capacity neta es el máximo. Commitment ≤ capacity neta SIEMPRE               |

### 2.3 Histórico de Velocity (para calibración)

| Sprint       | Committed (h) | Completed (h) | Ratio | Carryover | Notas                           |
| ------------ | ------------- | ------------- | ----- | --------- | ------------------------------- |
| N-3          |               |               | %     | US        |                                 |
| N-2          |               |               | %     | US        |                                 |
| N-1          |               |               | %     | US        |                                 |
| **Promedio** |               |               | **%** |           | ← Usar para calibrar commitment |

---

## 3. User Stories Comprometidas

### 3.1 Sprint Backlog

| Prioridad            | US ID | Título | RF origen | Estimación (h) | DoR     | Asignado a | Riesgo          |
| -------------------- | ----- | ------ | --------- | -------------- | ------- | ---------- | --------------- |
| P1 (Must)            |       |        | RF-XXX    |                | ✅ PASS |            | Bajo/Medio/Alto |
| P1 (Must)            |       |        | RF-XXX    |                | ✅ PASS |            |                 |
| P2 (Should)          |       |        | RF-XXX    |                | ✅ PASS |            |                 |
| P3 (Could)           |       |        | RF-XXX    |                | ✅ PASS |            |                 |
| **Total commitment** |       |        |           | **{total}h**   |         |            |                 |

### 3.2 Reglas del Backlog

| Regla                | Detalle                                                                                                  |
| -------------------- | -------------------------------------------------------------------------------------------------------- |
| **DoR obligatorio**  | 100% de US comprometidas deben pasar DoR (`skills/refinement-notes/checklists/dor.md`) — sin excepciones |
| **Prioridad MoSCoW** | P1 (Must) se hace primero. P3 (Could) = stretch goal, se hace si sobra tiempo                            |
| **Asignación**       | Cada US tiene un dev asignado (owner, no necesariamente único implementador)                             |
| **Sin US sin RF**    | Toda US debe tener RF de origen trazable (excepto tasks de infra/deuda técnica)                          |
| **Riesgo evaluado**  | Cada US tiene riesgo estimado. Alto = plan de mitigación documentado                                     |

---

## 4. Ratio Commitment/Capacity

### 4.1 Cálculo

| Métrica              | Valor     | Target        | Status                           |
| -------------------- | --------- | ------------- | -------------------------------- |
| **Capacity neta**    | {neto}h   | —             | —                                |
| **Commitment total** | {total}h  | —             | —                                |
| **Ratio**            | {ratio}%  | 80-90%        | ✅ En rango / ⚠️ Bajo / ❌ Sobre |
| **Buffer restante**  | {buffer}h | ≥10% capacity | ✅/❌                            |

### 4.2 Interpretación del Ratio

| Ratio       | Interpretación                                   | Acción                                   |
| ----------- | ------------------------------------------------ | ---------------------------------------- |
| **<70%**    | Under-commit. Capacidad desaprovechada           | Agregar US o reducir equipo asignado     |
| **70-80%**  | Conservador. Aceptable si sprint tiene spike/PoC | Documentar justificación                 |
| **80-90%**  | Óptimo. Balance entre entrega y buffer           | ✅ Ideal                                 |
| **90-100%** | Agresivo. Sin margen para imprevistos            | Evaluar riesgos — requiere justificación |
| **>100%**   | Over-commit. El equipo NO puede completar todo   | ❌ Reducir scope obligatoriamente        |

---

## 5. Riesgos del Sprint

| #   | Riesgo | Probabilidad    | Impacto         | US Afectada(s) | Mitigación | Owner | Trigger de escalamiento            |
| --- | ------ | --------------- | --------------- | -------------- | ---------- | ----- | ---------------------------------- |
| 1   |        | Alto/Medio/Bajo | Alto/Medio/Bajo | US-XXX         |            |       | Si {condición} → escalar a {quién} |
| 2   |        |                 |                 |                |            |       |                                    |

### Riesgos Comunes a Evaluar

| Tipo                    | Ejemplos                                                 | Mitigación típica                                   |
| ----------------------- | -------------------------------------------------------- | --------------------------------------------------- |
| **Dependencia externa** | API de terceros no disponible, equipo externo no entrega | Mock API, deadline de escalamiento                  |
| **Complejidad técnica** | Feature más compleja de lo estimado                      | Spike previo, pair programming, split US            |
| **Disponibilidad**      | Miembro enfermo, vacaciones imprevistas                  | Buffer 20% en lugar de 15%, US P3 como sacrificable |
| **Infraestructura**     | Entorno no disponible, CI/CD roto                        | DevOps como backup, feature flags                   |
| **Requisitos ambiguos** | PO no disponible para clarificar                         | Pre-refinar todas las US, DoR estricto              |

---

## 6. Dependencias del Sprint

| #   | Dependencia | Tipo                   | US Afectada | Responsable | Estado                       | Fecha límite | Escalamiento                           |
| --- | ----------- | ---------------------- | ----------- | ----------- | ---------------------------- | ------------ | -------------------------------------- |
| 1   |             | Técnica/Equipo/Externa |             |             | Resuelto/Pendiente/En riesgo |              | Si no resuelto para {fecha} → {acción} |

---

## 7. Acuerdos de Equipo

### 7.1 Checklist Pre-commitment

- [ ] Sprint backlog definido y priorizado por PO
- [ ] **100% de US cumplen DoR** (`@../checklists/dor.md`)
- [ ] Capacity calculada con buffer incluido (≥15%)
- [ ] Ratio commitment/capacity en rango 80-90%
- [ ] Dependencias identificadas con plan y owner
- [ ] Riesgos evaluados con mitigación
- [ ] Sprint goal aceptado por todo el equipo
- [ ] Histórico de velocity revisado para calibración
- [ ] Asignaciones acordadas (no impuestas)
- [ ] QA tiene visibilidad de US para preparar testing

### 7.2 Acuerdos de Trabajo

| Acuerdo               | Detalle                                                             |
| --------------------- | ------------------------------------------------------------------- |
| **Daily standup**     | {Hora}, {formato: async/sync}, {canal}                              |
| **Disponibilidad PO** | {Horario para consultas}                                            |
| **Code review SLA**   | ≤4 horas para PR review                                             |
| **Blocker protocol**  | Si estás bloqueado >2h → Slack al equipo                            |
| **Scope protection**  | No se agregan US mid-sprint sin quitar otra de igual o mayor tamaño |

---

## 8. Sign-off

### 8.1 Firmas Obligatorias

| Rol               | Nombre | Confirma                                                   | Firma | Fecha      |
| ----------------- | ------ | ---------------------------------------------------------- | ----- | ---------- |
| **Product Owner** |        | "Acepto el sprint backlog, prioridad, y sprint goal"       |       | YYYY-MM-DD |
| **Tech Lead**     |        | "Confirmo viabilidad técnica y estimaciones"               |       | YYYY-MM-DD |
| **Scrum Master**  |        | "Capacity verificada, DoR cumplido, acuerdos documentados" |       | YYYY-MM-DD |

### 8.2 Lo que firma el PO

- El sprint backlog es correcto y priorizado
- El sprint goal refleja el valor de negocio esperado
- Acepta que US P3 (Could) son sacrificables si hay impedimentos
- Se compromete a estar disponible para aclaraciones

### 8.3 Lo que firma el Tech Lead

- Las estimaciones son realistas con el equipo actual
- La viabilidad técnica de cada US ha sido evaluada
- Los riesgos técnicos están identificados con mitigación
- Se compromete a desbloquear impedimentos técnicos en ≤4h

---

## 9. Anti-patrones del Sprint Commitment

| Anti-patrón                  | Señal                                                | Solución                                                               |
| ---------------------------- | ---------------------------------------------------- | ---------------------------------------------------------------------- |
| **Commitment sin DoR**       | US entra sin criterios BDD o sin estimación          | 100% DoR obligatorio — sin excepciones                                 |
| **Over-commitment crónico**  | Ratio >100% sprint tras sprint                       | Usar velocity promedio como techo, no como suelo                       |
| **"Haremos lo que podamos"** | Sprint sin goal claro                                | Sprint goal obligatorio, firmado por PO                                |
| **Scope creep mid-sprint**   | PO agrega US sin quitar otra                         | Política: 1 in = 1 out (de igual o mayor tamaño)                       |
| **Estimación por presión**   | Tech Lead reduce estimaciones porque "hay que caber" | Estimaciones del equipo son finales — PO ajusta scope, no estimaciones |
| **Sprint sin buffer**        | 100% capacity comprometida                           | Mínimo 15% buffer SIEMPRE                                              |
| **Dependencias ignoradas**   | "Se resuelve durante el sprint"                      | Cada dependencia con owner, deadline, y plan de escalamiento           |

---

## 10. Conexión con el Flujo SDLC

```
RFs aprobados (Gate 2) → User Stories generadas (skill) → DoR check → Sprint Commitment
    ↓                                                                       ↓
Si firmado → Gate 3 passed → Desarrollo (DoD en skills/pr-description/checklists/dod.md)
Si no firmado → Refinar US, ajustar scope, re-calcular capacity
```

### Referencias Cruzadas

- **DoR**: `skills/refinement-notes/checklists/dor.md` — criterios de entrada de US
- **User Stories**: `skills/user-stories/SKILL.md` — generación de US
- **Sprint Capacity**: `skills/sprint-capacity/SKILL.md` — cálculo de capacity
- **Refinement Notes**: `skills/refinement-notes/SKILL.md` — notas de sesión
- **DoD (siguiente)**: `docs/checklists/dod.md` — criterios de salida
- **Org Standards**: `docs/standards/org.md` — Gate 3 criteria

---

_Sprint commitment firmado por PO + Tech Lead + SM._
_Sin firma no se inicia desarrollo. Over-commit = re-negociar scope, nunca reducir buffer._
