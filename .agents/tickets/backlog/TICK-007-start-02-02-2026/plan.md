# Implementation Plan

## Overview

Create pr-validator agent that validates PR readiness by checking ticket criteria, DoD, tests, docs, and commits.

## Tasks

- [ ] Create agent file with frontmatter - Assigned to: developer
- [ ] Implement validation logic using skills - Assigned to: developer
- [ ] Add pass/fail report formatting - Assigned to: developer
- [ ] Test with existing tickets - Assigned to: developer
- [ ] Update documentation - Assigned to: developer

## Technical Approach

**Agent Structure:**

```yaml
---
name: pr-validator
description: Validates PR readiness before creation
tools: [Read, Grep, Glob, Bash, Skill]
skills: [ticket-validation]
color: red
---
```

**Validation Flow:**

1. Get current git branch name
2. Extract TICK-ID from branch (e.g., feature/TICK-123-description)
3. Find ticket folder in `active/` directory
4. Read ticket.md and plan.md
5. Use `ticket-validation` skill for patterns
6. Check acceptance criteria (all checked?)
7. Check DoD completeness (all items checked?)
8. Verify tests exist and pass (look for test files, run if configured)
9. Check documentation updated (README, API docs, related guides)
10. Validate commit messages (conventional format)
11. Check linting (if .eslintrc or similar exists)
12. Generate pass/fail report

**Validation Checks:**

1. **Acceptance Criteria:**
   - All checkboxes marked `[x]`
   - No vague criteria remaining
   - Specific and measurable

2. **Definition of Done:**
   - Standard items all checked
   - Tests checkbox checked
   - Documentation checkbox checked
   - Code review checkbox checked
   - No linting errors checkbox checked
   - Conventional commit checkbox checked
   - PR created checkbox (skip this one)

3. **Tests:**
   - Test files exist (search for `*.test.*`, `*.spec.*`)
   - Tests pass (run `npm test` or similar if configured)
   - Coverage acceptable (if configured)

4. **Documentation:**
   - README updated (check git diff)
   - API docs updated (if applicable)
   - Guides updated (if applicable)
   - Examples included (if new feature)

5. **Commits:**
   - Follow conventional format: `type(scope): message`
   - Types: feat, fix, docs, refactor, test, chore
   - Include TICK-ID in scope when applicable

6. **Linting:**
   - Run linter if configured (`.eslintrc`, `.prettierrc`, etc.)
   - No errors or warnings

**Output Format:**

```
✅ PR Validation Report for TICK-123

## Acceptance Criteria (5/5)
✓ All criteria checked off

## Definition of Done (7/7)
✓ All standard items complete

## Tests
✓ Test files found: src/__tests__/feature.test.ts
✓ Tests passing (12 tests, 0 failures)

## Documentation
✓ README.md updated
✓ API docs updated
⚠️  Missing: User guide example

## Commits (3)
✓ feat(TICK-123): add feature
✓ test(TICK-123): add tests
✗ fix typo (missing TICK-ID)

## Linting
✓ No errors

---
RESULT: ⚠️  PASS WITH WARNINGS
- Consider adding TICK-ID to commit "fix typo"
- Add user guide example to docs/guides/

Ready for PR creation? Minor issues can be addressed post-merge.
```

Or when blocking:

```
❌ PR Validation Report for TICK-123

## Acceptance Criteria (2/5) ❌
✗ ticket.md:23 - Criterion "API endpoint tested" unchecked
✗ ticket.md:24 - Criterion "Error handling verified" unchecked
✗ ticket.md:25 - Criterion "Documentation updated" unchecked

## Definition of Done (4/7) ❌
✗ ticket.md:45 - Tests not written
✗ ticket.md:46 - Documentation not updated

## Tests ❌
✗ No test files found
→ Create tests matching pattern: src/**/*.test.ts

## Documentation ❌
✗ No changes to README.md
✗ No changes to docs/
→ Update relevant documentation

---
RESULT: ❌ NOT READY FOR PR

Fix 3 acceptance criteria, write tests, update docs before creating PR.
```

## Dependencies

- ticket-validation skill (provides validation patterns)
- Ticket in active/ folder
- Git branch with TICK-ID

## Resources

- Agent development guide: `.agents/skills/agent-development/`
- Existing agents for reference: `.agents/subagents/`
- ticket-validation skill: `.agents/skills/ticket-validation/`

## Notes

**Validation Levels:**

- **PASS:** All checks green, ready for PR
- **PASS WITH WARNINGS:** Minor issues, can proceed
- **FAIL:** Blocking issues, must fix before PR

**Integration Points:**

- `/validate-pr` command invokes this agent
- Pre-commit hook asks user to run this agent
- Agent doesn't create PR, just validates readiness
