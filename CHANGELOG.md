# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

_No unreleased changes._

## [0.7.1] - 2026-02-20

### Changed

- **Gemini CLI: Native skills/agents detection** — Removed symlinks to `.gemini/skills` and `.gemini/agents`; Gemini CLI reads directly from `.agents/skills/` and `.agents/subagents/` natively (symlinks caused "Skill conflict detected" warnings)
- **Copilot (VSCode): Native skills detection** — Removed symlink to `.github/skills`; VSCode/Copilot reads directly from `.agents/skills/` natively (symlink caused duplicate skill detection)
- Copilot prompts: Replaced deprecated `mode: agent` with `agent: 'agent'` in `.prompt.md` frontmatter
- Platform adapters now include stale symlink cleanup logic (auto-removes old symlinks on sync)
- `platforms.json` updated with `"native"` strategy for Gemini skills/agents and Copilot skills
- Orchestrator documentation updated with native detection strategy and cross-platform memory architecture

### Fixed

- **Frontmatter parser** (`extract_field`) now only reads the first YAML `---` block, preventing false matches from `---` delimiters inside code examples in the document body
- **Double frontmatter** in `web-design.md` merged into single block (was causing corrupted `.instructions.md` output)
- Added `.github/`, `.gemini/`, `.cursor/rules/` to `.prettierignore` — Prettier was reformatting YAML frontmatter in generated platform files, breaking properties with line breaks

## [0.7.0] - 2026-02-20

### Added

- **Unified Sync CLI** (`sync.sh`) — Single entry point replacing 8 individual scripts with powerful filtering:
  - `--platform=copilot,cursor` — Sync only specific platforms
  - `--only=rules,mcp` — Sync only specific components
  - `--dry-run` — Preview changes without applying
  - `--verbose` — Debug output for troubleshooting
  - `--help` — Full usage documentation
- **Adapter-Plugin Architecture** — SOLID-principled sync system:
  - `adapters/` — Platform-specific adapters (cursor, claude, gemini, copilot, antigravity)
  - `sync/` — Component orchestrators (rules, skills, commands, agents, mcp, hooks)
  - `lib/` — Shared libraries (core.sh, symlink.sh, frontmatter.sh, registry.sh)
  - `platforms.json` — Central registry of platform capabilities
- **Dynamic Dispatch** — Orchestrators discover adapter functions via `{platform}_{component}()` convention
- **Platform Registry** — JSON-driven platform definitions; adding a new platform requires only 1 adapter file + 1 registry entry (previously required modifying 7+ files)

### Changed

- Sync system reduced from 2,456 lines (8 scripts) to ~2,100 lines (18 files) with zero code duplication
- All 60+ documentation files updated to reference new unified `sync.sh` CLI
- README.md updated with new architecture, commands, and directory structure
- Skills references (sync-system.md, architecture-overview.md) rewritten for new architecture
- Platform configs regenerated via new sync system

### Removed

- `sync-all.sh` — Replaced by `sync.sh`
- `rules/sync-rules.sh` — Replaced by `sync.sh --only=rules`
- `skills/sync-skills.sh` — Replaced by `sync.sh --only=skills`
- `commands/sync-commands.sh` — Replaced by `sync.sh --only=commands`
- `subagents/sync-agents.sh` — Replaced by `sync.sh --only=agents`
- `mcp/sync-mcp.sh` — Replaced by `sync.sh --only=mcp`
- `hooks/sync-hooks.sh` — Replaced by `sync.sh --only=hooks`
- `orchestrator/sync-orchestrator.sh` — Replaced by `sync.sh --only=orchestrator`
- 200+ lines of duplicated code (4 copies of `create_symlink()`, 4 YAML parser implementations)

### Fixed

- Corrected 70 references to non-existent `.agents/agents/` directory (now `.agents/subagents/`)
- Updated outdated component counts across README.md and AGENTS.md (rules: 14→17, skills: 9→12, commands: 3→7, subagents: 1→3)
- Fixed broken documentation link `.agents/agent-readme.md` → `.agents/subagent-readme.md`
- Fixed 10+ broken `docs/guides/` paths → `docs/en/guides/` (missing `/en/` segment)
- Fixed broken links to non-existent `sync-system.md` in setup guide and MCP reference
- Fixed inconsistent environment variable reference (`CLAUDE_PROJECT_DIR` → `CLAUDE_PLUGIN_ROOT`)

### Migration

| Old Command                             | New Command                              |
| --------------------------------------- | ---------------------------------------- |
| `.agents/sync-all.sh`                   | `.agents/sync.sh`                        |
| `.agents/rules/sync-rules.sh`           | `.agents/sync.sh --only=rules`           |
| `.agents/mcp/sync-mcp.sh`               | `.agents/sync.sh --only=mcp`             |
| `.agents/hooks/sync-hooks.sh`           | `.agents/sync.sh --only=hooks`           |
| `.agents/rules/sync-rules.sh --dry-run` | `.agents/sync.sh --only=rules --dry-run` |

## [0.6.0] - 2026-02-20

### Added

- **GitHub Copilot (VSCode) as 5th Supported Platform** — Full integration with automated sync across all components:
  - Rules: Copy+rename to `.github/rules/*.instructions.md` with frontmatter transformation (`globs` → `applyTo`)
  - Commands: Copy+rename to `.github/prompts/*.prompt.md` (`$ARGUMENTS` → `{{{ input }}}`)
  - Agents: Copy+rename to `.github/agents/*.agent.md` with `tools` field injection
  - Skills: Symlink `.github/skills` → `../.agents/skills`
  - MCP: Generated `.vscode/mcp.json` with `servers` key and `${env:VAR}` syntax
  - Hooks: Symlink scripts + generated `.github/hooks/hooks.json` (camelCase events)
  - Index: Auto-generated `.github/copilot-instructions.md` with project overview and rules summary
- **Changelog Generator Skill** — Reusable skill for generating user-friendly changelogs from git commit history
- **Antigravity Native `.agents/` Detection** — Antigravity now reads rules, skills, and commands directly from `.agents/` without requiring a separate `.agent/` directory

### Changed

- All 7 sync scripts updated with `sync_copilot()` functions (sync-rules, sync-skills, sync-commands, sync-agents, sync-mcp, sync-hooks, sync-all)
- `mcp-servers.json` and `hooks.json` sources now include `"copilot"` in platform arrays
- All documentation (~40 files) updated to reference 5 platforms instead of 4
- Platform Support Matrix expanded across README, AGENTS.md, SKILL.md, and 10+ reference docs
- `sync-all.sh` summary now includes Copilot verification commands

### Removed

- `.agent/` directory and its symlinks no longer created by sync scripts (Antigravity reads natively from `.agents/`)

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
