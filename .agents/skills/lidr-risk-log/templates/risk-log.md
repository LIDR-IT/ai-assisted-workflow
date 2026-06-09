---
id: tpl-risk-log
version: "1.1.0"
last_updated: "2026-06-09"
updated_by: "TL: lang+tool agnostic"
status: active
type: template
review_cycle: 30
next_review: "2026-07-09"
owner_role: "Tech Lead"
---

# Risk Log Template

> **Usage**: Centralized project risk register. Used by the `risk-log` skill.
> **Gate**: Gate 1 (Discovery)

---

## Register Metadata

| Field        | Value            |
| ------------ | ---------------- |
| Project      | {project_name}   |
| Owner        | {pme_or_tl_name} |
| Created      | {YYYY-MM-DD}     |
| Last updated | {YYYY-MM-DD}     |

---

## Risk Table

| ID    | Category                                         | Description         | Probability (1-5) | Impact (1-5) | Score   | Strategy                             | Owner  | Status                                   | Review date  |
| ----- | ------------------------------------------------ | ------------------- | ----------------- | ------------ | ------- | ------------------------------------ | ------ | ---------------------------------------- | ------------ |
| R-001 | technical / business / organizational / external | {clear_description} | {1-5}             | {1-5}        | {P x I} | mitigate / accept / transfer / avoid | {name} | open / mitigated / closed / materialized | {YYYY-MM-DD} |

---

## Heat Map

```
Impact →    1        2        3        4        5
Prob ↓
  5       medium   high     high     critical critical
  4       low      medium   high     high     critical
  3       low      medium   medium   high     high
  2       low      low      medium   medium   high
  1       low      low      low      medium   medium
```

---

## Escalation Thresholds

| Score | Level    | Action required                                  |
| ----- | -------- | ------------------------------------------------ |
| 20-25 | Critical | Escalate to sponsor + immediate contingency plan |
| 12-19 | High     | Escalate to PME + mandatory active mitigation    |
| 6-11  | Medium   | Weekly monitoring + assigned owner               |
| 1-5   | Low      | Biweekly monitoring                              |

---

## Change History

| Date         | Risk    | Change                  | Owner  |
| ------------ | ------- | ----------------------- | ------ |
| {YYYY-MM-DD} | R-{NNN} | {description of change} | {name} |
