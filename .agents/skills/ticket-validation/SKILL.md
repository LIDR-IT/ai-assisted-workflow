---
name: ticket-validation
description: This skill should be used when agents need to "validate ticket structure", "check YAML frontmatter", "verify acceptance criteria", "review Definition of Done", or "validate BDD scenarios". Provides validation patterns and checklists for ticket quality.
version: 0.1.0
---

# Ticket Validation Skill

## Overview

Provides comprehensive patterns and checklists for validating ticket structure, completeness, and quality. Use this skill when validating tickets in `.agents/tickets/`.

## When to Use This Skill

- Validating ticket YAML frontmatter
- Checking acceptance criteria specificity
- Reviewing Definition of Done completeness
- Verifying BDD scenario quality
- Enriching incomplete tickets
- Pre-PR validation checks

## Validation Checklist

### YAML Frontmatter

**Required fields:**

- [ ] `id` present and matches TICK-### pattern
- [ ] `title` present, <80 chars, descriptive
- [ ] `status` is valid enum (backlog|todo|in-progress|review|done|archived)
- [ ] `priority` is valid enum (critical|high|medium|low)
- [ ] `assignee` specified (not empty)
- [ ] `type` matches template (feature|bug|refactor|docs)
- [ ] `provider` valid (none or external provider name)
- [ ] `external_link` null if provider=none, URL otherwise
- [ ] `created_at` in ISO date format (YYYY-MM-DD)
- [ ] `updated_at` in ISO date format (YYYY-MM-DD)

**Field-specific validation:**

```yaml
# ID validation
id: TICK-123  ✓ (matches pattern)
id: TIC-123   ✗ (wrong prefix)
id: TICK-1    ✗ (needs 3 digits with leading zeros)

# Title validation
title: Add user authentication  ✓ (specific, <80 chars)
title: Add user authentication with JWT tokens and OAuth2 support including refresh tokens  ✗ (too long)
title: Update code  ✗ (too vague)

# Status validation
status: in-progress  ✓
status: wip          ✗ (not enum value)

# Provider validation
provider: none
external_link: null  ✓ (consistent)

provider: github
external_link: https://github.com/org/repo/issues/123  ✓ (URL provided)

provider: github
external_link: null  ✗ (provider set but no link)
```

### Acceptance Criteria

**Quality checks:**

- [ ] At least 2-3 criteria defined (1 is usually insufficient)
- [ ] Each criterion is specific and measurable
- [ ] Criteria use checkbox format (`- [ ] ...`)
- [ ] No vague terms ("better", "improved", "faster", "optimize")
- [ ] Criteria are testable (observable outcomes)
- [ ] Criteria cover happy path and error cases

**Examples:**

**Good criteria:**

```markdown
- [ ] User can login with valid email and password
- [ ] Page load time is less than 2 seconds
- [ ] API returns 200 status code for valid requests
- [ ] Error message displays for invalid input
```

**Bad criteria:**

```markdown
- [ ] Improve performance ✗ (vague - by how much?)
- [ ] Make it better ✗ (unmeasurable)
- [ ] Works correctly ✗ (not specific)
- [ ] Fast response ✗ (no metric)
```

**Conversion patterns:**

- "Improve performance" → "Page load time < 2 seconds"
- "Better error handling" → "Display error message 'Invalid input' for empty fields"
- "Fast API" → "API response time < 500ms for 95th percentile"
- "Works well" → "All unit tests passing with >80% coverage"

### Definition of Done

**Standard items (all tickets must have):**

- [ ] All acceptance criteria met
- [ ] Tests written and passing
- [ ] Documentation updated
- [ ] Code reviewed and approved
- [ ] No linting errors or warnings
- [ ] Conventional commit created with TICK-ID
- [ ] PR created with proper template

**Type-specific additions:**

**Feature tickets:**

- [ ] API reference updated (if backend changes)
- [ ] Frontend validation complete (if UI changes)

**Bug tickets:**

- [ ] Root cause identified and documented
- [ ] Tests prevent regression

**Refactor tickets:**

- [ ] No behavior change (tests prove equivalence)
- [ ] Performance measured (before/after)

**Docs tickets:**

- [ ] Examples included and tested
- [ ] Links verified (no 404s)

**Missing item patterns:**

```markdown
# Incomplete DoD

- [ ] All acceptance criteria met
- [ ] Tests written
      ✗ Missing: "and passing"

- [ ] Documentation updated
      ✗ Missing: specific docs (README, API reference, guides)

- [ ] Code reviewed
      ✗ Missing: "and approved"
```

### BDD Scenarios

**Structure validation:**

- [ ] Gherkin format correct (Feature/Scenario/Given/When/Then)
- [ ] At least 1 scenario per ticket (2-3 recommended)
- [ ] Each scenario has Given (precondition)
- [ ] Each scenario has When (action)
- [ ] Each scenario has Then (outcome)
- [ ] Scenarios are concrete (not abstract)
- [ ] Scenarios are testable (observable outcomes)
- [ ] Scenarios cover happy path
- [ ] Scenarios cover error cases

**Example validation:**

**Complete scenario:**

```gherkin
Scenario: User logs in with valid credentials  ✓
  Given a registered user with email "user@example.com"  ✓ (concrete)
  And the password is "SecurePass123"                   ✓ (specific)
  When the user submits the login form                  ✓ (action)
  Then the user receives a JWT access token             ✓ (observable)
  And the user is redirected to dashboard               ✓ (outcome)
```

**Incomplete scenario:**

```gherkin
Scenario: Login works  ✗ (vague title)
  Given user exists    ✗ (not concrete - which user?)
  When login           ✗ (not specific - how?)
  Then success         ✗ (not observable - what success?)
```

**Missing clauses:**

```gherkin
Scenario: User authentication
  Given a registered user
  When the user logs in
  ✗ Missing Then clause (expected outcome)

Scenario: Login error
  When invalid credentials entered  ✗ Missing Given (precondition)
  Then error message displayed
```

### Tasks Section

**Validation:**

- [ ] At least 1 task defined
- [ ] Each task has "Assigned to:" with name
- [ ] Tasks are specific and actionable
- [ ] Tasks have clear completion criteria
- [ ] Tasks cover all work needed for ticket

**Good tasks:**

```markdown
- [ ] Implement JWT service - Assigned to: developer-name
- [ ] Write unit tests - Assigned to: developer-name
- [ ] Update API documentation - Assigned to: doc-improver agent
```

**Bad tasks:**

```markdown
- [ ] Do the work ✗ (vague)
- [ ] Implement feature - Assigned to: ✗ (no assignee)
- [ ] Fix it ✗ (not specific)
```

## Validation Workflow

### Phase 1: YAML Validation

1. Check all required fields present
2. Validate field values against enums
3. Check date formats (ISO 8601)
4. Verify provider/external_link consistency

### Phase 2: Content Validation

1. Check Description is detailed (not just title repeat)
2. Validate Acceptance Criteria specificity
3. Review Definition of Done completeness
4. Verify BDD scenarios structure

### Phase 3: Quality Check

1. Check for vague terms in criteria
2. Verify tasks have assignments
3. Ensure concrete values in BDD scenarios
4. Validate overall ticket completeness

### Phase 4: Reporting

Generate report with file:line references:

```text
TICK-123:12 - Missing acceptance criterion for error handling
TICK-123:23 - Definition of Done incomplete (tests section empty)
TICK-123:34 - BDD scenario lacks "Then" clause
TICK-123:45 - Vague criterion: "improve" → specify outcome

✓ YAML frontmatter valid
✓ Assignee specified
✗ Ready for implementation: NO (4 issues)
```

## Common Issues and Fixes

### Issue: Vague acceptance criteria

**Problem:**

```markdown
- [ ] Improve performance
```

**Fix:**

```markdown
- [ ] Page load time < 2 seconds for 95th percentile
```

### Issue: Incomplete BDD scenario

**Problem:**

```gherkin
Scenario: Login
  Given user
  When login
```

**Fix:**

```gherkin
Scenario: User logs in with valid credentials
  Given a registered user with email "user@example.com"
  And the password is "SecurePass123"
  When the user submits the login form
  Then the user receives a JWT access token
  And the user is redirected to dashboard
```

### Issue: Missing DoD items

**Problem:**

```markdown
## Definition of Done

- [ ] Tests written
- [ ] Code reviewed
```

**Fix:**

```markdown
## Definition of Done

- [ ] All acceptance criteria met
- [ ] Tests written and passing (unit, integration, e2e as needed)
- [ ] Documentation updated (README, API reference, guides)
- [ ] Code reviewed and approved
- [ ] No linting errors or warnings
- [ ] Conventional commit created with TICK-ID
- [ ] PR created with proper template
```

### Issue: Unassigned tasks

**Problem:**

```markdown
- [ ] Implement authentication
- [ ] Write tests
```

**Fix:**

```markdown
- [ ] Implement authentication - Assigned to: developer-name
- [ ] Write tests - Assigned to: test-runner agent
```

## Integration with Agents

This skill is used by:

1. **ticket-enricher agent:** Validates new tickets, suggests improvements
2. **pr-validator agent:** Checks ticket completeness before PR creation

**Usage pattern:**

```markdown
1. Load ticket-validation skill
2. Parse ticket YAML and content
3. Run validation checks from this skill
4. Generate report with issues
5. Suggest fixes based on patterns
```

## References

- YAML Schema: `references/yaml-schema.md`
- Definition of Done Checklist: `references/dod-checklist.md`
- Valid Ticket Example: `examples/valid-ticket.md`
- Invalid Ticket Example: `examples/invalid-ticket.md`
- Workflow System: `.agents/rules/process/ai-workflow-system.md`
