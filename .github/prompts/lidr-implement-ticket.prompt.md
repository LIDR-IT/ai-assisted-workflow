---
description: Implement ticket from Ready-for-Dev to Ready-for-QA
agent: 'agent'
---

<!--
COMMAND: implement-ticket
VERSION: 2.0.0
AUTHOR: SDLC Team
LAST UPDATED: 2025-03-05

PURPOSE:
Complete dev workflow: reads ticket from Jira, creates branch, generates
implementation plan, assists coding, validates DoD, creates PR, generates
handoff for QA, and transitions ticket status.

USAGE:
  /implement-ticket PROJ-123
  /implement-ticket PROJ-456

ARGUMENTS:
  ticket-id: Jira ticket ID (required). Format: PROJECT-NUMBER

REQUIREMENTS:
  - Manual ticket access or scripts
  - GitHub CLI (gh) configured (degrades without)
  - .claude/rules/ configured

RELATED COMMANDS:
  /create-branch  - Standalone branch creation (Step 2 of this command)
  /create-pr      - Standalone PR creation (Step 6 of this command)
  /advance-gate 4 - Sprint aggregator after all tickets done

CHANGELOG:
  v2.0.0 (2025-03-05): Rewritten to official command format
  v1.0.0 (2025-02-15): Initial version (specification format)
-->

# Implement Ticket $1

Load rules context FIRST:
- @../rules/org.md
- @../rules/tech-stack.md
- @../rules/project.md

## Step 1: Validate and Load Ticket

If "$1" is empty:
  ❌ ERROR: Ticket ID required.
  Usage: /implement-ticket [TICKET-ID]
  Example: /implement-ticket PROJ-123
  Exit.

Read ticket from Jira MCP: GET /issue/$1
Extract: title, description, acceptance criteria (BDD), linked User Story, linked RF, priority, sprint, component, attachments.

Validate:
- If ticket status is NOT "Ready for Dev" or "In Progress":
  ⚠️ Ticket $1 is in status "{status}". Expected "Ready for Dev" or "In Progress".

  Use AskUserQuestion:
  - question: "Ticket no está en estado esperado. ¿Continuar?"
  - header: "Confirmar"
  - options:
    - Sí (Continuar de todos modos)
    - No (Cancelar)

- If no BDD criteria found:
  ⚠️ Ticket $1 has no BDD acceptance criteria (Given/When/Then).
  Consider running user-stories skill first to generate them.

## Step 2: Check Dependencies

Read ticket links from Jira: GET /issue/$1?expand=issuelinks

For each "is blocked by" or "depends on" link:
- Check status of blocking ticket
- If status != "Done": ⚠️ "Dependency {DEP-ID} not resolved (status: {status})"

Use AskUserQuestion if blockers found:
- question: "Hay dependencias no resueltas. ¿Cómo proceder?"
- header: "Dependencias"
- options:
  - Continuar (Aceptar riesgo de dependencia)
  - Resolver primero (Cancelar e implementar dependencia)
  - Escalar (Notificar al Tech Lead)

## Step 3: Create Branch (if not exists)

Current branch: !`git branch --show-current`

If not already on a feature branch for this ticket:

Determine branch type from Jira issue type:
- Story → feature/
- Bug → bugfix/
- Task → task/
- Sub-task → feature/ (inherit from parent)

Branch name: {type}/$1-{slug-from-title}

!`git fetch origin`
!`git checkout -b {branch-name} origin/develop`

Jira MCP: transition $1 to "In Progress" (if not already).

## Step 4: Generate Implementation Plan

Based on: ticket description + BDD criteria + linked RF + project rules

Generate:
```
Implementation Plan — $1
═══════════════════════════
1. Files to create:
   - [list with paths]

2. Files to modify:
   - [list with paths and what changes]

3. DB migrations (if needed):
   - [migrations]

4. Tests to create:
   - [unit tests]
   - [integration tests]

5. Validation against rules:
   - tech-stack: [pattern compliance]
   - project: [naming convention]
   - org: [compliance requirements]
```

Use AskUserQuestion:
- question: "¿El plan de implementación es correcto?"
- header: "Plan"
- options:
  - Aprobar (Proceder con el plan)
  - Modificar (Quiero ajustar algo)
  - Regenerar (Generar plan alternativo)

## Step 5: Assist Implementation

Help the developer implement following the approved plan.
Keep rules loaded at all times for convention compliance.

During implementation:
- Verify each function against BDD criteria from ticket
- If code introduces a TODO without ticket: WARN
- If tech-debt detected: use tech-debt skill to register, create Jira subtask
- If architectural decision needed: suggest creating ADR with adr skill

Run validations continuously:
- !`npm run lint` → fix suggestions if warnings
- !`npm run test` → ensure green
- !`npm run build` → ensure builds

## Step 6: Pre-PR Validation

Validate Definition of Done checklist skills/pr-description/checklists/dod.md:

- ✅ Tests pass: !`npm test`
- ✅ Lint clean: !`npm run lint`
- ✅ Build succeeds: !`npm run build`
- ⏳ SAST/SCA: check SonarQube results if available
- ⏳ Code review: pending (will happen after PR)

If any FAIL → suggest specific fixes before continuing.

## Step 7: Create PR

Generate PR description using pr-description skill:
- Input: !`git diff origin/develop...HEAD --stat` and ticket context
- Output: structured PR body with:
  - What changed (functional language)
  - Why (ticket link + RF)
  - How to test (step by step for QA/reviewer)
  - Breaking changes (if any)
  - Checklist

Create PR via GitHub CLI (gh): POST /repos/{owner}/{repo}/pulls
- title: "$1: {ticket title}"
- body: generated PR description
- head: {branch-name}
- base: develop
- draft: false (or true if CI not green)

Assign reviewers from CODEOWNERS or project.md.
Add labels: type, component, priority, size.

## Step 8: Generate Handoff Dev→QA

Use dev-handoff-qa skill to generate handoff document:
- Ticket reference and linked RF
- What was implemented (functional language, not technical)
- Relevant changes (endpoints, DB, config, feature flags)
- How to test (step-by-step for QA)
- Test data needed
- Known limitations / edge cases
- Environment to test in

Attach handoff to Jira ticket: POST /issue/$1/attachments

## Step 9: Transition and Notify

Jira MCP: transition $1 to "Ready for QA"

Slack MCP: notify QA channel:
"Ticket $1 ready for QA. Handoff attached. PR: {link}. Environment: staging."

Report:
```
## /implement-ticket $1 ✅

PR: #{pr-number} — {title}
Branch: {branch-name}
Status: Ready for QA
Handoff: Attached to ticket

DoD: ✅ Tests | ✅ Lint | ✅ Build | ⏳ Review
Next: QA runs /prepare-testing $1
```
