---
id: guide-command-development
version: '0.2.1'
last_updated: '2026-05-15'
updated_by: 'audit-standards skill'
status: active
type: standard
owner_role: 'TL'
review_cycle: 90
next_review: '2026-08-13'
---

# Command Development for Claude Code

## Overview

Slash commands are frequently-used prompts defined as Markdown files that Claude executes during interactive sessions.

**Key concepts:**

- Markdown file format for commands
- YAML frontmatter for configuration
- Dynamic arguments and file references
- Bash execution for context
- Command organization and namespacing

## Critical: Commands are Instructions FOR Claude

Commands are written for agent consumption, not human consumption. When a user invokes `/command-name`, the command content becomes Claude's instructions.

## YAML Frontmatter Reference

| Field           | Type   | Purpose                           | Example                           |
| --------------- | ------ | --------------------------------- | --------------------------------- |
| `description`   | String | Shown in /help output (~60 chars) | `Review code for security issues` |
| `argument-hint` | String | Shows argument format             | `[ticket-id] [optional-flag]`     |
| `allowed-tools` | String | Restricts available tools         | `Read, Bash(git:*), Write`        |
| `model`         | String | Override model                    | `opus`, `sonnet`, `haiku`         |

## Dynamic Features

| Feature         | Syntax                   | Example                             |
| --------------- | ------------------------ | ----------------------------------- |
| Arguments       | `$1`, `$2`, `$ARGUMENTS` | `/cmd PROJ-123` → `$1` = "PROJ-123" |
| File references | `@file`                  | `@../../checklists/dod.md`          |
| Bash execution  | `` !`command` ``         | `` !`git log --oneline -5` ``       |
| Interactivity   | `AskUserQuestion`        | Multi-choice dialogs                |

## Self-Documenting Pattern

```markdown
---
description: Clear description under 60 chars
argument-hint: [arg1] [arg2]
allowed-tools: Read, Bash(git:*)
model: sonnet
---

<!--
COMMAND: command-name
VERSION: 1.0.0
AUTHOR: Team Name
LAST UPDATED: 2026-03-07

PURPOSE: What and why
USAGE: /command-name arg1 arg2
ARGUMENTS: arg1 (required), arg2 (optional)
EXAMPLES: /command-name feature-branch main
REQUIREMENTS: Git repository
RELATED COMMANDS: /other-command
CHANGELOG: v1.0.0 — Initial release
-->

# Command Instructions

[Instructions FOR Claude]
```

## Testing (4 Levels)

1. **Syntax**: Valid YAML frontmatter, .md extension, correct location
2. **Functional**: Arguments work, file refs resolve, bash executes
3. **Edge cases**: Missing args, empty results, malformed input
4. **Integration**: Works with other commands in chains

## Interactive Patterns (AskUserQuestion)

Use when: Multiple complex options, multi-select, decisions needing explanation.
Use arguments when: Simple values, scriptable workflows, fast invocations.
