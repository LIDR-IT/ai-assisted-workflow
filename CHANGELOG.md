# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added

- **Antigravity Native `.agents/` Detection** — Antigravity now reads rules, skills, and commands directly from `.agents/` without requiring a separate `.agent/` directory with symlinks
- `.agents/workflows` internal symlink (`workflows → commands`) bridges the Antigravity naming convention

### Changed

- Sync scripts log native Antigravity support and automatically clean up legacy `.agent/` symlinks
- All documentation (~30 files) updated to reflect native `.agents/` detection pattern

### Removed

- `.agent/` directory and its symlinks (`rules`, `skills`, `workflows`) no longer created by sync scripts

## [0.5.0] - 2026-02-19

### Added

- **PRD Documentation System** — Comprehensive Product Requirements Document templates and structure for planning features

### Changed

- Simplified the `/create-ticket` command workflow
- Extended agent tool hook matchers to include read operations

## [0.4.0] - 2026-02-03

### Added

- **Cross-Platform Hooks System** — AI-powered hooks for auto-formatting, secret protection, and notifications across Claude Code, Gemini CLI, and Cursor
  - `auto-format.sh` — Automatically formats files with Prettier after AI edits
  - `protect-secrets.sh` — Blocks commits containing API keys, tokens, or credentials
  - `notify.sh` — Sends notifications for important tool events
- **Husky + lint-staged** — Guaranteed pre-commit formatting as a safety net alongside AI hooks
- `/test-hooks` command for interactive hook testing across platforms
- Post-merge and pre-push git hooks for automation

### Changed

- Hook paths now use `CLAUDE_PROJECT_DIR` for reliable absolute path resolution
- Auto-format enabled for Cursor as a "nice to have" (Husky handles the guarantee)

### Fixed

- Hook script paths resolved correctly regardless of working directory

## [0.3.0] - 2026-02-02

### Added

- **VitePress Custom Theme** — Gold brand color system with full light/dark mode support using `oklch()` color format
- **Playwright MCP Integration** — Browser automation available as an MCP tool for testing
- **Ticket Management System** — Folder-based ticket structure with `/create-ticket` and `/enrich-ticket` commands
- **AI Workflow System** — Product rules and ticket automation for structured development
- Orchestrator architecture with subagents and doc-improver autonomous agent

### Changed

- Antigravity rules changed from copy strategy to full symlink
- Antigravity skills changed from selective symlinks to full directory symlink
- Cursor rules converted to `.mdc` format (required by platform)
- YAML frontmatter added to all core rules for cross-platform compatibility
- YAML validation integrated into `sync-rules.sh`
- Rules organized into categorized subdirectories (code, content, design, frameworks, process, quality, team, tools)
- Gemini CLI now generates `GEMINI.md` index file (workaround for no native rules support)
- Documentation consolidated from 482 to 287 files (40% reduction)

### Fixed

- Antigravity rules structure flattened (platform doesn't support subdirectories in rules)
- Automatic backslash escaping for TOML conversion (Gemini commands)
- Triple backticks removed from TOML conversion to prevent parsing errors

## [0.2.0] - 2026-02-01

### Added

- **Slash Commands** — `/commit` for conventional commits, `/improve-docs` for documentation auditing, `/sync-setup` for configuration sync
- **Skills System** — commit-management, team-skill-creator, and skill discovery with progressive disclosure pattern
- **Doc-improver Subagent** — Autonomous documentation auditor following project standards
- Cross-platform AI agents and commands with full synchronization
- YAML frontmatter format guide and migration tool
- Rules best practices with 12,000 character limit enforcement

### Changed

- Documentation consolidated: SETUP files merged into single guide (6 → 1), modules merged into reference indices (71 → 2)
- Guidelines migrated to `.agents/rules/` for centralized sync
- Spanish documentation duplicate removed (125 files)

## [0.1.0] - 2026-01-31

### Added

- **Multi-Agent Development Environment** — Initial setup supporting Cursor, Claude Code, Gemini CLI, Antigravity, and GitHub Copilot (VSCode) from a single `.agents/` source of truth
- **Unified Symlink Architecture** — Modular sync scripts distributing rules, skills, and commands across all platforms
- **Automatic `.md` → `.toml` Conversion** — Gemini CLI command compatibility
- **Context7 MCP Integration** — Up-to-date library documentation via Model Context Protocol
- 14 rules across 8 categories (code, content, design, frameworks, process, quality, team, tools)
- Team-skill-creator meta-skill for component creation
- Comprehensive command platform differences documentation
