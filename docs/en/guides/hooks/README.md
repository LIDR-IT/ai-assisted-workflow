# Hooks System Documentation Index

**Version:** 3-Hook Simplified System (576 lines, 59% reduction)
**Last Updated:** 2026-02-03
**Platforms:** Claude Code, Gemini CLI, Cursor

---

## Quick Navigation

- [Getting Started](#getting-started)
- [Core Documentation](#core-documentation)
- [Platform-Specific](#platform-specific-documentation)
- [Implementation](#implementation-files)
- [Development Resources](#development-resources)
- [Testing](#testing-documentation)
- [Reference](#technical-reference)

---

## Overview

The **LIDR Hooks System** is a simplified, cross-platform event-driven automation system supporting **3 practical hooks** across **3 AI platforms** (Claude Code, Gemini CLI, Cursor).

### System Statistics

- **Total Code:** 576 lines (vs 1,390 lines legacy system)
- **Reduction:** 59% less code
- **Platforms:** 3 (Claude Code ✅ Full, Gemini CLI ✅ Full, Cursor ⚠️ Partial)
- **Hooks:** 3 simple, focused hooks
- **Conversors:** 2 (Gemini, Cursor)

### Current Hooks

| Hook                   | Lines | Claude Code     | Gemini CLI      | Cursor           | Description                                      |
| ---------------------- | ----- | --------------- | --------------- | ---------------- | ------------------------------------------------ |
| **notify.sh**          | 16    | ✅ Notification | ✅ Notification | ❌ Not supported | Desktop notifications when AI needs attention    |
| **auto-format.sh**     | 36    | ✅ PostToolUse  | ✅ AfterTool    | ✅ postToolUse   | Auto-format files with prettier after Edit/Write |
| **protect-secrets.sh** | 31    | ✅ PreToolUse   | ✅ BeforeTool   | ✅ preToolUse    | Block edits to sensitive files before execution  |

**Total Hook Lines:** 83
**Supporting Infrastructure:** 493 lines (sync, detection, utilities)

---

## Getting Started

### Quick Start (5 Minutes)

```bash
# 1. Verify hooks configuration exists
cat .agents/hooks/hooks.json

# 2. Run synchronization
./.agents/hooks/sync-hooks.sh

# 3. Verify installation
ls -la .claude/hooks/          # Claude Code
ls -la .gemini/hooks/          # Gemini CLI
ls -la .cursor/hooks/          # Cursor

# 4. Test a hook manually
echo '{"tool_name":"Write","tool_input":{"file_path":"test.json"}}' | \
  bash .agents/hooks/scripts/auto-format.sh
```

### Prerequisites

- **prettier:** `npm install -g prettier` (for auto-format.sh)
- **jq:** For JSON validation (`brew install jq` on macOS)
- **Bash 4+:** Standard on macOS/Linux
- **Platform installed:** Claude Code, Gemini CLI, and/or Cursor

### New to Hooks?

1. **Start here:** [Hooks Quick Reference](./hooks-quick-reference.md) - Overview and common usage patterns
2. **Platform support:** [Platform Support Guide](./HOOKS_PLATFORM_SUPPORT.md) - Detailed comparison of 3 platforms
3. **Cursor users:** [Cursor-Specific Guide](../../en/references/hooks/cursor-hooks.md) - Important limitations and setup

---

## Core Documentation

### Main Guides (Start Here)

#### 1. [Hooks Quick Reference](./hooks-quick-reference.md)

**Audience:** All users
**Length:** ~400 lines
**Content:**

- Overview of 3-hook system
- Platform comparison table
- Hook input/output examples
- JSON schema reference
- Troubleshooting guide
- Cross-platform writing template

**When to use:** First-time setup, quick reference during development

#### 2. [Platform Support Guide](./HOOKS_PLATFORM_SUPPORT.md)

**Audience:** Multi-platform teams
**Length:** ~700 lines
**Content:**

- Detailed 3-platform comparison
- Event name mappings
- Format differences (PascalCase vs camelCase)
- Configuration examples for each platform
- Migration patterns
- Testing templates
- Best practices per platform

**When to use:** Planning multi-platform deployment, understanding platform differences

#### 3. [Cursor Support Restored](./CURSOR_SUPPORT_RESTORED.md)

**Audience:** Cursor users, system maintainers
**Length:** ~400 lines
**Content:**

- Complete restoration report
- Comparative tables (hooks, events, formats)
- Code statistics breakdown
- Degradation strategy (Notification event exclusion)
- Verification procedures
- Testing results

**When to use:** Understanding Cursor limitations, verifying Cursor setup, historical reference

---

## Platform-Specific Documentation

### Claude Code (Full Support: 3/3 Hooks)

**Primary Reference:** [Claude Code Hooks Reference](../../en/references/hooks/hooks-reference.md)

**Features:**

- Full support for all 3 hooks
- PascalCase event names (PreToolUse, PostToolUse, Notification)
- Nested JSON structure
- Uses `CLAUDE_PLUGIN_ROOT` environment variable
- Timeout in seconds
- Configuration: `.claude/settings.json`

**Quick Links:**

- [Hooks Guide](../../en/references/hooks/hooks-guide-claude-code.md)
- [Workflow Automation](../../en/references/hooks/automate-workflows-with-hooks.md)
- Manual Testing: `.agents/tickets/active/TICK-003-start-02-02-2026/resources/test-claude-code-manual-validation.md`

### Gemini CLI (Full Support: 3/3 Hooks)

**Primary Reference:** [Gemini CLI Hooks](../../en/references/hooks/gemini-cli-hooks.md)

**Features:**

- Full support for all 3 hooks
- PascalCase event names (BeforeTool, AfterTool, Notification)
- **CRITICAL:** PURE JSON stdout requirement (no text allowed)
- Timeout in **milliseconds** (×1000)
- Uses `GEMINI_PROJECT_DIR` environment variable
- Configuration: `.gemini/settings.json`

**Quick Links:**

- Manual Testing: `.agents/tickets/active/TICK-003-start-02-02-2026/resources/test-gemini-manual-validation.md`
- [Platform Support Details](./HOOKS_PLATFORM_SUPPORT.md#gemini-cli-format)

### Cursor (Partial Support: 2/3 Hooks)

**Primary Reference:** [Cursor Hooks Guide](../../en/references/hooks/cursor-hooks.md)

**Features:**

- ✅ Supports: auto-format.sh, protect-secrets.sh
- ❌ **NOT supported:** notify.sh (Notification event doesn't exist)
- camelCase event names (preToolUse, postToolUse)
- Flat JSON structure (version: 1 required)
- Uses `CURSOR_PROJECT_DIR` environment variable
- Timeout in seconds
- Configuration: `.cursor/hooks.json`

**Important Notes:**

- notify.sh is automatically excluded during sync
- Only 2 hooks will appear in Cursor configuration
- Test notifications on Claude Code or Gemini CLI instead

**Quick Links:**

- Manual Testing: `.agents/tickets/active/TICK-003-start-02-02-2026/resources/test-cursor-manual-validation.md`
- [Cursor Support Report](./CURSOR_SUPPORT_RESTORED.md#cursor-specific-behavior)

---

## Implementation Files

### Source Configuration

**Location:** `.agents/hooks/`

#### Core Files

1. **[hooks.json](.agents/hooks/hooks.json)** (41 lines)
   - Master configuration (Claude Code format)
   - Source of truth for all platforms
   - Defines hooks, events, matchers, timeouts
   - Edit this file, then run sync

2. **[sync-hooks.sh](.agents/hooks/sync-hooks.sh)** (324 lines)
   - Synchronization orchestrator
   - 3 platform conversors (Claude, Gemini, Cursor)
   - Functions: `sync_claude()`, `sync_gemini()`, `sync_cursor()`
   - Includes validation and verification

#### Hook Scripts

**Location:** `.agents/hooks/scripts/`

1. **[notify.sh](.agents/hooks/scripts/notify.sh)** (16 lines)
   - Desktop notifications via OS-native tools
   - Platforms: Claude Code ✅, Gemini CLI ✅, Cursor ❌
   - Event: Notification
   - Timeout: 5 seconds

2. **[auto-format.sh](.agents/hooks/scripts/auto-format.sh)** (36 lines)
   - Auto-format with prettier
   - Platforms: Claude Code ✅, Gemini CLI ✅, Cursor ✅
   - Event: PostToolUse/AfterTool/postToolUse
   - Timeout: 30 seconds
   - Gracefully skips if prettier not installed

3. **[protect-secrets.sh](.agents/hooks/scripts/protect-secrets.sh)** (31 lines)
   - Blocks edits to sensitive files (.env, .key, .pem)
   - Platforms: Claude Code ✅, Gemini CLI ✅, Cursor ✅
   - Event: PreToolUse/BeforeTool/preToolUse
   - Timeout: 10 seconds
   - Returns exit code 2 to block operation

#### Utilities

**Location:** `.agents/hooks/scripts/lib/`

1. **[platform-detect.sh](.agents/hooks/scripts/lib/platform-detect.sh)** (55 lines)
   - Detects which AI platform is running
   - Checks environment variables: `CLAUDE_PLUGIN_ROOT`, `GEMINI_PROJECT_DIR`, `CURSOR_PROJECT_DIR`
   - Used by hooks for platform-specific behavior

2. **[progress.sh](.agents/hooks/scripts/lib/progress.sh)** (76 lines)
   - Output utilities (colors, emojis, formatting)
   - Used by sync script for user-friendly output

### Generated Configurations

**Don't edit these directly - generated by sync-hooks.sh**

- `.claude/settings.json` - Claude Code (merged into existing settings)
- `.gemini/settings.json` - Gemini CLI (merged into existing settings)
- `.cursor/hooks.json` - Cursor (standalone file)

---

## Development Resources

### Skills

#### [hook-development](.agents/skills/hook-development/SKILL.md)

**Type:** Development skill
**Usage:** `@hook-development` when creating new hooks

**Contents:**

- Hook structure and patterns
- Input/output schema
- Exit codes (0 = allow, 1 = error, 2 = block)
- JSON output format
- Platform compatibility guidelines

**References:**

- [Advanced Patterns](.agents/skills/hook-development/references/advanced.md)
- [Migration Guide](.agents/skills/hook-development/references/migration.md)
- [Common Patterns](.agents/skills/hook-development/references/patterns.md)

**Examples:**

- [Load Context Hook](.agents/skills/hook-development/examples/load-context.sh)
- [Validate Bash](.agents/skills/hook-development/examples/validate-bash.sh)
- [Validate Write](.agents/skills/hook-development/examples/validate-write.sh)

**Scripts:**

- [Hook Linter](.agents/skills/hook-development/scripts/hook-linter.sh)
- [Test Hook](.agents/skills/hook-development/scripts/test-hook.sh)
- [Validate Schema](.agents/skills/hook-development/scripts/validate-hook-schema.sh)

### Commands

#### [/test-hooks](.agents/commands/test-hooks.md)

**Type:** Slash command
**Usage:** `/test-hooks` in any AI platform

**Features:**

- Interactive testing for all 3 hooks
- Platform-specific test scenarios
- Validates hook execution
- Checks output format
- Verifies exit codes

### Complete Implementation Guide

**[.agents/hooks-readme.md](.agents/hooks-readme.md)** (525 lines)

**The definitive implementation reference - source of truth for:**

- Complete architecture overview
- Platform support matrix
- Event mappings (PreToolUse ↔ BeforeTool ↔ preToolUse)
- Format differences
- Synchronization strategy
- Hook development guidelines
- Troubleshooting procedures
- Testing instructions
- Migration guide (complex → simple system)

**When to use:** Implementing new hooks, understanding architecture, troubleshooting issues

---

## Testing Documentation

### Manual Testing Guides

**Location:** `.agents/tickets/active/TICK-003-start-02-02-2026/resources/`

#### [TESTING_GUIDE.md](../../.agents/tickets/active/TICK-003-start-02-02-2026/resources/TESTING_GUIDE.md)

**Overview guide for manual testing across all 3 platforms**

**Contents:**

- Testing order recommendation
- Platform comparison
- Time estimates (3 hours total for all platforms)
- Common issues and solutions
- Success criteria
- Test data locations

#### Platform-Specific Test Files

1. **[test-claude-code-manual-validation.md](../../.agents/tickets/active/TICK-003-start-02-02-2026/resources/test-claude-code-manual-validation.md)**
   - Duration: ~60 minutes
   - Tests: All 3 hooks (notify, auto-format, protect-secrets)
   - 5 comprehensive test scenarios

2. **[test-cursor-manual-validation.md](../../.agents/tickets/active/TICK-003-start-02-02-2026/resources/test-cursor-manual-validation.md)**
   - Duration: ~50 minutes
   - Tests: 2 hooks only (auto-format, protect-secrets)
   - Note: notify.sh correctly excluded
   - 5 test scenarios

3. **[test-gemini-manual-validation.md](../../.agents/tickets/active/TICK-003-start-02-02-2026/resources/test-gemini-manual-validation.md)**
   - Duration: ~65 minutes
   - Tests: All 3 hooks + PURE JSON verification
   - 7 test scenarios (includes Gemini-specific requirements)

### Automated Testing

```bash
# Run hook linter
.agents/skills/hook-development/scripts/hook-linter.sh .agents/hooks/scripts/*.sh

# Test specific hook
.agents/skills/hook-development/scripts/test-hook.sh .agents/hooks/scripts/auto-format.sh

# Validate hook schema
.agents/skills/hook-development/scripts/validate-hook-schema.sh .agents/hooks/hooks.json
```

---

## Technical Reference

### Event Lifecycle

All platforms follow this lifecycle:

1. **User action** → Tool invocation (Edit, Write, etc.)
2. **PreToolUse/BeforeTool/preToolUse** → Hook runs BEFORE operation
   - Exit 0: Allow operation
   - Exit 2: Block operation (deny)
   - Exit 1: Error (usually allows operation)
3. **Tool executes** → If allowed
4. **PostToolUse/AfterTool/postToolUse** → Hook runs AFTER operation
   - Exit 0: Success
   - Exit 1: Warning (doesn't affect operation)
5. **Notification** → Hook runs when AI waits for input
   - Claude Code ✅
   - Gemini CLI ✅
   - Cursor ❌ (event doesn't exist)

### Event Name Mappings

| Claude Code    | Gemini CLI     | Cursor           | Purpose                              |
| -------------- | -------------- | ---------------- | ------------------------------------ |
| `PreToolUse`   | `BeforeTool`   | `preToolUse`     | Validate/block before tool execution |
| `PostToolUse`  | `AfterTool`    | `postToolUse`    | React after tool execution           |
| `Notification` | `Notification` | ❌ Not supported | Respond to notifications             |

### JSON Input Schema

All hooks receive JSON via stdin:

```json
{
  "tool_name": "Write",
  "tool_input": {
    "file_path": "/path/to/file.txt",
    "content": "file content..."
  }
}
```

**Fields:**

- `tool_name`: String (Edit, Write, Bash, etc.)
- `tool_input`: Object (varies by tool)
  - `file_path`: String (for Edit/Write)
  - `content`: String (for Write)
  - `command`: String (for Bash)

### JSON Output Schema

Hooks must output valid JSON to stdout:

```json
{
  "permissionDecision": "allow",
  "reason": "Optional explanation"
}
```

**Permission Decisions:**

- `allow`: Operation proceeds
- `deny`: Operation blocked (PreToolUse only)
- `ask`: Prompt user for confirmation

**Exit Codes:**

- `0`: Success/Allow
- `1`: Error/Warning
- `2`: Block (PreToolUse only)

### Configuration Locations

| Platform    | Config File             | Hooks Location                     | Env Variable         |
| ----------- | ----------------------- | ---------------------------------- | -------------------- |
| Claude Code | `.claude/settings.json` | `.claude/hooks/scripts/` (symlink) | `CLAUDE_PLUGIN_ROOT` |
| Gemini CLI  | `.gemini/settings.json` | `.gemini/hooks/scripts/` (symlink) | `GEMINI_PROJECT_DIR` |
| Cursor      | `.cursor/hooks.json`    | `.cursor/hooks/scripts/` (symlink) | `CURSOR_PROJECT_DIR` |

---

## Common Tasks

### Adding a New Hook

```bash
# 1. Create hook script
vim .agents/hooks/scripts/my-hook.sh

# 2. Make executable
chmod +x .agents/hooks/scripts/my-hook.sh

# 3. Add to hooks.json
vim .agents/hooks/hooks.json
# Add new hook entry with event, matcher, timeout

# 4. Run sync
./.agents/hooks/sync-hooks.sh

# 5. Test manually
echo '{"tool_name":"Write","tool_input":{"file_path":"test.txt"}}' | \
  bash .agents/hooks/scripts/my-hook.sh
```

### Updating Hook Configuration

```bash
# 1. Edit master config
vim .agents/hooks/hooks.json

# 2. Run sync (dry-run first)
./.agents/hooks/sync-hooks.sh --dry-run

# 3. Apply changes
./.agents/hooks/sync-hooks.sh

# 4. Verify
jq .hooks .claude/settings.json
jq .hooks .gemini/settings.json
jq . .cursor/hooks.json
```

### Troubleshooting Hooks

```bash
# Check hook execution
echo '{"tool_name":"Write","tool_input":{"file_path":"test.json"}}' | \
  bash .agents/hooks/scripts/auto-format.sh

# Check exit code
echo $?  # Should be 0 for success

# Verify platform detection
source .agents/hooks/scripts/lib/platform-detect.sh
detect_platform  # Should print: claude, gemini, or cursor

# Test hook with linter
.agents/skills/hook-development/scripts/hook-linter.sh \
  .agents/hooks/scripts/my-hook.sh
```

### Disabling a Hook Temporarily

```bash
# Method 1: Comment out in hooks.json
vim .agents/hooks/hooks.json
# Comment the hook entry, then sync

# Method 2: Rename script (platform-specific)
mv .claude/hooks/scripts/notify.sh .claude/hooks/scripts/notify.sh.disabled

# Method 3: Remove from platform config (not recommended)
# Edit .claude/settings.json directly (will be overwritten on next sync)
```

---

## Migration Guides

### From Legacy Git Hooks (1,390 lines) to Simplified System (576 lines)

**See:** [Migration Guide](.agents/skills/hook-development/references/migration.md)

**Key Changes:**

- **validate-commit.sh** → Removed (use git pre-commit hooks instead)
- **post-merge.sh** → Removed (simplified to sync scripts)
- **pre-push.sh** → Removed (use CI/CD instead)
- **New:** notify.sh, auto-format.sh, protect-secrets.sh

**Benefits:**

- 59% code reduction
- Platform-agnostic (works across 3 AI platforms)
- Event-driven (not git-specific)
- Simpler, focused hooks

### From 2-Platform to 3-Platform Support

**See:** [Cursor Support Report](./CURSOR_SUPPORT_RESTORED.md)

**What Changed:**

- Added Cursor support with degradation (2/3 hooks)
- Created cursor conversor in sync-hooks.sh
- Auto-excludes notify.sh for Cursor
- Generates camelCase format (preToolUse, postToolUse)

---

## FAQ

### General Questions

**Q: Which platform should I use?**
A: All 3 platforms are supported. Claude Code and Gemini CLI have full support (3/3 hooks). Cursor has partial support (2/3 hooks - no notifications).

**Q: Can I use hooks without prettier?**
A: Yes. auto-format.sh gracefully skips formatting if prettier is not installed. Other hooks don't depend on prettier.

**Q: What happens if a hook times out?**
A: The operation proceeds (for PostToolUse) or is blocked (for PreToolUse). Hooks should complete quickly (<5 seconds for normal files).

**Q: Can I customize hook behavior?**
A: Yes. Edit scripts in `.agents/hooks/scripts/`, then run sync. All platforms will use the updated hook.

### Platform-Specific Questions

**Q: Why doesn't notify.sh work on Cursor?**
A: Cursor does not support the Notification event. This is a platform limitation, not a bug. notify.sh is automatically excluded from Cursor configuration.

**Q: What's the difference between PreToolUse and BeforeTool?**
A: Same functionality, different naming. Claude Code uses `PreToolUse`, Gemini CLI uses `BeforeTool`. The sync script handles conversion automatically.

**Q: Why does Gemini CLI require PURE JSON output?**
A: Gemini CLI's hook system only accepts valid JSON in stdout. Any text output (echo, debug messages) must go to stderr instead.

**Q: Can I use git hooks with this system?**
A: Yes, but separately. This system provides **platform hooks** (AI agent events), not **git hooks** (git events). You can use both simultaneously.

### Troubleshooting Questions

**Q: Hook doesn't execute - what should I check?**
A:

1. Verify hook is executable: `ls -la .agents/hooks/scripts/`
2. Test manually: `echo '{}' | bash .agents/hooks/scripts/my-hook.sh`
3. Check sync: `./.agents/hooks/sync-hooks.sh --dry-run`
4. Verify platform config: `jq .hooks .claude/settings.json`

**Q: Hook returns "command not found" error**
A: Check script has correct shebang (`#!/bin/bash`) and uses absolute paths or PATH resolution.

**Q: Changes to hooks.json not reflected**
A: Run `./.agents/hooks/sync-hooks.sh` to regenerate platform configs. Changes in hooks.json require sync.

---

## Contributing

### Adding New Hooks

1. Create script in `.agents/hooks/scripts/`
2. Follow hook development guidelines in [hook-development skill](.agents/skills/hook-development/SKILL.md)
3. Add entry to `.agents/hooks/hooks.json`
4. Run sync and test on all 3 platforms
5. Update this index and relevant documentation

### Improving Documentation

1. Follow documentation standards in `.agents/rules/process/documentation.md`
2. Update this index if adding new files
3. Test links and examples
4. Commit with descriptive message

### Reporting Issues

- **Bugs:** Create issue with reproduction steps, platform, hook script
- **Feature requests:** Describe use case, expected behavior, platforms affected
- **Documentation:** Specify unclear section, suggested improvement

---

## Additional Resources

### External Documentation

- **Claude Code:** [Official Hooks Documentation](https://docs.anthropic.com/claude/docs/hooks)
- **Prettier:** [Configuration Guide](https://prettier.io/docs/en/configuration.html)
- **Bash Scripting:** [Advanced Bash-Scripting Guide](https://tldp.org/LDP/abs/html/)
- **JSON Schema:** [Understanding JSON Schema](https://json-schema.org/understanding-json-schema/)

### Related LIDR Documentation

- **Rules System:** `.agents/rules-readme.md`
- **Skills System:** `.agents/skills-readme.md`
- **Commands System:** `.agents/commands-readme.md`
- **MCP Integration:** `docs/guides/mcp/mcp-setup-guide.md`
- **Git Workflow:** `.agents/rules/process/git-workflow.md`

---

## Quick Reference Card

```bash
# Sync all hooks
./.agents/hooks/sync-hooks.sh

# Dry run (preview changes)
./.agents/hooks/sync-hooks.sh --dry-run

# Test hook manually
echo '{"tool_name":"Write","tool_input":{"file_path":"test.json"}}' | \
  bash .agents/hooks/scripts/auto-format.sh

# Check hook exit code
echo $?  # 0=success, 1=error, 2=block

# Verify hooks installed
ls -la .claude/hooks/scripts/
ls -la .gemini/hooks/scripts/
ls -la .cursor/hooks/scripts/

# Check platform configs
jq .hooks .claude/settings.json
jq .hooks .gemini/settings.json
jq . .cursor/hooks.json

# Run interactive testing
/test-hooks

# Lint hook script
.agents/skills/hook-development/scripts/hook-linter.sh script.sh

# Validate hooks.json
jq empty .agents/hooks/hooks.json
```

---

## Document History

| Date       | Change                                                           | Author            |
| ---------- | ---------------------------------------------------------------- | ----------------- |
| 2026-02-03 | Created master index for 3-platform hooks system                 | Claude Sonnet 4.5 |
| 2026-02-03 | Documented simplified 3-hook system (576 lines, 59% reduction)   | Claude Sonnet 4.5 |
| 2026-02-03 | Added Cursor support with degradation strategy                   | Claude Sonnet 4.5 |
| 2026-02-03 | Removed legacy git hooks documentation (focus on current system) | Claude Sonnet 4.5 |

---

**For questions, issues, or contributions, see [Contributing](#contributing) section above.**
