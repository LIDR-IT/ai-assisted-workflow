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

## Testing for Scripts

### Bash Script Testing

**Test structure:**
```bash
# test_sync_rules.sh
#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SYNC_SCRIPT="$SCRIPT_DIR/../.agents/rules/sync-rules.sh"

# Test counter
TESTS_RUN=0
TESTS_PASSED=0

# Helper functions
pass() {
  echo "  ✅ $1"
  ((TESTS_PASSED++))
}

fail() {
  echo "  ❌ $1"
}

test_case() {
  echo ""
  echo "Test: $1"
  ((TESTS_RUN++))
}

# Tests
test_case "Script exists and is executable"
if [ -x "$SYNC_SCRIPT" ]; then
  pass "Script is executable"
else
  fail "Script not found or not executable"
fi

test_case "Dry run mode works"
if "$SYNC_SCRIPT" --dry-run > /dev/null 2>&1; then
  pass "Dry run completed without errors"
else
  fail "Dry run failed"
fi

test_case "Creates symlinks"
"$SYNC_SCRIPT" > /dev/null 2>&1
if [ -L ".cursor/rules" ]; then
  pass "Cursor rules symlink created"
else
  fail "Cursor rules symlink not created"
fi

# Summary
echo ""
echo "========================================"
echo "Tests run: $TESTS_RUN"
echo "Tests passed: $TESTS_PASSED"
echo "Tests failed: $((TESTS_RUN - TESTS_PASSED))"
echo "========================================"

if [ $TESTS_RUN -eq $TESTS_PASSED ]; then
  echo "✅ All tests passed!"
  exit 0
else
  echo "❌ Some tests failed"
  exit 1
fi
```

**Running tests:**
```bash
# Make test executable
chmod +x test_sync_rules.sh

# Run tests
./test_sync_rules.sh

# Run specific test
./test_sync_rules.sh test_dry_run
```

### Manual Testing Checklist

**For sync-rules.sh:**
```markdown
- [ ] Script runs without errors
- [ ] Dry-run mode works (no changes)
- [ ] Validates source directories exist
- [ ] Creates Cursor symlinks correctly
- [ ] Creates Claude symlinks correctly
- [ ] Creates Gemini symlinks correctly
- [ ] Copies rules for Antigravity
- [ ] Verification step passes
- [ ] Error messages are clear
- [ ] Output formatting is helpful
```

**For MCP configurations:**
```markdown
- [ ] Sync script generates all configs
- [ ] Cursor MCP config is valid JSON
- [ ] Claude MCP config is valid JSON
- [ ] Gemini settings.json is valid JSON
- [ ] No syntax errors in generated files
- [ ] Platform-specific fields correct
- [ ] Environment variables preserved
```

## Verification Testing

### Symlink Verification

**Test symlinks point to correct targets:**
```bash
#!/bin/bash

verify_symlink() {
  local link=$1
  local expected=$2

  if [ ! -L "$link" ]; then
    echo "❌ Not a symlink: $link"
    return 1
  fi

  local actual=$(readlink "$link")
  if [ "$actual" != "$expected" ]; then
    echo "❌ Wrong target: $link"
    echo "   Expected: $expected"
    echo "   Actual: $actual"
    return 1
  fi

  echo "✅ $link → $actual"
}

# Run verifications
verify_symlink ".cursor/rules" "../.agents/rules"
verify_symlink ".cursor/skills" "../.agents/skills"
verify_symlink ".claude/rules" "../.agents/rules"
verify_symlink ".claude/skills" "../.agents/skills"
verify_symlink ".gemini/rules" "../.agents/rules"
verify_symlink ".gemini/skills" "../.agents/skills"
```

### File Accessibility Testing

**Test files are readable through symlinks:**
```bash
#!/bin/bash

test_file_access() {
  local file=$1

  if [ ! -f "$file" ] && [ ! -d "$file" ]; then
    echo "❌ Cannot access: $file"
    return 1
  fi

  if [ -f "$file" ] && [ ! -r "$file" ]; then
    echo "❌ Cannot read: $file"
    return 1
  fi

  echo "✅ Accessible: $file"
}

# Test file access through symlinks
test_file_access ".cursor/rules/core-principles.md"
test_file_access ".claude/rules/code-style.md"
test_file_access ".gemini/skills/"
test_file_access ".agent/rules/use-context7.md"
```

### JSON Validation

**Test generated JSON is valid:**
```bash
#!/bin/bash

validate_json() {
  local file=$1

  if ! command -v jq &> /dev/null; then
    echo "⚠️  jq not installed - skipping JSON validation"
    return 0
  fi

  if jq empty "$file" 2>/dev/null; then
    echo "✅ Valid JSON: $file"
  else
    echo "❌ Invalid JSON: $file"
    return 1
  fi
}

# Validate all generated configs
validate_json ".cursor/mcp.json"
validate_json ".claude/mcp.json"
validate_json ".gemini/settings.json"
validate_json ".gemini/mcp_config.json"
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
# Verify rules copied
ls -la .agent/rules/
cat .agent/rules/core-principles.md

# Verify skills accessible
ls -la .agent/skills/

# Note: MCP must be configured globally
cat ~/.gemini/antigravity/mcp_config.json
```

## Integration Testing

### End-to-End Workflow Tests

**Test: Add new rule and sync**
```bash
#!/bin/bash

echo "Test: Add new rule and verify propagation"

# 1. Create new rule
echo "# Test Rule" > .agents/rules/test-rule.md

# 2. Run sync
./.agents/rules/sync-rules.sh > /dev/null 2>&1

# 3. Verify in all agents
if [ -f ".cursor/rules/test-rule.md" ] &&
   [ -f ".claude/rules/test-rule.md" ] &&
   [ -f ".gemini/rules/test-rule.md" ] &&
   [ -f ".agent/rules/test-rule.md" ]; then
  echo "✅ Rule propagated to all agents"
else
  echo "❌ Rule not propagated correctly"
  exit 1
fi

# 4. Cleanup
rm .agents/rules/test-rule.md
./.agents/rules/sync-rules.sh > /dev/null 2>&1
```

**Test: Add MCP server and generate configs**
```bash
#!/bin/bash

echo "Test: Add MCP server and generate configs"

# 1. Backup current config
cp .agents/mcp/mcp-servers.json .agents/mcp/mcp-servers.json.bak

# 2. Add test server
jq '.servers.test = {
  "platforms": ["cursor", "claude"],
  "command": "echo",
  "args": ["test"]
}' .agents/mcp/mcp-servers.json.bak > .agents/mcp/mcp-servers.json

# 3. Run sync
./.agents/mcp/sync-mcp.sh > /dev/null 2>&1

# 4. Verify in generated configs
if jq -e '.mcpServers.test' .cursor/mcp.json > /dev/null &&
   jq -e '.mcpServers.test' .claude/mcp.json > /dev/null; then
  echo "✅ MCP server added to configs"
else
  echo "❌ MCP server not in configs"
  exit 1
fi

# 5. Restore original
mv .agents/mcp/mcp-servers.json.bak .agents/mcp/mcp-servers.json
./.agents/mcp/sync-mcp.sh > /dev/null 2>&1
```

## Error Handling Tests

### Testing Failure Cases

**Test: Missing source directory**
```bash
#!/bin/bash

echo "Test: Handle missing source directory"

# 1. Temporarily rename source
mv .agents/rules .agents/rules.tmp

# 2. Run script (should fail gracefully)
if ./.agents/rules/sync-rules.sh 2>&1 | grep -q "❌"; then
  echo "✅ Error handled correctly"
else
  echo "❌ Error not handled properly"
fi

# 3. Restore
mv .agents/rules.tmp .agents/rules
```

**Test: Invalid JSON**
```bash
#!/bin/bash

echo "Test: Handle invalid JSON in source"

# 1. Backup and create invalid JSON
cp .agents/mcp/mcp-servers.json .agents/mcp/mcp-servers.json.bak
echo "{ invalid json }" > .agents/mcp/mcp-servers.json

# 2. Run script (should fail)
if ! ./.agents/mcp/sync-mcp.sh 2>&1; then
  echo "✅ Invalid JSON rejected"
else
  echo "❌ Invalid JSON not caught"
fi

# 3. Restore
mv .agents/mcp/mcp-servers.json.bak .agents/mcp/mcp-servers.json
```

## Performance Testing

### Script Execution Time

```bash
#!/bin/bash

echo "Test: Script execution time"

# Measure sync-rules.sh
start=$(date +%s%N)
./.agents/rules/sync-rules.sh > /dev/null 2>&1
end=$(date +%s%N)

duration=$(( (end - start) / 1000000 ))
echo "sync-rules.sh took ${duration}ms"

if [ $duration -lt 1000 ]; then
  echo "✅ Performance acceptable (<1s)"
else
  echo "⚠️  Performance slow (>1s)"
fi
```

## Regression Testing

### Test Suite for Common Issues

```bash
#!/bin/bash
# regression_tests.sh

echo "Running regression tests..."

# Issue #1: Symlinks not overwriting existing directories
test_symlink_overwrite() {
  mkdir -p .cursor/rules
  ./.agents/rules/sync-rules.sh > /dev/null 2>&1
  if [ -L ".cursor/rules" ]; then
    echo "✅ Symlink overwrites directory"
  else
    echo "❌ Failed to overwrite directory"
  fi
}

# Issue #2: Antigravity rules not copied
test_antigravity_copy() {
  rm -rf .agent/rules
  ./.agents/rules/sync-rules.sh > /dev/null 2>&1
  if [ -f ".agent/rules/core-principles.md" ]; then
    echo "✅ Antigravity rules copied"
  else
    echo "❌ Antigravity rules not copied"
  fi
}

# Issue #3: MCP env variables lost
test_env_variables() {
  if jq -e '.mcpServers.context7.env.CONTEXT7_API_KEY' .claude/mcp.json > /dev/null; then
    echo "✅ Environment variables preserved"
  else
    echo "❌ Environment variables lost"
  fi
}

# Run all tests
test_symlink_overwrite
test_antigravity_copy
test_env_variables
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

### TC-002: Symlink Creation
**Description:** Verify symlinks created correctly
**Steps:**
1. Run `.agents/rules/sync-rules.sh`
2. Check `.cursor/rules`, `.claude/rules`, `.gemini/rules`
**Expected:** All are symlinks pointing to `../.agents/rules`

### TC-003: Antigravity Copy
**Description:** Verify rules copied for Antigravity
**Steps:**
1. Run `.agents/rules/sync-rules.sh`
2. Check `.agent/rules/` contains .md files
**Expected:** All rules copied to `.agent/rules/`

## Coverage

- [ ] All platforms tested (Cursor, Claude, Gemini, Antigravity)
- [ ] Error cases covered
- [ ] Edge cases handled
- [ ] Performance acceptable

## Test Results

| Test Case | Status | Notes |
|-----------|--------|-------|
| TC-001 | ✅ Pass | Dry run works correctly |
| TC-002 | ✅ Pass | Symlinks created |
| TC-003 | ✅ Pass | Files copied |
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

# Run quick tests
if ! ./test_sync_rules.sh; then
  echo "❌ Tests failed"
  exit 1
fi

echo "✅ Pre-commit tests passed"
```

### Post-sync Verification

```bash
#!/bin/bash
# Run after any sync operation

verify_sync() {
  echo "Verifying synchronization..."

  # Check symlinks
  for agent in cursor claude gemini; do
    if [ ! -L ".$agent/rules" ]; then
      echo "❌ Missing rules symlink: .$agent/rules"
      return 1
    fi
  done

  # Check Antigravity copy
  if [ ! -f ".agent/rules/core-principles.md" ]; then
    echo "❌ Antigravity rules not copied"
    return 1
  fi

  echo "✅ Synchronization verified"
}

verify_sync
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

## References

- [Bash Automated Testing System](https://github.com/bats-core/bats-core)
- [ShellCheck](https://www.shellcheck.net/) - Shell script analyzer
- [Testing Bash Scripts](https://github.com/fearside/SimpleTest)
- [Google Shell Style Guide](https://google.github.io/styleguide/shellguide.html)
