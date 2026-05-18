---
name: lidr-business-case
id: business-case
version: "1.1.0"
last_updated: "2026-03-16"
updated_by: "Tech Lead: System"
status: active
phase: 1
owner_role: "TL"
automation: false
domain_agnostic: true
description: >
  Generate a Business Case document from a business problem or initiative request. Use for any budget justification, project approval, or ROI analysis needs. Essential when requesting resources, teams, or timeline extensions. Trigger for strategic initiatives, cost-benefit analysis, or investment decisions. Use when receiving a new project request from Business, CTO, or R&D; when justifying budget, team, or timeline to a sponsor; when Gate 0 (Intake) requires a BC before proceeding. Triggers on phrases like "create business case", "justify this project", "new initiative", "we need approval for", "Gate 0 preparation", "budget request", "resource allocation", "investment proposal". Output is a structured BC in Spanish for executive audience (Sponsor, CTO, PME). ALWAYS use at project initiation to justify investment and secure stakeholder approval.
---

# Business Case Generator

Phase: 1 — Origination | Gate: 0 (Intake) | Language: Spanish (business document)

## Workflow

1. Gather input (business problem description, quantitative data if available)
2. If input is poor (vague idea only) → generate discovery questions, mark all sections `[PENDIENTE]`
3. Generate BC following the template below
4. Validate against the pre-delivery checklist
5. Present for Gate 0 approval

## Input Requirements

| Input                        | Required      | Notes                                     |
| ---------------------------- | ------------- | ----------------------------------------- |
| Business problem description | ✅            | Min 2-3 paragraphs with context           |
| Quantitative impact data     | Desirable     | Revenue, affected clients, SLA violations |
| Strategic alignment          | Desirable     | Which OKR or strategic pillar             |
| Regulatory context           | If applicable | Deadlines, fines, certifications          |

If input is insufficient: generate discovery questions FIRST. NEVER invent financial data, business metrics, or names. Use `[PENDIENTE: dato real — fuente sugerida: X]`.

## Output Location

Generated documents should be saved to: **`docs/projects/{projectName}/business-case.md`**

Example: `docs/projects/identity-sdk-v3/business-case.md`

## Output Template

ALWAYS use this exact structure:

```markdown
# Business Case: [PROJECT NAME]

| Campo              | Valor            |
| ------------------ | ---------------- |
| **ID**             | BC-[YYYY]-[NNN]  |
| **Fecha**          | [YYYY-MM-DD]     |
| **Versión**        | 1.0 — Borrador   |
| **Solicitante**    | [Nombre] — [Rol] |
| **Sponsor**        | [Nombre] — [Rol] |
| **Alineación OKR** | [OKR-XX]         |

## 1. Resumen Ejecutivo

> [2-3 paragraphs: problem, proposal, expected benefit. Executive must decide from this alone.]

## 2. Problema de Negocio

### 2.1 Descripción (business terms, not technical)

### 2.2 Impacto Cuantificado (Revenue, Clients, Operations, Regulatory, Reputation)

### 2.3 Coste de No Hacer Nada (project at 6 and 12 months)

## 3. Solución Propuesta

### 3.1 Descripción (the "what", not the technical "how")

### 3.2 Alcance (includes / excludes)

### 3.3 Beneficios Esperados (quantitative + qualitative table)

## 4. Análisis de Alternativas

> Minimum 3: (A) Do nothing, (B) Proposed solution, (C) Alternative
> Evaluation table: Cost, Timeline, Risk, Strategic alignment, Complexity → Recommendation

## 5. Análisis Financiero

### 5.1 Costes (one-time + recurring, include 15-20% contingency)

### 5.2 Beneficios Financieros (Year 1-3)

### 5.3 ROI, Payback, NPV

## 6. Riesgos (min 5, categories: Technical, Resources, Timeline, Business, Regulatory, Security)

> Each with: probability, impact, severity, mitigation, owner

## 7. Timeline de Alto Nivel (phases with durations and dependencies)

## 8. Supuestos y Dependencias

## 9. Recursos Necesarios (roles, dedication, cost)

## 10. Criterios de Éxito (SMART)

## 11. Aprobación — Gate 0 (Sponsor, CTO, PME signatures)

## Historial de Versiones
```

## Validation Checklist

Before delivering, verify:

- [ ] Executive summary is self-sufficient for decision-making
- [ ] Problem described in BUSINESS impact terms
- [ ] ≥3 alternatives evaluated with consistent criteria
- [ ] Costs include 15-20% contingency
- [ ] Each risk has owner and concrete mitigation
- [ ] Success criteria are SMART
- [ ] All invented data marked as `[PENDIENTE]`
- [ ] Approval section has correct roles for Gate 0

## Key Rules

- Write for executives, not engineers. No technical jargon in body.
- Quantify whenever possible: "~40 hours/sprint saved" > "significant time savings"
- Every estimate is based on assumptions — declare them explicitly.
- Alternatives analysis must be honest: evaluate objectively, don't bias toward the "obvious" option.
- Risks must be specific to the domain, technology, and team — not generic.

## Example Sections

### Example Executive Summary

```markdown
## 1. Resumen Ejecutivo

La empresa necesita modernizar su plataforma API para soportar el crecimiento proyectado del 150% en el número de integraciones que los clientes enterprise demandan. El sistema actual no puede escalar más allá de 50 integraciones concurrentes, limitando nuestro crecimiento en el segmento enterprise y poniendo en riesgo €1.8M en pipeline comercial.

La solución propuesta implementará una nueva arquitectura API basada en microservicios con capacidad para 500+ integraciones concurrentes, con una inversión de €185K y ROI del 240% en 12 meses. El proyecto durará 5 meses y requiere 2 desarrolladores senior + 1 arquitecto de sistemas.

Este proyecto es crítico para capturar el 60% del mercado enterprise disponible y mantener nuestro liderazgo tecnológico frente a la competencia.
```

### Example Problem Description

```markdown
## 2. Problema de Negocio

### 2.1 Descripción

Nuestros clientes enterprise requieren integraciones complejas que nuestro sistema API actual no puede soportar eficientemente. Los límites arquitectónicos actuales (50 conexiones concurrentes, latencia >2s) están causando pérdidas de contratos y degradación de la experiencia del cliente en el segmento más rentable.

### 2.2 Impacto Cuantificado

- **Revenue**: Pérdida proyectada de €1.8M anuales (pipeline enterprise bloqueado)
- **Clientes**: 12 clientes enterprise en evaluación que requieren >50 integraciones
- **Operaciones**: 35% de llamadas API fallan durante picos de carga
- **Competitividad**: Competidores ofrecen capacidades 10x superiores
- **Reputación**: NPS enterprise cayó 15 puntos por problemas de integración

### 2.3 Coste de No Hacer Nada

- **6 meses**: €900K perdidos + 6 clientes enterprise no firmados + degradación técnica
- **12 meses**: €1.8M perdidos + pérdida posición mercado + debt técnica acumulada
```

### Example Financial Analysis

```markdown
## 5. Análisis Financiero

### 5.1 Costes

| Concepto                      | One-time (€) | Anual (€)  | Notas                    |
| ----------------------------- | ------------ | ---------- | ------------------------ |
| Desarrollo (2 devs × 5 meses) | 100,000      | -          | €50K/dev/mes             |
| Arquitecto sistemas           | 30,000       | -          | 5 meses consultoría      |
| Infrastructure upgrade        | 25,000       | 12,000     | Cloud + CDN + monitoring |
| Migración y testing           | 15,000       | -          | Data migration + QA      |
| Contingency (15%)             | 25,500       | 1,800      |                          |
| **TOTAL**                     | **195,500**  | **13,800** |                          |

### 5.2 Beneficios Financieros

| Año  | Nuevos contratos (€) | Revenue retenido (€) | Costes evitados (€) | Total (€) |
| ---- | -------------------- | -------------------- | ------------------- | --------- |
| 2025 | 800,000              | 600,000              | 100,000             | 1,500,000 |
| 2026 | 1,200,000            | 900,000              | 150,000             | 2,250,000 |
| 2027 | 1,500,000            | 900,000              | 200,000             | 2,600,000 |

### 5.3 ROI

- **Payback period**: 4.1 meses
- **ROI 12 meses**: 240%
- **NPV (3 años, 10% discount)**: €1.6M
```

## Iteration Process

### When Business Case is Rejected at Gate 0

**Common Rejection Reasons:**

1. **Insufficient quantification** - "Show me the numbers"
2. **Weak alternatives analysis** - "Have you considered other options?"
3. **Unrealistic timeline/budget** - "This seems too optimistic"
4. **Poor risk assessment** - "What could go wrong?"
5. **Unclear success criteria** - "How do we know it worked?"
6. **Missing stakeholder buy-in** - "Who else supports this?"

### Re-submission Process:

1. **Address feedback specifically** - Don't rewrite everything, focus on gaps identified
2. **Gather additional data** - Interview customers, benchmark competitors, get vendor quotes
3. **Involve stakeholders** - Get explicit support letters from affected departments
4. **Create fallback scenarios** - Show minimum viable version if budget is cut
5. **Add pilot/proof-of-concept option** - Reduce risk with phased approach

### Template for Addressing Feedback:

```markdown
## Respuesta a Feedback de Gate 0

| Comentario del Sponsor            | Acción Tomada                            | Evidencia/Mejora                                |
| --------------------------------- | ---------------------------------------- | ----------------------------------------------- |
| "Los números parecen optimistas"  | Revisión con CFO + benchmark competencia | Sección 5.2 actualizada con datos conservadores |
| "¿Qué pasa si el proyecto falla?" | Análisis detallado de riesgos            | Sección 6: 8 riesgos específicos + mitigaciones |
| "Timeline muy agresivo"           | Re-estimación con equipo técnico         | Sección 7: Timeline extendido 6→8 meses         |

**Cambios en esta versión**: [Lista específica de qué se modificó]
```

## Tips for Success

### Before Writing

- **Get sponsor alignment first** - Understand their priorities and concerns
- **Interview affected users** - Get real pain points, not assumed ones
- **Gather competitive intelligence** - What are others doing?
- **Validate with Finance** - Are your cost categories and calculations realistic?

### Writing Excellence

- **Lead with impact, not features** - "Save €500K" not "Implement new algorithm"
- **Use analogies for technical concepts** - "Like upgrading from dial-up to fiber"
- **Show alternatives honestly** - Don't stack the deck, evaluate fairly
- **Be specific with risks** - "Developer shortage in Q2" not "resource constraints"
- **Include quick wins** - Show value delivery in first 30-60 days

### Executive Presentation

- **Start with the money** - Revenue impact, cost avoidance, competitive advantage
- **Use visual aids** - Charts for financials, timeline with milestones
- **Prepare for tough questions** - "What if budget is cut 30%?" "What if timeline doubles?"
- **Have a champion in the room** - Someone who benefits directly from the solution
- **End with clear ask** - "I need €165K and approval to start January 15th"

### Common Pitfalls to Avoid

- **Technology focus** - Executives care about business outcomes, not technical details
- **Sandbagging** - Unrealistically conservative estimates lose credibility
- **Feature creep** - Keep scope focused on core problem
- **Missing the political dimension** - Understand who wins/loses from this change
- **No follow-up plan** - How will you report progress and results?

## Resources

- **Standard templates**: Use the template structure above - it's proven effective across 50+ approved business cases
- **Financial validation**: Work with Finance team to validate cost categories and ROI calculations
- **Risk assessment**: Consult with domain experts (Security, Legal, Operations) for realistic risk scenarios
- **Industry benchmarks**: Research Gartner, Forrester reports for market data and best practices
- **Regulatory compliance**: Engage Legal/Compliance early for projects touching regulated areas

## Next Steps After Generation

## Quality Assurance

### Validation Script

This skill includes automated validation via `scripts/validate-examples.ts`:

```bash
# Validate skill examples and structure
npx tsx scripts/validate-examples.ts
```

**Validation includes:**

- Example completeness and correctness
- Business case and project justification compliance patterns
- Progressive disclosure adherence
- Resource organization standards

**When to use:**

- Before skill release/packaging
- In CI/CD pipeline (quality gates)
- After major example updates
- During skill maintenance cycles

**Integration with ecosystem:**

- Used by `/multi-agent-audit` for ecosystem validation
- Supports quality gates in SDLC workflow
- Provides consistent validation across all skills

Gate 0 approved → skill `kickoff/` (kick-off meeting) + skill `tracking-integration/` (create project tracking)
