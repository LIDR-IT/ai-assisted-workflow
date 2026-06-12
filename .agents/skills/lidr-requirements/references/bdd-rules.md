---
id: requirements-bdd-rules
version: "1.0.0"
last_updated: "2026-06-13"
updated_by: "TL: workflow refactor"
status: active
---

# BDD Rules (Gherkin acceptance criteria)

The AC **is** the test (ATDD seam) — write it executable, not aspirational.

| Rule                                 | Good                                                     | Bad                                     |
| ------------------------------------ | -------------------------------------------------------- | --------------------------------------- |
| Given = pre-existing state           | `Given user "alice@corp.com" has an active subscription` | `Given the user subscribes`             |
| When = ONE atomic action             | `When user submits checkout form with valid card`        | `When user pays and confirms order`     |
| Then = observable, verifiable result | `Then system returns order confirmation number`          | `Then order processing works`           |
| Scenarios independent                | each scenario runs standalone                            | scenario 2 depends on scenario 1        |
| Sensitive-data compliance            | `Then stores payment token (not raw card number)`        | `Then stores card data`                 |
| Specific thresholds                  | `Then API responds in <500ms P95`                        | `Then system responds quickly`          |
| No PII in logs                       | `Then logs ORDER_PLACED with order_id`                   | `Then logs success with customer email` |

## Best practices (domain-agnostic)

- **Measurable thresholds** always: response time <500ms, retry ≤3, error rate <0.1%.
- **Concrete data examples**: field lengths, allowed values, boundary conditions.
- **Compliance patterns**: never log sensitive data; specify encryption when storing PII.
- **Error-recovery paths**: what the user or system can do after each failure mode.
- **Security logging**: event names without PII — `ORDER_PLACED`, `PAYMENT_FAILED`, `SESSION_EXPIRED`.

## Minimum scenarios per RF

Happy path · alternative path · error case · (edge case + scenario outline when parameterized). If an RF needs >6 scenarios, it is probably 2+ RFs — see `references/decomposition-rules.md`.

## Worked examples

Concrete RF + Gherkin examples (e-commerce add-to-cart, SaaS plan upgrade, healthcare appointment) live in `examples/` (`requirements-voice-simple.md`, `requirements-selphid-banking-complex.md`, `client-domain-example.md`).
