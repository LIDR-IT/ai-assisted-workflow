# Cross-Platform Skills with OpenSkills

## Overview

Skills traditionally existed within specific AI agent ecosystems. **OpenSkills** changes this paradigm by providing a universal installer and loader for SKILL.md files that works across multiple AI coding agents—not just Claude Code.

This guide demonstrates how to create, install, and manage skills that work seamlessly across Claude Code, Cursor, Windsurf, Aider, Codex, and any agent that can read AGENTS.md files.

**Key Concept:** OpenSkills acts as a bridge, allowing a single skill format (SKILL.md) to work across different AI agents through progressive disclosure and standardized metadata.

---

## What is OpenSkills?

**OpenSkills** is a universal CLI tool that brings Anthropic's skills system to any AI coding agent. It's the universal installer for SKILL.md files.

**Repository:** [github.com/numman-ali/openskills](https://github.com/numman-ali/openskills)
**Package:** `openskills`
**License:** Apache 2.0
**Tagline:** "The universal installer for SKILL.md"

### Core Purpose

OpenSkills eliminates the need to maintain separate skill formats for different AI agents. Instead of creating platform-specific implementations, you create one SKILL.md file and use it everywhere.

**Without OpenSkills:**
```
project/
├── .cursor/skills/          # Cursor-specific skills
├── .windsurf/skills/        # Windsurf-specific skills
├── .aider/skills/           # Aider-specific skills
└── .claude/skills/          # Claude-specific skills
    # All different formats, different maintenance
```

**With OpenSkills:**
```
project/
├── .claude/skills/          # or .agent/skills/ (universal)
│   └── my-skill/
│       └── SKILL.md         # Single format, works everywhere
└── AGENTS.md                # Generated skill discovery file
```

### Key Advantages

**1. Write Once, Use Everywhere**
- Create a skill once in SKILL.md format
- Install across all your AI agents
- No platform-specific rewrites

**2. Progressive Disclosure**
- Skills load metadata first (name, description)
- Full content loads only when triggered
- Prevents context window bloat

**3. Flexible Installation**
- Project-local: `.claude/skills/`
- Global: `~/.claude/skills/`
- Universal: `.agent/skills/`

**4. Multiple Source Support**
- GitHub repositories
- Local file paths
- Private git repositories
- Anthropic's skills marketplace

**5. Version Control Friendly**
- Skills are local files in your project
- Tracked by git
- Team members get skills on clone

---

## Supported AI Agents

OpenSkills provides varying levels of support across AI coding agents:

| Agent | Support Level | Implementation | Notes |
|-------|---------------|----------------|-------|
| **Claude Code** | ✅ Native | Uses identical SKILL.md format | OpenSkills compatible |
| **Cursor** | ✅ Full | Reads AGENTS.md for discovery | Progressive disclosure |
| **Windsurf** | ✅ Full | Reads AGENTS.md for discovery | Progressive disclosure |
| **Aider** | ✅ Full | Reads AGENTS.md for discovery | Progressive disclosure |
| **Codex** | ✅ Full | Reads AGENTS.md for discovery | Progressive disclosure |
| **Others** | ⚠️ Partial | Any agent parsing AGENTS.md | Requires AGENTS.md support |

### How It Works

**1. Skill Installation**
OpenSkills copies SKILL.md files to a local directory (`.claude/skills/` by default).

**2. AGENTS.md Generation**
Running `openskills sync` generates an AGENTS.md file with XML metadata:

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

**3. Skill Discovery**
AI agents read AGENTS.md to discover available skills without loading full content.

**4. Progressive Loading**
When a skill is needed:
- Agent identifies skill from AGENTS.md
- Agent loads specific SKILL.md
- Agent applies skill knowledge to task

This prevents loading all skills into context simultaneously.

---

## Installation

### Requirements

- **Node.js:** Version 20.6 or higher
- **Git:** Required for repository operations

### Quick Start

**Install globally:**
```bash
npm i -g openskills
```

**Or use with npx (no installation):**
```bash
npx openskills
```

### Verification

```bash
# Check version
npx openskills --version

# Show help
npx openskills --help
```

---

## Complete Command Reference

### 1. Install Skills

Install skills from various sources.

**From Anthropic's marketplace:**
```bash
npx openskills install anthropics/skills
```

**From GitHub repository:**
```bash
npx openskills install username/repo-name
```

**From local path:**
```bash
npx openskills install ./path/to/skill
npx openskills install ../shared-skills/my-skill
```

**From private repository:**
```bash
npx openskills install git@github.com:company/private-skills.git
```

**Flags:**
- `--global` - Install to `~/.claude/skills/` (available to all projects)
- `--universal` - Install to `.agent/skills/` (multi-agent compatible)
- `-y, --yes` - Skip confirmation prompts

**Examples:**

```bash
# Project-local installation (default)
npx openskills install anthropics/skills

# Global installation
npx openskills install anthropics/skills --global

# Universal multi-agent installation
npx openskills install anthropics/skills --universal

# Private repository with auto-confirm
npx openskills install git@github.com:acme/dev-skills.git -y
```

---

### 2. Sync Skills

Update AGENTS.md with metadata from installed skills.

**Basic sync:**
```bash
npx openskills sync
```

**Flags:**
- `--global` - Sync global skills
- `--universal` - Sync from `.agent/skills/`
- `-o, --output <path>` - Custom output file path

**Examples:**

```bash
# Sync project skills
npx openskills sync

# Sync global skills
npx openskills sync --global

# Sync universal skills
npx openskills sync --universal

# Custom output location
npx openskills sync -o ./custom/AGENTS.md
```

**When to run sync:**
- After installing new skills
- After removing skills
- After manually editing SKILL.md frontmatter
- When AGENTS.md is out of sync

---

### 3. Read a Skill

Load skill content for agents to consume.

**Basic usage:**
```bash
npx openskills read <skill-name>
```

**Examples:**

```bash
# Read specific skill
npx openskills read pdf

# Read skill (output to terminal)
npx openskills read commit

# Pipe to file
npx openskills read api-generator > skill-content.md
```

**Use case:** Agents use this command internally to load skills progressively, but you can run it manually to inspect skill content.

---

### 4. List Installed Skills

Display all installed skills with metadata.

**Basic usage:**
```bash
npx openskills list
```

**Flags:**
- `--global` - List global skills
- `--universal` - List universal skills

**Example output:**
```
Installed Skills:

1. pdf
   Description: Comprehensive PDF manipulation toolkit
   Location: project (.claude/skills/pdf)

2. commit
   Description: Git commit workflow automation
   Location: project (.claude/skills/commit)

3. api-generator
   Description: Generate REST API endpoints with validation
   Location: project (.claude/skills/api-generator)

Total: 3 skills
```

**Examples:**

```bash
# List project skills
npx openskills list

# List global skills
npx openskills list --global

# List universal skills
npx openskills list --universal
```

---

### 5. Update Skills

Refresh git-sourced skills to latest version.

**Basic usage:**
```bash
npx openskills update
```

**Flags:**
- `--global` - Update global skills
- `--universal` - Update universal skills
- `-y, --yes` - Auto-confirm updates

**Examples:**

```bash
# Update all project skills
npx openskills update

# Update with auto-confirm
npx openskills update -y

# Update global skills
npx openskills update --global
```

**Behavior:**
- Only updates skills installed from git repositories
- Pulls latest changes from remote
- Preserves local modifications (git pull strategy)
- Skips skills from local paths

---

### 6. Remove Skills

Delete specific skills from installation.

**Basic usage:**
```bash
npx openskills remove <skill-name>
```

**Flags:**
- `--global` - Remove from global skills
- `--universal` - Remove from universal skills
- `-y, --yes` - Skip confirmation

**Examples:**

```bash
# Remove project skill
npx openskills remove api-generator

# Remove with confirmation
npx openskills remove pdf -y

# Remove global skill
npx openskills remove commit --global
```

**Important:** After removing, run `npx openskills sync` to update AGENTS.md.

---

## Installation Modes

OpenSkills supports three installation modes with different use cases.

### Project-Local Mode (Default)

**Location:** `.claude/skills/`
**Scope:** Current project only
**Use case:** Project-specific skills

**Structure:**
```
your-project/
├── .claude/
│   └── skills/
│       ├── skill-1/
│       │   ├── SKILL.md
│       │   └── references/
│       └── skill-2/
│           └── SKILL.md
├── AGENTS.md
└── package.json
```

**Installation:**
```bash
cd your-project
npx openskills install anthropics/skills
npx openskills sync
```

**Advantages:**
- Skills tracked in version control
- Team members get skills automatically
- Project-specific customization
- No global namespace pollution

**When to use:**
- Skills specific to this project
- Team collaboration
- Skills in active development

---

### Global Mode

**Location:** `~/.claude/skills/`
**Scope:** All projects for current user
**Use case:** Personal skills used across projects

**Structure:**
```
~/.claude/
└── skills/
    ├── my-personal-skill/
    │   └── SKILL.md
    └── common-utilities/
        └── SKILL.md
```

**Installation:**
```bash
npx openskills install ./my-skill --global
npx openskills sync --global
```

**Advantages:**
- Available to all projects
- No per-project installation
- Personal workflow optimization
- Centralized maintenance

**When to use:**
- Personal productivity skills
- Skills you use everywhere
- Development utilities
- Testing and debugging skills

---

### Universal Mode

**Location:** `.agent/skills/`
**Scope:** Project, multi-agent compatible
**Use case:** Cross-platform projects

**Structure:**
```
your-project/
├── .agent/
│   └── skills/
│       ├── skill-1/
│       │   └── SKILL.md
│       └── skill-2/
│           └── SKILL.md
├── AGENTS.md
└── package.json
```

**Installation:**
```bash
cd your-project
npx openskills install anthropics/skills --universal
npx openskills sync --universal
```

**Advantages:**
- Works with multiple AI agents
- Platform-agnostic location
- Team using different agents
- Future-proof structure

**When to use:**
- Teams using different AI agents
- Multi-agent workflows
- Platform-independent projects
- Antigravity integration

---

## AGENTS.md Generation

OpenSkills generates AGENTS.md files that enable skill discovery without loading full content.

### Structure

```xml
<available_skills>
  <skill>
    <name>skill-identifier</name>
    <description>When to use this skill with trigger phrases</description>
    <location>project|global</location>
  </skill>
  <!-- More skills... -->
</available_skills>
```

### Example AGENTS.md

```xml
<available_skills>
  <skill>
    <name>pdf</name>
    <description>Comprehensive PDF manipulation toolkit. Use when working with PDF files, extracting text, merging documents, or generating reports from PDFs.</description>
    <location>project</location>
  </skill>

  <skill>
    <name>commit</name>
    <description>Git commit workflow automation with conventional commit format. Use when creating commits, following commit standards, or automating git workflows.</description>
    <location>project</location>
  </skill>

  <skill>
    <name>api-generator</name>
    <description>Generate REST API endpoints with validation, error handling, and tests when asked to create endpoints, add API routes, or scaffold REST handlers.</description>
    <location>project</location>
  </skill>
</available_skills>
```

### Metadata Extraction

OpenSkills extracts metadata from SKILL.md frontmatter:

```yaml
---
name: skill-name
description: Detailed description with trigger phrases
---
```

Becomes:

```xml
<skill>
  <name>skill-name</name>
  <description>Detailed description with trigger phrases</description>
  <location>project</location>
</skill>
```

### Progressive Disclosure Flow

**1. Agent starts task**
```
User: "Create a PDF report from data"
```

**2. Agent reads AGENTS.md**
```xml
<skill>
  <name>pdf</name>
  <description>Comprehensive PDF manipulation toolkit...</description>
</skill>
```

**3. Agent identifies relevant skill**
```
Agent recognizes "PDF" in description matches task
```

**4. Agent loads skill**
```bash
# Agent internally runs:
npx openskills read pdf
```

**5. Agent applies skill**
```
Agent uses SKILL.md guidance to create PDF report
```

This approach keeps context lean—only loading what's needed.

---

## SKILL.md Format

OpenSkills uses the identical format as Claude Code native skills.

### Basic Structure

```markdown
---
name: skill-identifier
description: Specific trigger phrases when this skill applies
---

# Skill Title

Brief overview of skill purpose.

## When to Use

Specific scenarios and trigger conditions.

## Instructions

Step-by-step guidance or core rules.

## Examples

Concrete examples of application.

## References

Links to scripts, references, or assets.
```

### Frontmatter Requirements

**Required fields:**
```yaml
---
name: skill-name
description: This skill should be used when asking to "phrase 1", "phrase 2", or "phrase 3"
---
```

**Optional fields:**
```yaml
---
name: skill-name
description: Skill description
version: 1.0.0
author: Your Name
license: MIT
tags: [api, typescript, rest]
---
```

### Directory Structure

Skills can include supporting resources:

```
skill-name/
├── SKILL.md              # Main skill file (required)
├── scripts/              # Executable scripts
│   ├── generate.py
│   └── validate.sh
├── references/           # Detailed documentation
│   ├── patterns.md
│   └── api-docs.md
├── examples/             # Working code examples
│   ├── basic.ts
│   └── advanced.ts
└── assets/               # Templates and files
    └── template.js
```

**See:** [Skill Anatomy](../01-fundamentals/skill-anatomy.md) for detailed format specification.

---

## Use Cases

### Team Collaboration

**Scenario:** Share custom skills across development team

**Workflow:**
```bash
# Developer A creates skill
mkdir -p .claude/skills/deploy-skill
vim .claude/skills/deploy-skill/SKILL.md

# Install and sync
npx openskills install ./deploy-skill
npx openskills sync

# Commit to repository
git add .claude/skills/ AGENTS.md
git commit -m "feat: add deployment skill"
git push

# Developer B pulls changes
git pull

# Skill automatically available
# No additional setup needed
```

**Benefits:**
- Skills versioned with project
- Consistent across team
- No manual distribution
- Works in CI/CD

---

### Multi-Project Consistency

**Scenario:** Use same skills across multiple projects

**Workflow:**
```bash
# Install common skills globally
npx openskills install anthropics/skills --global
npx openskills install company/internal-skills --global

# Sync global skills
npx openskills sync --global

# Skills available to all projects
cd ~/project-1
# Skills accessible

cd ~/project-2
# Same skills accessible
```

**Benefits:**
- Install once, use everywhere
- Consistent workflows
- Centralized updates
- Personal productivity

---

### Private Skills

**Scenario:** Company-internal skills not for public distribution

**Workflow:**
```bash
# Install from private repository
npx openskills install git@github.com:company/private-skills.git

# Or from local development
npx openskills install ../company-skills/api-generator

# Sync
npx openskills sync

# Skills available but not publicly accessible
```

**Security considerations:**
- Use SSH keys for private repos
- Don't commit credentials
- Review skill content before installation
- Audit third-party skills

**See:** [Third-Party Security Guidelines](../../../../guidelines/team-conventions/third-party-security-guidelines.md)

---

### Multi-Agent Workflows

**Scenario:** Team using different AI agents (Claude, Cursor, Windsurf)

**Workflow:**
```bash
# Use universal mode
npx openskills install anthropics/skills --universal

# Sync to .agent/skills/
npx openskills sync --universal

# Generate AGENTS.md
# All agents can read AGENTS.md

# Team member using Claude Code
claude
"create a commit"  # Skill works

# Team member using Cursor
cursor
"create a commit"  # Same skill works

# Team member using Windsurf
windsurf
"create a commit"  # Same skill works
```

**Benefits:**
- Single skill source
- No platform-specific versions
- Team flexibility
- Future-proof

---

## Comparison: OpenSkills vs Claude Code Native Skills

### Feature Comparison

| Feature | Claude Code Native | OpenSkills |
|---------|-------------------|------------|
| **Skill Format** | SKILL.md | SKILL.md (identical) |
| **Installation** | `/skills install` | `npx openskills install` |
| **Agent Support** | Claude Code only | Multi-agent |
| **Storage Location** | `.claude/skills/` | Configurable |
| **Sync Required** | Automatic | Manual (`sync` command) |
| **Discovery** | Built-in | AGENTS.md |
| **Progressive Disclosure** | ✅ Yes | ✅ Yes |
| **Offline Support** | ✅ Yes | ✅ Yes |
| **Version Control** | ✅ Yes | ✅ Yes |
| **Global Skills** | ✅ Yes | ✅ Yes |
| **Marketplace** | Anthropic Skills | Anthropic Skills |

### When to Use Each

**Use Claude Code Native Skills When:**
- Only using Claude Code
- Want automatic skill detection
- Prefer integrated tooling
- Need zero-config setup

**Use OpenSkills When:**
- Using multiple AI agents
- Need cross-platform compatibility
- Want explicit control over sync
- Working with Antigravity
- Team uses different agents

### Can You Use Both?

**Yes.** OpenSkills and Claude Code native skills are compatible because they use the same SKILL.md format.

**Example:**
```bash
# Install with Claude Code
claude /skills install anthropics/skills

# Also visible to OpenSkills
npx openskills list
# Shows skills from .claude/skills/

# Generate AGENTS.md for other agents
npx openskills sync
```

---

## Best Practices

### 1. Version Control Skills

**Always commit `.claude/skills/` and `AGENTS.md`:**

```bash
# Add to git
git add .claude/skills/
git add AGENTS.md
git commit -m "feat: add API generator skill"
```

**Benefits:**
- Team gets skills automatically
- Skills versioned with code
- Changes tracked
- Rollback capability

---

### 2. Sync After Changes

**Run sync after skill modifications:**

```bash
# After installing skill
npx openskills install new-skill
npx openskills sync

# After removing skill
npx openskills remove old-skill
npx openskills sync

# After editing SKILL.md frontmatter
vim .claude/skills/my-skill/SKILL.md
npx openskills sync
```

---

### 3. Use Descriptive Names

**Frontmatter naming:**

```yaml
# Good
---
name: api-endpoint-generator
description: Generate REST API endpoints with validation, error handling, and tests when user asks to "create an endpoint", "add API route", "generate REST handler"
---

# Bad
---
name: api
description: API stuff
---
```

---

### 4. Document Dependencies

**Include setup requirements in SKILL.md:**

```markdown
## Requirements

- Python 3.8+
- Node.js 16+
- TypeScript
- PostgreSQL (for database skills)

## Setup

Install dependencies:
\`\`\`bash
pip install -r requirements.txt
npm install
\`\`\`
```

---

### 5. Test Across Agents

**Verify skills work on target platforms:**

```bash
# Test with Claude Code
claude
"trigger phrase for skill"

# Test with Cursor
cursor
"same trigger phrase"

# Verify AGENTS.md readable
cat AGENTS.md
```

---

### 6. Update Periodically

**Keep git-sourced skills current:**

```bash
# Monthly or quarterly
npx openskills update

# Check for changes
npx openskills list

# Sync after updates
npx openskills sync
```

---

### 7. Choose Appropriate Mode

**Selection guide:**

| Scenario | Recommended Mode |
|----------|------------------|
| Team project | Project-local |
| Personal utilities | Global |
| Multi-agent team | Universal |
| In development | Project-local |
| Stable, reusable | Global |
| Cross-platform | Universal |

---

## Troubleshooting

### Skill Not Appearing

**Symptoms:** Skill installed but not visible to agent

**Solutions:**

```bash
# 1. Verify skill is installed
npx openskills list

# 2. Check AGENTS.md exists
cat AGENTS.md

# 3. Re-sync
npx openskills sync

# 4. Verify AGENTS.md content
grep "skill-name" AGENTS.md

# 5. Restart AI agent
```

---

### AGENTS.md Not Generated

**Symptoms:** `sync` command completes but no AGENTS.md

**Solutions:**

```bash
# 1. Check output path
ls -la AGENTS.md

# 2. Verify skills exist
ls -la .claude/skills/

# 3. Explicit output path
npx openskills sync -o ./AGENTS.md

# 4. Check permissions
ls -ld .
```

---

### Update Issues

**Symptoms:** `update` command fails or doesn't pull changes

**Solutions:**

```bash
# 1. Check skill source
npx openskills list
# Look for git URLs vs local paths

# 2. Only git-sourced skills update
# Local path skills won't update

# 3. Force update with reinstall
npx openskills remove skill-name
npx openskills install username/repo
npx openskills sync

# 4. Check git access
git ls-remote https://github.com/username/repo
```

---

### Skills Not Loading in Agent

**Symptoms:** AGENTS.md exists but agent doesn't use skills

**Solutions:**

**1. Verify agent supports AGENTS.md**
- Cursor: ✅ Yes
- Windsurf: ✅ Yes
- Claude Code: ✅ Yes (native)
- Check agent documentation

**2. Check AGENTS.md format**
```bash
# Validate XML structure
cat AGENTS.md
# Ensure proper XML tags
```

**3. Test skill manually**
```bash
# Load skill content
npx openskills read skill-name

# Verify SKILL.md is valid
cat .claude/skills/skill-name/SKILL.md
```

**4. Check description triggers**
```yaml
# Ensure specific phrases in description
description: Use when asking to "specific phrase 1", "specific phrase 2"
```

---

### Permission Errors

**Symptoms:** Cannot install or sync skills

**Solutions:**

```bash
# 1. Check directory permissions
ls -la .claude/

# 2. Create directory if missing
mkdir -p .claude/skills

# 3. Fix permissions
chmod 755 .claude/skills

# 4. Use global mode if project read-only
npx openskills install skill --global
```

---

## Integration with This Project

This project uses a centralized configuration approach compatible with OpenSkills.

### Project Structure

```
template-best-practices/
├── .agents/
│   └── skills/              # Source of truth
│       └── my-skill/
│           └── SKILL.md
├── .claude/
│   └── skills -> ../.agents/skills  # Symlink
├── .cursor/
│   └── skills -> ../.agents/skills  # Symlink
├── .gemini/
│   └── skills -> ../.agents/skills  # Symlink
└── .agent/
    └── skills/              # Selective symlinks (Antigravity)
```

### Using OpenSkills in This Project

**1. Install to centralized location:**
```bash
# Install to .agents/skills/
npx openskills install anthropics/skills -o .agents/skills/

# Symlinks propagate automatically
ls -la .claude/skills
ls -la .cursor/skills
```

**2. Generate AGENTS.md:**
```bash
# Sync from .agents/skills/
npx openskills sync
```

**3. Access from any agent:**
```bash
# Claude Code
claude

# Cursor
cursor

# All see same skills via symlinks
```

**See:** [Skills Management Guidelines](../../../../guidelines/team-conventions/skills-management-guidelines.md) for project-specific conventions.

---

## Related Documentation

### Skill Fundamentals
- [What Are Skills](../01-fundamentals/what-are-skills.md) - Core concepts
- [Skill Anatomy](../01-fundamentals/skill-anatomy.md) - SKILL.md format

### Installation & Usage
- [Installing Skills](../02-installation/installation.md) - Installation methods
- [Creating Skills Workflow](../03-creating-skills/workflow.md) - Development guide

### Platform-Specific Guides
- [Claude Code Skills](./claude-code.md) - Native implementation
- [Cursor Skills](./cursor.md) - Cursor integration
- [Antigravity Skills](./antigravity.md) - Antigravity considerations

### References
- [OpenSkills GitHub](https://github.com/numman-ali/openskills) - Official repository
- [Anthropic Skills Marketplace](https://github.com/anthropics/skills) - Official skills
- [SKILL.md Specification](https://github.com/anthropics/skills/blob/main/SKILL_SPEC.md) - Format spec

---

## Legal & Attribution

- **License:** Apache 2.0
- **Attribution:** Implements Anthropic's Agent Skills specification
- **Disclaimer:** OpenSkills is not affiliated with Anthropic
- **Trademarks:** Claude Code and Agent Skills are trademarks of Anthropic PBC

---

**Last Updated:** February 2026
**Version:** 1.0.0
**Category:** Platform Integration
