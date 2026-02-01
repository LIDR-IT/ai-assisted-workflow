# Hooks Reference

## Overview

This page provides complete reference documentation for implementing hooks in Claude Code.

**Official Documentation:** [code.claude.com/docs/en/hooks](https://code.claude.com/docs/en/hooks)

**See Also:** [Hooks Guide](hooks-guide-claude-code.md) for quickstart and examples

---

## Hook Lifecycle

Hooks fire at specific points during a Claude Code session.

**Lifecycle diagram shows:**
- SessionStart
- UserPromptSubmit
- Agentic loop (PreToolUse → PermissionRequest → Tool execution → PostToolUse)
- SubagentStart/SubagentStop
- Stop
- PreCompact
- SessionEnd
- Notification (runs asynchronously)

### Hook Events Table

| Hook                  | When It Fires                    |
|:----------------------|:---------------------------------|
| `SessionStart`        | Session begins or resumes        |
| `UserPromptSubmit`    | User submits a prompt            |
| `PreToolUse`          | Before tool execution            |
| `PermissionRequest`   | When permission dialog appears   |
| `PostToolUse`         | After tool succeeds              |
| `PostToolUseFailure`  | After tool fails                 |
| `SubagentStart`       | When spawning a subagent         |
| `SubagentStop`        | When subagent finishes           |
| `Stop`                | Claude finishes responding       |
| `PreCompact`          | Before context compaction        |
| `SessionEnd`          | Session terminates               |
| `Notification`        | Claude Code sends notifications  |

---

## Configuration

### Settings Files

Hooks configured in:
- `~/.claude/settings.json` - User settings
- `.claude/settings.json` - Project settings
- `.claude/settings.local.json` - Local project settings (not committed)
- Managed policy settings

**Note:** Enterprise administrators can use `allowManagedHooksOnly` to block user, project, and plugin hooks.

**See:** Hook configuration in settings documentation

### Basic Structure

```json
{
  "hooks": {
    "EventName": [
      {
        "matcher": "ToolPattern",
        "hooks": [
          {
            "type": "command",
            "command": "your-command-here"
          }
        ]
      }
    ]
  }
}
```

### Fields

**matcher:** Pattern to match tool names (case-sensitive)
- Simple strings match exactly: `Write` matches only Write tool
- Supports regex: `Edit|Write` or `Notebook.*`
- Use `*` to match all tools
- Empty string (`""`) or blank also matches all
- Only applicable for: `PreToolUse`, `PermissionRequest`, `PostToolUse`

**hooks:** Array of hooks to execute when pattern matches

**type:** Hook execution type
- `"command"` - Bash commands
- `"prompt"` - LLM-based evaluation

**command:** (For `type: "command"`) The bash command to execute
- Can use `$CLAUDE_PROJECT_DIR` environment variable

**prompt:** (For `type: "prompt"`) The prompt to send to LLM for evaluation

**timeout:** (Optional) Hook execution timeout in seconds

### Events Without Matchers

For events that don't use matchers, omit the matcher field:

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "/path/to/prompt-validator.py"
          }
        ]
      }
    ]
  }
}
```

**Events without matchers:**
- `UserPromptSubmit`
- `Stop`
- `SubagentStop`
- `SubagentStart`
- `Setup`
- `SessionStart`
- `SessionEnd`
- `PreCompact`

---

## Project-Specific Hook Scripts

Use `CLAUDE_PROJECT_DIR` environment variable (only available when Claude Code spawns hook):

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/check-style.sh"
          }
        ]
      }
    ]
  }
}
```

**Benefit:** Scripts work regardless of Claude's current directory

---

## Plugin Hooks

Plugins can provide hooks that merge with user and project hooks.

### How Plugin Hooks Work

**Definition:**
- In plugin's `hooks/hooks.json` file
- Or in file given by custom path to `hooks` field

**Behavior:**
- When plugin enabled, hooks merged with user/project hooks
- Multiple hooks from different sources can respond to same event
- Plugin hooks use `${CLAUDE_PLUGIN_ROOT}` environment variable

### Example Plugin Hook

```json
{
  "description": "Automatic code formatting",
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PLUGIN_ROOT}/scripts/format.sh",
            "timeout": 30
          }
        ]
      }
    ]
  }
}
```

**Optional field:** `description` explains hook's purpose

**Note:** Plugin hooks run alongside custom hooks. If multiple match, all execute in parallel.

### Environment Variables for Plugins

- `${CLAUDE_PLUGIN_ROOT}` - Absolute path to plugin directory
- `${CLAUDE_PROJECT_DIR}` - Project root directory
- All standard environment variables available

**See:** Plugin components reference for creating plugin hooks

---

## Hooks in Skills and Agents

Hooks can be defined in skills and subagents using frontmatter.

**Scope:** Component's lifecycle only (run when component active)

**Supported events:** `PreToolUse`, `PostToolUse`, `Stop`

### Example in Skill

```yaml
---
name: secure-operations
description: Perform operations with security checks
hooks:
  PreToolUse:
    - matcher: "Bash"
      hooks:
        - type: command
          command: "./scripts/security-check.sh"
---
```

### Example in Agent

```yaml
---
name: code-reviewer
description: Review code changes
hooks:
  PostToolUse:
    - matcher: "Edit|Write"
      hooks:
        - type: command
          command: "./scripts/run-linter.sh"
---
```

**Cleanup:** Component-scoped hooks automatically removed when component finishes

### Additional Option (Skills Only)

**once:** Set to `true` to run hook only once per session

**Behavior:** After first successful execution, hook removed

**Note:** Currently only supported for skills, not agents

---

## Prompt-Based Hooks

Alternative to bash command hooks using LLM for evaluation.

**Currently supported for:** `Stop`, `SubagentStop`, but works with any hook event

### How It Works

1. Send hook input and prompt to fast LLM (Haiku)
2. LLM responds with structured JSON decision
3. Claude Code processes decision automatically

### Configuration

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "prompt",
            "prompt": "Evaluate if Claude should stop: $ARGUMENTS. Check if all tasks are complete."
          }
        ]
      }
    ]
  }
}
```

**Fields:**
- `type`: Must be `"prompt"`
- `prompt`: Prompt text to send to LLM
  - Use `$ARGUMENTS` as placeholder for hook input JSON
  - If `$ARGUMENTS` not present, input JSON appended to prompt
- `timeout`: Optional timeout in seconds (default: 30)

### Response Schema

LLM must respond with JSON:

```json
{
  "ok": true | false,
  "reason": "Explanation for the decision"
}
```

**Response fields:**
- `ok`: `true` allows action, `false` prevents it
- `reason`: Required when `ok` is `false`, shown to Claude

### Supported Events

Works with any hook event, most useful for:
- **Stop** - Decide if Claude should continue working
- **SubagentStop** - Evaluate if subagent completed task
- **UserPromptSubmit** - Validate prompts with LLM assistance
- **PreToolUse** - Context-aware permission decisions
- **PermissionRequest** - Intelligently allow/deny permission dialogs

### Example: Intelligent Stop Hook

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "prompt",
            "prompt": "You are evaluating whether Claude should stop working. Context: $ARGUMENTS\n\nAnalyze the conversation and determine if:\n1. All user-requested tasks are complete\n2. Any errors need to be addressed\n3. Follow-up work is needed\n\nRespond with JSON: {\"ok\": true} to allow stopping, or {\"ok\": false, \"reason\": \"your explanation\"} to continue working.",
            "timeout": 30
          }
        ]
      }
    ]
  }
}
```

### Example: SubagentStop

```json
{
  "hooks": {
    "SubagentStop": [
      {
        "hooks": [
          {
            "type": "prompt",
            "prompt": "Evaluate if this subagent should stop. Input: $ARGUMENTS\n\nCheck if:\n- The subagent completed its assigned task\n- Any errors occurred that need fixing\n- Additional context gathering is needed\n\nReturn: {\"ok\": true} to allow stopping, or {\"ok\": false, \"reason\": \"explanation\"} to continue."
          }
        ]
      }
    ]
  }
}
```

### Comparison: Bash vs Prompt Hooks

| Feature               | Bash Command Hooks      | Prompt-Based Hooks             |
|:----------------------|:------------------------|:-------------------------------|
| **Execution**         | Runs bash script        | Queries LLM                    |
| **Decision logic**    | You implement in code   | LLM evaluates context          |
| **Setup complexity**  | Requires script file    | Configure prompt               |
| **Context awareness** | Limited to script logic | Natural language understanding |
| **Performance**       | Fast (local execution)  | Slower (API call)              |
| **Use case**          | Deterministic rules     | Context-aware decisions        |

### Best Practices

✅ **DO:**
- Be specific in prompts
- Include decision criteria
- Test prompts thoroughly
- Set appropriate timeouts
- Use for complex decisions

❌ **DON'T:**
- Use for simple deterministic rules (use bash instead)
- Set timeouts too low
- Skip testing

---

## Hook Events Detail

### PreToolUse

**When:** After Claude creates tool parameters, before processing tool call

**Common matchers:**
- `Task` - Subagent tasks
- `Bash` - Shell commands
- `Glob` - File pattern matching
- `Grep` - Content search
- `Read` - File reading
- `Edit` - File editing
- `Write` - File writing
- `WebFetch`, `WebSearch` - Web operations

**Use:** Decision control to allow, deny, or ask for permission

**See:** [PreToolUse decision control](#pretooluse-decision-control)

### PermissionRequest

**When:** When user shown permission dialog

**Use:** Allow or deny on behalf of user

**Matchers:** Same as PreToolUse

**See:** [PermissionRequest decision control](#permissionrequest-decision-control)

### PostToolUse

**When:** Immediately after tool completes successfully

**Matchers:** Same as PreToolUse

**Use:** Provide feedback to Claude after execution

**See:** [PostToolUse decision control](#posttooluse-decision-control)

### Notification

**When:** Claude Code sends notifications

**Common matchers:**
- `permission_prompt` - Permission requests
- `idle_prompt` - Waiting for user input (after 60+ seconds idle)
- `auth_success` - Authentication success
- `elicitation_dialog` - Claude Code needs input for MCP tool elicitation

**Use:** Run different hooks for different notification types

**Example:**

```json
{
  "hooks": {
    "Notification": [
      {
        "matcher": "permission_prompt",
        "hooks": [
          {
            "type": "command",
            "command": "/path/to/permission-alert.sh"
          }
        ]
      },
      {
        "matcher": "idle_prompt",
        "hooks": [
          {
            "type": "command",
            "command": "/path/to/idle-notification.sh"
          }
        ]
      }
    ]
  }
}
```

### UserPromptSubmit

**When:** User submits prompt, before Claude processes it

**Use:**
- Add additional context based on prompt/conversation
- Validate prompts
- Block certain types of prompts

**See:** [UserPromptSubmit decision control](#userpromptsubmit-decision-control)

### Stop

**When:** Main Claude Code agent finished responding

**Does not run if:** Stoppage due to user interrupt

**Use:** Control if Claude should continue working

**See:** [Stop decision control](#stopsubagent stop-decision-control)

### SubagentStop

**When:** Claude Code subagent (Task tool call) finished responding

**Use:** Control if subagent should continue

**See:** [SubagentStop decision control](#stopsubagent stop-decision-control)

### PreCompact

**When:** Before Claude Code runs compact operation

**Matchers:**
- `manual` - Invoked from `/compact`
- `auto` - Invoked from auto-compact (full context window)

**Use:** Run operations before context compaction

### Setup

**When:** Claude Code invoked with repository setup/maintenance flags

**Flags:** `--init`, `--init-only`, `--maintenance`

**Matchers:**
- `init` - From `--init` or `--init-only`
- `maintenance` - From `--maintenance`

**Use:** Operations you don't want on every session
- Installing dependencies
- Running migrations
- Periodic maintenance tasks

**Note:** Use Setup for one-time/occasional operations. Use SessionStart for every-session operations. Setup requires explicit flags to avoid slowing session start.

**Environment variable:** Has access to `CLAUDE_ENV_FILE` for persisting environment variables

**See:** [Setup input](#setup-input) and [Setup decision control](#setup-decision-control)

### SessionStart

**When:** Claude Code starts new session or resumes existing session

**Matchers:**
- `startup` - From startup
- `resume` - From `--resume`, `--continue`, `/resume`
- `clear` - From `/clear`
- `compact` - From auto or manual compact

**Use:**
- Loading development context (issues, recent changes)
- Setting up environment variables

**Note:** Runs on every session. Keep fast. Use Setup hooks for one-time operations.

**Environment variable:** Has access to `CLAUDE_ENV_FILE` for persisting environment variables

**See:** [Persisting environment variables](#persisting-environment-variables)

#### Persisting Environment Variables

SessionStart hooks have access to `CLAUDE_ENV_FILE` environment variable.

**Provides:** File path to persist environment variables for subsequent bash commands

**Example: Setting individual variables**

```bash
#!/bin/bash

if [ -n "$CLAUDE_ENV_FILE" ]; then
  echo 'export NODE_ENV=production' >> "$CLAUDE_ENV_FILE"
  echo 'export API_KEY=your-api-key' >> "$CLAUDE_ENV_FILE"
  echo 'export PATH="$PATH:./node_modules/.bin"' >> "$CLAUDE_ENV_FILE"
fi

exit 0
```

**Example: Persisting all environment changes**

When setup modifies environment (e.g., `nvm use`), capture and persist all changes:

```bash
#!/bin/bash

ENV_BEFORE=$(export -p | sort)

# Run setup commands that modify environment
source ~/.nvm/nvm.sh
nvm use 20

if [ -n "$CLAUDE_ENV_FILE" ]; then
  ENV_AFTER=$(export -p | sort)
  comm -13 <(echo "$ENV_BEFORE") <(echo "$ENV_AFTER") >> "$CLAUDE_ENV_FILE"
fi

exit 0
```

**Availability:** Variables written to file available in all subsequent bash commands during session

**Note:** `CLAUDE_ENV_FILE` only available for SessionStart hooks (not other hook types)

### SessionEnd

**When:** Claude Code session ends

**Reason field values:**
- `clear` - Session cleared with /clear
- `logout` - User logged out
- `prompt_input_exit` - User exited while prompt input visible
- `other` - Other exit reasons

**Use:** Cleanup tasks, logging session statistics, saving session state

---

## Hook Input

Hooks receive JSON data via stdin containing session info and event-specific data.

### Common Fields

```typescript
{
  // Common fields
  session_id: string
  transcript_path: string  // Path to conversation JSON
  cwd: string              // Current working directory
  permission_mode: string  // "default", "plan", "acceptEdits", "dontAsk", "bypassPermissions"

  // Event-specific fields
  hook_event_name: string
  ...
}
```

### PreToolUse Input

Schema for `tool_input` depends on tool.

#### Bash Tool

```json
{
  "session_id": "abc123",
  "transcript_path": "/Users/.../.claude/projects/.../00893aaf-19fa-41d2-8238-13269b9b3ca0.jsonl",
  "cwd": "/Users/...",
  "permission_mode": "default",
  "hook_event_name": "PreToolUse",
  "tool_name": "Bash",
  "tool_input": {
    "command": "psql -c 'SELECT * FROM users'",
    "description": "Query the users table",
    "timeout": 120000
  },
  "tool_use_id": "toolu_01ABC123..."
}
```

**Bash tool_input fields:**

| Field               | Type    | Description                            |
|:--------------------|:--------|:---------------------------------------|
| `command`           | string  | Shell command to execute               |
| `description`       | string  | Optional description                   |
| `timeout`           | number  | Optional timeout in milliseconds       |
| `run_in_background` | boolean | Whether to run in background           |

#### Write Tool

```json
{
  "session_id": "abc123",
  "transcript_path": "/Users/.../.claude/projects/.../00893aaf-19fa-41d2-8238-13269b9b3ca0.jsonl",
  "cwd": "/Users/...",
  "permission_mode": "default",
  "hook_event_name": "PreToolUse",
  "tool_name": "Write",
  "tool_input": {
    "file_path": "/path/to/file.txt",
    "content": "file content"
  },
  "tool_use_id": "toolu_01ABC123..."
}
```

**Write tool_input fields:**

| Field       | Type   | Description                    |
|:------------|:-------|:-------------------------------|
| `file_path` | string | Absolute path to file to write |
| `content`   | string | Content to write               |

#### Edit Tool

```json
{
  "session_id": "abc123",
  "transcript_path": "/Users/.../.claude/projects/.../00893aaf-19fa-41d2-8238-13269b9b3ca0.jsonl",
  "cwd": "/Users/...",
  "permission_mode": "default",
  "hook_event_name": "PreToolUse",
  "tool_name": "Edit",
  "tool_input": {
    "file_path": "/path/to/file.txt",
    "old_string": "original text",
    "new_string": "replacement text"
  },
  "tool_use_id": "toolu_01ABC123..."
}
```

**Edit tool_input fields:**

| Field         | Type    | Description                              |
|:--------------|:--------|:-----------------------------------------|
| `file_path`   | string  | Absolute path to file to edit            |
| `old_string`  | string  | Text to find and replace                 |
| `new_string`  | string  | Replacement text                         |
| `replace_all` | boolean | Replace all occurrences (default: false) |

#### Read Tool

```json
{
  "session_id": "abc123",
  "transcript_path": "/Users/.../.claude/projects/.../00893aaf-19fa-41d2-8238-13269b9b3ca0.jsonl",
  "cwd": "/Users/...",
  "permission_mode": "default",
  "hook_event_name": "PreToolUse",
  "tool_name": "Read",
  "tool_input": {
    "file_path": "/path/to/file.txt"
  },
  "tool_use_id": "toolu_01ABC123..."
}
```

**Read tool_input fields:**

| Field       | Type   | Description                     |
|:------------|:-------|:--------------------------------|
| `file_path` | string | Absolute path to file to read   |
| `offset`    | number | Optional line number to start   |
| `limit`     | number | Optional number of lines to read |

### PostToolUse Input

```json
{
  "session_id": "abc123",
  "transcript_path": "/Users/.../.claude/projects/.../00893aaf-19fa-41d2-8238-13269b9b3ca0.jsonl",
  "cwd": "/Users/...",
  "permission_mode": "default",
  "hook_event_name": "PostToolUse",
  "tool_name": "Write",
  "tool_input": {
    "file_path": "/path/to/file.txt",
    "content": "file content"
  },
  "tool_response": {
    "filePath": "/path/to/file.txt",
    "success": true
  },
  "tool_use_id": "toolu_01ABC123..."
}
```

Schema for `tool_input` and `tool_response` depends on tool.

### Notification Input

```json
{
  "session_id": "abc123",
  "transcript_path": "/Users/.../.claude/projects/.../00893aaf-19fa-41d2-8238-13269b9b3ca0.jsonl",
  "cwd": "/Users/...",
  "permission_mode": "default",
  "hook_event_name": "Notification",
  "message": "Claude needs your permission to use Bash",
  "notification_type": "permission_prompt"
}
```

### UserPromptSubmit Input

```json
{
  "session_id": "abc123",
  "transcript_path": "/Users/.../.claude/projects/.../00893aaf-19fa-41d2-8238-13269b9b3ca0.jsonl",
  "cwd": "/Users/...",
  "permission_mode": "default",
  "hook_event_name": "UserPromptSubmit",
  "prompt": "Write a function to calculate the factorial of a number"
}
```

### Stop Input

`stop_hook_active` is `true` when Claude Code already continuing as result of stop hook.

**Check this value** or process transcript to prevent infinite loop.

```json
{
  "session_id": "abc123",
  "transcript_path": "~/.claude/projects/.../00893aaf-19fa-41d2-8238-13269b9b3ca0.jsonl",
  "cwd": "/Users/...",
  "permission_mode": "default",
  "hook_event_name": "Stop",
  "stop_hook_active": true
}
```

### SubagentStop Input

`transcript_path` is main session's transcript. `agent_transcript_path` is subagent's transcript in nested `subagents/` folder.

```json
{
  "session_id": "abc123",
  "transcript_path": "~/.claude/projects/.../abc123.jsonl",
  "cwd": "/Users/...",
  "permission_mode": "default",
  "hook_event_name": "SubagentStop",
  "stop_hook_active": false,
  "agent_id": "def456",
  "agent_transcript_path": "~/.claude/projects/.../abc123/subagents/agent-def456.jsonl"
}
```

### PreCompact Input

For `manual`, `custom_instructions` comes from user input to `/compact`. For `auto`, `custom_instructions` is empty.

```json
{
  "session_id": "abc123",
  "transcript_path": "~/.claude/projects/.../00893aaf-19fa-41d2-8238-13269b9b3ca0.jsonl",
  "permission_mode": "default",
  "hook_event_name": "PreCompact",
  "trigger": "manual",
  "custom_instructions": ""
}
```

### Setup Input

```json
{
  "session_id": "abc123",
  "transcript_path": "~/.claude/projects/.../00893aaf-19fa-41d2-8238-13269b9b3ca0.jsonl",
  "cwd": "/Users/...",
  "permission_mode": "default",
  "hook_event_name": "Setup",
  "trigger": "init"
}
```

`trigger` field: `"init"` (from `--init` or `--init-only`) or `"maintenance"` (from `--maintenance`)

### SessionStart Input

```json
{
  "session_id": "abc123",
  "transcript_path": "~/.claude/projects/.../00893aaf-19fa-41d2-8238-13269b9b3ca0.jsonl",
  "cwd": "/Users/...",
  "permission_mode": "default",
  "hook_event_name": "SessionStart",
  "source": "startup",
  "model": "claude-sonnet-4-20250514"
}
```

**source field values:**
- `"startup"` - New sessions
- `"resume"` - Resumed sessions
- `"clear"` - After `/clear`
- `"compact"` - After compaction

**model field:** Contains model identifier when available

**agent_type field:** If started with `claude --agent <name>`, contains agent name

### SubagentStart Input

```json
{
  "session_id": "abc123",
  "transcript_path": "~/.claude/projects/.../00893aaf-19fa-41d2-8238-13269b9b3ca0.jsonl",
  "cwd": "/Users/...",
  "permission_mode": "default",
  "hook_event_name": "SubagentStart",
  "agent_id": "agent-abc123",
  "agent_type": "Explore"
}
```

**agent_id:** Unique identifier for subagent

**agent_type:** Built-in (`"Bash"`, `"Explore"`, `"Plan"`) or custom agent names

### SessionEnd Input

```json
{
  "session_id": "abc123",
  "transcript_path": "~/.claude/projects/.../00893aaf-19fa-41d2-8238-13269b9b3ca0.jsonl",
  "cwd": "/Users/...",
  "permission_mode": "default",
  "hook_event_name": "SessionEnd",
  "reason": "exit"
}
```

---

## Hook Output

Two mutually exclusive ways for hooks to return output.

### Simple: Exit Code

**Exit code 0:** Success
- `stdout` shown to user in verbose mode (ctrl+o)
- Exception: `UserPromptSubmit` and `SessionStart` add stdout to context
- JSON output in stdout parsed for structured control

**Exit code 2:** Blocking error
- Only `stderr` used as error message
- Fed back to Claude with format `[command]: {stderr}`
- JSON in stdout **not** processed
- See [Exit Code 2 Behavior](#exit-code-2-behavior) for per-event behavior

**Other exit codes:** Non-blocking error
- `stderr` shown to user in verbose mode (ctrl+o)
- Format: `Failed with non-blocking status code: {stderr}`
- If `stderr` empty: shows `No stderr output`
- Execution continues

**Warning:** Claude Code does not see stdout if exit code 0, except for `UserPromptSubmit` where stdout injected as context.

#### Exit Code 2 Behavior

| Hook Event          | Behavior                                                        |
|:--------------------|:----------------------------------------------------------------|
| `PreToolUse`        | Blocks tool call, shows stderr to Claude                        |
| `PermissionRequest` | Denies permission, shows stderr to Claude                       |
| `PostToolUse`       | Shows stderr to Claude (tool already ran)                       |
| `Notification`      | N/A, shows stderr to user only                                  |
| `UserPromptSubmit`  | Blocks prompt processing, erases prompt, shows stderr to user   |
| `Stop`              | Blocks stoppage, shows stderr to Claude                         |
| `SubagentStop`      | Blocks stoppage, shows stderr to Claude subagent                |
| `PreCompact`        | N/A, shows stderr to user only                                  |
| `Setup`             | N/A, shows stderr to user only                                  |
| `SessionStart`      | N/A, shows stderr to user only                                  |
| `SessionEnd`        | N/A, shows stderr to user only                                  |

### Advanced: JSON Output

Structured JSON in stdout for sophisticated control.

**Warning:** JSON output only processed when hook exits with code 0. If exit code 2 (blocking error), stderr text used directly—any JSON in stdout ignored. For other non-zero exit codes, only stderr shown to user in verbose mode (ctrl+o).

#### Common JSON Fields

All hook types can include:

```json
{
  "continue": true, // Whether Claude should continue (default: true)
  "stopReason": "string", // Message when continue is false

  "suppressOutput": true, // Hide stdout from transcript mode (default: false)
  "systemMessage": "string" // Optional warning to user
}
```

**If `continue` is false:** Claude stops processing after hooks run

**Differences from other blocking methods:**
- For `PreToolUse`: Different from `"permissionDecision": "deny"` (only blocks specific tool)
- For `PostToolUse`: Different from `"decision": "block"` (provides automated feedback)
- For `UserPromptSubmit`: Prevents prompt processing
- For `Stop` and `SubagentStop`: Takes precedence over `"decision": "block"`
- **All cases:** `"continue" = false` takes precedence over `"decision": "block"`

**stopReason:** Accompanies `continue` with reason shown to user (not to Claude)

#### PreToolUse Decision Control

```json
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "allow",
    "permissionDecisionReason": "My reason here",
    "updatedInput": {
      "field_to_modify": "new value"
    },
    "additionalContext": "Current environment: production. Proceed with caution."
  }
}
```

**permissionDecision values:**

**"allow"** - Bypasses permission system
- `permissionDecisionReason` shown to user (not Claude)

**"deny"** - Prevents tool call execution
- `permissionDecisionReason` shown to Claude

**"ask"** - Asks user to confirm in UI
- `permissionDecisionReason` shown to user (not Claude)

**updatedInput:** Modifies tool input parameters before execution
- Combine with `"allow"` to modify and auto-approve
- Combine with `"ask"` to modify and show user for confirmation

**additionalContext:** Adds string to Claude's context before tool executes

**Note:** The `decision` and `reason` fields are **deprecated**. Use `hookSpecificOutput.permissionDecision` and `hookSpecificOutput.permissionDecisionReason`. Deprecated `"approve"` and `"block"` map to `"allow"` and `"deny"`.

#### PermissionRequest Decision Control

```json
{
  "hookSpecificOutput": {
    "hookEventName": "PermissionRequest",
    "decision": {
      "behavior": "allow",
      "updatedInput": {
        "command": "npm run lint"
      }
    }
  }
}
```

**For `"behavior": "allow"`:**
- Optional `"updatedInput"` modifies tool input parameters

**For `"behavior": "deny"`:**
- Optional `"message"` string tells model why denied
- Optional boolean `"interrupt"` stops Claude

#### PostToolUse Decision Control

```json
{
  "decision": "block" | undefined,
  "reason": "Explanation for decision",
  "hookSpecificOutput": {
    "hookEventName": "PostToolUse",
    "additionalContext": "Additional information for Claude"
  }
}
```

**"block"** - Automatically prompts Claude with `reason`

**undefined** - Does nothing, `reason` ignored

**additionalContext:** Adds context for Claude to consider

#### UserPromptSubmit Decision Control

**Two ways to add context (exit code 0):**

**1. Plain text stdout (simpler):**
- Any non-JSON text written to stdout added as context
- Easiest way to inject information

**2. JSON with additionalContext (structured):**
- Use JSON format for more control
- `additionalContext` field added as context

Both work with exit code 0. Plain stdout shown as hook output in transcript; `additionalContext` added more discretely.

**Blocking prompts:**

```json
{
  "decision": "block" | undefined,
  "reason": "Explanation for decision",
  "hookSpecificOutput": {
    "hookEventName": "UserPromptSubmit",
    "additionalContext": "My additional context here"
  }
}
```

**"decision": "block"** - Prevents prompt processing
- Submitted prompt erased from context
- `"reason"` shown to user (not added to context)

**"decision": undefined** (or omitted) - Allows prompt to proceed

**Note:** JSON not required for simple cases. To add context, print plain text to stdout with exit code 0. Use JSON when you need to block prompts or want structured control.

#### Stop/SubagentStop Decision Control

```json
{
  "decision": "block" | undefined,
  "reason": "Must be provided when Claude is blocked from stopping"
}
```

**"block"** - Prevents Claude from stopping
- Must populate `reason` for Claude to know how to proceed

**undefined** - Allows Claude to stop
- `reason` ignored

#### Setup Decision Control

```json
{
  "hookSpecificOutput": {
    "hookEventName": "Setup",
    "additionalContext": "Repository initialized with custom configuration"
  }
}
```

**additionalContext:** Adds string to context

**Multiple hooks:** `additionalContext` values concatenated

**Environment:** Setup hooks have access to `CLAUDE_ENV_FILE` for persisting environment variables

#### SessionStart Decision Control

```json
{
  "hookSpecificOutput": {
    "hookEventName": "SessionStart",
    "additionalContext": "My additional context here"
  }
}
```

**additionalContext:** Adds string to context at session start

**Multiple hooks:** `additionalContext` values concatenated

#### SessionEnd Decision Control

SessionEnd hooks run when session ends. Cannot block session termination but can perform cleanup tasks.

---

## Working with MCP Tools

Hooks work seamlessly with Model Context Protocol (MCP) tools.

### MCP Tool Naming

Pattern: `mcp__<server>__<tool>`

**Examples:**
- `mcp__memory__create_entities` - Memory server's create entities tool
- `mcp__filesystem__read_file` - Filesystem server's read file tool
- `mcp__github__search_repositories` - GitHub server's search tool

### Configuring Hooks for MCP Tools

Target specific MCP tools or entire servers:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "mcp__memory__.*",
        "hooks": [
          {
            "type": "command",
            "command": "echo 'Memory operation initiated' >> ~/mcp-operations.log"
          }
        ]
      },
      {
        "matcher": "mcp__.*__write.*",
        "hooks": [
          {
            "type": "command",
            "command": "/home/user/scripts/validate-mcp-write.py"
          }
        ]
      }
    ]
  }
}
```

**Pattern matching:**
- `mcp__memory__.*` - All memory server tools
- `mcp__.*__write.*` - All write operations across all MCP servers

---

## Security Considerations

### Disclaimer

**USE AT YOUR OWN RISK**

Claude Code hooks execute arbitrary shell commands on your system automatically.

**By using hooks, you acknowledge:**
- You are solely responsible for commands you configure
- Hooks can modify, delete, or access any files your user account can access
- Malicious or poorly written hooks can cause data loss or system damage
- Anthropic provides no warranty and assumes no liability for damages
- You should thoroughly test hooks in safe environment before production use

**Always review and understand** hook commands before adding to configuration.

### Security Best Practices

**1. Validate and sanitize inputs**
- Never trust input data blindly
- Check for malicious patterns

**2. Always quote shell variables**
- Use `"$VAR"` not `$VAR`
- Prevents command injection

**3. Block path traversal**
- Check for `..` in file paths
- Validate paths are within expected directories

**4. Use absolute paths**
- Specify full paths for scripts
- Use `"$CLAUDE_PROJECT_DIR"` for project path

**5. Skip sensitive files**
- Avoid `.env`, `.git/`, keys, etc.
- Implement sensitive file detection

### Configuration Safety

**Direct edits to hooks in settings files don't take effect immediately.**

**Claude Code:**
1. Captures snapshot of hooks at startup
2. Uses snapshot throughout session
3. Warns if hooks modified externally
4. Requires review in `/hooks` menu for changes to apply

**Benefit:** Prevents malicious hook modifications from affecting current session

---

## Hook Execution Details

**Timeout:** 60-second execution limit by default
- Configurable per command
- Timeout for individual command doesn't affect other commands

**Parallelization:** All matching hooks run in parallel

**Deduplication:** Identical hook commands deduplicated automatically

**Environment:** Runs in current directory with Claude Code's environment
- `CLAUDE_PROJECT_DIR` environment variable available (project root absolute path)
- `CLAUDE_CODE_REMOTE` environment variable indicates remote (web) vs local CLI
  - `"true"` for remote environment
  - Not set or empty for local CLI
  - Use to run different logic based on execution context

**Input:** JSON via stdin

**Output:**
- **PreToolUse/PermissionRequest/PostToolUse/Stop/SubagentStop:** Progress in verbose mode (ctrl+o)
- **Notification/SessionEnd:** Logged to debug only (`--debug`)
- **UserPromptSubmit/SessionStart/Setup:** stdout added as context for Claude

---

## Debugging

### Basic Troubleshooting

**If hooks aren't working:**

**1. Check configuration**
- Run `/hooks` to see if hook registered
- Verify JSON syntax

**2. Verify syntax**
- Ensure JSON settings valid
- Check for escaped quotes

**3. Test commands**
- Run hook commands manually first
- Verify they work standalone

**4. Check permissions**
- Make sure scripts executable
- Verify file permissions

**5. Review logs**
- Use `claude --debug` to see hook execution details
- Check for errors

**Common issues:**

**Quotes not escaped**
- Use `\"` inside JSON strings

**Wrong matcher**
- Check tool names match exactly (case-sensitive)
- Verify regex patterns

**Command not found**
- Use full paths for scripts
- Check PATH environment

**Script not executable**
- Run `chmod +x script.sh`

### Advanced Debugging

**1. Inspect hook execution**
- Use `claude --debug` for detailed execution

**2. Validate JSON schemas**
- Test hook input/output with external tools
- Use JSON validators

**3. Check environment variables**
- Verify Claude Code's environment correct
- Print environment in hooks for debugging

**4. Test edge cases**
- Try hooks with unusual file paths
- Test with special characters in input

**5. Monitor system resources**
- Check for resource exhaustion
- Monitor CPU/memory during execution

**6. Use structured logging**
- Implement logging in hook scripts
- Write to dedicated log files

### Debug Output Example

Use `claude --debug` to see hook execution details:

```
[DEBUG] Executing hooks for PostToolUse:Write
[DEBUG] Getting matching hook commands for PostToolUse with query: Write
[DEBUG] Found 1 hook matchers in settings
[DEBUG] Matched 1 hooks for query "Write"
[DEBUG] Found 1 hook commands to execute
[DEBUG] Executing hook command: <Your command> with timeout 60000ms
[DEBUG] Hook command completed with status 0: <Your stdout>
```

**Progress in verbose mode (ctrl+o):**
- Which hook is running
- Command being executed
- Success/failure status
- Output or error messages

---

## Related Resources

### In This Repository

**Hooks:**
- `hooks-guide-claude-code.md` - Getting started guide with quickstart and examples

**Related Features:**
- `docs/references/skills/skills-claude-code.md` - Skills in Claude Code
- `docs/references/mcp/mcp-usage-claude-code.md` - MCP in Claude Code
- `docs/references/agents/sub-agents-claude-code.md` - Sub-agents

### External Resources

- **Official Documentation:** [code.claude.com/docs/en/hooks](https://code.claude.com/docs/en/hooks)
- **Hooks Guide:** [code.claude.com/docs/en/hooks-guide](https://code.claude.com/docs/en/hooks-guide)
- **Plugin Components:** [code.claude.com/docs/en/plugins-reference#hooks](https://code.claude.com/docs/en/plugins-reference#hooks)
- **Settings:** [code.claude.com/docs/en/settings](https://code.claude.com/docs/en/settings)
- **Sub-agents:** [code.claude.com/docs/en/sub-agents](https://code.claude.com/docs/en/sub-agents)
- **Skills:** [code.claude.com/docs/en/skills](https://code.claude.com/docs/en/skills)
- **MCP:** [code.claude.com/docs/en/mcp](https://code.claude.com/docs/en/mcp)

---

**Last Updated:** January 2026
**Category:** Hooks
**Status:** Official Claude Code Feature
**Type:** Reference Documentation
