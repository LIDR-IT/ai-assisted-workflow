---
id: requirements-rf-body-template
version: "1.0.0"
last_updated: "2026-06-13"
updated_by: "TL: workflow refactor"
status: active
---

# Output template — per RF (+ dependency map)

## Per-RF file frontmatter

Each `RF-{PROJ}-{NNN}.md` (per-rf mode) starts with:

```markdown
---
id: RF-{PROJ}-{NNN}
version: "1.0.0"
last_updated: "YYYY-MM-DD"
updated_by: "PO: {Name}"
status: active
type: project
review_cycle: 60
next_review: "YYYY-MM-DD"
owner_role: "PO"
---
```

The `dependency-map.md` companion uses the same shape with `id: {project-name}-rf-dependency-map`.

## RF body

```markdown
# RF-{PROJ}-{NNN}: {Title — infinitive verb + object}

| Field      | Value                 |
| ---------- | --------------------- |
| ID         | RF-{PROJ}-{NNN}       |
| Version    | 1.0                   |
| Status     | Draft                 |
| Priority   | Must / Should / Could |
| Complexity | Low / Medium / High   |

## Traceability

| Reference        | Value                              |
| ---------------- | ---------------------------------- |
| PRD source       | PRD → feature / FR-N               |
| Architecture ref | architecture doc § (if applicable) |
| Business rules   | RN-FX-NN                           |

## Description

### Actor(s): primary + secondary

### Preconditions (true BEFORE)

### Functional Description ("The system MUST [behavior]")

### Business Rules (ID, Rule, Condition, Action, Exception)

### Postconditions (true AFTER)

## Input Data (Field, Type, Required, Validation, Example)

## Output Data (Field, Type, Description, Example)

## Error Handling (Code, Condition, User Message, System Action)

## Acceptance Criteria (BDD — Gherkin)

### Scenario 1: Happy Path

### Scenario 2: Alternative Path

### Scenario 3: Error Case

### Scenario 4: Edge Case (if applicable)

### Scenario Outline (parameterized data)

## Applicable NFRs (Performance, Security, Accessibility targets)

## Dependencies (depends_on, blocks, related_to, external)

## Assumptions

## Implementation Notes (hints for R&D, not mandatory)
```

> In **living-spec / brownfield** modes use the same RF body, but stable IDs are `RF-{FEATURE}-NN` and the RFs live as sections inside the feature's `docs/features/<feature>/spec.md` (with UJ + NFR), not as one file per RF.

## Global dependency map (per-rf mode)

```markdown
# Dependency Map: [PROJECT]

## Diagram (ASCII tree showing RF chains)

## Dependency Table (RF, depends_on, blocks, cluster)

## Implementation Clusters (groups for Sprint Planning + size estimate)

## Critical Path (longest dependency chain = minimum timeline)
```
