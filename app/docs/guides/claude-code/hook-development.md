---
id: guide-hook-development
version: '0.1.1'
last_updated: '2026-05-15'
updated_by: 'audit-standards skill'
status: active
type: standard
owner_role: 'TL'
review_cycle: 90
next_review: '2026-08-13'
---

# Hook Development for Claude Code

## Overview

Hooks are event-driven automation scripts that execute in response to Claude Code events. Use hooks to validate operations, enforce policies, add context, and integrate external tools.

## Hook Types

### Prompt-Based Hooks (Recommended)

LLM-driven decision making for context-aware validation:

```json
{
  "type": "prompt",
  "prompt": "Evaluate if this tool use is appropriate: $TOOL_INPUT",
  "timeout": 30
}
```

**Use when**: Complex logic, edge cases, context-dependent decisions.

### Command Hooks

Deterministic bash scripts for fast, reliable operations:

```json
{
  "type": "command",
  "command": "bash .claude/hooks/script.sh",
  "timeout": 10
}
```

**Use when**: File I/O, external integrations, deterministic checks.

## Events

| Event            | When                  | Use Case                             |
| ---------------- | --------------------- | ------------------------------------ |
| **PreToolUse**   | Before tool execution | Validate writes, block dangerous ops |
| **PostToolUse**  | After tool execution  | Log, notify, post-process            |
| **Stop**         | Session ending        | Verify completeness, sync checks     |
| **SessionStart** | Session beginning     | Load context, set env vars           |
| **Notification** | Event relevant        | Desktop alerts, team notifications   |

## Common Patterns

### Pattern 1: Security Validation (PreToolUse:Write|Edit)

Block writes to sensitive files, detect hardcoded secrets.

### Pattern 2: Test Enforcement (Stop)

Verify tests were run after code changes.

### Pattern 3: Context Loading (SessionStart)

Detect project type, load env vars, check stale docs.

### Pattern 4: Desktop Notifications (Notification)

Alert on long-running sessions, build failures, vulnerabilities.

## Multi-Stage Validation

Combine command + prompt hooks for layered validation:

1. Command hook does fast deterministic check
2. Prompt hook handles complex cases

## Migration: Basic → Advanced

Prompt-based hooks offer: natural language reasoning, better edge case handling, no bash scripting required, more flexible validation.

## Platform Support

| Feature   | Claude Code | Gemini CLI   | Cursor     |
| --------- | ----------- | ------------ | ---------- |
| Events    | PreToolUse  | BeforeTool   | preToolUse |
| Timeout   | seconds     | milliseconds | seconds    |
| Structure | Nested      | Nested       | Flat       |
| Stdout    | Normal      | PURE JSON    | Normal     |

## {{CLIENT_NAME}} Implementation

4 hooks in `.claude/settings.json`:

- **dtc-write-guard** (PreToolUse:Write|Edit, prompt)
- **dtc-session-check** (Stop, prompt)
- **notify-desktop** (Notification, command)
- **context-loader** (SessionStart, command)
