# Git Hooks Reference

This document describes the automated git hooks implemented in this project for workflow automation.

## Overview

The project uses Claude Code's hook system to automate critical workflow steps during git operations:

- **pre-commit**: Validates ticket workflow (existing)
- **post-merge**: Syncs configs and updates dependencies after pull/merge
- **pre-push**: Validates code quality and documentation before push

## Hook Architecture

### Configuration

**Location:** `.agents/hooks/hooks.json`

Hooks are configured using Claude Code's hook system with pattern matching on bash commands.

### Scripts

**Location:** `.agents/hooks/scripts/`

```
scripts/
├── lib/
│   └── progress.sh          # Shared progress utilities
├── validate-commit.sh       # Pre-commit validation
├── post-merge.sh           # Post-merge automation
└── pre-push.sh             # Pre-push validation
```

## Post-Merge Hook

**Triggers:** After `git pull` or `git merge`

**Purpose:** Automatically sync configurations, update dependencies, and clean up stale branches.

### Workflow

1. **Config Sync** (if `.agents/` changed)
   - Detects changes in `.agents/rules/`, `.agents/skills/`, `.agents/commands/`, or `.agents/mcp/`
   - Runs `.agents/sync-all.sh` automatically
   - Timeout: 120 seconds (2 minutes)

2. **Dependency Updates** (if package files changed)
   - Detects changes in `package.json` or `package-lock.json`
   - Runs `npm install` automatically
   - Timeout: 180 seconds (3 minutes)

3. **Stale Branch Cleanup**
   - Detects local branches deleted on remote
   - Prompts: "Delete all stale branches? (y/n)"
   - User confirms before deletion

### Example Output

```
────────────────────────────────────────
🔄 Running post-merge checks...
ℹ️  Checking for config changes in .agents/...
🔄 Config changes detected, running sync-all.sh...
✅ Configs synchronized
ℹ️  Checking for dependency changes...
🔄 Package files changed, updating dependencies...
✅ Dependencies updated
ℹ️  Checking for stale local branches...
⚠️  Found stale local branches:
  - feature/TICK-123
❓ Delete all stale branches? (y/n)
   > y
✅ Deleted: feature/TICK-123
────────────────────────────────────────
✅ Post-merge completed successfully
⏱️  Completed in 45s
────────────────────────────────────────
```

### Timeout Handling

- Sync operations: 120s timeout
- Dependency updates: 180s timeout
- On timeout: Shows error, suggests manual run

## Pre-Push Hook

**Triggers:** Before `git push`

**Purpose:** Validate code quality, documentation, and tests before pushing to remote.

### Workflow

1. **Manual Test Confirmation**
   - Prompts: "Did you run all tests? (y/n)"
   - If "n" → Blocks push with instructions
   - Timeout: 30 seconds (defaults to "n")

2. **Playwright MCP Integration** (optional)
   - Checks if Playwright MCP is configured
   - If available → Notes integration ready
   - Future: Automated E2E test execution

3. **Documentation Check**
   - Compares source changes vs doc changes
   - If source changed but not docs → Warns
   - Prompts: "Proceed with push? (y/n)"

4. **Linting Validation**
   - Runs `npm run lint` (if configured)
   - Blocks push on linting errors
   - Timeout: 60 seconds

5. **Security Scan** (optional)
   - Runs `npm audit` for vulnerabilities
   - Warns on high-severity issues
   - Doesn't block push (advisory only)

### Example Output (Success)

```
────────────────────────────────────────
🔄 Running pre-push validation...
🔄 Manual test confirmation required
❓ Did you run all tests? (y/n)
   > y
✅ Manual tests confirmed
ℹ️  Checking for Playwright MCP integration...
ℹ️  Playwright MCP not configured (optional)
ℹ️  Checking documentation updates...
✅ Documentation updates detected
ℹ️  Checking for linting errors...
🔄 Running linter...
✅ No linting errors
ℹ️  Running security scan...
✅ No high-severity vulnerabilities
────────────────────────────────────────
✅ All pre-push checks passed
ℹ️  Proceeding with push to remote...
⏱️  Completed in 15s
────────────────────────────────────────
```

### Example Output (Failure)

```
────────────────────────────────────────
🔄 Running pre-push validation...
🔄 Manual test confirmation required
❓ Did you run all tests? (y/n)
   > n
❌ Please run tests before pushing
ℹ️  Options:
ℹ️    - Run: npm test
ℹ️    - Use Playwright MCP for E2E tests
ℹ️    - Bypass: git push --no-verify (emergency only)
⚠️  Note: Automated test suite coming in TICK-005
────────────────────────────────────────
❌ Pre-push validation failed
ℹ️  Fix issues above or use --no-verify to bypass (emergency only)
⏱️  Completed in 5s
────────────────────────────────────────
```

### Bypass Hooks

Use `--no-verify` flag to bypass validation (emergency only):

```bash
git push --no-verify
```

**Warning:** Only use in emergencies. Bypassing hooks can lead to:
- Broken builds on remote
- Missing documentation
- Unvalidated code in main branch

## Progress Utilities

**Location:** `.agents/hooks/scripts/lib/progress.sh`

Shared utilities for consistent, colorful output across all hooks.

### Functions

| Function | Purpose | Example |
|----------|---------|---------|
| `log_info()` | Blue info messages | ℹ️  Checking for changes... |
| `log_success()` | Green success messages | ✅ All checks passed |
| `log_warning()` | Yellow warnings | ⚠️  Documentation unchanged |
| `log_error()` | Red errors | ❌ Tests failed |
| `log_step()` | Gray step indicators | 🔄 Running validation... |
| `log_separator()` | Visual separators | ──────────────── |
| `start_timer()` | Start timer | Begins timing |
| `end_timer()` | Show elapsed time | ⏱️  Completed in 45s |
| `prompt_with_timeout()` | Prompt with timeout | ❓ Proceed? (y/n) |

### Usage Example

```bash
#!/bin/bash

source "$(dirname "$0")/lib/progress.sh"

log_separator
log_step "Running my task..."
start_timer

if do_something; then
  log_success "Task completed"
else
  log_error "Task failed"
fi

end_timer
log_separator
```

## Configuration

### Timeouts

Configured in hooks.json:

- **post-merge**: 120 seconds (2 minutes)
- **pre-push**: 180 seconds (3 minutes)
- **pre-commit**: 30 seconds

### Pattern Matching

Hooks use regex patterns to detect specific git commands:

```json
{
  "pattern": "git (pull|merge)",  // Matches pull or merge
  "pattern": "git push"            // Matches push only
}
```

## Troubleshooting

See [Git Hooks Troubleshooting Guide](./git-hooks-troubleshooting.md)

## Related Documentation

- [Git Workflow Guidelines](./.agents/rules/process/git-workflow.md)
- [AI Workflow System](./.agents/rules/process/ai-workflow-system.md)
- [Hook Development Skill](./.agents/skills/hook-development/)
- [Sync Scripts](./.agents/sync-all.sh)

## Implementation

**Ticket:** TICK-003
**Branch:** feature/TICK-003-git-hooks
**Status:** ✅ Implemented
