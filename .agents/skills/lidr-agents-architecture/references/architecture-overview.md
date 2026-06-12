---
id: architecture-overview
version: "2.0.0"
last_updated: "2026-05-19"
updated_by: "TL: agents-architecture audit"
status: active
type: reference
review_cycle: 90
next_review: "2026-08-19"
owner_role: "Tech Lead"
---

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

The `.agents/` system provides **centralized configuration management** for AI agents across 5 platforms (verified May 2026):

1. **Cursor** — Symlinks for skills/commands/agents; copy+flatten for rules (`.mdc`); generated MCP config
2. **Claude Code** — Symlinks for all directory components; generated MCP at repo root (`.mcp.json`)
3. **Gemini CLI** — Native detection for skills/rules (per [Agent Skills open standard](https://agentskills.io)); symlinked agents (Apr 2026); generated `.toml` for commands
4. **Antigravity** — Native detection for rules/skills/commands; no project-level MCP; no subagents
5. **Copilot (VSCode)** — Native skills; copy + format conversion for rules (`.instructions.md`), commands (`.prompt.md`), subagents (`.agent.md`); generated MCP at `.vscode/mcp.json`

**Core principle:** Edit once in `.agents/`, automatically synchronized to every platform.

### Key benefits

**Consistency:**

- Single source of truth
- No configuration drift between platforms
- Uniform team experience

**Efficiency:**

- Edit once, propagate everywhere
- Instant updates where symlinks are used
- Reduced maintenance burden

**Scalability:**

- Add platforms via new adapters
- Centralized updates
- Team-wide synchronization

## Source of Truth Pattern

### Central directory: `.agents/`

```
.agents/
├── rules/          # Coding standards (5 LIDR + 17 generic, in 10 categories)
├── skills/         # 66 skills (62 lidr-* + 4 generic)
├── commands/       # 30 commands (23 lidr-* + 7 generic)
├── subagents/      # 9 subagents (6 lidr-* + 3 generic)
├── hooks/          # 6 hooks across 5 events; hooks.json + scripts/
├── mcp/            # MCP server configurations (mcp-servers.json + .env)
├── _shared/        # Shared validators (TypeScript, ~3,482 LOC)
├── memory/         # Persistent memory for subagents (e.g. docs-agent)
├── orchestrator/   # AGENTS.md (master orchestrator doc)
├── adapters/       # Per-platform sync adapters (claude.sh, cursor.sh, gemini.sh, antigravity.sh, copilot.sh)
├── lib/            # Shared bash libraries (core, symlink, frontmatter, registry)
├── sync/           # Per-component sync orchestrators (rules, skills, commands, agents, mcp, hooks)
├── workflows/      # → commands (internal symlink for Antigravity)
├── platforms.json  # Platform registry (capabilities, strategies)
└── sync.sh         # Unified sync CLI
```

**Purpose:** Master configurations that sync to all platforms.

### Consumer directories

Platform-specific directories receive synced configurations:

```
.cursor/                    # Cursor AI
├── rules/                  # Copy + .mdc (flat)
├── skills → ../.agents/skills
├── commands → ../.agents/commands
├── agents → ../.agents/subagents
└── mcp.json                # Generated

.claude/                    # Claude Code
├── rules → ../.agents/rules
├── skills → ../.agents/skills
├── commands → ../.agents/commands
├── agents → ../.agents/subagents
├── hooks/                  # Symlinked scripts; settings.json holds hook config
└── settings.json
# Note: Claude MCP lives at repo root .mcp.json, NOT .claude/mcp.json

.gemini/                    # Gemini CLI
├── GEMINI.md               # Rules index (no rules/ directory)
├── commands/               # Generated .toml from .agents/commands/*.md
├── agents → ../.agents/subagents
└── settings.json           # MCP servers nested here
# Skills read natively from .agents/skills/ (no .gemini/skills/)

.agents/                    # Antigravity (native detection)
├── rules/                  # Read natively
├── skills/                 # Read natively
└── workflows → commands    # Internal symlink so .agents/commands/ shows as workflows

.github/                    # Copilot (VSCode)
├── instructions/           # Copy + .instructions.md from .agents/rules/
├── prompts/                # Copy + .prompt.md from .agents/commands/
├── agents/                 # Copy + .agent.md from .agents/subagents/
├── copilot-instructions.md # Auto-generated index
└── hooks/                  # Hook configs

.vscode/
└── mcp.json                # Copilot MCP (generated)
```

**Note:** `→` indicates symlink, regular text indicates files/directories.

## Directory Structure

### `.agents/rules/`

**Purpose:** Project-wide coding standards and conventions.

**Contents:** 22 rules in 10 categories — `code/`, `content/`, `design/`, `frameworks/`, `lidr-sdlc/`, `process/`, `product/`, `quality/`, `team/`, `tools/`.

**Sync strategy per platform:**

- **Claude Code:** symlink `.claude/rules → ../.agents/rules` (supports nested subdirectories)
- **Cursor:** copy + flatten to `.cursor/rules/*.mdc`
- **Gemini CLI:** indexed in `GEMINI.md` (no rules directory pattern)
- **Antigravity:** native detection from `.agents/rules/`
- **Copilot:** copy to `.github/instructions/*.instructions.md` + auto-generated `copilot-instructions.md` index

### `.agents/skills/`

**Purpose:** Modular packages with specialized knowledge and bundled resources, following the [Agent Skills open standard](https://agentskills.io).

**Contents:** 66 skills (62 `lidr-*` + 4 generic).

**Structure per skill:**

```
.agents/skills/skill-name/
├── SKILL.md          # Required, lean (~400-700 lines)
├── references/       # Loaded on-demand
├── examples/         # Copy-paste examples
├── assets/           # Templates, images
└── scripts/          # Executable utilities
```

**Sync strategy per platform:**

- **Claude Code, Cursor:** symlink `.claude/skills`, `.cursor/skills → ../.agents/skills`
- **Gemini CLI, Antigravity, Copilot:** native detection from `.agents/skills/` (per Agent Skills open standard) — no sync needed

### `.agents/commands/`

**Purpose:** Frequently-used prompts invoked via `/{command-name}`.

**Contents:** 30 commands (23 `lidr-*` + 7 generic).

**Sync strategy per platform:**

- **Claude Code, Cursor:** symlink `.claude/commands`, `.cursor/commands → ../.agents/commands` (Cursor 1.6+)
- **Gemini CLI:** generated `.toml` files in `.gemini/commands/`
- **Antigravity:** native detection via internal `.agents/workflows → commands` symlink; called "workflows" by Antigravity
- **Copilot:** copy + rename to `.github/prompts/{name}.prompt.md`

### `.agents/subagents/`

**Purpose:** Autonomous workers with their own context and tool budget.

**Contents:** 9 subagents (6 `lidr-*` + 3 generic).

**Sync strategy per platform:**

- **Claude Code:** symlink `.claude/agents → ../.agents/subagents`
- **Cursor:** symlink `.cursor/agents → ../.agents/subagents`
- **Gemini CLI:** symlink `.gemini/agents → ../.agents/subagents` (subagents feature shipped Apr 2026 per [docs](https://geminicli.com/docs/core/subagents/))
- **Copilot:** copy + rename to `.github/agents/{name}.agent.md`
- **Antigravity:** ❌ not supported

### `.agents/hooks/`

**Purpose:** Event-driven scripts (PreToolUse, PostToolUse, Notification, SessionStart, Stop).

**Contents:** 6 hooks (3 generic: `notify.sh`, `auto-format.sh`, `protect-secrets.sh`; 3 LIDR Claude-only: `lidr-frontmatter-guard`, `lidr-load-context`, `lidr-validate-ecosystem-counts`).

**Sync strategy per platform:**

- **Claude Code:** full support; hooks registered in `.claude/settings.json` PascalCase events; scripts symlinked
- **Gemini CLI:** full support; `BeforeTool`/`AfterTool` event names; timeout in milliseconds
- **Cursor:** partial (no Notification event); `version: 1`, events `afterFileEdit`/`afterTabFileEdit`
- **Copilot (VSCode):** partial (no Notification); `type: "command"` required; matcher parsed but not enforced
- **Antigravity:** global only

### `.agents/mcp/`

**Purpose:** Model Context Protocol server configurations.

**Contents:** `mcp-servers.json` (source of truth) + `.env` (secrets).

**Sync strategy per platform:**

- **Cursor:** generated `.cursor/mcp.json`
- **Claude Code:** generated `.mcp.json` at repo root (NOT `.claude/mcp.json`)
- **Gemini CLI:** generated `.gemini/settings.json` (nested `mcpServers`)
- **Copilot:** generated `.vscode/mcp.json`
- **Antigravity:** global only at `~/.gemini/antigravity/mcp_config.json` — not project-level

## Synchronization Strategies

### Strategy 1: Full Directory Symlinks

**Used for:** skills, commands, subagents (and rules for Claude)
**Platforms:** Cursor, Claude Code, Gemini (subagents only)

**Mechanism:**

```bash
ln -s ../.agents/skills .cursor/skills
ln -s ../.agents/subagents .gemini/agents
```

**Advantages:**

- ✅ Instant propagation of edits
- ✅ Zero duplication
- ✅ Filesystem-native
- ✅ No re-sync needed after edits

**Example state:**

```
.cursor/skills → ../.agents/skills
.claude/skills → ../.agents/skills
.cursor/agents → ../.agents/subagents
.claude/agents → ../.agents/subagents
.gemini/agents → ../.agents/subagents
```

### Strategy 2: Native Detection

**Used for:** skills (Gemini/Antigravity/Copilot), rules (Antigravity), commands (Antigravity)
**Platforms:** Gemini CLI, Antigravity, Copilot

**Mechanism:** Platform reads `.agents/skills/`, `.agents/rules/`, `.agents/commands/` directly per the [Agent Skills open standard](https://agentskills.io) (or, for Antigravity, per [Google Codelabs](https://codelabs.developers.google.com/getting-started-google-antigravity) workspace conventions).

**Advantages:**

- ✅ No sync action needed
- ✅ No duplication
- ✅ Truly instant — no symlinks involved

**Warning:** do NOT create `.gemini/skills/` or `.github/skills/` — would cause duplicate detection.

### Strategy 3: Copy + Format Conversion

**Used for:** Cursor rules, Copilot rules/commands/subagents, Gemini commands
**Platforms:** Cursor, Copilot, Gemini

**Mechanism:**

- Cursor rules: copy from `.agents/rules/**/*.md` → `.cursor/rules/*.mdc` (flattened)
- Copilot rules: copy → `.github/instructions/*.instructions.md`
- Copilot commands: copy → `.github/prompts/*.prompt.md` (converts `$ARGUMENTS` → `{{{ input }}}`)
- Copilot subagents: copy → `.github/agents/*.agent.md`
- Gemini commands: transform `.md` → `.toml`

**Trade-off:** must re-run sync after editing source.

### Strategy 4: Script Generation (MCP, Hooks)

**Used for:** MCP configurations, hook configurations
**Platforms:** all (with platform-specific quirks)

**Mechanism:**

```bash
# Source: .agents/mcp/mcp-servers.json
# Script: .agents/sync.sh --only=mcp
# Generated:
#   .cursor/mcp.json
#   .mcp.json              (Claude Code, repo root)
#   .gemini/settings.json
#   .vscode/mcp.json       (Copilot)
#   .gemini/mcp_config.json (Antigravity reference; actual global only)
```

**Advantages:**

- ✅ Platform-specific formatting
- ✅ Validation during generation
- ✅ Single source, multiple targets

## Platform Support Matrix

| Platform         | MCP Project              | MCP Global | Skills  | Commands           | Subagents        | Rules                           | Hooks     |
| ---------------- | ------------------------ | ---------- | ------- | ------------------ | ---------------- | ------------------------------- | --------- |
| Cursor           | ✅                       | ✅         | Symlink | Symlink            | Symlink          | Copy `.mdc`                     | Partial   |
| Claude Code      | ✅ (`.mcp.json` at root) | ✅         | Symlink | Symlink            | Symlink          | Symlink                         | Full      |
| Gemini CLI       | ✅                       | ✅         | Native  | Generated `.toml`  | Symlink          | Index in `GEMINI.md`            | Full      |
| Antigravity      | ❌ Global only           | ✅         | Native  | Native (workflows) | ❌               | Native                          | ❌ global |
| Copilot (VSCode) | ✅                       | ✅         | Native  | Copy `.prompt.md`  | Copy `.agent.md` | Copy `.instructions.md` + Index | Partial   |

**Legend:**

- ✅ — Fully supported
- ❌ — Not supported
- **Symlink** — directory symlink (instant propagation)
- **Native** — platform reads `.agents/` directly (no sync action)
- **Generated** — adapter transforms to platform format (re-sync after edits)
- **Copy** — adapter writes platform-specific file (re-sync after edits)
- **Partial (Hooks)** — Notification event not supported on Cursor/Copilot

### Platform-specific notes

**Cursor:**

- Symlink support for skills, commands, subagents
- Rules: copied + converted to `.mdc` (flat directory; can be subdirectory per docs but adapter flattens)
- MCP servers work at project level
- Hooks: `version: 1`, `afterFileEdit`/`afterTabFileEdit`, no Notification event

**Claude Code:**

- Full symlink support for skills, commands, subagents, rules (nested subdirectories supported)
- **MCP lives at repo root `.mcp.json`** (NOT `.claude/mcp.json`)
- Hooks: PascalCase events (`PreToolUse`, `PostToolUse`, `Notification`, `SessionStart`, `Stop`), timeout in seconds

**Gemini CLI:**

- Skills/rules: native detection per Agent Skills open standard (`.agents/skills/` alias takes precedence over `.gemini/skills/`)
- Subagents: symlinked from `.agents/subagents/` (shipped Apr 2026)
- Commands: generated `.toml` from `.md` source
- MCP nested in `.gemini/settings.json`
- Hooks: `BeforeTool`/`AfterTool`/`Notification` events; timeout in **milliseconds**

**Antigravity:**

- **No project-level MCP** — global config only at `~/.gemini/antigravity/mcp_config.json`
- **No subagents** support
- Skills/rules: native detection from `.agents/`
- Commands: "workflows" terminology — accessed via internal `.agents/workflows → commands` symlink
- Workspace caches at load time — reload project after sync

**Copilot (VSCode):**

- Skills: native detection from `.agents/skills/` (also supports `.github/skills/`, `.claude/skills/`)
- Rules: copied to `.github/instructions/*.instructions.md` + auto-generated index `copilot-instructions.md`
- Commands: copied to `.github/prompts/*.prompt.md` (with `$ARGUMENTS` → `{{{ input }}}` conversion)
- Subagents: copied to `.github/agents/*.agent.md`
- MCP: generated `.vscode/mcp.json`
- Hooks: `version: 1`, PascalCase events, `type: "command"` required, no Notification

## Component Types

### Rules

**Definition:** Project-wide coding standards and workflows.

**Purpose:**

- Define code style and conventions
- Document architecture decisions
- Specify testing requirements
- Establish Git workflows

**Loading:** Always loaded (or path-scoped on Claude Code via `paths:` frontmatter).

**Examples:**

- `code/principles.md` — Architecture patterns
- `code/style.md` — Formatting conventions
- `lidr-sdlc/workflows.md` — Role × command authorization matrix

### Skills

**Definition:** Modular packages with specialized knowledge and bundled resources, following the [Agent Skills open standard](https://agentskills.io).

**Purpose:**

- Provide domain expertise
- Include scripts, references, templates
- Enable reusable workflows

**Loading:** Triggered when description matches user intent.

**Examples:**

- `lidr-agents-architecture` — Umbrella meta-skill for creating skills/commands/subagents/hooks/MCP/rules
- `lidr-business-case` — LIDR Phase 1 originación
- `lidr-generate-rf` — LIDR Phase 3 especificación
- Command authoring deep-dive → `references/command-development.md` (folded into this skill)

### Commands

**Definition:** Frequently-used prompts accessible via `/{command-name}`.

**Purpose:**

- Quick, single-turn actions
- Reusable prompt templates

**Invocation:** Manual via `/{name}`.

**Examples:**

- `/commit` — Conventional commit message generator
- `/lidr-advance-gate` — LIDR gate evaluation
- `/lidr-help` — Ecosystem search

### Subagents

**Definition:** Autonomous workers spawned for multi-step tasks.

**Purpose:**

- Handle complex workflows autonomously
- Make decisions independently
- Use their own tool/context budget

**Platforms:** 4 of 5 (Claude, Cursor, Gemini, Copilot) — Antigravity is the only exclusion.

**Source location:** `.agents/subagents/` (NOT `.claude/agents/`).

**Examples:**

- `lidr-qa-agent` — Test suite preparation on Ready for QA
- `lidr-security-agent` — SAST/SCA/DAST interpretation
- `doc-improver` — Documentation audit

### Hooks

**Definition:** Event-driven scripts that run at specific lifecycle moments.

**Events:** PreToolUse, PostToolUse, Notification, SessionStart, Stop (Claude naming).

**Examples:**

- `protect-secrets.sh` — block edits to `.env`, `.key`, `.pem`
- `auto-format.sh` — run prettier on edited files
- `lidr-validate-ecosystem-counts` — sync 8 sources of truth at session end

### MCP Servers

**Definition:** External tool integrations via Model Context Protocol.

**Purpose:**

- Connect external APIs (Context7, GitHub, Notion, etc.)
- Expose external services as native tools

**Configuration:** `.agents/mcp/mcp-servers.json` (source) + `.env` (secrets).

**Examples:**

- Context7 — Documentation lookup
- Database connectors
- Custom internal APIs

## Data Flow

### Creating a skill

```
Step 1: Create source
  .agents/skills/new-skill/SKILL.md (+ references/, examples/, etc.)

Step 2: Sync
  ./.agents/sync.sh --only=skills

Step 3: Distribution
  .cursor/skills → ../.agents/skills          (symlink)
  .claude/skills → ../.agents/skills          (symlink)
  .agents/skills/new-skill                    (native: Gemini, Antigravity, Copilot)

Step 4: Available in all 5 platforms
```

### Creating a command

```
Step 1: Create source
  .agents/commands/new-command.md

Step 2: Sync
  ./.agents/sync.sh --only=commands

Step 3: Distribution
  .cursor/commands → ../.agents/commands           (symlink)
  .claude/commands → ../.agents/commands           (symlink)
  .gemini/commands/new-command.toml                (generated)
  .agents/workflows/new-command.md                 (native via internal symlink: Antigravity)
  .github/prompts/new-command.prompt.md            (copy + rename: Copilot)

Step 4: Available via /new-command in all 5 platforms
```

### Creating a subagent

```
Step 1: Create source
  .agents/subagents/new-agent.md

Step 2: Sync
  ./.agents/sync.sh --only=agents

Step 3: Distribution
  .claude/agents → ../.agents/subagents            (symlink)
  .cursor/agents → ../.agents/subagents            (symlink)
  .gemini/agents → ../.agents/subagents            (symlink, Apr 2026)
  .github/agents/new-agent.agent.md                (copy + rename: Copilot)

Step 4: Available in 4 of 5 platforms (no Antigravity)
```

### Updating MCP config

```
Step 1: Edit source
  .agents/mcp/mcp-servers.json

Step 2: Sync
  ./.agents/sync.sh --only=mcp

Step 3: Generate platform configs
  .cursor/mcp.json                              (Cursor format)
  .mcp.json                                     (Claude Code, repo root)
  .gemini/settings.json                         (nested mcpServers)
  .vscode/mcp.json                              (Copilot)

Step 4: Antigravity manual config
  Manually update: ~/.gemini/antigravity/mcp_config.json (global only)
```

## Architecture Diagrams

### System overview

```
┌──────────────────────────────────────────────────────────────────────┐
│                  .agents/ (Source of Truth)                          │
├──────────────────────────────────────────────────────────────────────┤
│  rules/   skills/   commands/   subagents/   hooks/   mcp/   _shared/│
│  memory/  orchestrator/   adapters/   lib/   sync/   workflows→cmds  │
└──┬─────────┬──────────┬──────────┬──────────┬────────┬──────────────┘
   │         │          │          │          │        │
 SYMLINK   SYMLINK    SYMLINK    SYMLINK    GENERATE  COPY+RENAME
   │         │          │          │          │        │
┌──▼─────────▼──────────▼──────────▼──────────▼────────▼──────────────┐
│              Per-platform consumer directories                       │
├──────────────────────────────────────────────────────────────────────┤
│  .cursor/   .claude/   .gemini/   .agents/ (Antigravity)   .github/  │
│  + .vscode/mcp.json + .mcp.json (Claude Code, repo root)             │
└──────────────────────────────────────────────────────────────────────┘
```

### Sync flow

```
User creates/edits in .agents/
       │
       ▼
.agents/sync.sh executes
       │  (loads adapters/ and sync/ modules)
       │
       ├─── sync/rules.sh
       │     ├─ Claude: symlink .claude/rules → ../.agents/rules
       │     ├─ Cursor: copy .agents/rules/**/*.md → .cursor/rules/*.mdc
       │     ├─ Gemini: index in .gemini/GEMINI.md
       │     ├─ Antigravity: native (no action)
       │     └─ Copilot: copy → .github/instructions/*.instructions.md + index
       │
       ├─── sync/skills.sh
       │     ├─ Claude, Cursor: symlink .{claude,cursor}/skills → ../.agents/skills
       │     └─ Gemini, Antigravity, Copilot: native (no action)
       │
       ├─── sync/commands.sh
       │     ├─ Claude, Cursor: symlink .{claude,cursor}/commands → ../.agents/commands
       │     ├─ Gemini: generate .gemini/commands/*.toml
       │     ├─ Antigravity: internal .agents/workflows → commands symlink
       │     └─ Copilot: copy → .github/prompts/*.prompt.md
       │
       ├─── sync/agents.sh
       │     ├─ Claude, Cursor, Gemini: symlink .{claude,cursor,gemini}/agents → ../.agents/subagents
       │     ├─ Copilot: copy → .github/agents/*.agent.md
       │     └─ Antigravity: skip (not supported)
       │
       ├─── sync/mcp.sh
       │     └─ Generate platform configs
       │         ├─ .cursor/mcp.json
       │         ├─ .mcp.json                    (Claude Code, repo root)
       │         ├─ .gemini/settings.json
       │         ├─ .vscode/mcp.json             (Copilot)
       │         └─ ~/.gemini/antigravity/mcp_config.json (Antigravity, global only)
       │
       └─── sync/hooks.sh
             ├─ Claude: hooks in .claude/settings.json
             ├─ Cursor: .cursor/hooks.json
             ├─ Gemini: hooks in .gemini/settings.json
             ├─ Copilot: .github/hooks/hooks.json
             └─ Antigravity: global only
```

## Summary

The `.agents/` architecture provides:

**✅ Benefits:**

- Single source of truth
- Automatic synchronization
- 5-platform support
- Instant propagation (via symlinks / native detection)
- Centralized management

**⚠️ Constraints:**

- Antigravity: no project MCP, no subagents
- Gemini CLI: rules indexed (not directory)
- Cursor + Copilot rules: copy required (re-sync after edits)

**🔧 Components:**

- Rules (coding standards)
- Skills (knowledge packages)
- Commands (prompt templates)
- Subagents (autonomous workers, 4 of 5 platforms)
- Hooks (event-driven scripts)
- MCP (external integrations)

**🔄 Sync methods:**

- Symlinks (instant, preferred)
- Native detection (Agent Skills open standard, Antigravity)
- Generation (platform-specific formats)
- Copy + rename (Copilot, Cursor rules)

**Result:** Consistent, maintainable AI agent configuration across the entire team and all 5 platforms.

## Changelog

| Version | Date       | Author                        | Changes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ------- | ---------- | ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2.0.0   | 2026-05-19 | TL: agents-architecture audit | Major rewrite reflecting post-merge architecture: full directory tree (was missing `subagents/, hooks/, _shared/, memory/, orchestrator/, adapters/, lib/, sync/, workflows/`); subagents source is `.agents/subagents/` (was `.claude/agents/`); 4 of 5 platforms support subagents (was "Claude only"); Gemini skills/rules are native (not symlinked); Copilot copy + rename distribution documented; Claude MCP at repo root `.mcp.json`; per-component sync strategy matrix accurate per official platform docs verified May 2026. |
| 1.0.0   | 2025-Q4    | (original)                    | Initial version. Claimed Gemini got full symlinks for skills/rules (incorrect); agents Claude-only at `.claude/agents/`; missing entire `subagents/, hooks/, _shared/` etc. tree.                                                                                                                                                                                                                                                                                                                                                       |
