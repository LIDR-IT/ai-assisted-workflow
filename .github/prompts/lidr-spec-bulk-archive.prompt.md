---
description: Archive all LIDR changes with PASSED verdict — bulk operation
agent: 'agent'
---

<!--
COMMAND: lidr-spec-bulk-archive
VERSION: 1.0.0
AUTHOR: LIDR Spec Native
LAST UPDATED: 2026-05-20

PURPOSE:
Archive multiple LIDR changes at once. Scans changes/ for any change whose
test-report.md has verdict: PASSED and moves them all to changes/archive/.
Optional filter restricts to changes matching a pattern.

USAGE:
  /lidr-spec-bulk-archive
  /lidr-spec-bulk-archive item-*       (only changes starting with "item-")

RELATED:
  /lidr-spec-archive   — archive a single change

CHANGELOG:
  v1.0.0 (2026-05-20): Initial release — LIDR-native parity with opsx:bulk-archive
-->

# Bulk archive LIDR changes

## Scan for archivable changes

Optional filter argument "$1" (glob pattern, default `*`).

For each directory under `docs/projects/<CLIENT_CODE>/changes/` (excluding `archive/`) matching the filter:

- Check if `test-report.md` exists
- Read its frontmatter `verdict` field

Classify:

- **Ready** (verdict PASSED) → archive
- **WARNINGS** → list separately, do NOT auto-archive (require user confirmation per change)
- **CRITICAL** → list separately, do NOT archive
- **No test-report.md** → list as "not verified", do NOT archive

## Confirm with user

```
Bulk archive — preview:

Ready (PASSED) — will be archived:
  - <change-1>
  - <change-2>
  - <change-3>

WARNINGS — skipped unless individually confirmed:
  - <change-4>

CRITICAL — skipped:
  - <change-5>

Not verified — skipped:
  - <change-6>

Proceed to archive 3 changes? (yes/no/select)
```

Use AskUserQuestion with options: "Archive all PASSED", "Select which to archive", "Cancel".

## Archive in sequence

For each confirmed change, invoke the same logic as `/lidr-spec-archive <name>`:

- Move to `docs/projects/<CLIENT_CODE>/changes/archive/YYYY-MM-DD-<name>/`
- Update frontmatter `status: archived`
- Append to `editHistory`
- Update index if present

## Report

```
✅ Bulk archive complete

Archived (PASSED):       N changes
Skipped (WARNINGS):      M changes
Skipped (CRITICAL):      K changes
Skipped (not verified):  L changes

Archived items:
  - <YYYY-MM-DD>-<change-1>
  - <YYYY-MM-DD>-<change-2>
  - <YYYY-MM-DD>-<change-3>

Next:
  /lidr-create-pr <ticket-id>   → for PRs referencing the archived changes
```

## Guardrails

- ❌ NEVER archive a change with CRITICAL verdict (filter excludes them by default)
- ❌ NEVER archive a change without test-report.md (filter excludes them)
- ❌ NEVER bulk-archive without explicit user confirmation
- ✅ Report per change which were archived, skipped, and why
- ✅ Process sequentially (not in parallel) to avoid index corruption
