# OpenSkills - Universal Skills Loader for AI Coding Agents

## Overview

**OpenSkills** is a universal CLI tool that brings Anthropic's skills system to any AI coding agent. It enables developers to install, manage, and use SKILL.md files across multiple agent platforms without requiring Claude Code specifically.

**Repository:** [GitHub - numman-ali/openskills](https://github.com/numman-ali/openskills)
**Package:** `openskills`
**License:** Apache 2.0
**Tagline:** "The universal installer for SKILL.md"

## Core Purpose

OpenSkills acts as a bridge that allows a single skill format (SKILL.md) to work seamlessly across different AI coding agents:

- Claude Code
- Cursor
- Windsurf
- Aider
- Codex
- Any agent that can read AGENTS.md files

This eliminates the need to maintain separate skill formats for different AI agents, enabling true cross-platform skill sharing.

## Key Features

### Universal Compatibility

- **Multi-agent support**: Works with multiple AI coding agents, not just Claude Code
- **Identical format**: Uses the same prompt format and folder structure as Claude Code
- **Progressive disclosure**: Loads skills on-demand to avoid context bloat

### Flexible Installation Options

- **Project-local**: `./.claude/skills/` (default)
- **Global**: `~/.claude/skills/` (system-wide)
- **Universal mode**: `./.agent/skills/` (for multi-agent setups)

### Multiple Source Support

- GitHub repositories
- Local file paths
- Private git repositories
- Anthropic's official skills marketplace

### Storage & Management

- Skills reside in your project for version control
- Git-based skills can be updated
- Interactive management interface
- Skill removal capabilities

## Requirements

- **Node.js:** Version 20.6 or higher
- **Git:** Required for repository operations

## Installation

### Quick Start

Install the package globally:

```bash
npm i -g openskills
```

Or use it directly with npx:

```bash
npx openskills
```

## Usage

### Basic Commands

#### Install Skills

Install from Anthropic's marketplace:

```bash
npx openskills install anthropics/skills
```

Install from a GitHub repository:

```bash
npx openskills install username/repo
```

Install from a local path:

```bash
npx openskills install ./path/to/skill
```

#### Sync Skills

Update AGENTS.md with skill metadata:

```bash
npx openskills sync
```

#### Read a Skill

Load skill content for agents:

```bash
npx openskills read <skill-name>
```

#### List Installed Skills

Display all installed skills:

```bash
npx openskills list
```

#### Update Skills

Refresh git-sourced skills:

```bash
npx openskills update
```

#### Remove Skills

Delete specific skills:

```bash
npx openskills remove <skill-name>
```

### Command Flags

| Flag           | Description                                         |
| -------------- | --------------------------------------------------- |
| `--global`     | Install skills system-wide instead of project-local |
| `--universal`  | Use `.agent/skills/` instead of `.claude/skills/`   |
| `-y, --yes`    | Skip confirmation prompts (auto-accept)             |
| `-o, --output` | Specify custom output file path                     |

### Example Workflows

#### Project-Local Setup

```bash
# Install skills for a specific project
npx openskills install anthropics/skills

# Sync to generate AGENTS.md
npx openskills sync

# List what's installed
npx openskills list
```

#### Global Setup

```bash
# Install skills globally for all projects
npx openskills install anthropics/skills --global

# Sync globally
npx openskills sync --global
```

#### Universal Multi-Agent Setup

```bash
# Install for multiple AI agents
npx openskills install anthropics/skills --universal

# Sync to .agent/skills/
npx openskills sync --universal
```

## How It Works

### AGENTS.md Generation

OpenSkills generates the same XML structure that Claude Code uses for skill discovery. This XML is written to an `AGENTS.md` file that compatible agents can read:

```xml
<available_skills>
  <skill>
    <name>pdf</name>
    <description>Comprehensive PDF manipulation toolkit...</description>
    <location>project</location>
  </skill>
  <skill>
    <name>commit</name>
    <description>Git commit workflow automation</description>
    <location>project</location>
  </skill>
</available_skills>
```

Any agent that can parse AGENTS.md can identify and invoke available skills without needing Claude Code's native skill system.

### Progressive Disclosure

Skills are loaded on-demand rather than all at once, preventing context window bloat. The agent:

1. Reads AGENTS.md to see available skills
2. Loads only the skills it needs for the current task
3. Keeps context focused and efficient

## SKILL.md Format

Skills follow Anthropic's specification with YAML frontmatter:

```markdown
---
name: skill-name
description: What this skill does
---

# Skill Instructions

Detailed instructions for the AI agent on how to use this skill...

## Examples

Example usage patterns...

## Best Practices

Guidelines for effective skill usage...
```

### Skill Structure

A skill can include:

- **SKILL.md**: The main skill file (required)
- **references/**: Supporting documentation
- **scripts/**: Helper scripts
- **assets/**: Images, diagrams, or other resources

All these components are bundled together when the skill is installed.

## Folder Structure

### Project-Local (Default)

```
your-project/
├── .claude/
│   └── skills/
│       ├── skill-1/
│       │   ├── SKILL.md
│       │   └── references/
│       └── skill-2/
│           └── SKILL.md
└── AGENTS.md
```

### Global Installation

```
~/.claude/
└── skills/
    ├── skill-1/
    └── skill-2/
```

### Universal Multi-Agent

```
your-project/
├── .agent/
│   └── skills/
│       ├── skill-1/
│       └── skill-2/
└── AGENTS.md
```

## Supported AI Agents

| Agent       | Support Level | Notes                              |
| ----------- | ------------- | ---------------------------------- |
| Claude Code | ✅ Native     | Uses the same format as OpenSkills |
| Cursor      | ✅ Full       | Reads AGENTS.md                    |
| Windsurf    | ✅ Full       | Reads AGENTS.md                    |
| Aider       | ✅ Full       | Reads AGENTS.md                    |
| Codex       | ✅ Full       | Reads AGENTS.md                    |
| Others      | ⚠️ Partial    | Any agent that can parse AGENTS.md |

## Advantages

1. **Write Once, Use Everywhere**: Create a skill once, use it across all your AI agents
2. **Version Control**: Skills live in your project, tracked by git
3. **Community Sharing**: Easy to share and distribute skills
4. **No Vendor Lock-in**: Not tied to a specific AI agent platform
5. **Marketplace Access**: Direct access to Anthropic's skills marketplace
6. **Offline-Ready**: Skills are local files, work without network access

## Use Cases

### Team Collaboration

```bash
# Developer A creates and installs a custom skill
npx openskills install ./custom-skills/deploy-skill

# Commit to repo
git add .claude/skills/ AGENTS.md
git commit -m "Add deployment skill"

# Developer B pulls and has instant access
git pull
# Skill is already available in their agent
```

### Multi-Project Consistency

```bash
# Install common skills globally
npx openskills install anthropics/skills --global

# All projects can access these skills
# No need to reinstall per project
```

### Private Skills

```bash
# Install from private repository
npx openskills install git@github.com:company/private-skills.git

# Or from local development
npx openskills install ../my-custom-skill
```

## Best Practices

1. **Version Control**: Always commit `.claude/skills/` and `AGENTS.md` to your repository
2. **Sync Regularly**: Run `npx openskills sync` after installing/removing skills
3. **Use Descriptive Names**: Give skills clear, descriptive names in their frontmatter
4. **Document Dependencies**: Include any required tools or setup in skill documentation
5. **Test Across Agents**: Verify skills work with your target AI agents
6. **Update Periodically**: Keep git-sourced skills updated with `npx openskills update`

## Troubleshooting

### Skill Not Appearing

```bash
# Verify skill is installed
npx openskills list

# Re-sync AGENTS.md
npx openskills sync

# Check AGENTS.md was generated
cat AGENTS.md
```

### Update Issues

```bash
# Force update git-sourced skills
npx openskills update -y

# Or reinstall completely
npx openskills remove <skill-name>
npx openskills install <source>
npx openskills sync
```

## Comparison with Claude Code Native Skills

| Feature       | Claude Code Native | OpenSkills               |
| ------------- | ------------------ | ------------------------ |
| Skill Format  | SKILL.md           | SKILL.md (identical)     |
| Installation  | `/skills install`  | `npx openskills install` |
| Agent Support | Claude Code only   | Multi-agent              |
| Storage       | `.claude/skills/`  | Configurable             |
| Sync Required | Automatic          | Manual (`sync` command)  |
| Offline       | ✅ Yes             | ✅ Yes                   |

## Legal & Attribution

- **License**: Apache 2.0
- **Attribution**: Implements Anthropic's Agent Skills specification
- **Disclaimer**: Not affiliated with Anthropic
- **Trademarks**: Claude Code and Agent Skills are trademarks of Anthropic

## Related Resources

- [Anthropic Skills Marketplace](https://github.com/anthropics/skills)
- [SKILL.md Specification](https://github.com/anthropics/skills/blob/main/SKILL_SPEC.md)
- [npm-agentskills](https://github.com/onmax/npm-agentskills) - Framework-agnostic skill discovery
- [agent-skill-npm-boilerplate](https://github.com/neovateai/agent-skill-npm-boilerplate) - Template for creating skills

---

**Last Updated:** January 2026
**Status:** Active Development
**Maintainer:** numman-ali
