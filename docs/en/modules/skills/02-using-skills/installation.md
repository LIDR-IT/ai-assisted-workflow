# Installing and Managing Skills

## Overview

Skills extend AI coding agents with specialized capabilities through simple markdown files. This guide covers the complete lifecycle of skill installation and management, from initial setup through updates and removal.

Skills can be installed at different scopes (global, project-local, enterprise), using various tools (Skills CLI, OpenSkills, npm packages), and work across multiple AI agent platforms.

## Installation Locations

Where you install a skill determines its availability and scope:

### 1. Project-Local Installation

**Location:** `.claude/skills/<skill-name>/SKILL.md`

**Scope:** Available only within the current project

**Use when:**
- Skill is specific to this project's domain or stack
- Team collaboration requires consistent project-specific workflows
- You want skills version-controlled with your codebase

**Installation:**
```bash
# Using Skills CLI (project default)
npx skills add <package>

# Using OpenSkills (project default)
npx openskills install <source>
```

**Directory structure:**
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

### 2. Global Installation

**Location:** `~/.claude/skills/<skill-name>/SKILL.md`

**Scope:** Available across all your projects

**Use when:**
- Skill applies universally (code explanation, formatting, etc.)
- You want consistent behavior across all projects
- Skills are general-purpose tools you use frequently

**Installation:**
```bash
# Using Skills CLI
npx skills add <package> -g

# Using OpenSkills
npx openskills install <source> --global
```

**Directory structure:**
```
~/.claude/
└── skills/
    ├── explain-code/
    │   └── SKILL.md
    ├── code-review/
    │   └── SKILL.md
    └── refactor-guide/
        └── SKILL.md
```

### 3. Universal Multi-Agent Installation

**Location:** `.agent/skills/<skill-name>/SKILL.md`

**Scope:** Available to multiple AI agents (not just Claude Code)

**Use when:**
- Working with multiple AI coding agents (Cursor, Windsurf, Aider, etc.)
- You want cross-platform skill compatibility
- Team uses different AI agents

**Installation:**
```bash
# Using OpenSkills with universal flag
npx openskills install <source> --universal
```

**Directory structure:**
```
your-project/
├── .agent/
│   └── skills/
│       ├── skill-1/
│       └── skill-2/
└── AGENTS.md
```

### 4. Enterprise Installation

**Location:** Managed through organization settings

**Scope:** All users in the organization

**Use when:**
- Enforcing company-wide standards and best practices
- Distributing proprietary workflows
- Centralized skill management required

**Setup:** Contact your organization administrator or see IAM and Managed Settings documentation.

### Installation Priority

When skills with the same name exist at multiple levels:

**Resolution order:** Enterprise > Personal (Global) > Project > Plugin

The highest priority skill takes precedence.

## Skills CLI Commands

The Skills CLI (`npx skills`) is the primary package manager for AI agent skills.

### Find Skills

Search the skills ecosystem interactively or by keyword:

```bash
# Interactive search
npx skills find

# Search by keyword
npx skills find react performance

# Search for specific domain
npx skills find docker deployment
npx skills find testing e2e
```

**Output:** List of matching skills with descriptions and install commands.

### Add Skills

Install skills from various sources:

```bash
# From skills.sh registry
npx skills add vercel-labs/skills@skill-name

# Global installation
npx skills add vercel-labs/skills@skill-name -g

# Auto-accept (skip confirmation)
npx skills add vercel-labs/skills@skill-name -y

# Global with auto-accept
npx skills add vercel-labs/skills@skill-name -g -y

# From custom GitHub repository
npx skills add username/custom-repo@skill-name

# From local directory
npx skills add ./path/to/skill

# From private repository
npx skills add git@github.com:org/private-skills.git@skill-name
```

**Flags:**
- `-g` — Install globally (`~/.claude/skills/`)
- `-y` — Auto-accept installation (skip confirmation prompts)
- `--verbose` — Show detailed installation progress

### Check for Updates

Verify if installed skills have available updates:

```bash
# Check all installed skills
npx skills check

# Check specific skill
npx skills check <skill-name>
```

**Output:** List of skills with available updates.

### Update Skills

Update installed skills to their latest versions:

```bash
# Update all skills
npx skills update

# Update specific skill
npx skills update <skill-name>

# Auto-accept updates
npx skills update -y
```

### List Installed Skills

View all currently installed skills:

```bash
# List project-local skills
npx skills list

# List global skills
npx skills list -g
```

### Remove Skills

Uninstall skills you no longer need:

```bash
# Remove project-local skill
npx skills remove <skill-name>

# Remove global skill
npx skills remove <skill-name> -g
```

## OpenSkills: Universal Cross-Platform Installation

**OpenSkills** is a universal CLI tool that brings skills to any AI coding agent, not just Claude Code.

### Why OpenSkills?

- **Multi-agent support:** Works with Claude Code, Cursor, Windsurf, Aider, Codex
- **Identical format:** Uses the same SKILL.md format as Claude Code
- **Flexible installation:** Project-local, global, or universal modes
- **Multiple sources:** GitHub, local paths, private repositories

### Installing OpenSkills

```bash
# Install globally
npm i -g openskills

# Or use directly with npx
npx openskills
```

**Requirements:**
- Node.js 20.6 or higher
- Git (for repository operations)

### OpenSkills Commands

#### Install Skills

```bash
# From Anthropic's marketplace
npx openskills install anthropics/skills

# From GitHub repository
npx openskills install username/repo

# From local path
npx openskills install ./path/to/skill

# Global installation
npx openskills install anthropics/skills --global

# Universal multi-agent installation
npx openskills install anthropics/skills --universal

# Auto-accept
npx openskills install anthropics/skills -y
```

#### Sync Skills

Update `AGENTS.md` with skill metadata (required after installation):

```bash
# Sync project-local
npx openskills sync

# Sync global
npx openskills sync --global

# Sync universal
npx openskills sync --universal
```

**Important:** Always run `sync` after installing or removing skills. This generates/updates the `AGENTS.md` file that agents read for skill discovery.

#### Read Skills

Load skill content for agents:

```bash
npx openskills read <skill-name>
```

#### List Skills

Display all installed skills:

```bash
npx openskills list
```

#### Update Skills

Refresh git-sourced skills:

```bash
# Update all skills
npx openskills update

# Auto-accept
npx openskills update -y
```

#### Remove Skills

Delete specific skills:

```bash
npx openskills remove <skill-name>

# Remember to sync after removal
npx openskills sync
```

### OpenSkills Flags

| Flag | Description |
|------|-------------|
| `--global` | Install skills system-wide instead of project-local |
| `--universal` | Use `.agent/skills/` instead of `.claude/skills/` |
| `-y, --yes` | Skip confirmation prompts (auto-accept) |
| `-o, --output` | Specify custom output file path |

## NPM Skills Package

The `skills` npm package provides a streamlined way to add skills:

```bash
# Install package
npm i skills

# Add skills interactively
npx skills add
```

**Features:**
- Framework-agnostic installation
- Interactive skill selection
- Domain coverage: front-end, back-end, DevOps, security
- 10+ years of React/Next.js best practices

## Installation Best Practices

### When to Use Global vs Project-Local

**Install globally when:**
- Skill is universally applicable (code explanation, general refactoring)
- You want the same behavior across all projects
- Skill contains general coding best practices
- Reduces duplication across multiple projects

**Examples of global skills:**
- `explain-code` - Code explanation with diagrams
- `code-review` - General code review guidelines
- `commit-conventions` - Git commit message standards

**Install project-locally when:**
- Skill is specific to project's tech stack or domain
- Team collaboration requires shared workflows
- Skill contains project-specific conventions
- You want version control of skills with codebase

**Examples of project-local skills:**
- `deploy` - Project-specific deployment workflow
- `api-conventions` - Project API design patterns
- `test-strategy` - Project testing approaches

### Team Collaboration Workflow

For project-local skills in team environments:

```bash
# Developer A: Create and install skill
npx openskills install ./custom-skills/deploy-skill

# Commit to repository
git add .claude/skills/ AGENTS.md
git commit -m "feat: Add deployment skill for staging/prod"
git push

# Developer B: Pull changes
git pull
# Skill is automatically available (no reinstall needed)
```

**Best practice:** Always commit both `.claude/skills/` and `AGENTS.md` to ensure team members have immediate access.

### Multi-Agent Consistency

For teams using different AI agents:

```bash
# Install with universal flag
npx openskills install anthropics/skills --universal

# Sync to .agent/skills/
npx openskills sync --universal

# Commit
git add .agent/skills/ AGENTS.md
git commit -m "feat: Add universal skills for all agents"
```

### Security Considerations

**Before installing any skill:**

1. **Verify the source:** Check repository and maintainer reputation
2. **Review permissions:** Understand what access the skill requires
3. **Inspect content:** Read SKILL.md to see what instructions it provides
4. **Check for commands:** Look for `!`command`` syntax or script execution
5. **Test in isolation:** Try new skills in a test project first

**Security warning:** AI agent skills can propagate hallucinated npx commands. Always verify:
- Skills from trusted sources (Anthropic, Vercel Labs, established maintainers)
- No unexpected system commands in SKILL.md
- No suspicious script files in skill directory

**Reference:** [Agent Skills Are Spreading Hallucinated npx Commands](https://www.aikido.dev/blog/agent-skills-spreading-hallucinated-npx-commands)

### Batch Installation

Install multiple skills at once:

```bash
# Create configuration file
cat > skills.json << EOF
{
  "skills": [
    "vercel-labs/skills@react-performance",
    "vercel-labs/skills@docker-best-practices",
    "vercel-labs/skills@playwright-e2e"
  ]
}
EOF

# Install from config
npx skills add --from-config skills.json
```

## Managing Skills

### Updating Skills

Keep skills current to receive bug fixes and improvements:

```bash
# Check what needs updating
npx skills check

# Review available updates
# Output shows: skill-name (current-version -> new-version)

# Update all skills
npx skills update

# Or update selectively
npx skills update <skill-name>
```

**Best practice:** Run `npx skills check` weekly to stay current.

**For OpenSkills:**
```bash
# Update git-sourced skills
npx openskills update -y

# Then re-sync
npx openskills sync
```

### Removing Skills

Clean up skills you no longer use:

```bash
# Using Skills CLI
npx skills remove <skill-name>

# Remove global skill
npx skills remove <skill-name> -g

# Using OpenSkills
npx openskills remove <skill-name>

# Don't forget to sync
npx openskills sync
```

**For project-local skills:**
```bash
# Remove from filesystem
rm -rf .claude/skills/<skill-name>

# If using OpenSkills, re-sync to update AGENTS.md
npx openskills sync

# Commit changes
git add .claude/skills/ AGENTS.md
git commit -m "chore: Remove unused skill"
```

### Version Control

**Always commit for project-local installations:**

```bash
# After installing skills
git add .claude/skills/
git add AGENTS.md
git commit -m "feat: Add React performance optimization skill"
```

**Never commit for global installations:**
- Global skills live in `~/.claude/skills/` (outside project)
- No version control needed
- Document required global skills in project README

## Verification Steps

### Verify Installation

**Check skill files exist:**
```bash
# Project-local
ls -la .claude/skills/<skill-name>/

# Global
ls -la ~/.claude/skills/<skill-name>/

# Universal
ls -la .agent/skills/<skill-name>/
```

**Check SKILL.md content:**
```bash
cat .claude/skills/<skill-name>/SKILL.md
```

### Verify AGENTS.md

For OpenSkills installations, verify `AGENTS.md` was generated:

```bash
cat AGENTS.md
```

**Expected format:**
```xml
<available_skills>
  <skill>
    <name>skill-name</name>
    <description>Skill description...</description>
    <location>project</location>
  </skill>
</available_skills>
```

### Verify Skill Availability

**Ask your AI agent:**
```
What skills are available?
```

The agent should list all installed skills with descriptions.

**Check specific skill:**
```
Do you have the <skill-name> skill?
```

### Verify Skill Invocation

**Test manual invocation:**
```
/skill-name
```

**Test automatic invocation:**
Ask a question matching the skill's description to see if it triggers automatically.

## Platform-Specific Installation

### Claude Code Native

Claude Code has built-in skill support:

```bash
# Installation happens via Skills CLI
npx skills add <package>

# Skills automatically discovered from:
# - ~/.claude/skills/ (personal/global)
# - .claude/skills/ (project-local)
# - Enterprise skills (if configured)
```

**No AGENTS.md required** - Claude Code natively discovers SKILL.md files.

### Cursor, Windsurf, Aider (via OpenSkills)

These agents require OpenSkills for skill support:

```bash
# Install OpenSkills globally
npm i -g openskills

# Install skills
npx openskills install anthropics/skills

# Generate AGENTS.md (required)
npx openskills sync
```

**AGENTS.md is required** - These agents discover skills through the AGENTS.md file.

### Multi-Agent Project Setup

For projects with team members using different agents:

```bash
# Use universal installation
npx openskills install anthropics/skills --universal

# Sync to generate AGENTS.md
npx openskills sync --universal

# Commit both
git add .agent/skills/ AGENTS.md
git commit -m "feat: Add universal skills for multi-agent support"
```

**Result:**
- Claude Code users: Works natively
- Cursor/Windsurf/Aider users: Works via AGENTS.md
- Single source of truth for all agents

## Troubleshooting Installation

### Skill Not Appearing

**Symptoms:** Installed skill doesn't show in available skills list

**Solutions:**

```bash
# 1. Verify installation
npx openskills list  # or npx skills list

# 2. Check file exists
ls -la .claude/skills/<skill-name>/SKILL.md

# 3. For OpenSkills: Re-sync AGENTS.md
npx openskills sync

# 4. Verify AGENTS.md generated
cat AGENTS.md

# 5. Restart agent/IDE
# Skills may require reload
```

### Installation Fails

**Symptoms:** Error during installation

**Solutions:**

```bash
# 1. Check CLI version
npx skills --version

# 2. Clear npm cache
npm cache clean --force

# 3. Try with verbose flag
npx skills add <package> --verbose

# 4. Check Node.js version (need 20.6+)
node --version

# 5. Check Git is installed (for repo-based skills)
git --version

# 6. Try alternative source
# Instead of: npx skills add owner/repo@skill
# Try: npx openskills install owner/repo
```

### Skill Not Loading

**Symptoms:** Skill exists but agent doesn't use it

**Solutions:**

```bash
# 1. Check skill description matches use case
cat .claude/skills/<skill-name>/SKILL.md

# 2. Try manual invocation
# In agent: /skill-name

# 3. Check context budget (Claude Code)
# In agent: /context
# Look for warnings about excluded skills

# 4. Increase skill budget if needed
export SLASH_COMMAND_TOOL_CHAR_BUDGET=30000

# 5. Verify frontmatter settings
# disable-model-invocation: true prevents auto-loading
# user-invocable: false hides from menu
```

### Update Issues

**Symptoms:** Skill update fails or shows unexpected version

**Solutions:**

```bash
# Force update git-sourced skills
npx openskills update -y

# Or completely reinstall
npx openskills remove <skill-name>
npx openskills install <source>
npx openskills sync

# For Skills CLI
npx skills remove <skill-name>
npx skills add <package>
```

### Permission Errors

**Symptoms:** Cannot write to installation directory

**Solutions:**

```bash
# Check directory permissions
ls -la ~/.claude/

# Create directory if missing
mkdir -p ~/.claude/skills

# Fix permissions
chmod 755 ~/.claude/skills

# For project-local installation
mkdir -p .claude/skills
```

### AGENTS.md Not Generated

**Symptoms:** OpenSkills installed but no AGENTS.md

**Solutions:**

```bash
# Run sync explicitly
npx openskills sync

# Check for errors
npx openskills sync --verbose

# Verify skills directory exists
ls -la .claude/skills/

# Manual sync for specific location
npx openskills sync --global  # for ~/.claude/skills
npx openskills sync --universal  # for .agent/skills
```

## Related Documentation

### In This Module
- [Creating Custom Skills](../03-creating-skills/custom-skills.md) - Build your own skills
- [Skill Format Reference](../03-creating-skills/skill-format.md) - SKILL.md specification
- [Skill Best Practices](../04-advanced-skills/best-practices.md) - Optimization and patterns

### Cross-References
- [Skills Discovery Tools](../../references/skills/find-skills-vercel.md) - find-skills detailed reference
- [OpenSkills Reference](../../references/skills/openskills.md) - Full OpenSkills documentation
- [NPM Skills Package](../../references/skills/npm-skills-package.md) - Package details
- [Skills in Claude Code](../../references/skills/skills-claude-code.md) - Platform-specific features

### External Resources
- **Browse Skills:** [skills.sh](https://skills.sh/)
- **Official Docs:** [code.claude.com/docs/en/skills](https://code.claude.com/docs/en/skills)
- **Agent Skills Standard:** [agentskills.io](https://agentskills.io)

---

**Last Updated:** February 2026
**Module:** Skills / Using Skills
**Next:** [Invoking Skills](invocation.md)
