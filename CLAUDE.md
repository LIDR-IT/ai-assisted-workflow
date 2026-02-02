# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **multi-agent AI configuration template** demonstrating centralized management of AI development environments across 4 platforms: Cursor, Claude Code, Gemini CLI, and Antigravity. The core architecture uses a "source of truth" pattern with automated synchronization scripts.

## Essential Commands

### Documentation

```bash
# Start VitePress dev server
npm run docs:dev

# Build documentation
npm run docs:build

# Preview built documentation
npm run docs:preview
```

### Synchronization

```bash
# Sync all configurations (rules, skills, commands, agents, MCP)
./.agents/sync-all.sh

# Sync only rules and skills
./.agents/rules/sync-rules.sh

# Sync only MCP configurations
./.agents/mcp/sync-mcp.sh

# Dry run (preview without applying)
./.agents/rules/sync-rules.sh --dry-run
./.agents/mcp/sync-mcp.sh --dry-run
```

### Verification

```bash
# Verify symlinks are correct
readlink .cursor/rules    # Should: ../.agents/rules
readlink .claude/rules    # Should: ../.agents/rules
readlink .gemini/rules    # Should: ../.agents/rules

# Check generated MCP configs
jq . .cursor/mcp.json
jq . .claude/mcp.json
jq . .gemini/settings.json

# Validate JSON files
jq empty .agents/mcp/mcp-servers.json
```

## Architecture & Design Decisions

### Centralized Source-of-Truth Pattern

All AI agent configurations live in `.agents/` and are synchronized to platform-specific directories:

- **`.agents/rules/`** - Project rules (coding standards, guidelines)
- **`.agents/skills/`** - Agent skills (reusable capabilities)
- **`.agents/commands/`** - Slash commands (workflow automation)
- **`.agents/agents/`** - Subagents (specialized assistants)
- **`.agents/mcp/`** - MCP server configurations (external tool integrations)

### Synchronization Strategies

**Symlinks (Preferred):**
- Used for: Skills, Commands, Agents
- Platforms: Cursor, Claude Code, Gemini CLI, Antigravity
- Advantage: Changes propagate instantly, zero duplication
- Note: Antigravity does NOT support `.agents/agents/` directory

**Symlinks (Rules - Selective):**
- Used for: Rules distribution
- Platforms: Claude Code, Antigravity ONLY
- Note: Cursor requires copy/conversion (see below)

**Script Generation:**
- Used for: MCP configurations, Gemini rules index
- Scripts: `sync-mcp.sh`, `sync-rules.sh`
- Why: Each platform requires different JSON structure/format

**Copy + Convert (Cursor Limitation):**
- Used for: Cursor rules only
- Process: `.md` → `.mdc`, flattened structure (no subdirectories)
- Triggered by: `sync-rules.sh`

### Platform Support Matrix

| Component | Cursor | Claude Code | Gemini CLI | Antigravity |
|-----------|--------|-------------|------------|-------------|
| Rules | ✅ Copy (.mdc) | ✅ Symlink | ❌ Index only | ✅ Symlink |
| Skills | ✅ Symlink | ✅ Symlink | ✅ Symlink | ✅ Symlink |
| Commands | ✅ Symlink (.md) | ✅ Symlink (.md) | ✅ Generated (.toml) | ✅ Symlink (as workflows) |
| Agents | ✅ Symlink | ✅ Symlink | ✅ Symlink | ❌ Not supported |
| MCP (Project) | ✅ Generated | ✅ Generated | ✅ Generated | ❌ Global only |

**Key Details:**
- **Gemini Commands:** Auto-converted `.md` → `.toml` (Gemini requires TOML format, not symlinks)
- **Antigravity Commands:** Directory symlink `.agent/workflows` → `.agents/commands` (single symlink for all commands)
- **Visual Note:** File explorers display symlinks as regular directories (this is normal behavior)

## Critical Workflows

### Adding a New Rule

```bash
# 1. Create rule file in categorized subdirectory
vim .agents/rules/category/new-rule.md

# 2. Use universal YAML frontmatter (all platforms)
---
name: new-rule                    # Cursor
description: Brief description    # All platforms
alwaysApply: false                # Cursor
globs: ["**/*.ts"]               # Cursor
argument-hint: <file-pattern>     # Claude/Gemini
paths: ["src/**/*.ts"]           # Claude
trigger: always_on                # Antigravity
---

# 3. Keep under 12,000 characters
wc -c .agents/rules/category/new-rule.md

# 4. Run sync
./.agents/rules/sync-rules.sh

# 5. Verify
ls -la .cursor/rules/new-rule.mdc  # Cursor (converted)
cat .claude/rules/category/new-rule.md  # Claude (symlink)
```

### Adding an MCP Server

```bash
# 1. Edit source configuration
vim .agents/mcp/mcp-servers.json

# Add server entry:
{
  "servers": {
    "my-server": {
      "platforms": ["cursor", "claude", "gemini"],
      "description": "Server description",
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "package-name"],
      "env": {
        "API_KEY": "${ENV_VAR_NAME}"
      }
    }
  }
}

# 2. Validate JSON
jq empty .agents/mcp/mcp-servers.json

# 3. Generate platform configs
./.agents/mcp/sync-mcp.sh

# 4. Commit BOTH source and generated files
git add .agents/mcp/mcp-servers.json
git add .cursor/mcp.json .claude/mcp.json .gemini/settings.json
git commit -m "feat: Add my-server MCP integration"
```

### Creating a Skill/Command/Agent

Use the `/sync-setup` command which runs `.agents/sync-all.sh` to synchronize after creation.

See `.agents/skills/team-skill-creator/` for templates and validation scripts.

## Important Constraints

### Antigravity Limitations

1. **No project-level MCP:** Must configure MCP servers globally at `~/.gemini/antigravity/mcp_config.json`
2. **No `.agents/agents/` support:** Cannot use subagents directory
3. **Requires reload:** After sync, close and reopen project for rules to refresh (caching issue)

### Cursor Limitations

1. **No rule subdirectories:** Rules must be flattened to `.cursor/rules/`
2. **Requires .mdc extension:** Sync script auto-converts `.md` → `.mdc`
3. **No symlinks for rules:** Must copy files (handled by sync script)

### Gemini CLI Limitations

1. **No native rules support:** Uses generated index file at `.gemini/GEMINI.md`
2. **Index regenerated on sync:** Don't manually edit `GEMINI.md`
3. **Commands require TOML format:**
   - Cannot use `.md` files directly
   - `sync-commands.sh` auto-converts `.md` → `.toml`
   - Generated files in `.gemini/commands/` (not symlinks)
   - Conversion happens automatically on every sync

## File Organization Principles

### Rules Structure

```
.agents/rules/
├── code/              # Code style and principles
├── content/           # Copywriting and content guidelines
├── design/            # Design and UI standards
├── frameworks/        # Framework-specific patterns
├── process/           # Workflows and processes
├── quality/           # Testing and quality standards
├── team/              # Team conventions and policies
└── tools/             # Tool usage and configuration
```

**One topic per file, max 12,000 characters per rule.**

### Skills Structure

```
.agents/skills/
└── skill-name/
    ├── SKILL.md              # Main skill content
    ├── examples/             # Usage examples
    └── references/           # Deep-dive documentation
```

**Use progressive disclosure: SKILL.md for essentials, references/ for details.**

## Key Synchronization Behavior

### After Editing Rules

1. Run `./agents/rules/sync-rules.sh`
2. Cursor: Rules copied and converted to `.mdc`
3. Claude/Antigravity: Instant via symlinks
4. Gemini: `GEMINI.md` index regenerated

### After Editing MCP Config

1. Run `./.agents/mcp/sync-mcp.sh`
2. Platform-specific JSONs regenerated
3. Must restart Claude Code/Cursor to detect changes
4. Antigravity: Configure globally, not in project

### After Creating Skill/Command/Agent

1. Run `./.agents/sync-all.sh` (or use `/sync-setup` command)
2. Symlinks created automatically for supported platforms
3. Gemini commands auto-converted to `.toml` format
4. Verify with `ls -la .cursor/skills .claude/skills .gemini/skills`

**Command Sync Behavior:**
- **Cursor/Claude/Antigravity:** Symlinks to `.agents/commands/` (instant sync)
- **Gemini CLI:** Conversion `.md` → `.toml` (regenerated on sync)

## YAML Frontmatter Requirements

All rules must include universal YAML frontmatter supporting all platforms:

```yaml
---
name: rule-name                      # Cursor only
description: Brief description       # All platforms
alwaysApply: false                   # Cursor only (optional)
globs: ["**/*.ext"]                 # Cursor only (optional)
argument-hint: <file-pattern>        # Claude/Gemini (optional)
paths: ["src/**/*.ext"]             # Claude only (optional)
trigger: always_on                   # Antigravity only (optional)
---
```

**Never create platform-specific rule files.** Use one file with all fields.

## Git Workflow

### Committing Sync Changes

**When changing rules/skills (symlinked):**
```bash
# Only commit source
git add .agents/rules/my-rule.md
git commit -m "docs: Add my-rule for code standards"
```

**When changing MCP configs (generated):**
```bash
# Commit BOTH source and generated
git add .agents/mcp/mcp-servers.json
git add .cursor/mcp.json .claude/mcp.json .gemini/settings.json
git commit -m "feat: Add new MCP server"
```

### Commit Message Format

Use conventional commits:
- `feat:` New feature or functionality
- `fix:` Bug fix
- `docs:` Documentation changes
- `refactor:` Code restructuring
- `chore:` Maintenance (dependencies, configs)

## Troubleshooting

### Changes Not Propagating

**Cursor rules:**
```bash
# Re-run sync (rules are copied)
./.agents/rules/sync-rules.sh
```

**Claude/Gemini/Antigravity:**
```bash
# Check symlink target
readlink .claude/rules
# Should point to: ../.agents/rules
```

**Antigravity specifically:**
```bash
# Close and reopen project (rules are cached)
```

### Symlink Issues

```bash
# Verify if path is a symlink (look for "l" prefix)
ls -ld .agent/workflows
# lrwxr-xr-x = symlink ✅
# drwxr-xr-x = directory ❌

# Check symlink target
readlink .agent/workflows
# Should show: ../.agents/commands

# Verify source exists
ls -la .agents/rules .agents/skills .agents/commands

# Recreate manually if needed
ln -s ../.agents/rules .claude/rules
ln -s ../.agents/skills .cursor/skills
ln -s ../.agents/commands .agent/workflows
```

**Note:** File explorers (VS Code, Finder) display symlinks as regular directories. Use terminal `ls -l` to verify symlinks.

### MCP Not Working

**Cursor/Claude/Gemini:**
```bash
# Regenerate configs
./.agents/mcp/sync-mcp.sh

# Validate JSON
jq empty .cursor/mcp.json
jq empty .claude/mcp.json
```

**Antigravity:**
```bash
# Check GLOBAL config (project-level not supported)
cat ~/.gemini/antigravity/mcp_config.json
```

## Documentation System

VitePress-powered documentation with bilingual support (EN/ES). Configuration lives in `docs/.vitepress/config.js`.

**Structure:**
- `docs/en/` - English documentation
- `docs/es/` - Spanish documentation (WIP)
- Modules organized by concept (Skills, MCP, etc.)
- Cross-referenced guides and references

## References

- Platform limitations: `docs/guides/mcp/ANTIGRAVITY_LIMITATION.md`
- Rules guide: `.agents/rules/README.md`
- Core principles: `.agents/rules/code/principles.md`
- Skills management: `.agents/rules/team/skills-management.md`
