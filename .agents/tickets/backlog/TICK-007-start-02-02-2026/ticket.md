---
id: TICK-007
title: Create pr-validator agent for PR readiness validation
status: backlog
priority: critical
assignee: development-team
type: feature
provider: none
external_link: null
created_at: 2026-02-02 23:15
updated_at: 2026-02-02 23:15
---

# Create pr-validator Agent

## Description

Create specialized agent that validates PR readiness before creation. This agent is referenced by `/validate-pr` command and pre-commit hook but doesn't exist yet.

**Context:** The workflow system expects a `pr-validator` agent to check Definition of Done, acceptance criteria, tests, and documentation before allowing PR creation. The command and hook documentation exist but the agent is missing.

**Scope:**

- Includes: Agent file, validation logic, skill integration, DoD verification
- Excludes: Git operations (handled by hook), PR creation (handled by command)

**Impact:**

- Blocks PR validation workflow
- Required for quality gates
- Critical for Phase 2 milestone

## Acceptance Criteria

- [ ] Agent file created at `.agents/subagents/pr-validator.md`
- [ ] Agent uses `ticket-validation` skill
- [ ] Validates all acceptance criteria checked off
- [ ] Validates Definition of Done completeness
- [ ] Checks tests written and passing
- [ ] Verifies documentation updated (README, API docs, guides)
- [ ] Validates conventional commit message format
- [ ] Checks no linting errors present
- [ ] Verifies branch naming follows convention
- [ ] Confirms ticket status is `in-progress` or `review`
- [ ] Provides file:line feedback format for issues
- [ ] Works when invoked by `/validate-pr` command
- [ ] Works when invoked by pre-commit hook

## Definition of Done

**Standard checklist:**

- [ ] All acceptance criteria met
- [ ] Agent tested with valid and invalid tickets
- [ ] Documentation updated (agent README, workflow docs)
- [ ] Code reviewed and approved
- [ ] No linting errors or warnings
- [ ] Conventional commit created with TICK-007
- [ ] PR created and linked

**Feature-specific:**

- [ ] Agent works across all 4 platforms (Cursor, Claude, Gemini, Antigravity)
- [ ] Validation completes in < 10 seconds
- [ ] Clear pass/fail report with actionable feedback
- [ ] Blocks PRs when critical issues found

## BDD Scenarios

```gherkin
Feature: PR validation with pr-validator agent

  Scenario: Valid PR passes all checks
    Given a ticket with all criteria met
    And all DoD items checked
    And tests passing
    And documentation updated
    When /validate-pr is invoked
    Then agent reports "✅ Ready for PR"
    And no blocking issues are reported

  Scenario: Missing acceptance criteria
    Given a ticket with 3 of 5 criteria unchecked
    When /validate-pr is invoked
    Then agent reports validation failure
    And lists unchecked criteria with file:line references
    And blocks PR creation

  Scenario: Tests not written
    Given a ticket with DoD "tests" unchecked
    When /validate-pr is invoked
    Then agent reports "Tests section incomplete"
    And provides file:line reference to DoD
    And blocks PR creation

  Scenario: Documentation not updated
    Given code changes without corresponding doc updates
    When /validate-pr is invoked
    Then agent reports "Documentation outdated"
    And suggests which docs need updates
    And blocks PR creation

  Scenario: Invalid commit message format
    Given commits not following conventional format
    When /validate-pr is invoked
    Then agent reports commit format errors
    And shows examples of correct format
    And blocks PR creation
```

## Tasks

- [ ] Create agent file `.agents/subagents/pr-validator.md` - Assigned to: developer
- [ ] Define agent frontmatter (name, description, tools, skills) - Assigned to: developer
- [ ] Implement ticket extraction from branch name - Assigned to: developer
- [ ] Implement acceptance criteria validation - Assigned to: developer
- [ ] Implement DoD validation - Assigned to: developer
- [ ] Implement test verification logic - Assigned to: developer
- [ ] Implement documentation check logic - Assigned to: developer
- [ ] Implement commit message validation - Assigned to: developer
- [ ] Add pass/fail report formatting - Assigned to: developer
- [ ] Test with TICK-002, TICK-003, TICK-004, TICK-005 - Assigned to: developer
- [ ] Integrate with `/validate-pr` command - Assigned to: developer
- [ ] Integrate with pre-commit hook - Assigned to: developer
- [ ] Document agent usage in workflow docs - Assigned to: developer

## Notes

**Design Decisions:**

- Agent should use existing `ticket-validation` skill for patterns
- Output format should be pass/fail checklist with file:line references
- Validation should be comprehensive but fast (< 10 seconds)
- Agent should provide actionable feedback, not just errors
- Block PRs only on critical issues (missing criteria, no tests, etc.)

**Dependencies:**

- Depends on `ticket-validation` skill (exists)
- Depends on ticket being in `active/` folder
- Blocks PR creation if validation fails
- Works with both `/validate-pr` command and pre-commit hook

**References:**

- `/validate-pr` command: `.agents/commands/validate-pr.md`
- Pre-commit hook: `.agents/hooks/scripts/validate-commit.sh`
- Workflow: `.agents/rules/process/ai-workflow-system.md`
- Skills: `.agents/skills/ticket-validation/`
