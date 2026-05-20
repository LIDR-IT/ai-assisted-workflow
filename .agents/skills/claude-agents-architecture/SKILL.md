---
name: claude-agents-architecture
description: This skill should be used when the user wants to "create a skill", "create a subagent", "add a command to .agents/", "understand .agents/ architecture", "explain how to create components", "what's the difference between skills, commands, and subagents", or needs guidance on creating skills, commands, or subagents within the .agents/ source-of-truth system, with automatic synchronization across all platforms (Cursor, Claude Code, Gemini CLI, Antigravity, GitHub Copilot/VSCode).
version: 1.0.0
---

# Agents Architecture

Create and manage **skills**, **commands**, and **subagents** within the `.agents/` centralized architecture with automatic synchronization across all five supported AI platforms.

## Overview

**agents-architecture** is the entry-point meta-skill for `.agents/` ecosystem authoring. It combines:

- **Understanding** the `.agents/` source-of-truth system
- **Decision guidance** for choosing the right component type
- **Creation workflows** for skills, commands, and subagents
- **Automatic synchronization** across all platforms
- **Validation** and troubleshooting

### What is the `.agents/` system?

The `.agents/` directory is the **single source of truth** for every AI agent configuration in this monorepo:

```
.agents/
├── rules/          # Coding standards and conventions
├── skills/         # Modular knowledge packages (lidr-* + generic)
├── commands/       # Slash-command prompts (lidr-* + generic)
├── subagents/      # Autonomous workers (lidr-* + generic)
├── hooks/          # Event-driven scripts + hooks.json
├── mcp/            # MCP server configurations
├── _shared/        # Shared validators (TypeScript)
├── memory/         # Persistent memory for subagents (e.g. docs-agent)
├── orchestrator/   # AGENTS.md (master orchestrator doc)
├── adapters/       # Per-platform sync adapters (bash)
├── lib/            # Shared bash libraries
├── sync/           # Per-component sync orchestrators
├── workflows/      # → commands (symlink, Antigravity-facing)
└── sync.sh         # Unified sync CLI
```

**Key principle:** Edit once in `.agents/`, propagate everywhere.

### Supported platforms (verified May 2026)

| Platform             | Reads what                                                                               | How                                                                                                           |
| -------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| **Claude Code**      | `.claude/{rules,skills,commands,agents,hooks}/`                                          | Symlinks → `.agents/...`                                                                                      |
| **Cursor**           | `.cursor/{rules,skills,commands,agents}/`                                                | Symlinks (skills/commands/agents); copy-flatten (rules → `.mdc`)                                              |
| **Gemini CLI**       | `.agents/{skills,rules,subagents}/` natively; `.gemini/{commands,agents}/`               | Native for skills/rules; symlink for `agents`; generated `.toml` for commands                                 |
| **Antigravity**      | `.agents/{rules,skills,workflows}/`                                                      | Native detection; commands via `workflows → commands` symlink                                                 |
| **Copilot (VSCode)** | `.agents/skills/` natively; `.github/{instructions,prompts,agents}/`; `.vscode/mcp.json` | Native for skills; copy + rename for rules/commands/subagents (`.instructions.md`, `.prompt.md`, `.agent.md`) |

### Automatic synchronization

After creating any component, run `./.agents/sync.sh` (or `--only=<component>`) to:

1. Create symlinks where supported (Claude, Cursor, Gemini for most components)
2. Copy + format-convert for Copilot and Cursor rules
3. Generate platform-specific MCP configs
4. Verify synchronization success

## Component types

### Skills

**Definition:** Modular packages with specialized knowledge and bundled resources (scripts, references, examples, assets).

**When to use:**

- Reusable across multiple projects or contexts
- Requires documentation, templates, or scripts
- Provides domain expertise (e.g. database schemas, testing patterns, API docs)
- Needs bundled resources beyond a single prompt

**Source location:** `.agents/skills/{skill-name}/`

**Structure:**

```
.agents/skills/react-testing/
├── SKILL.md          # Main instructions (required, lean, ~400-700 lines)
├── references/       # Loaded on-demand by the AI
├── examples/         # Copy-paste examples
├── assets/           # Templates, images, resources
└── scripts/          # Executable utilities
```

**Detailed guide:** see `references/skill-creation-guide.md`

### Commands

**Definition:** Frequently-used prompts stored as Markdown files, invoked via `/{command-name}`.

**When to use:**

- Quick, single-turn actions
- Reusable prompts without complex logic
- No bundled resources needed

**Source location:** `.agents/commands/{command-name}.md`

**Format varies by platform:** Markdown for Claude/Cursor/Antigravity, TOML for Gemini (auto-converted by sync), `.prompt.md` for Copilot (auto-renamed).

**Detailed guide:** see `references/command-creation-guide.md`

### Subagents

**Definition:** Autonomous workers spawned by the main agent to handle multi-step tasks with their own context, tool budget, and system prompt.

**When to use:**

- Multi-step workflows requiring decisions
- Tasks that benefit from isolated context
- Specialists invoked from the main flow (e.g. QA suite generation, security audit)

**Source location:** `.agents/subagents/{agent-name}.md` ← **NOT `.claude/agents/`**

**Platform support:** 4 of 5 platforms — Claude Code, Cursor, Gemini CLI (Apr 2026), Copilot. Only Antigravity does not support subagents.

**Detailed guide:** see `references/agent-creation-guide.md`

## Decision guide

### Quick flowchart

```
What do you need to create?

├─ Reusable knowledge or workflow?
│  ├─ Needs scripts, templates, or documentation?
│  │  ├─ YES → SKILL
│  │  └─ NO  → COMMAND
│  └─ Used across multiple projects?
│     ├─ YES → SKILL
│     └─ NO  → COMMAND
│
├─ Autonomous multi-step task with its own context?
│  └─ SUBAGENT (works in 4 of 5 platforms; Antigravity is the exception)
│
└─ Just a reusable prompt?
   └─ COMMAND
```

### Comparison table

| Aspect          | Skill                       | Command                      | Subagent                      |
| --------------- | --------------------------- | ---------------------------- | ----------------------------- |
| **Complexity**  | High                        | Low                          | High                          |
| **Autonomy**    | No                          | No                           | Yes                           |
| **Resources**   | Yes (scripts/refs/examples) | No                           | No                            |
| **Source**      | `.agents/skills/{name}/`    | `.agents/commands/{name}.md` | `.agents/subagents/{name}.md` |
| **Format**      | Directory with `SKILL.md`   | Single `.md` file            | Single `.md` file             |
| **Platforms**   | All 5                       | All 5                        | 4 of 5 (no Antigravity)       |
| **Sync needed** | Yes (automatic)             | Yes (automatic)              | Yes (automatic)               |

### Decision examples

**Scenario 1:** "I need to teach AI how to write database queries with our schema"

- Reusable knowledge + needs schema documentation → **SKILL** (with `references/schema.md`)

**Scenario 2:** "I want a quick prompt to review code for bugs"

- Simple prompt, no resources → **COMMAND**

**Scenario 3:** "I need AI to analyze and refactor an entire module autonomously"

- Multi-step, autonomous, decision-making → **SUBAGENT**

## Creation workflows

### Workflow: Creating a skill

1. **Decide name and purpose** (`lowercase-with-hyphens`, e.g. `react-testing`)
2. **Identify bundled resources** (scripts? references? assets?)
3. **Create directory structure**

   ```bash
   mkdir -p .agents/skills/{name}/{references,examples,assets,scripts}
   ```

4. **Write `SKILL.md`** with frontmatter

   ```markdown
   ---
   name: skill-name
   description: This skill should be used when the user asks to "trigger 1", "trigger 2". Brief context.
   version: 0.1.0
   ---

   # Skill Name

   Instructions...
   ```

5. **Add bundled resources**, reference them from `SKILL.md`
6. **Sync:** `./.agents/sync.sh --only=skills`
7. **Verify**

   ```bash
   ls .agents/skills/{name}/SKILL.md          # source
   readlink .claude/skills .cursor/skills      # symlinks → ../.agents/skills
   # Gemini, Antigravity, Copilot read .agents/skills/ natively
   ```

8. **Test** with the trigger phrases from your description

**Detailed process:** `references/skill-creation-guide.md`
**Template:** `examples/skill-template.md`

### Workflow: Creating a command

1. **Decide name and prompt content** (`lowercase-with-hyphens`, e.g. `security-review`)
2. **Create file**

   ```bash
   touch .agents/commands/{name}.md
   ```

3. **Write frontmatter + content**

   ```markdown
   ---
   description: Brief description
   ---

   # Command Prompt

   Your prompt instructions...
   ```

4. **Sync:** `./.agents/sync.sh --only=commands`
5. **Verify**

   ```bash
   ls .agents/commands/{name}.md               # source
   readlink .claude/commands .cursor/commands  # symlinks
   ls .gemini/commands/{name}.toml             # generated TOML
   ls .github/prompts/{name}.prompt.md         # Copilot copy
   ls .agents/workflows/{name}.md              # Antigravity (via symlink)
   ```

6. **Test** by invoking `/{name}` in your AI agent

**Detailed process:** `references/command-creation-guide.md`
**Template:** `examples/command-template.md`

### Workflow: Creating a subagent

1. **Decide name and purpose** (`lowercase-with-hyphens`, e.g. `code-reviewer`; LIDR-specific agents use `lidr-*`)
2. **Create source file** at `.agents/subagents/{name}.md` (**NOT** `.claude/agents/`)

   ```bash
   touch .agents/subagents/{name}.md
   ```

3. **Write frontmatter + system prompt**

   ```markdown
   ---
   name: agent-name
   description: Use this agent when [trigger]. It [action] and returns [output].
   tools: Read, Edit, Grep, Bash
   model: sonnet
   color: blue
   ---

   # Agent Title

   You are an autonomous subagent specialized in [task]...

   ## Your Capabilities

   - ...

   ## Your Workflow

   1. ...

   ## Autonomous Decision-Making

   ...

   ## Output Format

   ...
   ```

4. **Sync:** `./.agents/sync.sh --only=agents`
   - Creates symlinks: `.claude/agents`, `.cursor/agents`, `.gemini/agents` → `../.agents/subagents`
   - Generates `.github/agents/{name}.agent.md` for Copilot
   - Antigravity is skipped (not supported)

5. **Verify**

   ```bash
   ls .agents/subagents/{name}.md
   readlink .claude/agents .cursor/agents .gemini/agents
   ls .github/agents/{name}.agent.md
   ```

6. **Test** by triggering a task matching your `description:` field

**Critical:** the YAML `name:` MUST match the filename (without `.md`). All 6 LIDR subagents were aligned during the May 2026 audit.

**Detailed process:** `references/agent-creation-guide.md`
**Template:** `examples/agent-template.md`

## Automatic synchronization

### What `sync.sh` does

The `.agents/sync.sh` CLI orchestrates synchronization of all components across all platforms.

```
.agents/sync.sh
├── lib/         # Shared bash utilities (logging, symlink, frontmatter, registry)
├── adapters/    # Per-platform transformations (claude.sh, cursor.sh, gemini.sh, antigravity.sh, copilot.sh)
├── sync/        # Per-component orchestrators (rules.sh, skills.sh, commands.sh, agents.sh, mcp.sh, hooks.sh)
└── platforms.json   # Platform registry: which strategy per platform/component
```

### Per-platform sync strategy

| Component     | Cursor                       | Claude Code                       | Gemini CLI                           | Antigravity                             | Copilot                         |
| ------------- | ---------------------------- | --------------------------------- | ------------------------------------ | --------------------------------------- | ------------------------------- |
| **Rules**     | Copy + `.mdc` (flatten)      | Symlink                           | Index in `GEMINI.md`                 | Native                                  | Copy `.instructions.md` + index |
| **Skills**    | Symlink                      | Symlink                           | **Native** (`.agents/skills/` alias) | Native                                  | **Native**                      |
| **Commands**  | Symlink                      | Symlink                           | Generated `.toml`                    | Native (`.agents/workflows → commands`) | Copy `.prompt.md`               |
| **Subagents** | Symlink                      | Symlink                           | Symlink (Apr 2026)                   | ❌ not supported                        | Copy `.agent.md`                |
| **MCP**       | Generated `.cursor/mcp.json` | Generated `.mcp.json` (repo root) | Generated `.gemini/settings.json`    | ❌ global only                          | Generated `.vscode/mcp.json`    |
| **Hooks**     | Partial (no Notification)    | Full                              | Full                                 | ❌ global only                          | Partial (no Notification)       |

**Key terms:**

- **Symlink** — instant propagation; edits in `.agents/` are seen immediately
- **Native** — platform detects `.agents/` directly per [Agent Skills open standard](https://agentskills.io); no sync action required
- **Generated** — adapter transforms source into a platform-specific format (e.g. `.toml`, `.instructions.md`, JSON)
- **Copy + rename** — adapter writes a renamed copy; re-sync required after source edits

### Manual verification

```bash
# Source files exist
ls .agents/skills/{name}/SKILL.md
ls .agents/commands/{name}.md
ls .agents/subagents/{name}.md

# Symlinks (where applicable)
readlink .claude/skills .cursor/skills           # → ../.agents/skills
readlink .claude/commands .cursor/commands       # → ../.agents/commands
readlink .claude/agents .cursor/agents .gemini/agents   # → ../.agents/subagents

# Generated files (re-sync after edits)
ls .gemini/commands/{name}.toml
ls .github/{prompts,agents,instructions}/
ls .mcp.json .cursor/mcp.json .gemini/settings.json .vscode/mcp.json

# Antigravity-facing internal symlink
readlink .agents/workflows                       # → commands
```

### Platform-specific notes

- **Symlinked components** (Claude/Cursor for skills/commands/agents/rules; Gemini for agents): edits propagate instantly. No re-sync after edits.
- **Native components** (Gemini skills/rules; Antigravity rules/skills/commands; Copilot skills): no sync action needed — the platform reads `.agents/` directly.
- **Generated/copied components** (Gemini commands `.toml`; Copilot rules/commands/agents; Cursor rules `.mdc`; MCP configs): **must re-sync after source edits**.
- **Antigravity:** workspace caches at load time. After sync, reload the project to pick up changes.

**Detailed internals:** `references/sync-system.md` and `references/architecture-overview.md`

## Validation

### Validate a skill

```bash
./.agents/skills/agents-architecture/scripts/validate-skill.sh {skill-name}
```

Checks: directory exists, `SKILL.md` present, frontmatter valid, `name`/`description` fields, third-person form.

### Validate a command

```bash
./.agents/skills/agents-architecture/scripts/validate-command.sh {command-name}
```

Checks: file exists at `.agents/commands/{name}.md`, valid Markdown, optional frontmatter well-formed.

### Validate a subagent

```bash
./.agents/skills/agents-architecture/scripts/validate-agent.sh {agent-name}
```

Checks: file exists at `.agents/subagents/{name}.md`, frontmatter present, `name`/`description` fields, `name:` matches filename, optional `tools`/`model`/`color` valid.

## Troubleshooting

### Issue: Skill not appearing

```bash
# Source exists?
ls .agents/skills/{name}/SKILL.md

# Symlinks intact?
readlink .claude/skills .cursor/skills

# Gemini/Antigravity/Copilot: no symlink — they read .agents/skills/ natively
ls .agents/skills/{name}/

# Re-sync
./.agents/sync.sh --only=skills
```

### Issue: Command not found

```bash
# Source exists?
ls .agents/commands/{name}.md

# Symlinks intact?
readlink .claude/commands .cursor/commands

# Generated for Gemini?
ls .gemini/commands/{name}.toml

# Generated for Copilot?
ls .github/prompts/{name}.prompt.md

# Re-sync
./.agents/sync.sh --only=commands
```

### Issue: Subagent not invoking

1. **Check `description:` field** — is it specific enough to match user intent?
2. **Verify location** — source MUST be at `.agents/subagents/{name}.md`, NOT `.claude/agents/{name}.md`
3. **Confirm `name:` matches filename** (without `.md`)
4. **Verify distribution**

   ```bash
   readlink .claude/agents .cursor/agents .gemini/agents   # → ../.agents/subagents
   ls .github/agents/{name}.agent.md                       # Copilot copy
   ```

5. **Re-sync** if anything is missing: `./.agents/sync.sh --only=agents`
6. **Antigravity:** subagents are not supported. Use a slash command instead.

### Issue: Changes not propagating

- **Symlinked components** (Claude/Cursor/Gemini agents/skills/commands): should be instant. If not, `readlink` and recreate symlink.
- **Native components** (Gemini skills/rules, Antigravity, Copilot skills): nothing to sync. Try reloading the platform.
- **Generated components** (Gemini commands `.toml`, Copilot copies, Cursor `.mdc` rules, MCP configs): re-run `./.agents/sync.sh`.

### Issue: Sync script fails

```bash
ls -la .agents/sync.sh                        # exists and executable?
chmod +x .agents/sync.sh                       # if needed
./.agents/sync.sh --dry-run                    # preview
./.agents/sync.sh --verbose                    # debug output
```

## Architecture overview

For a deep dive into the `.agents/` system, see `references/architecture-overview.md`.

**Key concepts:**

- **Source of truth:** `.agents/` directory (all components)
- **Synchronization:** symlinks, native detection, generation, or copy depending on platform/component
- **Component types:** Rules, Skills, Commands, Subagents, Hooks, MCP

**Platform support matrix (verified May 2026):**

| Platform         | Rules                           | Skills  | Commands           | Subagents        | MCP                      | Hooks     |
| ---------------- | ------------------------------- | ------- | ------------------ | ---------------- | ------------------------ | --------- |
| Cursor           | Copy `.mdc`                     | Symlink | Symlink            | Symlink          | ✅ project               | Partial   |
| Claude Code      | Symlink                         | Symlink | Symlink            | Symlink          | ✅ (`.mcp.json` at root) | Full      |
| Gemini CLI       | Index in `GEMINI.md`            | Native  | Generated `.toml`  | Symlink          | ✅ project               | Full      |
| Antigravity      | Native                          | Native  | Native (workflows) | ❌               | ❌ global                | ❌ global |
| Copilot (VSCode) | Copy `.instructions.md` + index | Native  | Copy `.prompt.md`  | Copy `.agent.md` | ✅ project               | Partial   |

## References & resources

### Detailed guides

- `references/skill-creation-guide.md` — Complete process for creating skills with progressive disclosure
- `references/command-creation-guide.md` — Detailed workflow for creating commands
- `references/agent-creation-guide.md` — Subagent creation, system prompt design, multi-platform distribution
- `references/architecture-overview.md` — Deep dive into `.agents/` architecture and sync strategies
- `references/sync-system.md` — Internal workings of `sync.sh`, adapters, and troubleshooting

### Templates

- `examples/skill-template.md` — Copy-paste skill template
- `examples/command-template.md` — Copy-paste command template
- `examples/agent-template.md` — Copy-paste subagent template

### Validation scripts

- `scripts/validate-skill.sh`
- `scripts/validate-command.sh`
- `scripts/validate-agent.sh`

### Related sub-skills (deeper dives)

For specialized creation workflows, see:

- **`lidr-skill-development`** — Deep dive into skill authoring
- **`command-development`** — Generic command authoring patterns
- **`lidr-agent-development`** — Subagent design and orchestration
- **`lidr-skill-creator`** — Generic skill creation workflow

**Note:** `agents-architecture` is the meta-skill that provides architectural context and routing. For in-depth component-specific guidance, use the specialized skills above.

## Quick reference

### Source-of-truth locations

```
Skills:     .agents/skills/{name}/SKILL.md
Commands:   .agents/commands/{name}.md
Subagents:  .agents/subagents/{name}.md
Rules:      .agents/rules/{category}/{name}.md
Hooks:      .agents/hooks/hooks.json + .agents/hooks/scripts/
MCP:        .agents/mcp/mcp-servers.json
```

### Sync commands

```bash
./.agents/sync.sh                              # sync everything
./.agents/sync.sh --dry-run                    # preview without changes
./.agents/sync.sh --only=skills                # one component
./.agents/sync.sh --only=agents                # subagents
./.agents/sync.sh --only=commands
./.agents/sync.sh --only=rules
./.agents/sync.sh --only=mcp
./.agents/sync.sh --only=hooks
./.agents/sync.sh --platform=claude            # one platform
./.agents/sync.sh --platform=copilot --only=rules
```

### Verification commands

```bash
# Symlinks
readlink .claude/skills .cursor/skills          # → ../.agents/skills
readlink .claude/commands .cursor/commands      # → ../.agents/commands
readlink .claude/agents .cursor/agents .gemini/agents   # → ../.agents/subagents

# Generated/copied
ls .gemini/commands/*.toml
ls .github/instructions/*.instructions.md
ls .github/prompts/*.prompt.md
ls .github/agents/*.agent.md
ls .mcp.json .cursor/mcp.json .vscode/mcp.json .gemini/settings.json

# Antigravity workflows
readlink .agents/workflows                      # → commands
```

### Validation commands

```bash
./.agents/skills/agents-architecture/scripts/validate-skill.sh {name}
./.agents/skills/agents-architecture/scripts/validate-command.sh {name}
./.agents/skills/agents-architecture/scripts/validate-agent.sh {name}
```

---

**Ready to create?** Decide which component fits your need (skill, command, or subagent), then follow the appropriate workflow above. Synchronization is one command away: `./.agents/sync.sh`.

## Changelog

| Version | Date       | Author                        | Changes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| ------- | ---------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1.0.0   | 2026-05-19 | TL: agents-architecture audit | Major rewrite: corrected subagent source-of-truth to `.agents/subagents/` (was `.claude/agents/`); subagents now correctly described as supported in 4 of 5 platforms (Claude, Cursor, Gemini Apr 2026, Copilot — not Antigravity); Gemini skills/rules marked as native (not symlinked); Copilot copy + rename distribution documented; full directory tree includes `subagents/, hooks/, _shared/, memory/, orchestrator/, adapters/, lib/, sync/, workflows/`; updated cross-references to `lidr-*` sub-skills. |
| 0.2.0   | 2025-Q4    | (original)                    | Initial version after `team-skill-creator` rename. Claimed agents were Claude Code only; described Gemini as full symlinks (incorrect post-2026 architecture).                                                                                                                                                                                                                                                                                                                                                     |
