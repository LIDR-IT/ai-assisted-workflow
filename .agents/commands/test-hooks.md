---
name: test-hooks
description: Interactive testing for cross-platform hooks (platform-specific coverage)
arguments:
  - name: platform
    description: Platform to test (claude-code, cursor, gemini-cli)
    required: true
---

# Test Hooks Command

Interactive testing guide for cross-platform development hooks with platform-specific coverage.

## Usage

```bash
/test-hooks claude-code  # Tests: auto-format + protect-secrets (2 hooks)
/test-hooks cursor       # Tests: auto-format only (1 hook) - platform limitation
/test-hooks gemini-cli   # Tests: auto-format + protect-secrets (2 hooks)
```

## What This Command Does

This command provides **interactive testing** for development hooks with automatic platform detection:

### Hooks Available

1. **auto-format.sh** - Automatic formatting after Edit/Write
   - ✅ Claude Code (PostToolUse)
   - ✅ Cursor (afterFileEdit)
   - ✅ Gemini CLI (AfterTool)

2. **protect-secrets.sh** - Block edits to sensitive files (before edit)
   - ✅ Claude Code (PreToolUse)
   - ❌ **Cursor (NOT SUPPORTED - no beforeFileEdit event)**
   - ✅ Gemini CLI (BeforeTool)

3. **notify.sh** - Desktop notifications (not tested here)
   - ✅ Claude Code (Notification event)
   - ❌ Cursor (NOT SUPPORTED)
   - ✅ Gemini CLI (Notification event)

### Platform Coverage

| Platform    | auto-format | protect-secrets | Tests Run   |
| ----------- | ----------- | --------------- | ----------- |
| Claude Code | ✅          | ✅              | 7 tests     |
| **Cursor**  | ✅          | ❌ Limitation   | **3 tests** |
| Gemini CLI  | ✅          | ✅              | 7 tests     |

**Important:** When testing on **Cursor**, only auto-format tests will run (Tests 1.1-1.3). The protect-secrets tests (Tests 2.1-2.4) will be **automatically skipped** due to platform limitations.

---

## Implementation

When invoked, the agent should guide the user through testing both hooks:

### Step 1: Validate Platform & Detect Limitations

```javascript
const validPlatforms = ["claude-code", "cursor", "gemini-cli"];
const platform = args.platform.toLowerCase();

if (!validPlatforms.includes(platform)) {
  return `❌ Invalid platform: ${args.platform}

Valid platforms:
  - claude-code   (Claude Code CLI) - 7 tests
  - cursor        (Cursor IDE) - 3 tests (limited)
  - gemini-cli    (Gemini CLI) - 7 tests

Usage: /test-hooks <platform>`;
}

// Detect platform limitations
const isCursor = platform === "cursor";
const testsToRun = isCursor ? 3 : 7;
const hooksToTest = isCursor ? 1 : 2;
```

### Step 2: Present Welcome Screen

**For Claude Code & Gemini CLI (Full Support):**

```
🧪 Testing Cross-Platform Hooks - ${PLATFORM}

Platform: ${PLATFORM_NAME}
Hooks to Test: 2
  1. auto-format.sh (PostToolUse/AfterTool - Edit|Write)
  2. protect-secrets.sh (PreToolUse/BeforeTool - Edit|Write)

Duration: ~10 minutes
Tests: 7 (3 auto-format + 4 protect-secrets)
Type: Interactive (requires agent actions)

Ready to begin? (yes/no)
```

**For Cursor (Limited Support):**

```
🧪 Testing Cross-Platform Hooks - Cursor IDE

⚠️  PLATFORM LIMITATION DETECTED

Platform: Cursor IDE
Hooks to Test: 1 (out of 2)
  ✅ 1. auto-format.sh (afterFileEdit - Edit|Write)
  ❌ 2. protect-secrets.sh (SKIPPED - Cursor lacks beforeFileEdit event)

Duration: ~5 minutes
Tests: 3 (auto-format only)
Type: Interactive (requires agent actions)

Why is protect-secrets skipped?
  Cursor does NOT support hooks that run BEFORE file edits
  (no beforeFileEdit/PreToolUse event available).

  Protection in Cursor relies on:
  - AI agent rules (.cursor/rules/protect-secrets.mdc)
  - Manual review
  - Git pre-commit hooks

Ready to begin? (yes/no)
```

---

## Test Flow

### Test 1: Auto-Format Hook (PostToolUse)

**Objective:** Verify that files are automatically formatted after Edit/Write

#### Test 1.1: Format JSON File

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Test 1.1: Auto-Format JSON File
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Objective: Verify that JSON files are auto-formatted after editing

What I will do:
1. Create a test JSON file with bad formatting
2. Use Edit tool to modify it (triggers auto-format hook)
3. Check if file was auto-formatted by prettier

Expected behavior:
  - Hook detects Edit tool usage
  - Prettier formats the file automatically
  - No errors occur

Ready to execute? (yes/skip)
```

**If user says yes:**

**Agent actions:**

```javascript
// Create test file with bad formatting
Write("test-format.json", `{"name":"test","value":123,"nested":{"key":"value"}}`);

// Use Edit to trigger the hook
Edit(
  "test-format.json",
  `{"name":"test","value":123,"nested":{"key":"value"}}`,
  `{"name":"test-updated","value":123,"nested":{"key":"value"}}`
);

// Read the result
Read("test-format.json");
```

**Agent checks:**

- File should now be formatted with proper indentation
- File content:

```json
{
  "name": "test-updated",
  "value": 123,
  "nested": {
    "key": "value"
  }
}
```

**Validation:**

```
✅ Test 1.1 Result

File formatted: test-format.json

Before (minified):
{"name":"test-updated","value":123,"nested":{"key":"value"}}

After (prettier):
{
  "name": "test-updated",
  "value": 123,
  "nested": {
    "key": "value"
  }
}

Did the file get auto-formatted correctly? (yes/no)
```

#### Test 1.2: Format Markdown File

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Test 1.2: Auto-Format Markdown File
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Objective: Verify markdown files are auto-formatted

What I will do:
1. Create markdown with inconsistent formatting
2. Edit the file (triggers hook)
3. Check if prettier formatted it

Ready to execute? (yes/skip)
```

**Agent actions:**

```javascript
Write(
  "test-format.md",
  `#Header\nNo space after hash.   Extra spaces.  \n\n\n\nToo many newlines.`
);
Edit("test-format.md", "No space", "Fixed spacing");
Read("test-format.md");
```

**Expected result:**

```markdown
# Header

Fixed spacing after hash. Extra spaces.

Too many newlines.
```

#### Test 1.3: Skip Non-Supported Files

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Test 1.3: Skip Non-Supported Files
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Objective: Verify hook gracefully skips files prettier can't format

What I will do:
1. Create a binary-like file (.bin)
2. Edit it (hook should skip formatting)
3. Verify no errors occurred

Ready to execute? (yes/skip)
```

**Agent actions:**

```javascript
Write("test.bin", "binary content here");
Edit("test.bin", "binary", "modified");
Read("test.bin");
```

**Expected:**

- Hook runs but skips formatting (not a supported type)
- No errors thrown
- File modified successfully

---

### Test 2: Protect Secrets Hook (PreToolUse/BeforeTool)

**⚠️ IMPORTANT: Skip this entire section if platform is Cursor**

If platform is Cursor, display this message and skip to cleanup:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️  Test 2: Protect Secrets Hook - SKIPPED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Platform: Cursor
Reason: Cursor does NOT support beforeFileEdit event

The protect-secrets hook requires running BEFORE file edits
to block dangerous operations. Cursor only supports hooks
that run AFTER edits (afterFileEdit).

Protection in Cursor:
  - Rule: .cursor/rules/protect-secrets.mdc
  - Agent instructions to refuse editing sensitive files
  - Manual review by developer
  - Git pre-commit hooks

Tests 2.1-2.4 automatically skipped.

Continue to summary? (yes)
```

**For Claude Code & Gemini CLI only:**

**Objective:** Verify that edits to sensitive files are blocked

#### Test 2.1: Block .env File

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Test 2.1: Block Editing .env File
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Objective: Verify hook blocks edits to .env files

What I will do:
1. Create a .env file
2. Attempt to edit it (should be BLOCKED by hook)
3. Verify edit was prevented

Expected behavior:
  - Hook detects Edit tool targeting .env
  - Hook blocks the edit (exit code 2)
  - Error message: "Cannot edit sensitive file"

Ready to execute? (yes/skip)
```

**Agent actions:**

```javascript
// Create .env file
Write(".env", "API_KEY=secret123\nDB_PASSWORD=pass456");

// Try to edit (should be blocked)
try {
  Edit(".env", "secret123", "newsecret");
  // If we reach here, hook FAILED
  result = "❌ Hook did NOT block the edit!";
} catch (error) {
  // Hook should block with error
  if (error.includes("Cannot edit sensitive file") || error.includes("Blocked")) {
    result = "✅ Hook correctly blocked the edit";
  } else {
    result = "⚠️ Edit blocked but with unexpected error";
  }
}
```

**Validation:**

```
✅ Test 2.1 Result

Attempted to edit: .env
Hook response: Blocked - Cannot edit sensitive file '.env'

Edit was blocked: YES ✅
File unchanged: YES ✅

Did the hook correctly block the .env edit? (yes/no)
```

#### Test 2.2: Block .key and .pem Files

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Test 2.2: Block Key and Certificate Files
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Objective: Verify hook blocks .key and .pem files

What I will do:
1. Create test.key and test.pem files
2. Attempt to edit both (should be BLOCKED)
3. Verify both edits prevented

Ready to execute? (yes/skip)
```

**Agent actions:**

```javascript
// Create sensitive files
Write("test.key", "-----BEGIN PRIVATE KEY-----\nKEY_DATA_HERE\n-----END PRIVATE KEY-----");
Write("test.pem", "-----BEGIN CERTIFICATE-----\nCERT_DATA_HERE\n-----END CERTIFICATE-----");

// Try to edit (both should be blocked)
results = [];
for (file of ["test.key", "test.pem"]) {
  try {
    Edit(file, "KEY_DATA", "MODIFIED");
    results.push({ file, blocked: false });
  } catch (error) {
    results.push({ file, blocked: true, error });
  }
}
```

**Expected:**
Both files blocked with appropriate error messages.

#### Test 2.3: Allow Normal Files

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Test 2.3: Allow Editing Normal Files
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Objective: Verify hook only blocks sensitive files, not normal ones

What I will do:
1. Create normal files (README.md, config.json)
2. Edit them (should be ALLOWED)
3. Verify edits succeeded

Ready to execute? (yes/skip)
```

**Agent actions:**

```javascript
Write("README.md", "# Test\nContent here");
Write("config.json", '{"setting": "value"}');

Edit("README.md", "Content here", "Updated content");
Edit("config.json", '"value"', '"updated"');

Read("README.md");
Read("config.json");
```

**Expected:**
Both edits succeed without being blocked.

#### Test 2.4: Block Files in Protected Directories

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Test 2.4: Block Protected Directories
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Objective: Verify hook blocks files in secrets/ and credentials/ dirs

What I will do:
1. Create files in secrets/ and credentials/
2. Attempt to edit them (should be BLOCKED)
3. Verify protection

Ready to execute? (yes/skip)
```

**Agent actions:**

```javascript
// Create directories and files
Write("secrets/api-key.txt", "secret-key-123");
Write("credentials/database.json", '{"user": "admin", "pass": "secret"}');

// Try to edit (should be blocked)
try {
  Edit("secrets/api-key.txt", "secret-key", "new-key");
} catch (error) {
  secretsBlocked = error.includes("Blocked");
}

try {
  Edit("credentials/database.json", "secret", "newsecret");
} catch (error) {
  credsBlocked = error.includes("Blocked");
}
```

**Expected:**
Both edits blocked due to directory patterns.

---

## Results Summary

After all tests complete, show platform-specific summary:

### For Cursor (Limited Testing)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎉 Hook Testing Complete - Cursor IDE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Auto-Format Hook (afterFileEdit):
  ✅ 1.1 - JSON formatting
  ✅ 1.2 - Markdown formatting
  ✅ 1.3 - Skip unsupported files

Protect Secrets Hook:
  ⏭️  2.1-2.4 - SKIPPED (platform limitation)

Overall: 3/3 available tests passed ✅

Platform: Cursor IDE
Coverage: Limited (1 of 2 hooks)
Duration: ${DURATION} minutes

⚠️  Note: protect-secrets hook cannot be tested on Cursor
    due to lack of beforeFileEdit event support.

    For full hook testing, use Claude Code or Gemini CLI.

Cleanup: Delete test files? (yes/no)
```

### For Claude Code & Gemini CLI (Full Testing)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎉 Hook Testing Complete - ${PLATFORM}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Auto-Format Hook (PostToolUse/AfterTool):
  ✅ 1.1 - JSON formatting
  ✅ 1.2 - Markdown formatting
  ✅ 1.3 - Skip unsupported files

Protect Secrets Hook (PreToolUse/BeforeTool):
  ✅ 2.1 - Blocked .env file
  ✅ 2.2 - Blocked .key and .pem files
  ✅ 2.3 - Allowed normal files
  ✅ 2.4 - Blocked protected directories

Overall: 7/7 tests passed ✅

Platform: ${PLATFORM}
Coverage: Full (2 of 2 hooks)
Duration: ${DURATION} minutes

These hooks work cross-platform with same behavior.

Cleanup: Delete test files? (yes/no)
```

---

## Cleanup

If user confirms cleanup:

**For Cursor (only auto-format test files):**

```javascript
const testFiles = [
  "test-format.json",
  "test-format.md",
  "test.bin",
  "test.xyz",
  ".env.test", // If created during explanation
];

for (file of testFiles) {
  Bash(`rm -f "${file}"`);
}
```

**For Claude Code & Gemini CLI (all test files):**

```javascript
const testFiles = [
  "test-format.json",
  "test-format.md",
  "test.bin",
  "test.xyz",
  ".env",
  ".env.test",
  "test.key",
  "test.pem",
  "README.md",
  "config.json",
  "secrets/api-key.txt",
  "credentials/database.json",
];

for (file of testFiles) {
  Bash(`rm -f "${file}"`);
}

Bash("rmdir secrets credentials 2>/dev/null || true");
```

---

## Agent Instructions

### Phase 1: Setup & Platform Detection

1. **Validate platform argument**
   - Check if platform is valid (claude-code, cursor, gemini-cli)
   - If invalid, show error with usage

2. **Detect platform limitations**

   ```javascript
   const isCursor = platform === "cursor";
   const testsToRun = isCursor ? 3 : 7;
   const hooksToTest = isCursor ? 1 : 2;
   const skipProtectSecrets = isCursor;
   ```

3. **Show platform-specific welcome screen**
   - For Cursor: Show warning about limitations + 1 hook
   - For Claude/Gemini: Show full capability + 2 hooks

4. **Wait for user confirmation**

### Phase 2: Test Execution

**Test 1 (Auto-Format) - Run for ALL platforms:**

For each test (1.1, 1.2, 1.3):

1. **Announce test**
   - Show test number, name, objective
   - Explain what agent will do
   - Ask: "Ready to execute?"

2. **Execute test**
   - Perform Write/Edit operations
   - Let hooks trigger automatically
   - Capture results

3. **Show results**
   - Display before/after states
   - Highlight hook behavior
   - Ask: "Did this work correctly?"

4. **Record result**
   - Mark as passed/failed
   - Capture notes if needed

**Test 2 (Protect-Secrets) - CONDITIONAL:**

```javascript
if (isCursor) {
  // Skip Test 2 entirely for Cursor
  showMessage(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️  Test 2: Protect Secrets Hook - SKIPPED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Platform: Cursor
Reason: Cursor does NOT support beforeFileEdit event

Tests 2.1-2.4 automatically skipped.
Continue to summary? (yes)
  `);

  // Skip to Phase 3: Summary
} else {
  // Run Test 2.1-2.4 for Claude Code & Gemini CLI
  // ... execute protect-secrets tests
}
```

### Phase 3: Summary

1. **Generate platform-specific results table**
   - Cursor: 3/3 tests (auto-format only)
   - Claude/Gemini: 7/7 tests (auto-format + protect-secrets)

2. **Calculate pass/fail counts**
   - Count only tests that were actually run
   - Mark skipped tests as "⏭️ SKIPPED" not failed

3. **Show platform-specific notes**
   - Cursor: Add warning about limited coverage
   - Claude/Gemini: Confirm full cross-platform behavior

4. **Offer cleanup**
   - Cursor: Delete only auto-format test files
   - Claude/Gemini: Delete all test files including secrets

### Phase 4: Next Steps

**If all available tests passed on Cursor:**

```
✅ Hooks working correctly on Cursor! (limited coverage)

Test Results:
  ✅ auto-format.sh - 3/3 tests passed
  ⏭️ protect-secrets.sh - skipped (platform limitation)

Next steps:
  - For FULL hook testing, use: /test-hooks claude-code
  - Or test on: /test-hooks gemini-cli
  - Continue with other Cursor-specific validation

⚠️  Remember: Cursor tested only 1 of 2 hooks.
    Complete validation requires Claude Code or Gemini CLI.
```

**If all tests passed on Claude/Gemini:**

```
✅ Hooks working correctly on ${platform}! (full coverage)

Test Results:
  ✅ auto-format.sh - 3/3 tests passed
  ✅ protect-secrets.sh - 4/4 tests passed

Next steps:
  - Test on another platform: /test-hooks <platform>
  - Or mark TICK-003 testing complete

Available platforms:
${remaining_platforms}
```

**If any tests failed:**

```
⚠️ Some tests failed

Failed tests:
${failed_test_list}

Recommendations:
  - Review hook scripts in .agents/hooks/scripts/
  - Check hook configuration (.agents/hooks/hooks.json)
  - Verify prettier is installed (for auto-format)
  - Check tool permissions (for protect-secrets)
  - Review platform-specific hook events
```

---

## Platform-Specific Notes

### Cursor Limitations

**⚠️ CRITICAL: Cursor does NOT support beforeFileEdit hooks**

This means:

- ✅ auto-format.sh works (runs AFTER edits)
- ❌ protect-secrets.sh **cannot work** (needs to run BEFORE edits)
- ✅ Only 3 of 7 tests can run on Cursor

**Protection alternatives in Cursor:**

1. AI agent rule: `.cursor/rules/protect-secrets.mdc`
2. Manual code review
3. Git pre-commit hooks

**Test coverage:**

- Cursor: 3 tests (auto-format only)
- Claude Code: 7 tests (full)
- Gemini CLI: 7 tests (full)

### Claude Code & Gemini CLI (Full Support)

These platforms support ALL hook events:

- ✅ PreToolUse/BeforeTool (before edits) - protect-secrets
- ✅ PostToolUse/AfterTool (after edits) - auto-format
- ✅ Notification events (not tested here) - notify.sh

**Hooks are truly cross-platform** between these two because they:

- Use standard bash (no platform-specific APIs)
- Support same event lifecycle (before/after/notification)
- Output JSON (compatible format)
- No UI dependencies

### Requirements (All Platforms)

- `prettier` must be installed for auto-format tests
- `jq` must be installed for JSON parsing in hooks

### Verification Commands

**Check prettier:**

```bash
which prettier
prettier --version
```

**Check jq:**

```bash
which jq
jq --version
```

**Install if missing:**

```bash
# prettier
npm install -g prettier

# jq (macOS)
brew install jq
```

---

## Hook Behavior Details

### auto-format.sh

**Triggers:** After Edit or Write tool usage
**Timeout:** 30 seconds
**Behavior:**

- Reads file path from tool input JSON
- Checks if prettier is installed
- Formats file if supported type
- Silently skips if unsupported
- Never blocks or fails

**Supported files:**

- JSON (.json)
- Markdown (.md)
- JavaScript (.js, .ts)
- CSS (.css, .scss)
- HTML (.html)

### protect-secrets.sh

**Triggers:** Before Edit or Write tool usage
**Timeout:** 10 seconds
**Behavior:**

- Reads file path from tool input JSON
- Checks against protected patterns
- Blocks edit if match found (exit 2)
- Allows edit if no match (exit 0)

**Protected patterns:**

- `.env` (environment files)
- `.pem` (certificates)
- `.key` (private keys)
- `secrets/` (directory)
- `credentials/` (directory)
- `.git/config` (git config)
- `package-lock.json` (lock file)

---

## Example Sessions

### Example 1: Cursor (Limited Testing)

**User:** `/test-hooks cursor`

**Agent:**

```
🧪 Testing Cross-Platform Hooks - Cursor IDE

⚠️  PLATFORM LIMITATION DETECTED

Platform: Cursor IDE
Hooks to Test: 1 (out of 2)
  ✅ 1. auto-format.sh (afterFileEdit - Edit|Write)
  ❌ 2. protect-secrets.sh (SKIPPED - Cursor lacks beforeFileEdit event)

Duration: ~5 minutes
Tests: 3 (auto-format only)
Type: Interactive (requires agent actions)

Why is protect-secrets skipped?
  Cursor does NOT support hooks that run BEFORE file edits
  (no beforeFileEdit/PreToolUse event available).

  Protection in Cursor relies on:
  - AI agent rules (.cursor/rules/protect-secrets.mdc)
  - Manual review
  - Git pre-commit hooks

Ready to begin? (yes/no)
```

**User:** `yes`

**Agent runs tests 1.1, 1.2, 1.3, then:**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️  Test 2: Protect Secrets Hook - SKIPPED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Platform: Cursor
Reason: Cursor does NOT support beforeFileEdit event

Tests 2.1-2.4 automatically skipped.

Continue to summary? (yes)
```

**User:** `yes`

**Agent:**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎉 Hook Testing Complete - Cursor IDE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Auto-Format Hook (afterFileEdit):
  ✅ 1.1 - JSON formatting
  ✅ 1.2 - Markdown formatting
  ✅ 1.3 - Skip unsupported files

Protect Secrets Hook:
  ⏭️  2.1-2.4 - SKIPPED (platform limitation)

Overall: 3/3 available tests passed ✅

⚠️  Note: For FULL hook testing (7/7 tests),
    use /test-hooks claude-code or /test-hooks gemini-cli

Cleanup: Delete test files? (yes/no)
```

---

### Example 2: Claude Code (Full Testing)

**User:** `/test-hooks claude-code`

**Agent:**

```
🧪 Testing Cross-Platform Hooks - Claude Code CLI

Platform: Claude Code CLI
Hooks to Test: 2
  1. auto-format.sh (PostToolUse - Edit|Write)
  2. protect-secrets.sh (PreToolUse - Edit|Write)

Duration: ~10 minutes
Tests: 7 (3 auto-format + 4 protect-secrets)
Type: Interactive (I'll perform Edit/Write actions)

Ready to begin? (yes/no)
```

**User:** `yes`

**Agent runs all tests (1.1-1.3, 2.1-2.4), then:**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎉 Hook Testing Complete - Claude Code CLI
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Auto-Format Hook (PostToolUse):
  ✅ 1.1 - JSON formatting
  ✅ 1.2 - Markdown formatting
  ✅ 1.3 - Skip unsupported files

Protect Secrets Hook (PreToolUse):
  ✅ 2.1 - Blocked .env file
  ✅ 2.2 - Blocked .key and .pem files
  ✅ 2.3 - Allowed normal files
  ✅ 2.4 - Blocked protected directories

Overall: 7/7 tests passed ✅

Platform: Claude Code CLI
Coverage: Full (2 of 2 hooks)

These hooks work cross-platform with same behavior.

Cleanup: Delete test files? (yes/no)
```

---

## Integration with TICK-003

This command validates the hook implementation for TICK-003.

**After testing on all platforms:**

1. Mark DoD checkbox: `[x] Hooks tested on all platforms`
2. Add results to TICK-003 notes
3. If all passed: Ready for `/validate-pr`
4. If issues found: Fix hooks before proceeding

---

## See Also

- Hook scripts: `.agents/hooks/scripts/`
- Hook config: `.agents/hooks/hooks.json`
- Hook documentation: `docs/references/hooks/`
