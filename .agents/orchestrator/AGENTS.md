# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**Note:** This file is also used by other AI agents (Gemini CLI, Cursor, Antigravity). Root-level files (`CLAUDE.md`, `GEMINI.md`, `AGENTS.md`) are symlinks to this orchestrator file.

---

## What This Repository Is

This is a **multi-agent AI configuration template** demonstrating centralized management across 4 platforms: Cursor, Claude Code, Gemini CLI, and Antigravity. It's a production tool for teams, not a documentation wiki.

**Core Architecture:** Source-of-truth pattern with automated synchronization

- Edit once in `.agents/` → automatically synced to all platforms
- 14 rules across 8 categories (coding standards, workflows)
- 9 reusable skills (progressive disclosure pattern)
- 3 slash commands + 1 autonomous agent
- MCP integration (Context7 for library documentation)
- Git hooks patterns (auto-format, protect-secrets, notify)

**Key Stats:** 287 files (40% reduction from 482), 576 lines of hooks (59% reduction)

---

## Essential Commands

### Development Workflow

```bash
# Documentation site
npm run docs:dev          # Start VitePress dev server (port 5173)
npm run docs:build        # Build static documentation
npm run docs:preview      # Preview built site

# Linting and Formatting
npm run format            # Format all files with Prettier
npm run format:check      # Check formatting without changes

# Git Pre-commit (Husky + lint-staged)
# Automatically runs on commit:
# - Prettier formatting on staged files
# - Configured in package.json "lint-staged" section
```

### Synchronization (Critical)

```bash
# Master sync - Run after ANY change in .agents/
./.agents/sync-all.sh

# Individual component syncs
./.agents/rules/sync-rules.sh       # Rules and skills
./.agents/mcp/sync-mcp.sh           # MCP configurations
./.agents/hooks/sync-hooks.sh       # Git hooks

# Dry run (preview changes)
./.agents/sync-all.sh --dry-run
./.agents/rules/sync-rules.sh --dry-run
```

### Verification

```bash
# Verify symlinks point correctly
readlink .cursor/rules    # Should: ../.agents/rules
readlink .claude/rules    # Should: ../.agents/rules
ls -la .cursor/skills     # Should show: lrwxr-xr-x (symlink)

# Validate generated configs
jq . .cursor/mcp.json
jq . .claude/mcp.json
jq empty .agents/mcp/mcp-servers.json  # Validate source JSON

# Check hooks configuration
jq .hooks .claude/settings.json
ls -la .claude/hooks/
```

---

## Architecture Overview

### The Source-of-Truth Pattern

```
.agents/                      # ← SINGLE SOURCE OF TRUTH
├── rules/                    # 14 rules (coding standards)
│   ├── code/                 # principles.md, style.md
│   ├── content/              # copywriting.md
│   ├── design/               # web-design.md (800+ line accessibility)
│   ├── frameworks/           # react-native.md
│   ├── process/              # git-workflow.md, documentation.md
│   ├── quality/              # testing.md, testing-scripts.md
│   ├── team/                 # skills-management.md, third-party-security.md
│   └── tools/                # use-context7.md, claude-code-extensions.md
│
├── skills/                   # 9 skills (progressive disclosure)
│   ├── team-skill-creator/   # Meta-skill for creating components
│   ├── command-development/  # Command creation workflows
│   ├── agent-development/    # Agent patterns
│   ├── skill-development/    # Skill architecture
│   └── ...
│
├── commands/                 # 3 slash commands
│   ├── commit.md             # Smart commit generation
│   ├── improve-docs.md       # Doc auditing
│   └── sync-setup.md         # Run sync-all.sh
│
├── subagents/                # 1 autonomous agent
│   └── doc-improver.md       # Documentation auditor
│
├── mcp/                      # MCP server configs
│   ├── mcp-servers.json      # ← Source (universal format)
│   └── sync-mcp.sh           # Generates platform JSONs
│
├── hooks/                    # Git workflow automation
│   ├── scripts/              # notify.sh, auto-format.sh, protect-secrets.sh
│   └── sync-hooks.sh         # Generates platform configs
│
├── orchestrator/             # Orchestrator docs
│   ├── AGENTS.md             # ← This file
│   └── sync-orchestrator.sh  # Creates root symlinks
│
└── sync-all.sh               # ← Master sync (runs all)
```

### Synchronization Strategies by Component

**1. Symlinks (Instant Propagation)**

- **Used for:** Skills, Commands, Subagents, Orchestrator docs
- **How:** `ln -s ../.agents/skills .cursor/skills`
- **Why:** Zero duplication, instant updates, filesystem-native

**2. Symlinks + Copy (Rules - Hybrid)**

- **Symlink:** Claude Code, Antigravity (support nested structure)
- **Copy:** Cursor (no subdirectory support, requires `.mdc` extension)
- **Generated Index:** Gemini CLI (no native rules support)

**3. Script Generation (MCP, Hooks)**

- **Why:** Each platform requires different JSON structure
- **Process:** Universal source → platform-specific JSONs
- **Commit:** Both source AND generated files

**4. Conversion (Gemini Commands)**

- **Process:** `.md` → `.toml` (Gemini requirement)
- **Auto-converts:** Every sync-commands.sh run

### Platform Support Matrix

| Component     | Cursor                                  | Claude Code           | Gemini CLI            | Antigravity               |
| ------------- | --------------------------------------- | --------------------- | --------------------- | ------------------------- |
| Rules         | ✅ Copy (.mdc, flat)                    | ✅ Symlink            | ❌ Index only         | ✅ Symlink                |
| Skills        | ✅ Symlink                              | ✅ Symlink            | ✅ Symlink            | ✅ Symlink                |
| Commands      | ✅ Symlink                              | ✅ Symlink            | ✅ Generated (.toml)  | ✅ Symlink (as workflows) |
| Subagents     | ✅ Symlink                              | ✅ Symlink            | ✅ Symlink            | ❌ Not supported          |
| MCP (Project) | ✅ Generated                            | ✅ Generated          | ✅ Generated          | ❌ Global only            |
| Hooks         | ✅ Partial (2/3 hooks, NO Notification) | ✅ Full (all 3 hooks) | ✅ Full (all 3 hooks) | ❌ Global only            |

**Critical Limitations:**

- **Cursor:** No subdirectories, requires `.mdc` extension, `name` field mandatory
- **Antigravity:** No project MCP, no subagents, requires reload after sync
- **Gemini:** No native rules (uses index), commands need TOML format

---

## Critical Workflows

### Adding a New Rule

```bash
# 1. Create rule file (categorized subdirectory)
cat > .agents/rules/team/api-standards.md << 'EOF'
---
name: api-standards                    # Cursor (REQUIRED)
description: API design standards      # All platforms
alwaysApply: false                     # Cursor (optional)
globs: ["src/api/**/*.ts"]            # Cursor (optional)
argument-hint: <api-file>              # Claude/Gemini (optional)
paths: ["src/api/**/*.ts"]            # Claude (optional)
trigger: always_on                     # Antigravity (optional)
---

# API Standards

Review these files for compliance: $ARGUMENTS

## Rules
- REST endpoints use `/api/v1/{resource}` structure
- All endpoints validate input with Zod
- Error responses use standard format

## Output Format
Use `file:line` format (VS Code clickable).
EOF

# 2. Verify character count (must be < 12,000)
wc -c .agents/rules/team/api-standards.md

# 3. Sync to all platforms
./.agents/rules/sync-rules.sh

# 4. Verify
ls .cursor/rules/api-standards.mdc              # Cursor (converted)
cat .claude/rules/team/api-standards.md         # Claude (symlink)
cat .gemini/GEMINI.md | grep api-standards      # Gemini (index)

# 5. Commit source only (symlinks auto-restore)
git add .agents/rules/team/api-standards.md
git commit -m "docs: Add API design standards rule"
```

### Adding an MCP Server

```bash
# 1. Edit source configuration
vim .agents/mcp/mcp-servers.json

# Add server entry (merge with existing JSON):
{
  "servers": {
    "my-server": {
      "platforms": ["cursor", "claude", "gemini"],
      "description": "My documentation server",
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@scope/package-name"],
      "env": {
        "API_KEY": "${MY_SERVER_API_KEY}"
      }
    }
  }
}

# 2. Validate JSON syntax
jq empty .agents/mcp/mcp-servers.json

# 3. Generate platform-specific configs
./.agents/mcp/sync-mcp.sh

# 4. Commit BOTH source and generated files
git add .agents/mcp/mcp-servers.json
git add .cursor/mcp.json .claude/mcp.json .gemini/settings.json
git commit -m "feat: Add my-server MCP integration"

# 5. Restart Claude Code/Cursor to detect new server
# Verify: claude mcp list
```

### Creating a Skill

```bash
# Automated (Recommended) - Use team-skill-creator skill
# In AI conversation:
"Create a skill for React component testing with test templates"

# Manual alternative:
mkdir -p .agents/skills/react-testing/{references,examples,assets,scripts}

cat > .agents/skills/react-testing/SKILL.md << 'EOF'
---
name: react-testing
description: This skill should be used when the user asks to "test React component", "write component tests". React component testing patterns and utilities.
version: 1.0.0
---

# React Testing Skill

Testing patterns for React components.

## Overview
- Jest + React Testing Library patterns
- Accessibility testing (jest-axe)
- Mocking patterns (MSW for API calls)

## References
See references/testing-patterns.md for deep dive.
EOF

# Sync
./.agents/sync-all.sh

# Verify
ls .cursor/skills/react-testing/
ls .claude/skills/react-testing/

# Commit
git add .agents/skills/react-testing/
git commit -m "feat: Add React testing skill with patterns and utilities"
```

---

## Rules System Deep Dive

### Universal YAML Frontmatter (All Platforms)

```yaml
---
name: rule-name # Cursor only (REQUIRED for Cursor)
description: Brief description # All platforms
alwaysApply: false # Cursor only (optional, default: false)
globs: ["**/*.ts", "**/*.tsx"] # Cursor only (optional)
argument-hint: <file-pattern> # Claude/Gemini (optional)
paths: ["src/**/*.ts"] # Claude only (optional)
trigger: always_on # Antigravity only (optional)
---
```

**Critical Warnings:**

- Missing `name` field → Cursor silently ignores rule (won't appear in UI)
- Each platform ignores unsupported fields (safe to include all)
- Never create platform-specific files (one file with all fields)
- Test on target platforms after creating new rules

### Rules Character Limit: 12,000

Why 12,000 characters?

- Cursor recommendation for optimal performance
- Balance between detail and loading speed
- Cross-platform compatibility sweet spot

```bash
# Check rule size before committing
wc -c .agents/rules/design/web-design.md
# Output: 8432 .agents/rules/design/web-design.md

# All rules in category
for rule in .agents/rules/code/*.md; do
  echo "$(wc -c < "$rule") - $rule"
done
```

### Rules Categories Explained

**`code/`** - Core programming principles

- `principles.md` - Architectural decisions, source-of-truth pattern
- `style.md` - Bash, Markdown, JSON conventions

**`content/`** - Writing standards

- `copywriting.md` - 800-line comprehensive copywriting guide

**`design/`** - UI/UX standards

- `web-design.md` - 800+ line accessibility checklist (Vercel guidelines)

**`frameworks/`** - Framework-specific

- `react-native.md` - React Native patterns

**`process/`** - Development workflows

- `git-workflow.md` - Branch naming, commit messages, PR process
- `documentation.md` - Markdown, README patterns

**`quality/`** - Testing standards

- `testing.md` - Testing philosophy, manual testing
- `testing-scripts.md` - Bash script testing patterns

**`team/`** - Team conventions

- `skills-management.md` - Skills lifecycle, progressive disclosure
- `third-party-security.md` - Dependency review process

**`tools/`** - Tool-specific

- `use-context7.md` - Proactive Context7 usage for library docs
- `claude-code-extensions.md` - Claude Code extensions guide

---

## Skills System Deep Dive

### Progressive Disclosure Pattern

```
.agents/skills/skill-name/
├── SKILL.md              # ← Always loaded (essentials only)
├── references/           # ← On-demand (deep documentation)
│   ├── advanced.md
│   └── patterns.md
├── examples/             # ← On-demand (usage samples)
│   ├── basic.md
│   └── advanced.md
├── assets/               # ← On-demand (templates, resources)
│   └── template.ts
└── scripts/              # ← On-demand (executable utilities)
    └── validate.sh
```

**Why Progressive Disclosure?**

- Fast loading: Only SKILL.md initially (context window efficiency)
- Deep context: Load references/ when agent needs details
- Resources bundled: Templates accessible in same package
- Scalable: Add depth without bloating initial load

### Skill Frontmatter

```yaml
---
name: skill-name
description: This skill should be used when the user asks to "trigger phrase 1", "trigger phrase 2", "trigger phrase 3". Brief context about what this skill provides.
version: 1.0.0
---
```

**Description best practices:**

- Use third-person form
- List 2-4 specific trigger phrases in quotes
- Keep under 200 characters
- Examples:
  - ✅ "This skill should be used when the user asks to 'create a skill', 'add agent capability'. Provides skill scaffolding and validation."
  - ❌ "Create skills" (too vague)
  - ❌ "I help with creating skills" (first person)

### Available Skills

**Meta-Skills (Creating Components):**

- `team-skill-creator` - Meta-skill for creating skills/commands/agents with auto-sync
- `command-development` - Command creation workflows and patterns
- `agent-development` - Agent architecture and system prompts
- `skill-development` - Skill structure and progressive disclosure
- `skill-creator` - Generic skill scaffold generator

**Development Skills:**

- `mcp-integration` - MCP server setup and configuration workflows
- `hook-development` - Git hooks patterns (pre-commit, post-merge)
- `commit-management` - Git commit message workflows and conventions
- `find-skills` - Skill discovery utility (searches available skills)

---

## Commands System

### Available Commands

| Command         | Purpose                             | Invokes                 |
| --------------- | ----------------------------------- | ----------------------- |
| `/commit`       | Smart commit message generation     | commit-management skill |
| `/improve-docs` | Documentation audit and improvement | doc-improver agent      |
| `/sync-setup`   | Synchronize all configurations      | sync-all.sh script      |

### Command → Agent → Skill Pattern

```
User: /improve-docs docs/guides
    ↓
Command: improve-docs.md (slash command)
    ↓
Agent: doc-improver.md (autonomous workflow)
    ↓
Skill: skill-development (progressive disclosure)
    ↓
Rule: documentation.md (standards)
    ↓
Result: Audit report with prioritized recommendations
```

Example workflow:

1. User runs `/improve-docs`
2. Command invokes `doc-improver` agent
3. Agent reads `documentation.md` rule for standards
4. Agent uses `skill-development` patterns for structure analysis
5. Agent outputs audit with high/medium/low priority issues
6. User approves fixes, agent implements changes

---

## MCP Integration

### Context7 Server (Currently Configured)

**Purpose:** Up-to-date library and framework documentation

**Supported libraries:** React, Next.js, TypeScript, Node.js, Vue, Angular, etc.

**Usage:** Automatically triggered by `use-context7.md` rule

- No need to explicitly request
- Proactively used for library questions
- Always prefer Context7 over outdated knowledge

**Configuration location:**

- Source: `.agents/mcp/mcp-servers.json`
- Generated: `.cursor/mcp.json`, `.claude/mcp.json`, `.gemini/settings.json`
- Antigravity: `~/.gemini/antigravity/mcp_config.json` (global only)

**API Key:** Set `CONTEXT7_API_KEY` in `.agents/mcp/.env`

### Adding New MCP Servers

See [Adding an MCP Server](#adding-an-mcp-server) section above.

**Platform-specific formats:**

- **Cursor:** `mcpServers` object, no metadata
- **Claude Code:** `mcpServers` object, with metadata
- **Gemini CLI:** Nested in `settings.json` `mcpServers`
- **Antigravity:** Global config only (not project-level)

---

## Git Hooks System

### Available Hooks (3)

**1. notify.sh** - Notification events

- Platform: Claude Code, Gemini CLI (NOT Cursor - no Notification event)
- Purpose: Send notifications for important events
- Example: Notify on sync completion

**2. auto-format.sh** - Code formatting

- Platform: Claude Code, Gemini CLI, Cursor
- Purpose: Auto-format code before operations
- Example: Run Prettier before commit

**3. protect-secrets.sh** - Secret detection

- Platform: Claude Code, Gemini CLI, Cursor
- Purpose: Prevent committing secrets
- Example: Block commit if `.env` file in staging

### Hook Configuration Locations

**Claude Code:** `.claude/settings.json` (PascalCase events)

```json
{
  "hooks": {
    "PreToolUse": [{ "scriptPath": ".claude/hooks/protect-secrets.sh" }],
    "PostToolUse": [{ "scriptPath": ".claude/hooks/auto-format.sh" }],
    "Notification": [{ "scriptPath": ".claude/hooks/notify.sh" }]
  }
}
```

**Gemini CLI:** `.gemini/settings.json` (BeforeTool/AfterTool)

```json
{
  "hooks": {
    "BeforeTool": [{ "scriptPath": ".gemini/hooks/protect-secrets.sh" }],
    "AfterTool": [{ "scriptPath": ".gemini/hooks/auto-format.sh" }],
    "Notification": [{ "scriptPath": ".gemini/hooks/notify.sh" }]
  }
}
```

**Cursor:** `.cursor/hooks.json` (camelCase, NO Notification)

```json
{
  "version": 1,
  "hooks": {
    "preToolUse": [{ "scriptPath": ".cursor/hooks/protect-secrets.sh" }],
    "postToolUse": [{ "scriptPath": ".cursor/hooks/auto-format.sh" }]
  }
}
```

**Scripts:** Symlinked from `.agents/hooks/scripts/`

---

## Commit Message Format

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
type: Brief summary (50 chars or less)

Detailed explanation if needed. Wrap at 72 characters.
Explain WHAT changed and WHY, not HOW.

- Bullet points for multiple changes
- Focus on impact and rationale

Refs: #issue-number
Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

### Commit Types

- `feat:` New feature or functionality
- `fix:` Bug fix
- `docs:` Documentation only changes
- `refactor:` Code restructuring without behavior change
- `test:` Adding or updating tests
- `chore:` Maintenance tasks (dependencies, configs)
- `perf:` Performance improvements
- `style:` Code formatting (no logic change)

### Examples

```
feat: Add API conventions rule and patterns skill

Implemented comprehensive API standards:
- REST API conventions (error handling, pagination, versioning)
- GraphQL schema patterns
- Authentication/authorization patterns

Includes templates and validation scripts.

Refs: #45
Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

```
fix: Resolve symlink creation error on Windows

Fixed path resolution in sync-all.sh to work with
Windows Developer Mode symlinks. Added check for
elevated permissions.

Refs: #72
Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

---

## Common Pitfalls & Troubleshooting

### Rule Not Appearing in Cursor

**Symptom:** Rule file exists but doesn't show in Cursor settings

**Causes:**

1. Missing `name` field in YAML frontmatter ❌
2. File is `.md` instead of `.mdc` ❌
3. Rule in subdirectory (Cursor doesn't support) ❌
4. YAML frontmatter malformed ❌

**Solution:**

```bash
# Check .mdc files exist
ls .cursor/rules/*.md  # Should be empty

# Verify YAML has 'name' field
head -10 .agents/rules/my-rule.md

# Re-run sync
./.agents/rules/sync-rules.sh

# Verify in Cursor: Settings → Rules → Check rule appears
```

### Changes Not Propagating

**Cursor rules (copied, not symlinked):**

```bash
./.agents/rules/sync-rules.sh  # Must re-run after edits
```

**Claude/Gemini/Antigravity (symlinked):**

```bash
# Changes instant, just verify symlink exists
readlink .claude/rules  # Should: ../.agents/rules
```

**Antigravity specifically:**

```bash
# Close and reopen project (rules cached)
```

### MCP Server Not Loading

**All platforms:**

```bash
# 1. Restart AI platform
# 2. Verify environment variables
cat .agents/mcp/.env

# 3. Validate JSON
jq empty .agents/mcp/mcp-servers.json

# 4. Regenerate configs
./.agents/mcp/sync-mcp.sh

# 5. Check generated files
jq . .cursor/mcp.json
```

**Claude Code specific:**

```bash
# Verify server appears
claude mcp list  # Should show: context7

# Test server
# In conversation: "Show me React documentation for useEffect"
```

**Antigravity specific:**

```bash
# Check GLOBAL config (project-level not supported)
cat ~/.gemini/antigravity/mcp_config.json
```

### Symlink Issues

```bash
# Verify symlink (look for "l" prefix)
ls -ld .cursor/skills
# lrwxr-xr-x = symlink ✅
# drwxr-xr-x = directory ❌

# Check symlink target
readlink .cursor/skills  # Should: ../.agents/skills

# Verify source exists
ls -la .agents/skills

# Recreate manually if needed
rm -rf .cursor/skills
ln -s ../.agents/skills .cursor/skills
```

**Windows users:**

- Enable Developer Mode: Settings → Update & Security → For Developers
- Or run as Administrator

---

## Key Principles

### 1. Single Source of Truth

- Edit only in `.agents/`
- Never edit platform directories (`.cursor/`, `.claude/`, etc.) directly
- Sync scripts handle distribution

### 2. Commit Patterns

- **Symlinked resources:** Commit source only (`.agents/rules/`, `.agents/skills/`)
- **Generated configs:** Commit both source AND generated (`.agents/mcp/mcp-servers.json` + platform JSONs)
- Symlinks auto-restore on clone (Git handles them correctly)

### 3. Sync After Every Change

```bash
# Changed anything in .agents/? Run sync
./.agents/sync-all.sh

# Or individual component syncs
./.agents/rules/sync-rules.sh
./.agents/mcp/sync-mcp.sh
```

### 4. Test on Target Platforms

- Cursor: Open Settings → Rules → Verify rule appears
- Claude Code: `claude mcp list` → Verify servers
- Verify symlinks: `ls -la .cursor/skills`

---

## Documentation System

**VitePress powered:** Bilingual support (EN/ES)

**Structure:**

- `docs/en/guides/` - How-to guides (task-oriented)
- `docs/en/references/` - Technical documentation (system-oriented)
- `docs/en/notes/` - Research, comparisons, explorations
- `docs/.vitepress/config.js` - Site configuration

**Key References:**

- [Complete Setup Guide](docs/en/guides/setup.md)
- [MCP Setup Guide](docs/guides/mcp/mcp-setup-guide.md)
- [Antigravity Limitations](docs/guides/mcp/ANTIGRAVITY_LIMITATION.md)
- [Rules Documentation](docs/en/references/rules/memory-and-rules.md)
- [Skills Reference](docs/en/references/skills.md)
- [MCP Quick Reference](docs/en/references/mcp.md)

---

## References

**Project Documentation:**

- Platform limitations: `docs/guides/mcp/ANTIGRAVITY_LIMITATION.md`
- Rules guide: `.agents/rules-readme.md`
- Core principles: `.agents/rules/code/principles.md`
- Skills management: `.agents/rules/team/skills-management.md`
- Git workflow: `.agents/rules/process/git-workflow.md`
- Testing guidelines: `.agents/rules/quality/testing.md`

**README Files:**

- Project root: `README.md` (comprehensive project overview)
- Rules: `.agents/rules-readme.md`
- Skills: Documented in individual SKILL.md files
- Commands: `.agents/commands-readme.md`
- MCP: `.agents/mcp-readme.md`
- Hooks: `.agents/hooks-readme.md`

**External Standards:**

- [agents.md](https://agents.md) - Universal agent configuration standard
- [skills.sh](https://skills.sh) - Skills ecosystem documentation
- [Context7](https://context7.com) - MCP documentation server
- [Conventional Commits](https://www.conventionalcommits.org/)
