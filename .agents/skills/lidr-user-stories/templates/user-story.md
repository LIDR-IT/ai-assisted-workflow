---
id: tpl-user-story
version: "1.0.0"
last_updated: "2026-03-16"
updated_by: "System: Template Migration"
status: active
type: template
review_cycle: 60
next_review: "2026-05-15"
owner_role: "Product Owner"
---

# User Story Template

> **Usage**: Standard format for User Stories with BDD criteria. Used by the `user-stories` skill.
> **Gate**: Gate 3 (Sprint Planning)

---

## Identification

| Field             | Value                         |
| ----------------- | ----------------------------- |
| ID                | US-{NNN}                      |
| Title             | {descriptive_title}           |
| RF Origin         | RF-{NNN}                      |
| Epic              | PROJ-{NNN}                    |
| Priority (MoSCoW) | Must / Should / Could / Won't |
| Estimate          | {N} hours / {N} story points  |
| Sprint target     | Sprint {N}                    |

---

## Narrative

```
As a {role/persona},
I want {action/functionality},
So that {benefit/business value}.
```

---

## Acceptance Criteria (BDD / Gherkin)

### Scenario 1: {happy_path_scenario_name}

```gherkin
Given {initial_context}
  And {additional_condition}
When {user_action}
Then {expected_result}
  And {additional_result}
```

### Scenario 2: {alternative_scenario_name}

```gherkin
Given {initial_context}
When {alternative_action}
Then {alternative_result}
```

### Scenario 3: {error_scenario_name}

```gherkin
Given {initial_context}
When {failing_action}
Then {expected_error_message}
  And {post_error_system_state}
```

---

## Dependencies

| Type         | ID                    | Description   |
| ------------ | --------------------- | ------------- |
| Blocked by   | US-{NNN} / PROJ-{NNN} | {description} |
| Blocks       | US-{NNN}              | {description} |
| External API | {api_name}            | {description} |

---

## DoR Checklist (Definition of Ready)

- [ ] Complete narrative (As a / I want / So that)
- [ ] At least 2 acceptance criteria in Gherkin
- [ ] RF origin identified and approved
- [ ] Dependencies mapped
- [ ] Estimate agreed in refinement
- [ ] Mockups/wireframes attached (if applicable)
- [ ] Test data defined (if applicable)

---

## Refinement Notes

| Date         | Participants | Decisions   | Open questions |
| ------------ | ------------ | ----------- | -------------- |
| {YYYY-MM-DD} | {names}      | {decisions} | {questions}    |
