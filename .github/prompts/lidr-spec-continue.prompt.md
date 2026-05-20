---
description: Resume a paused LIDR change — read current state and pick up where it left off
agent: 'agent'
---

<!--
COMMAND: lidr-spec-continue
VERSION: 1.0.0
AUTHOR: LIDR Spec Native
LAST UPDATED: 2026-05-20

PURPOSE:
Resume a paused LIDR change by reading its current state (tasks.md progress,
existing reports, frontmatter stepsCompleted) and continuing the appropriate
step (ff, apply, or verify). Acts as a smart dispatcher.

USAGE:
  /lidr-spec-continue add-item-soft-delete

RELATED:
  /lidr-spec-ff, /lidr-spec-apply, /lidr-spec-verify — the steps this dispatches to

CHANGELOG:
  v1.0.0 (2026-05-20): Initial release — LIDR-native parity with opsx:continue
-->

# Resume LIDR change: $1

## Validate input

If "$1" empty: list active changes from `docs/projects/<CLIENT_CODE>/changes/` and ask the user which to resume.

Verify the change folder exists. If not: ❌ "Change not found."

## Diagnose current state

Read in order:
1. `proposal.md` frontmatter — extract `stepsCompleted`, `status`
2. `design.md` frontmatter
3. `spec.md` frontmatter
4. `tasks.md` body — count `[ ]` vs `[x]`
5. `test-report.md` frontmatter — extract `verdict` and `status`
6. `reports/` directory listing

Determine state:

| State | Indicator | Next step |
|---|---|---|
| **Just-scaffolded** | All artifacts have `status: draft` with empty/placeholder bodies | `/lidr-spec-ff <name>` |
| **FF interrupted** | Some artifacts have content, others are placeholder | `/lidr-spec-ff <name>` (re-run, it picks up where it stopped) |
| **Apply in progress** | `tasks.md` has both `[ ]` and `[x]`, frontmatter `status: in-progress` | `/lidr-spec-apply <name>` (resumes from first `[ ]`) |
| **Apply complete, not verified** | All tasks `[x]`, `test-report.md` is placeholder | `/lidr-spec-verify <name>` |
| **Verified WARNINGS, awaiting decision** | `test-report.md` verdict WARNINGS | Ask user: archive anyway or fix issues |
| **Verified CRITICAL** | `test-report.md` verdict CRITICAL | List CRITICAL findings, suggest `/lidr-spec-apply` re-run |
| **Verified PASSED** | `test-report.md` verdict PASSED | Suggest `/lidr-spec-archive <name>` |
| **Archived** | Directory moved to `changes/archive/` | ❌ "Already archived" |

## Announce state and dispatch

```
Change: <change-name>
State:  <detected state>
Progress: K/M tasks
Reports:  N files

Next step: <command name>

Proceeding to <command name> automatically...
```

Then invoke the appropriate command logic inline (do NOT re-prompt the user unless the state is ambiguous or requires user decision).

## On ambiguous state

If the state cannot be determined unambiguously (e.g., partial corruption of frontmatter, conflicting indicators):

```
⚠️ Cannot determine state automatically.

Observed:
  proposal.md status: <value>
  design.md status:   <value>
  spec.md status:     <value>
  tasks.md progress:  K/M
  test-report.md:     <state>

Use AskUserQuestion with options:
  - Re-run /lidr-spec-ff (regenerate planning artifacts)
  - Re-run /lidr-spec-apply (continue implementation from first [ ])
  - Re-run /lidr-spec-verify (force verification with current state)
  - Inspect manually (no action)
```

## Guardrails

- ❌ NEVER attempt to continue an `archived` change
- ❌ NEVER assume state — always read all 5 artifacts before deciding
- ✅ When ambiguous, ask the user with a clear summary of observed state
- ✅ Preserve all existing frontmatter and reports — never delete
- ✅ If model needs to change for the dispatched step, self-correct per `lidr-sdlc/model-selection.md`
