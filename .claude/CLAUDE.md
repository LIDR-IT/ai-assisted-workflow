# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Purpose

This is a **template-best-practices** project that serves as a reference implementation for configuring multi-agent AI development environments. It demonstrates how to set up and synchronize configurations across multiple AI agents (Cursor, Claude Code, Gemini CLI, Antigravity) using a centralized source-of-truth pattern.

## Quick Start Guides

New to the project? Start with these setup guides at the project root:

- **[SETUP_MCP.md](../SETUP_MCP.md)** - MCP server setup and Context7 integration
- **[SETUP_RULES.md](../SETUP_RULES.md)** - Rules synchronization system
- **[SETUP_SKILLS.md](../SETUP_SKILLS.md)** - Skills installation and usage
- **[SETUP_COMMANDS.md](../SETUP_COMMANDS.md)** - Creating custom slash commands
- **[SETUP_AGENTS.md](../SETUP_AGENTS.md)** - Developing custom agents

Each guide is ~100-120 lines with quick start instructions, examples, and links to comprehensive documentation.

## Architecture Overview

### Source of Truth Pattern

The project uses a centralized configuration approach where:
- **`.agents/`** - Master configuration directory for shared resources
  - `.agents/rules/` - Source of truth for all project rules
  - `.agents/skills/` - Source of truth for all agent skills
  - `.agents/mcp/` - Source of truth for MCP server configurations
- **Agent-specific directories** (`.cursor/`, `.claude/`, `.gemini/`, `.agent/`) contain either:
  - Symlinks pointing to `.agents/` (for rules and skills)
  - Generated configs (for MCP servers)

### Skills Architecture

Skills are modular packages that extend agent capabilities. Each skill lives in `.agents/skills/{skill-name}/` with:
- `SKILL.md` - Main instruction file with YAML frontmatter metadata
- `examples/` - Usage examples
- `references/` - Supporting documentation

**Active Skills:**
- `agent-development` - Creating custom agents
- `command-development` - Building CLI commands
- `find-skills` - Discovering available skills
- `hook-development` - Git hooks integration
- `mcp-integration` - MCP server setup
- `skill-creator` - Generating new skills
- `skill-development` - Skill development workflow

**Synchronization:** All agent-specific skill directories (`.cursor/skills/`, `.claude/skills/`, `.gemini/skills/`) are full directory symlinks to `.agents/skills/`. Antigravity uses selective symlinks in `.agent/skills/`.

### MCP Server Architecture

MCP (Model Context Protocol) servers extend agent capabilities with external tools. Configuration follows a generate-from-source pattern:

**Source:** `.agents/mcp/mcp-servers.json`
**Script:** `.agents/mcp/sync-mcp.sh`
**Generated configs:**
- `.cursor/mcp.json` (Cursor)
- `.claude/mcp.json` (Claude Code)
- `.gemini/settings.json` (Gemini CLI)
- `.gemini/mcp_config.json` (Antigravity reference only - actual config is global)

**Active MCP Server:**
- Context7 - Provides up-to-date documentation for frameworks/libraries

### Rules Architecture

Project rules define coding standards, workflows, and best practices. Rules are stored in `.agents/rules/` and synchronized via symlinks or copies.

**Core Rules:**
- `core-principles.md` - Project architecture and design decisions
- `code-style.md` - Coding conventions and formatting
- `documentation.md` - Documentation standards
- `git-workflow.md` - Git and version control conventions
- `testing.md` - Testing requirements and practices
- `use-context7.md` - Context7 MCP server usage

**Synchronization:**
- **Cursor/Claude/Gemini:** Full directory symlinks (`.cursor/rules → ../.agents/rules`)
- **Antigravity:** Files copied to `.agent/rules/` (platform limitation)
- **Script:** `.agents/rules/sync-rules.sh` - Synchronizes rules and skills across all platforms

## Common Commands

### Rules and Skills Management

```bash
# Sync rules and skills across all agents
./.agents/rules/sync-rules.sh

# Test sync without making changes
./.agents/rules/sync-rules.sh --dry-run

# Verify synchronization
ls -la .cursor/rules .cursor/skills
ls -la .claude/rules .claude/skills
ls -la .gemini/rules .gemini/skills
ls -la .agent/rules .agent/skills
```

### MCP Server Management

```bash
# Sync MCP configurations across all agents
./.agents/mcp/sync-mcp.sh

# Verify MCP servers for Claude Code
claude mcp list

# Verify MCP servers for Gemini CLI
gemini mcp list
```

### Adding New MCP Server

1. Edit `.agents/mcp/mcp-servers.json`
2. Add server config with platforms array: `["cursor", "claude", "gemini"]`
3. Run `./.agents/mcp/sync-mcp.sh`
4. Commit generated configs

**Note:** Antigravity does NOT support project-level MCP config. It requires manual configuration in `~/.gemini/antigravity/mcp_config.json` (see `docs/guides/mcp/ANTIGRAVITY_SETUP.md`).

### Working with Skills

Skills are automatically synchronized via symlinks. To add or modify:
1. Edit/create skill in `.agents/skills/{skill-name}/`
2. Changes automatically propagate to all agent directories (via symlinks)
3. Commit changes to `.agents/skills/`

### Working with Rules

Rules are synchronized via symlinks (Cursor/Claude/Gemini) or copies (Antigravity). To add or modify:
1. Edit/create rule in `.agents/rules/{rule-name}.md`
2. Changes automatically propagate to Cursor, Claude, Gemini (via symlinks)
3. For Antigravity, run `./.agents/rules/sync-rules.sh` to copy updated rules
4. Commit changes to `.agents/rules/`

## Important Constraints

### Antigravity Limitations

**MCP Servers:** Antigravity does NOT read project-level MCP configurations. The generated `.gemini/mcp_config.json` is reference-only. Actual configuration must be done manually in `~/.gemini/antigravity/mcp_config.json`.

**Skills:** Antigravity DOES support project-level skills via `.agent/skills/` selective symlinks.

**Rules:** Antigravity rules are copied to `.agent/rules/` (symlinks not fully supported). Re-run `.agents/rules/sync-rules.sh` after updating rules to propagate changes.

### Platform Support Matrix

| Platform | MCP Project | MCP Global | Skills Project | Rules Project |
|----------|-------------|------------|----------------|---------------|
| Cursor | ✅ | ✅ | ✅ Symlink | ✅ Symlink |
| Claude Code | ✅ | ✅ | ✅ Symlink | ✅ Symlink |
| Gemini CLI | ✅ | ✅ | ✅ Symlink | ✅ Symlink |
| Antigravity | ❌ Global only | ✅ | ✅ Selective | ✅ Copy |

## Documentation Structure

```
docs/
├── guidelines/              # Project-specific coding standards
│   ├── copywriting-guidelines.md
│   ├── react-native-guidelines.md
│   ├── web-design-guidelines.md
│   └── team-conventions/
│       ├── skills-management-guidelines.md
│       └── third-party-security-guidelines.md
├── guides/                  # How-to guides
│   └── mcp/
│       ├── ANTIGRAVITY_SETUP.md
│       ├── ANTIGRAVITY_LIMITATION.md
│       ├── VALIDATION.md
│       └── mcp-setup-guide.md
├── notes/                   # Research and comparisons
│   └── skills-installation-and-mcp-comparison.md
└── references/              # Technical documentation
    ├── agents/              # Agent system docs
    ├── claude-code/         # Claude Code specifics
    ├── commands/            # CLI commands
    ├── hooks/               # Git hooks
    ├── mcp/                 # MCP platform docs
    ├── rules/               # Rules system
    └── skills/              # Skills ecosystem

SETUP_MCP.md                 # Quick start for MCP setup
```

**Key docs to reference:**
- `SETUP_MCP.md` - Quick MCP setup instructions
- `docs/guides/mcp/ANTIGRAVITY_SETUP.md` - Antigravity manual setup
- `docs/guidelines/team-conventions/third-party-security-guidelines.md` - Security for third-party MCP/Skills
- `docs/notes/skills-installation-and-mcp-comparison.md` - Skills vs MCP comparison

## Environment Variables

```bash
# Optional but recommended for Context7 MCP server
export CONTEXT7_API_KEY="your-api-key"
```

Get free API key: https://context7.com/dashboard

## Key Design Decisions

1. **Centralized Source of Truth:** `.agents/` directory contains master configs that sync to agent-specific directories
2. **Symlinks for Skills:** One-way sync from `.agents/skills/` to all agent directories
3. **Generated MCP Configs:** Script-generated from source for consistency across platforms
4. **Platform Limitations:** Antigravity MCP requires global config; documented extensively to prevent confusion
5. **No GitHub Copilot/VS Code:** Removed from project scope; focuses on 4 platforms (Cursor, Claude Code, Gemini CLI, Antigravity)

## Security Notes

When adding third-party MCP servers or skills, consult:
- `docs/guidelines/team-conventions/third-party-security-guidelines.md`
- Only use official MCP servers from trusted sources (Claude Code, Cursor, Docker Hub verified)
- Never commit API keys or secrets (use environment variables)
