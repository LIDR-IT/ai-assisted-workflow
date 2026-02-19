# Rules Synchronization Setup Guide

This guide explains how to set up and use the centralized rules and skills synchronization system across all AI agent platforms.

## Overview

The `.agents/sync.sh` CLI synchronizes:

- **Rules** - Project guidelines and standards (`.agents/rules/*.md`)
- **Skills** - Agent capabilities and extensions (`.agents/skills/`)

**Source of Truth:** `.agents/` directory
**Synchronized to:** Cursor, Claude Code, Gemini CLI, Antigravity, GitHub Copilot (VSCode)

## Architecture

### Synchronization Strategy

| Platform         | Rules | Skills | Method                                   |
| ---------------- | ----- | ------ | ---------------------------------------- |
| Cursor           | ✅    | ✅     | Full directory symlinks                  |
| Claude Code      | ✅    | ✅     | Full directory symlinks                  |
| Gemini CLI       | ✅    | ✅     | Full directory symlinks                  |
| Antigravity      | ✅    | ✅     | Native (reads from .agents/ directly)    |
| Copilot (VSCode) | ✅    | ✅     | Copy+rename (.instructions.md) + symlink |

### Directory Structure

```
.agents/
├── rules/                  # Source of truth for rules
│   ├── core-principles.md
│   ├── code-style.md
│   ├── documentation.md
│   ├── git-workflow.md
│   ├── testing.md
│   ├── use-context7.md
│   └── ...                 # Rule files by category
└── skills/                 # Source of truth for skills
    ├── agent-development/
    ├── command-development/
    ├── find-skills/
    ├── hook-development/
    ├── mcp-integration/
    ├── skill-creator/
    └── skill-development/

# After sync:
.cursor/
├── rules → ../.agents/rules    # Symlink
└── skills → ../.agents/skills  # Symlink

.claude/
├── rules → ../.agents/rules    # Symlink
└── skills → ../.agents/skills  # Symlink

.gemini/
├── rules → ../.agents/rules    # Symlink
└── skills → ../.agents/skills  # Symlink

# Antigravity reads natively from .agents/ — no separate directory needed
# .agents/rules/ and .agents/skills/ are accessed directly
```

## Installation

### Prerequisites

- macOS or Linux (symlinks required)
- Bash shell
- Project cloned with Git

### Initial Setup

1. **Verify source directories exist:**

   ```bash
   ls -la .agents/rules
   ls -la .agents/skills
   ```

2. **Make script executable (if not already):**

   ```bash
   chmod +x .agents/sync.sh
   ```

3. **Test with dry-run:**

   ```bash
   ./.agents/sync.sh --only=rules --dry-run
   ```

4. **Run actual sync:**

   ```bash
   ./.agents/sync.sh --only=rules
   ```

5. **Verify symlinks created:**
   ```bash
   ls -la .cursor/rules .cursor/skills
   ls -la .claude/rules .claude/skills
   ls -la .gemini/rules .gemini/skills
   ```

## Usage

### Running the Sync Script

**Basic usage:**

```bash
./.agents/sync.sh --only=rules
```

**Dry-run mode (preview changes):**

```bash
./.agents/sync.sh --only=rules --dry-run
```

**Expected output:**

```
🔄 Synchronizing rules and skills from .agents/ to all agent directories...

📋 Validating source directories...
  ✅ Rules source: /path/to/project/.agents/rules
  ✅ Skills source: /path/to/project/.agents/skills

🎯 Syncing Cursor...
  ✅ Created rules symlink: .cursor/rules → ../.agents/rules
  ✅ Created skills symlink: .cursor/skills → ../.agents/skills

🤖 Syncing Claude Code...
  ✅ Created rules symlink: .claude/rules → ../.agents/rules
  ✅ Created skills symlink: .claude/skills → ../.agents/skills

💎 Syncing Gemini CLI...
  ✅ Created rules symlink: .gemini/rules → ../.agents/rules
  ✅ Skills already synced (existing symlink)

🌌 Syncing Antigravity...
  ✅ Antigravity reads rules natively from .agents/rules/
  ✅ Antigravity reads skills natively from .agents/skills/

🔍 Verifying symlinks...
  ✅ Cursor rules: .cursor/rules → ../.agents/rules
  ✅ Cursor skills: .cursor/skills → ../.agents/skills
  ✅ Claude rules: .claude/rules → ../.agents/rules
  ✅ Claude skills: .claude/skills → ../.agents/skills
  ✅ Gemini rules: .gemini/rules → ../.agents/rules
  ✅ Gemini skills: .gemini/skills → ../.agents/skills

✅ Synchronization completed successfully
```

### Adding New Rules

1. **Create rule file in source:**

   ```bash
   # Create new rule
   cat > .agents/rules/security.md << 'EOF'
   # Security Guidelines

   ## Best Practices
   - Never commit secrets
   - Use environment variables
   - Validate input
   EOF
   ```

2. **Changes propagate automatically:**

   ```bash
   # All platforms see changes immediately — all read from .agents/ directly
   # No sync step required
   ```

3. **Verify propagation:**
   ```bash
   # Check all platforms (all resolve through .agents/rules/)
   ls .cursor/rules/security.md
   ls .claude/rules/security.md
   ls .gemini/rules/security.md
   ls .agents/rules/security.md   # Antigravity reads natively from here
   ```

### Adding New Skills

Skills use the same synchronization approach:

1. **Create skill in source:**

   ```bash
   mkdir -p .agents/skills/my-skill
   cat > .agents/skills/my-skill/SKILL.md << 'EOF'
   ---
   name: my-skill
   description: My custom skill
   ---

   # My Skill

   Skill content here.
   EOF
   ```

2. **Changes propagate automatically:**

   ```bash
   # Symlinks mean instant propagation for Cursor, Claude, Gemini
   ls .cursor/skills/my-skill
   ls .claude/skills/my-skill
   ls .gemini/skills/my-skill
   ```

3. **For Antigravity:**
   ```bash
   # Antigravity reads skills natively from .agents/skills/ — no setup needed
   ls .agents/skills/my-skill
   ```

## Verification

### Verify Symlinks

**Check symlink targets:**

```bash
readlink .cursor/rules    # Should output: ../.agents/rules
readlink .cursor/skills   # Should output: ../.agents/skills
readlink .claude/rules    # Should output: ../.agents/rules
readlink .claude/skills   # Should output: ../.agents/skills
readlink .gemini/rules    # Should output: ../.agents/rules
readlink .gemini/skills   # Should output: ../.agents/skills
```

**Visual verification:**

```bash
ls -la .cursor/rules .cursor/skills
# Output should show symlinks:
# lrwxr-xr-x ... rules -> ../.agents/rules
# lrwxr-xr-x ... skills -> ../.agents/skills
```

### Verify File Access

**Test reading files through symlinks:**

```bash
# Read rule through Cursor symlink
cat .cursor/rules/core-principles.md

# List skills through Claude symlink
ls .claude/skills/

# Check Gemini rules
ls .gemini/rules/*.md

# Check Antigravity (reads natively from .agents/)
ls .agents/rules/*.md
```

### Verify in Agents

**Cursor:**

1. Open Cursor
2. Check Settings → MCP/Skills
3. Verify skills appear

**Claude Code:**

```bash
# List installed skills
claude mcp list

# Try using a skill
claude /find-skills
```

**Gemini CLI:**

```bash
# List MCP servers and skills
gemini mcp list

# Try using a skill
gemini /find-skills
```

**Antigravity:**

```bash
# Antigravity reads rules natively from .agents/rules/
ls .agents/rules/

# Antigravity reads skills natively from .agents/skills/
ls .agents/skills/
```

## Troubleshooting

### Symlinks Not Created

**Symptoms:** Directories instead of symlinks

**Diagnosis:**

```bash
ls -la .cursor/rules
# If it shows 'd' instead of 'l', it's a directory not symlink
```

**Solution:**

```bash
# Re-run sync
./.agents/sync.sh --only=rules

# Or manually create
rm -rf .cursor/rules
ln -s ../.agents/rules .cursor/rules
```

### Symlinks Point to Wrong Location

**Symptoms:** Broken symlinks or wrong targets

**Diagnosis:**

```bash
readlink .cursor/rules
# Should output: ../.agents/rules
```

**Solution:**

```bash
# Remove and recreate
rm .cursor/rules
ln -s ../.agents/rules .cursor/rules

# Or re-run sync
./.agents/sync.sh --only=rules
```

### Changes Not Propagating

**For Cursor/Claude/Gemini:**

```bash
# Verify symlink exists
ls -la .cursor/rules

# Verify source file exists
ls .agents/rules/core-principles.md

# Verify symlink target is correct
readlink .cursor/rules
```

**For Antigravity:**

```bash
# Antigravity reads natively from .agents/rules/ — no sync needed
# Verify rules are accessible
ls .agents/rules/
```

### Script Fails with Errors

**Missing source directory:**

```
❌ Rules source directory not found: .agents/rules
```

**Solution:**

```bash
# Check if source exists
ls -la .agents/rules
ls -la .agents/skills

# Clone may be incomplete - re-clone or create directories
git clone <repo-url>
```

**Permission denied:**

```
❌ Failed to create symlink
```

**Solution:**

```bash
# Check permissions
ls -la .cursor/

# Make script executable
chmod +x .agents/sync.sh

# Run with correct permissions
./.agents/sync.sh --only=rules
```

### Antigravity-Specific Issues

**MCP servers not working:**

Antigravity does NOT support project-level MCP configurations. Must be configured globally.

**Solution:**

```bash
# Edit global config
vim ~/.gemini/antigravity/mcp_config.json

# See guide
cat docs/guides/mcp/ANTIGRAVITY_SETUP.md
```

**Rules not updated:**

Antigravity reads rules natively from `.agents/rules/`. No sync step is needed — edits to `.agents/rules/` are picked up immediately.

**Solution:**

```bash
# Verify rules exist in the source directory
ls .agents/rules/
```

## Advanced Usage

### Re-sync After Git Pull

After pulling changes that update rules/skills:

```bash
# For Cursor/Claude/Gemini - no action needed (symlinks)
# For Antigravity - re-sync to copy new rules
./.agents/sync.sh --only=rules
```

### Clean Slate Re-sync

To completely rebuild synchronization:

```bash
# Remove all agent directories
rm -rf .cursor/rules .cursor/skills
rm -rf .claude/rules .claude/skills
rm -rf .gemini/rules
# Note: Antigravity reads natively from .agents/ — nothing to remove

# Re-run sync
./.agents/sync.sh --only=rules
```

### Custom Sync for Single Platform

To sync only one platform:

```bash
# Use --only= flag to sync specific components
# Or manually create symlinks:

# Cursor only
ln -s ../.agents/rules .cursor/rules
ln -s ../.agents/skills .cursor/skills
```

## Integration with Git

### What Gets Committed

**Committed:**

- `.agents/rules/*.md` - Source rules
- `.agents/skills/` - Source skills
- `.agents/sync.sh` - Unified sync CLI
- `.cursor/rules`, `.claude/rules`, etc. - Symlinks themselves
- Antigravity reads natively from `.agents/rules/` — no separate copy committed

**Not committed:**

- Symlink contents (Git stores symlinks, not contents)
- Temporary files
- Personal IDE settings

### Cloning Behavior

When cloning the repository:

```bash
git clone <repo-url>
cd <repo>

# Symlinks are automatically restored
ls -la .cursor/rules  # Shows symlink

# Antigravity reads natively from .agents/ — no additional step needed
```

## Comparison with MCP Sync

| Feature       | MCP Sync                            | Rules Sync                              |
| ------------- | ----------------------------------- | --------------------------------------- |
| Script        | `.agents/sync.sh --only=mcp`        | `.agents/sync.sh --only=rules`          |
| Source        | `.agents/mcp/mcp-servers.json`      | `.agents/rules/*.md`, `.agents/skills/` |
| Method        | Generate configs                    | Create symlinks (Antigravity: native)   |
| Platforms     | Cursor, Claude, Gemini, Antigravity | Same                                    |
| Run Frequency | After editing source JSON           | After adding rules/skills               |
| Idempotent    | ✅ Yes                              | ✅ Yes                                  |

## Best Practices

### Do's

✅ **Run sync after adding rules/skills** (recreates symlinks for Cursor/Claude/Gemini)
✅ **Use dry-run mode** before actual sync
✅ **Verify symlinks** after sync
✅ **Edit source files only** (in `.agents/`)
✅ **Commit source and symlinks** to Git
✅ **Test in all agents** after changes

### Don'ts

❌ **Don't edit files through symlinks** - edit source instead
❌ **Don't delete .agents/ directory** - it's the source of truth
❌ **Don't manually create rules in agent directories** - use source
❌ **Don't commit broken symlinks** - verify before committing
❌ **Don't copy rules manually for Antigravity** - it reads natively from `.agents/`

## Related Documentation

- **Core Principles:** [.agents/rules/core-principles.md](../../../.agents/rules/core-principles.md)
- **Code Style:** [.agents/rules/code-style.md](../../../.agents/rules/code-style.md)
- **MCP Sync Guide:** [../mcp/mcp-setup-guide.md](../mcp/mcp-setup-guide.md)
- **Antigravity Limitations:** [../mcp/ANTIGRAVITY_LIMITATION.md](../mcp/ANTIGRAVITY_LIMITATION.md)
- **Skills Management:** [../../guidelines/team-conventions/skills-management-guidelines.md](../../guidelines/team-conventions/skills-management-guidelines.md)

## References

- **Sync CLI:** `.agents/sync.sh` (use `--only=rules` or `--only=mcp`)
- **Project README:** `README.md`
- **Claude.md:** `.claude/CLAUDE.md`

## Support

**Issues:**

- Check [Troubleshooting](#troubleshooting) section above
- Review related documentation
- Verify source directories exist
- Try dry-run mode first

**Questions:**

- See `.agents/rules/core-principles.md` for architecture
- See `docs/references/rules/` for technical details
- See `docs/guidelines/team-conventions/skills-management-guidelines.md` for skills
