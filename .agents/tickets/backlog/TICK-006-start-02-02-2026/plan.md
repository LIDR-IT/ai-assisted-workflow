# Implementation Plan

## Overview

Create ticket-enricher agent that validates ticket structure and content using existing skills.

## Tasks

- [ ] Create agent file with frontmatter - Assigned to: developer
- [ ] Implement validation logic using skills - Assigned to: developer
- [ ] Add output formatting (file:line) - Assigned to: developer
- [ ] Test with existing tickets - Assigned to: developer
- [ ] Update documentation - Assigned to: developer

## Technical Approach

**Agent Structure:**
```yaml
---
name: ticket-enricher
description: Validates ticket completeness and quality
tools: [Read, Grep, Glob, Skill]
skills: [ticket-validation, bdd-gherkin-patterns]
color: blue
---
```

**Validation Flow:**
1. Find ticket folder (backlog/, active/, archived/)
2. Validate folder naming format
3. Read ticket.md and plan.md
4. Use ticket-validation skill for content
5. Use bdd-gherkin-patterns skill for scenarios
6. Generate file:line feedback

**Output Format:**
```
✅ Ticket TICK-XXX validation passed!
or
⚠️ Ticket TICK-XXX has 4 issues:

ticket.md:12 - Acceptance criterion vague
ticket.md:18 - DoD missing item
plan.md:8 - Task unassigned
```

## Dependencies

- ticket-validation skill
- bdd-gherkin-patterns skill

## Resources

- Agent development guide: `.agents/skills/agent-development/`
- Existing agents for reference: `.agents/subagents/`

## Notes

Keep agent focused on validation only. Don't try to auto-fix issues.
