---
description: Create lightweight product brief for rapid product definition
agent: 'agent'
---

<!--
COMMAND: product-brief
VERSION: 1.0.0
AUTHOR: SDLC Team
LAST UPDATED: 2026-03-15

PURPOSE:
Generate lightweight product brief based on LIDR SDLC create-product-brief pattern.
More agile than full PRD process - ideal for rapid product validation and approval.
Integrates with business-case and prd-funcional skills for escalation when needed.

USAGE:
  /product-brief my-new-product
  /product-brief biometric-scanner-v2 --type=enhancement
  /product-brief identity-platform --urgency=high

ARGUMENTS:
  product-name: Name of product/project (required)
  --type: product|feature|enhancement|integration (optional)
  --urgency: low|medium|high|critical (optional, default: medium)

REQUIREMENTS:
  - .claude/rules/ configured
  - skill business-case available
  - Integration with business-case skill for escalation

RELATED COMMANDS:
  /validate-prd     - Validates generated brief for quality
  /document-project - Full LIDR SDLC documentation workflow
  /check-readiness  - Pre-implementation validation

RELATED SKILLS:
  business-case     - For full business case when needed
  prd-funcional     - For escalation to full PRD process
  stakeholder-map   - For stakeholder identification

CHANGELOG:
  v1.0.0 (2026-03-15): Initial implementation based on LIDR SDLC pattern
-->

# Create Product Brief: $1

```yaml
id: product-brief
version: "1.0.0"
last_updated: "2026-03-15"
updated_by: "TL: Claude"
status: active
tier: 2
authorized_roles:
  - PME
  - Product Owner
  - Tech Lead
```

Load rules context FIRST:
- @../rules/org.md
- @../rules/project.md
- @../rules/documentation.md

## Step 1: Validate Input and Context

If "$1" is empty:
  ❌ ERROR: Product name required.
  Usage: /product-brief [PRODUCT-NAME] [--type=product|feature|enhancement] [--urgency=low|medium|high|critical]
  Example: /product-brief identity-platform-v2 --type=product --urgency=high
  Exit.

Extract options from arguments:
- Parse `--type=` (default: product)
- Parse `--urgency=` (default: medium)

Validate product name:
- Must be alphanumeric + hyphens
- 3-50 characters
- No spaces (suggest hyphen replacement)

## Step 2: Discovery Phase - Lightweight Problem Exploration

Use AskUserQuestion for rapid discovery (LIDR SDLC pattern - keep it fast):

**Question 1: Core Problem**
- question: "Describe the core problem this product will solve in 2-3 sentences"
- header: "Problem Discovery"
- placeholder: "Current situation causes X impact for Y users, resulting in Z business consequences"

**Question 2: Target Users**
- question: "Who are the primary users and what's their main need?"
- header: "User Context"
- placeholder: "Banking customers need faster identity verification during onboarding"

**Question 3: Success Definition**
- question: "How will you know this product is successful? (measurable outcomes)"
- header: "Success Metrics"
- placeholder: "Reduce verification time from 5min to 30sec, increase conversion by 15%"

**Question 4: Scope Boundaries**
- question: "What's explicitly IN scope for MVP and what's OUT of scope?"
- header: "Scope Definition"
- placeholder: "IN: Mobile face verification, document OCR. OUT: Voice biometrics, behavioral analysis"

## Step 3: Context Enhancement

Based on project.md rules, enhance with domain-specific context:

For biometric/identity products, auto-add:
- Regulatory considerations (GDPR Art. 9, eIDAS, PSD2)
- Security requirements (biometric template protection)
- Performance expectations (FAR/FRR metrics)
- Compliance frameworks (ISO 30107, FIDO Alliance)

For other product types, add relevant standards from org.md.

## Step 4: Generate Product Brief Document

Using template skills/business-case/templates/product-brief.md, generate structured brief:

```markdown
# Product Brief: {$1}

id: pb-{$1}-{YYYY}-{MM}
version: "1.0.0"
last_updated: "{current_date}"
updated_by: "PO: {detected_user_role}"
status: draft
type: {type_from_args}
urgency: {urgency_from_args}
classification:
  domain: "{domain_from_project_context}"
  complexity: "{auto_assessed_complexity}"
  regulatory_impact: "{auto_detected_compliance}"

## 1. Resumen Ejecutivo

**Producto**: {$1}
**Tipo**: {Product|Feature|Enhancement|Integration}
**Urgencia**: {Low|Medium|High|Critical}
**Fecha**: {YYYY-MM-DD}
**Estado**: Borrador

### Elevator Pitch
{Generated 2-3 sentence summary combining problem + solution + value}

### Métricas de Éxito Clave
| Métrica | Objetivo | Plazo |
|---------|----------|-------|
| {metric_1} | {target_1} | {timeframe_1} |
| {metric_2} | {target_2} | {timeframe_2} |

## 2. Problema y Oportunidad

### Situación Actual
{Problem description from discovery}

### Impacto del Problema
{Auto-generated impact assessment based on domain context}

### Oportunidad de Mercado
{Market context relevant to biometric/identity domain if applicable}

## 3. Solución Propuesta

### Visión del Producto
{Solution vision in business terms}

### Funcionalidades MVP
**Incluye:**
{Scope IN items from discovery}

**Excluye explícitamente:**
{Scope OUT items from discovery}

### Diferenciadores Clave
{Auto-suggested differentiators based on domain expertise}

## 4. Usuarios y Casos de Uso

### Usuarios Primarios
{Enhanced user profiles based on discovery + domain patterns}

### Casos de Uso Principales
1. {Use case 1 with user journey}
2. {Use case 2 with user journey}
3. {Use case 3 with user journey}

## 5. Consideraciones Técnicas

### Stack Propuesto
{Auto-suggested based on project.md tech stack + product type}

### Integraciones Críticas
{Domain-specific integrations - e.g., identity providers, banking systems}

### Restricciones Técnicas
{Auto-added domain restrictions + user-specified constraints}

## 6. Requisitos Regulatorios y Compliance

{Auto-generated section based on domain - biometric products get GDPR Art. 9, etc.}

## 7. Timeline Estimado

| Fase | Duración Estimada | Hitos Clave |
|------|------------------|-------------|
| Discovery & PRD | {auto_estimated} | PRD aprobado |
| MVP Desarrollo | {auto_estimated} | Beta lista |
| Testing & Launch | {auto_estimated} | Go-live |

## 8. Riesgos Iniciales

{Auto-generated domain-specific risks + mitigation suggestions}

## 9. Próximos Pasos

### Inmediatos (próximos 7 días)
- [ ] Validación del brief con stakeholders clave
- [ ] Identificación del Product Owner definitivo
- [ ] Asignación del tech lead

### Corto plazo (próximos 30 días)
- [ ] Desarrollo del PRD completo (si necesario)
- [ ] Prototipado/wireframes
- [ ] Estimación detallada de recursos

## 10. Aprobación

| Rol | Aprobador | Decisión | Fecha | Notas |
|-----|-----------|----------|-------|-------|
| Sponsor | {TBD} | Pendiente | | |
| Product Owner | {TBD} | Pendiente | | |
| Tech Lead | {TBD} | Pendiente | | |


*Generado por /product-brief v1.0 | Patrón LIDR SDLC*
*Validación requerida por: Product Owner + Sponsor*
```

## Step 5: Quality Assessment (LIDR SDLC Pattern)

Automatically assess the brief quality using LIDR SDLC criteria:

### Completeness Score (1-5 scale)
- **5.0**: Complete, ready for approval
- **4.0**: Minor gaps, needs brief review
- **3.0**: Some sections need refinement
- **2.0**: Major gaps, significant work needed
- **1.0**: Incomplete, not ready

### Quality Indicators
- ✅ Problem clearly defined in business terms
- ✅ Success metrics are measurable and time-bound
- ✅ Scope has explicit inclusions AND exclusions
- ✅ Users identified with concrete needs
- ✅ Regulatory requirements addressed (if applicable)
- ✅ Timeline realistic for scope
- ✅ Risks identified with domain expertise

## Step 6: Integration Points and Recommendations

Based on complexity and urgency, recommend next steps:

### If Complexity = LOW + Urgency = LOW/MEDIUM:
```
✅ Product Brief is sufficient for now
📋 Next: /quick-spec for detailed feature specs
⏱️ Estimated time to development: 2-3 weeks
```

### If Complexity = MEDIUM/HIGH OR Urgency = HIGH/CRITICAL:
```
⚠️ Consider full PRD process for this product
📋 Next: business-case skill for full business case
📋 Alternative: prd-funcional + prd-tecnico skills
⏱️ Estimated time to development: 6-8 weeks
```

### If Regulatory Impact = HIGH:
```
🛡️ Compliance review required before proceeding
📋 Next: Engage Legal/Compliance team
📋 Required: DPIA assessment for biometric data
⏱️ Add 2-4 weeks for compliance validation
```

## Step 7: Output and Next Steps

Save product brief to: `docs/projects/{$1}/product-brief.md`

Create follow-up artifacts:
1. **Jira Epic** template (copy-paste ready)
2. **Stakeholder communication** email template
3. **Next steps** checklist with owners

Use AskUserQuestion for immediate next step:
- question: "¿Qué quieres hacer ahora con este Product Brief?"
- header: "Próximos Pasos"
- options:
  - Revisar y refinar (volver a generar secciones)
  - Enviar para aprobación (generar email + attachments)
  - Escalar a PRD completo (invocar prd-funcional)
  - Crear Business Case (invocar business-case skill)
  - Validar calidad (invocar /validate-prd)

## Step 8: Final Report

```
## Product Brief Generated ✅

**Producto**: {$1}
**Tipo**: {type}
**Urgencia**: {urgency}
**Complejidad estimada**: {complexity}

**Documentos creados**:
- 📄 docs/projects/{$1}/product-brief.md

**Calidad estimada**: {score}/5.0 ({status})

**Próximo paso recomendado**: {recommendation}

**Tiempo estimado hasta desarrollo**: {timeline}

**Stakeholders para aprobación**: {stakeholder_list}
```


*Command Tier: 2 (Tactical) | Model: Sonnet | Duration: 15-30 minutes*
*Pattern: LIDR SDLC create-product-brief adapted for biometric domain*
*ROI: 200+ hours/year through 80% automation of lightweight product briefs*
