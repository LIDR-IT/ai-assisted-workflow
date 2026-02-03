# Hooks System - Simplified and Cross-Platform

Simple, practical hooks for development workflow automation across Claude Code and Gemini CLI.

## Overview

This hooks system provides **3 simple, practical hooks** that demonstrate real-world automation:

1. **Desktop Notifications** - Get notified when Claude needs attention
2. **Auto-Format** - Automatically format code files when edited
3. **Secret Protection** - Block edits to sensitive files (.env, .pem, etc.)

**Total:** ~576 lines (vs 1,390 lines in previous complex system) = **59% reduction**

## Architecture

### Supported Platforms

| Platform        | Support          | Configuration Location  | Event Format                                          |
| --------------- | ---------------- | ----------------------- | ----------------------------------------------------- |
| **Claude Code** | ✅ Full          | `.claude/settings.json` | PascalCase (PreToolUse, PostToolUse, Notification)    |
| **Gemini CLI**  | ✅ Full          | `.gemini/settings.json` | BeforeTool, AfterTool, Notification                   |
| **Cursor**      | ✅ Partial       | `.cursor/hooks.json`    | camelCase (preToolUse, postToolUse) - NO Notification |
| Antigravity     | ❌ Not supported | N/A                     | N/A                                                   |

**Key Limitation:** Cursor does NOT support Notification events, so `notify.sh` only works on Claude Code and Gemini CLI.

### Source of Truth Pattern

```
.agents/hooks/
├── hooks.json              # Source (Claude Code format)
├── sync-hooks.sh           # Synchronization script
└── scripts/
    ├── notify.sh           # Desktop notifications
    ├── auto-format.sh      # Auto-format with prettier
    ├── protect-secrets.sh  # Block sensitive file edits
    └── lib/
        ├── progress.sh     # Output utilities (colors, emojis)
        └── platform-detect.sh  # Platform detection (simplified)
```

**Synchronization:**

- **Claude Code:** Direct symlink + merge to settings.json
- **Gemini CLI:** Symlink + conversion to BeforeTool/AfterTool format

## Hooks Overview

### Hooks by Platform

| Hook                   | Claude Code     | Gemini CLI      | Cursor           | Description                |
| ---------------------- | --------------- | --------------- | ---------------- | -------------------------- |
| **notify.sh**          | ✅ Notification | ✅ Notification | ❌ Not supported | Desktop notifications      |
| **auto-format.sh**     | ✅ PostToolUse  | ✅ AfterTool    | ✅ postToolUse   | Auto-format with prettier  |
| **protect-secrets.sh** | ✅ PreToolUse   | ✅ BeforeTool   | ✅ preToolUse    | Block sensitive file edits |

### 1. Desktop Notifications (notify.sh)

**Platforms:** Claude Code, Gemini CLI (NOT Cursor)
**Event:** `Notification` (matcher: `*`)
**Purpose:** Show native desktop notification when Claude needs attention

**Supported OS:**

- macOS (osascript)
- Linux (notify-send)
- Windows (PowerShell)

**Cursor Limitation:** Cursor does not support Notification events, so this hook is excluded from `.cursor/hooks.json`

### 2. Auto-Format (auto-format.sh)

**Platforms:** Claude Code, Gemini CLI, Cursor
**Event:** `PostToolUse` (Claude) / `AfterTool` (Gemini) / `postToolUse` (Cursor)
**Trigger:** `Edit|Write` tool matcher
**Purpose:** Automatically format files after editing with prettier

**Requirements:**

- Optional: `prettier` installed (`npm install -g prettier`)
- Fails gracefully if prettier not available

**Supported Files:** All prettier-supported formats (JS, TS, JSON, CSS, MD, etc.)

### 3. Secret Protection (protect-secrets.sh)

**Platforms:** Claude Code, Gemini CLI, Cursor
**Event:** `PreToolUse` (Claude) / `BeforeTool` (Gemini) / `preToolUse` (Cursor)
**Trigger:** `Edit|Write` tool matcher
**Purpose:** Block edits to sensitive files before they happen

**Protected Patterns:**

- `.env` files
- `.pem`, `.key` files
- `secrets/` directories
- `credentials/` directories
- `.git/config`
- `package-lock.json`

**Behavior:** Exits with code 2 (blocks the action) if file matches pattern

## Quick Start

### Installation

```bash
# 1. Sync hooks to platforms
./.agents/hooks/sync-hooks.sh

# 2. Verify installation
ls -la .claude/hooks .gemini/hooks
jq .hooks .claude/settings.json
jq .hooks .gemini/settings.json
```

### Verification

**Expected output:**

```bash
# Symlinks should point to ../.agents/hooks
lrwxr-xr-x .claude/hooks -> ../.agents/hooks
lrwxr-xr-x .gemini/hooks -> ../.agents/hooks

# Settings should contain hooks configuration
✅ Claude settings.json has hooks
✅ Gemini settings.json has hooks
```

## Configuration

### Source Configuration (hooks.json)

```json
{
  "description": "Simple cross-platform hooks for development workflow",
  "hooks": {
    "Notification": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "bash ${CLAUDE_PROJECT_DIR/.agents}/hooks/scripts/notify.sh",
            "timeout": 5
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
            "command": "bash ${CLAUDE_PROJECT_DIR/.agents}/hooks/scripts/auto-format.sh",
            "timeout": 30
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash ${CLAUDE_PROJECT_DIR/.agents}/hooks/scripts/protect-secrets.sh",
            "timeout": 10
          }
        ]
      }
    ]
  }
}
```

### Platform-Specific Formats

**Claude Code (.claude/settings.json):**

```json
{
  "hooks": {
    "PreToolUse": [{ "matcher": "Edit|Write", ... }],
    "PostToolUse": [{ "matcher": "Edit|Write", ... }],
    "Notification": [{ "matcher": "*", ... }]
  }
}
```

**Gemini CLI (.gemini/settings.json):**

```json
{
  "hooks": {
    "BeforeTool": [{ "matcher": "Edit|Write", "hooks": [{ "name": "protect-secrets", ... }] }],
    "AfterTool": [{ "matcher": "Edit|Write", "hooks": [{ "name": "auto-format", ... }] }],
    "Notification": [{ "matcher": "*", "hooks": [{ "name": "notify", ... }] }]
  }
}
```

**Cursor (.cursor/hooks.json):**

```json
{
  "version": 1,
  "hooks": {
    "preToolUse": [{ "command": "...", "timeout": 10, "matcher": "Edit|Write" }],
    "postToolUse": [{ "command": "...", "timeout": 30, "matcher": "Edit|Write" }]
  }
}
```

**Key Differences:**

| Feature            | Claude Code                  | Gemini CLI           | Cursor               |
| ------------------ | ---------------------------- | -------------------- | -------------------- |
| Event format       | PascalCase                   | PascalCase           | camelCase            |
| PreToolUse event   | `PreToolUse`                 | `BeforeTool`         | `preToolUse`         |
| PostToolUse event  | `PostToolUse`                | `AfterTool`          | `postToolUse`        |
| Notification event | `Notification`               | `Notification`       | ❌ Not supported     |
| Timeout unit       | seconds                      | milliseconds (×1000) | seconds              |
| Nested structure   | Yes                          | Yes                  | Flat                 |
| Hook name field    | No                           | Yes (required)       | No                   |
| Version field      | No                           | No                   | Yes (version: 1)     |
| Environment var    | `CLAUDE_PROJECT_DIR/.agents` | `GEMINI_PROJECT_DIR` | `CURSOR_PROJECT_DIR` |

## Customization

### Adding a New Hook

1. **Create hook script** in `.agents/hooks/scripts/`:

```bash
#!/bin/bash
# my-hook.sh - Description

set -e

# Read JSON input (for BeforeTool/AfterTool)
INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Your logic here
echo "Processing: $FILE_PATH" >&2

# Output JSON (Gemini requirement)
cat <<JSON
{
  "systemMessage": "Hook completed"
}
JSON

exit 0
```

2. **Make executable:**

```bash
chmod +x .agents/hooks/scripts/my-hook.sh
```

3. **Add to hooks.json:**

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash ${CLAUDE_PROJECT_DIR/.agents}/hooks/scripts/my-hook.sh",
            "timeout": 30
          }
        ]
      }
    ]
  }
}
```

4. **Sync to platforms:**

```bash
./.agents/hooks/sync-hooks.sh
```

### Disabling a Hook

**Option 1: Remove from hooks.json**

```bash
# Edit .agents/hooks/hooks.json and remove hook entry
vim .agents/hooks/hooks.json

# Re-sync
./.agents/hooks/sync-hooks.sh
```

**Option 2: Platform-specific disable**

```bash
# Edit platform settings directly
vim .claude/settings.json  # Claude Code
vim .gemini/settings.json  # Gemini CLI
```

### Modifying Protected Patterns

Edit `protect-secrets.sh`:

```bash
# Add new pattern
PROTECTED_PATTERNS=(
  ".env"
  ".pem"
  ".key"
  "secrets/"
  "my-sensitive-dir/"  # Add this
)
```

No sync needed - scripts are symlinked, changes are instant.

## Event Reference

### Available Events

| Claude Code    | Gemini CLI     | Cursor            | Use Case                               |
| -------------- | -------------- | ----------------- | -------------------------------------- |
| `PreToolUse`   | `BeforeTool`   | `preToolUse`      | Block/validate before tool execution   |
| `PostToolUse`  | `AfterTool`    | `postToolUse`     | React after tool execution             |
| `Notification` | `Notification` | ❌ Not supported  | Respond to system notifications        |
| `SessionStart` | `SessionStart` | ❌ Not documented | Initialize on session start (not used) |
| `Stop`         | `Stop`         | ❌ Not documented | Cleanup on session stop (not used)     |

**Simplified System:** Only uses 3 events (PreToolUse, PostToolUse, Notification)

**Cursor Limitation:** Cursor only supports `preToolUse` and `postToolUse` events. Notification hooks are automatically excluded from Cursor configuration.

### Tool Matchers

**Common matchers:**

- `Edit|Write` - File edit/creation operations
- `Bash` - Bash command executions
- `*` - All events

**Pattern matching:**

```json
{
  "matcher": "Bash",
  "pattern": "git push"
}
```

## Testing

### Manual Testing

**Test 1: Notification**

```bash
# Trigger a notification (platform-specific)
# On Claude Code, wait for a notification event
# Should see desktop notification
```

**Test 2: Auto-Format**

```bash
# Create a test file
echo "const x = {a:1,b:2}" > test.js

# Edit with Claude (if prettier installed)
# File should be auto-formatted on save
cat test.js
# Expected: const x = { a: 1, b: 2 };
```

**Test 3: Secret Protection**

```bash
# Try to edit .env file
# Should be blocked with error message
# Expected: "Blocked: Cannot edit sensitive file '.env'"
```

### Hook Input/Output

**Input Format (JSON via stdin):**

```json
{
  "hook_event_name": "PreToolUse",
  "tool_name": "Edit",
  "tool_input": {
    "file_path": "/path/to/file.js",
    "old_string": "...",
    "new_string": "..."
  }
}
```

**Output Format (JSON to stdout):**

```json
{
  "systemMessage": "Hook completed successfully"
}
```

**Exit Codes:**

- `0` - Success, continue
- `1` - Error (warning, continues)
- `2` - Block action (PreToolUse only)

## Troubleshooting

### Hooks Not Running

**Check symlinks exist:**

```bash
ls -la .claude/hooks .gemini/hooks
# Should show symlinks to ../.agents/hooks
```

**Check settings.json:**

```bash
jq .hooks .claude/settings.json
jq .hooks .gemini/settings.json
# Should show hooks configuration
```

**Re-sync if needed:**

```bash
./.agents/hooks/sync-hooks.sh
```

### Hook Script Errors

**Check script is executable:**

```bash
ls -la .agents/hooks/scripts/*.sh
# Should show -rwxr-xr-x (x = executable)
```

**Test script directly:**

```bash
# PreToolUse/BeforeTool hooks (need JSON input)
echo '{"tool_input":{"file_path":"test.txt"}}' | .agents/hooks/scripts/protect-secrets.sh
echo $?  # Check exit code

# Notification hooks (no input needed)
.agents/hooks/scripts/notify.sh
```

**Check logs (stderr output):**

```bash
# Hooks log to stderr
# Check terminal output when hook runs
```

### Claude Code Hooks Failing with "File Not Found"

**Symptom:** Hooks fail with errors like "command not found" or "file not found" in Claude Code

**Cause:** Hook paths use incorrect environment variable or relative paths

**Solution:** Ensure hooks use `${CLAUDE_PROJECT_DIR}/.agents` for absolute paths

**Verification:**

```bash
# Check settings.json uses correct variable
jq '.hooks.PostToolUse[0].hooks[0].command' .claude/settings.json
# Should show: bash "${CLAUDE_PROJECT_DIR}/.agents/hooks/scripts/..."

# Test hook manually with environment variable
CLAUDE_PROJECT_DIR=$(pwd) bash .agents/hooks/scripts/auto-format.sh
```

**Note:** `${CLAUDE_PROJECT_DIR}` is set by Claude Code during hook execution and points to the project root, allowing hooks to work from any working directory.

### Auto-Format Not Working

**Check prettier installed:**

```bash
which prettier
# Should show path to prettier

# Install if missing
npm install -g prettier
```

**Check file type supported:**

```bash
prettier --check test.js
# Should show if file is supported
```

### Platform Detection Issues

**Check environment variables:**

```bash
# Claude Code
echo $CLAUDE_PROJECT_DIR
echo $CLAUDE_PROJECT_DIR/.agents

# Gemini CLI
echo $GEMINI_PROJECT_DIR
echo $GEMINI_SESSION_ID
```

**Manual platform detection:**

```bash
source .agents/hooks/scripts/lib/platform-detect.sh
detect_platform  # Should output: claude or gemini
```

## Benefits vs Previous System

### Simplicity

- **59% less code** (1,390 → 576 lines)
- **3 simple hooks** instead of 3 complex hooks
- **No npm dependencies** (prettier optional)
- **No complex validations** (tickets, PRs, quality gates)

### Cross-Platform

- **3 platforms** (Claude Code, Gemini CLI, Cursor)
- **Similar formats** (all support pre/post tool events)
- **Simple conversion** (event name mapping + format adaptation)
- **Shared scripts** (symlinks work universally)
- **Graceful degradation** (Cursor omits unsupported Notification events)

### Practicality

- **Real-world hooks** (notifications, formatting, protection)
- **Based on official examples** (Claude Code docs)
- **No pre-configurations** (works out of box)
- **Easy to understand** (clear, focused scripts)
- **Platform-aware** (hooks adapt to each platform's capabilities)

### Maintainability

- **Fewer files** (7 files total, all simple)
- **Two converters** (Gemini + Cursor format conversion)
- **Comprehensive docs** (3 platforms with comparison tables)
- **Easy testing** (manual tests for each platform)

## Migration from Old System

### What Changed

**Removed:**

- ❌ Antigravity support (no project-level hooks)
- ❌ Complex hooks (validate-commit, pre-push, post-merge)
- ❌ Dry-run mode (not needed for simple system)
- ❌ Heavy testing script (simplified to manual testing approach)

**Added:**

- ✅ Simple, practical hooks (notify, auto-format, protect-secrets)
- ✅ Streamlined sync process
- ✅ Better documentation

**Preserved:**

- ✅ progress.sh library (colors, emojis, logging)
- ✅ platform-detect.sh (simplified)
- ✅ Symlink-based distribution
- ✅ JSON validation

### Migration Steps

If migrating from old system:

1. **Backup current configs** (optional):

```bash
cp .claude/settings.json .claude/settings.json.bak
cp .gemini/settings.json .gemini/settings.json.bak
```

2. **Run new sync:**

```bash
./.agents/hooks/sync-hooks.sh
```

3. **Remove old Cursor hooks:**

```bash
rm -rf .cursor/hooks .cursor/hooks.json
```

4. **Test new hooks:**

```bash
# Follow testing instructions above
```

## References

- [Claude Code Hooks Documentation](https://github.com/anthropics/claude-code)
- [Gemini CLI Hooks](https://gemini.google.com/cli)
- Official hook examples: Based on `automate-workflows-with-hooks.md`

## Support

For issues or questions:

1. Check troubleshooting section above
2. Verify symlinks and configurations
3. Test hooks manually with sample input
4. Check platform-specific documentation
