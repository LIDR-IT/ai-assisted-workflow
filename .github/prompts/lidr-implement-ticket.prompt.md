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
Tracking-tool entry point of the single development sequence: reads ticket from
the bound {{TRACKING_TOOL}}, checks dependencies, and either DELEGATES
implementation to the LIDR change lifecycle (/lidr-spec-*) when the ticket has an
associated change, or runs the lightweight in-line path. Then creates PR,
generates QA handoff, transitions status. NOT a route that competes with
/lidr-spec-* — the same chain, entered from the tracking tool instead of from
/lidr-spec-new.

USAGE:
  /lidr-implement-ticket PROJ-123
  /lidr-implement-ticket PROJ-456

ARGUMENTS:
  ticket-id: Tracking-tool ticket ID (required). Format: PROJECT-NUMBER

REQUIREMENTS:
  - Tracking-tool access via lidr-sdlc-tracking (resolves {{TRACKING_TOOL}})
  - GitHub CLI (gh) configured (degrades without)
  - .claude/rules/ configured

RELATED COMMANDS:
  /lidr-spec-apply     - This command's implementation engine when the ticket has an
                         associated LIDR change (Step 2.5 delegates to it — same chain)
  /lidr-create-branch  - Decomposed Step 3 of this command (not an alternative route)
  /lidr-create-pr      - Decomposed Step 7 of this command (not an alternative route)
  /lidr-advance-gate 4 - Sprint aggregator after all tickets done

CHANGELOG:
  v2.1.0 (2026-06-11): Tracking-tool entry of the single sequence — Step 2.5 delegates to /lidr-spec-apply when a change exists; base branch reconciled to tech-stack §9
  v2.0.0 (2025-03-05): Rewritten to official command format
  v1.0.0 (2025-02-15): Initial version (specification format)
-->

# Implement Ticket $1

Load rules context FIRST:

- @../rules/lidr-sdlc/org.md
- @../rules/lidr-sdlc/tech-stack.md
- @../rules/lidr-sdlc/project.md

## Step 1: Validate and Load Ticket

If "$1" is empty:
❌ ERROR: Ticket ID required.
Usage: /lidr-implement-ticket [TICKET-ID]
Example: /lidr-implement-ticket PROJ-123
Exit.

Read ticket $1 via lidr-sdlc-tracking, which resolves {{TRACKING_TOOL}} from the registry.
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

Read ticket links for $1 via lidr-sdlc-tracking, which resolves {{TRACKING_TOOL}} from the registry.

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

## Step 2.5: Single-sequence routing — delegate to the LIDR change lifecycle when applicable

This command is the **{{TRACKING_TOOL}} entry point of the single development sequence**, not a route that competes with `/lidr-spec-*`. Decide the path before creating any branch:

- Look in `docs/projects/<CLIENT_CODE>/changes/` for a change associated with ticket `$1` (by name, by frontmatter ticket reference, or ask the user).

**If an associated change exists** (or the work warrants the auditable change container) → **delegate implementation to the spec chain and SKIP Steps 3–6**:

- `/lidr-spec-ff <change-name>` (if not yet planned) → `/lidr-spec-apply <change-name>` → `/lidr-spec-verify <change-name>`.
- `/lidr-spec-apply` owns Step 0 (feature branch), the BMad `bmad-dev-story` unit/regression loop, and the LIDR mandatory curl / Playwright / DTC-docs / reports (see `lidr-sdlc/spec-execution.md` §0). Do **not** also create a branch here — the spec chain owns it.
- Then continue at **Step 7 (Create PR)**, referencing both the ticket and the change (`Refs: $1` + `Change: <change-name>`).

**If there is NO associated change** (small ticket, no container) → continue with Steps 3–6 below as the lightweight path.

## Step 3: Create Branch (only if NOT delegating per Step 2.5)

Current branch: !`git branch --show-current`

If not already on a feature branch for this ticket:

Determine branch type from the {{TRACKING_TOOL}} issue type:

- Story → feature/
- Bug → bugfix/
- Task → task/
- Sub-task → feature/ (inherit from parent)

Branch name: {type}/$1-{slug-from-title}

!`git fetch origin`
!`git checkout -b {branch-name} origin/develop`

> Base branch `develop` follows `tech-stack.md` §9 (Gitflow integration base) — the **same base** the spec chain's Step 0 uses, so a ticket implemented in-line here and one implemented via `/lidr-spec-apply` land on the same base.

Via lidr-sdlc-tracking (resolves {{TRACKING_TOOL}}): transition $1 to "In Progress" (if not already).

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
- If tech-debt detected: use lidr-tech-debt skill to register, create a tracking subtask via lidr-sdlc-tracking (resolves {{TRACKING_TOOL}})
- If architectural decision needed: suggest creating ADR with lidr-adr skill

Run validations continuously:

- !`npm run lint` → fix suggestions if warnings
- !`npm run test` → ensure green
- !`npm run build` → ensure builds

## Step 6: Pre-PR Validation

Validate Definition of Done checklist skills/lidr-pr-description/checklists/dod.md:

- ✅ Tests pass: !`npm test`
- ✅ Lint clean: !`npm run lint`
- ✅ Build succeeds: !`npm run build`
- ⏳ SAST/SCA: check {{CODE_QUALITY_TOOL}} results if available
- ⏳ Code review: pending (will happen after PR)

If any FAIL → suggest specific fixes before continuing.

## Step 7: Create PR

Generate PR description using lidr-pr-description skill:

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

Use lidr-dev-handoff-qa skill to generate handoff document:

- Ticket reference and linked RF
- What was implemented (functional language, not technical)
- Relevant changes (endpoints, DB, config, feature flags)
- How to test (step-by-step for QA)
- Test data needed
- Known limitations / edge cases
- Environment to test in

Attach handoff to ticket $1 via lidr-sdlc-tracking (resolves {{TRACKING_TOOL}}).

## Step 9: Transition and Notify

Via lidr-sdlc-tracking (resolves {{TRACKING_TOOL}}): transition $1 to "Ready for QA".

Via lidr-external-sync (resolves {{CHAT_TOOL}}): notify the QA channel:
"Ticket $1 ready for QA. Handoff attached. PR: {link}. Environment: staging."

Report:

```
## /lidr-implement-ticket $1 ✅

PR: #{pr-number} — {title}
Branch: {branch-name}
Status: Ready for QA
Handoff: Attached to ticket

DoD: ✅ Tests | ✅ Lint | ✅ Build | ⏳ Review
Next: QA runs /lidr-prepare-testing $1
```
