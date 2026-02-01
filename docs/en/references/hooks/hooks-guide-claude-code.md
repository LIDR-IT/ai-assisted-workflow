# Hooks in Claude Code

## Overview

**Hooks** are user-defined shell commands that execute at various points in Claude Code's lifecycle. They provide deterministic control over Claude Code's behavior, ensuring certain actions always happen rather than relying on the LLM to choose to run them.

**Official Documentation:** [code.claude.com/docs/en/hooks-guide](https://code.claude.com/docs/en/hooks-guide)

**Key Benefit:** "Turn suggestions into app-level code that executes every time it is expected to run."

---

## Core Concept

### What Are Hooks?

Hooks are **user-defined shell commands** that provide:
- **Deterministic control** - Actions execute automatically, not at LLM discretion
- **Lifecycle integration** - Run at specific points in Claude's workflow
- **Customization** - Tailor Claude Code behavior to your needs
- **Automation** - Encode rules as code instead of prompts

### Why Use Hooks Instead of Prompts?

**Prompts (unreliable):**
- "Please run prettier on all TypeScript files"
- Depends on LLM decision-making
- May forget or skip

**Hooks (deterministic):**
- Automatically runs prettier after every file edit
- Always executes at defined lifecycle point
- No LLM discretion required

By encoding rules as hooks, you turn suggestions into app-level code.

---

## Use Cases

### Notifications
- Customize notifications when Claude awaits input or permission
- Desktop notifications, sounds, custom alerts

### Automatic Formatting
- Run `prettier` on .ts files after edits
- Run `gofmt` on .go files after edits
- Run `black` on .py files after edits

### Logging
- Track and count executed commands
- Compliance tracking
- Debugging assistance

### Feedback
- Automated feedback when code doesn't follow conventions
- Linting checks
- Style enforcement

### Custom Permissions
- Block modifications to production files
- Protect sensitive directories
- Prevent destructive operations

---

## Hook Events

Claude Code provides **11 hook events** that run at different workflow points:

| Event                 | When It Runs                                               | Can Block |
|:----------------------|:-----------------------------------------------------------|:----------|
| `PreToolUse`          | Before tool calls                                          | Yes       |
| `PermissionRequest`   | When permission dialog shown                               | Yes       |
| `PostToolUse`         | After tool calls complete                                  | No        |
| `UserPromptSubmit`    | When user submits prompt, before Claude processes          | No        |
| `Notification`        | When Claude Code sends notifications                       | No        |
| `Stop`                | When Claude Code finishes responding                       | No        |
| `SubagentStop`        | When subagent tasks complete                               | No        |
| `PreCompact`          | Before Claude Code runs compact operation                  | No        |
| `Setup`               | When Claude Code invoked with `--init`, `--init-only`, `--maintenance` | No |
| `SessionStart`        | When Claude Code starts new session or resumes existing    | No        |
| `SessionEnd`          | When Claude Code session ends                              | No        |

**Blocking hooks:** `PreToolUse` and `PermissionRequest` can block operations and provide feedback to Claude.

---

## Quickstart: Log Bash Commands

This quickstart creates a hook that logs all shell commands Claude Code runs.

### Prerequisites

Install `jq` for JSON processing:

```bash
# macOS
brew install jq

# Ubuntu/Debian
sudo apt-get install jq
```

### Step 1: Open Hooks Configuration

Within Claude Code:

```
/hooks
```

Select the `PreToolUse` hook event.

### Step 2: Add Matcher

Select `+ Add new matcher…` to run hook only on Bash tool calls.

Type: `Bash`

**Note:** Use `*` to match all tools.

### Step 3: Add Hook Command

Select `+ Add new hook…` and enter:

```bash
jq -r '"\(.tool_input.command) - \(.tool_input.description // "No description")"' >> ~/.claude/bash-command-log.txt
```

### Step 4: Save Configuration

**Storage location:** Select `User settings` (applies to all projects)

Press `Esc` to return to REPL. Hook is now registered.

### Step 5: Verify Hook

Run `/hooks` again or check `~/.claude/settings.json`:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "jq -r '\"\\(.tool_input.command) - \\(.tool_input.description // \"No description\")\"' >> ~/.claude/bash-command-log.txt"
          }
        ]
      }
    ]
  }
}
```

### Step 6: Test Hook

Ask Claude to run a simple command:

```
> Run ls in the current directory
```

Check log file:

```bash
cat ~/.claude/bash-command-log.txt
```

Output:

```
ls - Lists files and directories
```

---

## Hook Configuration Format

Hooks are configured in settings files using JSON.

### Basic Structure

```json
{
  "hooks": {
    "EventName": [
      {
        "matcher": "ToolName",
        "hooks": [
          {
            "type": "command",
            "command": "your-shell-command"
          }
        ]
      }
    ]
  }
}
```

### Matcher Field

The `matcher` field determines which tools trigger the hook:

- `"*"` - Match all tools
- `"Bash"` - Match specific tool by name
- `"Edit|Write"` - Match multiple tools (pipe-separated)

### Hook Type

Currently only `"command"` type is supported (shell commands).

### Command Field

The shell command to execute. Receives event data via stdin as JSON.

---

## Complete Examples

### Example 1: Code Formatting Hook

Automatically format TypeScript files after editing:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "jq -r '.tool_input.file_path' | { read file_path; if echo \"$file_path\" | grep -q '\\.ts$'; then npx prettier --write \"$file_path\"; fi; }"
          }
        ]
      }
    ]
  }
}
```

**How it works:**
1. Triggers after Edit or Write tool calls
2. Extracts file path from JSON
3. Checks if file is TypeScript (.ts)
4. Runs prettier on file if TypeScript

### Example 2: Markdown Formatting Hook

Automatically fix missing language tags and formatting in markdown files.

**Hook configuration:**

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/markdown_formatter.py"
          }
        ]
      }
    ]
  }
}
```

**Script:** `.claude/hooks/markdown_formatter.py`

```python
#!/usr/bin/env python3
"""
Markdown formatter for Claude Code output.
Fixes missing language tags and spacing issues while preserving code content.
"""
import json
import sys
import re
import os

def detect_language(code):
    """Best-effort language detection from code content."""
    s = code.strip()

    # JSON detection
    if re.search(r'^\s*[{\[]', s):
        try:
            json.loads(s)
            return 'json'
        except:
            pass

    # Python detection
    if re.search(r'^\s*def\s+\w+\s*\(', s, re.M) or \
       re.search(r'^\s*(import|from)\s+\w+', s, re.M):
        return 'python'

    # JavaScript detection
    if re.search(r'\b(function\s+\w+\s*\(|const\s+\w+\s*=)', s) or \
       re.search(r'=>|console\.(log|error)', s):
        return 'javascript'

    # Bash detection
    if re.search(r'^#!.*\b(bash|sh)\b', s, re.M) or \
       re.search(r'\b(if|then|fi|for|in|do|done)\b', s):
        return 'bash'

    # SQL detection
    if re.search(r'\b(SELECT|INSERT|UPDATE|DELETE|CREATE)\s+', s, re.I):
        return 'sql'

    return 'text'

def format_markdown(content):
    """Format markdown content with language detection."""
    # Fix unlabeled code fences
    def add_lang_to_fence(match):
        indent, info, body, closing = match.groups()
        if not info.strip():
            lang = detect_language(body)
            return f"{indent}```{lang}\n{body}{closing}\n"
        return match.group(0)

    fence_pattern = r'(?ms)^([ \t]{0,3})```([^\n]*)\n(.*?)(\n\1```)\s*$'
    content = re.sub(fence_pattern, add_lang_to_fence, content)

    # Fix excessive blank lines (only outside code fences)
    content = re.sub(r'\n{3,}', '\n\n', content)

    return content.rstrip() + '\n'

# Main execution
try:
    input_data = json.load(sys.stdin)
    file_path = input_data.get('tool_input', {}).get('file_path', '')

    if not file_path.endswith(('.md', '.mdx')):
        sys.exit(0)  # Not a markdown file

    if os.path.exists(file_path):
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        formatted = format_markdown(content)

        if formatted != content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(formatted)
            print(f"✓ Fixed markdown formatting in {file_path}")

except Exception as e:
    print(f"Error formatting markdown: {e}", file=sys.stderr)
    sys.exit(1)
```

**Make script executable:**

```bash
chmod +x .claude/hooks/markdown_formatter.py
```

**What it does:**
- Detects programming languages in unlabeled code blocks
- Adds appropriate language tags for syntax highlighting
- Fixes excessive blank lines
- Only processes markdown files (.md, .mdx)

### Example 3: Custom Desktop Notifications

Get desktop notifications when Claude needs input:

```json
{
  "hooks": {
    "Notification": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "notify-send 'Claude Code' 'Awaiting your input'"
          }
        ]
      }
    ]
  }
}
```

**macOS alternative:**

```json
{
  "hooks": {
    "Notification": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "osascript -e 'display notification \"Awaiting your input\" with title \"Claude Code\"'"
          }
        ]
      }
    ]
  }
}
```

### Example 4: File Protection Hook

Block edits to sensitive files:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "python3 -c \"import json, sys; data=json.load(sys.stdin); path=data.get('tool_input',{}).get('file_path',''); sys.exit(2 if any(p in path for p in ['.env', 'package-lock.json', '.git/']) else 0)\""
          }
        ]
      }
    ]
  }
}
```

**How it works:**
1. Triggers before Edit or Write operations
2. Checks if file path contains sensitive patterns
3. Exits with code 2 to block operation if sensitive file detected
4. Allows operation (exit code 0) otherwise

**Protected files:**
- `.env` files
- `package-lock.json`
- `.git/` directory

### Example 5: Comprehensive Bash Command Validator

**Complete example implementation:** [bash_command_validator_example.py](https://github.com/anthropics/claude-code/blob/main/examples/hooks/bash_command_validator_example.py)

**Features:**
- Validates bash commands before execution
- Blocks dangerous operations
- Provides feedback to Claude on what to do differently
- Pattern-based detection of risky commands

---

## Hook Exit Codes

Hooks use exit codes to communicate results to Claude Code:

| Exit Code | Meaning                                              | Applicable Events          |
|:----------|:-----------------------------------------------------|:---------------------------|
| 0         | Success - Allow operation to proceed                 | All events                 |
| 1         | Error - Log warning but allow operation              | All events                 |
| 2         | Block - Prevent operation and provide feedback       | PreToolUse, PermissionRequest |

### Example: Blocking Hook

```python
import sys
import json

data = json.load(sys.stdin)
file_path = data.get('tool_input', {}).get('file_path', '')

# Block operations on production files
if 'production' in file_path:
    print("Cannot modify production files. Use staging instead.")
    sys.exit(2)  # Block operation

# Allow all other operations
sys.exit(0)
```

**Result:** When Claude tries to edit a production file:
1. Hook exits with code 2
2. Operation is blocked
3. Claude receives message: "Cannot modify production files. Use staging instead."
4. Claude can adjust and try again

---

## Hook Data Format

Hooks receive event data via stdin as JSON. Format varies by event type.

### PreToolUse Data

```json
{
  "tool_name": "Bash",
  "tool_input": {
    "command": "ls -la",
    "description": "List files in current directory"
  }
}
```

### PostToolUse Data

```json
{
  "tool_name": "Edit",
  "tool_input": {
    "file_path": "/path/to/file.ts",
    "old_string": "const x = 1",
    "new_string": "const x = 2"
  },
  "tool_output": "Edit completed successfully"
}
```

### Notification Data

```json
{
  "message": "Awaiting user input",
  "type": "info"
}
```

### PermissionRequest Data

```json
{
  "tool_name": "Bash",
  "tool_input": {
    "command": "rm -rf /tmp/cache"
  },
  "permission_type": "allow_once"
}
```

---

## Security Considerations

**Critical Warning:** Hooks run automatically during agent loop with your current environment's credentials.

### Security Risks

**Malicious hooks can:**
- Exfiltrate your data
- Modify files without permission
- Execute arbitrary commands
- Access sensitive credentials

### Security Best Practices

**1. Review all hooks before registration**
- Understand what each hook does
- Verify hook source is trusted
- Check for suspicious commands

**2. Use least privilege**
- Only grant necessary permissions
- Avoid running hooks as root/admin
- Limit file system access

**3. Validate hook inputs**
- Sanitize data from JSON
- Check file paths for traversal attacks
- Validate commands before execution

**4. Audit hook execution**
- Log hook activity
- Monitor for unexpected behavior
- Review logs regularly

**5. Test in safe environment**
- Test new hooks in isolated environment
- Verify behavior before production use
- Check for unintended side effects

### Example: Secure Hook Pattern

```python
#!/usr/bin/env python3
import json
import sys
import os
import re

def is_safe_path(path):
    """Validate file path for security."""
    # Resolve to absolute path
    abs_path = os.path.abspath(path)

    # Check for path traversal
    if '..' in path:
        return False

    # Check for sensitive directories
    sensitive = ['/etc', '/usr/bin', '/System']
    if any(abs_path.startswith(s) for s in sensitive):
        return False

    return True

try:
    data = json.load(sys.stdin)
    file_path = data.get('tool_input', {}).get('file_path', '')

    # Validate input
    if not is_safe_path(file_path):
        print("Error: Unsafe file path detected")
        sys.exit(1)

    # Safe operation here
    # ...

except Exception as e:
    print(f"Error: {e}", file=sys.stderr)
    sys.exit(1)
```

---

## Debugging Hooks

### Common Issues

**Hook not triggering:**
1. Check matcher pattern matches tool name
2. Verify hook is saved in correct settings file
3. Confirm event type is correct
4. Check if hook is enabled

**Hook fails silently:**
1. Add logging to hook script
2. Check exit codes
3. Verify JSON parsing works
4. Test hook command manually

**Permission errors:**
1. Make script executable (`chmod +x`)
2. Check file permissions
3. Verify script shebang is correct
4. Check environment variables

### Debugging Techniques

**1. Add logging:**

```bash
# Log to file
echo "Hook executed at $(date)" >> /tmp/hook.log
jq '.' >> /tmp/hook-data.log  # Log input JSON
```

**2. Test hook manually:**

```bash
# Simulate hook execution
echo '{"tool_name":"Bash","tool_input":{"command":"ls"}}' | \
  your-hook-script.sh
```

**3. Check hook output:**

```bash
# Add debug output
set -x  # Enable bash debugging
echo "Debug: Processing file $file_path"
```

**4. Verify JSON parsing:**

```python
# Test JSON parsing
import json
import sys

try:
    data = json.load(sys.stdin)
    print(f"Received: {data}", file=sys.stderr)
except json.JSONDecodeError as e:
    print(f"JSON error: {e}", file=sys.stderr)
    sys.exit(1)
```

---

## Hook Scoping

Hooks can be configured at different scopes:

### User Settings

**Location:** `~/.claude/settings.json`

**Applies to:** All projects for this user

**Use for:**
- Personal preferences
- Cross-project rules
- User-specific notifications

### Project Settings

**Location:** `.claude/settings.json` (in project root)

**Applies to:** This project only

**Use for:**
- Project-specific formatting
- Team conventions
- Project workflows

### Managed Settings

**Location:** System-wide managed configuration

**Applies to:** All users in organization

**Use for:**
- Organization policies
- Security requirements
- Compliance rules

**See:** Settings documentation for managed configuration paths

---

## Advanced Patterns

### Pattern 1: Conditional Execution

Execute hook only under specific conditions:

```bash
#!/bin/bash
# Only run on weekdays
if [[ $(date +%u) -le 5 ]]; then
  # Hook logic here
  echo "Running on weekday"
fi
```

### Pattern 2: Multi-Tool Matcher

Match multiple tools with single hook:

```json
{
  "matcher": "Edit|Write|Bash",
  "hooks": [...]
}
```

### Pattern 3: Chain Multiple Hooks

Run multiple hooks for same event:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit",
        "hooks": [
          { "type": "command", "command": "hook1.sh" },
          { "type": "command", "command": "hook2.sh" },
          { "type": "command", "command": "hook3.sh" }
        ]
      }
    ]
  }
}
```

Hooks execute in order. If one fails, subsequent hooks still run.

### Pattern 4: Dynamic Hook Selection

Use environment variables to control hook behavior:

```bash
#!/bin/bash
if [[ "$CLAUDE_ENV" == "production" ]]; then
  # Strict validation for production
  strict-validator.sh
else
  # Lenient validation for development
  lenient-validator.sh
fi
```

### Pattern 5: Context-Aware Hooks

Use project-specific paths:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "$CLAUDE_PROJECT_DIR/.claude/hooks/custom-formatter.sh"
          }
        ]
      }
    ]
  }
}
```

**Available variables:**
- `$CLAUDE_PROJECT_DIR` - Current project directory
- `$CLAUDE_SESSION_ID` - Current session ID
- Other environment variables from your shell

---

## Hook Best Practices

### 1. Keep Hooks Fast

✅ **DO:** Optimize for speed (hooks run frequently)

```bash
# Fast: Direct check
if [[ "$file_path" == *.ts ]]; then
  npx prettier --write "$file_path"
fi
```

❌ **DON'T:** Run expensive operations unnecessarily

```bash
# Slow: Unnecessary processing
find . -name "*.ts" | while read f; do
  npx prettier --write "$f"
done
```

### 2. Fail Gracefully

✅ **DO:** Handle errors and provide clear feedback

```python
try:
    # Hook logic
    process_file(file_path)
except FileNotFoundError:
    print(f"Error: File not found: {file_path}")
    sys.exit(1)
except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)
```

❌ **DON'T:** Fail silently or with cryptic errors

### 3. Use Specific Matchers

✅ **DO:** Target specific tools when possible

```json
{
  "matcher": "Edit|Write"
}
```

❌ **DON'T:** Use wildcard unnecessarily

```json
{
  "matcher": "*"  // Runs for ALL tools
}
```

### 4. Validate Inputs

✅ **DO:** Check and sanitize all inputs

```python
file_path = data.get('tool_input', {}).get('file_path', '')
if not file_path or not os.path.exists(file_path):
    sys.exit(0)  # Skip if invalid
```

❌ **DON'T:** Assume inputs are valid

### 5. Document Your Hooks

✅ **DO:** Add comments explaining what hooks do

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "format-code.sh",
            "_comment": "Automatically formats TypeScript files after editing"
          }
        ]
      }
    ]
  }
}
```

---

## Related Resources

### In This Repository

**Hooks:**
- For reference documentation, see official Hooks reference

**Related Features:**
- `docs/references/skills/skills-claude-code.md` - Skills in Claude Code
- `docs/references/mcp/mcp-usage-claude-code.md` - MCP in Claude Code
- `docs/references/agents/sub-agents-claude-code.md` - Sub-agents

**Settings:**
- Settings documentation for configuration paths

### External Resources

- **Official Documentation:** [code.claude.com/docs/en/hooks-guide](https://code.claude.com/docs/en/hooks-guide)
- **Hooks Reference:** [code.claude.com/docs/en/hooks](https://code.claude.com/docs/en/hooks)
- **Example Implementation:** [bash_command_validator_example.py](https://github.com/anthropics/claude-code/blob/main/examples/hooks/bash_command_validator_example.py)

---

**Last Updated:** January 2026
**Category:** Hooks
**Status:** Official Claude Code Feature
**Type:** Lifecycle Customization
