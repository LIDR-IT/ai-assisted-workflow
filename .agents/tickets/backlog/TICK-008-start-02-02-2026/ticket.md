---
id: TICK-008
title: Create /validate-pr command for PR readiness check
status: backlog
priority: high
assignee: development-team
type: feature
provider: none
external_link: null
created_at: 2026-02-02 23:30
updated_at: 2026-02-02 23:30
---

# Create /validate-pr Command

## Description

Create `/validate-pr` command that invokes pr-validator agent to check PR readiness before creation. This command provides developers with explicit validation step before creating pull requests.

**Context:** The workflow requires explicit validation before PR creation. The pr-validator agent (TICK-007) handles the validation logic, but needs a command interface for developers to invoke it easily.

**Scope:**
- Includes: Command file, agent invocation, output formatting
- Excludes: Validation logic (handled by pr-validator agent), PR creation (separate command)

**Impact:**
- Completes PR validation workflow
- Required for quality gates
- High priority for Phase 2 milestone

## Acceptance Criteria

- [ ] Command file created at `.agents/commands/validate-pr.md`
- [ ] Command has proper YAML frontmatter
- [ ] Command works without arguments (uses current branch)
- [ ] Extracts TICK-ID from current git branch
- [ ] Finds ticket folder in `active/` directory
- [ ] Invokes `pr-validator` agent with ticket path
- [ ] Displays validation report from agent
- [ ] Shows pass/fail status clearly
- [ ] Provides actionable next steps on failure
- [ ] Exits with appropriate status code (0 = pass, 1 = fail)
- [ ] Works on all 4 platforms (Cursor, Claude, Gemini, Antigravity)
- [ ] Documentation updated in workflow docs

## Definition of Done

**Standard checklist:**
- [ ] All acceptance criteria met
- [ ] Command tested with valid and invalid branches
- [ ] Documentation updated (command README, workflow docs)
- [ ] Code reviewed and approved
- [ ] No linting errors or warnings
- [ ] Conventional commit created with TICK-008
- [ ] PR created and linked

**Feature-specific:**
- [ ] Command works from any directory in repo
- [ ] Clear error messages for edge cases
- [ ] Fast execution (< 10 seconds)
- [ ] Integration with pre-commit hook verified

## BDD Scenarios

```gherkin
Feature: PR validation command

  Scenario: Validate from feature branch
    Given current branch is "feature/TICK-123-add-feature"
    And ticket exists in active/TICK-123-start-02-02-2026/
    When user runs /validate-pr
    Then command extracts "TICK-123" from branch
    And invokes pr-validator agent
    And displays validation report
    And exits with status 0 if pass, 1 if fail

  Scenario: No ticket ID in branch
    Given current branch is "main"
    When user runs /validate-pr
    Then command displays "No TICK-ID found in branch"
    And suggests running from feature branch
    And exits with status 1

  Scenario: Ticket not found
    Given current branch is "feature/TICK-999-missing"
    And ticket TICK-999 doesn't exist
    When user runs /validate-pr
    Then command reports "Ticket TICK-999 not found"
    And suggests checking ticket exists in active/
    And exits with status 1

  Scenario: Validation passes
    Given current branch is "feature/TICK-123-add-feature"
    And ticket TICK-123 passes all validation
    When user runs /validate-pr
    Then command displays "✅ Ready for PR"
    And shows validation report
    And exits with status 0

  Scenario: Validation fails
    Given current branch is "feature/TICK-123-add-feature"
    And ticket TICK-123 has blocking issues
    When user runs /validate-pr
    Then command displays "❌ NOT READY FOR PR"
    And shows list of blocking issues
    And provides actionable next steps
    And exits with status 1
```

## Tasks

- [ ] Create command file `.agents/commands/validate-pr.md` - Assigned to: developer
- [ ] Define command YAML frontmatter - Assigned to: developer
- [ ] Implement branch name extraction - Assigned to: developer
- [ ] Implement TICK-ID parsing logic - Assigned to: developer
- [ ] Implement ticket folder search - Assigned to: developer
- [ ] Add agent invocation logic - Assigned to: developer
- [ ] Format validation report output - Assigned to: developer
- [ ] Add error handling for edge cases - Assigned to: developer
- [ ] Test with various branch patterns - Assigned to: developer
- [ ] Document command usage - Assigned to: developer
- [ ] Update workflow docs with command - Assigned to: developer
- [ ] Verify integration with pre-commit hook - Assigned to: developer

## Notes

**Design Decisions:**
- Command should be simple: just invoke agent and display results
- No arguments needed (uses current branch automatically)
- Clear pass/fail output for scripts and humans
- Exit codes for CI/CD integration

**Command Flow:**
1. Get current git branch: `git rev-parse --abbrev-ref HEAD`
2. Extract TICK-ID: regex match `(TICK-[0-9]+)`
3. Search for ticket: `find .agents/tickets/active -name "TICK-XXX-start-*"`
4. Invoke agent: Call pr-validator with ticket path
5. Display report: Show agent output
6. Exit: 0 if pass, 1 if fail

**Error Handling:**
- Not on git branch: "Not in git repository"
- No TICK-ID in branch: "No TICK-ID found, run from feature branch"
- Ticket not found: "Ticket TICK-XXX not found in active/"
- Ticket in wrong folder: "Ticket in backlog/, move to active/ first"

**Dependencies:**
- Depends on pr-validator agent (TICK-007)
- Depends on git repository
- Depends on ticket in active/ folder

**References:**
- pr-validator agent: `.agents/agents/pr-validator.md` (TICK-007)
- Command development: `.agents/skills/command-development/`
- Workflow: `.agents/rules/process/ai-workflow-system.md`
