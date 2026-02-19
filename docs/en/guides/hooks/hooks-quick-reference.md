# Hooks Quick Reference

Quick reference guide for working with hooks across Claude Code, Gemini CLI, and Cursor.

## Overview

This hooks system provides **3 simple, practical hooks** across **3 platforms**:

**Total:** 576 lines (vs 1,390 lines in previous complex system) = **59% reduction**

### Hooks by Platform

| Hook                   | Claude Code     | Gemini CLI      | Cursor                   | Description                |
| ---------------------- | --------------- | --------------- | ------------------------ | -------------------------- |
| **notify.sh**          | ✅ Notification | ✅ Notification | ❌ Not supported         | Desktop notifications      |
| **auto-format.sh**     | ✅ PostToolUse  | ✅ AfterTool    | ✅ afterFileEdit         | Auto-format with prettier  |
| **protect-secrets.sh** | ✅ PreToolUse   | ✅ BeforeTool   | ❌ **No beforeFileEdit** | Block sensitive file edits |

**⚠️ Cursor Limitations:**

- Cursor does NOT support Notification events → `notify.sh` excluded
- Cursor does NOT have `beforeFileEdit` → `protect-secrets.sh` **cannot work**
- Cursor uses `afterFileEdit`/`afterTabFileEdit` (NOT `preToolUse`/`postToolUse`)

## Platform Comparison at a Glance

| Aspect                  | Claude Code             | Gemini CLI              | Cursor                    |
| ----------------------- | ----------------------- | ----------------------- | ------------------------- |
| **Events Pre**          | `PreToolUse`            | `BeforeTool`            | ❌ No beforeFileEdit      |
| **Events Post**         | `PostToolUse`           | `AfterTool`             | `afterFileEdit`           |
| **Events Notification** | `Notification`          | `Notification`          | ❌ Not supported          |
| **Case**                | PascalCase              | PascalCase              | camelCase                 |
| **Structure**           | Nested (hooks array)    | Nested (hooks array)    | Flat                      |
| **Version Field**       | ❌ No                   | ❌ No                   | ✅ Required (version: 1)  |
| **Name Field**          | ❌ No                   | ✅ Optional             | ❌ No                     |
| **Config File**         | `.claude/settings.json` | `.gemini/settings.json` | `.cursor/hooks.json`      |
| **Env Var**             | `CLAUDE_PROJECT_DIR`    | `GEMINI_PROJECT_DIR`    | (uses relative paths)     |
| **Timeout Unit**        | seconds                 | milliseconds (×1000)    | seconds                   |
| **Stdout**              | Normal                  | ⚠️ **PURE JSON ONLY**   | Normal                    |
| **Input file_path**     | `.tool_input.file_path` | `.tool_input.file_path` | `.file_path` (root level) |

## Configuration Examples

### Current Hooks System

The simplified system uses 3 practical hooks. Here's the `auto-format.sh` hook across all platforms (the only hook that works on ALL platforms):

<table>
<tr>
<th>Claude Code</th>
<th>Gemini CLI</th>
<th>Cursor</th>
</tr>
<tr>
<td>

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash \"${CLAUDE_PROJECT_DIR}/.agents/hooks/scripts/auto-format.sh\"",
            "timeout": 30
          }
        ]
      }
    ]
  }
}
```

</td>
<td>

```json
{
  "hooks": {
    "AfterTool": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "name": "auto-format",
            "type": "command",
            "command": "bash ${GEMINI_PROJECT_DIR}/.agents/hooks/scripts/auto-format.sh",
            "timeout": 30000
          }
        ]
      }
    ]
  }
}
```

</td>
<td>

```json
{
  "version": 1,
  "hooks": {
    "afterFileEdit": [
      {
        "command": "bash .cursor/hooks/scripts/auto-format.sh",
        "timeout": 30
      }
    ],
    "afterTabFileEdit": [
      {
        "command": "bash .cursor/hooks/scripts/auto-format.sh",
        "timeout": 30
      }
    ]
  }
}
```

</td>
</tr>
</table>

**Key Differences:**

- **Events:** PostToolUse (Claude) → AfterTool (Gemini) → afterFileEdit (Cursor)
- **Structure:** Nested with `hooks[]` (Claude, Gemini) → Flat (Cursor)
- **Timeout:** seconds (Claude, Cursor) → milliseconds (Gemini: ×1000)
- **Version:** Only Cursor requires `version: 1`
- **Cursor Note:** Uses `afterFileEdit` + `afterTabFileEdit` to cover both agent and user edits

## JSON Output Format

### Hook Script Output

<table>
<tr>
<th>Cursor</th>
<th>Claude Code</th>
<th>Gemini CLI</th>
</tr>
<tr>
<td>

```json
{
  "decision": "allow",
  "reason": "Validation passed",
  "user_message": "All checks OK"
}
```

</td>
<td>

```json
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "allow",
    "permissionDecisionReason": "Validation passed",
    "systemMessage": "All checks OK"
  }
}
```

</td>
<td>

```json
{
  "decision": "allow",
  "reason": "Validation passed",
  "systemMessage": "All checks OK"
}
```

</td>
</tr>
</table>

**Key Differences:**

- **Cursor & Gemini:** Flat structure with `decision`/`reason`
- **Claude:** Nested in `hookSpecificOutput` with `permissionDecision`/`permissionDecisionReason`
- **Claude:** Requires `hookEventName` field

## Writing Cross-Platform Hooks

### Template Hook Script

```bash
#!/bin/bash
set -e

# Source platform detection
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/lib/platform-detect.sh" 2>&1 >&2

# Detect platform
PLATFORM=$(detect_platform)
PROJECT_DIR=$(get_project_dir)

# Debug output (ALWAYS to stderr for Gemini compatibility)
echo "Running on platform: $PLATFORM" >&2
echo "Project directory: $PROJECT_DIR" >&2

# Your validation logic here
VALIDATION_RESULT=$(run_your_validation 2>&1)
EXIT_CODE=$?

echo "Validation complete (exit: $EXIT_CODE)" >&2

# Output JSON based on result (ONLY JSON to stdout)
if [ $EXIT_CODE -eq 0 ]; then
  cat <<JSON
{
  "decision": "allow",
  "systemMessage": "Validation passed"
}
JSON
else
  cat <<JSON
{
  "decision": "deny",
  "reason": "Validation failed: $VALIDATION_RESULT"
}
JSON
fi
```

### ⚠️ CRITICAL - Gemini's "Golden Rule"

**Gemini CLI REQUIRES pure stdout (JSON only):**

```bash
# ❌ BAD - Breaks Gemini
echo "Starting..."  # This pollutes stdout!
cat <<JSON
{"decision": "allow"}
JSON

# ✅ GOOD - Debug to stderr
echo "Starting..." >&2  # Safe for all platforms
cat <<JSON
{"decision": "allow"}
JSON
```

**Rules:**

1. **NO plain text to stdout** - Only the final JSON object
2. **ALL debug/logging to stderr:** `echo "msg" >&2`
3. **Any non-JSON text breaks parsing** - Hook fails silently

## Common Patterns

### Pattern 1: Allow with Message

```bash
cat <<JSON
{
  "decision": "allow",
  "systemMessage": "Validation passed, all checks OK"
}
JSON
```

### Pattern 2: Deny with Reason

```bash
cat <<JSON
{
  "decision": "deny",
  "reason": "Commit message does not follow conventional commits format"
}
JSON
```

### Pattern 3: Conditional Logic

```bash
if [ "$CONDITION" = "true" ]; then
  echo '{"decision": "allow"}'
else
  echo '{"decision": "deny", "reason": "Condition not met"}'
fi
```

## Exit Codes

| Code  | Meaning | Behavior                                |
| ----- | ------- | --------------------------------------- |
| `0`   | Success | Parse JSON output, apply decision       |
| `2`   | Block   | Prevent operation, use stderr as reason |
| Other | Warning | Show warning, continue operation        |

**Recommendation:** Use exit `0` with JSON for all decisions (cleaner, more control).

## Quick Verification

### After Sync

```bash
# Check symlinks
ls -la .cursor/hooks/
ls -la .claude/hooks/
ls -la .gemini/hooks/

# View configurations
jq .hooks .cursor/hooks.json
jq .hooks .claude/settings.json
jq .hooks .gemini/settings.json

# Validate JSON
jq empty .cursor/hooks.json
jq empty .claude/settings.json
jq empty .gemini/settings.json
```

### Test Hook Script

```bash
# Test directly
echo '{}' | ./.agents/hooks/scripts/your-hook.sh

# Test with platform env
CLAUDE_PROJECT_DIR=$(pwd) ./.agents/hooks/scripts/your-hook.sh
GEMINI_PROJECT_DIR=$(pwd) ./.agents/hooks/scripts/your-hook.sh

# Validate JSON output
./.agents/hooks/scripts/your-hook.sh | jq .
```

## Field Mapping

### Configuration Structure

| Field                | Cursor           | Claude Code        | Gemini CLI         |
| -------------------- | ---------------- | ------------------ | ------------------ |
| **Config Structure** | Flat             | Nested (`hooks[]`) | Nested (`hooks[]`) |
| **Hook Name**        | N/A              | N/A                | `name` (optional)  |
| **Hook Type**        | N/A              | `type`             | `type`             |
| **Command**          | Direct in object | `hooks[].command`  | `hooks[].command`  |

### JSON Output Format

| Purpose          | Cursor         | Claude Code                | Gemini CLI      |
| ---------------- | -------------- | -------------------------- | --------------- |
| **Allow/Deny**   | `decision`     | `permissionDecision`       | `decision`      |
| **Explanation**  | `reason`       | `permissionDecisionReason` | `reason`        |
| **User Message** | `user_message` | `systemMessage`            | `systemMessage` |
| **Event Name**   | N/A            | `hookEventName` ✅         | N/A             |
| **Wrapper**      | Flat           | `hookSpecificOutput` ✅    | Flat            |

## Current Hooks

### 1. Desktop Notifications (notify.sh)

**Platforms:** Claude Code, Gemini CLI (NOT Cursor)
**Event:** `Notification` / `Notification` / ❌
**Purpose:** Show native desktop notification when Claude needs attention

```json
{
  "matcher": "*",
  "command": "bash \"${CLAUDE_PROJECT_DIR}/.agents/hooks/scripts/notify.sh\"",
  "timeout": 5
}
```

**Supported OS:**

- macOS (osascript)
- Linux (notify-send)
- Windows (PowerShell)

**Note:** Cursor does not support Notification events, so this hook is excluded from `.cursor/hooks.json`

### 2. Auto-Format (auto-format.sh)

**Platforms:** Claude Code, Gemini CLI, Cursor
**Event:** `PostToolUse` / `AfterTool` / `postToolUse`
**Purpose:** Automatically format files after editing with prettier

```json
{
  "matcher": "Edit|Write",
  "command": "bash \"${CLAUDE_PROJECT_DIR}/.agents/hooks/scripts/auto-format.sh\"",
  "timeout": 30
}
```

**Requirements:**

- Optional: `prettier` installed (`npm install -g prettier`)
- Fails gracefully if prettier not available

**Supported Files:** All prettier-supported formats (JS, TS, JSON, CSS, MD, etc.)

### 3. Secret Protection (protect-secrets.sh)

**Platforms:** Claude Code, Gemini CLI, Cursor
**Event:** `PreToolUse` / `BeforeTool` / `preToolUse`
**Purpose:** Block edits to sensitive files before they happen

```json
{
  "matcher": "Edit|Write",
  "command": "bash \"${CLAUDE_PROJECT_DIR}/.agents/hooks/scripts/protect-secrets.sh\"",
  "timeout": 10
}
```

**Protected Patterns:**

- `.env` files
- `.pem`, `.key` files
- `secrets/` directories
- `credentials/` directories
- `.git/config`
- `package-lock.json`

**Behavior:** Exits with code 2 (blocks the action) if file matches pattern

## Troubleshooting

### Hooks Not Triggering

**Cause:** Hooks load at session start only

**Solution:**

```bash
# Restart session after sync
exit  # or Ctrl+D
claude  # or gemini
```

### JSON Parse Errors (Gemini)

**Cause:** Debug output polluting stdout

**Solution:**

```bash
# Redirect ALL debug to stderr
echo "Debug message" >&2
```

### Claude Code Hooks Not Working

**Cause:** Incorrect environment variable or relative paths

**Solution:**

```bash
# Check settings.json uses CLAUDE_PROJECT_DIR
jq '.hooks.PostToolUse[0].hooks[0].command' .claude/settings.json
# Should show: bash "${CLAUDE_PROJECT_DIR}/.agents/hooks/scripts/..."

# If incorrect, re-run sync
./.agents/sync.sh --only=hooks

# Test manually
CLAUDE_PROJECT_DIR=$(pwd) bash .agents/hooks/scripts/auto-format.sh
```

### Permission Denied

**Cause:** Scripts not executable

**Solution:**

```bash
chmod +x .agents/hooks/scripts/*.sh
chmod +x .agents/hooks/scripts/lib/*.sh
```

## Platform-Specific Docs

- **Complete Guide:** `.agents/hooks-readme.md` (source of truth)
- **Platform Support:** `docs/guides/hooks/HOOKS_PLATFORM_SUPPORT.md`
- **Cursor Hooks:** `docs/en/references/hooks/cursor-hooks.md`
- **Claude Code Hooks:** `docs/en/references/hooks/hooks-reference.md`
- **Gemini CLI Hooks:** `docs/en/references/hooks/gemini-cli-hooks.md`

## Related Documentation

- **Hook Development Skill:** `.agents/skills/hook-development/`
- **Sync Hooks:** `.agents/sync.sh --only=hooks`
- **Workflow Automation:** `docs/en/references/hooks/automate-workflows-with-hooks.md`
- **Test Hooks Command:** `.agents/commands/test-hooks.md`
- **Platform Comparison:** `CURSOR_SUPPORT_RESTORED.md`

## System Statistics

- **Total lines:** 576 (vs 1,390 before) = 59% reduction
- **Platforms:** 3 (Claude Code, Gemini CLI, Cursor)
- **Hooks:** 3 (notify, auto-format, protect-secrets)
- **Converters:** 2 (Gemini, Cursor)
- **Sync command:** `.agents/sync.sh --only=hooks`
