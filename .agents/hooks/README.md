# Git Hooks System

Automated git workflow validation and automation hooks for the LIDR AI Workflow System.

## Overview

Three hooks automate workflow at key git operations:

1. **pre-commit** (`validate-commit.sh`) - Validates ticket exists before commit
2. **post-merge** (`post-merge.sh`) - Syncs configs and deps after pull/merge
3. **pre-push** (`pre-push.sh`) - Validates before push (tests, docs, linting)

## Hook Types

### Claude Hooks (Automatic)

Configured in `hooks.json` and run automatically by Claude Code:

- **pre-commit** (PreToolUse): Runs before `git commit`
- **post-merge** (PostToolUse): Runs after `git pull` or `git merge`

### Git Native Hooks (Manual Setup)

**pre-push** hook requires manual setup:

```bash
# Run setup script (recommended)
./setup-hooks.sh

# Or manual copy
cp .agents/hooks/scripts/pre-push.sh .git/hooks/pre-push
chmod +x .git/hooks/pre-push
```

## Pre-Commit Hook

**Trigger:** Before `git commit`

**Purpose:** Validates ticket workflow

**Checks:**
- Extract TICK-ID from branch name (e.g., `feature/TICK-123-description`)
- Check if ticket exists in `active/` or `backlog/`
- Ask user to run `/validate-pr` if ticket found

**Behavior:**
- **No TICK-ID in branch:** ALLOW (no ticket required)
- **TICK-ID found, ticket exists:** ASK user to validate
- **TICK-ID found, ticket not found:** DENY (create ticket first)

**Bypass:** `git commit --no-verify`

## Post-Merge Hook

**Trigger:** After `git pull` or `git merge`

**Purpose:** Automate sync and cleanup

**Actions:**
1. **Config Sync:** If `.agents/` changed, run `sync-all.sh`
2. **Dependency Update:** If package files changed, run `npm install`
3. **Branch Cleanup:** Prompt to delete stale local branches

**Performance:** <2 minutes (typical: 10-30 seconds)

**Example Output:**
```
🔄 Post-merge hook running...

📦 Detected changes in .agents/ directory
   Running sync-all.sh...
   ✅ Configs synchronized across all platforms

📦 Detected package file changes
   Updating dependencies...
   ✅ Dependencies updated

🧹 Checking for stale branches...
   ✅ No stale branches found

✅ Post-merge hook completed
```

## Pre-Push Hook

**Trigger:** Before `git push`

**Purpose:** Comprehensive validation before code reaches remote

**Checks:**
1. **Manual Test Confirmation** - Prompt user to confirm tests run
2. **Playwright MCP E2E** - Run E2E tests if Playwright configured
3. **Documentation Validation** - Check docs updated if code changed
4. **Linting Check** - Run linter if configured
5. **Security Scan** - Run `npm audit` if available

**Performance:** <3 minutes

**Example Output:**
```
🚀 Pre-push validation running...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Manual Testing Confirmation
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Did you run all relevant tests? (y/n) y
✅ Testing confirmed

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎭 Playwright MCP E2E Tests
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Playwright detected - E2E tests available
Run Playwright E2E tests now? (y/n) y
✅ Playwright tests passed

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 Documentation Validation
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Documentation updated

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 Linting Check
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Running linter...
✅ No linting errors

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔒 Security Scan
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Running npm audit...
✅ No high-severity vulnerabilities

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ All pre-push validations passed

Pushing to remote...
```

**Bypass:** `git push --no-verify` (not recommended)

## Setup

### Automatic (Claude Hooks)

Pre-commit and post-merge hooks work automatically if using Claude Code. No setup required.

### Manual (Pre-Push Hook)

Run the setup script:

```bash
cd .agents/hooks
./setup-hooks.sh
```

Or manual setup:

```bash
# Copy script to git hooks directory
cp .agents/hooks/scripts/pre-push.sh .git/hooks/pre-push

# Make executable
chmod +x .git/hooks/pre-push

# Test
git push --dry-run
```

### Verify Installation

```bash
# Check Claude hooks
cat .agents/hooks/hooks.json

# Check pre-push hook
ls -la .git/hooks/pre-push
```

## Testing Strategy

**Current (Q1 2026):** Manual testing + Playwright MCP

- Pre-push hook prompts for manual test confirmation
- Playwright MCP integration for E2E tests (optional)
- No automated test suite required yet

**Future (TICK-005):** Automated testing stack

- Jest/Vitest unit + integration tests
- Automated E2E with Playwright
- CI/CD pipeline integration
- Pre-push hook runs `npm test` automatically

## Troubleshooting

### Hook Not Running

**Claude hooks (pre-commit, post-merge):**
```bash
# Verify hooks.json is valid
jq empty .agents/hooks/hooks.json

# Restart Claude Code
```

**Pre-push hook:**
```bash
# Check if installed
ls -la .git/hooks/pre-push

# Re-run setup
./setup-hooks.sh

# Check permissions
chmod +x .git/hooks/pre-push
```

### Hook Taking Too Long

**Post-merge:**
- Skip branch cleanup prompt: Answer "n" quickly
- Sync-all takes time on first run, faster after

**Pre-push:**
- Skip optional checks (answer "n" to prompts)
- Use `--no-verify` for emergency pushes (not recommended)

### Hook Blocking Legitimate Commit/Push

**Pre-commit:**
```bash
# Bypass if ticket not needed
git commit --no-verify -m "message"
```

**Pre-push:**
```bash
# Bypass for emergency fixes
git push --no-verify

# Or fix validation issues shown in hook output
```

## Configuration

### Timeouts

Configured in `hooks.json`:

- Pre-commit: 30 seconds
- Post-merge: 120 seconds (2 minutes)
- Pre-push: 180 seconds (3 minutes)

### Disabling Hooks

**Temporarily:**
```bash
# Use --no-verify flag
git commit --no-verify
git push --no-verify
```

**Permanently (not recommended):**
```bash
# Remove pre-push hook
rm .git/hooks/pre-push

# Claude hooks: Remove from hooks.json
```

## References

- Ticket Workflow: `.agents/rules/process/ai-workflow-system.md`
- Git Workflow: `.agents/rules/process/git-workflow.md`
- Hook Development: `.agents/skills/hook-development/`
- TICK-003: Implementation ticket for these hooks
