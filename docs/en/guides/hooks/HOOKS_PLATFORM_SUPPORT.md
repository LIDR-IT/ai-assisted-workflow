# Hooks Platform Support

Comprehensive guide to hook support across AI development platforms.

## Current System Overview

**Simplified hooks system** with 3 practical hooks across 3 platforms:

- **Total:** 576 lines (vs 1,390 lines before) = **59% reduction**
- **Platforms:** Claude Code, Gemini CLI, Cursor
- **Hooks:** notify.sh, auto-format.sh, protect-secrets.sh

### Hooks by Platform

| Hook                   | Claude Code     | Gemini CLI      | Cursor               | Description                |
| ---------------------- | --------------- | --------------- | -------------------- | -------------------------- |
| **notify.sh**          | ✅ Notification | ✅ Notification | ❌ Not supported     | Desktop notifications      |
| **auto-format.sh**     | ✅ PostToolUse  | ✅ AfterTool    | ✅ afterFileEdit     | Auto-format with prettier  |
| **protect-secrets.sh** | ✅ PreToolUse   | ✅ BeforeTool   | ❌ **No equivalent** | Block sensitive file edits |

**⚠️ Critical Cursor Limitations:**

- Cursor does NOT support Notification events → `notify.sh` excluded
- Cursor does NOT have `beforeFileEdit` → uses `protect-secrets-post.sh` (post-edit detection + git revert)
- Cursor uses different event names: `afterFileEdit`, `afterTabFileEdit` (NOT `preToolUse`/`postToolUse`)

**🔑 Cursor Hook Execution Order (CRITICAL):**

Cursor executes ALL hooks in the array, but the **order matters**:

```json
{
  "afterFileEdit": [
    { "command": "protect-secrets-post.sh" }, // ← MUST be FIRST
    { "command": "auto-format.sh" } // ← Second
  ]
}
```

**Why order matters:** If `auto-format.sh` runs first and modifies the file, `protect-secrets-post.sh` may not detect the original sensitive pattern correctly. The protect hook must run first to detect and revert before any formatting occurs.

## Platform Comparison

| Feature                  | Claude Code             | Gemini CLI              | Cursor                            | Antigravity |
| ------------------------ | ----------------------- | ----------------------- | --------------------------------- | ----------- |
| **Project-level hooks**  | ✅ Yes                  | ✅ Yes                  | ✅ Yes                            | ❌ No       |
| **Pre-edit blocking**    | ✅ PreToolUse           | ✅ BeforeTool           | ❌ **No beforeFileEdit**          | ❌          |
| **Post-edit formatting** | ✅ PostToolUse          | ✅ AfterTool            | ✅ afterFileEdit/afterTabFileEdit | ❌          |
| **Notification event**   | ✅ Yes                  | ✅ Yes                  | ❌ **No**                         | ❌          |
| **SessionStart**         | ✅ Yes                  | ❌ No                   | ❌ No                             | ❌          |
| **Stop**                 | ✅ Yes                  | ✅ Yes                  | ✅ stop                           | ❌          |
| **JSON format**          | Claude                  | Gemini                  | Cursor                            | N/A         |
| **Config location**      | `.claude/settings.json` | `.gemini/settings.json` | `.cursor/hooks.json`              | Global only |
| **Auto-sync support**    | ✅ Yes                  | ✅ Yes                  | ✅ Yes (partial)                  | ❌ No       |
| **Input JSON path**      | `.tool_input.file_path` | `.tool_input.file_path` | `.file_path` (direct)             | N/A         |

## Detailed Format Comparison (3 Platforms)

### Event Names and Structure

| Feature                  | Claude Code                   | Gemini CLI                    | Cursor                              |
| ------------------------ | ----------------------------- | ----------------------------- | ----------------------------------- |
| **Pre-execution event**  | `PreToolUse`                  | `BeforeTool`                  | ❌ **No beforeFileEdit**            |
| **Post-execution event** | `PostToolUse`                 | `AfterTool`                   | `afterFileEdit`, `afterTabFileEdit` |
| **Notification event**   | `Notification`                | `Notification`                | ❌ **Not supported**                |
| **Event naming**         | PascalCase                    | PascalCase (different names)  | camelCase                           |
| **Structure**            | **Nested** (hooks[0].command) | **Nested** (hooks[0].command) | **Flat** (command direct)           |
| **Version field**        | ❌ Not used                   | ❌ Not used                   | ✅ `version: 1` required            |
| **Name field**           | ❌ Not used                   | ✅ Optional                   | ❌ Not used                         |
| **Input file_path**      | `.tool_input.file_path`       | `.tool_input.file_path`       | `.file_path` (root level)           |

**⚠️ Cursor Valid Events (as of v2.3.35):**

- `beforeShellExecution`, `afterShellExecution`
- `beforeMCPExecution`, `afterMCPExecution`
- `beforeReadFile`, `afterFileEdit`
- `beforeTabFileRead`, `afterTabFileEdit`
- `beforeSubmitPrompt`, `afterAgentResponse`, `afterAgentThought`
- `stop`

### JSON Output Format

| Field              | Cursor         | Claude Code                | Gemini CLI      |
| ------------------ | -------------- | -------------------------- | --------------- |
| **Decision field** | `decision`     | `permissionDecision`       | `decision`      |
| **Reason field**   | `reason`       | `permissionDecisionReason` | `reason`        |
| **Wrapper object** | ❌ Flat        | ✅ `hookSpecificOutput`    | ❌ Flat         |
| **User message**   | `user_message` | `systemMessage`            | `systemMessage` |

### Environment & Requirements

| Aspect                 | Cursor               | Claude Code                                  | Gemini CLI            |
| ---------------------- | -------------------- | -------------------------------------------- | --------------------- |
| **Env variables**      | `CURSOR_PROJECT_DIR` | `CLAUDE_PROJECT_DIR`<br>`CLAUDE_PLUGIN_ROOT` | `GEMINI_PROJECT_DIR`  |
| **Stdout requirement** | Normal output        | Normal output                                | ⚠️ **PURE JSON ONLY** |
| **SessionStart**       | ✅ Supported         | ✅ Supported                                 | ❌ Not supported      |
| **Prompt hooks**       | ✅ Supported         | ✅ Supported                                 | ❌ Not supported      |
| **Config location**    | Separate file        | In settings.json                             | In settings.json      |

### Key Similarities: Cursor ↔ Gemini

Cursor and Gemini share more similarities with each other than with Claude:

**1. Identical JSON Output Format:**

```json
// Cursor & Gemini (same)
{
  "decision": "allow",
  "reason": "Tests passed",
  "user_message": "✅ Success"  // optional
}

// Claude (different - wrapped)
{
  "hookSpecificOutput": {
    "permissionDecision": "allow",
    "permissionDecisionReason": "Tests passed",
    "systemMessage": "✅ Success"
  }
}
```

**2. Flat Configuration Structure:**

```json
// Cursor & Gemini (flat)
{
  "preToolUse": [{
    "command": "script.sh",
    "timeout": 30
  }]
}

// Claude (nested)
{
  "PreToolUse": [{
    "matcher": "Bash",
    "hooks": [{
      "command": "script.sh",
      "timeout": 30
    }]
  }]
}
```

### Key Differences: Cursor vs Gemini

Despite similarities, important differences exist:

| Difference          | Cursor                                       | Gemini                           |
| ------------------- | -------------------------------------------- | -------------------------------- |
| **Event names**     | `preToolUse`, `postToolUse`                  | `BeforeTool`, `AfterTool`        |
| **Version field**   | **Required** `version: 1`                    | Not used                         |
| **Config file**     | `.cursor/hooks.json` (separate)              | `.gemini/settings.json` (merged) |
| **Stdout rules**    | Normal debug allowed                         | **Must be pure JSON**            |
| **Advanced events** | `sessionStart`, `beforeShellExecution`, etc. | Only Before/After Tool           |
| **Prompt hooks**    | ✅ Supported                                 | ❌ Not supported                 |

### Conversion Strategy

Our sync system uses Claude format as source of truth and converts to each platform:

**Claude → Cursor:**

1. Flatten structure (remove nested `hooks` array)
2. Change event names to camelCase (`PreToolUse` → `preToolUse`)
3. Add `version: 1` field
4. Convert paths (`${CLAUDE_PLUGIN_ROOT}` → `.cursor/hooks`)
5. Keep JSON output format compatible (both use `decision`/`reason`)

**Claude → Gemini:**

1. Flatten structure (same as Cursor)
2. Rename events (`PreToolUse` → `BeforeTool`)
3. Convert paths (`${CLAUDE_PLUGIN_ROOT}` → `${GEMINI_PROJECT_DIR}/.agents`)
4. Keep JSON output format compatible

**Result:** Single source of truth with automatic platform-specific conversion.

## Platform-Specific Details

### Cursor

**Partial Hook Support:** ✅ (NO Notification event)

**⚠️ LIMITATION:** Cursor does NOT support Notification events. The `notify.sh` hook is automatically excluded from Cursor configuration.

**Configuration Format:**

```json
{
  "version": 1,
  "hooks": {
    "preToolUse": [
      {
        "command": "bash .cursor/hooks/scripts/protect-secrets.sh",
        "timeout": 10,
        "matcher": "Edit|Write"
      }
    ],
    "postToolUse": [
      {
        "command": "bash .cursor/hooks/scripts/auto-format.sh",
        "timeout": 30,
        "matcher": "Edit|Write"
      }
    ]
  }
}
```

**Current Hooks (2 of 3):**

- ✅ `protect-secrets.sh` - Block edits to sensitive files (preToolUse)
- ✅ `auto-format.sh` - Auto-format with prettier (postToolUse)
- ❌ `notify.sh` - NOT supported (Notification event not available)

**Features:**

- Requires `version: 1` field
- Event names in camelCase (`preToolUse`, `postToolUse`)
- Flat structure (command directly in hook, no nested "hooks" array)
- Environment variable: `${CURSOR_PROJECT_DIR}`
- NO Notification event support

**JSON Output Format:**

```json
{
  "decision": "allow",
  "reason": "Validation passed",
  "systemMessage": "✅ All checks OK"
}
```

**Sync Strategy:** Generate `.cursor/hooks.json` from Claude format (omitting Notification), symlink scripts to `.cursor/hooks/scripts`

**Key Differences from Claude:**

- `PreToolUse` → `preToolUse` (camelCase)
- `PostToolUse` → `postToolUse`
- `Notification` → ❌ NOT SUPPORTED
- Requires `version: 1` field
- Uses `decision`/`reason` instead of `permissionDecision`/`permissionDecisionReason`
- Config file is `hooks.json` (not in settings.json)
- Flat structure vs Claude's nested structure

**Documentation:** See `docs/en/references/hooks/cursor-hooks.md` for complete Cursor hooks reference

---

### Claude Code

**Full Hook Support:** ✅ (All 3 hooks)

**Configuration Format:**

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash ${CLAUDE_PLUGIN_ROOT}/hooks/scripts/protect-secrets.sh",
            "timeout": 10
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash ${CLAUDE_PLUGIN_ROOT}/hooks/scripts/auto-format.sh",
            "timeout": 30
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
            "command": "bash ${CLAUDE_PLUGIN_ROOT}/hooks/scripts/notify.sh",
            "timeout": 5
          }
        ]
      }
    ]
  }
}
```

**Current Hooks (All 3):**

- ✅ `protect-secrets.sh` - Block edits to sensitive files (PreToolUse)
- ✅ `auto-format.sh` - Auto-format with prettier (PostToolUse)
- ✅ `notify.sh` - Desktop notifications (Notification)

**Features:**

- Nested structure with `hooks[]` array
- Rich matcher support (tool name + regex pattern)
- Both command and prompt hooks
- Multiple hook events (PreToolUse, PostToolUse, Notification, SessionStart, Stop, etc.)
- Environment variable: `${CLAUDE_PROJECT_DIR}`, `${CLAUDE_PLUGIN_ROOT}`

**JSON Output Format:**

```json
{
  "systemMessage": "Operation completed"
}
```

**Sync Strategy:** Symlink `.agents/hooks` to `.claude/hooks`, merge hooks configuration into `.claude/settings.json`

---

### Gemini CLI

**Full Hook Support:** ✅ (All 3 hooks)

**Configuration Format:**

```json
{
  "hooks": {
    "BeforeTool": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "name": "protect-secrets",
            "type": "command",
            "command": "bash ${GEMINI_PROJECT_DIR}/.agents/hooks/scripts/protect-secrets.sh",
            "timeout": 10000
          }
        ]
      }
    ],
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
    ],
    "Notification": [
      {
        "matcher": "*",
        "hooks": [
          {
            "name": "notify",
            "type": "command",
            "command": "bash ${GEMINI_PROJECT_DIR}/.agents/hooks/scripts/notify.sh",
            "timeout": 5000
          }
        ]
      }
    ]
  }
}
```

**Current Hooks (All 3):**

- ✅ `protect-secrets.sh` - Block edits to sensitive files (BeforeTool)
- ✅ `auto-format.sh` - Auto-format with prettier (AfterTool)
- ✅ `notify.sh` - Desktop notifications (Notification)

**Features:**

- Simpler event model (BeforeTool, AfterTool only)
- Flat JSON structure (no `hookSpecificOutput` wrapper)
- **Critical "Golden Rule":** stdout must be PURE JSON (no debug output)
- Environment variable: `${GEMINI_PROJECT_DIR}`

**JSON Output Format:**

```json
{
  "decision": "allow",
  "reason": "Tests passed",
  "systemMessage": "✅ All validations passed"
}
```

**Sync Strategy:** Convert Claude format → Gemini format, merge into `.gemini/settings.json`

**Key Differences from Claude:**

- `PreToolUse` → `BeforeTool`
- `PostToolUse` → `AfterTool`
- `permissionDecision` → `decision`
- `permissionDecisionReason` → `reason`
- No prompt-based hooks
- No SessionStart/Stop events

**Critical Requirement:**

```bash
# ❌ BAD - pollutes stdout
echo "Debug: Running tests"
cat <<JSON
{"decision": "allow"}
JSON

# ✅ GOOD - debug to stderr
echo "Debug: Running tests" >&2
cat <<JSON
{"decision": "allow"}
JSON
```

---

### Antigravity

**Status:** ❌ Project-Level Hooks Not Supported

Antigravity follows the same pattern as MCP servers - **global configuration only**.

**Why No Project-Level Hooks:**

- Antigravity uses global configuration model
- All hooks must be defined in `~/.gemini/antigravity/mcp_config.json`
- Cannot override at project level

**Workaround:**
Define hooks globally and use project detection in hook scripts:

```bash
# Hook script detects project
PROJECT_ROOT=$(git rev-parse --show-toplevel 2>/dev/null)

if [[ "$PROJECT_ROOT" == "/path/to/my-project" ]]; then
  # Project-specific logic
fi
```

**Global Configuration Location:**

```
~/.gemini/antigravity/mcp_config.json
```

**Sync Strategy:** Documentation only (no project-level sync possible)

---

## Format Conversion

Our sync system converts from **Claude format (source of truth)** to platform-specific formats.

### Conversion Rules Summary

| Transformation     | Cursor                                                       | Gemini                                                     |
| ------------------ | ------------------------------------------------------------ | ---------------------------------------------------------- |
| **Event names**    | `PreToolUse` → `preToolUse`<br>`PostToolUse` → `postToolUse` | `PreToolUse` → `BeforeTool`<br>`PostToolUse` → `AfterTool` |
| **Structure**      | Flatten (remove nested hooks array)                          | Flatten (same)                                             |
| **Version field**  | Add `version: 1`                                             | Don't add                                                  |
| **Path variables** | `${CLAUDE_PLUGIN_ROOT}` → `.cursor/hooks`                    | `${CLAUDE_PLUGIN_ROOT}` → `${GEMINI_PROJECT_DIR}/.agents`  |
| **JSON output**    | Already compatible (decision/reason)                         | Already compatible (decision/reason)                       |

### Claude → Cursor Conversion

**Event Names:**

```
PreToolUse  → preToolUse  (camelCase)
PostToolUse → postToolUse (camelCase)
```

**Structure Flattening:**

```json
// Claude (nested)
{
  "matcher": "Bash",
  "pattern": "git push",
  "hooks": [{
    "command": "script.sh",
    "timeout": 180
  }]
}

// Cursor (flat + version)
{
  "command": "script.sh",
  "timeout": 180,
  "matcher": "git push"
}
// Plus: Add "version: 1" at root
```

**Environment Variables:**

```bash
# Claude
${CLAUDE_PLUGIN_ROOT}/hooks/scripts/pre-push.sh

# Cursor (converted)
.cursor/hooks/scripts/pre-push.sh
```

**JSON Output:** Already compatible (both use `decision`/`reason`)

### Claude → Gemini Conversion

**Event Names:**

```
PreToolUse  → BeforeTool
PostToolUse → AfterTool
```

**Structure Flattening:**

```json
// Claude (nested)
{
  "matcher": "Bash",
  "pattern": "git push",
  "hooks": [{
    "command": "script.sh",
    "timeout": 180
  }]
}

// Gemini (flat, no version)
{
  "matcher": "git push",
  "command": "script.sh",
  "timeout": 180
}
```

**Environment Variables:**

```bash
# Claude
${CLAUDE_PLUGIN_ROOT}/hooks/scripts/pre-push.sh
${CLAUDE_PROJECT_DIR}/.agents/hooks/scripts/pre-push.sh

# Gemini (converted)
${GEMINI_PROJECT_DIR}/.agents/hooks/scripts/pre-push.sh
```

**JSON Output:** Already compatible (both use `decision`/`reason`)

### Complete Conversion Example

**Source: Claude format (`.agents/hooks/hooks.json`):**

```json
{
  "description": "Git workflow automation hooks",
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "pattern": "git push",
        "hooks": [
          {
            "type": "command",
            "command": "bash ${CLAUDE_PLUGIN_ROOT}/hooks/scripts/pre-push.sh",
            "timeout": 180
          }
        ]
      }
    ]
  }
}
```

**Converted to Cursor (`.cursor/hooks.json`):**

```json
{
  "version": 1,
  "hooks": {
    "preToolUse": [
      {
        "command": "bash .cursor/hooks/scripts/pre-push.sh",
        "timeout": 180,
        "matcher": "git push"
      }
    ]
  }
}
```

**Converted to Gemini (`.gemini/settings.json`):**

```json
{
  "hooks": {
    "BeforeTool": [
      {
        "matcher": "git push",
        "command": "bash ${GEMINI_PROJECT_DIR}/.agents/hooks/scripts/pre-push.sh",
        "timeout": 180
      }
    ]
  }
}
```

**Hook scripts detect platform:**

```bash
#!/bin/bash

source "$(dirname "$0")/lib/platform-detect.sh"

PLATFORM=$(detect_platform)

if [[ "$PLATFORM" == "gemini" ]]; then
  # Gemini-specific: only JSON to stdout
  exec 2>/dev/null  # Suppress stderr if needed
fi

# Output Claude format (adapter converts for Gemini)
cat <<JSON
{
  "hookSpecificOutput": {
    "permissionDecision": "allow"
  }
}
JSON
```

---

## Migration Guide

### Moving from Git Hooks to Platform Hooks

**Traditional Git Hooks:**

```bash
# .git/hooks/pre-push
#!/bin/bash
npm test
```

**Platform Hooks (Claude/Gemini):**

```bash
# .agents/hooks/scripts/pre-push.sh
#!/bin/bash

# Run tests
if npm test 2>&1; then
  decision="allow"
  message="✅ Tests passed"
else
  decision="block"
  message="❌ Tests failed"
fi

# Output JSON
cat <<JSON
{
  "hookSpecificOutput": {
    "permissionDecision": "$decision",
    "systemMessage": "$message"
  }
}
JSON
```

**Benefits:**

- Works across all AI platforms
- Integrated with AI agent workflows
- Centralized configuration
- Better error reporting
- Multi-platform compatibility

---

## Testing Across Platforms

### Test Suite Template

```bash
#!/bin/bash
# test-hook-platforms.sh

echo "Testing hook across platforms..."

# Test Claude format
echo "Testing Claude Code format..."
CLAUDE_PROJECT_DIR=$(pwd) \
  ./.agents/hooks/scripts/pre-push.sh | jq .

# Test Gemini format (via adapter)
echo "Testing Gemini CLI format..."
GEMINI_PROJECT_DIR=$(pwd) \
  bash ./.agents/hooks/scripts/lib/gemini-adapter.sh \
  execute_with_gemini_format \
  ./.agents/hooks/scripts/pre-push.sh | jq .

# Validate JSON
echo "Validating JSON outputs..."
jq empty .claude/settings.json
jq empty .gemini/settings.json

echo "✅ All platform tests passed"
```

---

## Best Practices

### 1. Single Source of Truth

- Define hooks in `.agents/hooks/hooks.json` (Claude format)
- Let sync script handle platform conversion
- Never edit `.claude/settings.json` or `.gemini/settings.json` directly

### 2. Cross-Platform Scripts

- Use platform detection for platform-specific logic
- Output Claude JSON format (adapter converts)
- Test on both Claude and Gemini before committing

### 3. Gemini Compatibility

- **Always** redirect debug output to stderr
- Keep stdout pure JSON
- Use progress indicators from `lib/progress.sh`

### 4. Error Handling

- Return meaningful error messages
- Use appropriate exit codes (0, 1, 2)
- Gracefully handle missing dependencies

### 5. Performance

- Keep hooks fast (< 30 seconds)
- Show progress for long operations
- Allow interruption (Ctrl+C)

---

## Troubleshooting

### Hook Not Triggering (All Platforms)

**Symptom:** Hook doesn't execute when expected

**Causes:**

1. Hooks load at session start only
2. Configuration not synced
3. Matcher pattern doesn't match command

**Solutions:**

```bash
# Restart session after sync
# Exit current session, then:
claude  # or gemini

# Verify sync
jq .hooks .claude/settings.json
jq .hooks .gemini/settings.json

# Test matcher pattern
# Match should use regex syntax
"pattern": "git push"      # Matches "git push"
"pattern": "git (pull|merge)"  # Matches both
```

### JSON Parse Error (Gemini)

**Symptom:** `Error parsing hook response: unexpected character`

**Cause:** Debug output polluting stdout

**Solution:**

```bash
# Redirect ALL debug to stderr
echo "Debug message" >&2
printf "Progress: %s\n" "$status" >&2

# Use progress indicators
source "$SCRIPT_DIR/lib/progress.sh"
show_progress "Running..." >&2
```

### Permission Denied

**Symptom:** `bash: permission denied: script.sh`

**Solution:**

```bash
chmod +x .agents/hooks/scripts/*.sh
chmod +x .agents/hooks/scripts/lib/*.sh
```

### Wrong Project Directory

**Symptom:** Hook can't find project files

**Solution:**

```bash
# Use platform-aware project directory
source "$(dirname "$0")/lib/platform-detect.sh"
PROJECT_DIR=$(get_project_dir)

cd "$PROJECT_DIR" || exit 1
```

---

## Related Documentation

- **Main Guide:** `.agents/hooks/README.md`
- **Hook Reference:** `docs/references/hooks/git-hooks-reference.md`
- **Troubleshooting:** `docs/references/hooks/git-hooks-troubleshooting.md`
- **Architecture:** `CLAUDE.md` (hooks section)
- **Antigravity MCP:** `docs/guides/mcp/ANTIGRAVITY_LIMITATION.md` (similar pattern)
