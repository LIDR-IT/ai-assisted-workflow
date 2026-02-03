# Implementation Plan: Post-Merge and Pre-Push Git Hooks

## Overview

Implement two new git hooks to automate critical workflow steps:

- **post-merge hook**: Automatically sync configs, update dependencies, and clean up stale branches after pull/merge operations
- **pre-push hook**: Validate documentation, linting, and run comprehensive checks before pushing to remote

This builds on the existing pre-commit hook infrastructure using Claude Code's hook system.

## Technical Approach

### Architecture

**Hook System:** Leverage Claude Code's hooks.json configuration

- **File location:** `.agents/hooks/hooks.json`
- **Hook types:** PostToolUse (for post-merge), PreToolUse (for pre-push)
- **Pattern matching:** Detect `git pull`, `git merge` (post-merge) and `git push` (pre-push)

**Script Structure:**

```bash
.agents/hooks/scripts/
├── validate-commit.sh      # Existing pre-commit
├── post-merge.sh           # NEW - sync, deps, cleanup
└── pre-push.sh             # NEW - validation, docs, linting
```

### Post-Merge Hook (post-merge.sh)

**Triggers:** After `git pull` or `git merge` commands

**Workflow:**

1. Detect changes in `.agents/` directories (rules, skills, commands, mcp)
2. If changes detected → Run `.agents/sync-all.sh`
3. Detect changes in `package.json`, `package-lock.json`
4. If package files changed → Run `npm install`
5. Check for stale local branches (deleted remotely)
6. Prompt user: "Delete local branch feature/TICK-123? (y/n)"
7. Timeout: 120 seconds (2 minutes)

**Configuration:**

```json
{
  "hooks": {
    "PostToolUse": [
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

### Pre-Push Hook (pre-push.sh)

**Triggers:** Before `git push` command

**Workflow:**

1. Manual test confirmation prompt: "Did you run all tests? (y/n)"
   - If "n" → Block push with message: "Please run tests before pushing"
2. Check Playwright MCP availability (if configured)
   - If available → Run E2E tests automatically
3. Check for documentation updates
   - Compare `git diff main..HEAD` for src/ changes vs docs/ changes
   - If src/ changed but not docs/ → Warn: "Documentation appears unchanged"
4. Run linting: `npm run lint` (if available)
5. Run security scan (if tools configured): `npm audit`
6. Timeout: 180 seconds (3 minutes)
7. Allow bypass with `--no-verify` flag

**Configuration:**

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "pattern": "git push",
        "hook": {
          "type": "command",
          "command": "bash ${CLAUDE_PLUGIN_ROOT}/hooks/scripts/pre-push.sh",
          "timeout": 180000
        }
      }
    ]
  }
}
```

### Progress Message Formatter

**Shared utility:** `hooks/scripts/lib/progress.sh`

**Functions:**

- `log_info()`: Blue info messages with ℹ️
- `log_success()`: Green success messages with ✅
- `log_warning()`: Yellow warnings with ⚠️
- `log_error()`: Red errors with ❌
- `log_step()`: Step indicators with 🔄

**Example output:**

```
🔄 Running post-merge checks...
  ℹ️  Detected changes in .agents/rules/
  ✅ Configs synchronized
  ℹ️  Detected package.json changes
  ✅ Dependencies updated
  ⚠️  Stale branch detected: feature/TICK-123
  Delete local branch? (y/n): y
  ✅ Branch deleted
✅ Post-merge completed in 45s
```

### Timeout Handling

**Implementation:**

```bash
# Wrap long operations with timeout
timeout 120 .agents/sync-all.sh || {
  log_error "Sync timed out after 2 minutes"
  exit 1
}
```

**Graceful degradation:**

- On timeout → Show clear error message
- Allow user to retry manually
- Suggest `--no-verify` for emergencies

## Tasks Breakdown

### Phase 1: Architecture (tech-lead)

- [ ] Review existing hook system in `.agents/hooks/`
- [ ] Design hook configuration structure
- [ ] Document pattern matching strategy
- [ ] Define error handling and timeout behavior

### Phase 2: Implementation (development-team)

- [ ] Create `post-merge.sh` script with sync detection
- [ ] Create `pre-push.sh` script with validation checks
- [ ] Implement timeout handling wrapper
- [ ] Create progress message formatter (`lib/progress.sh`)
- [ ] Update `hooks.json` with new hook configurations
- [ ] Add Playwright MCP integration (conditional)

### Phase 3: Documentation (doc-improver agent)

- [ ] Document hook architecture in `docs/references/hooks/`
- [ ] Create user guide for hook behavior
- [ ] Add examples of hook output
- [ ] Document bypass procedures (`--no-verify`)

### Phase 4: Troubleshooting Guide (development-team)

- [ ] Document common issues (timeout, permission errors)
- [ ] Add debugging steps (check hook execution, logs)
- [ ] Create FAQ section
- [ ] Link to git workflow documentation

## Resources

### Existing References

- Pre-commit hook: `.agents/hooks/scripts/validate-commit.sh`
- Hook config: `.agents/hooks/hooks.json`
- Sync script: `.agents/sync-all.sh`
- Git workflow: `.agents/rules/process/git-workflow.md`

### Hook System Documentation

- Claude Code hooks: Check plugin documentation for latest API
- Pattern matching: Bash regex patterns for git commands
- Environment variables: `${CLAUDE_PLUGIN_ROOT}` usage

### Testing Strategy

- Manual testing across all 4 platforms (Cursor, Claude Code, Gemini CLI, Antigravity)
- Test with real scenarios:
  - Pull with config changes
  - Pull with dependency changes
  - Push with failing tests
  - Push with missing docs
  - Bypass with `--no-verify`

### Future Enhancements

- Automated test suite integration (TICK-005 - stack TBD)
- Performance metrics collection
- Hook execution analytics
- Custom hook configurations per project

## Implementation Notes

**Compatibility:**

- Use bash for maximum compatibility (not node/python)
- Test on macOS (primary), Linux (CI/CD)
- WSL compatibility (Windows users)

**Safety:**

- Never block critical operations without clear error messages
- Always provide bypass option (`--no-verify`)
- Timeout limits prevent infinite hangs

**Performance Targets:**

- post-merge: <2 minutes (typical: 30-60s)
- pre-push: <3 minutes (typical: 1-2 minutes)
- Fast-fail on errors (don't wait for timeout)

**User Experience:**

- Clear, colored output with emoji indicators
- Progress messages show what's happening
- Actionable error messages with next steps
- Prompts only when user input required

## Verification Checklist

Before marking ticket as complete:

- [ ] Both hooks execute on correct git commands
- [ ] Timeout limits enforced
- [ ] Progress messages clear and helpful
- [ ] Bypass flag (`--no-verify`) works
- [ ] All platforms tested (Cursor, Claude, Gemini, Antigravity)
- [ ] Documentation complete and accurate
- [ ] No breaking changes to existing pre-commit hook
- [ ] Error messages actionable and clear
