# Bash Script Testing

Detailed testing patterns for bash scripts, sync operations, and automation.

## Bash Script Testing Structure

### Basic Test Structure

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
verify_symlink ".claude/rules" "../.agents/rules"
verify_symlink ".claude/skills" "../.agents/skills"
verify_symlink ".gemini/rules" "../.agents/rules"
verify_symlink ".gemini/skills" "../.agents/skills"
```

### File Accessibility Testing

**Test files are readable:**
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

# Test file access
test_file_access ".cursor/rules/principles.md"
test_file_access ".claude/rules/code/style.md"
test_file_access ".agent/rules/copywriting.md"
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

# 3. Verify in all agents (Cursor gets .mdc, others get symlinks)
if [ -f ".cursor/rules/test-rule.mdc" ] &&
   [ -L ".agent/rules" ]; then
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

# Issue #1: Files not overwriting existing directories
test_file_overwrite() {
  mkdir -p .cursor/rules
  ./.agents/rules/sync-rules.sh > /dev/null 2>&1
  if [ -d ".cursor/rules" ] && [ ! -L ".cursor/rules" ]; then
    echo "✅ Directory replaced with files"
  else
    echo "❌ Failed to replace directory"
  fi
}

# Issue #2: Antigravity rules symlink created
test_antigravity_symlink() {
  rm -rf .agent/rules
  ./.agents/rules/sync-rules.sh > /dev/null 2>&1
  if [ -L ".agent/rules" ]; then
    echo "✅ Antigravity rules symlink created"
  else
    echo "❌ Antigravity rules symlink not created"
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

# Issue #4: Rules exceed character limit
test_rules_size() {
  local fail_count=0
  for rule in .agents/rules/**/*.md; do
    chars=$(wc -c < "$rule")
    if [ $chars -gt 12000 ]; then
      echo "❌ Rule exceeds limit: $rule ($chars chars)"
      ((fail_count++))
    fi
  done

  if [ $fail_count -eq 0 ]; then
    echo "✅ All rules under 12,000 character limit"
  fi
}

# Run all tests
test_file_overwrite
test_antigravity_symlink
test_env_variables
test_rules_size
```

## References

- [Bash Automated Testing System](https://github.com/bats-core/bats-core)
- [ShellCheck](https://www.shellcheck.net/) - Shell script analyzer
- [Testing Bash Scripts](https://github.com/fearside/SimpleTest)
- [Google Shell Style Guide](https://google.github.io/styleguide/shellguide.html)
