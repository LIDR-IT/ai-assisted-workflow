# TICK-003 Manual Testing - Gemini CLI

**Platform:** Gemini CLI (Antigravity)
**Tester:** [Your name]
**Date:** 2026-02-03
**Branch:** feature/TICK-006-ticket-enricher

---

## Current Hooks System

This project uses a **simplified 3-hook system** (576 lines, 59% reduction):

1. **notify.sh** (Notification) - Desktop notifications
2. **auto-format.sh** (AfterTool) - Auto-format with prettier
3. **protect-secrets.sh** (BeforeTool) - Block sensitive file edits

**Gemini CLI:** Supports ALL 3 hooks ✅

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

### 2. Verify Gemini CLI Hook System

```bash
# Check Gemini settings.json
cat .gemini/settings.json | jq .hooks

# Verify hooks scripts symlink
ls -la .gemini/hooks/scripts
# Should show: .gemini/hooks/scripts -> ../.agents/hooks/scripts

# Check event format (PascalCase: BeforeTool, AfterTool, Notification)
jq '.hooks | keys' .gemini/settings.json
# Should show: ["BeforeTool", "AfterTool", "Notification"]

# Check timeout units (milliseconds, not seconds)
jq '.hooks.AfterTool[0].hooks[0].timeout' .gemini/settings.json
# Should show: 30000 (30 seconds in milliseconds)
```

**✅ Prerequisites:**

- Gemini CLI installed and configured
- Project opened with Gemini
- `.agents/hooks/hooks.json` exists
- `.gemini/settings.json` has hooks configuration
- prettier installed globally (`npm install -g prettier`)

---

## Test 1: Notification Hook (notify.sh)

### Objective

Verify that desktop notifications appear when Gemini CLI sends a Notification event.

### Platform Support

✅ **Gemini CLI** - Fully supported
✅ **Claude Code** - Fully supported
❌ **Cursor** - NOT supported (Notification event doesn't exist)

### Steps

#### Step 1.1: Trigger Notification Event

**Method 1: Wait for idle prompt**

1. Start Gemini CLI session
2. Submit a task that takes time (e.g., "Read all files in docs/")
3. Switch to another window
4. Wait for Gemini to finish
5. Notification should appear: "Gemini CLI needs your attention"

**Method 2: Ask Gemini to wait**

1. Tell Gemini: "Wait for my confirmation"
2. Gemini will wait (triggering Notification)
3. Switch windows
4. Check for desktop notification

**Expected Result:**

- Native OS notification appears
- Title: "Gemini CLI" or "Antigravity"
- Message: "Gemini CLI needs your attention"

#### Step 1.2: Verify Hook Execution

```bash
# Check Gemini logs (if --debug enabled)
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

✅ **Gemini CLI** - Fully supported (AfterTool event)
✅ **Claude Code** - Fully supported
✅ **Cursor** - Fully supported

### Steps

#### Step 2.1: Test JSON Formatting

```bash
# Create test file with bad formatting
echo '{"name":"test","value":123,"nested":{"key":"value"}}' > test-format.json

# Ask Gemini: "Edit test-format.json and change 'test' to 'updated'"
# Gemini will use Edit tool, triggering auto-format hook

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

# Ask Gemini: "Fix the typo in test-format.md, change 'hash' to 'heading'"
# Gemini will use Edit tool, triggering auto-format hook

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

# Ask Gemini: "Edit test.bin and change 'binary' to 'modified'"

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

✅ **Gemini CLI** - Fully supported (BeforeTool event)
✅ **Claude Code** - Fully supported
✅ **Cursor** - Fully supported

### Steps

#### Step 3.1: Block .env File Edits

```bash
# Create .env file
echo 'API_KEY=secret123
DB_PASSWORD=pass456' > .env

# Ask Gemini: "Edit .env and change the API_KEY"
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
- [ ] Gemini received blocking decision

#### Step 3.2: Block .key and .pem Files

```bash
# Create sensitive files
echo '-----BEGIN PRIVATE KEY-----
KEY_DATA_HERE
-----END PRIVATE KEY-----' > test.key

echo '-----BEGIN CERTIFICATE-----
CERT_DATA_HERE
-----END CERTIFICATE-----' > test.pem

# Ask Gemini: "Edit test.key and test.pem"
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

# Ask Gemini: "Edit README.md and config.json"
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

# Ask Gemini: "Edit files in secrets/ and credentials/ directories"
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

# Ask Gemini: "Edit normal.json"
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

- [ ] protect-secrets checked file first (BeforeTool)
- [ ] Edit operation succeeded
- [ ] auto-format ran after (AfterTool)
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
# - notify.sh: 5000ms (5 seconds)
# - auto-format.sh: 30000ms (30 seconds)
# - protect-secrets.sh: 10000ms (10 seconds)

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

# Ask Gemini: "Edit a JSON file"
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

## Test 6: Gemini-Specific Format Verification

### Objective

Verify that Gemini's settings.json uses the correct format.

### Steps

```bash
# Check Gemini-specific format requirements
cat .gemini/settings.json | jq .hooks
```

**Expected Structure:**

```json
{
  "hooks": {
    "BeforeTool": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "bash ${GEMINI_PROJECT_DIR}/.gemini/hooks/scripts/protect-secrets.sh",
            "timeout": 10000
          }
        ]
      }
    ],
    "AfterTool": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "bash ${GEMINI_PROJECT_DIR}/.gemini/hooks/scripts/auto-format.sh",
            "timeout": 30000
          }
        ]
      }
    ],
    "Notification": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "bash ${GEMINI_PROJECT_DIR}/.gemini/hooks/scripts/notify.sh",
            "timeout": 5000
          }
        ]
      }
    ]
  }
}
```

**Manual Verification Checklist:**

- [ ] Uses PascalCase: `BeforeTool`, `AfterTool`, `Notification` (NOT camelCase)
- [ ] Has ALL 3 event types (BeforeTool, AfterTool, Notification)
- [ ] Nested structure under `"hooks"` key
- [ ] Uses `${GEMINI_PROJECT_DIR}` variable
- [ ] Timeout in MILLISECONDS (5000, 10000, 30000)
- [ ] NO `version` field (unlike Cursor)

---

## Test 7: Gemini-Specific PURE JSON Requirement

### Objective

Verify that hooks output PURE JSON to stdout (critical Gemini requirement).

### Platform Difference

⚠️ **CRITICAL:** Gemini CLI requires PURE JSON ONLY in stdout

- Claude Code: Normal stdout allowed
- Cursor: Normal stdout allowed
- **Gemini CLI:** ONLY valid JSON allowed in stdout

### Verification

```bash
# Test protect-secrets hook directly
echo '{"tool_name": "Write", "tool_input": {"file_path": ".env"}}' | \
  bash .agents/hooks/scripts/protect-secrets.sh

# Should output PURE JSON (no text before/after)
# Example:
# {"permissionDecision": "deny", "reason": "Sensitive file"}
```

**Manual Verification Checklist:**

- [ ] Hook outputs valid JSON only
- [ ] No text before JSON
- [ ] No text after JSON
- [ ] JSON can be parsed with `jq`
- [ ] No echo statements or debug text in stdout

---

## Summary Checklist

### Hook Execution

- [ ] Test 1: notify.sh - Desktop notifications work ✅
- [ ] Test 2: auto-format.sh - Files auto-formatted ✅
- [ ] Test 3: protect-secrets.sh - Sensitive files blocked ✅
- [ ] Test 4: Multiple hooks work together ✅
- [ ] Test 5: Performance acceptable, errors handled ✅
- [ ] Test 6: Gemini-specific format correct ✅
- [ ] Test 7: PURE JSON stdout requirement met ✅

### Configuration

- [ ] `.agents/hooks/hooks.json` valid
- [ ] `.gemini/settings.json` has hooks configuration
- [ ] Scripts are executable
- [ ] Symlinks correct

### Platform Verification

- [ ] Gemini CLI supports ALL 3 hooks
- [ ] All hooks trigger on correct events
- [ ] No conflicts between hooks
- [ ] Error messages clear and helpful
- [ ] PURE JSON stdout requirement met

### Issues Found

_Document any issues here:_

---

## Platform Notes

**Gemini CLI Specific:**

- Supports ALL 3 hooks (notify, auto-format, protect-secrets)
- Uses PascalCase event names (BeforeTool, AfterTool, Notification)
- Timeout in MILLISECONDS (×1000): 5000, 10000, 30000
- **CRITICAL:** Requires PURE JSON ONLY in stdout (no text allowed)
- Nested structure under `"hooks"` key
- Uses `GEMINI_PROJECT_DIR` variable

**Differences from Other Platforms:**

- Claude Code: PascalCase (PreToolUse, PostToolUse), seconds timeout, normal stdout
- Cursor: camelCase (preToolUse, postToolUse), NO Notification, seconds timeout
- Gemini CLI: PascalCase (BeforeTool, AfterTool), milliseconds timeout, **PURE JSON stdout**

---

## ⚠️ Known Requirements

### Gemini CLI REQUIRES:

1. **PURE JSON Stdout**
   - NO text before JSON output
   - NO text after JSON output
   - NO echo statements or debug messages
   - ONLY valid JSON allowed in stdout
   - This is CRITICAL for Gemini CLI compatibility

2. **Event Name Differences**
   - Uses `BeforeTool` (not `PreToolUse`)
   - Uses `AfterTool` (not `PostToolUse`)
   - Uses `Notification` (same as Claude Code)

3. **Timeout Units**
   - MUST be in milliseconds (not seconds)
   - Example: 30000 (30 seconds), not 30

4. **Environment Variable**
   - Uses `GEMINI_PROJECT_DIR` (not `CLAUDE_PLUGIN_ROOT` or `CURSOR_PROJECT_DIR`)

---

## Cleanup

```bash
# Delete test files
rm -f test-format.json test-format.md test.bin
rm -f .env test.key test.pem
rm -f README.md config.json normal.json
rm -rf secrets/ credentials/
```

---

## Next Steps

After completing manual validation:

1. Mark DoD checkbox: `[x] Hooks tested on Gemini CLI`
2. Record results in TICK-003 notes
3. Test on other platforms (Claude Code, Cursor)
4. If all passed: Ready for `/validate-pr`

---

**Tester Signature:** **\*\***\_\_\_**\*\***
**Date Completed:** **\*\***\_\_\_**\*\***
**Result:** PASS ☐ / FAIL ☐ / PARTIAL ☐
