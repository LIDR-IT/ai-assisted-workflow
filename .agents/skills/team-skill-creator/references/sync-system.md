# Synchronization System

Technical details of how the `.agents/` synchronization system works, including sync scripts, strategies, and troubleshooting.

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

**Entry point:**

- `.agents/sync.sh` - Unified CLI for all synchronization operations

**Architecture:**

- `.agents/lib/` - Shared utility functions
- `.agents/adapters/` - Platform adapters (one per platform)
- `.agents/sync/` - Component orchestrators (rules, skills, commands, mcp, hooks, agents)
- `.agents/platforms.json` - Platform registry and configuration

**Execution:** `sync.sh` loads platform adapters from `adapters/` and component orchestrators from `sync/`, dispatching to `{platform}_{component}()` functions dynamically.

**Component order:**

1. Rules
2. Skills
3. Commands
4. Agents
5. MCP servers
6. Hooks

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
./.agents/sync.sh --only=rules
./.agents/sync.sh --only=skills
./.agents/sync.sh --only=commands
./.agents/sync.sh --only=agents
./.agents/sync.sh --only=mcp
./.agents/sync.sh --only=hooks
```

**Output:**

```
╔═══════════════════════════════════════════════════════════════════╗
║  🔄 SYNCHRONIZING ALL COMPONENTS                                  ║
╚═══════════════════════════════════════════════════════════════════╝

┌───────────────────────────────────────────────────────────────────┐
│  1. RULES
└───────────────────────────────────────────────────────────────────┘
✅ Rules synchronization completed successfully

┌───────────────────────────────────────────────────────────────────┐
│  2. SKILLS
└───────────────────────────────────────────────────────────────────┘
✅ Skills synchronization completed successfully

┌───────────────────────────────────────────────────────────────────┐
│  3. COMMANDS
└───────────────────────────────────────────────────────────────────┘
✅ Commands synchronization completed successfully

┌───────────────────────────────────────────────────────────────────┐
│  4. MCP SERVERS
└───────────────────────────────────────────────────────────────────┘
✅ MCP synchronization completed

╔═══════════════════════════════════════════════════════════════════╗
║  ✅ ALL SYNCHRONIZATIONS COMPLETED                                ║
╚═══════════════════════════════════════════════════════════════════╝
```

## Architecture

### Directory Structure

```
.agents/
├── sync.sh              # ← Unified CLI entry point
├── platforms.json       # Platform registry and configuration
├── lib/                 # Shared utility functions
├── adapters/            # Platform adapters (one per platform)
│   ├── cursor.sh
│   ├── claude.sh
│   ├── gemini.sh
│   ├── antigravity.sh
│   └── copilot.sh
└── sync/                # Component orchestrators
    ├── rules.sh
    ├── skills.sh
    ├── commands.sh
    ├── agents.sh
    ├── mcp.sh
    └── hooks.sh
```

### Execution Flow

`sync.sh` dynamically loads adapters and dispatches to `{platform}_{component}()` functions:

1. Parse CLI arguments (`--dry-run`, `--only=component`)
2. Load platform adapters from `adapters/`
3. Load component orchestrators from `sync/`
4. For each component (or the `--only` target):
   - For each platform adapter:
     - Call `{platform}_{component}()` function
5. Run verification checks
6. Print summary

### Component Orchestrators

Each file in `sync/` handles one component type across all platforms:

- **`sync/rules.sh`** - Syncs rules from `.agents/rules/` to all platforms
- **`sync/skills.sh`** - Syncs skills from `.agents/skills/` to all platforms
- **`sync/commands.sh`** - Syncs commands from `.agents/commands/` to all platforms
- **`sync/agents.sh`** - Syncs subagents from `.agents/subagents/` to all platforms
- **`sync/mcp.sh`** - Generates platform-specific MCP configs from `.agents/mcp/mcp-servers.json`
- **`sync/hooks.sh`** - Generates platform-specific hook configs from `.agents/hooks/`

## Synchronization Strategies

### Strategy: Full Directory Symlinks

**Used by:** sync/rules.sh, sync/skills.sh, sync/commands.sh
**Platforms:** Cursor, Claude Code, Gemini CLI

**Implementation:**

```bash
create_directory_symlink() {
  local source=$1
  local target=$2

  # Remove existing (file or directory)
  if [ -e "$target" ] || [ -L "$target" ]; then
    rm -rf "$target"
  fi

  # Create symlink
  ln -s "$source" "$target"

  # Verify
  if [ -L "$target" ]; then
    echo "  ✅ Created symlink: $target → $source"
  else
    echo "  ❌ Failed to create symlink: $target"
    return 1
  fi
}

# Usage
create_directory_symlink "../.agents/skills" ".cursor/skills"
```

### Strategy: Selective Symlinks

**Used by:** sync/skills.sh (Cursor, Claude, Gemini only)
**Platform:** Cursor, Claude Code, Gemini CLI

**Note:** Antigravity reads skills natively from `.agents/skills/` — no selective symlinks or copies needed.

**Implementation (for Cursor/Claude/Gemini):**

```bash
# For each skill, create a selective symlink per agent
for skill_dir in .agents/skills/*/; do
  skill_name=$(basename "$skill_dir")
  source="../../.agents/skills/$skill_name"

  for agent in cursor claude gemini; do
    target=".$agent/skills/$skill_name"
    mkdir -p ".$agent/skills"

    # Remove existing
    rm -rf "$target"

    # Create selective symlink
    ln -s "$source" "$target"

    echo "  ✅ $agent: $skill_name"
  done
done
# Antigravity: reads natively from .agents/skills/ (no action needed)
```

### Strategy: File Copies

**Used by:** sync/rules.sh, sync/commands.sh (legacy platforms only)
**Platform:** Not required for Antigravity

**Note:** Antigravity now reads rules and commands natively from `.agents/` — no file copies needed. The copy strategy is retained only for platforms that lack symlink or native detection support.

**Legacy implementation (for reference):**

```bash
# This is no longer needed for Antigravity.
# Antigravity detects .agents/rules/ and .agents/commands/ natively.
# No copy step required; changes in .agents/ are immediately visible.
```

**For Cursor (rules only — flat .mdc required):**

```bash
# Cursor requires a flat directory with .mdc extension (no subdirectories)
mkdir -p .cursor/rules
for rule in .agents/rules/**/*.md; do
  base=$(basename "$rule")
  cp "$rule" ".cursor/rules/${base%.md}.mdc"
done

file_count=$(ls -1 .cursor/rules/*.mdc 2>/dev/null | wc -l)
echo "  ✅ Copied $file_count rules to .cursor/rules/"
```

**Note:** Cursor rules require re-sync after each change (not instant like symlinks).

### Strategy: Script Generation

**Used by:** sync/mcp.sh
**Platforms:** All (except Antigravity project-level)

**Implementation:**

```bash
# Read source
SOURCE=".agents/mcp/mcp-servers.json"

# Transform for each platform
generate_platform_config() {
  local platform=$1
  local output=$2

  jq --arg platform "$platform" \
    '{mcpServers: .servers |
      to_entries |
      map(select(.value.platforms | contains([$platform]))) |
      from_entries}' "$SOURCE" > "$output"

  # Validate
  if jq empty "$output" 2>/dev/null; then
    echo "  ✅ Generated: $output"
  else
    echo "  ❌ Invalid JSON: $output"
    return 1
  fi
}

generate_platform_config "cursor" ".cursor/mcp.json"
generate_platform_config "claude" ".claude/mcp.json"
```

## Dry-Run Mode

All sync scripts support `--dry-run` mode for preview without changes.

**Usage:**

```bash
./.agents/sync.sh --dry-run
```

**Output:**

```
[DRY RUN] Would create symlink: .cursor/skills → ../.agents/skills
[DRY RUN] Would create symlink: .claude/skills → ../.agents/skills
[DRY RUN] Would create symlink: .gemini/skills → ../.agents/skills
[DRY RUN] Antigravity reads natively from .agents/ (no action needed)
```

**Implementation:**

```bash
DRY_RUN=false

if [[ "$1" == "--dry-run" ]]; then
  DRY_RUN=true
fi

# In sync functions
if [ "$DRY_RUN" = true ]; then
  echo "  [DRY RUN] Would create symlink: $target → $source"
  return 0
fi

# Actual operation
ln -s "$source" "$target"
```

## Verification

### Verify Symlinks

**Check symlink exists:**

```bash
ls -la .cursor/skills
# Output: lrwxr-xr-x ... .cursor/skills -> ../.agents/skills
```

**Check symlink target:**

```bash
readlink .cursor/skills
# Output: ../.agents/skills
```

**Verify for all platforms:**

```bash
#!/bin/bash

verify_symlinks() {
  for agent in cursor claude gemini; do
    for component in rules skills commands; do
      link=".$agent/$component"
      expected="../.agents/$component"

      if [ -L "$link" ]; then
        actual=$(readlink "$link")
        if [ "$actual" = "$expected" ]; then
          echo "✅ .$agent/$component → $expected"
        else
          echo "⚠️  .$agent/$component → $actual (expected: $expected)"
        fi
      else
        echo "❌ .$agent/$component is not a symlink"
      fi
    done
  done
}

verify_symlinks
```

### Verify File Access

**Test reading through symlink:**

```bash
# Should work
cat .cursor/skills/team-skill-creator/SKILL.md | head -5

# Should show same content as source
diff .cursor/skills/team-skill-creator/SKILL.md .agents/skills/team-skill-creator/SKILL.md
# No output = files identical
```

### Verify Antigravity

Antigravity reads rules, skills, and workflows natively from `.agents/`. Verify the source directories exist and contain the expected files.

**Check rules are accessible:**

```bash
ls -la .agents/rules/
# Should show rule subdirectories (code/, process/, quality/, etc.)
```

**Check skills are accessible:**

```bash
ls -la .agents/skills/
# Should show skill subdirectories, each containing SKILL.md
```

**Check commands are accessible:**

```bash
ls -la .agents/commands/
# Should show command .md files
```

## Troubleshooting

### Issue: Symlink Not Created

**Symptoms:**

```bash
ls .cursor/skills
# Shows directory, not symlink
```

**Diagnosis:**

```bash
# Check if it's a symlink
if [ -L ".cursor/skills" ]; then
  echo "Is symlink"
else
  echo "Not symlink"
fi
```

**Solution:**

```bash
# Remove and re-create
rm -rf .cursor/skills
./.agents/sync.sh
```

### Issue: Permission Denied

**Symptoms:**

```
Permission denied when running sync scripts
```

**Solution:**

```bash
# Make script executable
chmod +x .agents/sync.sh

# Re-run
./.agents/sync.sh
```

### Issue: Source Directory Missing

**Symptoms:**

```
❌ Source directory not found: .agents/skills
```

**Diagnosis:**

```bash
ls -la .agents/
```

**Solution:**

```bash
# Create missing directory
mkdir -p .agents/skills

# Or check current directory
pwd  # Should be in project root
```

### Issue: Invalid JSON in MCP Config

**Symptoms:**

```
❌ Invalid JSON: .cursor/mcp.json
```

**Diagnosis:**

```bash
jq . .cursor/mcp.json
# Shows syntax error
```

**Solution:**

```bash
# Check source
jq . .agents/mcp/mcp-servers.json

# If source is valid, re-generate
./.agents/sync.sh --only=mcp

# If source is invalid, fix it first
vim .agents/mcp/mcp-servers.json
```

### Issue: Antigravity Changes Not Propagating

**Symptoms:** Edited rule/command in `.agents/` but not visible in Antigravity

**Cause:** Antigravity caches configuration at project load time. Changes to `.agents/` are detected natively but may require reloading the project.

**Solution:**

```bash
# Close and reopen the project in Antigravity to reload .agents/ detection

# Verify the source file exists and is correct
cat .agents/rules/code/principles.md

# Confirm skills and commands are present in .agents/
ls -la .agents/skills/
ls -la .agents/commands/
```

## Summary

The synchronization system:

**✅ Automatic:**

- Triggered after creating skills/commands via team-skill-creator
- Runs all syncs in correct order
- Validates results

**🔄 Strategies:**

- Symlinks for instant propagation (Cursor/Claude/Gemini)
- Native `.agents/` detection for Antigravity (no copies needed)
- Generation for platform-specific configs (MCP, Cursor rules)

**🔍 Verification:**

- Check symlinks exist: `ls -la`
- Verify targets: `readlink`
- Test file access: `cat`

**🛠️ Troubleshooting:**

- Re-run sync if issues
- Check permissions
- Validate source exists
- Verify JSON syntax

**Result:** Reliable, automated synchronization across all platforms!
