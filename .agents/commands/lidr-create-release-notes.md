---
description: Generate release notes from merged PRs
argument-hint: [version]
allowed-tools: Read, Write, Bash(git:*), mcp__jira, mcp__confluence, mcp__slack, AskUserQuestion
model: sonnet
---

<!--
COMMAND: create-release-notes
VERSION: 2.0.0
AUTHOR: SDLC Team
LAST UPDATED: 2025-03-05

PURPOSE:
Generates changelog at 2 levels (executive for business + technical for team)
from merged PRs since last release. Enriches with Jira context for traceability.

USAGE:
  /create-release-notes v1.2.0
  /create-release-notes      (auto-detects version)

ARGUMENTS:
  version: Semver version string (optional, auto-detects from tags)

RELATED COMMANDS:
  /update-changelog  - Persists notes to CHANGELOG.md
  /advance-gate 7    - Deploy gate that checks release notes exist

CHANGELOG:
  v2.0.0 (2025-03-05): Rewritten to official command format
  v1.0.0 (2025-02-15): Initial version
-->

# Generate Release Notes

> **Relationship (de-duplication):** Release-notes content generation is owned by the **`lidr-release-notes`** skill (the reusable engine that owns the note format). This command is the thin orchestrator: scan merged PRs since the last tag, enrich with tracking context, invoke `lidr-release-notes` for the document, then publish. Pairs with `/lidr-update-changelog` (which writes CHANGELOG.md + git tag).

Load: @../rules/org.md and @../rules/project.md

## Identify Changes

Last release tag: !`git describe --tags --abbrev=0 2>/dev/null || echo "none"`
Current HEAD: !`git rev-parse --short HEAD`

If no previous tag:
Use first commit as baseline.

PRs merged since last tag: !`git log {last-tag}..HEAD --merges --oneline`
Commits since last tag: !`git log {last-tag}..HEAD --oneline --no-merges | wc -l`

If 0 changes:
❌ No changes since last release tag.
Exit.

## Determine Version

If "$1" is provided: use $1 as version.
If not provided:
Analyze changes to suggest version:

- If breaking changes detected → suggest major bump
- If new features → suggest minor bump
- If only fixes → suggest patch bump

Use AskUserQuestion:

- question: "¿Qué versión asignar a este release?"
- header: "Versión"
- options:
  - {suggested version} (Recomendado basado en cambios)
  - {alternative} (Override manual)

## Enrich with Jira Context

For each merged PR:

- Extract ticket ID from PR title/branch name
- Jira MCP: GET /issue/{ticket-id}
- Get: title, type (feat/fix), User Story, RF, component
- Build traceability chain: PR → Ticket → US → RF → BC

## Generate Executive Release Notes

For business stakeholders (PME, PO, Sponsors):

```markdown
# Release Notes v{version} — Executive Summary

**Date:** {today}
**Sprint:** {sprint name}

## What's New

{Bullet list in business language — what value is delivered}

## Issues Resolved

{Customer-facing bugs fixed}

## Impact

- Users affected: {scope}
- New capabilities: {list}
- Performance improvements: {if any}

## Metrics

- PRs merged: {N}
- Tickets resolved: {N}
- Contributors: {N}
```

## Generate Technical Release Notes

For engineering team (Dev, QA, DevOps):

```markdown
# Release Notes v{version} — Technical

## Changes by Type

### Features

{for each feat PR: - {description} ({ticket-id}) @{author}}

### Bug Fixes

{for each fix PR: - {description} ({ticket-id}) @{author}}

### Refactoring

{for each refactor PR}

### Security

{security-related changes}

### Breaking Changes

{breaking changes with migration notes}

### Dependencies Updated

{package changes from package.json diff}

## Deployment Notes

- Migrations: {yes/no — list if yes}
- Config changes: {env vars added/changed}
- Feature flags: {flags to enable/disable}

## Full Changelog

{link to compare: last-tag...v{version}}
```

## Publish

If Confluence MCP available:
Publish both versions to Confluence space.

If Slack MCP available:
Post executive summary to #releases channel.
Post technical summary to #engineering channel.

Save locally: `.claude/releases/v{version}-release-notes.local.md`

## Report

```
/create-release-notes v{version} ✅

Version: v{version}
Changes: {N} PRs, {N} tickets
  - Features: {N}
  - Fixes: {N}
  - Breaking: {N}

Published to: {Confluence / local file}
Notified: {Slack channels / manual}

Next: /update-changelog v{version}
```
