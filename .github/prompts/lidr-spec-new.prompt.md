---
description: Create a new LIDR change container with empty scaffold (proposal, design, tasks, spec)
agent: 'agent'
---

<!--
COMMAND: lidr-spec-new
VERSION: 1.0.0
AUTHOR: LIDR Spec Native
LAST UPDATED: 2026-05-20

PURPOSE:
Scaffold a new LIDR change container at
docs/projects/{{CLIENT_CODE}}/changes/<change-name>/ with empty placeholders
for proposal.md, design.md, tasks.md, spec.md, plus a reports/ subdirectory.

USAGE:
  /lidr-spec-new add-item-soft-delete

ARGUMENTS:
  change-name: kebab-case identifier (required). Must be unique within the project's
               changes/ directory and changes/archive/.

RELATED:
  /lidr-spec-ff       — fast-forward: generate all artifacts in one pass
  /lidr-spec-continue — resume a paused change
  Rule:  lidr-sdlc/spec-execution.md (mandatory steps for tasks.md)
  Rule:  lidr-sdlc/documentation.md  (frontmatter LIDR standard)

CHANGELOG:
  v1.0.0 (2026-05-20): Initial release — LIDR-native parity with opsx:new
-->

# Create LIDR change: $1

Load: @../rules/lidr-sdlc/documentation.md (frontmatter standard) and @../rules/lidr-sdlc/spec-execution.md (mandatory tasks structure).

## Validate input

If "$1" is empty:

- Use AskUserQuestion: "What change do you want to create? Provide a short kebab-case name (e.g., `add-item-soft-delete`)."
- Derive a kebab-case name from the response if needed.

Validate the name:

- Lowercase + hyphens only (regex `^[a-z][a-z0-9-]+$`)
- Length between 3 and 60 characters
- Not already present in `docs/projects/{{CLIENT_CODE}}/changes/` or `docs/projects/{{CLIENT_CODE}}/changes/archive/`

If invalid: ❌ explain why and exit (do NOT auto-rename).

## Resolve client code

Determine `{{CLIENT_CODE}}` from one of (in order):

1. `src/data/client.ts` (the React app's active client)
2. Environment variable `LIDR_CLIENT_CODE`
3. `.agents/rules/lidr-sdlc/project.md` — read the "Código" field
4. If none can be determined: ask the user

Store as `CLIENT_CODE` for the rest of the command.

## Create the change container

Path: `docs/projects/<CLIENT_CODE>/changes/<change-name>/`

Create the directory structure:

```
docs/projects/<CLIENT_CODE>/changes/<change-name>/
├── enriched-us.md        (placeholder — paste the enriched user story here; consumed by /lidr-spec-ff)
├── proposal.md           (placeholder)
├── design.md             (placeholder)
├── tasks.md              (placeholder)
├── spec.md               (placeholder)
├── test-report.md        (placeholder — filled by /lidr-spec-verify)
└── reports/              (empty — filled by /lidr-spec-apply per-step reports)
```

Each `.md` placeholder MUST include the LIDR enhanced frontmatter (see `lidr-sdlc/documentation.md` §4):

```yaml
id: <change-name>-<artifact>          # e.g., add-item-soft-delete-proposal
version: "0.1.0"
last_updated: "<today YYYY-MM-DD>"
updated_by: "TL: <session-user>"
status: draft
type: change-artifact
workflowType: spec-driven
stepsCompleted: []
relationships:
  dependsOn: []
  generates: []
editHistory:
  - date: "<today>"
    step: "spec-new"
    changes: "Initial scaffold created by /lidr-spec-new"

# <Artifact Title>: <change-name>

> ⚠️ [PENDIENTE] — Placeholder. Fill via /lidr-spec-ff or manually.
```

> The literal token `[PENDIENTE]` is the repo-wide readiness sentinel: `/lidr-spec-ff` and `/lidr-spec-apply` both guard on it, so a freshly-scaffolded-but-unfilled artifact is correctly blocked from `apply`. Keep this exact token.

Use the artifact title appropriate for each file:

- `enriched-us.md` → "Enriched User Story" (paste the US/ticket detail here before running `/lidr-spec-ff`)
- `proposal.md` → "Proposal"
- `design.md` → "Design"
- `tasks.md` → "Tasks"
- `spec.md` → "Spec"
- `test-report.md` → "Test Report" (mark `status: pending` in frontmatter)

## Report

```
✅ Created LIDR change container

Change:    <change-name>
Location:  docs/projects/<CLIENT_CODE>/changes/<change-name>/
Status:    draft
Artifacts: enriched-us.md, proposal.md, design.md, tasks.md, spec.md, test-report.md
Reports:   docs/projects/<CLIENT_CODE>/changes/<change-name>/reports/ (empty)

Next steps:
  1. Paste the enriched user story into enriched-us.md
  2. /lidr-spec-ff <change-name>     → fast-forward: generate all artifacts in one pass
  /lidr-spec-apply <change-name>  → implement tasks (after ff)
```

## Guardrails

- ❌ NEVER overwrite existing changes — if the name exists, abort with a clear message
- ❌ NEVER create the container outside `docs/projects/<CLIENT_CODE>/changes/`
- ✅ Always include the LIDR enhanced frontmatter (per `lidr-sdlc/documentation.md` §4)
- ✅ Always create the `reports/` subdirectory (empty), so `/lidr-spec-apply` can write into it later
