---
id: TICK-000
title: [Feature title - brief, specific, <80 chars]
status: backlog
priority: medium
assignee: [department|person|agent-name]
type: feature
provider: none
external_link: null
created_at: YYYY-MM-DD HH:MM
updated_at: YYYY-MM-DD HH:MM
---

# [Feature Title]

## Description

[Detailed description of the feature]

**Context:** Why is this feature needed?

**Scope:** What is included and excluded?

**Impact:** Who benefits and how?

## Acceptance Criteria

- [ ] Criterion 1: Specific, measurable outcome
- [ ] Criterion 2: Observable behavior or result
- [ ] Criterion 3: Testable condition

<!--
Examples of good criteria:
- User can successfully login with email and password
- Page load time is less than 2 seconds
- API returns 200 status for valid requests

Avoid vague criteria like:
- Improve performance
- Make it better
- Works correctly
-->

## Definition of Done

**Standard checklist:**
- [ ] All acceptance criteria met
- [ ] Tests written and passing (unit, integration, e2e as needed)
- [ ] Documentation updated (README, API reference, guides)
- [ ] Code reviewed and approved
- [ ] No linting errors or warnings
- [ ] Conventional commit created with TICK-ID
- [ ] PR created with proper template

**Feature-specific:**
- [ ] API reference updated (if backend changes)
- [ ] Frontend validation complete (if UI changes)

## BDD Scenarios

```gherkin
Feature: [Feature name]

  Scenario: [Scenario name - happy path]
    Given [precondition]
    And [additional precondition if needed]
    When [user action]
    Then [expected outcome]
    And [additional outcome if needed]

  Scenario: [Scenario name - error case]
    Given [precondition]
    When [invalid action]
    Then [error message or behavior]
```

<!--
Gherkin best practices:
- Use concrete values (not "some user", use "user@example.com")
- Make outcomes observable (not "works", use "receives JWT token")
- Cover happy path and error cases
- Keep scenarios focused (one behavior per scenario)
-->

## Tasks

- [ ] Task 1 - Assigned to: [agent-name or developer-name]
- [ ] Task 2 - Assigned to: [agent-name or developer-name]
- [ ] Task 3 - Assigned to: [agent-name or developer-name]

<!--
Task assignment patterns:
- Backend implementation: Developers
- Frontend implementation: Developers
- Test generation: test-runner agent
- Documentation: doc-improver agent
- Code review: Security/performance specialists
-->

## Notes

[Implementation notes, decisions, trade-offs]

**Decision log:**
- Decision 1: Rationale
- Decision 2: Rationale

**Trade-offs:**
- What was prioritized vs what was deferred

**References:**
- Related documentation or tickets
- External resources or specs
