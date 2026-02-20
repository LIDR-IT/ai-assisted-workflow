---
title: Setup Guide
description: Complete setup guide for the AI agent synchronization framework
category: guide
platforms: [claude-code, cursor, gemini-cli, antigravity]
---

# Setup Guide

> Part of [Template Best Practices](/) - AI Agent Synchronization Framework

This guide walks through setting up the centralized AI agent configuration system that synchronizes rules, skills, commands, agents, and MCP servers across Claude Code, Cursor, Gemini CLI, and Antigravity.

## Quick Start

**One-command setup:**

```bash
# Clone and sync everything
git clone <repo-url>
cd template-best-practices
./.agents/sync.sh
```

This runs all synchronization scripts:

- Rules and skills → symlinks to `.agents/`
- Commands → symlinks to `.agents/commands/`
- Agents → symlinks to `.agents/subagents/`
- MCP configs → platform-specific JSON generation

## Prerequisites

- **Git** - Version control
- **One or more AI platforms:**
  - [Claude Code](https://code.claude.com) (recommended)
  - [Cursor](https://cursor.com)
  - [Gemini CLI](https://geminicli.com)
  - [Antigravity](https://antigravity.dev)
- **jq** - JSON processor for MCP sync

  ```bash
  # macOS
  brew install jq

  # Ubuntu/Debian
  sudo apt-get install jq
  ```

## Architecture Overview

### Centralized Source of Truth

```
.agents/                    # Source of truth
├── rules/                  # Project rules and standards
├── skills/                 # Reusable agent skills
├── commands/               # Slash commands
├── agents/                 # Custom subagents
├── mcp/                    # MCP server configurations
└── sync.sh                # Unified sync CLI
```

### Platform Synchronization

**Symlink Strategy** (Rules, Skills, Commands, Agents):

```
.cursor/rules → ../.agents/rules
.claude/rules → ../.agents/rules
.gemini/rules → ../.agents/rules
```

**Generation Strategy** (MCP Configs):

```
.agents/mcp/mcp-servers.json
    ↓ (sync.sh --only=mcp)
.cursor/mcp.json
.claude/mcp.json
.gemini/settings.json
```

**Copy Strategy** (Cursor - no subdirectory support):

```
.agents/rules/ → .cursor/rules/  (copied, flattened)
```

**Native Detection** (Antigravity - reads directly from `.agents/`):

```
.agents/rules/   → native detection (no copy needed)
.agents/skills/  → native detection (no symlink needed)
```

## Individual Setup Sections

### 1. Rules Setup

**What are rules?**
Project-specific guidelines and coding standards synchronized to all agents.

**Setup:**

```bash
# Automatic
./.agents/sync.sh --only=rules

# Manual verification
ls -la .cursor/rules    # Should show symlink
ls -la .claude/rules    # Should show symlink
ls -la .agents/rules    # Gemini CLI reads natively from .agents/
ls -la .agents/rules    # Antigravity reads natively from .agents/
```

**Current rules structure:**

```
.agents/rules/
├── code/              # principles.md, style.md
├── content/           # copywriting.md
├── design/            # web-design.md
├── frameworks/        # react-native.md
├── process/           # documentation.md, git-workflow.md
├── quality/           # testing.md
├── team/              # skills-management.md, third-party-security.md
└── tools/             # use-context7.md, claude-code-extensions.md
```

**Adding new rules:**

```bash
# Create rule
echo "# New Rule" > .agents/rules/category/new-rule.md

# Sync to all agents
./.agents/sync.sh --only=rules

# Verify
cat .cursor/rules/category/new-rule.md
```

### 2. Skills Setup

**What are skills?**
Specialized capabilities that extend agent functionality with workflows and domain knowledge.

**Setup:**

```bash
# Automatic (included in sync.sh)
./.agents/sync.sh --only=skills

# Verify
ls -la .cursor/skills
ls -la .claude/skills
ls -la .agents/skills    # Gemini CLI and Copilot read natively from .agents/
```

**Current skills:**

- `agent-development` - Create custom agents
- `command-development` - Create slash commands
- `commit-management` - Git commit workflows
- `find-skills` - Discover new skills
- `hook-development` - Create event hooks
- `mcp-integration` - Add MCP servers
- `skill-creator` - Create new skills
- `team-skill-creator` - Team-wide skill creation

**Using skills:**

```bash
# Invoke skill
claude /skill-name

# List available skills
claude skill list

# Find new skills
claude /find-skills
```

**Creating skills:**

```bash
# Use team skill creator
claude /team-skill-creator

# Or manually
mkdir -p .agents/skills/my-skill
cat > .agents/skills/my-skill/skill.md << 'EOF'
---
name: my-skill
description: When to use this skill
---
# My Skill
Instructions here.
EOF

./.agents/sync.sh --only=skills
```

### 3. Commands Setup

**What are commands?**
Slash commands that provide quick access to common operations.

**Setup:**

```bash
# Commands sync
./.agents/sync.sh --only=commands

# Verify
ls -la .cursor/commands
ls -la .claude/commands
```

**Current commands:**

- `/commit` - Create conventional commits
- `/improve-docs` - Audit documentation
- `/sync-setup` - Sync all configurations

**Creating commands:**

```bash
# Use command-development skill
claude /command-development

# Or manually
cat > .agents/commands/my-command.md << 'EOF'
---
name: my-command
args: [arg1, arg2]
---
# Command implementation
EOF

./.agents/sync.sh --only=commands
```

### 4. Agents Setup

**What are agents?**
Custom subagents with specialized system prompts and tool access.

**Setup:**

```bash
# Agents sync
./.agents/sync.sh --only=agents

# Verify
ls -la .cursor/agents
ls -la .claude/agents
```

**Note:** Antigravity does NOT support the agents directory.

**Current agents:**

- `doc-improver` - Documentation improvement specialist

**Creating agents:**

```bash
# Use agent-development skill
claude /agent-development

# Or manually
cat > .agents/subagents/my-agent.md << 'EOF'
---
name: my-agent
description: When to trigger this agent with examples
tools: ["Read", "Write", "Bash"]
---
System prompt for the agent.
EOF

./.agents/sync.sh --only=agents
```

### 5. MCP Setup

**What is MCP?**
Model Context Protocol - connects agents to external tools and services.

**Setup:**

```bash
# Generate platform configs
./.agents/sync.sh --only=mcp

# Verify
cat .cursor/mcp.json
cat .claude/mcp.json
cat .gemini/settings.json
```

**Current MCP servers:**

- **Context7** - Documentation and code examples

**Adding MCP servers:**

```bash
# Edit source of truth
vim .agents/mcp/mcp-servers.json

# Add server entry
{
  "servers": {
    "server-name": {
      "platforms": ["cursor", "claude", "gemini"],
      "command": "npx",
      "args": ["-y", "package-name"],
      "env": {
        "API_KEY": "${ENV_VARIABLE}"
      }
    }
  }
}

# Generate configs
./.agents/sync.sh --only=mcp

# Commit both source and generated
git add .agents/mcp/mcp-servers.json
git add .cursor/mcp.json .claude/mcp.json .gemini/settings.json
git commit -m "feat: Add new MCP server"
```

**Testing MCP:**

```bash
# Claude Code
claude mcp list
claude mcp test context7

# Using MCP Inspector
npx @modelcontextprotocol/inspector npx -y @context7/mcp-server
```

## Platform-Specific Instructions

### Claude Code

**Installation:**

```bash
# Install CLI
npm install -g @anthropic/claude-code

# Verify
claude --version
```

**Configuration:**

- Rules: `.claude/rules/` (symlink)
- Skills: `.claude/skills/` (symlink)
- MCP: `.claude/mcp.json` (generated)

**Verify setup:**

```bash
claude skill list
claude mcp list
ls -la .claude/
```

### Cursor

**Installation:**
Download from [cursor.com](https://cursor.com)

**Configuration:**

- Rules: `.cursor/rules/` (copied files, flattened - no subdirectories)
- Skills: `.cursor/skills/` (symlink)
- MCP: `.cursor/mcp.json` (generated)

**Verify setup:**

1. Open Cursor
2. Check Settings → Features → MCP Servers
3. Verify skills appear in command palette

### Gemini CLI

**Installation:**

```bash
npm install -g gemini-cli

# Verify
gemini --version
```

**Configuration:**

- Rules: `.agents/rules/` (native detection - no symlink needed)
- Skills: `.agents/skills/` (native detection - no symlink needed)
- MCP: `~/.gemini/settings.json` (generated)

**Verify setup:**

```bash
gemini mcp list
gemini skill list
```

### Antigravity

**Installation:**
Follow [Antigravity documentation](https://antigravity.dev/docs)

**Configuration:**

- Rules: `.agents/rules/` (native detection - no copy needed)
- Skills: `.agents/skills/` (native detection - no symlink needed)
- Workflows: `.agents/commands/` (native detection via internal symlink)
- MCP: `~/.gemini/antigravity/mcp_config.json` (global only)

**Important limitations:**

- No project-level MCP support (global only)
- No agents directory support

**Verify setup:**

```bash
ls -la .agents/rules
ls -la .agents/skills
cat ~/.gemini/antigravity/mcp_config.json
```

**MCP global config:**

```bash
# Edit global MCP config
vim ~/.gemini/antigravity/mcp_config.json

# Add servers following Gemini CLI format
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@context7/mcp-server"],
      "env": {
        "CONTEXT7_API_KEY": "your-key"
      }
    }
  }
}
```

## Verification

### Check All Symlinks

```bash
# Verify symlinks point correctly
readlink .cursor/rules      # → ../.agents/rules
readlink .cursor/skills     # → ../.agents/skills
readlink .claude/rules      # → ../.agents/rules
readlink .claude/skills     # → ../.agents/skills
# Gemini CLI reads natively from .agents/ (no symlinks needed)
```

### Test File Access

```bash
# Verify files accessible through symlinks
cat .cursor/rules/code/principles.md
ls .claude/skills/
cat .agents/rules/tools/use-context7.md   # Gemini reads natively from .agents/
```

### Validate JSON Configs

```bash
# Verify generated MCP configs are valid
jq empty .cursor/mcp.json
jq empty .claude/mcp.json
jq empty .gemini/settings.json
```

## Troubleshooting

### Symlinks Not Created

**Issue:** Symlinks not appearing after sync

**Solution:**

```bash
# Check Git symlink support
git config core.symlinks  # Should be: true

# Manual symlink creation
ln -s ../.agents/rules .cursor/rules
ln -s ../.agents/skills .claude/skills
```

### Rules Not Synchronized

**Issue:** Changes not propagating to agents

**Solution:**

```bash
# Re-run sync
./.agents/sync.sh --only=rules

# For Antigravity (uses copy, not symlink)
./.agents/sync.sh --only=rules  # Re-copies files
```

### MCP Servers Not Appearing

**Issue:** MCP servers not visible in agent

**Solution:**

```bash
# Validate source JSON
jq empty .agents/mcp/mcp-servers.json

# Regenerate configs
./.agents/sync.sh --only=mcp

# Restart agent/IDE
```

### Antigravity MCP Not Working

**Issue:** MCP servers not working in Antigravity

**Remember:** Antigravity only supports global MCP config

**Solution:**

```bash
# Edit global config (not project-level)
vim ~/.gemini/antigravity/mcp_config.json

# Restart Antigravity
```

### Permission Errors

**Issue:** Permission denied when running sync scripts

**Solution:**

```bash
# Make sync script executable
chmod +x .agents/sync.sh
```

## Team Workflow

### Onboarding New Team Members

```bash
# 1. Clone repository
git clone <repo-url>
cd template-best-practices

# 2. Run sync
./.agents/sync.sh

# 3. Set up environment variables
cp .env.example .env
vim .env  # Add API keys

# 4. Verify setup
claude mcp list
ls -la .cursor/rules
```

### Adding New Resources

**Adding rules:**

```bash
# 1. Create rule
vim .agents/rules/category/new-rule.md

# 2. Sync
./.agents/sync.sh --only=rules

# 3. Commit
git add .agents/rules/category/new-rule.md
git commit -m "docs: Add new rule for X"
```

**Adding MCP servers:**

```bash
# 1. Edit source
vim .agents/mcp/mcp-servers.json

# 2. Generate configs
./.agents/sync.sh --only=mcp

# 3. Commit both source and generated
git add .agents/mcp/mcp-servers.json .cursor/mcp.json .claude/mcp.json
git commit -m "feat: Add MCP server for X"
```

### Updating Configurations

```bash
# Pull latest
git pull

# Re-sync everything
./.agents/sync.sh

# Verify
ls -la .cursor/rules .claude/skills
```

## Related Documentation

- Sync System Architecture - See the "Architecture Overview" section in `CLAUDE.md` (root)
- [MCP Reference](../references/mcp.md) - MCP servers and setup
- [Skills Reference](../references/skills.md) - Skills ecosystem
- [Antigravity Limitations](mcp/ANTIGRAVITY_LIMITATION.md) - Platform constraints

## External References

- [Claude Code Documentation](https://docs.anthropic.com/en/docs/build-with-claude)
- [Cursor Documentation](https://docs.cursor.com)
- [Gemini CLI Documentation](https://geminicli.com/docs)
- [MCP Protocol](https://modelcontextprotocol.io)

---

_Maintained by LIDR Template Team | Last updated: 2026-02-01_
