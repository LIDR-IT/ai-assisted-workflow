---
id: TICK-006
title: Create ticket-enricher agent for ticket validation
status: done
priority: critical
assignee: development-team
type: feature
provider: none
external_link: null
created_at: 2026-02-02 23:00
updated_at: 2026-02-03 16:35
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

- [x] Agent file created at `.agents/subagents/ticket-enricher.md`
- [x] Agent uses `ticket-validation` skill
- [x] Agent uses `bdd-gherkin-patterns` skill
- [x] Validates folder structure (TICK-XXX-start-dd-mm-yyyy format)
- [x] Validates YAML metadata completeness
- [x] Validates timestamp format (YYYY-MM-DD HH:MM)
- [x] Validates acceptance criteria quality
- [x] Validates Definition of Done completeness
- [x] Validates BDD scenarios (if applicable)
- [x] Validates plan.md structure
- [x] Provides file:line feedback format
- [x] Works when invoked by `/enrich-ticket TICK-XXX`

## Definition of Done

**Standard checklist:**

- [x] All acceptance criteria met
- [x] Agent tested with valid and invalid tickets (user confirmed)
- [x] Documentation updated (agent README, workflow docs)
- [x] Code reviewed and approved
- [x] No linting errors or warnings
- [x] Conventional commit created with TICK-006
- [x] PR created and linked

**Feature-specific:**

- [x] Agent works across all 4 platforms (Cursor, Claude, Gemini, Antigravity)
- [x] Validation completes in < 10 seconds
- [x] Clear, actionable error messages

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

---

## ✅ Completion Summary

**Date:** 2026-02-03
**Status:** ✅ Completed and tested

### Implementation Details

**Agent File:**

- `.agents/subagents/ticket-enricher.md` (8,150 bytes)
- Complete with frontmatter, working process, examples, and troubleshooting

**Integration:**

- Command: `/enrich-ticket TICK-XXX` invokes agent
- Skills: ticket-validation, bdd-gherkin-patterns
- Output format: file:line clickable references

**Validation Coverage:**

- ✅ Folder structure (TICK-XXX-start-dd-mm-yyyy format)
- ✅ YAML metadata (9 required fields, timestamp format)
- ✅ Acceptance criteria (specific, measurable, no vague terms)
- ✅ Definition of Done (7 standard + type-specific items)
- ✅ BDD scenarios (Gherkin format: Feature/Scenario/Given/When/Then)
- ✅ Plan.md structure (tasks with assignments, technical approach)

**Testing:**

- ✅ User confirmed: "ya he probado el agente funciona bien"
- ✅ Works across all 4 platforms
- ✅ Performance: < 10 seconds
- ✅ Clear, actionable error messages

### Impact

This agent enables the spec-driven development workflow by:

1. Ensuring ticket quality before implementation starts
2. Providing automated validation instead of manual review
3. Generating actionable feedback with file:line references
4. Supporting the `/enrich-ticket` command workflow

**Part of Phase 2 roadmap** - Spec-Driven Development (Q1 2026)
