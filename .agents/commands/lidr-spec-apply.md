---
description: Implement tasks from a LIDR change task-by-task, executing all mandatory tests per spec-execution.md
argument-hint: [change-name]
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, mcp__playwright, AskUserQuestion
model: claude-sonnet-4-6
---

<!--
COMMAND: lidr-spec-apply
VERSION: 1.0.0
AUTHOR: LIDR Spec Native
LAST UPDATED: 2026-05-20

PURPOSE:
Implement every task in docs/projects/{{CLIENT_CODE}}/changes/<change-name>/tasks.md,
marking [x] after each, executing all MANDATORY tests (unit, curl, Playwright)
itself per spec-execution.md, and producing per-step reports in reports/.

PRE-REQUISITE:
  /lidr-spec-ff <change-name> must have produced a complete tasks.md.

USAGE:
  /lidr-spec-apply add-item-soft-delete

RELATED:
  /lidr-spec-ff       — generate tasks.md first
  /lidr-spec-verify   — run after apply for final verification
  /lidr-spec-continue — resume if apply was paused
  Rule: lidr-sdlc/spec-execution.md (mandatory test execution, AGENT MUST EXECUTE)
  Rule: lidr-sdlc/model-selection.md (Sonnet medium for implementation)

CHANGELOG:
  v1.0.0 (2026-05-20): Initial release — LIDR-native parity with opsx:apply
-->

# Implement LIDR change: $1

## Model self-correct (per lidr-sdlc/model-selection.md)

This is implementation work. Verify the session is on Sonnet medium. If on Opus high (from prior planning), revert by editing `.claude/settings.json` with `"model": "claude-sonnet-4-6"` and `"effort": "medium"`. **Do not stop and ask the user**.

## Select the change

If "$1" is provided, use it. Otherwise:

- Infer from conversation context if the user mentioned a change recently
- Auto-select if only one active change exists in `docs/projects/<CLIENT_CODE>/changes/`
- If ambiguous: list active changes and use AskUserQuestion

Always announce: "Applying change: <change-name>".

## Load context

Read in this order (all required):

1. `docs/projects/<CLIENT_CODE>/changes/<change-name>/proposal.md`
2. `docs/projects/<CLIENT_CODE>/changes/<change-name>/design.md`
3. `docs/projects/<CLIENT_CODE>/changes/<change-name>/spec.md`
4. `docs/projects/<CLIENT_CODE>/changes/<change-name>/tasks.md`
5. `lidr-sdlc/spec-execution.md` (MANDATORY — controls test execution)
6. `lidr-sdlc/tech-stack.md` (testing conventions)
7. `lidr-sdlc/documentation.md` (DTC matrix for Step N+4)

If any of 1-4 are missing or still contain `[PENDIENTE]`: ❌ "Change not ready for apply. Run /lidr-spec-ff or /lidr-spec-continue."

## Show progress

```
## Implementing change: <change-name>

Progress: N/M tasks complete
Mandatory steps remaining:
  - Step 0: Create feature branch (if not yet done)
  - Step N+1: Unit tests + DB verification
  - Step N+2: Manual curl endpoint testing
  - Step N+3: Playwright E2E (if applicable)
  - Step N+4: Docs update
```

## Implementation loop

For each pending task in `tasks.md`:

1. **Announce**: "Working on task X.Y: <task description>"
2. **Read referenced files** if the task mentions specific paths
3. **Implement the code change** — minimal, focused
4. **If the task is a MANDATORY testing step** (per `spec-execution.md`):
   - Execute it yourself (run the unit suite, curl, Playwright). Never delegate.
   - Generate the report at `docs/projects/<CLIENT_CODE>/changes/<change-name>/reports/YYYY-MM-DD-step-N+M-<name>.md` per the template in `spec-execution.md`
5. **Update `tasks.md`**: change the checkbox from `- [ ]` to `- [x]` for that specific task
6. **Continue to next task**

### Pause conditions

Pause and ask for guidance only if:

- A task is genuinely ambiguous and you cannot make a reasonable decision
- Implementation reveals a design issue that requires updating `design.md` or `spec.md`
- An error or environmental blocker stops progress (e.g., DB unreachable, dependency missing)
- The user interrupts

When pausing, save state by ensuring `tasks.md` accurately reflects what has been done so the next session (or `/lidr-spec-continue`) can resume.

### Test execution rules (from spec-execution.md §4)

- **AGENT MUST EXECUTE** all unit tests, curl, and Playwright tests
- After CREATE/UPDATE/DELETE operations, **restore DB state** to pre-test baseline
- A task is `[x]` ONLY after:
  - Code changes complete
  - Tests pass (or documented exception)
  - DB state restored if applicable
  - Per-step report file exists

## On completion

When all tasks in `tasks.md` are `[x]`:

```
✅ All tasks complete: <change-name>

Tasks:     M/M complete
Reports:   N files in reports/
Tests:     unit ✓ | curl ✓ | E2E ✓ (or N/A) | docs ✓

Next:
  /lidr-spec-verify <change-name>   → final verification + test-report.md
```

## On pause (issue encountered)

```
⏸ Paused: <change-name>

Progress: K/M tasks complete
Reports:  N files in reports/
Blocker:  <description>

Options:
  1. <option 1>
  2. <option 2>
  3. Other approach

Resume with: /lidr-spec-continue <change-name>
```

## Guardrails

- ❌ NEVER mark a task `[x]` if its mandatory tests haven't been executed
- ❌ NEVER delegate testing to the user (spec-execution.md §4 is binding)
- ❌ NEVER skip the per-step report file
- ❌ NEVER modify `proposal.md`, `design.md`, or `spec.md` from inside apply — if you need to, pause and suggest `/lidr-spec-continue` after the user approves
- ✅ Keep code changes minimal and scoped per task
- ✅ Update `tasks.md` immediately after each task completes
- ✅ Restore DB state after every CREATE/UPDATE/DELETE test
