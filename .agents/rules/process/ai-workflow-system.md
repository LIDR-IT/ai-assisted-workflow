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

Review these files for workflow compliance: $ARGUMENTS

Read files, check against workflow stages and ticket structure below. Output concise findings.

## Workflow Overview

**Spec-driven development lifecycle:**

```
Create → Enrich → Plan → Implement → Validate → Hook Check → Commit → PR → Archive
```

Each ticket progresses through stages with automated validation at key points.

## Workflow Stages

### 1. Ticket Creation

**Trigger:** User needs to implement feature, fix bug, refactor code, or update docs

**Action:** Create ticket from template

**Methods:**
- Manual: Copy template from `.agents/tickets/templates/{type}.md` to `.agents/tickets/backlog/TICK-{id}.md`
- Automated: `/create-ticket [type]` command (interactive)

**Output:** Ticket file in backlog/ with TICK-ID assigned

**Branch creation:** `git checkout -b {type}/TICK-{id}-{brief-description}`

**Examples:**
```bash
# Feature branch
feature/TICK-123-add-user-authentication

# Bug branch
fix/TICK-456-memory-leak-dashboard

# Refactor branch
refactor/TICK-789-extract-validation-logic

# Docs branch
docs/TICK-101-api-reference-guide
```

### 2. Ticket Enrichment

**Trigger:** Ticket created but incomplete (missing criteria, vague descriptions)

**Action:** Run ticket-enricher agent

**Methods:**
- Automated: `/enrich-ticket TICK-{id}` command
- Manual: Invoke ticket-enricher agent directly

**Validation checks:**
- YAML frontmatter complete (all required fields)
- Acceptance criteria specific and measurable
- Definition of Done includes all standard items
- BDD scenarios concrete and testable
- Tasks assigned to specific agents or developers

**Output:** Validation report with issues and suggestions

**Resolution:** User reviews suggestions and updates ticket

### 3. Planning

**Trigger:** Ticket enriched and validated

**Action:** Break ticket into implementation tasks

**Considerations:**
- Which agents handle which tasks
- Task dependencies and order
- Estimated complexity
- Required tools and permissions

**Output:** Tasks section updated with assignments

**Example:**
```markdown
## Tasks
- [ ] Design authentication schema - Assigned to: developer
- [ ] Implement JWT service - Assigned to: developer
- [ ] Write unit tests - Assigned to: test-runner agent
- [ ] Update API documentation - Assigned to: doc-improver agent
- [ ] Security review - Assigned to: security-reviewer
```

### 4. Implementation

**Trigger:** Tasks defined and ready to execute

**Action:** Developers and agents complete assigned tasks

**Status tracking:**
- Move ticket from `backlog/` to `active/` when work starts
- Update ticket YAML: `status: in-progress`
- Check off tasks as completed
- Document decisions in Notes section

**Best practices:**
- Commit frequently with conventional commits
- Reference ticket ID in commit messages: `feat(TICK-123): add user auth`
- Update ticket with implementation notes
- Run tests continuously

### 5. PR Validation

**Trigger:** All tasks complete, ready to create PR

**Action:** Run pr-validator agent

**Methods:**
- Automated: `/validate-pr` command (before PR creation)
- Pre-commit hook: Validates on `git commit` if branch has TICK-ID

**Validation checks:**
- ✓ All acceptance criteria met
- ✓ Definition of Done complete
- ✓ Tests written and passing
- ✓ Documentation updated
- ✓ No linting errors
- ✓ Conventional commit messages
- ✓ Branch naming follows pattern

**Output:** Pass/fail report with specific issues

**Resolution:** Fix issues before creating PR

### 6. Hook Check

**Trigger:** Developer runs `git commit`

**Action:** Pre-commit hook validates readiness

**Logic:**
```bash
if branch contains TICK-ID:
  if ticket not found:
    DENY commit (create ticket first)
  else:
    ASK user to run /validate-pr
    if validation passes:
      ALLOW commit
    else:
      DENY commit (show issues)
else:
  ALLOW commit (no ticket reference)
```

**Benefits:**
- Prevents incomplete work from being committed
- Enforces Definition of Done
- Catches issues before code review

### 7. Commit

**Trigger:** Hook check passes, validation complete

**Action:** Create conventional commit

**Format:**
```
type(TICK-id): Brief description

Detailed explanation if needed.

- Implementation detail 1
- Implementation detail 2

Refs: #123
Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

**Types:** feat, fix, refactor, docs, test, chore, perf, style

**Examples:**
```bash
feat(TICK-123): add JWT authentication service

Implement token generation, validation, and refresh logic.

- Uses bcrypt for password hashing
- 15-minute access token expiry
- 7-day refresh token expiry
- Redis session storage

Refs: #123
Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

### 8. Pull Request

**Trigger:** Commits pushed to remote branch

**Action:** Create PR with proper template

**PR requirements:**
- Title matches ticket: `feat(TICK-123): Add user authentication`
- Description links to ticket
- All DoD checkboxes marked
- Acceptance criteria listed
- Test results included

**Review process:**
- Code review by team members
- Automated checks (CI/CD)
- Security scan
- Performance validation

### 9. Archive

**Trigger:** PR merged to main branch

**Action:** Move ticket to archived/

**Steps:**
```bash
# Move ticket file
mv .agents/tickets/active/TICK-123.md .agents/tickets/archived/2026-Q1/TICK-123.md

# Update ticket YAML
status: done
updated_at: 2026-02-15

# Delete branch
git branch -d feature/TICK-123-add-user-auth
```

**Archive structure:**
```
.agents/tickets/archived/
├── 2026-Q1/
│   ├── TICK-001.md
│   ├── TICK-002.md
│   └── TICK-003.md
└── 2026-Q2/
    └── TICK-004.md
```

## Ticket Structure

### YAML Frontmatter

**Required fields:**

```yaml
---
id: TICK-001                           # Auto-generated sequential ID
title: Brief ticket title              # <80 chars, specific
status: backlog|todo|in-progress|review|done|archived
priority: critical|high|medium|low
assignee: department|person|agent-name # Who owns this ticket
type: feature|bug|refactor|docs       # Ticket category
provider: none|github|jira|notion|trello|linear  # External sync (optional)
external_link: null|URL                # Link to external ticket (if provider set)
created_at: YYYY-MM-DD                 # ISO date format
updated_at: YYYY-MM-DD                 # ISO date format
---
```

**Field validation:**
- `id`: Must match TICK-### pattern
- `status`: Enum (backlog, todo, in-progress, review, done, archived)
- `priority`: Enum (critical, high, medium, low)
- `type`: Matches template (feature, bug, refactor, docs)
- `provider`: Default "none", optional external provider
- Dates: ISO 8601 format (YYYY-MM-DD)

### Markdown Sections

#### Description
```markdown
## Description

[Detailed description of the work]

**Context:** Why this work is needed
**Scope:** What is included/excluded
**Impact:** Who benefits and how
```

#### Acceptance Criteria
```markdown
## Acceptance Criteria

- [ ] Criterion 1: Specific, measurable outcome
- [ ] Criterion 2: Observable behavior or result
- [ ] Criterion 3: Testable condition

**Anti-patterns:**
- ✗ "Improve performance" (vague)
- ✗ "Make it better" (unmeasurable)
- ✓ "Page load time < 2 seconds" (specific)
- ✓ "All unit tests passing" (measurable)
```

#### Definition of Done
```markdown
## Definition of Done

**Standard checklist (all tickets):**
- [ ] All acceptance criteria met
- [ ] Tests written and passing (unit, integration, e2e as needed)
- [ ] Documentation updated (README, API reference, guides)
- [ ] Code reviewed and approved
- [ ] No linting errors or warnings
- [ ] Conventional commit created with TICK-ID
- [ ] PR created with proper template

**Type-specific additions:**

**Feature tickets add:**
- [ ] API reference updated (if backend changes)
- [ ] Frontend validation complete (if UI changes)

**Bug tickets add:**
- [ ] Root cause identified and documented
- [ ] Tests prevent regression

**Refactor tickets add:**
- [ ] No behavior change (tests prove equivalence)
- [ ] Performance measured (before/after)

**Docs tickets add:**
- [ ] Examples included and tested
- [ ] Links verified (no 404s)
```

#### BDD Scenarios
```markdown
## BDD Scenarios

\```gherkin
Feature: User Authentication

  Scenario: Successful login with valid credentials
    Given a registered user with email "user@example.com"
    And the user password is "SecurePass123"
    When the user submits login form
    Then the user receives a JWT access token
    And the user is redirected to dashboard

  Scenario: Failed login with invalid password
    Given a registered user with email "user@example.com"
    And the user enters incorrect password
    When the user submits login form
    Then the user sees error message "Invalid credentials"
    And no token is issued
\```

**Gherkin syntax:**
- Feature: High-level description
- Scenario: Specific test case
- Given: Preconditions
- When: Action
- Then: Expected outcome
- And: Additional conditions/outcomes
```

#### Tasks
```markdown
## Tasks

- [ ] Task 1 - Assigned to: agent-name or developer-name
- [ ] Task 2 - Assigned to: agent-name or developer-name
- [ ] Task 3 - Assigned to: agent-name or developer-name

**Task assignment patterns:**
- Backend implementation: Developers
- Test generation: test-runner agent
- Documentation: doc-improver agent
- Code review: Security/performance specialists
```

#### Notes
```markdown
## Notes

[Implementation notes, decisions, trade-offs]

**Decision log:**
- Chose JWT over sessions for scalability
- Using Redis for token blacklist
- Access tokens expire after 15 minutes

**Trade-offs:**
- Faster auth vs higher Redis memory usage
- Accepted: Memory cost for better UX

**References:**
- OAuth 2.0 spec: https://...
- Security best practices: .agents/rules/team/security.md
```

## Branch Naming

### Pattern

```
{type}/{TICK-id}-{brief-description}
```

### Rules

- `type`: Must match ticket type (feature, fix, refactor, docs)
- `TICK-id`: Must match ticket YAML `id` field exactly
- `brief-description`: Kebab-case, 2-5 words, descriptive
- Total length: <50 characters

### Examples

**Good:**
```bash
feature/TICK-123-add-user-auth
fix/TICK-456-memory-leak
refactor/TICK-789-extract-validators
docs/TICK-101-api-guide
```

**Bad:**
```bash
TICK-123                      # Missing type and description
feature/add-authentication     # Missing TICK-ID
feature/TICK-123-add-user-authentication-with-jwt-and-oauth  # Too long
my-branch                      # No TICK-ID reference
```

## Agent Coordination

### ticket-enricher Agent

**Purpose:** Validates ticket completeness and quality

**Invocation:**
- Command: `/enrich-ticket TICK-123`
- Direct: "Enrich ticket TICK-123"

**Validation process:**
1. Load `ticket-validation` skill for patterns
2. Parse ticket YAML and markdown
3. Check YAML structure (all required fields)
4. Validate acceptance criteria specificity
5. Review Definition of Done completeness
6. Analyze BDD scenarios using `bdd-gherkin-patterns` skill
7. Generate report with issues and suggestions
8. Ask for approval before applying changes

**Output format:**
```text
## .agents/tickets/backlog/TICK-123.md

TICK-123:12 - Missing acceptance criterion for error handling
TICK-123:23 - Definition of Done incomplete (tests section empty)
TICK-123:34 - BDD scenario lacks "Then" clause
TICK-123:45 - Vague criterion: "improve performance" → specify metric

✓ YAML frontmatter valid
✓ Assignee specified
✗ Ready for implementation: NO (4 issues to address)

**Suggested improvements:**
1. Add acceptance criterion: "Display error message for invalid input"
2. Add DoD item: "Unit tests cover happy path and error cases"
3. Complete BDD scenario with: "Then user sees error message 'Invalid input'"
4. Replace vague criterion with: "Page load time < 2 seconds"

Apply these changes? (yes/no)
```

### pr-validator Agent

**Purpose:** Checks PR readiness before creation

**Invocation:**
- Command: `/validate-pr`
- Pre-commit hook: Automatic on `git commit`
- Direct: "Validate this PR"

**Validation process:**
1. Load `ticket-validation` skill
2. Extract TICK-ID from current branch name
3. Load ticket from `.agents/tickets/active/TICK-{id}.md`
4. Check all acceptance criteria marked complete
5. Verify Definition of Done checkboxes
6. Run tests (if configured)
7. Check documentation updated
8. Validate commit messages (conventional format)
9. Run linters and security checks
10. Generate pass/fail report

**Output format:**
```text
## PR Validation Report: feature/TICK-123-add-user-auth

**Acceptance Criteria:** ✓ PASS
- ✓ JWT tokens generated correctly
- ✓ Token validation working
- ✓ Refresh token logic implemented

**Definition of Done:** ✗ FAIL (2 issues)
- ✓ All acceptance criteria met
- ✗ Tests written and passing (0 tests found)
- ✗ Documentation updated (README unchanged since 2026-01-15)
- ✓ Code reviewed and approved
- ✓ No linting errors
- ✓ Conventional commit created

**Files requiring attention:**
- README.md:45 - Add authentication section
- tests/ - Create tests for auth service

**Recommendation:** Fix issues before creating PR

**Blocking issues:**
1. No tests found for authentication service
2. Documentation not updated

**Non-blocking warnings:**
- Consider adding rate limiting to auth endpoint
```

## Pre-Commit Hook Integration

### Hook Configuration

**File:** `.agents/hooks/hooks.json`

```json
{
  "description": "Pre-commit validation hooks for ticket workflow",
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "bash ${CLAUDE_PLUGIN_ROOT}/hooks/scripts/validate-commit.sh",
            "timeout": 30
          }
        ]
      }
    ]
  }
}
```

### Hook Behavior

**Trigger:** Before any Bash command (including `git commit`)

**Logic:**
1. Check if command is `git commit`
2. If not commit: ALLOW immediately
3. If commit: Extract TICK-ID from branch name
4. If no TICK-ID: ALLOW with note
5. If TICK-ID found:
   - Check ticket exists in active/ or backlog/
   - If not found: DENY (create ticket first)
   - If found: ASK user to run /validate-pr
6. If validation passes: ALLOW commit
7. If validation fails: DENY with issues

**Permissions:**
- `allow`: Commit proceeds without prompt
- `ask`: Prompt user for confirmation
- `deny`: Block commit with error message

**Example outputs:**
```bash
# No ticket in branch
✅ No ticket reference in branch. Commit allowed.

# Ticket branch, validation pending
⚠️  Branch feature/TICK-123-add-auth has ticket TICK-123.
   Before committing, run /validate-pr to ensure all criteria are met.
   Proceed with commit?

# Ticket not found
❌ Ticket TICK-123 not found in active/ or backlog/.
   Create ticket first with /create-ticket.
```

## Output Format

Group findings by file. Use `file:line` format (VS Code clickable). Terse findings.

```text
## .agents/tickets/active/TICK-123.md

TICK-123:12 - Missing acceptance criterion for error handling
TICK-123:23 - Definition of Done incomplete (tests section empty)
TICK-123:34 - BDD scenario lacks "Then" clause
TICK-123:45 - Vague criterion: "improve" → specify outcome

✓ YAML frontmatter valid
✓ Branch naming compliant: feature/TICK-123-add-auth
✗ Ready for PR: NO (4 issues)

## .agents/tickets/backlog/TICK-456.md

✓ All validations pass
✓ Ready to move to active/ when work starts
```

State issue + location. Skip explanation unless fix non-obvious. No preamble.

## Anti-Patterns

**Flag these issues:**
- YAML field missing (id, title, status, priority, assignee, type)
- Status invalid (not enum value)
- Branch name doesn't match pattern (missing TICK-ID, wrong type)
- Acceptance criteria vague ("better", "improved", "faster")
- Definition of Done missing standard items
- BDD scenario incomplete (no Given/When/Then)
- Tasks unassigned (no "Assigned to:")
- Commit message doesn't reference TICK-ID
- External provider set but no external_link
- Ticket in backlog/ but branch created (should be in active/)
- Multiple tickets for same branch
- Ticket archived but branch still exists

## References

- Product Mission: `.agents/rules/product/mission.md`
- Roadmap: `.agents/rules/product/roadmap.md`
- Git Workflow: `.agents/rules/process/git-workflow.md`
- Testing Standards: `.agents/rules/quality/testing.md`
- ticket-validation skill: `.agents/skills/ticket-validation/SKILL.md`
- bdd-gherkin-patterns skill: `.agents/skills/bdd-gherkin-patterns/SKILL.md`
