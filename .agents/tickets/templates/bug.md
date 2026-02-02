---
id: TICK-000
title: [Bug title - describe the issue briefly]
status: backlog
priority: high
assignee: [department|person|agent-name]
type: bug
provider: none
external_link: null
created_at: YYYY-MM-DD
updated_at: YYYY-MM-DD
---

# [Bug Title]

## Description

[Brief description of the bug]

**Environment:**
- Platform: [Browser, OS, Device]
- Version: [App version or commit hash]
- Conditions: [Specific conditions when bug occurs]

## Steps to Reproduce

1. Step 1
2. Step 2
3. Step 3

## Expected Behavior

[What should happen]

## Actual Behavior

[What actually happens]

## Impact

**Severity:** [Critical|High|Medium|Low]
- Critical: Production down, data loss, security vulnerability
- High: Major feature broken, affects many users
- Medium: Minor feature broken, workaround exists
- Low: Cosmetic issue, edge case

**Affected Users:** [Percentage or count of affected users]

## Root Cause

[To be filled during investigation]

## Acceptance Criteria

- [ ] Bug no longer reproducible following steps above
- [ ] Expected behavior observed
- [ ] No regression in related functionality
- [ ] Root cause identified and documented

## Definition of Done

**Standard checklist:**
- [ ] All acceptance criteria met
- [ ] Tests written and passing (unit, integration, e2e as needed)
- [ ] Documentation updated (README, API reference, guides)
- [ ] Code reviewed and approved
- [ ] No linting errors or warnings
- [ ] Conventional commit created with TICK-ID
- [ ] PR created with proper template

**Bug-specific:**
- [ ] Root cause identified and documented
- [ ] Tests prevent regression (bug cannot reoccur)
- [ ] Related edge cases tested

## BDD Scenarios

```gherkin
Feature: [Feature with bug]

  Scenario: Bug reproduction
    Given [precondition]
    When [action that triggers bug]
    Then [incorrect behavior observed]

  Scenario: Bug fixed
    Given [same precondition]
    When [same action]
    Then [correct behavior observed]
```

## Tasks

- [ ] Reproduce bug locally - Assigned to: [developer-name]
- [ ] Identify root cause - Assigned to: [developer-name]
- [ ] Implement fix - Assigned to: [developer-name]
- [ ] Add regression tests - Assigned to: [developer-name]
- [ ] Verify in staging - Assigned to: [QA or developer-name]

## Notes

**Investigation findings:**
[Document root cause analysis]

**Fix approach:**
[Describe solution strategy]

**Related issues:**
[Link to related tickets or issues]

**Workaround (if exists):**
[Temporary workaround for users]
