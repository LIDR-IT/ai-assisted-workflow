---
name: testing
description: Testing guidelines and best practices
alwaysApply: false
trigger: always_on
---

# Testing Guidelines

## Testing Philosophy

### Why We Test

- **Confidence:** Know changes don't break existing functionality
- **Documentation:** Tests describe expected behavior
- **Refactoring Safety:** Enables confident code improvements
- **Regression Prevention:** Catch bugs before production
- **Design Feedback:** Tests reveal design issues early

### What to Test

**DO test:**
- Critical business logic
- Complex algorithms
- Error handling paths
- Platform-specific behaviors
- Integration points
- Scripts and automation

**DON'T test:**
- Trivial getters/setters
- Framework internals
- Third-party libraries (trust their tests)
- Generated code (test the generator)

## Manual Testing Checklist

### For sync-rules.sh

```markdown
- [ ] Script runs without errors
- [ ] Dry-run mode works (no changes)
- [ ] Validates source directories exist
- [ ] Creates Cursor files correctly (flattened)
- [ ] Creates Claude symlinks correctly (subdirs)
- [ ] Creates Gemini symlinks correctly (subdirs)
- [ ] Copies rules for Antigravity (flattened)
- [ ] Verification step passes
- [ ] Error messages are clear
- [ ] Output formatting is helpful
```

### For MCP Configurations

```markdown
- [ ] Sync script generates all configs
- [ ] Cursor MCP config is valid JSON
- [ ] Claude MCP config is valid JSON
- [ ] Gemini settings.json is valid JSON
- [ ] No syntax errors in generated files
- [ ] Platform-specific fields correct
- [ ] Environment variables preserved
```

## Platform-Specific Testing

### Testing Across All Agents

**Cursor:**
```bash
# Manual verification
# 1. Open Cursor
# 2. Check MCP servers appear in settings
# 3. Verify skills are accessible
# 4. Test a skill invocation
```

**Claude Code:**
```bash
# CLI verification
claude mcp list
# Should show Context7 and other configured servers

# Test skill
claude /find-skills
```

**Gemini CLI:**
```bash
# CLI verification
gemini mcp list
# Should show configured servers

# Test skill
gemini /find-skills
```

**Antigravity:**
```bash
# Verify rules copied (flattened)
ls -la .agent/rules/
cat .agent/rules/principles.md

# Verify skills accessible
ls -la .agent/skills/

# Note: MCP must be configured globally
cat ~/.gemini/antigravity/mcp_config.json
```

## Testing Best Practices

### Write Testable Scripts

**Use functions:**
```bash
# Good - testable
create_symlink() {
  local target=$1
  local link=$2
  ln -s "$target" "$link"
}

# Can be tested independently
test_create_symlink() {
  create_symlink "target" "link"
  [ -L "link" ]
}
```

**Use exit codes:**
```bash
# Good - testable
if validate_sources; then
  echo "Valid"
else
  echo "Invalid"
  exit 1
fi

# Can check exit code in tests
```

**Make scripts idempotent:**
```bash
# Script can be run multiple times safely
if [ -L "$link" ]; then
  rm "$link"
fi
ln -s "$target" "$link"
```

## Test Documentation

### Documenting Tests

```markdown
# Test Plan: sync-rules.sh

## Scope
Test synchronization of rules and skills across all agent platforms.

## Test Cases

### TC-001: Dry Run Mode
**Description:** Verify dry-run mode makes no changes
**Steps:**
1. Run `.agents/rules/sync-rules.sh --dry-run`
2. Check no files created/modified
**Expected:** Script completes with dry-run messages, no changes made

### TC-002: File Creation (Cursor/Antigravity)
**Description:** Verify files copied correctly
**Steps:**
1. Run `.agents/rules/sync-rules.sh`
2. Check `.cursor/rules/` and `.agent/rules/` contain .md files
**Expected:** All rules flattened in both directories

### TC-003: Symlink Creation (Claude/Gemini)
**Description:** Verify symlinks created correctly
**Steps:**
1. Run `.agents/rules/sync-rules.sh`
2. Check `.claude/rules`, `.gemini/rules`
**Expected:** Both are symlinks pointing to `../.agents/rules`

## Coverage

- [ ] All platforms tested (Cursor, Claude, Gemini, Antigravity)
- [ ] Error cases covered
- [ ] Edge cases handled
- [ ] Performance acceptable

## Test Results

| Test Case | Status | Notes |
|-----------|--------|-------|
| TC-001 | ✅ Pass | Dry run works correctly |
| TC-002 | ✅ Pass | Files copied (flattened) |
| TC-003 | ✅ Pass | Symlinks created |
```

## Continuous Testing

### Pre-commit Testing

```bash
#!/bin/bash
# .git/hooks/pre-commit

echo "Running pre-commit tests..."

# Validate JSON files
for file in .agents/mcp/*.json; do
  if ! jq empty "$file" 2>/dev/null; then
    echo "❌ Invalid JSON: $file"
    exit 1
  fi
done

# Validate rules character count
for rule in .agents/rules/**/*.md; do
  chars=$(wc -c < "$rule")
  if [ $chars -gt 12000 ]; then
    echo "❌ Rule exceeds 12,000 chars: $rule ($chars chars)"
    exit 1
  fi
done

echo "✅ Pre-commit tests passed"
```

### Post-sync Verification

```bash
#!/bin/bash
# Run after any sync operation

verify_sync() {
  echo "Verifying synchronization..."

  # Check Claude/Gemini symlinks
  for agent in claude gemini; do
    if [ ! -L ".$agent/rules" ]; then
      echo "❌ Missing rules symlink: .$agent/rules"
      return 1
    fi
  done

  # Check Cursor/Antigravity copies
  for agent in cursor agent; do
    if [ ! -d ".$agent/rules" ]; then
      echo "❌ Missing rules directory: .$agent/rules"
      return 1
    fi
  done

  echo "✅ Synchronization verified"
}

verify_sync
```

## References

For bash script testing examples and integration tests, see:
- `.agents/rules/quality/testing-scripts.md` - Detailed bash testing patterns
- [Bash Automated Testing System](https://github.com/bats-core/bats-core)
- [ShellCheck](https://www.shellcheck.net/) - Shell script analyzer
- [Google Shell Style Guide](https://google.github.io/styleguide/shellguide.html)
