# LIDR Multi-Agent AI Development Template

> Enterprise-grade configuration management for AI-assisted development across 5 platforms

[![License](https://img.shields.io/badge/license-ISC-blue.svg)](LICENSE)
[![Platforms](https://img.shields.io/badge/platforms-Cursor%20%7C%20Claude%20%7C%20Gemini%20%7C%20Antigravity%20%7C%20Copilot-green.svg)](docs/en/guides/setup.md)
[![MCP](https://img.shields.io/badge/MCP-Context7-purple.svg)](https://context7.com)
[![Documentation](https://img.shields.io/badge/docs-VitePress-brightgreen.svg)](docs/)
[![AGENTS.md](https://img.shields.io/badge/standard-agents.md-orange.svg)](https://agents.md)

**One source of truth.** Edit once in `.agents/`, automatically synchronized to Cursor, Claude Code, Gemini CLI, Antigravity, and GitHub Copilot (VSCode).

**Stats:**

- 📏 287 total files (40% reduction from 482)
- 📋 14 rules across 8 categories
- 🧩 9 reusable skill packages
- ⚙️ 3 slash commands + 1 autonomous agent
- 🔌 MCP integration (Context7)
- 🪝 Git hooks patterns documented

---

## Quick Start

**Prerequisites:** Node.js 18+, Git, one AI platform (Cursor/Claude/Gemini/Antigravity/Copilot)

```bash
# 1. Clone and setup
git clone https://github.com/LIDR-IT/ai-assisted-workflow.git my-project
cd my-project
cp .agents/mcp/.env.example .agents/mcp/.env
# Edit .env and add CONTEXT7_API_KEY

# 2. Sync all configurations
./.agents/sync-all.sh

# 3. Verify
ls -la .cursor/skills .claude/rules .gemini/commands
```

**Next steps:** See [Getting Started](#getting-started) for detailed setup and verification.

---

## Features

### 1. 📋 Agents (Memory & Rules)

**14 rules across 8 categories** provide intelligent context to all AI agents.

**Categories:**

- `code/` - principles.md, style.md
- `content/` - copywriting.md
- `design/` - web-design.md
- `frameworks/` - react-native.md
- `process/` - git-workflow.md, documentation.md
- `quality/` - testing.md, testing-scripts.md
- `team/` - skills-management.md, third-party-security.md
- `tools/` - use-context7.md, claude-code-extensions.md

**Example:** `web-design.md` - 800+ line accessibility checklist automatically applied to UI code reviews

**Autonomous Agent:** `doc-improver` audits documentation structure, identifies gaps, suggests improvements

**Universal YAML frontmatter:**

```yaml
---
name: web-design # Cursor
description: Web interface design guidelines # All platforms
alwaysApply: false # Cursor
globs: ["**/*.{tsx,jsx}"] # Cursor
argument-hint: <file-or-pattern> # Claude/Gemini
paths: ["src/**/*.{tsx,jsx}"] # Claude
trigger: always_on # Antigravity
---
```

**Character limit:** 12,000 chars per rule (Cursor recommendation + cross-platform compatibility)

**Learn more:** [Rules Documentation](docs/en/references/rules/memory-and-rules.md)

---

### 2. 🎓 Subagents (Teaching Skills)

**9 specialized skills** that teach agents how to create more agents, following progressive disclosure pattern.

**Teaching Skills:**

- `team-skill-creator` - Meta-skill for creating skills/commands/agents with auto-sync
- `command-development` - Comprehensive command creation workflow
- `agent-development` - Full agent development guide
- `skill-development` - Deep dive into skill patterns
- `skill-creator` - Generic skill creation
- `mcp-integration` - MCP server setup workflows
- `hook-development` - Git hooks patterns
- `commit-management` - Git commit workflows
- `find-skills` - Skill discovery utility

**Progressive Disclosure Pattern:**

```
SKILL.md (essentials, always loaded)
    ↓
references/ (deep documentation, on-demand)
    ↓
examples/ (usage samples)
    ↓
assets/ (templates, resources)
    ↓
scripts/ (executable utilities)
```

**Example Usage:**

```
User: "Create a skill for React component testing with test templates"

# team-skill-creator activates:
1. Creates .agents/skills/react-testing/ structure
2. Generates SKILL.md with frontmatter
3. Adds references/ and assets/ directories
4. Runs ./.agents/sync-all.sh automatically
5. Verifies sync across all platforms
```

**Learn more:** [team-skill-creator SKILL.md](.agents/skills/team-skill-creator/SKILL.md)

---

### 3. 🧩 Skills (Reusable Knowledge)

**9 skill packages** with bundled resources (scripts, references, templates).

**Structure Pattern:**

```
.agents/skills/skill-name/
├── SKILL.md              # Core instructions (always loaded)
├── references/           # Deep documentation (on-demand)
├── examples/             # Usage examples
├── assets/               # Templates, resources
└── scripts/              # Executable utilities
```

**Available Skills:**

- `agent-development` - Agent creation patterns
- `command-development` - Command creation workflows
- `commit-management` - Git commit workflows
- `find-skills` - Skill discovery
- `hook-development` - Git hooks patterns
- `mcp-integration` - MCP server setup
- `skill-creator` - Skill scaffold generator
- `skill-development` - Skill architecture patterns
- `team-skill-creator` - Meta-skill for creating components

**Why Progressive Disclosure?**

- **Fast loading:** Only SKILL.md loaded initially
- **Deep context:** references/ loaded on-demand when needed
- **Examples ready:** Sample code accessible when implementing
- **Resources bundled:** Templates and utilities in same package

**Learn more:** [Skills Management](.agents/rules/team/skills-management.md)

---

### 4. 🔌 MCP (Model Context Protocol)

**Context7 integration** providing up-to-date documentation for popular libraries and frameworks.

**Current Servers:**

- **Context7** - Framework/library documentation access (React, Next.js, TypeScript, etc.)

**Platform Support:**

| Platform         | Project-Level | Global | Config Location                         |
| ---------------- | ------------- | ------ | --------------------------------------- |
| Cursor           | ✅            | ✅     | `.cursor/mcp.json`                      |
| Claude Code      | ✅            | ✅     | `.claude/mcp.json`                      |
| Gemini CLI       | ✅            | ✅     | `.gemini/settings.json`                 |
| Antigravity      | ❌            | ✅     | `~/.gemini/antigravity/mcp_config.json` |
| Copilot (VSCode) | ✅            | ✅     | `.vscode/mcp.json`                      |

**Add New MCP Server:**

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

# 2. Generate platform-specific configs
./.agents/mcp/sync-mcp.sh

# 3. Commit BOTH source and generated files
git add .agents/mcp/mcp-servers.json
git add .cursor/mcp.json .claude/mcp.json .gemini/settings.json
git commit -m "feat: Add my-server MCP integration"
```

**Learn more:** [MCP Setup Guide](docs/guides/mcp/mcp-setup-guide.md) | [Antigravity Limitations](docs/guides/mcp/ANTIGRAVITY_LIMITATION.md)

---

### 5. 🪝 Hooks (Lifecycle Automation)

**Git hooks patterns** documented for pre-commit, post-merge automation.

**Available Patterns:**

- **Pre-commit validation** - Check rules character count, validate JSON
- **Post-merge sync** - Auto-run sync scripts after pulling changes
- **Pre-push checks** - Verify sync status before pushing

**Example Hook:**

```bash
#!/bin/bash
# .git/hooks/pre-commit

# Validate rules don't exceed 12,000 characters
for rule in .agents/rules/**/*.md; do
  chars=$(wc -c < "$rule")
  if [ $chars -gt 12000 ]; then
    echo "❌ Rule exceeds 12,000 chars: $rule ($chars chars)"
    exit 1
  fi
done

# Validate JSON files
for json in .agents/mcp/*.json; do
  if ! jq empty "$json" 2>/dev/null; then
    echo "❌ Invalid JSON: $json"
    exit 1
  fi
done

echo "✅ Pre-commit checks passed"
```

**Learn more:** [Hooks Reference](docs/references/hooks/)

---

### 6. ⚙️ Commands (User Interface)

**3 slash commands** providing convenient interfaces to agents and workflows.

**Available Commands:**

| Command         | Purpose                             | Invokes                 |
| --------------- | ----------------------------------- | ----------------------- |
| `/commit`       | Smart commit message generation     | commit-management skill |
| `/improve-docs` | Documentation audit and improvement | doc-improver agent      |
| `/sync-setup`   | Synchronize all configurations      | sync-all.sh script      |

**Command → Agent → Skill Pattern:**

```
User types: /improve-docs docs/guides
    ↓
Command: improve-docs.md
    ↓
Agent: doc-improver.md (autonomous workflow)
    ↓
Rule: documentation.md (standards)
    ↓
Result: Audit report with recommendations
```

**Usage Examples:**

```bash
# In Claude Code CLI
/improve-docs docs/guides

# In Cursor
/commit

# Direct invocation
/sync-setup
```

**Learn more:** [Commands README](.agents/commands-readme.md) | [Agents README](.agents/agent-readme.md)

---

## Architecture

### Source-of-Truth Pattern

All AI agent configurations centralized in `.agents/` directory:

```
.agents/                      # ← Single source of truth
├── rules/                    # 14 rules, 8 categories
├── skills/                   # 9 skill packages
├── commands/                 # 3 slash commands
├── subagents/                # Specialized subagents
├── mcp/                      # MCP server configs
└── sync-all.sh               # Master sync script

orchestrator/                 # ← Orchestrator documentation
└── AGENTS.md                 # Source of truth for agent docs

Root symlinks:
├── AGENTS.md → orchestrator/AGENTS.md
├── CLAUDE.md → orchestrator/AGENTS.md
└── GEMINI.md → orchestrator/AGENTS.md
```

**Key principles:**

- Edit once in `.agents/`, automatically synchronized to all platforms
- One orchestrator, multiple subagents - edit any root symlink to update all
- Bidirectional editing: changes to `CLAUDE.md`, `GEMINI.md`, or `AGENTS.md` update the orchestrator source

### Synchronization Strategies

**4 sync strategies** optimized per platform:

#### 1. Symlinks (Instant Propagation)

**Used for:** Skills, Commands, Subagents, Orchestrator docs
**Platforms:** Cursor, Claude Code, Gemini CLI

**Technical implementation:**

```bash
# Create full directory symlinks
ln -s ../.agents/skills .cursor/skills
ln -s ../.agents/skills .claude/skills
ln -s ../.agents/skills .gemini/skills
```

**Advantages:**

- Changes propagate instantly
- Zero duplication
- Filesystem-native
- Git handles symlinks correctly

**Limitations:**

- Windows requires Developer Mode
- Check with: `readlink .cursor/skills` (should output: `../.agents/skills`)

**Verification:**

```bash
# Verify symlink created
ls -la .cursor/skills
# Output: lrwxr-xr-x ... .cursor/skills -> ../.agents/skills

# Test file access
cat .cursor/skills/team-skill-creator/SKILL.md
```

#### 2. Symlinks (Selective - Rules)

**Used for:** Rules distribution
**Platforms:** Claude Code only (via symlink); Antigravity reads natively from `.agents/`

**Why selective:** Cursor doesn't support subdirectories, Gemini has no native rules support

**Technical implementation:**

```bash
# Full directory symlink (supports nested structure)
ln -s ../.agents/rules .claude/rules
# Antigravity: no symlink needed — reads rules natively from .agents/rules/
```

**Platform-specific behavior:**

- **Claude Code:** Supports nested subdirectories → uses symlink
- **Antigravity:** Reads rules natively from `.agents/rules/` — no symlink required
- **Cursor:** No subdirectory support → requires copy+convert (Strategy #4)
- **Gemini CLI:** No native rules → requires index file (Strategy #3)

**Verification:**

```bash
# Verify symlink target (Claude Code)
readlink .claude/rules
# Output: ../.agents/rules

# Test nested access
cat .claude/rules/code/principles.md
```

#### 3. Script Generation

**Used for:** MCP configurations, Gemini rules index
**Scripts:** `sync-mcp.sh`, `sync-rules.sh`

**Why needed:** Each platform requires different JSON structure

**Technical details - MCP transformation:**

**Source (universal format):**

```json
{
  "servers": {
    "context7": {
      "platforms": ["cursor", "claude", "gemini"],
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"],
      "env": { "CONTEXT7_API_KEY": "${env:CONTEXT7_API_KEY}" }
    }
  }
}
```

**Generated (Cursor format):**

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"],
      "env": { "CONTEXT7_API_KEY": "${env:CONTEXT7_API_KEY}" }
    }
  }
}
```

**jq transformation:**

```bash
# Extract server config and transform
jq '.servers | to_entries | map({
  key: .key,
  value: (.value | {command, args, env})
}) | from_entries | {mcpServers: .}' mcp-servers.json
```

**Gemini index generation:**

```bash
# Generate GEMINI.md with categorized links
cat > .gemini/GEMINI.md << 'EOF'
# Rules Reference for Gemini CLI

## Code
- [principles.md](../.agents/rules/code/principles.md) - Core principles
- [style.md](../.agents/rules/code/style.md) - Code style

## Content
- [copywriting.md](../.agents/rules/content/copywriting.md) - Copywriting
...
EOF
```

#### 4. Copy + Convert (Cursor Rules)

**Used for:** Cursor rules only
**Reason:** Platform limitation - no subdirectories support, `.mdc` extension required

**Technical details:**

```bash
# Find all rules, copy to flat structure, convert to .mdc
find .agents/rules -type f -name "*.md" | while read rule; do
  # Extract filename (remove path and .md extension)
  base=$(basename "$rule" .md)

  # Copy to flat Cursor directory with .mdc extension
  cp "$rule" ".cursor/rules/${base}.mdc"

  # Update timestamp for file watchers (Antigravity caching)
  touch ".cursor/rules/${base}.mdc"
done
```

**Before sync:**

```
.agents/rules/
├── code/
│   ├── principles.md
│   └── style.md
└── content/
    └── copywriting.md
```

**After sync:**

```
.cursor/rules/
├── principles.mdc      # Flattened
├── style.mdc           # Flattened
└── copywriting.mdc     # Flattened
```

**Why `touch` needed:** Antigravity uses file watchers that detect changes via modification timestamp (mtime). `cp` doesn't update mtime, so `touch` forces timestamp update.

### Platform Support Matrix

| Component         | Cursor         | Claude Code  | Gemini CLI    | Antigravity      | Copilot (VSCode)           |
| ----------------- | -------------- | ------------ | ------------- | ---------------- | -------------------------- |
| **Rules**         | ✅ Copy (.mdc) | ✅ Symlink   | ❌ Index only | ✅ Native        | ✅ Copy (.instructions.md) |
| **Skills**        | ✅ Symlink     | ✅ Symlink   | ✅ Symlink    | ✅ Native        | ✅ Symlink                 |
| **Commands**      | ✅ Symlink     | ✅ Symlink   | ✅ Generated  | ✅ Native        | ✅ Copy (.prompt.md)       |
| **Agents**        | ✅ Symlink     | ✅ Symlink   | ✅ Symlink    | ❌ Not supported | ✅ Copy (.agent.md)        |
| **MCP (Project)** | ✅ Generated   | ✅ Generated | ✅ Generated  | ❌ Global only   | ✅ Generated               |

### Sync Execution Order

**Why sequence matters:**

```bash
#!/bin/bash
# .agents/sync-all.sh

# 1. Rules first (dependencies for agents)
./.agents/rules/sync-rules.sh

# 2. Skills (knowledge base)
./.agents/skills/sync-skills.sh

# 3. Commands (user interface)
./.agents/commands/sync-commands.sh

# 4. Agents (autonomous workflows, depend on rules/skills)
./.agents/agents/sync-agents.sh

# 5. MCP last (external integrations)
./.agents/mcp/sync-mcp.sh
```

### File Watching Behavior

**Antigravity caching:**

- Loads rules into memory on startup
- Detects changes via file modification timestamps
- **Problem:** If Antigravity already open, sync updates files but app doesn't detect
- **Solution:** Close and reopen project, or restart Antigravity

**Workflow:**

```bash
# Option 1: Sync BEFORE opening Antigravity (Recommended)
./.agents/sync-all.sh
# THEN open Antigravity → rules loaded with correct timestamps

# Option 2: Reload AFTER sync
# 1. Antigravity already open
# 2. Run sync: ./.agents/sync-all.sh
# 3. Close and reopen project in Antigravity
```

### Design Decisions

**Why centralized?**

- **Eliminate drift:** Single update point prevents configuration inconsistencies across team
- **Version control:** All changes tracked in one location
- **Easy auditing:** Clear ownership and change history
- **Team collaboration:** Everyone works on same configurations

**Why hybrid sync?**

- **Platform capabilities differ:** Some support symlinks, some don't; some support subdirectories, some don't
- **Graceful degradation:** Handle limitations without breaking functionality
- **Optimal strategy per component:** Use best approach for each (symlinks > generation > copy)
- **Transparent handling:** Sync scripts hide complexity from users

**Why `.agents/` directory?**

- **[agents.md](https://agents.md) standard:** Universal convention for agent configurations
- **Clear separation:** Distinct from `docs/` (documentation) and `src/` (code)
- **Consistent across platforms:** All 5 platforms recognize this pattern
- **Scalable:** Easy to add new components (agents, skills, commands, rules)

**Trade-offs accepted:**

- **Manual sync vs auto-watch:** Manual is safer (explicit, verifiable), can add git hooks if needed
- **Duplication (Cursor rules):** Necessary due to platform limitation, mitigated with automated sync
- **Learning curve:** Initial setup requires understanding sync strategies, but well-documented

**Learn more:** [Core Principles](.agents/rules/code/principles.md)

---

## Use Cases

### 1. Standardizing Team Code Reviews

**Scenario:** Development team wants consistent code review criteria across all AI platforms

**Solution:**

1. Create rule: `.agents/rules/code/review-checklist.md`
2. Add universal YAML frontmatter (works on all 5 platforms)
3. Run sync: `./.agents/rules/sync-rules.sh`
4. All agents automatically apply checklist

**Result:** Every code review follows same standards across Cursor, Claude Code, Gemini CLI, Antigravity, and Copilot

**Example rule:**

````markdown
---
name: review-checklist
description: Code review standards
alwaysApply: false
globs: ["**/*.{ts,tsx,js,jsx}"]
argument-hint: <file-to-review>
paths: ["src/**/*"]
trigger: always_on
---

# Code Review Checklist

Review these files for compliance: $ARGUMENTS

## Security

- [ ] No hardcoded credentials
- [ ] Input validation present
- [ ] SQL injection protected
- [ ] XSS prevention implemented

## Code Quality

- [ ] Functions under 50 lines
- [ ] No commented-out code
- [ ] Meaningful variable names
- [ ] Error handling present

## Testing

- [ ] Unit tests included
- [ ] Edge cases covered
- [ ] Test coverage >80%

## Output Format

Use `file:line` format (VS Code clickable).

```text
## src/api/users.ts

src/api/users.ts:42 - hardcoded API key → use env variable
src/api/users.ts:67 - no input validation on email
src/api/users.ts:89 - SQL query vulnerable to injection

## src/components/Form.tsx

✓ pass
```
````

````

---

### 2. Building Reusable API Patterns

**Scenario:** Backend team has specific API conventions, wants AI to generate code following patterns

**Solution:**
1. Create skill: `.agents/skills/api-conventions/`
2. Add main instructions: `SKILL.md`
3. Add deep documentation: `references/rest-patterns.md`
4. Add templates: `assets/controller-template.ts`
5. Skill auto-syncs to all platforms

**Result:** Any agent can generate API code following team conventions

**Skill structure:**
```
.agents/skills/api-conventions/
├── SKILL.md                     # Core patterns (always loaded)
├── references/
│   ├── rest-patterns.md         # Deep REST guidance
│   ├── graphql-patterns.md      # GraphQL conventions
│   └── authentication.md        # Auth patterns
├── examples/
│   ├── user-controller.ts       # Example implementation
│   └── auth-middleware.ts
└── assets/
    ├── controller-template.ts   # Boilerplate generator
    └── test-template.spec.ts
```

**SKILL.md example:**
```markdown
---
name: api-conventions
description: This skill should be used when the user asks to "create an API endpoint", "generate controller", "add REST route". Backend API conventions for this project.
version: 1.0.0
---

# API Conventions Skill

Team-specific patterns for building REST and GraphQL APIs.

## Overview

Use this skill when generating API endpoints, controllers, or routes.

## REST Patterns

All REST endpoints follow:
- `/api/v1/{resource}/{id}` URL structure
- Controller → Service → Repository layers
- Zod for input validation
- Standard error responses

See references/rest-patterns.md for complete guide.

## GraphQL Patterns

See references/graphql-patterns.md

## Templates

Use assets/controller-template.ts for new controllers.
```

---

### 3. Onboarding New Developers

**Scenario:** New team member needs to learn project patterns quickly

**Solution:**
1. Clone repository
2. Run `./.agents/sync-all.sh`
3. All rules, skills, commands available immediately in their AI agents

**Result:** New developer's AI agents already know:
- Git workflow (via `git-workflow.md` rule)
- Testing standards (via `testing.md` rule)
- Documentation standards (via `documentation.md` rule)
- Code style (via `style.md` rule)
- Available skills (via `/find-skills` command)

**Time to productivity:** <5 minutes vs hours of reading docs

**Workflow:**
```bash
# Day 1: New developer joins
git clone team-repo.git
cd team-repo
./.agents/sync-all.sh

# AI agents now have:
# - 14 project rules
# - 9 reusable skills
# - 3 slash commands
# - 1 autonomous agent
# - MCP integration

# Developer starts coding immediately with AI assistance
# AI automatically applies team standards
```

---

### 4. Managing Third-Party Dependencies

**Scenario:** Security team needs to audit all external packages consistently

**Solution:**
1. Use rule: `.agents/rules/team/third-party-security.md`
2. AI agents automatically check during code review:
   - License compatibility
   - Known vulnerabilities (CVEs)
   - Update frequency
   - Maintainer reputation
   - Breaking change history

**Result:** Consistent security review across all dependency additions, regardless of which developer or AI platform

**Example interaction:**
```
Developer: "Add lodash to the project"

AI (using third-party-security.md rule):
"Analyzing lodash dependency:

✅ License: MIT (compatible)
✅ Security: No known CVEs in latest version
⚠️  Size: 72KB (consider lodash-es for tree-shaking)
✅ Maintenance: Active (updated 2 weeks ago)
✅ Reputation: 50M+ weekly downloads

Recommendation:
- Use `lodash-es` instead for better tree-shaking
- Install: npm install lodash-es
- Import: import { debounce } from 'lodash-es'

Proceed with lodash-es?"
```

---

### 5. Multi-Platform Development

**Scenario:** Team uses different AI platforms:
- Designer uses Cursor (UI work)
- Backend dev uses Claude Code (API development)
- DevOps uses Gemini CLI (scripts and automation)

**Solution:**
1. Central configuration in `.agents/`
2. Platform-specific sync strategies
3. Same rules/skills available everywhere

**Result:** Designer, backend dev, and DevOps all have consistent AI assistance despite using different platforms

**Example workflow:**
```
Designer (Cursor):
- Uses web-design.md rule for accessibility
- Generates components following react-native.md patterns
- Commits with /commit command

Backend Dev (Claude Code):
- Uses testing.md rule for test standards
- Generates APIs following api-conventions skill
- Reviews code with third-party-security.md

DevOps (Gemini CLI):
- Uses git-workflow.md for commit standards
- Writes scripts following testing-scripts.md
- Syncs configs with /sync-setup command

All using the same source: .agents/
```

---

### 6. Documentation Maintenance

**Scenario:** Project documentation becoming outdated, no one has time to audit

**Solution:**
1. Run: `/improve-docs`
2. `doc-improver` agent:
   - Reads `documentation.md` rule for project standards
   - Analyzes all documentation files
   - Identifies gaps, broken links, outdated content
   - Suggests specific improvements with priorities

**Result:** Automated documentation audit with actionable recommendations

**Example output:**
```
## Documentation Audit Report

Analyzed 74 documentation files in 45 seconds.

### High Priority Issues

1. **docs/guides/setup.md**
   - Line 23: Broken link to mcp-setup-guide.md
   - Line 67: Outdated installation steps (refers to deprecated npm package)
   - Recommendation: Update to use new @upstash/context7-mcp package

2. **docs/references/mcp.md**
   - Missing: Platform support matrix
   - Missing: Troubleshooting section
   - Recommendation: Add sections from MCP Setup Guide

3. **.agents/rules/README.md**
   - Line 145: Character limit increased to 12,000, docs say 10,000
   - Recommendation: Update limit documentation

### Medium Priority

4. **docs/en/guides/patterns/progressive-disclosure.md**
   - Examples use deprecated syntax
   - Recommendation: Update examples to current SKILL.md format

5. **README.md** (this file)
   - Missing: Contributing section
   - Recommendation: Add contribution guidelines

### Statistics

- Total files: 74
- High priority issues: 3
- Medium priority: 2
- Broken links: 1
- Outdated content: 4
- Missing sections: 2

Would you like me to implement these changes? (Y/n)
```

**Learn more:** [doc-improver agent](.agents/agents/doc-improver.md)

---

## Getting Started

### Step 1: Clone and Setup

```bash
# Clone template
git clone https://github.com/LIDR-IT/ai-assisted-workflow.git my-project
cd my-project

# Optional: Remove git history to start fresh
rm -rf .git
git init
git add .
git commit -m "Initial commit from LIDR template"
```

---

### Step 2: Configure Environment

```bash
# Copy environment template
cp .agents/mcp/.env.example .agents/mcp/.env

# Edit .env file
vim .agents/mcp/.env
# Add: CONTEXT7_API_KEY="your-api-key-here"
```

**Get Context7 API Key:** Sign up at [context7.com/dashboard](https://context7.com/dashboard)

---

### Step 3: Synchronize Configurations

```bash
# Run master sync script
./.agents/sync-all.sh
```

**Expected output:**
```
🔄 Syncing all configurations...

📋 Syncing rules...
  ✅ Claude: Symlink created (.claude/rules → ../.agents/rules)
  ✅ Antigravity: Native detection (.agents/rules/ read directly)
  ✅ Cursor: 14 rules copied and converted to .mdc
  ✅ Gemini: Index file generated (.gemini/GEMINI.md)

🧩 Syncing skills...
  ✅ Cursor: Symlink created (.cursor/skills → ../.agents/skills)
  ✅ Claude: Symlink created (.claude/skills → ../.agents/skills)
  ✅ Gemini: Symlink created (.gemini/skills → ../.agents/skills)
  ✅ Antigravity: Native detection (.agents/skills/ read directly)

⚙️ Syncing commands...
  ✅ All platforms synchronized

🤖 Syncing agents...
  ✅ All platforms synchronized

🔌 Syncing MCP configurations...
  ✅ .cursor/mcp.json generated
  ✅ .claude/mcp.json generated
  ✅ .gemini/settings.json generated

✅ All synchronizations complete
```

**What each sync does:**
- **Rules:** Distributes coding standards to all platforms
- **Skills:** Makes reusable knowledge packages available
- **Commands:** Enables slash commands in AI agents
- **Agents:** Deploys autonomous workflows
- **MCP:** Configures external integrations

---

### Step 4: Verify Setup

```bash
# Check symlinks created
ls -la .cursor/skills .claude/rules .gemini/commands

# Verify symlink targets
readlink .cursor/skills
# Expected output: ../.agents/skills

readlink .claude/rules
# Expected output: ../.agents/rules

# Test file access
cat .cursor/rules/principles.mdc
ls .claude/skills/

# Verify MCP configs exist and are valid JSON
jq . .cursor/mcp.json
jq . .claude/mcp.json
jq . .gemini/settings.json
```

**All commands should succeed without errors.**

---

### Step 5: Test in AI Agents

#### Test in Cursor

```bash
# Open Cursor
cursor .

# Check rules loaded
# 1. Open Cursor Settings (Cmd/Ctrl + ,)
# 2. Navigate to: Cursor Settings → Features → Rules
# 3. Should see 14 rules listed

# Test skill
# In chat: "Create a new skill for testing React components"
# Should trigger: team-skill-creator skill

# Test command
/commit
```

#### Test in Claude Code

```bash
# Check MCP servers configured
claude mcp list
# Should show: Context7

# Test skill activation
# In conversation: "Create a new skill for API conventions"
# Should trigger: team-skill-creator skill

# Test command
/improve-docs docs/

# Test agent
# Ask: "Can you audit our documentation?"
# Should trigger: doc-improver agent
```

#### Test in Gemini CLI

```bash
# Check MCP servers
gemini mcp list
# Should show: Context7

# Check rules index
cat .gemini/GEMINI.md
# Should show categorized list of all rules

# Test command
/sync-setup

# Test skill
# In conversation: "Help me create a new command"
# Should trigger: command-development skill
```

#### Test in Antigravity

**Note:** Antigravity requires global MCP configuration

1. Set up global MCP: See [ANTIGRAVITY_SETUP.md](docs/guides/mcp/ANTIGRAVITY_SETUP.md)
2. Close and reopen project (rules cache refresh)
3. Open Customizations panel
4. Check rules appear in list
5. Test skill access

---

### Step 6: Customize for Your Project

```bash
# Add project-specific rule
cat > .agents/rules/team/my-standard.md << 'EOF'
---
name: my-standard
description: Project-specific coding standard
alwaysApply: false
globs: ["src/**/*.ts"]
argument-hint: <file-to-check>
paths: ["src/**/*.ts"]
trigger: always_on
---

# My Project Standard

Review these files for compliance: $ARGUMENTS

## Rules

### Code Organization

- All files must have a single default export
- Named exports only for types and constants
- Maximum file length: 300 lines

### Naming Conventions

- React components: PascalCase
- Hooks: useCamelCase
- Utilities: camelCase
- Constants: UPPER_SNAKE_CASE

## Output Format

Use `file:line` format.

```text
## src/components/Button.tsx

src/components/Button.tsx:45 - file exceeds 300 lines (current: 342)
src/components/Button.tsx:12 - hook name should start with 'use'

## src/utils/format.ts

✓ pass
```
EOF

# Add project-specific skill
mkdir -p .agents/skills/my-skill
cat > .agents/skills/my-skill/SKILL.md << 'EOF'
---
name: my-skill
description: This skill should be used when the user asks to "trigger phrase 1", "trigger phrase 2". Brief context about skill.
version: 0.1.0
---

# My Skill Title

Brief overview of what this skill provides.

## Usage

Instructions for using this skill.
EOF

# Re-sync
./.agents/sync-all.sh

# Verify
ls .cursor/rules/my-standard.mdc
cat .claude/rules/team/my-standard.md
ls .cursor/skills/my-skill/

# Commit
git add .agents/
git commit -m "feat: Add project-specific configurations"
```

---

### Common Issues

#### Symlinks Not Working

**Symptoms:** `.cursor/skills` shows as empty or doesn't exist

**Causes:**
- Windows: Developer Mode not enabled
- Permissions: Insufficient rights

**Solutions:**
```bash
# Windows: Enable Developer Mode
# Settings → Update & Security → For Developers → Developer Mode

# Or run as Administrator
# Right-click terminal → "Run as Administrator"

# Re-run sync
./.agents/sync-all.sh
```

---

#### MCP Server Not Appearing

**Symptoms:** `claude mcp list` doesn't show Context7

**Solutions:**
```bash
# 1. Restart AI platform
# Close and reopen Cursor/Claude Code/Gemini CLI

# 2. Check environment variables
cat .agents/mcp/.env
# Verify CONTEXT7_API_KEY is set

# 3. Verify JSON syntax
jq . .agents/mcp/mcp-servers.json
# Should output formatted JSON without errors

# 4. Regenerate configs
./.agents/mcp/sync-mcp.sh

# 5. Check generated files
jq . .cursor/mcp.json
jq . .claude/mcp.json
jq . .gemini/settings.json
```

---

#### Rules Not Loading

**Symptoms:** AI agent doesn't apply rules

**Solutions:**

**For Cursor:**
```bash
# Check .mdc files exist
ls .cursor/rules/
# Should see .mdc files (not .md)

# Re-run sync if missing
./.agents/rules/sync-rules.sh
```

**For Antigravity:**
```bash
# Close and reopen project
# Antigravity caches rules, needs reload

# Antigravity reads natively from .agents/rules/ — no symlink needed
# Verify source files exist
ls .agents/rules/
```

**For all platforms:**
```bash
# Verify source files exist
ls .agents/rules/**/*.md

# Verify file permissions
ls -l .agents/rules/code/principles.md
# Should be readable (r-- or rw-)
```

---

## FAQ

### General Questions

**Q: What is this project?**
A: This is a multi-agent synchronization framework for managing AI development configurations across 5 platforms (Cursor, Claude Code, Gemini CLI, Antigravity, GitHub Copilot/VSCode). It's NOT a documentation wiki - it's a production tool for teams.

**Q: Who is this for?**
A: Development teams, enterprises, and DevOps teams managing AI-assisted workflows. Ideal for teams using multiple AI platforms who want consistent behavior.

**Q: Do I need all 5 platforms?**
A: No. The template works with any subset of platforms. Use only the ones your team needs - sync scripts handle missing platforms gracefully.

**Q: Is this production-ready?**
A: Yes. After 40% consolidation (482→287 files), the project is focused, tested, and actively maintained. Many teams use it in production.

---

### Setup & Installation

**Q: Why symlinks instead of copies?**
A: Instant propagation, zero duplication. Changes to `.agents/` immediately available in all platforms. Filesystem-native, no sync delay.

**Q: Can I use this on Windows?**
A: Yes. Requires Developer Mode for symlinks. Go to Settings → Update & Security → For Developers → Enable Developer Mode.

**Q: Do I need Node.js?**
A: Only for MCP servers like Context7. If you're not using MCP, Node.js is optional.

**Q: How long does setup take?**
A: 5 minutes for quick start (clone, env, sync). 15 minutes for full customization (add project-specific rules/skills).

---

### Platform-Specific

**Q: Why doesn't Cursor support subdirectories?**
A: Platform limitation. Cursor requires flat rule structure. We handle this via copy+convert strategy (`.md` → `.mdc`, flattened).

**Q: Why does Antigravity need global MCP?**
A: Platform doesn't support project-level MCP configs. Must configure at `~/.gemini/antigravity/mcp_config.json`. See [ANTIGRAVITY_LIMITATION.md](docs/guides/mcp/ANTIGRAVITY_LIMITATION.md).

**Q: Why does Gemini need an index file?**
A: Gemini CLI doesn't support native rules. We generate `GEMINI.md` index file with links to all rules as workaround.

**Q: How do I know which platform supports what?**
A: See [Platform Support Matrix](#platform-support-matrix) in Architecture section.

---

### Synchronization

**Q: When do I run sync scripts?**
A: After ANY change in `.agents/` directory. Add/edit/delete rule, skill, command, agent, or MCP server → run sync.

**Q: Can I auto-sync?**
A: No auto-sync by default (manual is safer, explicit, verifiable). Can add git hooks for post-merge auto-sync if desired.

**Q: What if sync fails?**
A: Check error message, verify source files exist, check permissions, re-run sync. Most failures are missing source files or permission issues.

**Q: Do I commit generated files?**
A: YES for MCP configs (`.cursor/mcp.json`, `.claude/mcp.json`, `.gemini/settings.json`). Symlinks auto-restore on clone, don't need special handling.

---

### Customization

**Q: How do I add a project-specific rule?**
A: Create in `.agents/rules/{category}/my-rule.md`, add universal YAML frontmatter, run `./.agents/rules/sync-rules.sh`.

**Q: Can I modify existing rules?**
A: YES. Edit in `.agents/rules/`, NEVER in platform directories (`.cursor/`, `.claude/`, etc.). Then run sync.

**Q: How do I disable a rule for one platform?**
A: Use platform-specific YAML fields. Example: Set `alwaysApply: false` for Cursor, omit `trigger` for Antigravity.

**Q: Can I have platform-specific skills?**
A: Yes, but discouraged. Prefer universal skills that work everywhere. If needed, use naming convention: `skill-name.cursor.md`.

---

### Troubleshooting

**Q: Symlink shows as directory not link?**
A: Windows issue. Enable Developer Mode: Settings → Update & Security → For Developers → Developer Mode. Restart terminal, re-run sync.

**Q: MCP server not loading?**
A: 1) Restart platform, 2) Check env vars in `.agents/mcp/.env`, 3) Verify JSON syntax with `jq . .agents/mcp/mcp-servers.json`, 4) Regenerate configs.

**Q: Rules not applying?**
A: **Antigravity:** Close/reopen project (rules cached). **Cursor:** Check `.mdc` files exist. **All:** Verify source file in `.agents/rules/`.

**Q: Changes not propagating?**
A: Check symlink valid with `readlink .cursor/skills`. Verify source file exists. For Cursor rules, re-run sync (uses copy, not symlink).

---

### Advanced

**Q: Can I add more MCP servers?**
A: YES. Edit `.agents/mcp/mcp-servers.json`, add server entry, run `./.agents/mcp/sync-mcp.sh`, commit source and generated files.

**Q: How do I create team-wide conventions?**
A: Add rules in `.agents/rules/team/`. These sync to all team members. Examples: code review standards, security policies, API patterns.

**Q: Can I use this with CI/CD?**
A: YES. Sync scripts work in automation. Example: Run `./.agents/sync-all.sh` in GitHub Actions to verify configs synced before deployment.

**Q: How do I version control this?**
A: Commit `.agents/` directory (source of truth) AND generated configs (`.cursor/mcp.json`, etc.). Symlinks auto-restore on clone.

---

## Project Structure

```
template-best-practices/
├── .agents/                         # ← Source of Truth (63 files)
│   ├── rules/                       # 14 rules, 8 categories
│   │   ├── code/                    # principles.md, style.md
│   │   ├── content/                 # copywriting.md
│   │   ├── design/                  # web-design.md
│   │   ├── frameworks/              # react-native.md
│   │   ├── process/                 # git-workflow.md, documentation.md
│   │   ├── quality/                 # testing.md, testing-scripts.md
│   │   ├── team/                    # skills-management.md, third-party-security.md
│   │   ├── tools/                   # use-context7.md, claude-code-extensions.md
│   │   ├── README.md                # Rules guidelines (12K char limit, YAML format)
│   │   ├── sync-rules.sh            # ← Rules synchronization script
│   │   └── migrate-yaml.sh          # YAML frontmatter migration utility
│   │
│   ├── skills/                      # 9 skill packages
│   │   ├── agent-development/       # Agent creation patterns
│   │   ├── command-development/     # Command creation workflows
│   │   ├── commit-management/       # Git commit workflows
│   │   ├── find-skills/             # Skill discovery
│   │   ├── hook-development/        # Git hooks patterns
│   │   ├── mcp-integration/         # MCP server setup
│   │   ├── skill-creator/           # Skill scaffold generator
│   │   ├── skill-development/       # Skill architecture patterns
│   │   ├── team-skill-creator/      # Meta-skill for creating components
│   │   └── sync-skills.sh           # ← Skills synchronization script
│   │
│   ├── commands/                    # 3 slash commands
│   │   ├── commit.md                # Smart commit generation
│   │   ├── improve-docs.md          # Documentation audit
│   │   ├── sync-setup.md            # Configuration sync
│   │   └── sync-commands.sh         # ← Commands synchronization script
│   │
│   ├── agents/                      # 1 autonomous agent
│   │   ├── doc-improver.md          # Documentation auditor
│   │   └── sync-agents.sh           # ← Agents synchronization script
│   │
│   ├── mcp/                         # MCP configuration
│   │   ├── mcp-servers.json         # ← Source of truth for MCP servers
│   │   ├── sync-mcp.sh              # ← Generates platform-specific configs
│   │   └── .env.example             # Environment variables template
│   │
│   ├── sync-all.sh                  # ← Master sync script (runs all syncs)
│   ├── agent-readme.md              # Agents documentation
│   ├── commands-readme.md           # Commands documentation
│   └── mcp-readme.md                # MCP documentation
│
├── .cursor/                         # Cursor-specific (generated/symlinked)
│   ├── rules/                       # ← Copied + converted to .mdc (flattened)
│   │   ├── principles.mdc
│   │   ├── style.mdc
│   │   ├── copywriting.mdc
│   │   └── ...                      # All 14 rules as .mdc files
│   ├── skills → ../.agents/skills   # ← Symlink to source
│   ├── commands → ../.agents/commands # ← Symlink to source
│   ├── agents → ../.agents/agents   # ← Symlink to source
│   └── mcp.json                     # ← Generated (Cursor format)
│
├── .claude/                         # Claude Code (symlinked)
│   ├── rules → ../.agents/rules     # ← Symlink to source (supports subdirs)
│   ├── skills → ../.agents/skills   # ← Symlink to source
│   ├── commands → ../.agents/commands # ← Symlink to source
│   ├── agents → ../.agents/agents   # ← Symlink to source
│   └── mcp.json                     # ← Generated (Claude format)
│
├── .gemini/                         # Gemini CLI (mixed approach)
│   ├── GEMINI.md                    # ← Generated index (no native rules support)
│   ├── rules → ../.agents/rules     # ← Symlink (for reference access)
│   ├── skills → ../.agents/skills   # ← Symlink to source
│   ├── commands → ../.agents/commands # ← Symlink to source
│   ├── agents → ../.agents/agents   # ← Symlink to source
│   └── settings.json                # ← Generated (Gemini MCP format)
│
│   # Antigravity: reads natively from .agents/ (no separate platform directory)
│   # .agents/workflows → .agents/commands  (symlink for Antigravity workflows)
│
├── docs/                            # Documentation (74 files)
│   ├── en/
│   │   ├── guides/                  # How-to guides
│   │   │   ├── setup.md             # Complete setup guide (consolidated from 6 files)
│   │   │   ├── mcp/                 # MCP-specific guides (5 files)
│   │   │   ├── patterns/            # Pattern guides (2 files)
│   │   │   ├── rules/               # Rules sync guide
│   │   │   └── sync/                # Agents sync guide
│   │   ├── notes/                   # Research notes (8 files)
│   │   └── references/              # Technical documentation
│   │       ├── mcp.md               # MCP quick reference (consolidated from 46 files)
│   │       ├── skills.md            # Skills quick reference (consolidated from 24 files)
│   │       ├── agents/              # Agent references (10 files)
│   │       ├── claude-code/         # Claude Code references (4 files)
│   │       ├── commands/            # Command references (4 files)
│   │       ├── documentation/       # Doc tools (2 files)
│   │       ├── hooks/               # Hook references (5 files)
│   │       ├── mcp/                 # MCP platform refs (7 files)
│   │       ├── planning-tasks/      # Planning references (4 files)
│   │       ├── rules/               # Rules references (6 files)
│   │       └── skills/              # Skills references (10 files)
│   ├── .vitepress/                  # VitePress config
│   │   └── config.js                # Documentation site configuration
│   ├── index.md                     # Documentation home
│   ├── README.md                    # Docs README
│   └── CONSOLIDATION_SUMMARY.md     # Consolidation history
│
├── CLAUDE.md                        # ← Claude Code specific guidance
├── CONSOLIDATION_SUMMARY.md         # ← Project optimization history (40% reduction)
├── TODO.md                          # Project TODOs
├── package.json                     # npm configuration (VitePress)
├── package-lock.json
└── README.md                        # ← This file
```

### Legend

- `← Source of truth` - Edit these files, never derived copies
- `← Generated` - Created by sync scripts, do not edit manually
- `← Symlink` - Points to source, changes propagate instantly
- `← Copied` - Platform limitation, sync script handles updates

### Key Directories

**`.agents/`** - Source of truth for all configurations (63 files)
- Edit once here, syncs to all platforms
- Version controlled (commit to git)

**`.cursor/` `.claude/` `.gemini/`** - Platform-specific
- Generated or symlinked from `.agents/`
- **Do not edit directly**
- Regenerate with sync scripts

**Antigravity** - Reads natively from `.agents/` (no separate platform directory)
- Rules, skills, and workflows detected directly from `.agents/`
- `.agents/workflows` symlinks to `.agents/commands`

**`docs/`** - Project documentation (74 files)
- Guides (how-to), references (technical), notes (research)
- VitePress powered documentation site
- Reduced from 273 files (73% reduction)

---

## Documentation

### Guides (How-To)

**Getting Started:**
- [Complete Setup Guide](docs/en/guides/setup.md) - Full installation and configuration
- [Quick Start](#quick-start) - 5-minute setup

**MCP Integration:**
- [MCP Setup Guide](docs/guides/mcp/mcp-setup-guide.md) - MCP server configuration
- [Antigravity Setup](docs/guides/mcp/ANTIGRAVITY_SETUP.md) - Platform-specific setup
- [Antigravity Limitations](docs/guides/mcp/ANTIGRAVITY_LIMITATION.md) - Known constraints
- [MCP Validation](docs/guides/mcp/VALIDATION.md) - Testing MCP servers

**Synchronization:**
- [Sync System Guide](docs/guides/sync/) - Understanding synchronization
- [Rules Sync](docs/guides/rules/) - Rules synchronization details
- [Agents Sync](docs/guides/sync/) - Agents synchronization

**Patterns:**
- [Command → Agent → Skill Pattern](docs/guides/patterns/) - Workflow architecture
- [Progressive Disclosure](docs/guides/patterns/) - Skills organization pattern

---

### References (Technical)

**Core Components:**
- [Rules Reference](docs/references/rules/) - All 14 rules documented
- [Skills Reference](docs/references/skills/) - All 9 skills detailed
- [Commands Reference](docs/references/commands/) - All 3 commands explained
- [Agents Reference](docs/references/agents/) - Agent architecture
- [Hooks Reference](docs/references/hooks/) - Git hooks patterns

**MCP System:**
- [MCP Quick Reference](docs/en/references/mcp.md) - Consolidated MCP guide
- [MCP Platform Docs](docs/references/mcp/) - Platform-specific details
- [Context7 Setup](docs/references/mcp/) - Context7 server configuration

**Platform-Specific:**
- [Claude Code References](docs/references/claude-code/) - Claude-specific features
- [Cursor Integration](docs/references/) - Cursor-specific patterns
- [Gemini CLI Usage](docs/references/) - Gemini-specific details
- [Antigravity Constraints](docs/references/) - Platform limitations

---

### Core Concepts

**Architecture & Design:**
- [Core Principles](.agents/rules/code/principles.md) - Architectural decisions and rationale
- [Code Style](.agents/rules/code/style.md) - Coding standards and conventions
- [Documentation Standards](.agents/rules/process/documentation.md) - Documentation guidelines

**Team Workflows:**
- [Skills Management](.agents/rules/team/skills-management.md) - Skills lifecycle and guidelines
- [Git Workflow](.agents/rules/process/git-workflow.md) - Git conventions and branching
- [Third-Party Security](.agents/rules/team/third-party-security.md) - Dependency review process

**Quality & Testing:**
- [Testing Guidelines](.agents/rules/quality/testing.md) - Testing philosophy and standards
- [Testing Scripts](.agents/rules/quality/testing-scripts.md) - Script testing patterns

---

### Quick References

**Project Files:**
- [CLAUDE.md](CLAUDE.md) - Claude Code specific guidance and workflows
- [CONSOLIDATION_SUMMARY.md](CONSOLIDATION_SUMMARY.md) - Project optimization history (40% reduction)
- [Rules Documentation](docs/en/references/rules/memory-and-rules.md) - Rules system reference

**External Standards:**
- [agents.md](https://agents.md) - Universal agent configuration standard
- [skills.sh](https://skills.sh) - Skills ecosystem documentation
- [Context7](https://context7.com) - MCP documentation server

---

### Documentation Site

**VitePress powered documentation:**

```bash
# Start development server
npm run docs:dev

# Build static site
npm run docs:build

# Preview built site
npm run docs:preview
```

Visit: [http://localhost:5173](http://localhost:5173)

---

## Contributing

### Adding a Rule

```bash
# 1. Create rule file in appropriate category
cat > .agents/rules/team/new-rule.md << 'EOF'
---
name: new-rule                      # Cursor
description: Brief description       # All platforms
alwaysApply: false                   # Cursor (optional, defaults to false)
globs: ["**/*.ts"]                  # Cursor (optional)
argument-hint: <file-pattern>        # Claude/Gemini (optional)
paths: ["src/**/*.ts"]              # Claude (optional)
trigger: always_on                   # Antigravity (optional)
---

# New Rule Title

Review these files for compliance: $ARGUMENTS

Read files, check against rules below. Output concise but comprehensive—sacrifice grammar for brevity. High signal-to-noise.

## Rules

### Critical Section

[Your rules here]

## Output Format

Use `file:line` format (VS Code clickable). Terse findings.

```text
## src/example.ts

src/example.ts:12 - issue description
src/example.ts:34 - another issue

## src/other.ts

✓ pass
```

State issue + location. Skip explanation unless fix non-obvious. No preamble.
EOF

# 2. Verify character count (must be under 12,000)
wc -c .agents/rules/team/new-rule.md

# 3. Run sync
./.agents/rules/sync-rules.sh

# 4. Verify synchronization
ls .cursor/rules/new-rule.mdc                # Cursor (converted)
cat .claude/rules/team/new-rule.md          # Claude (symlink)
cat .gemini/GEMINI.md | grep "new-rule"     # Gemini (index)

# 5. Test in AI agents
# Open Cursor/Claude/Gemini and verify rule appears

# 6. Commit
git add .agents/rules/team/new-rule.md
git commit -m "docs: Add new-rule for [purpose]

[Brief explanation of rule purpose and scope]

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

**Rule Guidelines:**
- One topic per file
- Under 12,000 characters
- Universal YAML frontmatter
- Active voice, imperative mood
- Specific examples over abstract descriptions

See: [Rules Documentation](docs/en/references/rules/memory-and-rules.md)

---

### Adding a Skill

**Automated (Recommended):**

```
# In AI conversation:
"Create a skill for React component testing with test templates"

# team-skill-creator will:
1. Create .agents/skills/react-testing/ structure
2. Generate SKILL.md with frontmatter
3. Add references/, examples/, assets/, scripts/ directories
4. Run ./.agents/sync-all.sh automatically
5. Verify sync across all platforms
```

**Manual:**

```bash
# 1. Create structure
mkdir -p .agents/skills/my-skill/{references,examples,assets,scripts}

# 2. Create SKILL.md
cat > .agents/skills/my-skill/SKILL.md << 'EOF'
---
name: my-skill
description: This skill should be used when the user asks to "trigger 1", "trigger 2". Brief context about skill.
version: 0.1.0
---

# My Skill Title

Brief overview of what this skill provides.

## Overview

Detailed explanation.

## Usage

How to use this skill.

## References

- See references/deep-guide.md for advanced patterns
- See examples/usage-example.md for sample code
- See assets/template.ts for boilerplate

EOF

# 3. Add bundled resources (optional)
echo "# Deep Guide" > .agents/skills/my-skill/references/deep-guide.md
echo "# Example Usage" > .agents/skills/my-skill/examples/usage-example.md

# 4. Sync
./.agents/sync-all.sh

# 5. Test
# In AI: "Help me with [skill purpose]"
# Should trigger your new skill

# 6. Commit
git add .agents/skills/my-skill/
git commit -m "feat: Add my-skill for [purpose]

[Brief explanation]

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

**Skill Guidelines:**
- Progressive disclosure (SKILL.md → references/ → examples/)
- Descriptive triggers in description field
- Use third-person in description
- Bundle related resources

See: [Skills Management](.agents/rules/team/skills-management.md)

---

### Adding a Command

```bash
# 1. Create command file
cat > .agents/commands/my-command.md << 'EOF'
---
name: my-command
description: What this command does
args:
  - name: target
    description: Target file or directory
    required: false
---

# My Command

Brief description of what this command does.

## What It Does

- Action 1
- Action 2
- Action 3

## Usage

```bash
/my-command target-path
```

## Examples

**Example 1: Basic usage**
```bash
/my-command
```

**Example 2: With argument**
```bash
/my-command src/components/
```

## Related

- Agent: [related-agent.md](.agents/agents/related-agent.md) (if applicable)
- Rule: [related-rule.md](.agents/rules/category/related-rule.md)
EOF

# 2. Sync
./.agents/sync-all.sh

# 3. Test command
# In Claude Code: /my-command
# In Cursor: /my-command

# 4. Commit
git add .agents/commands/my-command.md
git commit -m "feat: Add /my-command for [purpose]

[Brief explanation]

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

**Command Guidelines:**
- Action-oriented names (verb-noun)
- Document arguments clearly
- Provide multiple examples
- Link to related agents/rules/skills

See: [Commands README](.agents/commands-readme.md)

---

### Adding an MCP Server

```bash
# 1. Edit source configuration
vim .agents/mcp/mcp-servers.json

# 2. Add server entry:
{
  "servers": {
    "existing-server": {
      "platforms": ["cursor", "claude", "gemini"],
      ...
    },
    "my-server": {
      "platforms": ["cursor", "claude", "gemini"],
      "description": "My server description",
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "package-name"],
      "env": {
        "API_KEY": "${MY_SERVER_API_KEY}"
      }
    }
  }
}

# 3. Validate JSON syntax
jq empty .agents/mcp/mcp-servers.json
# Should output nothing (valid JSON)

# 4. Generate platform-specific configs
./.agents/mcp/sync-mcp.sh

# 5. Verify generated files
jq . .cursor/mcp.json
jq . .claude/mcp.json
jq . .gemini/settings.json

# 6. Update .env.example
echo "MY_SERVER_API_KEY=your-api-key-here" >> .agents/mcp/.env.example

# 7. Test MCP server
claude mcp list
# Should show: my-server

# 8. Commit BOTH source and generated files
git add .agents/mcp/mcp-servers.json .agents/mcp/.env.example
git add .cursor/mcp.json .claude/mcp.json .gemini/settings.json
git commit -m "feat: Add my-server MCP integration

[Brief explanation of server purpose]

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

**MCP Guidelines:**
- Always specify platforms array
- Use environment variables for API keys
- Test on all specified platforms
- Commit both source and generated configs

See: [MCP Setup Guide](docs/guides/mcp/mcp-setup-guide.md)

---

### Development Workflow

```bash
# 1. Create feature branch
git checkout -b feature/add-api-conventions

# 2. Make changes in .agents/ (source of truth)
vim .agents/rules/team/api-conventions.md
vim .agents/skills/api-patterns/SKILL.md

# 3. Run sync
./.agents/sync-all.sh

# 4. Test with AI agents
# Open Cursor/Claude/Gemini
# Verify new rule/skill appears and works

# 5. Commit with conventional commit message
git add .agents/
git commit -m "feat: Add API conventions rule and patterns skill

- Created api-conventions.md rule with REST/GraphQL standards
- Created api-patterns skill with templates and examples
- Includes validation scripts and reference documentation

Refs: #123

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"

# 6. Push and create PR
git push origin feature/add-api-conventions
```

---

### Code Review Checklist

When reviewing contributions, verify:

**Source of Truth:**
- [ ] Changes made in `.agents/` directory only (not in `.cursor/`, `.claude/`, etc.)
- [ ] No manual edits to generated files (`.cursor/mcp.json`, `.claude/mcp.json`, etc.)

**Rules:**
- [ ] Universal YAML frontmatter present (all platform fields)
- [ ] Character count under 12,000: `wc -c file.md`
- [ ] One topic per file
- [ ] Output format section included

**Skills:**
- [ ] SKILL.md has valid frontmatter (name, description, version)
- [ ] Description uses third-person form
- [ ] Progressive disclosure followed (SKILL.md → references/ → examples/)

**Commands:**
- [ ] Frontmatter includes name and description
- [ ] Arguments documented (if applicable)
- [ ] Usage examples provided

**MCP Servers:**
- [ ] Added to `mcp-servers.json` (source file)
- [ ] Platforms array specified
- [ ] Environment variables in `.env.example`
- [ ] JSON syntax valid: `jq empty mcp-servers.json`
- [ ] Both source and generated files committed

**General:**
- [ ] Sync scripts run successfully
- [ ] Tested on at least one platform
- [ ] Documentation updated (if needed)
- [ ] Conventional commit message used
- [ ] No secrets committed

---

### Commit Message Format

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
type: Brief summary (50 chars or less)

Detailed explanation if needed. Wrap at 72 characters.

- Bullet points for multiple changes
- Focus on WHY, not just WHAT

Refs: #issue-number

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

**Types:**
- `feat:` New feature or functionality
- `fix:` Bug fix
- `docs:` Documentation only changes
- `refactor:` Code restructuring without behavior change
- `test:` Adding tests
- `chore:` Maintenance tasks (dependencies, configs)

**Examples:**

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

### Guidelines & Standards

**Read before contributing:**
- [Core Principles](.agents/rules/code/principles.md) - Architectural decisions
- [Code Style](.agents/rules/code/style.md) - Coding standards
- [Documentation Standards](.agents/rules/process/documentation.md) - Docs guidelines
- [Git Workflow](.agents/rules/process/git-workflow.md) - Git conventions
- [Skills Management](.agents/rules/team/skills-management.md) - Skills lifecycle
- [Testing Guidelines](.agents/rules/quality/testing.md) - Testing approach

---

## License

ISC License - see [LICENSE](LICENSE) file for details

## Credits

**Maintained by:** LIDR IT Team

**Built with:**
- [agents.md](https://agents.md) - Universal agent configuration standard
- [Context7](https://context7.com) - MCP documentation server
- [VitePress](https://vitepress.dev) - Documentation framework
- [skills.sh](https://skills.sh) - Skills ecosystem

**Platforms Supported:**
- [Cursor](https://cursor.sh) - AI code editor
- [Claude Code](https://code.claude.com) - AI development platform
- [Gemini CLI](https://geminicli.com) - AI command-line interface
- [Antigravity](https://antigravity.dev) - AI development tool
- [GitHub Copilot](https://github.com/features/copilot) - AI pair programmer (VSCode)

**Inspired by:**
- Multi-agent systems architectures
- Centralized configuration management patterns
- Progressive disclosure in documentation
- Source-of-truth paradigms

## Repository

- **GitHub:** https://github.com/LIDR-IT/ai-assisted-workflow
- **Issues:** https://github.com/LIDR-IT/ai-assisted-workflow/issues
- **Discussions:** https://github.com/LIDR-IT/ai-assisted-workflow/discussions

## Changelog

### Recent Major Changes

**v1.0.0 - Consolidation (2026-02-01)**
- 🎯 Reduced from 482 to 287 files (40% reduction)
- 📚 Eliminated Spanish documentation duplicate (130 files)
- 🔗 Consolidated learning modules into reference indices (71 → 2 files)
- 📋 Merged 6 SETUP files into single comprehensive guide
- ✨ Migrated 5 guidelines to .agents/rules/ for synchronization
- 🔄 Established clear project focus: synchronization framework

See [CONSOLIDATION_SUMMARY.md](CONSOLIDATION_SUMMARY.md) for detailed changes.

See [git history](https://github.com/LIDR-IT/ai-assisted-workflow/commits/main) for complete changelog.

---

**Ready to get started?** Jump to [Quick Start](#quick-start) or read the [Complete Setup Guide](docs/en/guides/setup.md)

**Questions?** Open an [issue](https://github.com/LIDR-IT/ai-assisted-workflow/issues) or start a [discussion](https://github.com/LIDR-IT/ai-assisted-workflow/discussions)
````
