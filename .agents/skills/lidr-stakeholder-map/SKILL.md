---
id: stakeholder-map
version: "1.1.0"
last_updated: "2026-03-16"
updated_by: "System: Quality Assurance Enhancement"
status: active
phase: 1
owner_role: "PME"
automation: false
domain_agnostic: true
description: "Generate a stakeholder map with power/interest matrix and communication plan for a project. Use at project start to identify ALL stakeholders, define engagement strategy, and prevent late-appearing stakeholders changing scope. Triggers on create stakeholder map, who are the stakeholders, communication plan, identify stakeholders, who do we need to involve. Informs Discovery sessions (who to interview) and ongoing project communication. Output in Spanish. ALWAYS use at project start to identify all stakeholders and define engagement strategies."
---

# Stakeholder Map Generator

Phase: 1 — Origination | Language: Spanish

## Workflow

1. Read Business Case (sponsor, beneficiaries, team)
2. Read Kick-off attendees (if available)
3. Identify ALL stakeholders by category (internal + external)
4. Classify using Power × Interest matrix
5. Define communication strategy per quadrant
6. Output map + communication plan

## Input

| Input                  | Required  | Source                                        |
| ---------------------- | --------- | --------------------------------------------- |
| Business Case          | ✅        | skill `business-case/`                        |
| Kick-off attendees     | Desirable | skill `kickoff/`                              |
| Organizational context | Desirable | PME (org chart, internal politics)            |
| Project type           | Desirable | BC (new product, migration, regulatory, etc.) |

## Output Template

```markdown
# Mapa de Stakeholders: [PROJECT NAME]

## 1. Stakeholders Identificados

| #   | Nombre | Rol/Cargo | Departamento | Tipo | Influencia | Interés |
| --- | ------ | --------- | ------------ | ---- | ---------- | ------- |

## 2. Matriz Poder × Interés
```

         ALTO INTERÉS
              │

MANTENER │ GESTIONAR
SATISFECHO │ ACTIVAMENTE
(informar) │ (colaborar)
│
─────────────┼───────────────
│
MONITOREAR │ MANTENER
(mínimo) │ INFORMADO
│
BAJO INTERÉS
ALTO PODER ←──→ BAJO PODER

```

## 3. Plan de Comunicación
| Stakeholder/Grupo | Cuadrante | Frecuencia | Canal | Contenido | Responsable |
|-------------------|-----------|------------|-------|-----------|-------------|

## 4. Riesgos de Stakeholders
| Riesgo | Stakeholder | Impacto | Mitigación |
|--------|-------------|---------|-----------|

## 5. Stakeholders Potenciales No Confirmados
[People who MIGHT need to be involved — flag for validation]
```

## Key Rules

- **Exhaustive identification**: Better to list too many than miss one who appears late.
- **Classify honestly**: Not everyone is "high power, high interest." Be realistic.
- **Communication plan is actionable**: Channel + frequency + content + owner for each group.
- **Update periodically**: Stakeholder dynamics change — review each phase transition.
- **External stakeholders**: Don't forget regulators, partners, vendors, end users.

## Quality Assurance

### Validation Script

This skill includes automated validation via `scripts/validate-examples.ts`:

```bash
# Validate skill examples and structure
npx tsx scripts/validate-examples.ts
```

**Validation includes:**

- Example completeness and correctness
- Stakeholder mapping and project governance compliance patterns
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
