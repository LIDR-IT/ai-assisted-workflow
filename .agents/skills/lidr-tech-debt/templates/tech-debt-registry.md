---
id: tpl-tech-debt
version: "1.1.0"
last_updated: "2026-06-09"
updated_by: "TL: lang+tool agnostic"
status: active
type: template
review_cycle: 30
next_review: "2026-07-09"
owner_role: "Tech Lead"
language_default: en
---

# Tech Debt Registry Template

> **Usage**: Centralized technical debt catalog. Used by the `lidr-tech-debt` skill.
> **Gate**: Cross-cutting (applies across all phases)
> Content authored in English; artifact language follows the client `language` setting (see `_shared/lidr/integrations/`).

---

## Registry Metadata

| Field        | Value          |
| ------------ | -------------- |
| Project      | {project_name} |
| Owner        | {tl_name}      |
| Created date | {YYYY-MM-DD}   |
| Last updated | {YYYY-MM-DD}   |

---

## Debt Catalog

| ID     | Type                                      | Description         | Origin                            | Severity                       | Estimated effort | Impact if unpaid     | Strategy                    | Sprint target        | Status                               |
| ------ | ----------------------------------------- | ------------------- | --------------------------------- | ------------------------------ | ---------------- | -------------------- | --------------------------- | -------------------- | ------------------------------------ |
| TD-001 | code / architecture / test / docs / infra | {clear_description} | deliberate / accidental / bit rot | critical / high / medium / low | {N}h / {N}d      | {impact_description} | refactor / rewrite / accept | Sprint {N} / backlog | open / in progress / paid / accepted |

---

## Type Classification

| Type             | Description                   | Examples                                                  |
| ---------------- | ----------------------------- | --------------------------------------------------------- |
| **code**         | Debt in source code           | Duplication, high cyclomatic complexity, TODO/HACK        |
| **architecture** | Debt in design/architecture   | Tight coupling, inadequate pattern, undecomposed monolith |
| **test**         | Debt in test coverage/quality | Coverage < 80%, flaky tests, no E2E                       |
| **docs**         | Debt in documentation         | Stale PRDs, missing ADRs, outdated README                 |
| **infra**        | Debt in infrastructure/CI/CD  | Slow pipeline, no IaC, outdated dependencies              |

---

## Aggregate Metrics

| Metric                      | Value                        |
| --------------------------- | ---------------------------- |
| Total debt items            | {N}                          |
| Critical/high debt          | {N}                          |
| Total estimated effort      | {N} hours                    |
| Items paid this quarter     | {N}                          |
| Trend (vs previous quarter) | growing / stable / shrinking |

---

## Trend by Sprint

| Sprint     | New items | Items paid | Net balance | Cumulative total |
| ---------- | --------- | ---------- | ----------- | ---------------- |
| Sprint {N} | {N}       | {N}        | +{N} / -{N} | {N}              |
