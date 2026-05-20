---
id: sync-system
version: "2.0.0"
last_updated: "2026-05-19"
updated_by: "TL: agents-architecture audit"
status: active
type: reference
review_cycle: 90
next_review: "2026-08-19"
owner_role: "Tech Lead"
---

# Synchronization System

Technical details of how the `.agents/` synchronization system works: scripts, strategies, dry-run, verification, and troubleshooting.

## Table of Contents

1. [Overview](#overview)
2. [sync.sh CLI](#syncsh-cli)
3. [Architecture](#architecture)
4. [Synchronization Strategies](#synchronization-strategies)
5. [Dry-Run Mode](#dry-run-mode)
6. [Verification](#verification)
7. [Troubleshooting](#troubleshooting)

## Overview

The synchronization system ensures configurations in `.agents/` propagate to all platform-specific directories.

**Entry point:** `.agents/sync.sh` — unified CLI for all synchronization operations.

**Architecture:**

- `.agents/lib/` — shared utility functions (logging, symlink, frontmatter, registry)
- `.agents/adapters/` — platform adapters (one per platform: `claude.sh`, `cursor.sh`, `gemini.sh`, `antigravity.sh`, `copilot.sh`)
- `.agents/sync/` — component orchestrators (`rules.sh`, `skills.sh`, `commands.sh`, `agents.sh`, `mcp.sh`, `hooks.sh`, `orchestrator.sh`)
- `.agents/platforms.json` — platform registry with strategy per platform+component

**Execution:** `sync.sh` loads platform adapters from `adapters/` and component orchestrators from `sync/`, dispatching to `{platform}_{component}()` functions dynamically.

**Component order:**

1. Orchestrator (root symlinks: AGENTS.md, CLAUDE.md, GEMINI.md)
2. Rules
3. Skills
4. Commands
5. Subagents
6. MCP servers
7. Hooks

## sync.sh CLI

**Location:** `.agents/sync.sh`

**Purpose:** Unified CLI for synchronizing all components across platforms.

### Usage

**Sync everything:**

```bash
./.agents/sync.sh
```

**Dry-run (preview without changes):**

```bash
./.agents/sync.sh --dry-run
```

**Sync specific components:**

```bash
./.agents/sync.sh --only=orchestrator
./.agents/sync.sh --only=rules
./.agents/sync.sh --only=skills
./.agents/sync.sh --only=commands
./.agents/sync.sh --only=agents
./.agents/sync.sh --only=mcp
./.agents/sync.sh --only=hooks
```

**Sync specific platforms:**

```bash
./.agents/sync.sh --platform=claude
./.agents/sync.sh --platform=cursor,claude
./.agents/sync.sh --platform=copilot --only=rules
```

**Other flags:**

```bash
./.agents/sync.sh --no-symlinks    # Replace symlinks with standalone copies
./.agents/sync.sh --verbose        # Debug output
./.agents/sync.sh --skip-yaml-check # Skip YAML frontmatter validation
```

**Output:**

```
╔═══════════════════════════════════════════════════════════════════╗
║  🔄 SYNCHRONIZING CONFIGURATIONS                                  ║
╚═══════════════════════════════════════════════════════════════════╝

Platforms:  cursor claude gemini antigravity copilot
Components: orchestrator rules skills commands agents mcp hooks

[per-component output...]

╔═══════════════════════════════════════════════════════════════════╗
║  ✅ SYNCHRONIZATION COMPLETED                                      ║
╚═══════════════════════════════════════════════════════════════════╝
```

## Architecture

### Directory Structure

```
.agents/
├── sync.sh              # ← Unified CLI entry point
├── platforms.json       # Platform registry and configuration
├── lib/                 # Shared utility functions
│   ├── core.sh
│   ├── symlink.sh
│   ├── frontmatter.sh
│   └── registry.sh
├── adapters/            # Platform adapters (one per platform)
│   ├── cursor.sh
│   ├── claude.sh
│   ├── gemini.sh
│   ├── antigravity.sh
│   └── copilot.sh
└── sync/                # Component orchestrators
    ├── orchestrator.sh
    ├── rules.sh
    ├── skills.sh
    ├── commands.sh
    ├── agents.sh
    ├── mcp.sh
    └── hooks.sh
```

### Execution Flow

`sync.sh` dynamically loads adapters and dispatches to `{platform}_{component}()` functions:

1. Parse CLI arguments (`--dry-run`, `--only=component`, `--platform=name`, etc.)
2. Validate platform names against `platforms.json`
3. Load shared libraries from `lib/`
4. Load platform adapters from `adapters/`
5. Load component orchestrators from `sync/`
6. For each component (or the `--only` target):
   - For each platform adapter:
     - Call `{platform}_{component}()` function (if defined)
7. Print summary + verification hints

### Component Orchestrators

Each file in `sync/` handles one component type across all platforms:

- **`sync/orchestrator.sh`** — Creates root symlinks (`AGENTS.md`, `CLAUDE.md`, `GEMINI.md` → `.agents/orchestrator/AGENTS.md`)
- **`sync/rules.sh`** — Syncs rules from `.agents/rules/` to all platforms
- **`sync/skills.sh`** — Syncs skills from `.agents/skills/` to platforms that need an explicit handoff (others read natively)
- **`sync/commands.sh`** — Syncs commands from `.agents/commands/` to all platforms
- **`sync/agents.sh`** — Syncs subagents from `.agents/subagents/` to all platforms (except Antigravity)
- **`sync/mcp.sh`** — Generates platform-specific MCP configs from `.agents/mcp/mcp-servers.json`
- **`sync/hooks.sh`** — Generates platform-specific hook configs from `.agents/hooks/`

## Synchronization Strategies

The four strategies are applied per component+platform per `platforms.json`. None of them is universal.

### Strategy 1: Full Directory Symlinks

Symlink a whole directory; the platform reads everything inside.

**Used by:**

| Component | Symlinked for                              |
| --------- | ------------------------------------------ |
| rules     | Claude Code only                           |
| skills    | Claude Code, Cursor                        |
| commands  | Claude Code, Cursor                        |
| subagents | Claude Code, Cursor, Gemini CLI (Apr 2026) |

**Implementation (`lib/symlink.sh`):**

```bash
create_symlink() {
  local source=$1
  local target=$2
  local label=$3

  if [ -e "$target" ] || [ -L "$target" ]; then
    rm -rf "$target"
  fi
  ln -s "$source" "$target"

  if [ -L "$target" ]; then
    log_info "✅ Created symlink: $target → $source ($label)"
  else
    log_error "❌ Failed to create symlink: $target"
    return 1
  fi
}

# Usage examples (per platform):
create_symlink "../.agents/skills"    ".cursor/skills"   "skills"
create_symlink "../.agents/skills"    ".claude/skills"   "skills"
create_symlink "../.agents/subagents" ".gemini/agents"   "subagents"   # Apr 2026
```

**Advantages:** instant propagation, zero duplication, filesystem-native.

### Strategy 2: Native Detection (no sync action)

The platform reads `.agents/` directly per a documented standard. No sync action is taken.

**Used by:**

| Component | Native for                                                                      |
| --------- | ------------------------------------------------------------------------------- |
| skills    | Gemini CLI ([Agent Skills](https://agentskills.io) alias), Antigravity, Copilot |
| rules     | Antigravity                                                                     |
| commands  | Antigravity (via internal `.agents/workflows → commands` symlink)               |

**Warning:** Do NOT create `.gemini/skills/` or `.github/skills/` — would cause duplicate detection in those platforms.

### Strategy 3: Copy + Format Conversion

The adapter copies source files and converts to a platform-specific format.

**Used by:**

| Component | Output                                                                     | Platform   |
| --------- | -------------------------------------------------------------------------- | ---------- |
| rules     | `.cursor/rules/*.mdc` (flat)                                               | Cursor     |
| rules     | `.github/instructions/*.instructions.md` + `copilot-instructions.md` index | Copilot    |
| commands  | `.gemini/commands/*.toml`                                                  | Gemini CLI |
| commands  | `.github/prompts/*.prompt.md` (with `$ARGUMENTS` → `{{{ input }}}`)        | Copilot    |
| subagents | `.github/agents/*.agent.md`                                                | Copilot    |

**Implementation example (Cursor rules):**

```bash
mkdir -p .cursor/rules
for rule in .agents/rules/**/*.md; do
  base=$(basename "$rule")
  cp "$rule" ".cursor/rules/${base%.md}.mdc"
done

file_count=$(ls -1 .cursor/rules/*.mdc 2>/dev/null | wc -l)
log_info "✅ Copied $file_count rules to .cursor/rules/"
```

**Trade-off:** must re-run sync after editing source. Copies are NOT auto-propagated.

### Strategy 4: Script Generation (JSON)

The adapter parses the source and emits a platform-specific JSON.

**Used by:**

| Component | Output                                        | Platform                  |
| --------- | --------------------------------------------- | ------------------------- |
| MCP       | `.cursor/mcp.json`                            | Cursor                    |
| MCP       | `.mcp.json` (repo root)                       | Claude Code               |
| MCP       | `.gemini/settings.json` (nested `mcpServers`) | Gemini CLI                |
| MCP       | `.vscode/mcp.json`                            | Copilot                   |
| MCP       | `~/.gemini/antigravity/mcp_config.json`       | Antigravity (global only) |
| Hooks     | per-platform hook config                      | All except Antigravity    |

**Implementation (MCP):**

```bash
SOURCE=".agents/mcp/mcp-servers.json"

generate_platform_config() {
  local platform=$1
  local output=$2

  jq --arg platform "$platform" \
    '{mcpServers: .servers |
      to_entries |
      map(select(.value.platforms | contains([$platform]))) |
      from_entries}' "$SOURCE" > "$output"

  if jq empty "$output" 2>/dev/null; then
    log_info "✅ Generated: $output"
  else
    log_error "❌ Invalid JSON: $output"
    return 1
  fi
}

generate_platform_config "cursor"  ".cursor/mcp.json"
generate_platform_config "claude"  ".mcp.json"            # Claude Code (repo root)
generate_platform_config "gemini"  ".gemini/settings.json"
generate_platform_config "copilot" ".vscode/mcp.json"
```

**Trade-off:** must re-run sync after editing source.

## Dry-Run Mode

All sync scripts support `--dry-run` mode for previewing without changes.

**Usage:**

```bash
./.agents/sync.sh --dry-run
```

**Output:**

```
[DRY RUN] Would create symlink: .cursor/skills → ../.agents/skills
[DRY RUN] Would create symlink: .claude/skills → ../.agents/skills
[DRY RUN] Would create symlink: .claude/agents → ../.agents/subagents
[DRY RUN] Would create symlink: .cursor/agents → ../.agents/subagents
[DRY RUN] Would create symlink: .gemini/agents → ../.agents/subagents
[DRY RUN] Would generate: .gemini/commands/*.toml from .agents/commands/*.md
[DRY RUN] Would copy: .github/prompts/*.prompt.md from .agents/commands/*.md
[DRY RUN] Gemini CLI / Antigravity / Copilot read .agents/skills/ natively (no action)
[DRY RUN] Antigravity reads .agents/rules/, .agents/commands/ natively (no action)
```

**Implementation pattern:**

```bash
DRY_RUN=false

if [[ "$1" == "--dry-run" ]]; then
  DRY_RUN=true
fi

run_or_dry() {
  if [ "$DRY_RUN" = true ]; then
    log_info "[DRY RUN] $*"
    return 0
  fi
  "$@"
}
```

## Verification

### Verify symlinks

**Check a symlink exists:**

```bash
ls -la .cursor/skills
# Output: lrwxr-xr-x ... .cursor/skills -> ../.agents/skills
```

**Check the target:**

```bash
readlink .cursor/skills
# Output: ../.agents/skills
```

### Full verification script (post-merge accurate)

```bash
#!/bin/bash
# verify-sync.sh

set -e

# Symlinked components per platform
declare -A EXPECTED_SYMLINKS=(
  [".claude/rules"]="../.agents/rules"
  [".claude/skills"]="../.agents/skills"
  [".claude/commands"]="../.agents/commands"
  [".claude/agents"]="../.agents/subagents"
  [".cursor/skills"]="../.agents/skills"
  [".cursor/commands"]="../.agents/commands"
  [".cursor/agents"]="../.agents/subagents"
  [".gemini/agents"]="../.agents/subagents"
  [".agents/workflows"]="commands"
)

for link in "${!EXPECTED_SYMLINKS[@]}"; do
  expected="${EXPECTED_SYMLINKS[$link]}"
  if [ ! -L "$link" ]; then
    echo "❌ Not a symlink: $link"
  elif [ "$(readlink "$link")" != "$expected" ]; then
    echo "⚠️  $link → $(readlink "$link") (expected: $expected)"
  else
    echo "✅ $link → $expected"
  fi
done

# Generated/copied components (existence check)
echo ""
echo "Generated files:"
for f in .cursor/rules/*.mdc .github/instructions/*.instructions.md \
         .github/prompts/*.prompt.md .github/agents/*.agent.md \
         .gemini/commands/*.toml .mcp.json .cursor/mcp.json \
         .gemini/settings.json .vscode/mcp.json; do
  if compgen -G "$f" > /dev/null; then
    echo "✅ $f"
  else
    echo "⚠️  Missing: $f"
  fi
done

# Native-detection components (only verify source exists)
echo ""
echo "Source for native-detection platforms:"
for d in .agents/rules .agents/skills .agents/commands; do
  [ -d "$d" ] && echo "✅ $d (Gemini/Antigravity/Copilot read this directly)"
done
```

### Verify Antigravity

Antigravity reads `.agents/rules/`, `.agents/skills/`, and workflows (via `.agents/workflows → commands`) natively. Verify the source directories exist:

```bash
ls -la .agents/rules/
ls -la .agents/skills/
readlink .agents/workflows   # Should be: commands
```

After sync, reload the project in Antigravity so it picks up changes (cached at load time).

## Troubleshooting

### Issue: Symlink not created

**Symptoms:**

```bash
ls .cursor/skills
# Shows directory, not symlink
```

**Diagnosis:**

```bash
[ -L ".cursor/skills" ] && echo "Is symlink" || echo "Not symlink"
```

**Fix:**

```bash
rm -rf .cursor/skills
./.agents/sync.sh --only=skills
```

### Issue: Permission denied

**Symptoms:** `Permission denied when running sync scripts`

**Fix:**

```bash
chmod +x .agents/sync.sh .agents/adapters/*.sh .agents/sync/*.sh .agents/lib/*.sh
./.agents/sync.sh
```

### Issue: Source directory missing

**Symptoms:** `❌ Source directory not found: .agents/skills`

**Diagnosis:**

```bash
ls -la .agents/
pwd  # Should be in repo root
```

**Fix:**

```bash
mkdir -p .agents/skills
```

### Issue: Invalid JSON in MCP config

**Symptoms:** `❌ Invalid JSON: .cursor/mcp.json`

**Diagnosis:**

```bash
jq . .cursor/mcp.json    # shows syntax error
jq . .agents/mcp/mcp-servers.json   # check source
```

**Fix:**

```bash
# Fix source first if needed
vim .agents/mcp/mcp-servers.json

# Regenerate
./.agents/sync.sh --only=mcp
```

### Issue: Antigravity changes not propagating

**Symptoms:** Edited rule/command/skill in `.agents/` but not visible in Antigravity.

**Cause:** Antigravity caches configuration at project load time. Native detection sees the change but the cache is stale.

**Fix:** close and reopen the project in Antigravity.

### Issue: Copilot or Gemini commands stale

**Symptoms:** Edited `.agents/commands/foo.md` but `.gemini/commands/foo.toml` or `.github/prompts/foo.prompt.md` shows the old content.

**Cause:** Copy + format conversion strategies don't auto-update.

**Fix:** re-run `./.agents/sync.sh --only=commands`.

### Issue: Subagent not visible

**Symptoms:** Created `.agents/subagents/new-agent.md` but doesn't appear in Claude/Cursor/Gemini/Copilot.

**Diagnosis:**

```bash
# Verify source
ls .agents/subagents/new-agent.md

# Verify symlinks (3 platforms)
readlink .claude/agents .cursor/agents .gemini/agents

# Verify Copilot copy
ls .github/agents/new-agent.agent.md
```

**Fix:**

```bash
./.agents/sync.sh --only=agents
```

**Note:** Antigravity does not support subagents — use a slash command instead.

## Summary

The synchronization system:

**✅ Automatic:**

- Triggered by `./.agents/sync.sh` or `--only=<component>`
- Runs all syncs in correct order
- Validates results

**🔄 Strategies:**

- **Symlinks** — Claude (all components), Cursor (skills/commands/agents), Gemini (subagents only)
- **Native detection** — Gemini (skills/rules), Antigravity (rules/skills/commands), Copilot (skills)
- **Copy + format conversion** — Cursor (rules `.mdc`), Copilot (rules/commands/subagents), Gemini (commands `.toml`)
- **Script generation** — MCP configs (all), Hooks (all except Antigravity)

**🔍 Verification:**

- Check symlinks: `ls -la`, `readlink`
- Check generated files: `ls`, `jq empty`
- Check native: source files exist in `.agents/`

**🛠️ Troubleshooting:**

- Re-run sync if symlinks missing
- Re-sync after editing source for copy/generate strategies
- Reload Antigravity project after sync (cached at load)

**Result:** Reliable, automated synchronization across all 5 platforms.

## Changelog

| Version | Date       | Author                        | Changes                                                                                                                                                                                                                                                                                                              |
| ------- | ---------- | ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2.0.0   | 2026-05-19 | TL: agents-architecture audit | Corrected sync strategies per component+platform (was "Cursor/Claude/Gemini get full symlinks" — actually varies); added Gemini subagents symlink (Apr 2026); added Copilot copy + format conversion; updated dry-run output, verification script, and troubleshooting to match real architecture verified May 2026. |
| 1.0.0   | 2025-Q4    | (original)                    | Initial version. Claimed Cursor/Claude/Gemini all received symlinks for rules/skills/commands. Antigravity selective-symlinks strategy described (no longer accurate post-2026 architecture).                                                                                                                        |
