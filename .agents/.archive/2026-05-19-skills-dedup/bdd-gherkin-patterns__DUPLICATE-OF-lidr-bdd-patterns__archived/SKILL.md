---
name: bdd-gherkin-patterns
description: This skill should be used when agents need to "write BDD scenarios", "format Gherkin syntax", "create test scenarios", "validate Given-When-Then structure", or "generate acceptance tests". Provides Gherkin patterns and BDD best practices.
version: 0.1.0
---

# BDD/Gherkin Patterns Skill

## Overview

Provides Gherkin syntax reference and BDD scenario patterns for writing effective acceptance tests.

## Gherkin Keywords

- **Feature:** High-level description
- **Scenario:** Specific test case
- **Given:** Precondition(s)
- **When:** Action(s)
- **Then:** Expected outcome(s)
- **And/But:** Additional steps
- **Background:** Common setup for all scenarios
- **Scenario Outline:** Parameterized tests with examples

## Pattern Templates

### Happy Path

```gherkin
Scenario: [Action] with valid [input]
  Given [precondition with concrete values]
  When [specific user action]
  Then [observable successful outcome]
```

### Error Case

```gherkin
Scenario: [Action] with invalid [input]
  Given [precondition]
  When [invalid action with specific bad input]
  Then [specific error message or behavior]
  And [system state unchanged]
```

### Authentication Example

```gherkin
Feature: User Authentication

  Scenario: Successful login
    Given a registered user with email "user@example.com"
    And the password is "SecurePass123"
    When the user submits the login form
    Then the user receives a JWT access token
    And the user is redirected to dashboard
```

## Best Practices

- Use concrete values (not "some user")
- Make outcomes observable (not "works")
- One scenario = one behavior
- Cover happy path and errors
- Keep scenarios independent

## References

See `references/gherkin-syntax.md` for complete syntax guide.
