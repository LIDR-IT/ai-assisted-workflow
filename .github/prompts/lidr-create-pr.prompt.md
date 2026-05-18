---
description: Create PR with auto-generated description
agent: 'agent'
---

<!--
COMMAND: create-pr
VERSION: 1.0.0
AUTHOR: SDLC Team
LAST UPDATED: 2025-03-05

PURPOSE:
Creates Pull Request with auto-generated description from diff + Jira context,
validates DoD pre-merge, assigns reviewers, adds labels. Optionally generates
Dev→QA handoff.

USAGE:
  /create-pr PROJ-123
  /create-pr PROJ-123 --handoff
  /create-pr PROJ-123 --draft

ARGUMENTS:
  ticket-id: Jira ticket ID (required)
  Flags in {{{ input }}}: --handoff, --draft, --no-notify

RELATED COMMANDS:
  /create-branch      - Creates feature branch (step before this)
  /implement-ticket   - Full workflow (includes PR creation)
  /advance-gate 4     - Sprint aggregator after all PRs merged

CHANGELOG:
  v1.0.0 (2025-03-05): Initial release
-->

# Create PR for $1

Load: @../rules/tech-stack.md and @../rules/project.md

## Validate

If "$1" is empty:
  ❌ Ticket ID required. Usage: /create-pr [TICKET-ID]
  Exit.

Current branch: !`git branch --show-current`
Commits ahead of base: !`git log origin/develop..HEAD --oneline`

If no commits ahead:
  ❌ No commits to create PR for. Make changes first.
  Exit.

## Gather Context

Diff summary: !`git diff origin/develop...HEAD --stat`
Files changed: !`git diff origin/develop...HEAD --name-only`

Jira ticket context (manual or script):
- Read ticket: $1
- Extract: title, description, BDD criteria, linked US, linked RF

## Pre-PR Validation

Run DoD checks skills/pr-description/checklists/dod.md:
- Tests: !`npm test 2>&1 | tail -5`
- Lint: !`npm run lint 2>&1 | tail -5`
- Build: !`npm run build 2>&1 | tail -3`

Report results. If any FAIL:
  Use AskUserQuestion:
  - question: "Hay validaciones fallidas. ¿Cómo proceder?"
  - header: "DoD"
  - options:
    - Crear como Draft (PR draft para fix posterior)
    - Arreglar primero (Cancelar y resolver)
    - Forzar (Crear PR normal igualmente)

## Generate PR Description

Using pr-description skill knowledge, generate:

```markdown
## $1: {ticket title}

### What changed
{2-3 sentences in functional/business language}

### Why
- **Ticket**: [$1]({jira-link})
- **User Story**: [{US-ID}]({link})
- **RF**: {RF-ID}

### Technical changes
| File | Type | Description |
|------|------|-------------|
{for each changed file}

### How to test
1. {Step 1}
2. {Step 2}
3. Verify: {mapped BDD criterion}

### Breaking changes
{None / description + migration}

### Checklist
- [x] Tests added/updated
- [x] Lint clean
- [x] Build succeeds
- [ ] Code review approved
- [x] DoD verified
```

## Create PR

Use GitHub CLI: gh pr create
- title: "$1: {ticket title}"
- body: generated description
- head: {current branch}
- base: develop
- draft: true if --draft flag or DoD failures

## Configure PR

Assign reviewers:
- Read CODEOWNERS if exists
- Tech Lead from @../rules/project.md
- If changes in security/* → add Security reviewer

Add labels:
- Type: feat / fix / refactor / docs / test / chore (from conventional commit prefix)
- Component: from Jira ticket component field
- Size: XS (<10 files) / S (10-30) / M (30-100) / L (>100)

## Optional: Generate Handoff

If {{{ input }}} contains "--handoff":
  Use dev-handoff-qa skill to generate handoff document.
  Attach to Jira ticket.
  Transition Jira to "Ready for QA".

## Notify

If {{{ input }}} does NOT contain "--no-notify":
  Notify team (manual or script):
  "PR ready for review: {pr-link} — $1: {title}"

## Report

```
/create-pr $1 ✅

PR:        #{number} — {title}
URL:       {pr-url}
Status:    {Ready for Review / Draft}
Reviewers: {names}
Labels:    {labels}

DoD: ✅ Tests | ✅ Lint | ✅ Build | ⏳ Review
Handoff:   {Generated / Not requested (use --handoff)}

Next: Await code review → merge → /advance-gate 4
```
