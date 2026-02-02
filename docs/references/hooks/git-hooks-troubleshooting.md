# Git Hooks Troubleshooting Guide

Common issues and solutions for git hooks in this project.

## Common Issues

### Hook Not Executing

**Symptoms:**
- No hook output after `git pull`, `git merge`, or `git push`
- Hook seems to be ignored

**Causes:**
1. Hook script not executable
2. Pattern not matching command
3. Claude Code plugin not active

**Solutions:**

```bash
# 1. Check script permissions
ls -la .agents/hooks/scripts/
# Should show -rwxr-xr-x (executable)

# 2. Make executable if needed
chmod +x .agents/hooks/scripts/post-merge.sh
chmod +x .agents/hooks/scripts/pre-push.sh
chmod +x .agents/hooks/scripts/lib/progress.sh

# 3. Verify hooks.json is valid
jq empty .agents/hooks/hooks.json

# 4. Check Claude Code is running
# Hooks only work when using Claude Code CLI
```

### Timeout Errors

**Symptoms:**
```
❌ Sync timed out after 120s or failed
⚠️  Run manually: ./.agents/sync-all.sh
```

**Causes:**
- Slow network connection
- Large dependency installation
- Unresponsive sync script

**Solutions:**

```bash
# 1. Run operation manually with more time
./.agents/sync-all.sh

# 2. Check network connection
ping npmjs.com

# 3. Increase timeout in hooks.json (temporary)
{
  "timeout": 300  // 5 minutes instead of 2
}

# 4. Use --no-verify to bypass (emergency)
git push --no-verify
```

### Permission Denied Errors

**Symptoms:**
```
bash: .agents/hooks/scripts/post-merge.sh: Permission denied
```

**Solution:**

```bash
# Make all scripts executable
chmod +x .agents/hooks/scripts/*.sh
chmod +x .agents/hooks/scripts/lib/*.sh
```

### Progress Messages Not Colored

**Symptoms:**
- Output shows escape codes instead of colors
- No emojis displayed

**Causes:**
- Terminal doesn't support ANSI colors
- Output redirected to file

**Solutions:**

```bash
# 1. Use terminal that supports ANSI colors (iTerm2, Hyper, Windows Terminal)

# 2. Check terminal capabilities
echo $TERM
# Should show: xterm-256color or similar

# 3. If using tmux/screen, ensure color support
# Add to ~/.tmux.conf:
set -g default-terminal "screen-256color"
```

### Hooks Block Every Push

**Symptoms:**
- Pre-push hook always asks for manual test confirmation
- Gets annoying on small changes

**Expected Behavior:**
- This is by design for quality assurance
- Ensures tests are run before pushing

**Solutions:**

```bash
# 1. For WIP commits, push to feature branch
git push origin feature/my-branch

# 2. For emergency pushes, use --no-verify
git push --no-verify

# 3. Run tests regularly during development
npm test  # Run frequently to avoid surprise failures

# 4. Future: TICK-005 will add automated test integration
```

### Stale Branch Cleanup Fails

**Symptoms:**
```
❌ Failed to delete: feature/TICK-123
```

**Causes:**
- Branch has uncommitted changes
- Branch not fully merged
- Currently on the branch

**Solutions:**

```bash
# 1. Check branch status
git status

# 2. Switch to main before cleanup
git checkout main

# 3. Force delete if needed (careful!)
git branch -D feature/TICK-123

# 4. Verify branch is on remote
git branch -r | grep TICK-123
```

### Documentation Check False Positive

**Symptoms:**
```
⚠️  Source code changed but documentation appears unchanged
```

**When This Happens:**
- Source files changed
- No corresponding documentation updates
- Pre-push prompts to proceed

**Solutions:**

```bash
# 1. Update documentation before pushing
vim docs/guides/my-guide.md

# 2. Add README changes
echo "New feature" >> README.md

# 3. If docs truly not needed, proceed when prompted
# Hook asks: "Proceed with push? (y/n)"
# Answer: y

# 4. Verify Definition of Done doesn't require docs
# Check ticket DoD for doc requirements
```

### npm Commands Not Found

**Symptoms:**
```
ℹ️  No linting configuration found (optional)
ℹ️  No package-lock.json found, skipping security scan
```

**Causes:**
- Not a Node.js project
- package.json missing scripts

**Expected Behavior:**
- Hooks gracefully skip npm-related checks
- This is normal for non-Node projects

**Solutions:**

```bash
# If you want linting, add to package.json:
{
  "scripts": {
    "lint": "eslint .",
    "test": "jest"
  }
}

# If not a Node project, ignore these messages
# Hooks will skip npm checks automatically
```

### Playwright MCP Not Detected

**Symptoms:**
```
ℹ️  Playwright MCP not configured (optional)
```

**Expected Behavior:**
- Playwright MCP is optional
- Hook checks for it but doesn't fail if missing

**Solutions:**

```bash
# 1. To enable Playwright MCP, add to .claude/mcp.json
# See: docs/guides/mcp/mcp-setup-guide.md

# 2. Or continue with manual testing (current approach)
# Answer "y" to manual test confirmation

# 3. Automated testing coming in TICK-005
```

## Debug Mode

To see detailed execution:

```bash
# Run hooks manually with bash -x
bash -x .agents/hooks/scripts/post-merge.sh

# Check last command exit code
echo $?
# 0 = success, non-zero = failure
```

## Performance Issues

### Hook Takes Too Long

**Symptoms:**
- Post-merge takes >2 minutes
- Pre-push takes >3 minutes

**Investigation:**

```bash
# 1. Check which step is slow
# Hooks show timing: ⏱️  Completed in XXs

# 2. Time individual operations
time ./.agents/sync-all.sh
time npm install
time npm run lint

# 3. Identify bottleneck and optimize
```

### Sync Script Slow

**Solutions:**

```bash
# 1. Check symlinks are used (not copies)
ls -la .cursor/rules
# Should show: lrwxr-xr-x (symlink)

# 2. Reduce file operations in sync-all.sh
# See: .agents/sync-all.sh

# 3. Skip unnecessary syncs
# Edit sync-all.sh to comment out slow operations
```

## Emergency Bypass

If hooks are completely broken and blocking work:

```bash
# 1. Bypass single operation
git push --no-verify

# 2. Temporarily disable hooks (not recommended)
mv .agents/hooks/hooks.json .agents/hooks/hooks.json.backup

# 3. Re-enable when fixed
mv .agents/hooks/hooks.json.backup .agents/hooks/hooks.json

# 4. Report issue in project tickets
# Create ticket for hook bug
```

## Getting Help

1. **Check logs:**
   - Hook output includes detailed error messages
   - Look for ❌ and ⚠️ indicators

2. **Verify configuration:**
   ```bash
   jq . .agents/hooks/hooks.json
   ls -la .agents/hooks/scripts/
   ```

3. **Test manually:**
   ```bash
   bash .agents/hooks/scripts/post-merge.sh
   bash .agents/hooks/scripts/pre-push.sh
   ```

4. **Create ticket:**
   - Use `/create-ticket bug` for hook issues
   - Include error output and steps to reproduce

## Related Documentation

- [Git Hooks Reference](./git-hooks-reference.md)
- [Hook Development Skill](./.agents/skills/hook-development/)
- [Git Workflow Guidelines](./.agents/rules/process/git-workflow.md)
- [Sync Scripts Documentation](./.agents/)

## Implementation

**Ticket:** TICK-003
**Branch:** feature/TICK-003-git-hooks
**Status:** ✅ Implemented
