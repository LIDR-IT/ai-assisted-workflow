---
id: guide-agent-development
version: '0.1.1'
last_updated: '2026-05-15'
updated_by: 'audit-standards skill'
status: active
type: standard
owner_role: 'TL'
review_cycle: 90
next_review: '2026-08-13'
---

# Agent Development for Claude Code

## Overview

Agents are autonomous subprocesses that handle complex, multi-step tasks independently. Commands are FOR user-initiated actions; agents are FOR autonomous work.

## Agent File Structure

```markdown
---
name: agent-identifier
description: Use this agent when [triggering conditions]. Examples:

<example>
Context: [Situation description]
user: "[User request]"
assistant: "[How assistant should respond and use this agent]"
<commentary>
[Why this agent should be triggered]
</commentary>
</example>

model: inherit
color: blue
tools: ["Read", "Write", "Grep"]
---

You are [agent role description]...

**Your Core Responsibilities:**

1. [Responsibility 1]
2. [Responsibility 2]
```

## Key Concepts

| Field         | Purpose                                                         |
| ------------- | --------------------------------------------------------------- |
| `name`        | Agent identifier                                                |
| `description` | Triggering conditions + examples (critical for auto-invocation) |
| `model`       | `inherit` (parent's model), `opus`, `sonnet`, `haiku`           |
| `color`       | Terminal color: blue, green, yellow, red, cyan, magenta         |
| `tools`       | Restricted tool list                                            |

## When to Create Agents

Commands evolve to agents after sufficient usage and confidence:

| Command                  | Agent threshold  |
| ------------------------ | ---------------- |
| `/advance-gate`          | >=24 executions  |
| `/implement-ticket`      | >=30 tickets     |
| `/prepare-testing`       | >=20 suites      |
| `/create-release-notes`  | >=10 releases    |
| `/sync-docs`             | >=10 syncs       |
| `/validate-project-docs` | >=10 validations |

## System Prompt Design

1. Define clear role and boundaries
2. List core responsibilities (numbered)
3. Specify what NOT to do (constraints)
4. Include quality criteria for outputs
5. Reference relevant files/context with @

## {{CLIENT_NAME}} Status

6 agents planificados (futuros). El directorio `agents/` esta vacio intencionalmente. Los agents nacen de commands probados, no se crean desde cero.
