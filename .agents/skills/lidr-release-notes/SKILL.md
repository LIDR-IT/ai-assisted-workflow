---
name: lidr-release-notes
id: release-notes
version: "1.3.1"
last_updated: "2026-06-09"
updated_by: "TL: BMAD-coherence batch-fix"
status: active
phase: 8
owner_role: "DevOps"
automation: true
domain_agnostic: true
language_default: en
integrations: [vcs, tracking, docs, chat]
description: "AUTOMATED release notes generation with business impact analysis using Python automation. Auto-analyzes git history, PRs, and business impact to generate 2-level release notes (executive summary + technical changelog). Essential when preparing releases for production deployment. Use to transform 2+ hours of manual PR analysis into 5-minute automated workflow + 30-minute review. Orchestrated by /create-release-notes command. ALWAYS use when preparing a release to communicate changes to stakeholders."
---

# Release Notes Generator 🤖 AUTOMATED

Phase: 8 — Deployment | Gate: contributes to Gate 7
Output: English by default; artifact language follows the client `language` setting (see `_shared/lidr/integrations/`).
Tools resolve via the central registry `_shared/lidr/integrations/tool-registry.yaml`; the active client binds concrete tools in `clients/<CODE>.yaml`.
**ROI**: 50 hours/year (2+ hours manual → 5 minutes automated + 30 minutes review)

## Relationship to BMAD

LIDR-unique deployment artifact — no BMad equivalent. Canonical replacement for the deprecated `lidr-changelog-generator`; orchestrated by the `/lidr-create-release-notes` command.

## 🚀 Automation Workflow (RECOMMENDED)

### Phase 1: Git Analysis (2-3 minutes)

```bash
cd .claude/skills/release-notes/scripts
python git-analyzer.py --since-tag v1.2.0 --branch main --output-dir release-analysis
```

**Auto-discovers and analyzes**:

- Merged PRs since last release with {{VCS_TOOL}} CLI integration
- Conventional commit parsing and categorization
- Business impact extraction from PR descriptions
- Breaking changes and security update detection
- Contributor attribution and file impact analysis

**Generates**: `git-analysis.json` + human-readable report + CSV for project management

### Phase 2: Release Notes Generation (2-3 minutes)

```bash
python changelog-generator.py --input-dir release-analysis --output-dir release-notes --version 1.3.0
```

**Auto-generates comprehensive release notes**:

- Business impact classification with domain-specific patterns
- Executive summary for stakeholders (artifact language follows the client `language` setting)
- Technical changelog for engineering teams (English)
- Deployment guidance with migration steps
- Multi-format output (executive, technical, deployment guide)

**Generates**: Executive summary + technical changelog + deployment guide + CSV summary

### Phase 3: Human Review & Publication (30 minutes)

1. **Review executive summary** for business language accuracy
2. **Validate technical changelog** for completeness
3. **Customize deployment guidance** for specific infrastructure
4. **Add manual highlights** not captured by automation
5. **Publish to distribution channels** ({{DOCS_TOOL}}, {{CHAT_TOOL}}, email)
6. **Archive for future reference** and ROI tracking

### Expected Results

- **Dual-format release notes** with business and technical audiences
- **Business impact analysis** with domain-aware classification
- **Deployment guidance** with migration steps and rollback considerations
- **50 hours/year ROI** vs manual PR analysis and writing process

---

## Manual Workflow (Legacy - use only if automation unavailable)

1. Identify changes: PRs merged since last release tag
2. Classify by conventional commit prefix (feat, fix, refactor, security, BREAKING)
3. Enrich with {{TRACKING_TOOL}} context: ticket title, US, RF, component
4. Build traceability chain: PR → Ticket → US → RF → Business Case
5. Generate executive summary (business language)
6. Generate technical changelog (engineering language)

## Input

### 🤖 Automated Processing (Scripts Handle Discovery)

| Input                | Required | Auto-Discovered From                      | Processing                                     |
| -------------------- | -------- | ----------------------------------------- | ---------------------------------------------- |
| Git history          | ✅       | Git log, tags, PR merge commits           | **git-analyzer.py** parses and extracts        |
| PR metadata          | ✅       | {{VCS_TOOL}} CLI integration              | **git-analyzer.py** enriches with descriptions |
| Conventional commits | ✅       | Git commit message analysis               | **git-analyzer.py** categorizes changes        |
| Business impact      | ✅       | PR descriptions, domain-specific patterns | **changelog-generator.py** classifies impact   |
| Breaking changes     | ✅       | Commit analysis, BREAKING CHANGE markers  | **git-analyzer.py** detects patterns           |

### 📋 Manual Input (Legacy - if automation not available)

| Input                     | Required  | Source                                |
| ------------------------- | --------- | ------------------------------------- |
| Merged PRs since last tag | ✅        | Git: `git log v{prev}..HEAD --merges` |
| Tracking tickets linked   | ✅        | {{TRACKING_TOOL}} or PR references    |
| Conventional commits      | ✅        | Git log                               |
| Previous version tag      | ✅        | Git tags                              |
| Package.json diff         | Desirable | For dependency changes                |

## Output — Executive Summary (for PO, PM, Sponsors)

```markdown
# Release Notes v{version} — Executive Summary

**Date:** {today}
**Sprint:** {sprint name}

## What's New

{Bullet list in business language — value delivered to users}

## Problems Resolved

{Customer-facing bugs fixed — business language}

## Impact

- Users affected: {scope}
- New capabilities: {list}
- Performance improvements: {if any}

## Release Metrics

- Merged PRs: {N}
- Tickets resolved: {N}
- Contributors: {N}
```

## Output — Technical Changelog (for Dev, QA, DevOps)

```markdown
# Release Notes v{version} — Technical

## Changes by Type

### Features

- {description} ({ticket-id}) @{author}

### Bug Fixes

- {description} ({ticket-id}) @{author}

### Refactoring

### Security

### Breaking Changes (with migration notes!)

### Dependencies Updated ({package}: {old} → {new})

## Deployment Notes

- Migrations: {yes/no — list if yes}
- Config changes: {env vars added/changed}
- Feature flags: {flags to enable/disable}

## Full Changelog

[Compare: v{prev}...v{version}]({link})
```

## 🤖 Automation Scripts

### `scripts/git-analyzer.py` (600+ lines)

**Purpose**: Git history analysis and PR metadata extraction with business impact

**Key Features**:

- **Git History Parsing**: Auto-discovery of commits, PRs, and tags since last release
- **{{VCS_TOOL}} CLI Integration**: Rich PR metadata including descriptions, labels, authors
- **Conventional Commit Analysis**: Automatic categorization by commit type and breaking changes
- **Business Impact Extraction**: Parse PR descriptions for user-facing impact
- **Security Change Detection**: Auto-identify security updates and vulnerability fixes

**Output**:

- `git-analysis.json` (machine processing)
- `git-analysis-report.md` (human review)
- `git-changes-summary.csv` (project management integration)

### `scripts/changelog-generator.py` (600+ lines)

**Purpose**: Transform git analysis into comprehensive release notes with business impact

**Key Features**:

- **Business Impact Classification**: Domain-specific patterns for software projects
- **Dual-Format Generation**: Executive summary (client `language` setting) + technical changelog (English)
- **Deployment Guidance**: Migration steps, rollback considerations, testing requirements
- **Domain-Specific Patterns**: Algorithm improvements, compliance updates, integration enhancements
- **Multi-Audience Targeting**: Stakeholder, engineering, and DevOps-specific outputs

**Output**:

- `release-summary-{version}.md` (executive summary)
- `CHANGELOG-{version}.md` (technical changelog)
- `deployment-guide-{version}.md` (DevOps guidance)
- `release-summary-{version}.csv` (project management)

### Integration Pattern

```bash
# Full automation workflow
cd .claude/skills/release-notes/scripts

# Phase 1: Git Analysis (2-3 minutes)
python git-analyzer.py --since-tag v1.2.0 --branch main --output-dir release-analysis

# Phase 2: Release Notes Generation (2-3 minutes)
python changelog-generator.py --input-dir release-analysis --output-dir release-notes --version 1.3.0

# Result: Complete release notes ready for review and publication
```

### ROI Achievement

- **Before**: 2-3 hours manual PR analysis and writing
- **After**: 5 minutes automation + 30 minutes review and customization
- **Savings**: 1.5-2.5 hours per release
- **Annual ROI**: 50+ hours/year (based on release frequency)
- **Quality**: Consistent business impact analysis + dual-audience formatting

## Classification Rules

| Commit Prefix                | Changelog Section | Include?                   |
| ---------------------------- | ----------------- | -------------------------- |
| `feat:`                      | Added             | ✅ Always                  |
| `fix:`                       | Fixed             | ✅ Always                  |
| `perf:`                      | Changed           | ✅ Always                  |
| `security:`                  | Security          | ✅ Always                  |
| `BREAKING CHANGE:`           | Breaking Changes  | ✅ Always (prominent)      |
| `refactor:`                  | Changed           | ✅ If significant          |
| `docs:` / `test:` / `chore:` | Skip              | ❌ Unless --include-chores |

### 🤖 Automated Classification (via scripts)

**Business Impact Patterns** (processed by changelog-generator.py):

- **High Value Features**: New capabilities, domain enhancements, user-facing functionality
- **Algorithm Improvements**: {{ALGORITHM_IMPROVEMENTS}}
- **Compliance Updates**: {{COMPLIANCE_FRAMEWORKS}}
- **Security Enhancements**: Vulnerability fixes, encryption updates, access control
- **Performance**: Speed improvements, memory optimization, scalability

## Key Rules

- **Executive = business language**: "Improved onboarding flow" not "Refactored useAuth hook"
- **Technical = precise**: Include ticket IDs, author @mentions, migration details
- **Breaking changes are PROMINENT**: Always at top with migration steps
- **Dependency changes from package.json diff**: Note major version bumps
- **Deployment notes are critical**: Migrations, env vars, feature flags — DevOps needs these
- **Dual format**: Always generate BOTH executive and technical versions

## Quality Assurance

### Validation Script

This skill includes automated validation via `scripts/validate-examples.ts`:

```bash
# Validate skill examples and structure
npx tsx scripts/validate-examples.ts
```

**Validation includes:**

- Example completeness and correctness
- Release management and documentation compliance patterns
- Progressive disclosure adherence
- Resource organization standards

**When to use:**

- Before skill release/packaging
- In CI/CD pipeline (quality gates)
- After major example updates
- During skill maintenance cycles

**Integration with ecosystem:**

- Used by `bmad-eval-runner` for ecosystem validation
- Supports quality gates in SDLC workflow
- Provides consistent validation across all skills

## Changelog

| Version | Date       | Author                       | Changes                                                                                                                                                                       |
| ------- | ---------- | ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1.3.1   | 2026-06-09 | TL: BMAD-coherence batch-fix | Added Relationship to BMAD note (LIDR-unique; canonical replacement for deprecated lidr-changelog-generator)                                                                  |
| 1.3.0   | 2026-06-09 | TL: lang+tool agnostic       | Language to English-default-configurable; abstracted GitHub CLI / Jira / Confluence / Slack via tool-registry ({{VCS_TOOL}}, {{TRACKING_TOOL}}, {{DOCS_TOOL}}, {{CHAT_TOOL}}) |
