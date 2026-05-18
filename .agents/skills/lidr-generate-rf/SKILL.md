---
id: generate-rf
version: "1.5.0"
last_updated: "2026-03-25"
updated_by: "TL: tier3-remediation"
status: active
phase: 3
owner_role: "PO"
automation: false
domain_agnostic: true
description: >
  Generate structured Functional Requirements (RFs) with BDD acceptance criteria (Given/When/Then) from PRD Funcional.
  Domain-agnostic — works for any software system, platform, or product type.
  Use for transforming business requirements into testable, traceable functional specifications.
  Essential at Gate 2: all RFs must exist before Sprint Planning begins.
  Always use when PRD Funcional is approved, always use when specifying acceptance criteria for features.
  Do NOT use for non-functional requirements (use generate-nfr), for user stories (use user-stories), or for epic decomposition (use epic-breakdown).
  Triggers on "generate requirements", "functional requirements", "RF", "BDD requirements", "acceptance criteria", "feature specification", "requirements from PRD".
  Output in Spanish (requirements document), English (BDD scenarios).
  Audience: PO (validates business alignment), QA (uses for test cases), Dev (implements against).
---

# Functional Requirements Generator

> **Essential for** Phase 3 (Especificación) — CRITICAL for Gate 2 success. Always use when decomposing PRDs into atomic, testable requirements. This skill is your PRIMARY tool for generating comprehensive RFs with BDD criteria for any software system or product.
>
> **Always use when**: PRDs approved (Gate 1 ✅), need atomic testable requirements, preparing Gate 2, decomposing user-facing or system functionalities into observable behaviors.
>
> **Critical for**: Requirements generation, BDD criteria creation, feature workflows, compliance with data regulation (sensitive data), user journey specification.

**Phase:** 3 — Specification | **Gate:** 2 | **Language:** Spanish + English (BDD) | **Domain:** any software system

## Workflow

1. Analyze PRDs: extract functionalities from PRD-F §4, journeys from §5, constraints from PRD-T §3, NFRs from §5
2. Decompose each functionality into atomic RFs (1 RF = 1 observable testable behavior)
3. Structure each RF per template below, using templates/rf-format.md
4. Generate BDD Gherkin scenarios per RF (min: happy + alternative + error)
5. Build global dependency map with clusters for Sprint Planning
6. Validate coherence with checklists/rf-coherence.md

## Input

| Input                    | Required      | Source                 |
| ------------------------ | ------------- | ---------------------- |
| PRD Funcional (approved) | ✅            | skill `prd-funcional/` |
| PRD Técnico (approved)   | ✅            | skill `prd-tecnico/`   |
| Existing RFs (if any)    | If applicable | Jira / Confluence      |
| Project glossary         | Desirable     | rules/project.md       |

## Output Location

Generated documents should be saved to: **`docs/projects/{projectName}/requirements.md`**

Contains complete functional requirements with BDD scenarios.

Example: `docs/projects/identity-sdk-v3/requirements.md`

## Decomposition Rules

- **1 RF = 1 observable behavior.** If description contains "and" / "also" / "besides" → split into 2+ RFs
  - ✅ "Validate user address during checkout"
  - ❌ "Validate user address and apply discount code during checkout" → Split into 2 RFs
- **1 RF = 1 actor + 1 action + 1 result.** Multiple actors with different actions = multiple RFs
- **Error flows are separate RFs**, not part of the happy path RF (validation failure, timeout, unauthorized access)
- **If RF has >6 Gherkin scenarios** → probably 2+ RFs, decompose further
- **If RF depends on >3 others** → too high-level, decompose
- **Compliance separate**: Data consent, retention, deletion are separate RFs from data processing

### Common RF Pattern Examples

**E-Commerce (User Checkout Flow)**:

- **Cart RFs**: Add item → Quantity update → Price recalculation → Inventory check
- **Payment RFs**: Card tokenization → Charge authorization → Receipt generation → Confirmation email
- **Order RFs**: Order creation → Fulfillment trigger → Status tracking → Delivery notification

**SaaS (Subscription Management)**:

- **Onboarding RFs**: Account creation → Plan selection → Payment setup → Trial activation
- **Billing RFs**: Invoice generation → Payment collection → Failed payment retry → Dunning notifications
- **Access RFs**: Feature flag evaluation → Tier enforcement → Upgrade prompt → Downgrade handling

**Healthcare (Patient Onboarding)**:

- **Registration RFs**: Identity verification → Insurance validation → Consent capture → Record creation
- **Appointment RFs**: Availability lookup → Slot booking → Reminder dispatch → Cancellation handling
- **Compliance RFs**: Audit logging → Data access control → Retention management → Data export

## Output Template — Document Header

The `requirements.md` document MUST start with proper frontmatter:

```markdown
---
id: {project-name}-requirements
version: "1.0.0"
last_updated: "YYYY-MM-DD"            # date of generation
updated_by: "PO: {Name}"              # Product Owner generates requirements
status: active
type: project
review_cycle: 60                      # days between reviews (project documentation)
next_review: "YYYY-MM-DD"             # calculated: last_updated + review_cycle
owner_role: "PO"                      # Product Owner maintains requirements
---

# Requisitos Funcionales: {PROJECT_NAME}

[Document introduction and overview]
```

## Output Template — Per RF

ALWAYS use this structure for each RF:

```markdown
# RF-{PROJ}-{NNN}: {Title — Infinitive verb + Object}

| Campo           | Valor                 |
| --------------- | --------------------- |
| **ID**          | RF-{PROJ}-{NNN}       |
| **Versión**     | 1.0                   |
| **Estado**      | Borrador              |
| **Prioridad**   | Must / Should / Could |
| **Complejidad** | Baja / Media / Alta   |

## Trazabilidad

| Referencia            | Valor         |
| --------------------- | ------------- |
| **PRD-F origen**      | PRD-F §4.X FX |
| **PRD-T soporte**     | PRD-T §3.X    |
| **Reglas de negocio** | RN-FX-NN      |

## Descripción

### Actor(es): Primary + Secondary

### Precondiciones (what must be true BEFORE)

### Descripción Funcional ("El sistema DEBE [behavior]")

### Reglas de Negocio (ID, Rule, Condition, Action, Exception)

### Postcondiciones (what is true AFTER)

## Datos de Entrada (Field, Type, Required, Validation, Example)

## Datos de Salida (Field, Type, Description, Example)

## Manejo de Errores (Code, Condition, User Message, System Action)

## Criterios de Aceptación (BDD — Gherkin)

### Scenario 1: Happy Path

### Scenario 2: Alternative Path

### Scenario 3: Error Case

### Scenario 4: Edge Case (if applicable)

### Scenario Outline (for parameterized data)

## NFRs Aplicables (Performance, Security, Accessibility targets)

## Dependencias (depends_on, blocks, related_to, external)

## Supuestos

## Notas de Implementación (hints for R&D, not mandatory)
```

## BDD Rules

| Rule                                 | Good                                                     | Bad                                         |
| ------------------------------------ | -------------------------------------------------------- | ------------------------------------------- |
| Given = pre-existing state           | `Given user "alice@corp.com" has an active subscription` | `Given the user subscribes`                 |
| When = ONE atomic action             | `When user submits checkout form with valid card`        | `When user pays and confirms order`         |
| Then = observable, verifiable result | `Then system returns order confirmation number`          | `Then order processing works`               |
| Scenarios are independent            | Each scenario can run standalone                         | Scenario 2 depends on Scenario 1 completing |
| Sensitive data compliance            | `Then stores payment token (not raw card number)`        | `Then stores card data`                     |
| Specific thresholds                  | `Then API responds in <500ms P95`                        | `Then system responds quickly`              |
| No PII in logs                       | `Then logs ORDER_PLACED with order_id`                   | `Then logs success with customer email`     |

### BDD Best Practices (Domain-Agnostic):

- **Always specify measurable thresholds**: response time <500ms, retry count ≤3, error rate <0.1%
- **Concrete data examples**: field lengths, allowed values, boundary conditions
- **Compliance patterns**: Never log sensitive data, always specify encryption requirements when storing PII
- **Error recovery paths**: What the user or system can do after each failure mode
- **Security logging**: Event names without PII in log payload: ORDER_PLACED, PAYMENT_FAILED, SESSION_EXPIRED

> **Domain-specific examples**: See `examples/client-domain-example.md` for identity verification RF patterns (authenticity detection, data template matching, document parsing).

## Output — Global Dependency Map

After all RFs, generate:

```markdown
# Dependency Map: [PROJECT]

## Diagram (ASCII tree showing RF chains)

## Dependency Table (RF, depends_on, blocks, cluster)

## Implementation Clusters (groups for Sprint Planning with size estimate)

## Critical Path (longest dependency chain = minimum timeline)
```

## Validation Checklist

Per RF:

- [ ] Single observable behavior (no "and"/"also" in the description)
- [ ] Full traceability to PRD-F and PRD-T
- [ ] Input data with type, validation, example (field formats, value ranges, constraints)
- [ ] ≥3 Gherkin scenarios (happy + error + edge case), executable not ambiguous
- [ ] **Measurable thresholds specified**: response times, limits, counts, percentages
- [ ] **Data sensitivity handled**: encryption specified for sensitive data, no PII in logs
- [ ] **Error recovery paths**: what user or system can do after each failure
- [ ] NFRs declared specifically for this RF (performance, security, accessibility targets)
- [ ] Dependencies correct and ordered (e.g., account creation before subscription activation)
- [ ] Assumptions explicit

Global:

- [ ] Sequential IDs, no gaps
- [ ] **Complete feature lifecycle**: creation → update → deletion where applicable
- [ ] **Compliance coverage**: consent, processing, retention, deletion RFs if data is collected
- [ ] No cycles in dependency map
- [ ] Critical path identified
- [ ] Every "Must" functionality from PRD-F has ≥1 RF
- [ ] No orphan RFs (without PRD-F traceability)
- [ ] docs/checklists/rf-coherence.md executed

## Quick Start for Domain RFs

### Step-by-Step (Generic):

1. **Load PRDs**: PRD-Funcional (user journeys) + PRD-Técnico (architecture, APIs, constraints)
2. **Identify feature flows**: main user journeys, system integrations, data handling
3. **Apply decomposition**: 1 RF per observable action (input ≠ validation ≠ processing ≠ storage)
4. **Add compliance RFs**: consent, data retention, deletion, audit logging (if applicable)
5. **Generate BDD**: concrete thresholds, specific error messages, recovery paths
6. **Validate coherence**: run docs/checklists/rf-coherence.md check

### Domain RF Clusters (Examples)

**E-Commerce checkout**:

- **Validation flow**: address validation → coupon application → stock reservation → payment processing
- **Confirmation flow**: order creation → inventory update → receipt email → tracking setup

**SaaS subscription management**:

- **Onboarding flow**: account creation → plan selection → payment setup → feature activation
- **Lifecycle flow**: usage metering → limit enforcement → upgrade prompt → invoice generation

**Healthcare patient onboarding**:

- **Registration flow**: identity capture → insurance check → consent recording → record initialization
- **Access flow**: provider authentication → patient lookup → record access → audit logging

> **Domain-specific examples**: For identity verification RF patterns (authenticity detection, automated matching, document parsing), see `examples/client-domain-example.md`.

## Domain RF Examples

### Example 1: E-Commerce — Add to Cart with Inventory Check

````markdown
# RF-SHOP-003: Agregar producto al carrito con validación de stock

| Campo           | Valor       |
| --------------- | ----------- |
| **ID**          | RF-SHOP-003 |
| **Versión**     | 1.0         |
| **Estado**      | Borrador    |
| **Prioridad**   | Must        |
| **Complejidad** | Media       |

## Descripción

**Actor(es)**: Shopper (primary), Inventory Service (secondary), Cart Service (secondary)
**Precondiciones**: Usuario autenticado, producto activo en catálogo
**Descripción Funcional**: El sistema DEBE permitir al usuario agregar un producto al carrito,
verificar disponibilidad en tiempo real y reservar el stock durante la sesión de compra.

## Criterios de Aceptación (BDD)

### CA-SHOP-003-01: Producto disponible

```gherkin
Scenario: Happy path — producto en stock
  Given el usuario "alice@example.com" tiene sesión activa
    And el producto "SKU-12345" tiene 8 unidades disponibles
  When el usuario hace clic en "Agregar al carrito" con cantidad 2
  Then el sistema reserva 2 unidades de "SKU-12345"
    And actualiza el carrito mostrando 2 ítems
    And muestra mensaje: "Producto agregado correctamente"
    And registra evento: "CART_ITEM_ADDED" con product_id y quantity

Scenario: Error — stock insuficiente
  Given el producto "SKU-12345" tiene 1 unidad disponible
  When el usuario intenta agregar cantidad 3
  Then el sistema rechaza la solicitud
    And muestra mensaje: "Solo 1 unidad disponible"
    And sugiere: "Puede agregar 1 unidad al carrito"
    And no modifica el inventario
```
````

### Example 2: SaaS — Plan Upgrade with Immediate Feature Access

````markdown
# RF-SAAS-007: Upgrade de plan con acceso inmediato a funcionalidades

## Criterios de Aceptación (BDD)

```gherkin
Scenario: Happy path — upgrade exitoso
  Given el usuario "bob@company.com" está en plan "Starter"
    And su tarjeta de crédito está vigente
  When el usuario selecciona plan "Professional" y confirma el pago
  Then el sistema cobra la diferencia prorrateada del ciclo actual
    And actualiza el plan en <5 segundos
    And activa las funcionalidades "Advanced Analytics" y "API Access"
    And envía email de confirmación con factura
    And registra evento: "PLAN_UPGRADED" con user_id y new_plan

Scenario: Error — pago rechazado durante upgrade
  Given el usuario selecciona plan "Professional"
  When el procesador de pagos retorna "CARD_DECLINED"
  Then el sistema mantiene el plan "Starter" activo sin cambios
    And muestra mensaje: "Pago no procesado. Verifique su tarjeta"
    And ofrece opción: "Actualizar método de pago"
    And no activa funcionalidades del plan superior
```
````

### Example 3: Healthcare — Patient Appointment Booking

````markdown
# RF-HEALTH-012: Reserva de turno médico con verificación de cobertura

## Criterios de Aceptación (BDD)

```gherkin
Scenario: Happy path — turno disponible con cobertura vigente
  Given el paciente "ID-P-98765" tiene cobertura médica vigente
    And el médico "Dr. Smith" tiene disponibilidad el "2026-04-10 10:00"
  When el paciente selecciona el turno y confirma la reserva
  Then el sistema registra el turno con estado "Confirmado"
    And envía recordatorio al paciente y al médico
    And actualiza la agenda del médico bloqueando el slot
    And registra evento: "APPOINTMENT_BOOKED" con patient_id y slot_id

Scenario: Error — cobertura vencida
  Given el paciente tiene cobertura vencida desde "2026-01-01"
  When el paciente intenta reservar un turno
  Then el sistema bloquea la reserva
    And muestra mensaje: "Su cobertura médica no está vigente"
    And ofrece opción: "Pagar como particular" o "Actualizar cobertura"
    And no crea el turno hasta resolver la cobertura
```
````

---

## Common Anti-Patterns in RFs (Avoid These)

| Anti-Pattern                     | Correct Approach                                                      | Why                                                |
| -------------------------------- | --------------------------------------------------------------------- | -------------------------------------------------- |
| "RF-001: Complete checkout flow" | Split into: cart validation, payment, confirmation, fulfillment       | Too broad — needs decomposition                    |
| "system responds fast"           | "API responds in <500ms P95 under 1000 concurrent users"              | Vague — needs concrete threshold                   |
| "stores user data securely"      | "stores payment token encrypted (AES-256-GCM), never raw card number" | Ambiguous — specify what is stored and how         |
| "logs user activity"             | "logs ORDER_PLACED with order_id (no PII in payload)"                 | Potential compliance issue — specify log content   |
| "handles errors gracefully"      | Separate RF for each error type with specific message and recovery    | One RF per behavior — errors deserve dedicated RFs |

---

## Quality Assurance

### Validation Script

This skill includes automated validation via `scripts/validate-examples.ts`:

```bash
# Validate skill examples and structure
npx tsx scripts/validate-examples.ts
```

**Validation includes:**

- Example completeness and correctness
- Functional requirements compliance patterns
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

## Changelog

| Versión | Fecha      | Autor                                 | Cambios                                                                                                                                                                   |
| ------- | ---------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1.5.0   | 2026-03-25 | TL: tier3-remediation                 | Domain-agnostic migration: replaced domain-specific patterns with e-commerce/SaaS/healthcare examples; moved domain-specific content to examples/client-domain-example.md |
| 1.4.0   | 2026-03-16 | System: Quality Assurance Integration | Quality assurance integration                                                                                                                                             |
| 1.2.0   | 2026-03-09 | System: Improvement                   | Added concrete BDD scenarios and domain-specific RF patterns                                                                                                              |
| 1.1.0   | 2026-02-15 | TL: García                            | Added decomposition rules and validation checklist                                                                                                                        |
| 1.0.0   | 2026-01-20 | TL: García                            | Versión inicial del skill                                                                                                                                                 |
