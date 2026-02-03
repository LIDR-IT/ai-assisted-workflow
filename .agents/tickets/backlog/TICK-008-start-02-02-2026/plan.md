# Implementation Plan

## Overview

Create /validate-pr command that invokes pr-validator agent to check PR readiness.

## Tasks

- [ ] Create command file with frontmatter - Assigned to: developer
- [ ] Implement branch/ticket detection - Assigned to: developer
- [ ] Add agent invocation - Assigned to: developer
- [ ] Format output - Assigned to: developer
- [ ] Test and document - Assigned to: developer

## Technical Approach

**Command Structure:**

```yaml
---
description: "Validate PR readiness before creation. Usage: /validate-pr"
allowed-tools: [Read, Bash(git:*), Task]
model: sonnet
---
```

**Implementation:**

1. **Get Current Branch:**

```bash
branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null)
if [ $? -ne 0 ]; then
  echo "❌ Not in a git repository"
  exit 1
fi
```

2. **Extract TICK-ID:**

```bash
if [[ "$branch" =~ (TICK-[0-9]+) ]]; then
  ticket_id="${BASH_REMATCH[1]}"
else
  echo "❌ No TICK-ID found in branch: $branch"
  echo "Run /validate-pr from a feature branch (e.g., feature/TICK-123-description)"
  exit 1
fi
```

3. **Find Ticket Folder:**

```bash
ticket_folder=$(find ".agents/tickets/active" -maxdepth 1 -type d -name "${ticket_id}-start-*" 2>/dev/null | head -1)

if [ -z "$ticket_folder" ]; then
  # Check if in backlog
  backlog_folder=$(find ".agents/tickets/backlog" -maxdepth 1 -type d -name "${ticket_id}-start-*" 2>/dev/null | head -1)

  if [ -n "$backlog_folder" ]; then
    echo "❌ Ticket $ticket_id is in backlog/"
    echo "Move to active/ before validating PR:"
    echo "  mv $backlog_folder .agents/tickets/active/"
    exit 1
  fi

  echo "❌ Ticket $ticket_id not found in active/"
  exit 1
fi
```

4. **Invoke pr-validator Agent:**

````markdown
Use Task tool to invoke pr-validator agent:

```yaml
{
  "subagent_type": "pr-validator",
  "prompt": "Validate ticket at $ticket_folder for PR readiness",
  "description": "Validating PR readiness",
}
```
````

5. **Display Results:**

```markdown
The agent will return validation report. Display it to user with:

- Pass/fail status prominently
- List of issues (if any)
- Actionable next steps
- Exit code: 0 if pass, 1 if fail
```

**Output Examples:**

Success:

```
🔍 Validating PR for TICK-123...

✅ PR Validation Report

Acceptance Criteria: 5/5 ✓
Definition of Done: 7/7 ✓
Tests: Passing ✓
Documentation: Updated ✓
Commits: Valid format ✓
Linting: No errors ✓

---
RESULT: ✅ READY FOR PR

Your ticket is ready for pull request creation.
Next: gh pr create
```

Failure:

```
🔍 Validating PR for TICK-123...

❌ PR Validation Report

Acceptance Criteria: 3/5 ✗
  ticket.md:23 - Unchecked: API endpoint tested
  ticket.md:24 - Unchecked: Error handling verified

Definition of Done: 5/7 ✗
  ticket.md:45 - Tests not written
  ticket.md:46 - Documentation not updated

Tests: ✗ No test files found
Documentation: ✗ No changes detected

---
RESULT: ❌ NOT READY FOR PR

Fix these issues before creating PR:
1. Complete 2 remaining acceptance criteria
2. Write tests (src/**/*.test.ts)
3. Update documentation

Re-run /validate-pr after fixes.
```

**Error Cases:**

Not in repo:

```
❌ Not in a git repository

Make sure you're in the project root directory.
```

No TICK-ID:

```
❌ No TICK-ID found in branch: main

Run /validate-pr from a feature branch.
Example: git checkout -b feature/TICK-123-description
```

Ticket in backlog:

```
❌ Ticket TICK-123 is in backlog/

Move to active/ before validating PR:
  mv .agents/tickets/backlog/TICK-123-start-02-02-2026 .agents/tickets/active/
```

## Dependencies

- pr-validator agent (TICK-007)
- Git repository with branch
- Ticket in active/ folder

## Resources

- Command development guide: `.agents/skills/command-development/`
- Existing commands: `.agents/commands/`

## Notes

**Design Philosophy:**

- Simple interface (no arguments)
- Clear output (pass/fail obvious)
- Actionable feedback (tell user what to fix)
- Fast execution (< 10 seconds)
- Scriptable (exit codes for automation)

**Integration:**

- Pre-commit hook suggests running this command
- Works standalone or in CI/CD
- Output can be parsed by scripts
