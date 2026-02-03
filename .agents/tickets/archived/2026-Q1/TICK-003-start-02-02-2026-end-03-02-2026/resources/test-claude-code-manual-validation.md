# TICK-003 Manual Testing - Claude Code

**Platform:** Claude Code CLI
**Tester:** [Your name]
**Date:** 2026-02-03
**Branch:** feature/TICK-006-ticket-enricher

---

## Current Hooks System

This project uses a **simplified 3-hook system** (576 lines, 59% reduction):

1. **notify.sh** (Notification) - Desktop notifications
2. **auto-format.sh** (PostToolUse) - Auto-format with prettier
3. **protect-secrets.sh** (PreToolUse) - Block sensitive file edits

**Claude Code:** Supports ALL 3 hooks ✅

---

## Pre-Test Setup

### 1. Verify Hook Configuration

```bash
# Check hooks.json exists and is valid
cat .agents/hooks/hooks.json | jq .

# Expected output should show:
# - PreToolUse array with protect-secrets hook
# - PostToolUse array with auto-format hook
# - Notification array with notify hook

# Verify scripts are executable
ls -la .agents/hooks/scripts/
# Should see: -rwxr-xr-x for notify.sh, auto-format.sh, protect-secrets.sh
```

### 2. Verify Claude Code Hook System

```bash
# Check Claude Code settings
cat .claude/settings.json | jq .hooks

# Verify hooks symlink
ls -la .claude/hooks
# Should show: .claude/hooks -> ../.agents/hooks

# Check script permissions
ls -la .agents/hooks/scripts/*.sh
# All should be executable (-rwxr-xr-x)
```

**✅ Prerequisites:**

- Claude Code CLI installed and configured
- Project opened in Claude Code
- `.agents/hooks/hooks.json` exists
- `.claude/settings.json` has hooks configuration
- prettier installed globally (`npm install -g prettier`)

---

## Test 1: Notification Hook (notify.sh)

### Objective

Verify that desktop notifications appear when Claude Code sends a Notification event.

### Platform Support

✅ **Claude Code** - Fully supported
✅ **Gemini CLI** - Fully supported
❌ **Cursor** - NOT supported (Notification event doesn't exist)

### Steps

#### Step 1.1: Trigger Notification Event

**Method 1: Wait for idle prompt**

1. Start Claude Code session
2. Submit a task that takes time (e.g., "Read all files in docs/")
3. Switch to another window
4. Wait for Claude to finish
5. Notification should appear: "Claude Code needs your attention"

**Method 2: Ask Claude to wait**

1. Tell Claude: "Wait for my confirmation"
2. Claude will wait (triggering Notification)
3. Switch windows
4. Check for desktop notification

**Expected Result:**

- Native OS notification appears
- Title: "Claude Code"
- Message: "Claude Code needs your attention"

#### Step 1.2: Verify Hook Execution

```bash
# Check Claude logs (if --debug enabled)
# Should show: Hook executed for Notification event
```

**Manual Verification Checklist:**

- [ ] Desktop notification appeared
- [ ] Notification showed correct title and message
- [ ] Notification was OS-native (not terminal-based)
- [ ] Hook didn't cause errors or delays

---

## Test 2: Auto-Format Hook (auto-format.sh)

### Objective

Verify that files are automatically formatted after Edit/Write operations.

### Platform Support

✅ **Claude Code** - Fully supported
✅ **Gemini CLI** - Fully supported
✅ **Cursor** - Fully supported

### Steps

#### Step 2.1: Test JSON Formatting

```bash
# Create test file with bad formatting
echo '{"name":"test","value":123,"nested":{"key":"value"}}' > test-format.json

# Ask Claude: "Edit test-format.json and change 'test' to 'updated'"
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

#### Step 2.2: Test Markdown Formatting

```bash
# Create markdown with bad formatting
echo '#Header
No space after hash.   Extra spaces.


Too many newlines.' > test-format.md

# Ask Claude: "Fix the typo in test-format.md, change 'hash' to 'heading'"
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

#### Step 2.3: Test Graceful Skip (Non-Supported Files)

```bash
# Create binary-like file
echo "binary content" > test.bin

# Ask Claude: "Edit test.bin and change 'binary' to 'modified'"

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

## Test 3: Protect Secrets Hook (protect-secrets.sh)

### Objective

Verify that edits to sensitive files are blocked before execution.

### Platform Support

✅ **Claude Code** - Fully supported
✅ **Gemini CLI** - Fully supported
✅ **Cursor** - Fully supported

### Steps

#### Step 3.1: Block .env File Edits

```bash
# Create .env file
echo 'API_KEY=secret123
DB_PASSWORD=pass456' > .env

# Ask Claude: "Edit .env and change the API_KEY"
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

#### Step 3.2: Block .key and .pem Files

```bash
# Create sensitive files
echo '-----BEGIN PRIVATE KEY-----
KEY_DATA_HERE
-----END PRIVATE KEY-----' > test.key

echo '-----BEGIN CERTIFICATE-----
CERT_DATA_HERE
-----END CERTIFICATE-----' > test.pem

# Ask Claude: "Edit test.key and test.pem"
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

#### Step 3.3: Allow Normal Files

```bash
# Create normal files
echo '# Test' > README.md
echo '{"setting": "value"}' > config.json

# Ask Claude: "Edit README.md and config.json"
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

#### Step 3.4: Block Protected Directories

```bash
# Create directories and files
mkdir -p secrets credentials
echo 'secret-key-123' > secrets/api-key.txt
echo '{"user": "admin", "pass": "secret"}' > credentials/database.json

# Ask Claude: "Edit files in secrets/ and credentials/ directories"
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

## Test 4: Hook Integration

### Objective

Verify hooks work together without conflicts.

### Steps

#### Step 4.1: Test Multiple Hooks on Same Operation

```bash
# Create a normal JSON file
echo '{"test":"value"}' > normal.json

# Ask Claude: "Edit normal.json"
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

- [ ] protect-secrets checked file first (PreToolUse)
- [ ] Edit operation succeeded
- [ ] auto-format ran after (PostToolUse)
- [ ] File properly formatted
- [ ] No hook conflicts

---

## Test 5: Performance & Error Handling

### Objective

Verify hooks don't significantly impact performance and handle errors gracefully.

### Steps

#### Step 5.1: Test Hook Timeouts

```bash
# Hooks have configured timeouts:
# - notify.sh: 5 seconds
# - auto-format.sh: 30 seconds
# - protect-secrets.sh: 10 seconds

# Normal operations should complete well under timeout
```

**Manual Verification Checklist:**

- [ ] All hooks complete quickly (<5 seconds for normal files)
- [ ] No timeout warnings
- [ ] Operations feel responsive

#### Step 5.2: Test Missing Dependencies

```bash
# Temporarily remove prettier (for auto-format test)
# Hook should gracefully skip formatting

# Ask Claude: "Edit a JSON file"
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

## Summary Checklist

### Hook Execution

- [ ] Test 1: notify.sh - Desktop notifications work ✅
- [ ] Test 2: auto-format.sh - Files auto-formatted ✅
- [ ] Test 3: protect-secrets.sh - Sensitive files blocked ✅
- [ ] Test 4: Multiple hooks work together ✅
- [ ] Test 5: Performance acceptable, errors handled ✅

### Configuration

- [ ] `.agents/hooks/hooks.json` valid
- [ ] `.claude/settings.json` has hooks configuration
- [ ] Scripts are executable
- [ ] Symlinks correct

### Platform Verification

- [ ] Claude Code supports ALL 3 hooks
- [ ] All hooks trigger on correct events
- [ ] No conflicts between hooks
- [ ] Error messages clear and helpful

### Issues Found

_Document any issues here:_

---

## Cleanup

```bash
# Delete test files
rm -f test-format.json test-format.md test.bin .env test.key test.pem
rm -f README.md config.json normal.json
rm -rf secrets/ credentials/
```

---

## Platform Notes

**Claude Code Specific:**

- Supports ALL 3 hooks (notify, auto-format, protect-secrets)
- Uses PascalCase event names (PreToolUse, PostToolUse, Notification)
- Timeout in seconds (not milliseconds)
- Normal stdout allowed (not pure JSON requirement)

**Differences from Other Platforms:**

- Cursor: NO Notification event support (notify.sh excluded)
- Gemini CLI: Requires PURE JSON stdout (critical difference)

---

## Next Steps

After completing manual validation:

1. Mark DoD checkbox: `[x] Hooks tested on Claude Code`
2. Record results in TICK-003 notes
3. Test on other platforms (Cursor, Gemini CLI)
4. If all passed: Ready for `/validate-pr`

---

**Tester Signature:** **\*\***\_\_\_**\*\***
**Date Completed:** **\*\***\_\_\_**\*\***
**Result:** PASS ☐ / FAIL ☐ / PARTIAL ☐
