---
description: Validate ticket completeness and structure
agent: 'agent'
---

# Enrich Ticket Command

Validates ticket completeness, structure, and quality using the `lidr-ticket-validation` skill.

## Usage

```bash
/lidr-enrich-ticket TICK-XXX
```

**Arguments:**

- `ticket_id`: Ticket ID to validate (e.g., `TICK-001`)

**Examples:**

```bash
/lidr-enrich-ticket TICK-002
/lidr-enrich-ticket TICK-005
```

## What This Command Does

1. **Locates ticket** in backlog/, active/, or archived/
2. **Validates folder structure:**
   - Checks folder name format
   - Verifies required files exist (ticket.md, plan.md)
   - Validates resources/ subdirectories
3. **Validates ticket.md content:**
   - YAML frontmatter completeness
   - Date format (YYYY-MM-DD HH:MM)
   - Acceptance criteria quality
   - Definition of Done completeness
   - BDD scenarios (if applicable)
   - Task assignments
4. **Validates plan.md:**
   - Tasks are defined
   - Assignments present
   - Technical approach documented
5. **Provides detailed feedback** with file:line references

## Implementation

This command invokes the `lidr-ticket-enricher` agent, which uses the `lidr-ticket-validation` skill.

**Agent:**

```yaml
name: lidr-ticket-enricher
description: Validates and enriches ticket quality
tools: [Read, Skill]
skills: [lidr-ticket-validation, bmad-testarch-atdd]
```

**Process:**

1. Finds ticket folder across all directories
2. Reads ticket.md and plan.md
3. Validates structure and content
4. Reports issues with actionable feedback
5. Suggests improvements

## Validation Checks

### Folder Structure

✅ **Valid:**

```
Backlog/Active: TICK-XXX-start-dd-mm-yyyy/
Archived: TICK-XXX-start-dd-mm-yyyy-end-dd-mm-yyyy/
```

❌ **Invalid:**

```
TICK-XXX.md                          # Old single-file format
TICK-XXX-start-dd-mm-yyyy-end-*/    # Backlog with end date
TICK-XXX/                            # Missing date
```

### Required Files

- ✅ `ticket.md` - Main ticket file
- ✅ `plan.md` - Implementation plan
- ✅ `resources/README.md` - Resources documentation
- ✅ `resources/wireframes/` - Wireframes directory
- ✅ `resources/designs/` - Designs directory
- ✅ `resources/json/` - JSON files directory
- ✅ `resources/diagrams/` - Diagrams directory

### YAML Metadata

```yaml
id: TICK-001 # ✅ Required
title: Brief title (<80 chars) # ✅ Required
status: backlog # ✅ Required (valid enum)
priority: high # ✅ Required (valid enum)
assignee: team-name # ✅ Required
type: feature # ✅ Required (valid enum)
provider: none # ✅ Required
external_link: null # ✅ Required if provider != none
created_at: 2026-02-02 14:30 # ✅ Required (with HH:MM)
updated_at: 2026-02-02 14:30 # ✅ Required (with HH:MM)
```

### Acceptance Criteria

**Good:**

```markdown
- [ ] User can login with email and password
- [ ] Page load time < 2 seconds
- [ ] API returns 200 status for valid requests
```

**Bad:**

```markdown
- [ ] Improve performance # ❌ Vague
- [ ] Make it better # ❌ Unmeasurable
- [ ] Works correctly # ❌ Not specific
```

### Definition of Done

**Must include standard checklist:**

- [ ] All acceptance criteria met
- [ ] Tests written and passing
- [ ] Documentation updated
- [ ] Code reviewed and approved
- [ ] No linting errors
- [ ] Conventional commit with TICK-ID
- [ ] PR created

### BDD Scenarios (for features)

```gherkin
Feature: User authentication

  Scenario: Successful login
    Given user exists with email "user@example.com"
    When user submits valid credentials
    Then user receives JWT token
    And user is redirected to dashboard
```

**Requirements:**

- Complete Given/When/Then structure
- Concrete values (not "some user")
- Observable outcomes (not "works")

### Plan.md

**Must include:**

- Overview of implementation approach
- Task breakdown with assignments
- Technical approach description
- Dependencies (if any)
- Notes on key decisions

## Example Output

### Successful Validation

```
✅ Ticket TICK-002 validation passed!

📁 Location: .agents/tickets/backlog/TICK-002-start-02-02-2026

Structure:
  ✅ Folder name correct
  ✅ All required files present
  ✅ Resources structure complete

Content:
  ✅ YAML metadata valid
  ✅ Timestamps formatted correctly
  ✅ 5 acceptance criteria defined
  ✅ Definition of Done complete
  ✅ Plan includes task breakdown

Ready to move to active/ when work begins.
```

### Validation with Issues

```
⚠️  Ticket TICK-003 has 4 issues:

📁 Location: .agents/tickets/backlog/TICK-003-start-02-02-2026

Issues:

ticket.md:12 - Acceptance criterion vague: "Improve performance" → Specify metric
ticket.md:18 - DoD missing: "Code reviewed and approved"
ticket.md:34 - BDD scenario incomplete: Missing "Then" clause
plan.md:8 - Task unassigned: Specify who owns "Implement API endpoint"

Suggestions:
1. Add specific performance metric (e.g., "Page load < 2s")
2. Add code review checkbox to DoD
3. Complete BDD scenario with observable outcome
4. Assign all tasks to team members or agents

Fix these issues before moving to active/.
```

## After Enrichment

Once validation passes:

1. **Add resources** if needed (wireframes, designs, etc.)
2. **Review plan.md** - Ensure tasks are clear
3. **Move to active** when ready to start work:
   ```bash
   mv .agents/tickets/backlog/TICK-XXX-* .agents/tickets/active/
   ```
4. **Create branch:**
   ```bash
   git checkout -b feature/TICK-XXX-brief-description
   ```
5. **Update status** in ticket.md:
   ```yaml
   status: in-progress
   updated_at: 2026-02-02 15:45 # Current time
   ```

## Related Commands

- `/lidr-create-ticket [type]` - Create new ticket
- `lidr-pr-validator` agent - Check PR readiness before merge

## See Also

- `.agents/skills/lidr-ticket-validation/` - Validation skill documentation
- `.agents/rules/process/ai-workflow-system.md` - Complete workflow
- `.agents/tickets/README.md` - Ticket system overview
