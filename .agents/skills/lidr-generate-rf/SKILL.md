---
name: lidr-generate-rf
id: generate-rf
version: "1.10.0"
last_updated: "2026-06-12"
updated_by: "TL: brownfield audit mode"
status: active
phase: 3
stage: specification
owner_role: "PO"
automation: false
domain_agnostic: true
language_default: en
integrations: [tracking, docs]
description: >
  Generate structured Functional Requirements (RFs) with BDD acceptance criteria (Given/When/Then) from the Functional PRD.
  Domain-agnostic — works for any software system, platform, or product type.
  Use for transforming business requirements into testable, traceable functional specifications.
  Essential at Gate 2: all RFs must exist before Sprint Planning begins.
  Always use when the Functional PRD is approved, always use when specifying acceptance criteria for features.
  Do NOT use for non-functional requirements (use generate-nfr), for user stories (use user-stories), or for epic decomposition (use bmad-create-epics-and-stories).
  Triggers on "generate requirements", "functional requirements", "RF", "BDD requirements", "acceptance criteria", "feature specification", "requirements from PRD", "feature living spec", "consolidate feature spec", "audit system spec", "recover spec from code", "brownfield spec".
  Output: English by default; artifact language follows the client `language` setting (see `_shared/lidr/integrations/`).
  Audience: PO (validates business alignment), QA (uses for test cases), Dev (implements against).
---

# Functional Requirements Generator

> **Essential for** Phase 3 (Specification) — CRITICAL for Gate 2 success. Always use when decomposing PRDs into atomic, testable requirements. This skill is your PRIMARY tool for generating comprehensive RFs with BDD criteria for any software system or product.
>
> **Always use when**: PRDs approved (Gate 1 ✅), need atomic testable requirements, preparing Gate 2, decomposing user-facing or system functionalities into observable behaviors.
>
> **Critical for**: Requirements generation, BDD criteria creation, feature workflows, compliance with data regulation (sensitive data), user journey specification.

**Phase:** 3 — Specification | **Gate:** 2 | **Language:** English by default (configurable via client `language` setting) | **Domain:** any software system

Tools resolve via the central registry `_shared/lidr/integrations/tool-registry.yaml`; the active client binds concrete tools in `clients/<CODE>.yaml`.

## Relationship to BMad

LIDR-unique: authors atomic, BDD-bearing Functional Requirements (Given/When/Then) at Gate 2 — the testable contract that BMad's epic flow assumes. Consumes the Functional PRD from `bmad-prd`; feeds `bmad-create-epics-and-stories` (decomposition) and `lidr-validate-requirements` (RTM + coherence).

## Workflow

1. Analyze PRDs: extract functionalities from PRD-F §4, journeys from §5, constraints from PRD-T §3, NFRs from §5
2. Decompose each functionality into atomic RFs (1 RF = 1 observable testable behavior)
3. Structure each RF per template below, using templates/rf-format.md
4. Generate BDD Gherkin scenarios per RF (min: happy + alternative + error)
5. Build global dependency map with clusters for Sprint Planning
6. Validate coherence with checklists/rf-coherence.md

## Input

| Input                     | Required      | Source                            |
| ------------------------- | ------------- | --------------------------------- |
| Functional PRD (approved) | ✅            | skill `bmad-prd/`                 |
| Technical PRD (approved)  | ✅            | skill `bmad-prd/`                 |
| Existing RFs (if any)     | If applicable | {{TRACKING_TOOL}} / {{DOCS_TOOL}} |
| Project glossary          | Desirable     | rules/project.md                  |

## Output Location

Generated requirements are saved as **one file per RF** under the per-client requirements directory — this is the exact path Gate 2 reads (`gate-evidence.yaml` G2 `lidr-generate-rf` glob `{client_root}/requirements/RF-*.md`):

**`docs/projects/{CLIENT_CODE}/requirements/RF-{PROJ}-{NNN}.md`** (one file per RF)

`{CLIENT_CODE}` is the active client (see `rules/lidr-sdlc/project.md`). The global dependency map is written alongside as **`docs/projects/{CLIENT_CODE}/requirements/dependency-map.md`**.

Examples:

- `docs/projects/docline/requirements/RF-SHOP-003.md`
- `docs/projects/docline/requirements/RF-SHOP-004.md`
- `docs/projects/docline/requirements/dependency-map.md`

> **Gate 2 contract**: the gate's required evidence is the presence of `requirements/RF-*.md` files with real BDD content. Do NOT collapse all RFs into a single `requirements.md` — emit per-RF files so the gate glob and downstream traceability (`lidr-validate-requirements` RTM) resolve correctly.

## Living Spec Mode (feature-level consolidation)

By default this skill emits per-RF files from a PRD-delta for Gate 2 (above). It also runs in **living-spec mode**: instead of (or alongside) per-RF files, it **consolidates** a feature's UJ + RF + NFR + AC into a single **living spec** that reflects the feature's CURRENT state — not just the delta.

- **Output**: `docs/features/<feature>/spec.md` (BMad `project_knowledge` = `docs/`; per-client variants resolve under `docs/projects/{CLIENT_CODE}/features/<feature>/spec.md`).
- **Same format as the PRD**: UJ (referenced from the PRD / `bmad-ux`) + RF (this skill) + NFR (from `lidr-generate-nfr`) + AC (BDD/Gherkin — the AC IS the test, ATDD).
- **Delta → reconcile (DTC)**: a PRD-delta describes the CHANGE; in living-spec mode the skill applies it to the existing `spec.md` (add / modify / deprecate RFs by stable ID), keeping the spec the current-state truth. The delta is then archived.
- **Stable IDs**: RF/AC keep their IDs across deltas so `lidr-validate-requirements` (RTM) traces RF/AC ↔ test ↔ delta over time.
- **When to use**: maintaining the current-state spec of a feature that evolves across iterations (brownfield / feature work), where per-PRD files alone don't give a consolidated, traceable view. For first-time Gate-2 specification, the per-RF mode above remains the default.

### Brownfield / system audit (reverse mode)

When there is **no PRD** (auditing an existing system to recover its spec), run living-spec mode **reverse** — the input is the code understanding from `bmad-document-project` (deep-dives + `docs/index.md`) instead of a forward PRD:

1. **Inventory** — `bmad-document-project` derives what each feature DOES (code-facing deep-dives + the feature index).
2. **Recover the spec** — this skill (+ `lidr-generate-nfr`) turns that documented behavior into each feature's `docs/features/<feature>/spec.md` (UJ/RF/NFR/AC, stable IDs). **Semi-assisted**: mark every inferred requirement `[REQUIERE VALIDACIÓN HUMANA]` — derived ≠ confirmed.
3. **Audit coverage** — the recovered `spec.md` feeds **`bmad-testarch-trace`** (UJ/AC ↔ test matrix + GATE: PASS / CONCERNS / FAIL / WAIVED). That gate is the audit verdict: _does every UJ have a test that meets its AC?_ Gaps → `bmad-testarch-test-design` (risk-based, P1). `bmad-testarch-trace`'s **synthetic oracle** can infer UJ/AC straight from code, so the coverage audit can start before the spec is fully recovered.

This is the "audit-system" chain — composed of existing skills, no new command. Full sequence in `rules/lidr-sdlc/workflows.md` → "Cadena típica: Auditoría de sistema (brownfield)".

> The deep-dive (`bmad-document-project`) documents the CODE; the living spec documents the REQUIREMENTS (UJ/RF/NFR/AC). Complementary, both live and accumulate per feature.

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

## Output Template — Per-RF File Frontmatter

Each `RF-{PROJ}-{NNN}.md` file MUST start with proper frontmatter:

```markdown
---
id: RF-{PROJ}-{NNN}
version: "1.0.0"
last_updated: "YYYY-MM-DD" # date of generation
updated_by: "PO: {Name}" # Product Owner generates requirements
status: active
type: project
review_cycle: 60 # days between reviews (project documentation)
next_review: "YYYY-MM-DD" # calculated: last_updated + review_cycle
owner_role: "PO" # Product Owner maintains requirements
---

# RF-{PROJ}-{NNN}: {Title}

[RF body — see "Output Template — Per RF" below]
```

The `dependency-map.md` companion uses the same frontmatter shape with `id: {project-name}-rf-dependency-map`.

## Output Template — Per RF

ALWAYS use this structure for each RF:

```markdown
# RF-{PROJ}-{NNN}: {Title — Infinitive verb + Object}

| Field          | Value                 |
| -------------- | --------------------- |
| **ID**         | RF-{PROJ}-{NNN}       |
| **Version**    | 1.0                   |
| **Status**     | Draft                 |
| **Priority**   | Must / Should / Could |
| **Complexity** | Low / Medium / High   |

## Traceability

| Reference          | Value         |
| ------------------ | ------------- |
| **PRD-F source**   | PRD-F §4.X FX |
| **PRD-T support**  | PRD-T §3.X    |
| **Business rules** | RN-FX-NN      |

## Description

### Actor(s): Primary + Secondary

### Preconditions (what must be true BEFORE)

### Functional Description ("The system MUST [behavior]")

### Business Rules (ID, Rule, Condition, Action, Exception)

### Postconditions (what is true AFTER)

## Input Data (Field, Type, Required, Validation, Example)

## Output Data (Field, Type, Description, Example)

## Error Handling (Code, Condition, User Message, System Action)

## Acceptance Criteria (BDD — Gherkin)

### Scenario 1: Happy Path

### Scenario 2: Alternative Path

### Scenario 3: Error Case

### Scenario 4: Edge Case (if applicable)

### Scenario Outline (for parameterized data)

## Applicable NFRs (Performance, Security, Accessibility targets)

## Dependencies (depends_on, blocks, related_to, external)

## Assumptions

## Implementation Notes (hints for R&D, not mandatory)
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

1. **Load PRDs**: Functional PRD (user journeys) + Technical PRD (architecture, APIs, constraints)
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
# RF-SHOP-003: Add product to cart with stock validation

| Field          | Value       |
| -------------- | ----------- |
| **ID**         | RF-SHOP-003 |
| **Version**    | 1.0         |
| **Status**     | Draft       |
| **Priority**   | Must        |
| **Complexity** | Medium      |

## Description

**Actor(s)**: Shopper (primary), Inventory Service (secondary), Cart Service (secondary)
**Preconditions**: Authenticated user, product active in catalog
**Functional Description**: The system MUST allow the user to add a product to the cart,
verify availability in real time, and reserve stock during the shopping session.

## Acceptance Criteria (BDD)

### CA-SHOP-003-01: Product available

```gherkin
Scenario: Happy path — product in stock
  Given the user "alice@example.com" has an active session
    And the product "SKU-12345" has 8 units available
  When the user clicks "Add to cart" with quantity 2
  Then the system reserves 2 units of "SKU-12345"
    And updates the cart showing 2 items
    And displays message: "Product added successfully"
    And logs event: "CART_ITEM_ADDED" with product_id and quantity

Scenario: Error — insufficient stock
  Given the product "SKU-12345" has 1 unit available
  When the user attempts to add quantity 3
  Then the system rejects the request
    And displays message: "Only 1 unit available"
    And suggests: "You can add 1 unit to the cart"
    And does not modify the inventory
```
````

### Example 2: SaaS — Plan Upgrade with Immediate Feature Access

````markdown
# RF-SAAS-007: Plan upgrade with immediate feature access

## Acceptance Criteria (BDD)

```gherkin
Scenario: Happy path — successful upgrade
  Given the user "bob@company.com" is on the "Starter" plan
    And their credit card is valid
  When the user selects the "Professional" plan and confirms payment
  Then the system charges the prorated difference for the current cycle
    And updates the plan in <5 seconds
    And activates the "Advanced Analytics" and "API Access" features
    And sends a confirmation email with the invoice
    And logs event: "PLAN_UPGRADED" with user_id and new_plan

Scenario: Error — payment declined during upgrade
  Given the user selects the "Professional" plan
  When the payment processor returns "CARD_DECLINED"
  Then the system keeps the "Starter" plan active without changes
    And displays message: "Payment not processed. Check your card"
    And offers option: "Update payment method"
    And does not activate the higher plan's features
```
````

### Example 3: Healthcare — Patient Appointment Booking

````markdown
# RF-HEALTH-012: Medical appointment booking with coverage verification

## Acceptance Criteria (BDD)

```gherkin
Scenario: Happy path — appointment available with active coverage
  Given the patient "ID-P-98765" has active medical coverage
    And the doctor "Dr. Smith" has availability on "2026-04-10 10:00"
  When the patient selects the appointment and confirms the booking
  Then the system records the appointment with status "Confirmed"
    And sends a reminder to the patient and the doctor
    And updates the doctor's schedule blocking the slot
    And logs event: "APPOINTMENT_BOOKED" with patient_id and slot_id

Scenario: Error — expired coverage
  Given the patient has had expired coverage since "2026-01-01"
  When the patient attempts to book an appointment
  Then the system blocks the booking
    And displays message: "Your medical coverage is not active"
    And offers option: "Pay out of pocket" or "Update coverage"
    And does not create the appointment until the coverage is resolved
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

- Used by `bmad-eval-runner` for ecosystem validation
- Supports quality gates in SDLC workflow
- Provides consistent validation across all skills

## Changelog

| Version | Date       | Author                                | Changes                                                                                                                                                                                                                                                            |
| ------- | ---------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1.10.0  | 2026-06-12 | TL: brownfield audit mode             | Living Spec Mode gained a reverse/brownfield path: recover a feature's `spec.md` (UJ/RF/NFR/AC) from `bmad-document-project` when there's no PRD, then hand off to `bmad-testarch-trace` for the coverage audit + gate (the "audit-system" chain — no new command) |
| 1.9.0   | 2026-06-12 | TL: living-spec mode                  | Added Living Spec Mode: consolidate a feature's UJ/RF/NFR/AC into `docs/features/<feature>/spec.md` (current-state living spec), reconciled per PRD-delta via DTC; complements per-RF Gate-2 mode                                                                  |
| 1.8.0   | 2026-06-10 | TL: Gate-evidence contract fix        | Output Location now emits per-RF files at `docs/projects/{CLIENT_CODE}/requirements/RF-*.md` (matching G2 gate-evidence glob) instead of a single requirements.md; per-RF frontmatter template                                                                     |
| 1.7.0   | 2026-06-09 | TL: BMad-coherence batch-fix          | Added "Relationship to BMad" note (LIDR-unique BDD-bearing RF authoring; consumes bmad-prd, feeds bmad-create-epics-and-stories + lidr-validate-requirements)                                                                                                      |
| 1.6.0   | 2026-06-09 | TL: lang+tool agnostic                | Language to English-default-configurable; abstracted tracking/docs tools via tool-registry                                                                                                                                                                         |
| 1.5.0   | 2026-03-25 | TL: tier3-remediation                 | Domain-agnostic migration: replaced domain-specific patterns with e-commerce/SaaS/healthcare examples; moved domain-specific content to examples/client-domain-example.md                                                                                          |
| 1.4.0   | 2026-03-16 | System: Quality Assurance Integration | Quality assurance integration                                                                                                                                                                                                                                      |
| 1.2.0   | 2026-03-09 | System: Improvement                   | Added concrete BDD scenarios and domain-specific RF patterns                                                                                                                                                                                                       |
| 1.1.0   | 2026-02-15 | TL: García                            | Added decomposition rules and validation checklist                                                                                                                                                                                                                 |
| 1.0.0   | 2026-01-20 | TL: García                            | Initial version of the skill                                                                                                                                                                                                                                       |
