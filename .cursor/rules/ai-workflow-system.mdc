---
name: ai-workflow-system
description: Spec-driven development workflow from ticket creation to PR merge
alwaysApply: false
globs: [".agents/tickets/**/*.md", "docs/**/*.md"]
argument-hint: <ticket-or-doc>
paths: [".agents/tickets/**/*.md"]
trigger: always_on
---

# AI Workflow System

Review these files: $ARGUMENTS. Check against workflow stages and ticket structure. Output concise findings.

## Workflow: Create → Enrich → Plan → Implement → Validate → Hook Check → Commit → PR → Archive

### 1. Ticket Creation
- Manual: Copy `.agents/tickets/templates/{type}.md` → `backlog/TICK-{id}.md`
- Automated: `/create-ticket [type]`
- Branch: `{type}/TICK-{id}-{brief-description}`

### 2. Ticket Enrichment
- Command: `/enrich-ticket TICK-{id}`
- Agent: ticket-enricher validates completeness using ticket-validation skill
- Checks: YAML, acceptance criteria, DoD, BDD scenarios, tasks

### 3. Planning
- Break ticket into tasks with assignments
- Move backlog/ → active/
- Update YAML: `status: in-progress`

### 4. Implementation
- Complete assigned tasks
- Commit with: `feat(TICK-123): description`
- Update ticket notes

### 5. PR Validation
- Command: `/validate-pr`
- Agent: pr-validator checks DoD, tests, docs
- Pre-commit hook: Validates on `git commit`

### 6. Hook Check
- Runs before `git commit`
- Extracts TICK-ID from branch
- If ticket not found: DENY
- If found: ASK user to run /validate-pr

### 7. Commit
- Format: `type(TICK-id): Brief description`
- Types: feat, fix, refactor, docs, test, chore

### 8. Pull Request
- Title matches ticket
- Link to ticket
- All DoD checkboxes marked

### 9. Archive
- Move active/ → archived/{YYYY-QX}/
- Update YAML: `status: done`
- Delete branch

## Ticket YAML Required Fields

```yaml
---
id: TICK-001
title: Brief title (<80 chars)
status: backlog|todo|in-progress|review|done|archived
priority: critical|high|medium|low
assignee: department|person|agent
type: feature|bug|refactor|docs
provider: none|github|jira|notion|trello|linear
external_link: null|URL
created_at: YYYY-MM-DD
updated_at: YYYY-MM-DD
---
```

## Ticket Sections

### Description
- Detailed explanation
- Context, scope, impact

### Acceptance Criteria
```markdown
- [ ] Specific, measurable criterion
- [ ] Observable outcome
- [ ] Testable condition
```

**Good:** "Page load time < 2 seconds"
**Bad:** "Improve performance" (vague)

### Definition of Done

**Standard (all tickets):**
- [ ] All acceptance criteria met
- [ ] Tests written and passing
- [ ] Documentation updated
- [ ] Code reviewed and approved
- [ ] No linting errors
- [ ] Conventional commit with TICK-ID
- [ ] PR created

**Type-specific:**
- Feature: API reference updated, frontend validation
- Bug: Root cause identified, regression tests
- Refactor: No behavior change, performance measured
- Docs: Examples included, links verified

### BDD Scenarios
```gherkin
Feature: Feature name

  Scenario: Happy path
    Given precondition with concrete values
    When specific action
    Then observable outcome

  Scenario: Error case
    Given precondition
    When invalid action
    Then error message or behavior
```

**Complete scenario needs:** Given, When, Then, concrete values, observable outcomes

### Tasks
```markdown
- [ ] Task description - Assigned to: name
```

### Notes
Implementation decisions, trade-offs, references

## Branch Naming

**Pattern:** `{type}/{TICK-id}-{description}`

**Rules:**
- type: feature, fix, refactor, docs
- TICK-id: Exact ticket ID
- description: Kebab-case, 2-5 words
- Total: <50 characters

**Examples:**
- feature/TICK-123-add-auth
- fix/TICK-456-memory-leak
- refactor/TICK-789-extract-validators

## Agent Coordination

### ticket-enricher
- Invocation: `/enrich-ticket TICK-123`
- Uses: ticket-validation, bdd-gherkin-patterns skills
- Validates: YAML, criteria, DoD, BDD, tasks
- Output: file:line issues with suggested fixes

### pr-validator
- Invocation: `/validate-pr`
- Uses: ticket-validation skill
- Checks: All acceptance criteria met, DoD complete, tests pass, docs updated
- Output: Pass/fail report with blocking issues

## Pre-Commit Hook

**File:** `.agents/hooks/hooks.json`

**Behavior:**
1. Check if command is `git commit`
2. Extract TICK-ID from branch
3. If no TICK-ID: ALLOW
4. If TICK-ID:
   - Check ticket exists (active/ or backlog/)
   - If not found: DENY
   - If found: ASK user to run /validate-pr

**Permissions:**
- allow: Commit proceeds
- ask: Prompt user
- deny: Block with error

## Output Format

Use `file:line` format (VS Code clickable).

```text
## .agents/tickets/active/TICK-123.md

TICK-123:12 - Missing criterion for error handling
TICK-123:23 - DoD incomplete (tests empty)
TICK-123:34 - BDD scenario lacks "Then"
TICK-123:45 - Vague: "improve" → specify outcome

✓ YAML valid
✓ Branch naming compliant
✗ Ready for PR: NO (4 issues)
```

## Anti-Patterns

**Flag these:**
- YAML field missing (id, title, status, priority, assignee, type)
- Status invalid (not enum)
- Branch doesn't match pattern
- Acceptance criteria vague ("better", "improved", "faster")
- DoD missing standard items
- BDD incomplete (no Given/When/Then)
- Tasks unassigned
- Commit missing TICK-ID
- Provider set but no external_link
- Ticket in backlog/ but branch created (should be active/)
- Ticket archived but branch exists

## References

- Mission: `.agents/rules/product/mission.md`
- Roadmap: `.agents/rules/product/roadmap.md`
- Git Workflow: `.agents/rules/process/git-workflow.md`
- Testing: `.agents/rules/quality/testing.md`
- Skills: `.agents/skills/ticket-validation/`, `.agents/skills/bdd-gherkin-patterns/`
