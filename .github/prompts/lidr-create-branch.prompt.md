---
description: Create feature branch from Jira ticket
agent: 'agent'
---

<!--
COMMAND: create-branch
VERSION: 1.0.0
AUTHOR: SDLC Team
LAST UPDATED: 2025-03-05

PURPOSE:
Atomic operation: reads Jira ticket, determines branch type and naming,
creates branch with correct convention, updates Jira status.

USAGE:
  /create-branch PROJ-123

ARGUMENTS:
  ticket-id: Jira ticket ID (required)

RELATED COMMANDS:
  /implement-ticket - Full workflow (includes branch creation)
  /create-pr        - Creates PR from branch

CHANGELOG:
  v1.0.0 (2025-03-05): Initial release
-->

# Create Branch for $1

Load: @../rules/tech-stack.md for branching strategy.

## Validate Input

If "$1" is empty:
  ❌ Ticket ID required. Usage: /create-branch [TICKET-ID]
  Exit.

## Read Ticket

Read ticket from Jira MCP: GET /issue/$1
Extract: issue type (Story, Bug, Task, Spike, Sub-task), title, assignee.

If ticket not found: ❌ "Ticket $1 not found in Jira." Exit.

If ticket not assigned to current user:
  ⚠️ Ticket $1 assigned to {assignee}, not to you.

  Use AskUserQuestion:
  - question: "Ticket no está asignado a ti. ¿Continuar?"
  - header: "Asignación"
  - options:
    - Sí (Crear branch de todos modos)
    - No (Cancelar)

## Determine Branch Name

Map issue type to branch prefix:
- Story → feature/
- Bug → bugfix/
- Task → task/
- Spike → spike/
- Sub-task → feature/ (inherit parent type if possible)

Generate slug from title: lowercase, spaces to hyphens, max 50 chars, strip special chars.

Branch name: {prefix}$1-{slug}
Example: feature/PROJ-123-facial-enrollment-flow

## Determine Base Branch

From @../rules/tech-stack.md branching strategy:
- Story/Task/Spike → develop (or main if trunk-based)
- Bug → develop
- Hotfix (if "hotfix" label) → main

Current branches: !`git branch -r --list "origin/*" | head -20`

If base branch unclear:
  Use AskUserQuestion:
  - question: "¿Desde qué branch base crear?"
  - header: "Base branch"
  - options:
    - develop
    - main
    - release/{latest}

## Create Branch

!`git fetch origin`
!`git checkout -b {branch-name} origin/{base-branch}`

If error: ❌ "Failed to create branch. Check git status." Exit.

!`git push -u origin {branch-name}`

## Update Jira

Jira MCP: transition $1 to "In Progress" (if current status allows).

## Report

```
/create-branch $1 ✅

Branch:  {branch-name}
Base:    {base-branch}
Jira:    $1 → "In Progress"

To start: git checkout {branch-name}
Next:     /implement-ticket $1
```
