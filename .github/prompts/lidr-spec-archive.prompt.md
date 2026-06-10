---
description: Archive a completed LIDR change — move to changes/archive/ and update indices
agent: 'agent'
---

<!--
COMMAND: lidr-spec-archive
VERSION: 1.0.0
AUTHOR: LIDR Spec Native
LAST UPDATED: 2026-05-20

PURPOSE:
Archive a verified LIDR change by moving it from changes/<name>/ to
changes/archive/YYYY-MM-DD-<name>/, updating the change frontmatter to status:
archived, and reflecting the change in any index files.

PRE-REQUISITE:
  /lidr-spec-verify must have completed with verdict PASSED (or WARNINGS the
  user explicitly accepts).

USAGE:
  /lidr-spec-archive add-item-soft-delete

RELATED:
  /lidr-spec-verify    — must run BEFORE archive
  /lidr-spec-bulk-archive — archive multiple at once

CHANGELOG:
  v1.0.0 (2026-05-20): Initial release — LIDR-native parity with opsx:archive
-->

# Archive LIDR change: $1

## Validate input

If "$1" empty: ❌ "Provide the change name. Usage: /lidr-spec-archive <change-name>".

Verify `docs/projects/<CLIENT_CODE>/changes/<change-name>/` exists. If not: ❌ "Change not found."

## Verify readiness

Read `docs/projects/<CLIENT_CODE>/changes/<change-name>/test-report.md`:

- If file does not exist: ❌ "Run /lidr-spec-verify first."
- If `verdict: CRITICAL`: ❌ "Cannot archive. Verdict is CRITICAL. Fix issues and re-verify."
- If `verdict: WARNINGS`: ask the user "Verdict is WARNINGS. Archive anyway? (yes/no)". Only proceed on explicit yes.
- If `verdict: PASSED`: proceed.

## Move to archive

```bash
# Resolve archive date
DATE=$(date +%Y-%m-%d)
ARCHIVE_PATH="docs/projects/<CLIENT_CODE>/changes/archive/${DATE}-<change-name>"

# Ensure archive directory exists
mkdir -p docs/projects/<CLIENT_CODE>/changes/archive

# Move
mv "docs/projects/<CLIENT_CODE>/changes/<change-name>" "$ARCHIVE_PATH"
```

If a directory with the same `YYYY-MM-DD-<change-name>` already exists in archive (unlikely): append `-N` suffix and warn.

## Update frontmatter

For each `.md` file in the archived directory:

- Set `status: archived`
- Append to `editHistory` an entry:
  ```yaml
  - date: "<today>"
    step: "archive"
    changes: "Moved to archive/${DATE}-<change-name>/ after PASSED verification"
  ```

## Update indices (if present)

If `docs/projects/<CLIENT_CODE>/changes/INDEX.md` or similar exists, update it:

- Remove the entry from "Active changes"
- Add an entry to "Archived" with date and link to the archive path

## Report

```
✅ Archived: <change-name>

Source:  docs/projects/<CLIENT_CODE>/changes/<change-name>/
Target:  docs/projects/<CLIENT_CODE>/changes/archive/<YYYY-MM-DD>-<change-name>/
Verdict: PASSED (or WARNINGS-accepted)
Status:  archived

Next:
  /lidr-create-pr <ticket-id>   → create PR referencing this archived change
  /lidr-sync-docs                    → propagate any final doc updates
```

## Guardrails

- ❌ NEVER archive a change with CRITICAL verdict
- ❌ NEVER delete the archived change — only move
- ❌ NEVER overwrite an existing archive entry — append `-N` suffix if collision
- ✅ Always update frontmatter `status: archived` after move
- ✅ Always update the change index if one exists
