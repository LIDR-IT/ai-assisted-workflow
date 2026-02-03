# TICK-003 Manual Testing - Cursor

**Platform:** Cursor IDE
**Tester:** [Your name]
**Date:** 2026-02-03
**Branch:** feature/TICK-006-ticket-enricher

---

## Current Hooks System

This project uses a **simplified 3-hook system** (576 lines, 59% reduction):

1. **notify.sh** (Notification) - Desktop notifications
2. **auto-format.sh** (postToolUse) - Auto-format with prettier
3. **protect-secrets.sh** (preToolUse) - Block sensitive file edits

**Cursor:** Supports 2 of 3 hooks ⚠️

### ⚠️ CRITICAL: Cursor Limitation

**Cursor does NOT support Notification events**, therefore:

- ✅ **auto-format.sh** - Works (postToolUse)
- ✅ **protect-secrets.sh** - Works (preToolUse)
- ❌ **notify.sh** - NOT supported (Notification event doesn't exist in Cursor)

This test guide covers **ONLY the 2 hooks that work on Cursor**.

---

## Pre-Test Setup

### 1. Verify Hook Configuration

```bash
# Check hooks.json exists and is valid
cat .agents/hooks/hooks.json | jq .

# Expected output should show:
# - PreToolUse array with protect-secrets hook
# - PostToolUse array with auto-format hook
# - Notification array with notify hook (but won't work on Cursor)

# Verify scripts are executable
ls -la .agents/hooks/scripts/
# Should see: -rwxr-xr-x for notify.sh, auto-format.sh, protect-secrets.sh
```

### 2. Verify Cursor Hook System

```bash
# Check Cursor hooks configuration
cat .cursor/hooks.json | jq .

# Verify hooks scripts symlink
ls -la .cursor/hooks/scripts
# Should show: .cursor/hooks/scripts -> ../.agents/hooks/scripts

# Check version field (Cursor-specific)
jq '.version' .cursor/hooks.json
# Should show: 1

# Check event format (camelCase, not PascalCase)
jq 'keys' .cursor/hooks.json
# Should show: ["version", "preToolUse", "postToolUse"]
# Note: NO "Notification" key (not supported)
```

**✅ Prerequisites:**

- Cursor IDE installed and configured
- Project opened in Cursor
- `.agents/hooks/hooks.json` exists
- `.cursor/hooks.json` exists (generated)
- prettier installed globally (`npm install -g prettier`)

---

## Test 1: Auto-Format Hook (auto-format.sh)

### Objective

Verify that files are automatically formatted after Edit/Write operations.

### Platform Support

✅ **Cursor** - Fully supported (postToolUse event)
✅ **Claude Code** - Fully supported
✅ **Gemini CLI** - Fully supported

### Steps

#### Step 1.1: Test JSON Formatting

```bash
# Create test file with bad formatting
echo '{"name":"test","value":123,"nested":{"key":"value"}}' > test-format.json

# Ask Claude in Cursor: "Edit test-format.json and change 'test' to 'updated'"
# Claude will use Edit tool, triggering auto-format hook

# Check result
cat test-format.json
```

**Expected Result:**

```json
{
  "name": "updated",
  "value": 123,
  "nested": {
    "key": "value"
  }
}
```

**Manual Verification Checklist:**

- [ ] File was auto-formatted with proper indentation
- [ ] Edit operation succeeded
- [ ] No errors from prettier
- [ ] File syntax is valid

#### Step 1.2: Test Markdown Formatting

```bash
# Create markdown with bad formatting
echo '#Header
No space after hash.   Extra spaces.


Too many newlines.' > test-format.md

# Ask Claude in Cursor: "Fix the typo in test-format.md, change 'hash' to 'heading'"
# Claude will use Edit tool, triggering auto-format hook

# Check result
cat test-format.md
```

**Expected Result:**

```markdown
# Header

No space after heading. Extra spaces.

Too many newlines.
```

**Manual Verification Checklist:**

- [ ] Markdown was auto-formatted
- [ ] Edit operation succeeded
- [ ] Spacing and newlines corrected
- [ ] File is valid markdown

#### Step 1.3: Test TypeScript/JavaScript Formatting

```bash
# Create JS with bad formatting
echo 'const x={a:1,b:2};function foo(){return x.a+x.b;}' > test-format.js

# Ask Claude in Cursor: "Edit test-format.js and change variable x to data"
# Claude will use Edit tool, triggering auto-format hook

# Check result
cat test-format.js
```

**Expected Result:**

```javascript
const data = { a: 1, b: 2 };
function foo() {
  return data.a + data.b;
}
```

**Manual Verification Checklist:**

- [ ] JavaScript was auto-formatted
- [ ] Edit operation succeeded
- [ ] Proper indentation applied
- [ ] File is valid JavaScript

#### Step 1.4: Test Graceful Skip (Non-Supported Files)

```bash
# Create binary-like file
echo "binary content" > test.bin

# Ask Claude in Cursor: "Edit test.bin and change 'binary' to 'modified'"

# Check result
cat test.bin
```

**Expected Result:**

- File edited successfully
- Hook skipped formatting (not supported)
- No errors thrown

**Manual Verification Checklist:**

- [ ] Edit operation succeeded
- [ ] Hook didn't crash on unsupported file
- [ ] File was modified correctly
- [ ] No prettier errors

---

## Test 2: Protect Secrets Hook (protect-secrets.sh)

### Objective

Verify that edits to sensitive files are blocked before execution.

### Platform Support

✅ **Cursor** - Fully supported (preToolUse event)
✅ **Claude Code** - Fully supported
✅ **Gemini CLI** - Fully supported

### Steps

#### Step 2.1: Block .env File Edits

```bash
# Create .env file
echo 'API_KEY=secret123
DB_PASSWORD=pass456' > .env

# Ask Claude in Cursor: "Edit .env and change the API_KEY"
# Hook should BLOCK this edit
```

**Expected Result:**

- Edit is BLOCKED
- Error message: "Cannot edit sensitive file '.env'" or similar
- File remains unchanged
- Exit code 2 (blocking)

**Manual Verification Checklist:**

- [ ] Edit was blocked
- [ ] Error message was clear
- [ ] File was NOT modified
- [ ] Claude received blocking decision

#### Step 2.2: Block .key and .pem Files

```bash
# Create sensitive files
echo '-----BEGIN PRIVATE KEY-----
KEY_DATA_HERE
-----END PRIVATE KEY-----' > test.key

echo '-----BEGIN CERTIFICATE-----
CERT_DATA_HERE
-----END CERTIFICATE-----' > test.pem

# Ask Claude in Cursor: "Edit test.key and test.pem"
# Both should be BLOCKED
```

**Expected Result:**

- Both edits BLOCKED
- Clear error messages
- Files remain unchanged

**Manual Verification Checklist:**

- [ ] test.key edit blocked
- [ ] test.pem edit blocked
- [ ] Both files unchanged
- [ ] Clear blocking messages

#### Step 2.3: Allow Normal Files

```bash
# Create normal files
echo '# Test' > README.md
echo '{"setting": "value"}' > config.json

# Ask Claude in Cursor: "Edit README.md and config.json"
# Both should be ALLOWED
```

**Expected Result:**

- Edits proceed normally
- Files modified successfully
- No blocking

**Manual Verification Checklist:**

- [ ] README.md edited successfully
- [ ] config.json edited successfully
- [ ] No false positives (allowed files weren't blocked)

#### Step 2.4: Block Protected Directories

```bash
# Create directories and files
mkdir -p secrets credentials
echo 'secret-key-123' > secrets/api-key.txt
echo '{"user": "admin", "pass": "secret"}' > credentials/database.json

# Ask Claude in Cursor: "Edit files in secrets/ and credentials/ directories"
# Both should be BLOCKED
```

**Expected Result:**

- Edits to secrets/api-key.txt BLOCKED
- Edits to credentials/database.json BLOCKED
- Directory patterns detected

**Manual Verification Checklist:**

- [ ] secrets/ directory files blocked
- [ ] credentials/ directory files blocked
- [ ] Pattern matching works for directories

---

## Test 3: Hook Integration

### Objective

Verify hooks work together without conflicts.

### Steps

#### Step 3.1: Test Multiple Hooks on Same Operation

```bash
# Create a normal JSON file
echo '{"test":"value"}' > normal.json

# Ask Claude in Cursor: "Edit normal.json"
# Should trigger:
# 1. protect-secrets (allows - not sensitive)
# 2. Edit proceeds
# 3. auto-format (formats file)
```

**Expected Result:**

- protect-secrets allows (not sensitive)
- Edit succeeds
- auto-format formats file
- All hooks execute in correct order

**Manual Verification Checklist:**

- [ ] protect-secrets checked file first (preToolUse)
- [ ] Edit operation succeeded
- [ ] auto-format ran after (postToolUse)
- [ ] File properly formatted
- [ ] No hook conflicts

---

## Test 4: Performance & Error Handling

### Objective

Verify hooks don't significantly impact performance and handle errors gracefully.

### Steps

#### Step 4.1: Test Hook Timeouts

```bash
# Hooks have configured timeouts:
# - auto-format.sh: 30 seconds
# - protect-secrets.sh: 10 seconds

# Normal operations should complete well under timeout
```

**Manual Verification Checklist:**

- [ ] All hooks complete quickly (<5 seconds for normal files)
- [ ] No timeout warnings
- [ ] Operations feel responsive

#### Step 4.2: Test Missing Dependencies

```bash
# Temporarily remove prettier (for auto-format test)
# Hook should gracefully skip formatting

# Ask Claude in Cursor: "Edit a JSON file"
# Should work, but skip formatting
```

**Expected Result:**

- Edit succeeds even without prettier
- Hook logs skip message (if debug enabled)
- No crashes or errors

**Manual Verification Checklist:**

- [ ] Missing prettier doesn't crash hook
- [ ] Edit operation still works
- [ ] Graceful fallback behavior

---

## Test 5: Cursor-Specific Format Verification

### Objective

Verify that Cursor's hooks.json uses the correct format.

### Steps

```bash
# Check Cursor-specific format requirements
cat .cursor/hooks.json | jq .
```

**Expected Structure:**

```json
{
  "version": 1,
  "preToolUse": [
    {
      "matcher": "Write|Edit",
      "hooks": [
        {
          "type": "command",
          "command": "bash ${CURSOR_PROJECT_DIR}/.cursor/hooks/scripts/protect-secrets.sh",
          "timeout": 10
        }
      ]
    }
  ],
  "postToolUse": [
    {
      "matcher": "Write|Edit",
      "hooks": [
        {
          "type": "command",
          "command": "bash ${CURSOR_PROJECT_DIR}/.cursor/hooks/scripts/auto-format.sh",
          "timeout": 30
        }
      ]
    }
  ]
}
```

**Manual Verification Checklist:**

- [ ] Has `"version": 1` field (Cursor-specific)
- [ ] Uses camelCase: `preToolUse`, `postToolUse` (NOT PascalCase)
- [ ] NO `Notification` key (not supported by Cursor)
- [ ] Flat structure (all hooks at same level)
- [ ] Uses `${CURSOR_PROJECT_DIR}` variable
- [ ] Timeout in seconds (not milliseconds)

---

## Summary Checklist

### Hook Execution

- [ ] Test 1: auto-format.sh - Files auto-formatted ✅
- [ ] Test 2: protect-secrets.sh - Sensitive files blocked ✅
- [ ] Test 3: Multiple hooks work together ✅
- [ ] Test 4: Performance acceptable, errors handled ✅
- [ ] Test 5: Cursor-specific format correct ✅

### Configuration

- [ ] `.agents/hooks/hooks.json` valid
- [ ] `.cursor/hooks.json` valid (camelCase, version: 1)
- [ ] Scripts are executable
- [ ] Symlinks correct

### Platform Verification

- [ ] Cursor supports 2 of 3 hooks (auto-format, protect-secrets)
- [ ] notify.sh correctly excluded (Notification not supported)
- [ ] All hooks trigger on correct events
- [ ] No conflicts between hooks
- [ ] Error messages clear and helpful

### Issues Found

_Document any issues here:_

---

## ⚠️ Known Limitations

### Cursor Does NOT Support:

1. **Notification Events**
   - notify.sh will NOT work on Cursor
   - Desktop notifications not supported
   - This is a platform limitation, not a bug

2. **Notification Event Testing**
   - Cannot test notify.sh on Cursor
   - Test only on Claude Code or Gemini CLI
   - See: `test-claude-code-manual-validation.md`

### Cursor-Specific Behavior:

- **Event Format:** camelCase (preToolUse, postToolUse)
- **Version Field:** Required (version: 1)
- **Structure:** Flat (not nested)
- **Environment Variable:** Uses `CURSOR_PROJECT_DIR` (not `CLAUDE_PLUGIN_ROOT`)

---

## Cleanup

```bash
# Delete test files
rm -f test-format.json test-format.md test-format.js test.bin
rm -f .env test.key test.pem
rm -f README.md config.json normal.json
rm -rf secrets/ credentials/
```

---

## Platform Notes

**Cursor Specific:**

- Supports 2 of 3 hooks (auto-format, protect-secrets)
- Uses camelCase event names (preToolUse, postToolUse)
- NO Notification event support (notify.sh excluded)
- Requires version field: `"version": 1`
- Timeout in seconds (not milliseconds)
- Normal stdout allowed (not pure JSON requirement)

**Differences from Other Platforms:**

- Claude Code: Supports ALL 3 hooks (PascalCase, hookSpecificOutput wrapper)
- Gemini CLI: Supports ALL 3 hooks (BeforeTool/AfterTool, PURE JSON stdout required)
- Cursor: Supports 2 hooks only (NO Notification event)

---

## Next Steps

After completing manual validation:

1. Mark DoD checkbox: `[x] Hooks tested on Cursor`
2. Record results in TICK-003 notes
3. Test on other platforms (Claude Code, Gemini CLI)
4. Note: notify.sh must be tested on Claude Code or Gemini CLI (not Cursor)
5. If all passed: Ready for `/validate-pr`

---

**Tester Signature:** **\*\***\_\_\_**\*\***
**Date Completed:** **\*\***\_\_\_**\*\***
**Result:** PASS ☐ / FAIL ☐ / PARTIAL ☐
