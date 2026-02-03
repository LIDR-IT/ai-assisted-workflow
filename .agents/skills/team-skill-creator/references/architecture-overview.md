# Architecture Overview

Comprehensive guide to the `.agents/` centralized source-of-truth architecture for multi-platform AI agent configuration.

## Table of Contents

1. [System Overview](#system-overview)
2. [Source of Truth Pattern](#source-of-truth-pattern)
3. [Directory Structure](#directory-structure)
4. [Synchronization Strategies](#synchronization-strategies)
5. [Platform Support Matrix](#platform-support-matrix)
6. [Component Types](#component-types)
7. [Data Flow](#data-flow)

## System Overview

The `.agents/` system provides **centralized configuration management** for AI agents across 4 platforms:

**Supported Platforms:**

1. **Cursor** - Full support with symlinks
2. **Claude Code** - Full support with symlinks
3. **Gemini CLI** - Full support with symlinks
4. **Antigravity** - Limited support (selective symlinks/copies)

**Core principle:** Edit once in `.agents/`, automatically synchronized to all platforms.

### Key Benefits

**Consistency:**

- Single source of truth
- No configuration drift between platforms
- Uniform team experience

**Efficiency:**

- Edit once, propagate everywhere
- Instant updates via symlinks
- Reduced maintenance burden

**Scalability:**

- Add platforms easily
- Centralized updates
- Team-wide synchronization

## Source of Truth Pattern

### Central Directory: `.agents/`

```
.agents/
├── rules/        # Coding standards and best practices
├── skills/       # Modular knowledge packages
├── commands/     # Reusable prompt templates
└── mcp/          # MCP server configurations
```

**Purpose:** Master configurations that sync to all platforms.

### Consumer Directories

Platform-specific directories receive synced configurations:

```
.cursor/          # Cursor AI
├── rules → ../.agents/rules
├── skills → ../.agents/skills
├── commands → ../.agents/commands
└── mcp.json (generated)

.claude/          # Claude Code
├── rules → ../.agents/rules
├── skills → ../.agents/skills
├── commands → ../.agents/commands
├── agents/ (platform-specific)
└── mcp.json (generated)

.gemini/          # Gemini CLI
├── rules → ../.agents/rules
├── skills → ../.agents/skills
├── commands → ../.agents/commands
└── settings.json (generated)

.agent/           # Antigravity
├── rules/ (copied files)
├── skills/ (selective symlinks)
├── workflows/ (commands copied)
└── (MCP global only)
```

**Note:** `→` indicates symlink, regular text indicates files/directories.

## Directory Structure

### .agents/rules/

**Purpose:** Project-wide coding standards and best practices.

**Contents:**

```
.agents/rules/
├── core-principles.md    # Architecture decisions
├── code-style.md         # Coding conventions
├── documentation.md      # Documentation standards
├── git-workflow.md       # Git conventions
├── testing.md            # Testing requirements
└── use-context7.md       # Context7 usage rules
```

**Sync strategy:**

- Cursor, Claude, Gemini: Full directory symlink
- Antigravity: Files copied

### .agents/skills/

**Purpose:** Modular packages with specialized knowledge and bundled resources.

**Contents:**

```
.agents/skills/
├── skill-creator/
│   ├── SKILL.md
│   ├── scripts/
│   ├── references/
│   └── assets/
├── team-skill-creator/
│   ├── SKILL.md
│   ├── scripts/
│   ├── references/
│   └── examples/
└── [other skills]/
```

**Sync strategy:**

- Cursor, Claude, Gemini: Full directory symlink
- Antigravity: Selective symlinks per-skill

### .agents/commands/

**Purpose:** Frequently-used prompts as Markdown files.

**Contents:**

```
.agents/commands/
├── sync-setup.md
└── [other commands]/
```

**Sync strategy:**

- Cursor, Claude, Gemini: Full directory symlink
- Antigravity: Files copied to `.agent/workflows/`

### .agents/mcp/

**Purpose:** MCP (Model Context Protocol) server configurations.

**Contents:**

```
.agents/mcp/
├── mcp-servers.json      # Source of truth
└── sync-mcp.sh           # Generation script
```

**Sync strategy:**

- All platforms: Generated platform-specific configs from source
- Antigravity: Global config only (project-level not supported)

## Synchronization Strategies

### Strategy 1: Full Directory Symlinks

**Used for:** Rules, Skills, Commands
**Platforms:** Cursor, Claude Code, Gemini CLI

**Mechanism:**

```bash
ln -s ../.agents/skills .cursor/skills
```

**Advantages:**

- ✅ Instant propagation of changes
- ✅ Zero duplication
- ✅ Filesystem-native
- ✅ No manual sync needed

**Example:**

```
.cursor/skills → ../.agents/skills
.claude/skills → ../.agents/skills
.gemini/skills → ../.agents/skills
```

### Strategy 2: Script Generation

**Used for:** MCP configurations
**Platforms:** All (except Antigravity project-level)

**Mechanism:**

```bash
# Source: .agents/mcp/mcp-servers.json
# Script: .agents/mcp/sync-mcp.sh
# Generated:
#   .cursor/mcp.json
#   .claude/mcp.json
#   .gemini/settings.json
```

**Advantages:**

- ✅ Platform-specific formatting
- ✅ Validation during generation
- ✅ Preprocessing/transformation
- ✅ Single source, multiple targets

### Strategy 3: File Copies

**Used for:** Antigravity rules and commands
**Platform:** Antigravity only

**Mechanism:**

```bash
cp -r .agents/rules/*.md .agent/rules/
cp -r .agents/commands/*.md .agent/workflows/
```

**Limitations:**

- ⚠️ Manual sync required after edits
- ⚠️ No instant propagation
- ⚠️ Platform limitation (no directory symlink support)

**Note:** Must re-run sync after editing rules or commands for Antigravity.

### Strategy 4: Selective Symlinks

**Used for:** Antigravity skills
**Platform:** Antigravity only

**Mechanism:**

```bash
ln -s ../../.agents/skills/skill-name .agent/skills/skill-name
```

**Advantages:**

- ✅ Works within Antigravity constraints
- ✅ Instant propagation for skills
- ⚠️ Each skill requires individual symlink

## Platform Support Matrix

| Platform    | MCP Project | MCP Global | Skills | Commands | Agents | Rules   |
| ----------- | ----------- | ---------- | ------ | -------- | ------ | ------- |
| Cursor      | ✅          | ✅         | ✅ Sym | ✅ Sym   | ✅\*   | ✅ Sym  |
| Claude Code | ✅          | ✅         | ✅ Sym | ✅ Sym   | ✅     | ✅ Sym  |
| Gemini CLI  | ✅          | ✅         | ✅ Sym | ✅ Sym   | ❌     | ✅ Sym  |
| Antigravity | ❌ Global   | ✅         | ✅ Sel | ✅ Copy  | ❌     | ✅ Copy |

**Legend:**

- ✅ = Fully supported
- ✅ Sym = Full directory symlink
- ✅ Sel = Selective (per-item) symlinks
- ✅ Copy = Files copied during sync
- ❌ = Not supported
- \*May have limited support

### Platform-Specific Notes

**Cursor:**

- Full symlink support for all component types
- MCP servers work at project level
- Agents may have limited support (verify in current version)

**Claude Code:**

- Full symlink support for all component types
- MCP servers work at project level
- **Only platform with full agent support**
- Agents live in `.claude/agents/` (platform-specific)

**Gemini CLI:**

- Full symlink support for rules, skills, commands
- MCP servers work at project level
- No agent support

**Antigravity:**

- **MCP project-level NOT supported** (must use global config)
- Skills: Selective symlinks work
- Commands: Copied to `.agent/workflows/` (not `.agent/commands/`)
- Rules: Files copied (no directory symlink support)
- No agent support

## Component Types

### Rules

**Definition:** Project-wide coding standards and workflows.

**Purpose:**

- Define code style and conventions
- Document architecture decisions
- Specify testing requirements
- Establish Git workflows

**Always loaded:** Rules are always available to AI agents.

**Examples:**

- `core-principles.md` - Architecture patterns
- `code-style.md` - Formatting conventions
- `git-workflow.md` - Commit and branching standards

### Skills

**Definition:** Modular packages with specialized knowledge and bundled resources.

**Purpose:**

- Provide domain expertise
- Include scripts, references, templates
- Enable reusable workflows

**Loaded when:** Skill triggers based on description phrases.

**Examples:**

- `skill-creator` - Generic skill creation guide
- `team-skill-creator` - Team-specific component creation
- `react-testing` - React component testing patterns

### Commands

**Definition:** Frequently-used prompts accessible via `/{command-name}`.

**Purpose:**

- Quick, single-turn actions
- Reusable prompt templates
- Simple text-based instructions

**Invocation:** Manual via `/{command-name}`

**Examples:**

- `/sync-setup` - Synchronize all configurations
- `/security-review` - Security vulnerability checklist
- `/generate-commit` - Commit message generation

### Agents

**Definition:** Autonomous subprocesses for complex, multi-step tasks.

**Purpose:**

- Handle complex workflows autonomously
- Make decisions independently
- Perform deep analysis

**Platform:** Claude Code only

**Location:** `.claude/agents/` (not synced)

**Examples:**

- `code-reviewer` - Autonomous code quality analysis
- `test-generator` - Generate comprehensive test suites
- `refactorer` - Autonomous refactoring

### MCP Servers

**Definition:** External tool integrations via Model Context Protocol.

**Purpose:**

- Connect to external APIs
- Access databases
- Integrate third-party services

**Configuration:** `.agents/mcp/mcp-servers.json`

**Examples:**

- Context7 - Documentation lookup
- Database connectors
- API integrations

## Data Flow

### Creating a Skill

```
Step 1: Create in source
  .agents/skills/new-skill/SKILL.md

Step 2: Automatic sync triggered
  ./.agents/sync-all.sh
    └─ ./.agents/skills/sync-skills.sh

Step 3: Symlinks created
  .cursor/skills → ../.agents/skills
  .claude/skills → ../.agents/skills
  .gemini/skills → ../.agents/skills

Step 4: Antigravity selective symlink
  .agent/skills/new-skill → ../../.agents/skills/new-skill

Step 5: Available in all agents
  All platforms can now access the skill
```

### Creating a Command

```
Step 1: Create in source
  .agents/commands/new-command.md

Step 2: Automatic sync triggered
  ./.agents/sync-all.sh
    └─ ./.agents/commands/sync-commands.sh

Step 3: Symlinks created
  .cursor/commands → ../.agents/commands
  .claude/commands → ../.agents/commands
  .gemini/commands → ../.agents/commands

Step 4: Antigravity copy
  cp .agents/commands/new-command.md .agent/workflows/

Step 5: Available via /{command-name}
  All platforms can invoke: /new-command
```

### Creating an Agent

```
Step 1: Create platform-specific
  .claude/agents/new-agent.md

Step 2: No sync needed
  (Agents are Claude Code-specific)

Step 3: Available in Claude Code
  Agent can be triggered in Claude Code only
```

### Updating MCP Config

```
Step 1: Edit source
  .agents/mcp/mcp-servers.json

Step 2: Run sync
  ./.agents/mcp/sync-mcp.sh

Step 3: Generate platform configs
  .cursor/mcp.json (Cursor format)
  .claude/mcp.json (Claude format)
  .gemini/settings.json (Gemini format)

Step 4: Antigravity manual config
  Manually update: ~/.gemini/antigravity/mcp_config.json
```

## Architecture Diagrams

### System Overview

```
┌───────────────────────────────────────────────────────────┐
│                    .agents/ (Source of Truth)             │
├───────────────────────────────────────────────────────────┤
│  rules/          skills/         commands/      mcp/      │
│  ├─ *.md         ├─ skill-1/     ├─ *.md        ├─ mcp-   │
│  ├─ *.md         ├─ skill-2/     ├─ *.md        │  servers│
│  └─ ...          └─ ...          └─ ...         └─ .json  │
└─────────┬─────────────┬──────────────┬──────────────┬────┘
          │             │              │              │
    ┌─────▼─────┐  ┌───▼────┐    ┌───▼────┐    ┌───▼────┐
    │ SYMLINKS  │  │SYMLINKS│    │SYMLINKS│    │GENERATE│
    └─────┬─────┘  └───┬────┘    └───┬────┘    └───┬────┘
          │            │              │              │
    ┌─────▼──────────────▼──────────────▼──────────────▼────┐
    │        Agent-Specific Directories (Consumers)          │
    ├────────────────────────────────────────────────────────┤
    │  .cursor/   .claude/   .gemini/   .agent/              │
    │  ├─ rules → ├─ rules → ├─ rules → ├─ rules (copy)     │
    │  ├─ skills→ ├─ skills→ ├─ skills→ ├─ skills (select)  │
    │  ├─ cmds  → ├─ cmds  → ├─ cmds  → ├─ workflows (copy) │
    │  └─ mcp.json└─ mcp.json└─settings └─ (global only)    │
    └────────────────────────────────────────────────────────┘
```

### Sync Flow

```
User creates/edits in .agents/
       │
       ▼
.agents/sync-all.sh executes
       │
       ├─── sync-rules.sh
       │      └─ Creates symlinks (Cursor/Claude/Gemini)
       │      └─ Copies files (Antigravity)
       │
       ├─── sync-skills.sh
       │      └─ Creates symlinks (Cursor/Claude/Gemini)
       │      └─ Selective symlinks (Antigravity)
       │
       ├─── sync-commands.sh
       │      └─ Creates symlinks (Cursor/Claude/Gemini)
       │      └─ Copies to workflows (Antigravity)
       │
       └─── sync-mcp.sh
              └─ Generates platform configs
                  ├─ .cursor/mcp.json
                  ├─ .claude/mcp.json
                  ├─ .gemini/settings.json
                  └─ .gemini/mcp_config.json (reference)
```

## Summary

The `.agents/` architecture provides:

**✅ Benefits:**

- Single source of truth
- Automatic synchronization
- Multi-platform support
- Instant propagation (via symlinks)
- Centralized management

**⚠️ Constraints:**

- Antigravity limitations (no project MCP, copied rules/commands)
- Agents only in Claude Code
- Platform-specific behaviors

**🔧 Components:**

- Rules (coding standards)
- Skills (knowledge packages)
- Commands (prompt templates)
- Agents (autonomous tasks)
- MCP (external integrations)

**🔄 Sync methods:**

- Symlinks (instant, preferred)
- Generation (platform-specific configs)
- Copies (Antigravity constraints)

**Result:** Consistent, maintainable AI agent configuration across entire team and all platforms!
