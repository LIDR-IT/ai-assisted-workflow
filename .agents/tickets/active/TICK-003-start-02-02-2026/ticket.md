---
id: TICK-003
title: Add post-merge and pre-push git hooks for automation
status: in-progress
priority: high
assignee: development-team
type: feature
provider: none
external_link: null
created_at: 2026-02-02 14:30
updated_at: 2026-02-02 23:20
---

# Add Post-Merge and Pre-Push Git Hooks

## Description

Implement post-merge and pre-push git hooks to automate sync operations, dependency updates, comprehensive validation, and cleanup tasks.

**Context:** Currently only pre-commit hook exists. Adding post-merge and pre-push hooks will automate critical workflow steps: syncing configs after merges, running full validation before pushing to remote, and cleaning up after branch operations.

**Scope:**

- Included: post-merge hook (sync, deps, cleanup), pre-push hook (manual test checklist, Playwright MCP integration, docs, linting, security)
- Excluded: Platform-specific hooks, automated test suite integration (pending stack definition - see TICK-005)

**Testing Strategy (Current Phase):**

- Manual testing with developer confirmation
- Playwright MCP integration for E2E tests (when available)
- Future: Automated test suite (stack TBD - Jest/Vitest/other)

**Impact:** Reduces manual sync operations by 90%, catches issues before they reach remote (saving CI/CD resources), ensures team always has latest configs after pulling changes.

## Acceptance Criteria

- [ ] post-merge hook automatically runs sync-all.sh after merge/pull
- [ ] post-merge hook updates dependencies if package files changed
- [ ] post-merge hook cleans up stale branches and archived tickets
- [ ] pre-push hook prompts for manual test confirmation ("Did you run tests? y/n")
- [ ] pre-push hook integrates with Playwright MCP (if configured) for E2E validation
- [ ] pre-push hook validates documentation is updated
- [ ] pre-push hook checks no linting errors exist
- [ ] pre-push hook runs security scan (if tools configured)
- [ ] Both hooks have timeout limits (post-merge: 2min, pre-push: 3min)
- [ ] Both hooks provide clear progress messages
- [ ] Both hooks can be bypassed with --no-verify if needed
- [ ] pre-push hook includes note about future automated testing (TICK-005)

## Definition of Done

**Standard checklist:**

- [ ] All acceptance criteria met
- [ ] Tests written and passing (unit, integration, e2e as needed)
- [ ] Documentation updated (README, API reference, guides)
- [ ] Code reviewed and approved
- [ ] No linting errors or warnings
- [ ] Conventional commit created with TICK-ID
- [ ] PR created with proper template

**Feature-specific:**

- [ ] API reference updated (if backend changes)
- [ ] Frontend validation complete (if UI changes)
- [ ] Hooks tested on all 4 platforms (Cursor, Claude, Gemini, Antigravity)

## BDD Scenarios

```gherkin
Feature: Post-Merge Hook Automation

  Scenario: Developer pulls changes with new configs
    Given remote branch has new rules in .agents/rules/
    When developer runs "git pull origin main"
    Then post-merge hook detects changes
    And sync-all.sh runs automatically
    And new rules appear in all platform directories
    And developer sees "✅ Configs synchronized" message

  Scenario: Dependencies updated in remote
    Given remote has updated package.json
    When developer merges changes
    Then post-merge hook detects package file changes
    And npm install runs automatically
    And developer sees "✅ Dependencies updated" message

  Scenario: Cleanup stale branches after merge
    Given local branch merged and deleted remotely
    When developer pulls changes
    Then post-merge hook detects stale local branch
    And prompts "Delete local branch feature/TICK-123? (y/n)"
    And deletes if user confirms

Feature: Pre-Push Hook Validation

  Scenario: All checks pass before push
    Given developer ran manual tests successfully
    And documentation updated
    And no linting errors
    When developer runs "git push origin main"
    Then pre-push hook prompts "Did you run all tests? (y/n)"
    And developer confirms "y"
    And hook runs linting and doc validation
    And all checks pass
    And push proceeds to remote
    And developer sees "✅ All pre-push checks passed"

  Scenario: Manual test confirmation declined
    Given developer did not run tests yet
    When developer runs "git push"
    Then pre-push hook prompts "Did you run all tests? (y/n)"
    And developer answers "n"
    And hook blocks push
    And shows "❌ Please run tests before pushing (manual or Playwright MCP)"
    And suggests "Run: npm test  OR  use Playwright MCP for E2E"

  Scenario: Documentation not updated
    Given code changes in src/ but no doc changes
    And ticket requires docs update in DoD
    When developer runs "git push"
    Then pre-push hook detects missing docs
    And shows "⚠️  Documentation appears unchanged - verify DoD"
    And asks "Proceed with push? (y/n)"

  Scenario: Bypass hooks with flag
    Given developer needs to push urgently
    When developer runs "git push --no-verify"
    Then pre-push hook is skipped
    And push proceeds immediately
    And developer sees "⚠️  Pre-push checks skipped"
```

## Tasks

- [ ] Design hook architecture and configuration - Assigned to: tech-lead
- [ ] Implement post-merge.sh script - Assigned to: development-team
- [ ] Implement pre-push.sh script - Assigned to: development-team
- [ ] Update hooks.json with new hooks - Assigned to: development-team
- [ ] Add timeout handling for long operations - Assigned to: development-team
- [ ] Write progress message formatter - Assigned to: development-team
- [ ] Write hook documentation - Assigned to: doc-improver agent
- [ ] Create troubleshooting guide for hooks - Assigned to: development-team

## Notes

**Decision log:**

- Decision 1: Use bash scripts (not node/python) for maximum compatibility
- Decision 2: Make hooks informative (show progress) not silent
- Decision 3: Allow --no-verify bypass for emergency situations
- Decision 4: post-merge runs sync-all.sh (not individual syncs) for consistency
- Decision 5: Manual test confirmation + Playwright MCP (not automated suite yet - stack TBD in TICK-005)

**Trade-offs:**

- Comprehensive checks vs speed: Pre-push takes 2-5 min but catches issues early (saves CI/CD time)
- Automatic vs prompted: post-merge cleanup prompts user (safer than auto-delete)

**References:**

- Existing pre-commit hook: `.agents/hooks/scripts/validate-commit.sh`
- Hooks configuration: `.agents/hooks/hooks.json`
- Sync scripts: `.agents/sync-all.sh`
- Git workflow: `.agents/rules/process/git-workflow.md`

**Hook Configuration Structure:**

```json
{
  "hooks": {
    "PreToolUse": [...],  // Existing pre-commit
    "PostToolUse": [      // New post-merge
      {
        "matcher": "Bash",
        "pattern": "git (pull|merge)",
        "hook": {
          "type": "command",
          "command": "bash ${CLAUDE_PLUGIN_ROOT}/hooks/scripts/post-merge.sh",
          "timeout": 120000
        }
      }
    ]
  }
}
```

**Performance Targets:**

- post-merge: <2 minutes (sync + deps if needed)
- pre-push: <3 minutes (manual test prompt + Playwright MCP + linting + docs check)
