---
description: Update CHANGELOG.md with release version
argument-hint: [version]
allowed-tools: Read, Write, Edit, Bash(git:*), AskUserQuestion
model: haiku
---

<!--
COMMAND: update-changelog
VERSION: 1.0.0
AUTHOR: SDLC Team
LAST UPDATED: 2025-03-05

PURPOSE:
Updates CHANGELOG.md following Keep a Changelog + Conventional Commits.
Parses merged PRs, classifies by type, generates entry, commits and tags.

USAGE:
  /update-changelog v1.2.0
  /update-changelog v1.2.0 --dry-run
  /update-changelog v1.2.0 --no-tag

ARGUMENTS:
  version: Semver version (required). Format: vX.Y.Z
  Flags: --dry-run, --no-tag, --include-chores

RELATED COMMANDS:
  /create-release-notes - Generate the notes this command persists
  /advance-gate 7       - Deploy gate checks CHANGELOG updated

CHANGELOG:
  v1.0.0 (2025-03-05): Initial release
-->

# Update CHANGELOG for $1

## Validate

If "$1" is empty or doesn't match semver pattern:
❌ Version required in semver format.
Usage: /update-changelog v1.2.0
Exit.

Check if CHANGELOG.md exists: !`test -f CHANGELOG.md && echo "EXISTS" || echo "MISSING"`

If MISSING: create CHANGELOG.md with standard header:

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]
```

Check if version already in CHANGELOG: !`grep -c "\[$1\]" CHANGELOG.md`
If found: ❌ "Version $1 already in CHANGELOG.md." Exit.

## Gather Changes

Last tag: !`git describe --tags --abbrev=0 2>/dev/null || echo "none"`
PRs since last tag: !`git log {last-tag}..HEAD --merges --oneline`

If release notes already generated (`.claude/releases/$1-release-notes.local.md`):
Reuse technical release notes as source.
Else:
Parse PRs and conventional commit prefixes from merge commits.

## Classify Changes

Parse each PR/commit by conventional commit prefix:

| Prefix             | CHANGELOG Section              |
| ------------------ | ------------------------------ |
| feat:              | Added                          |
| fix:               | Fixed                          |
| perf:              | Changed                        |
| refactor:          | Changed                        |
| security:          | Security                       |
| BREAKING CHANGE:   | Breaking Changes               |
| deprecate:         | Deprecated                     |
| docs:/test:/chore: | Skip (unless --include-chores) |

Detect dependency changes: !`git diff {last-tag}..HEAD -- package.json`

## Generate Entry

Generate CHANGELOG entry in Keep a Changelog format:

```markdown
## [$1] - {YYYY-MM-DD}

### Added

- {functional description} ({TICKET-ID})

### Changed

- {description} ({TICKET-ID})

### Fixed

- {description} ({TICKET-ID})

### Security

- {description} ({TICKET-ID})

### Breaking Changes

- {description + migration guide} ({TICKET-ID})

### Dependencies

- {package}: {old} → {new}
```

## Preview

Show generated entry to user.

If $ARGUMENTS contains "--dry-run":
Show entry and exit without modifying files.
Exit.

Use AskUserQuestion:

- question: "¿El CHANGELOG entry es correcto?"
- header: "Confirmar"
- options:
  - Aprobar (Escribir a CHANGELOG.md)
  - Editar (Quiero ajustar algo)
  - Cancelar

## Write to File

Insert new entry in CHANGELOG.md:

- After `## [Unreleased]`
- Before the previous version entry
- Clear `[Unreleased]` section

Update comparison links at bottom of file.

## Commit and Tag

!`git add CHANGELOG.md`
!`git commit -m "docs: update CHANGELOG for $1"`

If $ARGUMENTS does NOT contain "--no-tag":
!`git tag -a $1 -m "Release $1"`
!`git push origin HEAD --tags`

If GitHub CLI (gh) available:
Create GitHub Release with changelog entry as body.

## Report

```
/update-changelog $1 ✅

CHANGELOG.md updated: $1 ({YYYY-MM-DD})
Changes: {N} entries ({X} added, {Y} fixed, {Z} changed)
Commit: "docs: update CHANGELOG for $1"
Tag: $1 {created / skipped}
GitHub Release: {created / skipped}

Next: /advance-gate 7 (deploy to production)
```
