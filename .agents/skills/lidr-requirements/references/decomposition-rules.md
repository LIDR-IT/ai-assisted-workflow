---
id: requirements-decomposition-rules
version: "1.0.0"
last_updated: "2026-06-13"
updated_by: "TL: workflow refactor"
status: active
---

# Decomposition Rules

- **1 RF = 1 observable behavior.** If the description contains "and" / "also" / "besides" → split into 2+ RFs
  - ✅ "Validate user address during checkout"
  - ❌ "Validate user address and apply discount code during checkout" → split into 2 RFs
- **1 RF = 1 actor + 1 action + 1 result.** Multiple actors with different actions = multiple RFs.
- **Error flows are separate RFs**, not part of the happy-path RF (validation failure, timeout, unauthorized access).
- **If RF has >6 Gherkin scenarios** → probably 2+ RFs, decompose further.
- **If RF depends on >3 others** → too high-level, decompose.
- **Compliance separate:** data consent, retention, deletion are separate RFs from data processing.

## Common RF Pattern Examples

**E-Commerce (checkout):** Cart (add → quantity → price recalc → stock check) · Payment (tokenize → authorize → receipt → confirmation email) · Order (create → fulfillment → tracking → delivery notice).

**SaaS (subscriptions):** Onboarding (account → plan → payment setup → trial) · Billing (invoice → collect → retry → dunning) · Access (flag eval → tier enforce → upgrade prompt → downgrade).

**Healthcare (patient onboarding):** Registration (identity → insurance → consent → record) · Appointment (availability → booking → reminder → cancellation) · Compliance (audit log → access control → retention → export).

> Domain-specific examples (identity verification: authenticity detection, template matching, document parsing): `examples/client-domain-example.md`.

## Validation Checklist (per RF + global)

Per RF: single observable behavior · full traceability to the unified PRD (functional + NFR scope) · input data with type/validation/example · ≥3 Gherkin scenarios (happy + error + edge) · measurable thresholds · data-sensitivity handled (encryption, no PII in logs) · error-recovery paths · NFRs declared · dependencies ordered · assumptions explicit.

Global: sequential IDs no gaps · complete feature lifecycle (create→update→delete) · compliance coverage (consent/processing/retention/deletion) · no cycles in dependency map · critical path identified · every "Must" functionality has ≥1 RF · no orphan RFs · `checklists/rf-coherence.md` executed.

## Common Anti-Patterns (avoid)

| Anti-pattern                     | Correct                                                               | Why                              |
| -------------------------------- | --------------------------------------------------------------------- | -------------------------------- |
| "RF-001: Complete checkout flow" | split: cart validation, payment, confirmation, fulfillment            | too broad                        |
| "system responds fast"           | "API responds in <500ms P95 under 1000 concurrent users"              | needs concrete threshold         |
| "stores user data securely"      | "stores payment token encrypted (AES-256-GCM), never raw card number" | specify what + how               |
| "logs user activity"             | "logs ORDER_PLACED with order_id (no PII in payload)"                 | compliance — specify log content |
| "handles errors gracefully"      | a separate RF per error type with message + recovery                  | one RF per behavior              |
