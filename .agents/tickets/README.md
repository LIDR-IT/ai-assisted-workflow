# Ticket System

Code-resident ticket management with BDD patterns and automated validation.

## Overview

**Purpose:** Spec-driven development with tickets as single source of truth

**Architecture:** Code-resident tickets (no external provider dependency by default)

**Lifecycle:** `backlog → active → archived`

## Directory Structure

```
.agents/tickets/
├── README.md              # This file
├── templates/             # Ticket templates by type
│   ├── feature.md         # New feature template
│   ├── bug.md             # Bug fix template
│   ├── refactor.md        # Code refactoring template
│   └── docs.md            # Documentation template
├── backlog/               # Tickets not yet started (status: backlog|todo)
├── active/                # Tickets in progress (status: in-progress|review)
└── archived/              # Completed tickets (status: done|archived)
    ├── 2026-Q1/           # Organized by quarter
    ├── 2026-Q2/
    └── .gitkeep
```

## Ticket Lifecycle

### 1. Backlog
- **Status:** `backlog` or `todo`
- **Location:** `.agents/tickets/backlog/TICK-{id}.md`
- **Purpose:** Tickets awaiting prioritization or start
- **Transition:** Move to `active/` when work begins

### 2. Active
- **Status:** `in-progress` or `review`
- **Location:** `.agents/tickets/active/TICK-{id}.md`
- **Purpose:** Tickets being actively worked on
- **Branch:** Create branch `{type}/TICK-{id}-{description}`
- **Transition:** Move to `archived/` when PR merged

### 3. Archived
- **Status:** `done` or `archived`
- **Location:** `.agents/tickets/archived/{YYYY-QX}/TICK-{id}.md`
- **Purpose:** Completed work for historical reference
- **Organization:** Group by quarter for easy browsing

## YAML Metadata

### Required Fields

```yaml
---
id: TICK-001                           # Sequential ID, auto-assigned
title: Brief ticket title              # <80 chars, descriptive
status: backlog|todo|in-progress|review|done|archived
priority: critical|high|medium|low
assignee: department|person|agent      # Who owns this
type: feature|bug|refactor|docs        # Ticket category
provider: none|github|jira|notion|trello|linear  # External sync (optional)
external_link: null|URL                # Link if provider set
created_at: YYYY-MM-DD                 # ISO date
updated_at: YYYY-MM-DD                 # ISO date
---
```

### Field Definitions

**id:** Ticket identifier
- Format: `TICK-###` (sequential numbers)
- Auto-assigned by `/create-ticket` command
- Manual creation: Check highest ID in all directories

**status:** Workflow state
- `backlog`: Not prioritized yet
- `todo`: Prioritized, ready to start
- `in-progress`: Currently being worked on
- `review`: Implementation complete, awaiting review
- `done`: Merged and complete
- `archived`: Moved to historical archive

**priority:** Urgency/importance
- `critical`: Blocking issue, production down
- `high`: Important feature, affects many users
- `medium`: Standard work
- `low`: Nice-to-have, non-urgent

**type:** Work category
- `feature`: New functionality
- `bug`: Fix broken behavior
- `refactor`: Code improvement without behavior change
- `docs`: Documentation update

**provider:** External ticket system (optional)
- `none`: Default, code-resident only
- `github`: Sync with GitHub Issues
- `jira`: Sync with Jira tickets
- `notion`: Sync with Notion database
- `trello`: Sync with Trello cards
- `linear`: Sync with Linear issues

**external_link:** URL to external ticket (if provider != none)

## Ticket Sections

### Description
Detailed explanation of the work, context, scope, and impact.

### Acceptance Criteria
Specific, measurable conditions that must be met for ticket to be complete.

**Good criteria:**
- ✓ "User can login with email and password"
- ✓ "Page load time < 2 seconds"
- ✓ "All unit tests passing"

**Bad criteria:**
- ✗ "Improve performance" (vague)
- ✗ "Make it better" (unmeasurable)

### Definition of Done
Checklist of quality gates before ticket can be closed.

**Standard items (all tickets):**
- All acceptance criteria met
- Tests written and passing
- Documentation updated
- Code reviewed
- No linting errors
- Conventional commit created
- PR created with template

**Type-specific additions:**
- Feature: API reference updated, frontend validation
- Bug: Root cause identified, regression tests
- Refactor: No behavior change proven, performance measured
- Docs: Examples included, links verified

### BDD Scenarios
Gherkin-formatted scenarios for acceptance testing.

**Format:**
```gherkin
Feature: Feature name

  Scenario: Scenario name
    Given precondition
    When action
    Then expected outcome
```

**Purpose:**
- Clarify expected behavior
- Enable automated test generation
- Serve as living documentation

### Tasks
Breakdown of implementation work with assignments.

**Format:**
```markdown
- [ ] Task description - Assigned to: name
```

**Assignment patterns:**
- Developers: Implementation, design decisions
- Agents: Test generation, documentation, validation
- Specialists: Security review, performance optimization

### Notes
Implementation decisions, trade-offs, references.

## Creating Tickets

### Manual Method

```bash
# 1. Copy appropriate template
cp .agents/tickets/templates/feature.md .agents/tickets/backlog/TICK-123.md

# 2. Edit ticket
vim .agents/tickets/backlog/TICK-123.md
# - Update YAML fields (id, title, priority, assignee)
# - Fill in Description, Acceptance Criteria, DoD, BDD Scenarios
# - Add tasks if known

# 3. Optional: Enrich ticket
/enrich-ticket TICK-123

# 4. Create branch
git checkout -b feature/TICK-123-brief-description
```

### Automated Method (Recommended)

```bash
# Interactive ticket creation
/create-ticket feature

# Follow prompts:
# - Title?
# - Priority?
# - Assignee?

# Command creates:
# - Ticket file in backlog/ with next TICK-ID
# - Git branch with proper naming
# - Pre-filled template with your inputs
```

## Branch Naming Convention

### Pattern

```
{type}/{TICK-id}-{brief-description}
```

### Rules

- **type:** Must match ticket type (feature, fix, refactor, docs)
- **TICK-id:** Exact ticket ID (e.g., TICK-123)
- **description:** Kebab-case, 2-5 words, descriptive
- **Total:** <50 characters

### Examples

```bash
feature/TICK-123-add-user-authentication
fix/TICK-456-memory-leak-dashboard
refactor/TICK-789-extract-validation
docs/TICK-101-api-reference-guide
```

## BDD/Gherkin Best Practices

### Gherkin Syntax

```gherkin
Feature: High-level feature description

  Background: Common setup for all scenarios (optional)
    Given common precondition

  Scenario: Specific test case
    Given precondition(s)
    And additional precondition
    When user action
    And additional action
    Then expected outcome
    And additional outcome
    But not this outcome

  Scenario Outline: Parameterized test (optional)
    Given a user with "<role>"
    When they access "<resource>"
    Then they see "<result>"

    Examples:
      | role  | resource | result     |
      | admin | settings | full_access|
      | user  | settings | denied     |
```

### Keywords

- **Feature:** High-level description
- **Background:** Common setup (optional)
- **Scenario:** Specific test case
- **Scenario Outline:** Parameterized test
- **Given:** Precondition(s)
- **When:** Action(s)
- **Then:** Expected outcome(s)
- **And/But:** Additional conditions/outcomes

### Writing Effective Scenarios

**Good scenarios:**
```gherkin
Scenario: User logs in with valid credentials
  Given a registered user with email "user@example.com"
  And the password is "SecurePass123"
  When the user submits the login form
  Then the user receives a JWT token
  And the user is redirected to dashboard
```

**Bad scenarios:**
```gherkin
Scenario: Login works
  Given user exists
  When login
  Then success
```

**Why bad:**
- Too vague (which user? what credentials?)
- No specific actions (how to login?)
- Unclear outcome (success = what?)

### Scenario Completeness

**Every scenario must have:**
- ✓ Given (setup)
- ✓ When (action)
- ✓ Then (outcome)
- ✓ Concrete values (not "some user", use "user@example.com")
- ✓ Observable outcomes (not "works", use "receives JWT token")

## Git Workflow Integration

### Creating Ticket and Branch

```bash
# 1. Create ticket
/create-ticket feature

# 2. Enrich ticket (validate completeness)
/enrich-ticket TICK-123

# 3. Move to active when starting work
mv .agents/tickets/backlog/TICK-123.md .agents/tickets/active/

# 4. Update ticket status
# Edit TICK-123.md YAML: status: in-progress

# 5. Branch already created by /create-ticket
git checkout feature/TICK-123-description
```

### During Implementation

```bash
# Commit with ticket reference
git commit -m "feat(TICK-123): implement user authentication"

# Update ticket with progress
# Edit .agents/tickets/active/TICK-123.md
# - Check off completed tasks
# - Add implementation notes
```

### Before Creating PR

```bash
# Validate ticket completeness
/validate-pr

# Fix any issues reported
# Then create PR
gh pr create --title "feat(TICK-123): Add user authentication"
```

### After PR Merged

```bash
# Archive ticket
mkdir -p .agents/tickets/archived/2026-Q1
mv .agents/tickets/active/TICK-123.md .agents/tickets/archived/2026-Q1/

# Update status in archived ticket
# Edit YAML: status: done

# Delete branch
git branch -d feature/TICK-123-description
```

## Commands Reference

### /create-ticket

Create new ticket interactively.

```bash
/create-ticket [type]

# Examples:
/create-ticket feature     # Create feature ticket
/create-ticket bug         # Create bug ticket
/create-ticket            # Prompt for type
```

### /enrich-ticket

Validate and improve ticket completeness.

```bash
/enrich-ticket TICK-{id}

# Example:
/enrich-ticket TICK-123
```

### /validate-pr

Check PR readiness before creation.

```bash
/validate-pr

# Validates current branch ticket
# Checks: acceptance criteria, DoD, tests, docs
```

## Validation with Agents

### ticket-enricher Agent

**Purpose:** Validates ticket completeness

**Checks:**
- YAML frontmatter complete
- Acceptance criteria specific
- Definition of Done includes all items
- BDD scenarios concrete and testable
- Tasks assigned

**Usage:**
```bash
/enrich-ticket TICK-123
```

**Output:** Validation report with issues and suggestions

### pr-validator Agent

**Purpose:** Checks PR readiness

**Checks:**
- All acceptance criteria met
- Definition of Done complete
- Tests written and passing
- Documentation updated
- No linting errors
- Conventional commits

**Usage:**
```bash
/validate-pr
```

**Output:** Pass/fail report with specific file references

## Pre-Commit Hook

**Hook:** Validates on `git commit`

**Behavior:**
- If branch has TICK-ID: Ask user to run /validate-pr
- If ticket not found: Deny commit (create ticket first)
- If no TICK-ID: Allow commit (no validation)

**Configuration:** `.agents/hooks/hooks.json`

## Examples

### Complete Feature Ticket

See `.agents/tickets/templates/feature.md` for complete example with:
- Proper YAML frontmatter
- Detailed description
- Specific acceptance criteria
- Complete Definition of Done
- Multiple BDD scenarios
- Task breakdown with assignments
- Implementation notes

### Bug Fix Workflow

```bash
# 1. Create bug ticket
/create-ticket bug

# 2. Fill in reproduction steps, expected/actual behavior

# 3. Enrich and validate
/enrich-ticket TICK-456

# 4. Implement fix

# 5. Verify before PR
/validate-pr

# 6. Commit with reference
git commit -m "fix(TICK-456): resolve memory leak in dashboard"

# 7. Create PR and merge

# 8. Archive ticket
mv .agents/tickets/active/TICK-456.md .agents/tickets/archived/2026-Q1/
```

## References

- Workflow System: `.agents/rules/process/ai-workflow-system.md`
- Git Workflow: `.agents/rules/process/git-workflow.md`
- ticket-validation skill: `.agents/skills/ticket-validation/`
- bdd-gherkin-patterns skill: `.agents/skills/bdd-gherkin-patterns/`
