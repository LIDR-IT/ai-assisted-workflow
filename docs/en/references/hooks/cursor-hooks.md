# Cursor Hooks Reference

Complete reference for implementing hooks in Cursor with platform-specific details.

## Overview

Cursor supports project-level hooks with **limited event support**. The system uses a flat JSON structure with camelCase event names and requires a version field.

**⚠️ CRITICAL LIMITATIONS (Verified in Cursor v2.3.35):**

1. Cursor does **NOT** use `preToolUse`/`postToolUse` - these are INVALID event names
2. Cursor uses specific events like `afterFileEdit`, `afterTabFileEdit`, etc.
3. There is **NO** `beforeFileEdit` event - cannot block edits before they happen
4. There is **NO** `Notification` event support

## Supported Hooks (2 of 3)

| Hook                        | Cursor Event     | Status           | Description                     |
| --------------------------- | ---------------- | ---------------- | ------------------------------- |
| **auto-format.sh**          | `afterFileEdit`  | ✅ Supported     | Auto-format with prettier       |
| **protect-secrets-post.sh** | `afterFileEdit`  | ✅ Post-edit     | Detect & revert sensitive edits |
| **notify.sh**               | ❌ No equivalent | ❌ NOT supported | No Notification event exists    |

**Note:** For sensitive file protection, Cursor uses a two-layer approach:

1. **AI Rule** (`protect-secrets.mdc`): Instructs AI not to edit sensitive files
2. **Post-edit Hook** (`protect-secrets-post.sh`): Detects and reverts if rule is bypassed

## Valid Cursor Hook Events (v2.3.35)

| Event                  | Description                      | Use Case                      |
| ---------------------- | -------------------------------- | ----------------------------- |
| `beforeShellExecution` | Before shell command runs        | Validate shell commands       |
| `afterShellExecution`  | After shell command completes    | Log or react to shell output  |
| `beforeMCPExecution`   | Before MCP tool runs             | Validate MCP calls            |
| `afterMCPExecution`    | After MCP tool completes         | React to MCP results          |
| `beforeReadFile`       | Before reading a file            | Control file access           |
| **`afterFileEdit`**    | **After agent edits a file**     | **Auto-format (recommended)** |
| `beforeTabFileRead`    | Before reading file in tab       | Control tab file access       |
| **`afterTabFileEdit`** | **After user edits file in tab** | **Auto-format user edits**    |
| `beforeSubmitPrompt`   | Before prompt is submitted       | Validate prompts              |
| `afterAgentResponse`   | After agent responds             | Log or process responses      |
| `afterAgentThought`    | After agent thought process      | Debug/logging                 |
| `stop`                 | When agent stops                 | Cleanup tasks                 |

**Important Notes:**

- ✅ `afterFileEdit` - Triggers when the AI agent edits a file
- ✅ `afterTabFileEdit` - Triggers when user manually edits in a tab
- ❌ `beforeFileEdit` - **DOES NOT EXIST** - Cannot block edits
- ❌ `preToolUse`/`postToolUse` - **INVALID** event names in Cursor

## Configuration Format

### File Location

`.cursor/hooks.json` (separate file, NOT in settings)

### Basic Structure

```json
{
  "version": 1,
  "hooks": {
    "afterFileEdit": [
      {
        "command": "bash .cursor/hooks/scripts/protect-secrets-post.sh",
        "timeout": 10
      },
      {
        "command": "bash .cursor/hooks/scripts/auto-format.sh",
        "timeout": 30
      }
    ],
    "afterTabFileEdit": [
      {
        "command": "bash .cursor/hooks/scripts/protect-secrets-post.sh",
        "timeout": 10
      },
      {
        "command": "bash .cursor/hooks/scripts/auto-format.sh",
        "timeout": 30
      }
    ]
  }
}
```

**⚠️ CRITICAL: Hook Reliability Warning (Verified in v2.3.35)**

Cursor hooks are **best-effort**, not guaranteed:

- Hooks may occasionally fail to trigger (race conditions, timing issues)
- No blocking/pre-edit hooks available (`beforeFileEdit` does not exist)
- Multiple rapid edits may skip some hook executions
- For guaranteed formatting, use **Husky + lint-staged** (see section below)

**⚠️ CRITICAL: Multiple Hooks Behavior (Verified in v2.3.35)**

Cursor supports **multiple hooks per event**. Key behaviors:

| Aspect               | Behavior                                                 |
| -------------------- | -------------------------------------------------------- |
| **Execution**        | ALL hooks in the array are executed                      |
| **Order**            | Sequential (first to last in array)                      |
| **Input**            | Each hook receives the SAME JSON input                   |
| **Failure Handling** | If a hook fails (exit ≠ 0), the next hook STILL runs     |
| **Independence**     | Hooks are isolated - one's failure doesn't affect others |

**Hook Order Matters!** The `protect-secrets-post.sh` hook **MUST be first** because:

- It needs to detect sensitive file patterns before any modifications
- It reverts changes using `git checkout` if a sensitive pattern is matched
- If `auto-format.sh` runs first and modifies the file, the revert may not work correctly

**Example: Multiple Hooks Execution Flow**

```
afterFileEdit: [hook1, hook2, hook3]

hook1 → executes (fails with exit 1) → CONTINUES
hook2 → executes (succeeds) → CONTINUES
hook3 → executes (times out) → CONTINUES

Result: All hooks attempted, edit NOT reverted
```

**Required Fields:**

- `version`: Must be `1` (required field)
- `hooks`: Object containing event arrays
- `command`: Path to hook script
- `timeout`: Timeout in seconds

**Note:** Unlike Claude Code/Gemini, Cursor does NOT use `matcher` field for file-based events.

### Current System Configuration

The hooks system uses **2 hooks** in Cursor (both run on every file edit):

```json
{
  "version": 1,
  "hooks": {
    "afterFileEdit": [
      {
        "command": "bash .cursor/hooks/scripts/protect-secrets-post.sh",
        "timeout": 10
      },
      {
        "command": "bash .cursor/hooks/scripts/auto-format.sh",
        "timeout": 30
      }
    ],
    "afterTabFileEdit": [
      {
        "command": "bash .cursor/hooks/scripts/protect-secrets-post.sh",
        "timeout": 10
      },
      {
        "command": "bash .cursor/hooks/scripts/auto-format.sh",
        "timeout": 30
      }
    ]
  }
}
```

**Hook Support in Cursor:**

| Hook                    | Event           | Status         | Description                     |
| ----------------------- | --------------- | -------------- | ------------------------------- |
| protect-secrets-post.sh | `afterFileEdit` | ✅ Supported   | Post-edit detection & revert    |
| auto-format.sh          | `afterFileEdit` | ✅ Supported   | Auto-format with prettier       |
| protect-secrets.sh      | ❌ None         | ❌ No pre-edit | No `beforeFileEdit` in Cursor   |
| notify.sh               | ❌ None         | ❌ No notify   | No `Notification` event support |

````

## Format Comparison

### Cursor vs Claude Code

| Feature                | Cursor                   | Claude Code             |
| ---------------------- | ------------------------ | ----------------------- |
| **Event format**       | camelCase                | PascalCase              |
| **PreToolUse event**   | `preToolUse`             | `PreToolUse`            |
| **PostToolUse event**  | `postToolUse`            | `PostToolUse`           |
| **Notification event** | ❌ Not supported         | `Notification`          |
| **Structure**          | Flat (command direct)    | Nested (hooks array)    |
| **Version field**      | ✅ Required (version: 1) | ❌ Not used             |
| **Name field**         | ❌ Not used              | ❌ Not used             |
| **Config location**    | `.cursor/hooks.json`     | `.claude/settings.json` |
| **Environment var**    | `CURSOR_PROJECT_DIR`     | `CLAUDE_PLUGIN_ROOT`    |
| **Timeout unit**       | seconds                  | seconds                 |

### Cursor vs Gemini CLI

| Feature                | Cursor                   | Gemini CLI                   |
| ---------------------- | ------------------------ | ---------------------------- |
| **Event format**       | camelCase                | PascalCase (different names) |
| **PreToolUse event**   | `preToolUse`             | `BeforeTool`                 |
| **PostToolUse event**  | `postToolUse`            | `AfterTool`                  |
| **Notification event** | ❌ Not supported         | `Notification`               |
| **Structure**          | Flat                     | Nested (hooks array)         |
| **Version field**      | ✅ Required (version: 1) | ❌ Not used                  |
| **Name field**         | ❌ Not used              | ✅ Optional                  |
| **Config location**    | `.cursor/hooks.json`     | `.gemini/settings.json`      |
| **Environment var**    | `CURSOR_PROJECT_DIR`     | `GEMINI_PROJECT_DIR`         |
| **Timeout unit**       | seconds                  | milliseconds (×1000)         |
| **Stdout requirement** | Normal                   | ⚠️ PURE JSON ONLY            |

## Hook Scripts

### 1. protect-secrets.sh (preToolUse)

**Purpose:** Block edits to sensitive files before they happen

**Event:** `preToolUse`
**Matcher:** `Edit|Write`
**Timeout:** 10 seconds

**Protected Patterns:**

- `.env` files
- `.pem`, `.key` files
- `secrets/` directories
- `credentials/` directories
- `.git/config`
- `package-lock.json`

**Exit Codes:**

- `0` - File allowed, continue
- `2` - File blocked, prevent edit

**Example Output:**

```json
{
  "decision": "deny",
  "reason": "Cannot edit sensitive file: .env"
}
````

### 2. auto-format.sh (postToolUse)

**Purpose:** Automatically format files after editing with prettier

**Event:** `postToolUse`
**Matcher:** `Edit|Write`
**Timeout:** 30 seconds

**Requirements:**

- Optional: `prettier` installed (`npm install -g prettier`)
- Fails gracefully if prettier not available

**Supported Files:** All prettier-supported formats (JS, TS, JSON, CSS, MD, etc.)

**Exit Codes:**

- `0` - Success (formatted or skipped gracefully)

**Example Output:**

```json
{
  "decision": "allow",
  "systemMessage": "Auto-formatted with prettier"
}
```

### 3. notify.sh ❌ NOT AVAILABLE

**Reason:** Cursor does NOT support Notification events

**Platforms:** Only works on Claude Code and Gemini CLI

**Workaround:** None - use other platforms for notification functionality

## JSON Output Format

Cursor uses a flat JSON output structure (same as Gemini CLI, different from Claude Code):

```json
{
  "decision": "allow",
  "reason": "Validation passed",
  "systemMessage": "All checks OK"
}
```

**Fields:**

- `decision`: `"allow"` or `"deny"` (determines if action proceeds)
- `reason`: Explanation for deny decision (optional)
- `systemMessage`: Message shown to user (optional)

**Differences from Claude Code:**

- Cursor/Gemini: Flat structure with `decision`/`reason`
- Claude: Nested in `hookSpecificOutput` with `permissionDecision`/`permissionDecisionReason`

## Environment Variables

**Available in hook scripts:**

```bash
# Primary project directory variable
echo $CURSOR_PROJECT_DIR
# Example: /Users/user/project

# Note: Claude Code uses different variables:
# - ${CLAUDE_PROJECT_DIR}
# - ${CLAUDE_PLUGIN_ROOT}
```

## Installation & Sync

### Automatic Sync

Run the sync script to configure Cursor hooks:

```bash
./.agents/hooks/sync-hooks.sh
```

**What it does:**

1. Converts Claude format → Cursor format
2. Changes PascalCase → camelCase events
3. Adds `version: 1` field
4. Omits Notification hooks (not supported)
5. Generates `.cursor/hooks.json`
6. Symlinks scripts to `.cursor/hooks/scripts`

### Manual Verification

```bash
# Check configuration
cat .cursor/hooks.json
jq empty .cursor/hooks.json  # Validate JSON

# Check symlinks
ls -la .cursor/hooks/
# Expected: .cursor/hooks/scripts -> ../../.agents/hooks/scripts

# Verify hooks count (should be 2, not 3)
jq '.hooks | keys' .cursor/hooks.json
# Expected: ["preToolUse", "postToolUse"]
# NOT: ["preToolUse", "postToolUse", "Notification"]
```

## Testing

### Test protect-secrets.sh

```bash
# Should block .env files
echo '{"tool_input":{"file_path":".env"}}' | .cursor/hooks/scripts/protect-secrets.sh
# Expected: {"decision": "deny", "reason": "Cannot edit sensitive file '.env'"}
# Exit code: 2

# Should allow normal files
echo '{"tool_input":{"file_path":"test.js"}}' | .cursor/hooks/scripts/protect-secrets.sh
# Expected: {"decision": "allow"}
# Exit code: 0
```

### Test auto-format.sh

```bash
# Create test file
echo "const x = {a:1,b:2}" > test.js

# Test hook (if prettier installed)
echo '{"tool_input":{"file_path":"test.js"}}' | .cursor/hooks/scripts/auto-format.sh
# Expected: File formatted
# Exit code: 0

# Check formatted result
cat test.js
# Expected: const x = { a: 1, b: 2 };
```

### Test notify.sh ❌

```bash
# This will NOT work in Cursor (Notification event not supported)
# Use Claude Code or Gemini CLI for notification testing
```

## Troubleshooting

### Hooks Not Running

**Symptom:** Hooks don't execute when expected

**Checks:**

```bash
# 1. Verify configuration exists
ls -la .cursor/hooks.json
cat .cursor/hooks.json

# 2. Check JSON validity
jq empty .cursor/hooks.json

# 3. Verify version field
jq .version .cursor/hooks.json
# Expected: 1

# 4. Check scripts symlink
ls -la .cursor/hooks/scripts
# Expected: symlink to ../../.agents/hooks/scripts

# 5. Verify script permissions
ls -la .agents/hooks/scripts/*.sh
# Expected: -rwxr-xr-x (executable)
```

**Solution:**

```bash
# Re-run sync
./.agents/hooks/sync-hooks.sh

# Restart Cursor
```

### "Notification hook not working"

**Cause:** Cursor does NOT support Notification events

**Solution:** Use Claude Code or Gemini CLI for notification functionality

**Verification:**

```bash
# Cursor config should NOT have Notification
jq '.hooks | has("Notification")' .cursor/hooks.json
# Expected: false

# Claude/Gemini configs SHOULD have Notification
jq '.hooks | has("Notification")' .claude/settings.json
# Expected: true
```

### Scripts Not Executable

**Cause:** Scripts missing execute permission

**Solution:**

```bash
chmod +x .agents/hooks/scripts/*.sh
chmod +x .agents/hooks/scripts/lib/*.sh
```

### JSON Parse Error

**Cause:** Hook script outputting invalid JSON

**Debug:**

```bash
# Test script directly
echo '{"tool_input":{"file_path":"test.txt"}}' | .cursor/hooks/scripts/protect-secrets.sh

# Validate output is valid JSON
echo '{"tool_input":{"file_path":"test.txt"}}' | .cursor/hooks/scripts/protect-secrets.sh | jq .
```

### Path Issues

**Cause:** Incorrect environment variable or path

**Check:**

```bash
# Verify CURSOR_PROJECT_DIR set (inside Cursor)
echo $CURSOR_PROJECT_DIR

# Check paths in config
jq '.hooks.preToolUse[0].command' .cursor/hooks.json
# Expected: bash .cursor/hooks/scripts/...
```

## Best Practices

### 1. Always Use version: 1

```json
{
  "version": 1,  // Required for Cursor
  "hooks": { ... }
}
```

### 2. Use camelCase Event Names

```json
{
  "hooks": {
    "preToolUse": [...],   // ✅ Correct
    "postToolUse": [...],  // ✅ Correct
    "PreToolUse": [...]    // ❌ Wrong (PascalCase)
  }
}
```

### 3. Don't Use Notification Events

```json
{
  "hooks": {
    "Notification": [...]  // ❌ NOT SUPPORTED in Cursor
  }
}
```

### 4. Keep Timeouts Reasonable

```json
{
  "preToolUse": [
    {
      "timeout": 10, // ✅ Good for simple checks
      "timeout": 180 // ⚠️ Too long, blocks user
    }
  ]
}
```

### 5. Use Specific Matchers

```json
{
  "matcher": "Edit|Write", // ✅ Good (specific tools)
  "matcher": "*" // ⚠️ Too broad, runs on everything
}
```

## Migration from Other Platforms

### From Claude Code

**Changes needed:**

1. Event names: `PreToolUse` → `preToolUse`, `PostToolUse` → `postToolUse`
2. Add `version: 1` field
3. Flatten structure (remove nested `hooks` array)
4. Remove `Notification` events
5. Update paths: `${CLAUDE_PLUGIN_ROOT}` → `.cursor/hooks`

**Automated:** Use `./.agents/hooks/sync-hooks.sh` (handles conversion)

### From Gemini CLI

**Changes needed:**

1. Event names: `BeforeTool` → `preToolUse`, `AfterTool` → `postToolUse`
2. Add `version: 1` field
3. Keep flat structure (already flat in Gemini)
4. Timeout: milliseconds → seconds (divide by 1000)
5. Update paths: `${GEMINI_PROJECT_DIR}/.agents` → `.cursor/hooks`

**Automated:** Use `./.agents/hooks/sync-hooks.sh` (handles conversion)

## Recommended: Husky + lint-staged (Guaranteed Formatting)

Cursor hooks are **best-effort** and may occasionally fail to trigger. For guaranteed formatting on commits, use **Husky + lint-staged**:

### Why Use Both?

| Aspect                 | Cursor Hooks   | Husky Pre-commit |
| ---------------------- | -------------- | ---------------- |
| **Reliability**        | ~80-90%        | 100% guaranteed  |
| **When runs**          | During editing | At commit time   |
| **IDE independent**    | ❌ Cursor only | ✅ Any IDE       |
| **Blocks bad commits** | ❌ No          | ✅ Yes           |

### Setup (Already Configured)

This project includes Husky + lint-staged:

```bash
# Installed via:
npm install -D husky lint-staged prettier
npx husky init
```

### Configuration

**package.json:**

```json
{
  "scripts": {
    "prepare": "husky",
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx,json,css,scss,md,html,yaml,yml}": ["prettier --write"]
  }
}
```

**.husky/pre-commit:**

```bash
#!/bin/sh
npx lint-staged

# Block sensitive files
SENSITIVE_PATTERNS=".env .pem .key secrets/ credentials/"
for pattern in $SENSITIVE_PATTERNS; do
  if git diff --cached --name-only | grep -q "$pattern"; then
    echo "❌ ERROR: Attempting to commit sensitive file: $pattern"
    exit 1
  fi
done
```

### Complementary Roles

```
┌─────────────────────────────────────────────────────────────┐
│  Cursor hooks = "Nice to have" (improves DX during editing) │
│  Husky pre-commit = "Must have" (guarantees quality)        │
└─────────────────────────────────────────────────────────────┘
```

Both systems work together:

- **Cursor hooks**: Format files as you edit (when they trigger)
- **Husky pre-commit**: Catch anything missed before commit

## Related Documentation

- **Complete Guide:** `.agents/hooks-readme.md` (source of truth)
- **Platform Support:** `docs/guides/hooks/HOOKS_PLATFORM_SUPPORT.md`
- **Quick Reference:** `docs/guides/hooks/hooks-quick-reference.md`
- **Claude Code Hooks:** `docs/en/references/hooks/hooks-reference.md`
- **Gemini CLI Hooks:** `docs/en/references/hooks/gemini-cli-hooks.md`
- **Platform Comparison:** `CURSOR_SUPPORT_RESTORED.md`

## System Statistics

- **Total lines:** 576 (vs 1,390 before) = 59% reduction
- **Platforms:** 3 (Claude Code, Gemini CLI, Cursor)
- **Hooks in Cursor:** 2 of 3 (notify.sh excluded)
- **Sync script:** `.agents/hooks/sync-hooks.sh`
- **Current hooks:**
  - ✅ protect-secrets.sh (preToolUse)
  - ✅ auto-format.sh (postToolUse)
  - ❌ notify.sh (NOT supported)
