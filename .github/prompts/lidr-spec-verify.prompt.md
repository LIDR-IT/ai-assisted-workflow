---
description: Final verification of a LIDR change — runs full test suite, docs drift check, and generates test-report.md
agent: 'agent'
---

<!--
COMMAND: lidr-spec-verify
VERSION: 1.0.0
AUTHOR: LIDR Spec Native
LAST UPDATED: 2026-05-20

PURPOSE:
Run the final verification pass for a LIDR change: re-execute the unit suite,
re-run curl on endpoints affected, re-run Playwright if applicable, detect docs
drift via /sync-docs principles, and produce a final test-report.md with PASS /
WARNINGS / CRITICAL verdict.

PRE-REQUISITE:
  /lidr-spec-apply must have completed all tasks (or be in a state where
  remaining tasks are documented as deferred).

USAGE:
  /lidr-spec-verify add-item-soft-delete

RELATED:
  /lidr-spec-apply   — run this BEFORE verify
  /lidr-spec-archive — run AFTER verify if PASS
  Rule: lidr-sdlc/spec-execution.md (mandatory steps + reports)

CHANGELOG:
  v1.0.0 (2026-05-20): Initial release — LIDR-native parity with opsx:verify
-->

# Verify LIDR change: $1

## Conditional model promote (per lidr-sdlc/model-selection.md §2.3)

Verify starts on Sonnet medium. If CRITICAL findings emerge, **self-promote to Opus high** for analysis: edit `.claude/settings.json` with `"model": "claude-opus-4-7"` and `"effort": "high"`. Then continue.

## Load context

Read:

- `docs/projects/<CLIENT_CODE>/changes/<change-name>/proposal.md`
- `docs/projects/<CLIENT_CODE>/changes/<change-name>/design.md`
- `docs/projects/<CLIENT_CODE>/changes/<change-name>/spec.md`
- `docs/projects/<CLIENT_CODE>/changes/<change-name>/tasks.md`
- All files in `docs/projects/<CLIENT_CODE>/changes/<change-name>/reports/`
- `lidr-sdlc/spec-execution.md` §5 (verification checklist)

## Verification checks (run all, do not skip)

### Check 1 — Tasks completion

- Count `[ ]` vs `[x]` in `tasks.md`
- If any pending task is not documented as deferred: WARNING

### Check 2 — Mandatory reports exist

For each mandatory step in `tasks.md` (per `spec-execution.md`):

- Check that a corresponding `reports/YYYY-MM-DD-step-N+M-*.md` exists
- If missing: CRITICAL

### Check 3 — Re-run unit tests

- Identify the unit suite from `tech-stack.md` §7
- Run it (AGENT MUST EXECUTE, not the user)
- Capture pass/fail counts, runtime
- If failures appear that weren't documented in reports/: CRITICAL

### Check 4 — Re-run curl endpoint tests

- Identify modified endpoints from `design.md` / `spec.md` (RF → API mapping)
- Re-run all curl tests documented in `reports/` for those endpoints
- Verify DB state matches expected pre-test baseline
- If responses differ from expected, or DB state is dirty: WARNING or CRITICAL depending on impact

### Check 5 — Re-run Playwright E2E (if applicable)

- If `design.md` lists frontend changes: re-run E2E using Playwright MCP
- Verify the user workflow end-to-end
- If E2E fails: CRITICAL

### Check 6 — Docs drift

Apply the DTC matrix from `lidr-sdlc/documentation.md` §1:

- If schema changed: `architecture.md` should be updated
- If endpoint changed: `specs/routes.md` and OpenAPI spec should be updated
- If component changed: `specs/components.md` should be updated
- If architectural decision: ADR should exist

If drift detected: WARNING with the list of stale docs.

### Check 7 — Frontmatter integrity

For each of `proposal.md`, `design.md`, `spec.md`, `tasks.md`:

- `last_updated` ≤ today
- `editHistory` covers all major changes
- `status` matches reality (`active` not `draft` if applied)
- If broken: WARNING

## Generate `test-report.md`

Write `docs/projects/<CLIENT_CODE>/changes/<change-name>/test-report.md` (replacing the placeholder) with:

```markdown
id: <change-name>-test-report
version: "1.0.0"
last_updated: "<today>"
updated_by: "TL: <session-user>"
status: completed
type: test-report
verdict: PASSED | WARNINGS | CRITICAL

# Test Report: <change-name>

## Verdict: PASSED / WARNINGS / CRITICAL

## Summary

- Tasks complete: M/M
- Mandatory reports: N/N
- Unit tests: <passed>/<total> passed
- curl tests: <count> executed, <issues> issues
- E2E tests: <count> executed, <issues> issues (or N/A)
- Docs drift: <list or "none">

## Per-check results

### Check 1 — Tasks completion

<result>

### Check 2 — Mandatory reports

<result>

### Check 3 — Unit tests

<commands, totals, failures, runtime>

### Check 4 — curl endpoint tests

<endpoints tested, status codes, DB state>

### Check 5 — Playwright E2E

<scenarios executed, outcomes>

### Check 6 — Docs drift

<list of stale docs or "all aligned">

### Check 7 — Frontmatter integrity

<issues or "all valid">

## Findings

### CRITICAL

- <item> (action: ...)

### WARNINGS

- <item> (action: ...)

### SUGGESTIONS

- <item>

## Next step recommendation

<one of: ready for /lidr-spec-archive | requires apply re-run | requires design update>
```

## Report (terminal output)

```
✅ Verification complete: <change-name>

Verdict:        PASSED | WARNINGS | CRITICAL
Tasks:          M/M complete
Reports:        N files
Unit tests:     X/Y passed
curl tests:     X executed, Y issues
E2E:            X scenarios, Y issues (or N/A)
Docs drift:     <count> docs stale (or "aligned")

CRITICAL findings: <count>
WARNINGS:          <count>
SUGGESTIONS:       <count>

Test report: docs/projects/<CLIENT_CODE>/changes/<change-name>/test-report.md

Next:
  PASSED      → /lidr-spec-archive <change-name>
  WARNINGS    → review test-report.md, re-run if needed
  CRITICAL    → fix issues, re-run /lidr-spec-apply or /lidr-spec-verify
```

## Guardrails

- ❌ NEVER mark verdict as PASSED if any CRITICAL finding exists
- ❌ NEVER skip re-running tests just because reports exist (verification = independent re-execution)
- ❌ NEVER delete or modify the existing per-step reports — only append the final `test-report.md`
- ✅ Always promote to Opus if CRITICAL findings need deeper analysis
- ✅ Always restore DB state if any re-run test mutates data
