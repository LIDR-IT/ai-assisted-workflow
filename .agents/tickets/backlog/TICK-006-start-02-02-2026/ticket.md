---
id: TICK-006
title: Create ticket-enricher agent for ticket validation
status: backlog
priority: critical
assignee: development-team
type: feature
provider: none
external_link: null
created_at: 2026-02-02 23:00
updated_at: 2026-02-02 23:15
---

# Create ticket-enricher Agent

## Description

Create specialized agent that validates ticket completeness and structure. This agent is referenced by `/enrich-ticket` command but doesn't exist yet.

**Context:** The `/enrich-ticket` command expects a `ticket-enricher` agent to validate tickets against quality standards. Currently the command documentation exists but the agent is missing.

**Scope:**
- Includes: Agent file, validation logic, skill integration
- Excludes: UI/frontend, external provider sync

**Impact:** 
- Blocks ticket validation workflow
- Required for spec-driven development
- Critical for Phase 2 milestone

## Acceptance Criteria

- [ ] Agent file created at `.agents/subagents/ticket-enricher.md`
- [ ] Agent uses `ticket-validation` skill
- [ ] Agent uses `bdd-gherkin-patterns` skill  
- [ ] Validates folder structure (TICK-XXX-start-dd-mm-yyyy format)
- [ ] Validates YAML metadata completeness
- [ ] Validates timestamp format (YYYY-MM-DD HH:MM)
- [ ] Validates acceptance criteria quality
- [ ] Validates Definition of Done completeness
- [ ] Validates BDD scenarios (if applicable)
- [ ] Validates plan.md structure
- [ ] Provides file:line feedback format
- [ ] Works when invoked by `/enrich-ticket TICK-XXX`

## Definition of Done

**Standard checklist:**
- [ ] All acceptance criteria met
- [ ] Agent tested with valid and invalid tickets
- [ ] Documentation updated (agent README, workflow docs)
- [ ] Code reviewed and approved
- [ ] No linting errors or warnings
- [ ] Conventional commit created with TICK-006
- [ ] PR created and linked

**Feature-specific:**
- [ ] Agent works across all 4 platforms (Cursor, Claude, Gemini, Antigravity)
- [ ] Validation completes in < 10 seconds
- [ ] Clear, actionable error messages

## BDD Scenarios

```gherkin
Feature: Ticket validation with ticket-enricher agent

  Scenario: Valid ticket passes validation
    Given a ticket with complete YAML, criteria, and DoD
    When /enrich-ticket TICK-XXX is invoked
    Then agent reports "✅ Validation passed"
    And no issues are reported

  Scenario: Missing acceptance criteria
    Given a ticket with incomplete acceptance criteria
    When /enrich-ticket TICK-XXX is invoked
    Then agent reports validation failure
    And provides file:line reference for missing criteria
    And suggests specific improvements

  Scenario: Invalid folder naming
    Given a ticket in backlog with end date in folder name
    When /enrich-ticket TICK-XXX is invoked
    Then agent reports "Folder should not have end date"
    And suggests correct naming format

  Scenario: Invalid timestamp format
    Given a ticket with YYYY-MM-DD timestamps (no HH:MM)
    When /enrich-ticket TICK-XXX is invoked
    Then agent reports timestamp format error
    And suggests YYYY-MM-DD HH:MM format
```

## Tasks

- [ ] Create agent file `.agents/subagents/ticket-enricher.md` - Assigned to: developer
- [ ] Define agent frontmatter (name, description, tools, skills) - Assigned to: developer
- [ ] Implement folder structure validation logic - Assigned to: developer
- [ ] Implement YAML validation logic - Assigned to: developer
- [ ] Implement acceptance criteria validation - Assigned to: developer
- [ ] Implement DoD validation - Assigned to: developer
- [ ] Implement BDD scenario validation - Assigned to: developer
- [ ] Add file:line output formatting - Assigned to: developer
- [ ] Test with TICK-002, TICK-003, TICK-004, TICK-005 - Assigned to: developer
- [ ] Update `/enrich-ticket` command to reference agent - Assigned to: developer
- [ ] Document agent usage in workflow docs - Assigned to: developer

## Notes

**Design Decisions:**
- Agent should use existing `ticket-validation` and `bdd-gherkin-patterns` skills
- Output format should be file:line for VS Code clickability
- Validation should be fast (< 10 seconds)
- Agent should provide actionable feedback, not just errors

**Dependencies:**
- Depends on `ticket-validation` skill (exists, may need updates)
- Depends on `bdd-gherkin-patterns` skill (exists)
- Blocks `/enrich-ticket` full functionality

**References:**
- `/enrich-ticket` command: `.agents/commands/enrich-ticket.md`
- Workflow: `.agents/rules/process/ai-workflow-system.md`
- Skills: `.agents/skills/ticket-validation/`, `.agents/skills/bdd-gherkin-patterns/`
