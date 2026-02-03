# Synchronization System

Technical details of how the `.agents/` synchronization system works, including sync scripts, strategies, and troubleshooting.

## Table of Contents

1. [Overview](#overview)
2. [sync-all.sh](#sync-allsh)
3. [Individual Sync Scripts](#individual-sync-scripts)
4. [Synchronization Strategies](#synchronization-strategies)
5. [Dry-Run Mode](#dry-run-mode)
6. [Verification](#verification)
7. [Troubleshooting](#troubleshooting)

## Overview

The synchronization system ensures configurations in `.agents/` propagate to all platform-specific directories.

**Key scripts:**

- `.agents/sync-all.sh` - Orchestrates all syncs
- `.agents/rules/sync-rules.sh` - Syncs rules
- `.agents/skills/sync-skills.sh` - Syncs skills
- `.agents/commands/sync-commands.sh` - Syncs commands
- `.agents/mcp/sync-mcp.sh` - Generates MCP configs

**Execution order:**

1. Rules
2. Skills
3. Commands
4. MCP servers

## sync-all.sh

**Location:** `.agents/sync-all.sh`

**Purpose:** Orchestrate synchronization of all components.

### Script Structure

```bash
#!/bin/bash
set -e  # Exit on error

# Parse arguments
DRY_RUN_FLAG=""
if [[ "$1" == "--dry-run" ]]; then
  DRY_RUN_FLAG="--dry-run"
fi

# Run individual sync scripts
run_sync() {
  local script=$1
  local title=$2

  echo "┌────────────────────────────────┐"
  echo "│  $title"
  echo "└────────────────────────────────┘"

  "$script" $DRY_RUN_FLAG
}

# Execute syncs in order
run_sync "$SCRIPT_DIR/rules/sync-rules.sh" "1. RULES"
run_sync "$SCRIPT_DIR/skills/sync-skills.sh" "2. SKILLS"
run_sync "$SCRIPT_DIR/commands/sync-commands.sh" "3. COMMANDS"
run_sync "$SCRIPT_DIR/mcp/sync-mcp.sh" "4. MCP SERVERS"

# Summary
echo "╔═══════════════════════════════╗"
echo "║  ✅ ALL SYNCHRONIZATIONS COMPLETED  ║"
echo "╚═══════════════════════════════╝"
```

### Usage

**Basic sync:**

```bash
./.agents/sync-all.sh
```

**Dry-run (preview without changes):**

```bash
./.agents/sync-all.sh --dry-run
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

## Individual Sync Scripts

### sync-rules.sh

**Location:** `.agents/rules/sync-rules.sh`

**Purpose:** Sync rules from `.agents/rules/` to all platforms.

**Process:**

1. Validate source directory exists
2. Create symlinks for Cursor, Claude, Gemini
3. Copy files for Antigravity
4. Verify symlinks created

**Example:**

```bash
#!/bin/bash

# Validate source
if [ ! -d ".agents/rules" ]; then
  echo "❌ Source not found: .agents/rules"
  exit 1
fi

# Sync Cursor
create_symlink() {
  local source=$1
  local target=$2

  rm -rf "$target"
  ln -s "$source" "$target"
}

create_symlink "../.agents/rules" ".cursor/rules"
create_symlink "../.agents/rules" ".claude/rules"
create_symlink "../.agents/rules" ".gemini/rules"

# Copy for Antigravity
mkdir -p .agent/rules
cp -r .agents/rules/*.md .agent/rules/
```

### sync-skills.sh

**Location:** `.agents/skills/sync-skills.sh`

**Purpose:** Sync skills from `.agents/skills/` to all platforms.

**Process:**

1. Validate source directory
2. Create full directory symlinks (Cursor, Claude, Gemini)
3. Create selective symlinks for Antigravity (per-skill)
4. Verify all symlinks

**Antigravity selective symlinks:**

```bash
# For each skill in .agents/skills/
for skill in .agents/skills/*/; do
  skill_name=$(basename "$skill")
  ln -s "../../.agents/skills/$skill_name" ".agent/skills/$skill_name"
done
```

### sync-commands.sh

**Location:** `.agents/commands/sync-commands.sh`

**Purpose:** Sync commands from `.agents/commands/` to all platforms.

**Process:**

1. Validate source directory
2. Create symlinks for Cursor, Claude, Gemini
3. Copy to `.agent/workflows/` for Antigravity (not `.agent/commands/`)
4. Verify synchronization

**Antigravity special handling:**

```bash
# Commands go to workflows/ for Antigravity
mkdir -p .agent/workflows
cp -r .agents/commands/*.md .agent/workflows/
```

### sync-mcp.sh

**Location:** `.agents/mcp/sync-mcp.sh`

**Purpose:** Generate platform-specific MCP configs from source.

**Source:** `.agents/mcp/mcp-servers.json`

**Process:**

1. Read source JSON
2. For each platform, extract relevant servers
3. Generate platform-specific format
4. Validate generated JSON
5. Write to platform config files

**Example generation:**

```bash
#!/bin/bash

SOURCE=".agents/mcp/mcp-servers.json"

# Generate Cursor config
jq '{mcpServers: .servers |
    to_entries |
    map(select(.value.platforms | contains(["cursor"]))) |
    from_entries}' "$SOURCE" > .cursor/mcp.json

# Generate Claude config
jq '{mcpServers: .servers |
    to_entries |
    map(select(.value.platforms | contains(["claude"]))) |
    from_entries}' "$SOURCE" > .claude/mcp.json

# Generate Gemini config
jq '.servers |
    to_entries |
    map(select(.value.platforms | contains(["gemini"]))) |
    from_entries' "$SOURCE" > .gemini/settings.json
```

**Validation:**

```bash
# Validate each generated config
for file in .cursor/mcp.json .claude/mcp.json .gemini/settings.json; do
  if ! jq empty "$file" 2>/dev/null; then
    echo "❌ Invalid JSON: $file"
    exit 1
  fi
done
```

## Synchronization Strategies

### Strategy: Full Directory Symlinks

**Used by:** sync-rules.sh, sync-skills.sh, sync-commands.sh
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

**Used by:** sync-skills.sh (Antigravity only)
**Platform:** Antigravity

**Implementation:**

```bash
# Create parent directory
mkdir -p .agent/skills

# For each skill
for skill_dir in .agents/skills/*/; do
  skill_name=$(basename "$skill_dir")
  target=".agent/skills/$skill_name"
  source="../../.agents/skills/$skill_name"

  # Remove existing
  rm -rf "$target"

  # Create selective symlink
  ln -s "$source" "$target"

  echo "  ✅ $skill_name"
done
```

### Strategy: File Copies

**Used by:** sync-rules.sh, sync-commands.sh (Antigravity only)
**Platform:** Antigravity

**Implementation:**

```bash
# Create destination directory
mkdir -p .agent/rules

# Copy files
cp -r .agents/rules/*.md .agent/rules/

# Verify
file_count=$(ls -1 .agent/rules/*.md 2>/dev/null | wc -l)
echo "  ✅ Copied $file_count files to .agent/rules/"
```

**Note:** Changes require re-sync (not instant like symlinks).

### Strategy: Script Generation

**Used by:** sync-mcp.sh
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
./.agents/sync-all.sh --dry-run
```

**Output:**

```
[DRY RUN] Would create symlink: .cursor/skills → ../.agents/skills
[DRY RUN] Would create symlink: .claude/skills → ../.agents/skills
[DRY RUN] Would copy 6 files to .agent/rules/
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

**Check rules copied:**

```bash
ls -la .agent/rules/*.md
# Should show files (not symlinks)
```

**Check skills symlinked:**

```bash
ls -la .agent/skills/ | grep "\->"
# Should show symlinks to ../../.agents/skills/
```

**Check commands in workflows:**

```bash
ls -la .agent/workflows/*.md
# Should show command files
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
./.agents/sync-all.sh
```

### Issue: Permission Denied

**Symptoms:**

```
Permission denied when running sync scripts
```

**Solution:**

```bash
# Make scripts executable
chmod +x .agents/sync-all.sh
chmod +x .agents/rules/sync-rules.sh
chmod +x .agents/skills/sync-skills.sh
chmod +x .agents/commands/sync-commands.sh
chmod +x .agents/mcp/sync-mcp.sh

# Re-run
./.agents/sync-all.sh
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
./.agents/mcp/sync-mcp.sh

# If source is invalid, fix it first
vim .agents/mcp/mcp-servers.json
```

### Issue: Antigravity Changes Not Propagating

**Symptoms:** Edited rule/command in `.agents/` but not visible in Antigravity

**Cause:** Files are copied (not symlinked), need re-sync

**Solution:**

```bash
# Re-run sync
./.agents/sync-all.sh

# Verify
cat .agent/rules/core-principles.md
```

## Summary

The synchronization system:

**✅ Automatic:**

- Triggered after creating skills/commands via team-skill-creator
- Runs all syncs in correct order
- Validates results

**🔄 Strategies:**

- Symlinks for instant propagation (Cursor/Claude/Gemini)
- Copies for Antigravity constraints
- Generation for platform-specific configs

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
