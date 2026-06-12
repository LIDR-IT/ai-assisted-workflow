---
description: Fast-forward — generate proposal, design, tasks, spec for a LIDR change in one pass. Requires Opus high reasoning.
argument-hint: [change-name]
allowed-tools: Read, Write, Edit, Glob, Grep, Bash(ls:*), AskUserQuestion
model: opus
---

<!--
COMMAND: lidr-spec-ff
VERSION: 1.0.0
AUTHOR: LIDR Spec Native
LAST UPDATED: 2026-05-20

PURPOSE:
Fast-forward through artifact creation for a LIDR change: generate proposal.md,
design.md, spec.md, and tasks.md in one pass, using the existing LIDR skills as
sub-steps (bmad-prd for proposal, bmad-create-architecture for design,
lidr-requirements (per-rf → nfr modes) for spec, lidr-user-stories +
spec-execution.md for tasks). BMad is the canonical SDD engine; LIDR wraps its
outputs (gate / format / traceability) — see .agents/_shared/lidr/MIGRATION.md.

PRE-REQUISITE:
  /lidr-spec-new <change-name> must have been run (the container must exist).

USAGE:
  /lidr-spec-ff add-item-soft-delete

RELATED:
  /lidr-spec-new      — create the container first
  /lidr-spec-apply    — implement tasks after ff
  /lidr-spec-continue — resume if ff was interrupted
  Rule: lidr-sdlc/model-selection.md (Opus high reasoning mandatory)
  Rule: lidr-sdlc/spec-execution.md  (tasks.md mandatory structure)

CHANGELOG:
  v1.0.0 (2026-05-20): Initial release — LIDR-native parity with opsx:ff
-->

# Fast-forward LIDR change: $1

## Model self-correct (per lidr-sdlc/model-selection.md)

Before starting, verify the session is using Opus high reasoning. If not, self-correct by editing `.claude/settings.json` (use `update-config` skill or jq) with `"model": "opus"` and `"effort": "high"`. **Do not stop and ask the user** — this is planning work and Opus is mandatory.

## Validate input

If "$1" is empty: use AskUserQuestion to ask "Which change do you want to fast-forward?" and list available changes from `docs/projects/<CLIENT_CODE>/changes/`.

Verify the change exists: `docs/projects/<CLIENT_CODE>/changes/<change-name>/` must contain placeholder `proposal.md`, `design.md`, `tasks.md`, `spec.md`. If missing: ❌ "Change not found. Run `/lidr-spec-new <change-name>` first."

## Resolve client code

Same logic as `/lidr-spec-new` (read `src/data/client.ts`, env var, or `lidr-sdlc/project.md`).

## Load context

Read into context:

- The 4 placeholder artifacts (proposal, design, tasks, spec)
- `lidr-sdlc/org.md`, `tech-stack.md`, `project.md`, `documentation.md`, `spec-execution.md`
- Any enriched user story attached to the change (look for `docs/projects/<CLIENT_CODE>/changes/<change-name>/enriched-us.md` or argument)

If no enriched US is available: ask the user to provide one (or a Jira ticket ID, or inline text). Without an US, ff cannot proceed — abort.

## Generation pipeline (sequential, do NOT skip)

### Step 1 — Generate `proposal.md`

Invoke logic from skill `bmad-prd` (covers both functional and technical sections). After generation, `lidr-review-cruzado` validates that F+T sections are complete (Gate 1 enforcement). Output goes into the existing `proposal.md`, **replacing the placeholder body but preserving the frontmatter** (update `last_updated`, append to `editHistory`, set `status: in-progress`, add `step-02-proposal` to `stepsCompleted`).

Content must cover:

- Problem statement (from the enriched US)
- Proposed solution (technical + functional outline)
- Scope (in / out)
- Risks and assumptions
- Stakeholders impacted

### Step 2 — Generate `design.md`

Invoke logic from skill `bmad-create-architecture` (and `lidr-adr` if architectural decisions surface — LIDR emits the MADR record on top of BMad's design). Update frontmatter (append to `editHistory`, add `step-03-design` to `stepsCompleted`).

Content must cover:

- Architecture (component diagram or table)
- Data model changes
- API changes (new/modified endpoints, OpenAPI references)
- Component changes (UI, services)
- Dependency changes
- Migration path (if breaking)
- ADRs that need to be created (link out, don't inline)

### Step 3 — Generate `spec.md`

Invoke logic from skill `lidr-requirements` (per-rf mode for RFs with BDD → nfr mode for measurable NFRs). Update frontmatter (append to `editHistory`, add `step-04-spec` to `stepsCompleted`).

> **`bmad-spec` deliberately bypassed here.** LIDR builds `spec.md` from `lidr-requirements` (per-rf → nfr modes: human-readable RFs with BDD + measurable NFRs), **not** from BMad's `bmad-spec` SPEC kernel (a machine-contract artifact). This is a deliberate decision, not an oversight: the change container's `spec.md` is the governance/traceability spec, while `bmad-spec`'s kernel is consumed (when present) only as planning input to Step 1's `proposal.md`.

Content must cover:

- Functional Requirements (RF-1, RF-2, ...) with BDD Given/When/Then
- Non-Functional Requirements (NFR-1, NFR-2, ...) measurable (latency, availability, etc.)
- Traceability matrix (RF ↔ tasks)

### Step 4 — Generate `tasks.md` (CRITICAL — apply spec-execution.md)

Story context comes from the BMad engine `bmad-create-story` (the dev-ready story content); `lidr-user-stories` then slices it into LIDR-formatted tasks. Invoke logic from skill `lidr-user-stories` for the slicing, then **MANDATORY**: apply the rule `lidr-sdlc/spec-execution.md` to enforce structure:

- Step 0 = Create Feature Branch (FIRST)
- All implementation steps in numbered sections
- Mandatory steps (unit tests + curl + Playwright + docs) at the end of the list with explicit `(MANDATORY — AGENT MUST EXECUTE)` labels
- Each mandatory step references the report path in `docs/projects/<CLIENT_CODE>/changes/<change-name>/reports/`

Update frontmatter (append to `editHistory`, add `step-05-tasks` to `stepsCompleted`).

## Model revert

After Step 4 completes, the planning is done. Optionally revert to Sonnet medium per `lidr-sdlc/model-selection.md` for the subsequent `/lidr-spec-apply` step (the user may run that immediately).

## Validate output

For each of the 4 artifacts:

- Frontmatter is valid YAML
- `last_updated` is today
- `editHistory` has the new entry
- Body has no `[PENDIENTE]` placeholders left unless explicitly justified
- `tasks.md` passes the verification checklist of `spec-execution.md` §5

If any validation fails: report which artifact and what's missing; do NOT mark the change as ready for `/lidr-spec-apply`.

## Report

```
✅ Fast-forward complete: <change-name>

Generated:
  ✓ proposal.md      (bmad-prd + lidr-review-cruzado Gate-1 check)
  ✓ design.md        (bmad-create-architecture + lidr-adr references)
  ✓ spec.md          (lidr-requirements per-rf → nfr modes)
  ✓ tasks.md         (lidr-user-stories + spec-execution.md mandatory steps)

Location: docs/projects/<CLIENT_CODE>/changes/<change-name>/
Status:   ready-for-apply

Model: Opus high reasoning was used for planning. Reverted to Sonnet medium for next step.

Next:
  /lidr-spec-apply <change-name>  → implement task-by-task
```

## Guardrails

- ❌ NEVER skip the model self-correct step — planning without Opus produces shallow specs
- ❌ NEVER write `tasks.md` without the mandatory steps from `spec-execution.md`
- ❌ NEVER overwrite frontmatter — only update `last_updated`, append to `editHistory`, append to `stepsCompleted`
- ✅ Always pass the enriched US as primary source of truth
- ✅ Always validate output before reporting success
- ✅ If a step fails or input is critically unclear, pause and ask the user — don't fabricate
