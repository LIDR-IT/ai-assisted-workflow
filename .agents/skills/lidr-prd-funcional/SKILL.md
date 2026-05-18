---
name: lidr-prd-funcional
id: prd-funcional
version: "1.0.1"
last_updated: "2026-03-16"
updated_by: "System: Normalization"
status: active
phase: 2
owner_role: "TL"
automation: false
domain_agnostic: true
description: "Essential for functional product specification in software projects — ALWAYS use during Discovery phase. CRITICAL for documenting user journeys, personas, and business requirements for any platform or application type. Use when defining user flows, feature requirements, API specifications, or workflow documentation. Essential for compliance workflows, user experience requirements, and business rule definition across any industry. Mandatory before Gate 1 approval for functional specifications."
---

# Functional PRD Generator

Phase: 2 — Discovery | Gate: 1 (with PRD-T + cross-review) | Language: Spanish

## Workflow

1. **Read approved Business Case** (problem, solution, success criteria)
2. **Read functional discovery notes** (stakeholder interviews, user research)
   - Customer pain points with current {{DOMAIN_SYSTEMS}}
   - Regulatory compliance requirements ({{CLIENT_REGULATIONS}})
   - User experience expectations and accessibility needs
3. **Analyze current user journeys** (AS-IS) from existing systems
   - User conversion rates and drop-off points across key workflows
   - System failure rates and user support tickets
   - Platform-specific experience differences
4. **Read Stakeholder Map** for audience understanding ({{STAKEHOLDER_TYPES}})
5. **Generate PRD-F** with domain-specific user journeys and personas
6. **Define primary user flows** with {{PRIMARY_WORKFLOW_STEPS}}
7. **Document {{COMPLIANCE_FRAMEWORK}} requirements** ({{REGULATORY_REQUIREMENTS}})
8. **Ready for cross-review** with PRD-T (skill `review-cruzado/`)

## Input

| Input                      | Required      | Source                                |
| -------------------------- | ------------- | ------------------------------------- |
| Approved Business Case     | ✅            | skill `business-case/`                |
| Functional discovery notes | ✅            | Stakeholder interviews, user research |
| Stakeholder Map            | Desirable     | skill `stakeholder-map/`              |
| Competitive analysis       | Desirable     | Product / Marketing                   |
| Current usage data         | If applicable | Analytics / dashboards                |

## Output Location

Generated documents should be saved to: **`docs/projects/{projectName}/prd-funcional.md`**

Example: `docs/projects/identity-sdk-v3/prd-funcional.md`

## Output Template

```markdown
---
id: {project-name}-prd-funcional
version: "1.0.0"
last_updated: "YYYY-MM-DD"            # date of generation
updated_by: "PO: {Name}"              # Product Owner generates functional PRDs
status: active
type: project
review_cycle: 60                      # days between reviews (project documentation)
next_review: "YYYY-MM-DD"             # calculated: last_updated + review_cycle
owner_role: "PO"                      # Product Owner maintains functional PRDs
---

# PRD Funcional: [PROJECT NAME]

| Campo       | Valor                                             |
| ----------- | ------------------------------------------------- |
| **ID**      | PRD-F-[YYYY]-[NNN]                                |
| **Versión** | 1.0 — Borrador                                    |
| **Fecha**   | [YYYY-MM-DD]                                      |
| **Autor**   | [PO + IA]                                         |
| **Estado**  | Borrador / En Review / Cross-Review OK / Aprobado |

## 1. Visión del Producto (1-paragraph: what, for whom, why)

## 2. Usuarios y Personas

### Persona 1: {{PRIMARY_USER_TYPE}} ({{PRIMARY_CONTEXT}})

- **Demografía**: {{USER_DEMOGRAPHICS}}
- **Objetivos**: {{PRIMARY_USER_GOALS}}
- **Pain points**: {{PRIMARY_USER_PAIN_POINTS}}
- **Nivel técnico**: Medio — {{USER_TECH_LEVEL_DESCRIPTION}}
- **Frecuencia**: {{USER_FREQUENCY_PATTERN}}

### Persona 2: {{SECONDARY_USER_TYPE}} ({{SECONDARY_CONTEXT}})

- **Demografía**: {{SECONDARY_USER_DEMOGRAPHICS}}
- **Objetivos**: {{SECONDARY_USER_GOALS}}
- **Pain points**: {{SECONDARY_USER_PAIN_POINTS}}
- **Nivel técnico**: Alto — {{SECONDARY_USER_EXPERTISE}}
- **Frecuencia**: {{SECONDARY_USER_FREQUENCY}}

### Persona 3: {{TERTIARY_USER_TYPE}} ({{TERTIARY_CONTEXT}})

- **Demografía**: {{TERTIARY_USER_DEMOGRAPHICS}}
- **Objetivos**: {{TERTIARY_USER_GOALS}}
- **Pain points**: {{TERTIARY_USER_PAIN_POINTS}}
- **Nivel técnico**: {{TERTIARY_USER_TECH_LEVEL}}
- **Frecuencia**: {{TERTIARY_USER_FREQUENCY}}

## 3. Problema y Contexto (business language, not technical)

## 4. Funcionalidades

### F1: {{CORE_FUNCTIONALITY_1}} (Must)

**Descripción**: {{CORE_FEATURE_1_DESCRIPTION}}
**Reglas de Negocio**:

- RN-F1-01: {{BUSINESS_RULE_1_1}}
- RN-F1-02: {{BUSINESS_RULE_1_2}}
- RN-F1-03: {{BUSINESS_RULE_1_3}}

### F2: {{CORE_FUNCTIONALITY_2}} (Must)

**Descripción**: {{CORE_FEATURE_2_DESCRIPTION}}
**Reglas de Negocio**:

- RN-F2-01: {{BUSINESS_RULE_2_1}}
- RN-F2-02: {{BUSINESS_RULE_2_2}}
- RN-F2-03: {{BUSINESS_RULE_2_3}}

### F3: {{CORE_FUNCTIONALITY_3}} (Must)

**Descripción**: {{CORE_FEATURE_3_DESCRIPTION}}
**Reglas de Negocio**:

- RN-F3-01: {{BUSINESS_RULE_3_1}}
- RN-F3-02: {{BUSINESS_RULE_3_2}}
- RN-F3-03: {{BUSINESS_RULE_3_3}}

### F4: {{SECONDARY_FUNCTIONALITY_1}} (Should)

**Descripción**: {{SECONDARY_FEATURE_1_DESCRIPTION}}
**Reglas de Negocio**:

- RN-F4-01: {{BUSINESS_RULE_4_1}}
- RN-F4-02: {{BUSINESS_RULE_4_2}}
- RN-F4-03: {{BUSINESS_RULE_4_3}}

### F5: {{SECONDARY_FUNCTIONALITY_2}} (Could)

**Descripción**: {{SECONDARY_FEATURE_2_DESCRIPTION}}
**Reglas de Negocio**:

- RN-F5-01: {{BUSINESS_RULE_5_1}}
- RN-F5-02: {{BUSINESS_RULE_5_2}}
- RN-F5-03: {{BUSINESS_RULE_5_3}}

## 5. User Journeys

### Journey 1: {{PRIMARY_USER_JOURNEY}} (Persona: {{PRIMARY_USER_TYPE}})

**Happy Path**:

1. **Inicio**: {{JOURNEY_STEP_1}}
2. **Autenticación**: {{JOURNEY_STEP_2}}
3. **Procesamiento principal**: {{JOURNEY_STEP_3}}
4. **Validación**: {{JOURNEY_STEP_4}}
5. **Confirmación**: {{JOURNEY_STEP_5}}
6. **Finalización exitosa**: {{JOURNEY_STEP_6}}
7. **Completado**: {{JOURNEY_SUCCESS_OUTCOME}}

**Error Path - {{PRIMARY_ERROR_SCENARIO}}**:
3.1. {{ERROR_DETECTION_STEP}}
3.2. {{ERROR_MESSAGE_USER}}
3.3. {{ERROR_RETRY_MECHANISM}}
3.4. {{ERROR_ESCALATION_STEP}}

**Error Path - {{SECONDARY_ERROR_SCENARIO}}**:
2.1. {{VALIDATION_FAILURE_STEP}}
2.2. {{VALIDATION_ERROR_MESSAGE}}
2.3. {{VALIDATION_ALTERNATIVE_PATH}}

### Journey 2: {{SECONDARY_USER_JOURNEY}} (Persona: {{SECONDARY_USER_TYPE}})

**Happy Path**:

1. **Acceso**: {{SECONDARY_JOURNEY_STEP_1}}
2. **Selección**: {{SECONDARY_JOURNEY_STEP_2}}
3. **Procesamiento**: {{SECONDARY_JOURNEY_STEP_3}}
4. **Resultado**: {{SECONDARY_JOURNEY_STEP_4}}

**Alternative Path - {{SECONDARY_ERROR_SCENARIO}}**:
3.1. {{SECONDARY_ERROR_DETECTION}}
3.2. {{SECONDARY_ERROR_OPTIONS}}
3.3. {{SECONDARY_ERROR_RESOLUTION}}

## 6. Fuera de Alcance (explicit: what NOT building and why)

## 7. Métricas de Éxito

### Conversión y UX

- **{{PRIMARY_CONVERSION_METRIC}}**: {{BASELINE_CONVERSION}}% → {{TARGET_CONVERSION}}% (objetivo: {{CONVERSION_GOAL}})
- **{{PRIMARY_PERFORMANCE_METRIC}}**: {{BASELINE_TIME}} → {{TARGET_TIME}} ({{PROCESS_DESCRIPTION}})
- **{{SUCCESS_RATE_METRIC}}**: {{BASELINE_SUCCESS}}% → {{TARGET_SUCCESS}}% ({{SUCCESS_CRITERIA}})
- **{{USER_SATISFACTION_METRIC}}**: {{BASELINE_SATISFACTION}} → {{TARGET_SATISFACTION}} ({{SATISFACTION_METHOD}})

### Precisión del Sistema

- **{{ACCURACY_METRIC_1}}**: {{ACCURACY_TARGET_1}} ({{ACCURACY_DESCRIPTION_1}})
- **{{ACCURACY_METRIC_2}}**: {{ACCURACY_TARGET_2}} ({{ACCURACY_DESCRIPTION_2}})
- **{{QUALITY_METRIC_1}}**: {{QUALITY_TARGET_1}} ({{QUALITY_DESCRIPTION_1}})
- **{{QUALITY_METRIC_2}}**: {{QUALITY_TARGET_2}} ({{QUALITY_DESCRIPTION_2}})

### Operacional y Compliance

- **{{OPERATIONAL_METRIC_1}}**: {{OPERATIONAL_TARGET_1}} ({{OPERATIONAL_DESCRIPTION_1}})
- **{{OPERATIONAL_METRIC_2}}**: {{OPERATIONAL_TARGET_2}} ({{OPERATIONAL_DESCRIPTION_2}})
- **{{COMPLIANCE_METRIC}}**: {{COMPLIANCE_TARGET}} ({{COMPLIANCE_DESCRIPTION}})
- **{{SUPPORT_METRIC}}**: {{SUPPORT_TARGET}} ({{SUPPORT_DESCRIPTION}})

## 8. Restricciones de Negocio (timeline, budget, regulatory)

## 9. Glosario del Proyecto (shared terminology)

## 10. Historial de Versiones
```

## Key Rules

- **WHAT, not HOW**: "User can {{PRIMARY_ACTION}}" NOT "System uses {{TECHNICAL_IMPLEMENTATION}}"
- **User language**: Write from the user's perspective, not the engineer's.
- **Journeys include error paths**: Happy path alone is incomplete. Each journey needs: main path + alternative paths + error handling + edge cases.
- **Business rules are explicit**: Each functionality has numbered business rules (RN-FX-NN) that define behavior.
- **Must/Should/Could priorities**: Not everything is Must. PO prioritizes honestly.
- **Metrics are measurable**: "{{QUALITATIVE_GOAL}}" → "{{QUANTITATIVE_METRIC_WITH_TARGET}}"
- **Cross-reference with PRD-T**: Every functionality in §4 must be technically feasible per PRD-T §3.

## {{INDUSTRY_DOMAIN}} Project Example

### PRD-F Example: {{CLIENT_NAME}} - {{MAIN_PRODUCT_FEATURE}}

```markdown
# PRD Funcional: {{PROJECT_NAME}} - {{CORE_SOLUTION}}

## 1. Visión del Producto

{{PRODUCT_VISION_STATEMENT}}

## 4. Funcionalidades Clave

**F1: {{CORE_FUNCTIONALITY_1}}** (Must)

- {{FEATURE_1_DETAIL_1}}
- {{FEATURE_1_DETAIL_2}}
- {{FEATURE_1_DETAIL_3}}

**F2: {{CORE_FUNCTIONALITY_2}}** (Must)

- {{FEATURE_2_DETAIL_1}}
- {{FEATURE_2_DETAIL_2}}
- {{FEATURE_2_DETAIL_3}}

## 5. Journey de {{PRIMARY_PROCESS}} Específico

1. {{JOURNEY_STEP_1}}
2. {{JOURNEY_STEP_2}}
3. {{JOURNEY_STEP_3}}
4. {{JOURNEY_STEP_4}}
5. {{JOURNEY_STEP_5}}
6. {{JOURNEY_STEP_6}}
```

## Quality Assurance

### Validation Script

This skill includes automated validation via `scripts/validate-examples.ts`:

```bash
# Validate skill examples and structure
npx tsx scripts/validate-examples.ts
```

**Validation includes:**

- Example completeness and correctness
- Product documentation compliance patterns
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

## Resources

- **Domain user personas**: `references/domain-personas.md`
- **Compliance journey mapping**: `references/{{COMPLIANCE_FRAMEWORK}}-user-journeys.md`
- **Domain UX patterns**: `references/domain-ux-guidelines.md`
- **Industry-specific requirements**: `references/{{INDUSTRY_DOMAIN}}-compliance.md`
