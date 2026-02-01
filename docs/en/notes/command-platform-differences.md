# Command Platform Differences

## Overview

Commands in the `.agents/` system work differently across the four supported platforms (Cursor, Claude Code, Gemini CLI, Antigravity). This document explains the technical differences in how each platform handles command files, based on the implementation in `.agents/commands/sync-commands.sh`.

## Key Finding

**Source Format:** All commands start as Markdown (`.md`) files in `.agents/commands/`

**Platform Handling:**
- **Cursor & Claude Code:** Use Markdown files directly via symlinks
- **Gemini CLI:** Converts Markdown to TOML format
- **Antigravity:** Uses Markdown files via symlinks to `.agent/workflows/` (not `.agent/commands/`)

## Platform-Specific Implementation

### Cursor & Claude Code

**Mechanism:** Full directory symlink

**Implementation:**
```bash
# sync-commands.sh lines 49-54
create_directory_symlink "../.agents/commands" "$PROJECT_ROOT/.cursor/commands"
create_directory_symlink "../.agents/commands" "$PROJECT_ROOT/.claude/commands"
```

**How it works:**
- Creates a single symlink pointing entire directory
- `.cursor/commands/` → `../.agents/commands/`
- `.claude/commands/` → `../.agents/commands/`
- All `.md` files instantly accessible
- Changes propagate immediately (no sync needed)

**File structure:**
```
.cursor/commands → ../.agents/commands/
  ├── sync-setup.md
  ├── security-review.md
  └── ... (all .md files)
```

**Invocation:**
```bash
# In Cursor or Claude Code
/sync-setup
/security-review
```

**Format:** Standard Markdown with optional YAML frontmatter
```markdown
---
description: Brief description of command
---

# Command Prompt

Your instructions here...
```

### Gemini CLI

**Mechanism:** Markdown-to-TOML conversion

**Implementation:**
```bash
# sync-commands.sh lines 78-124
convert_md_to_toml() {
  local md_file=$1
  local command_name=$(basename "$md_file" .md)
  local toml_file="$PROJECT_ROOT/.gemini/commands/${command_name}.toml"

  # Extract description from YAML frontmatter
  # Extract prompt content after frontmatter
  # Convert $ARGUMENTS to {{args}}
  # Remove triple backticks (TOML conflict)
  # Escape backslashes for TOML
  # Generate TOML file
}
```

**Why conversion is needed:**
- Gemini CLI expects `.toml` format, not `.md`
- Different variable syntax: `$ARGUMENTS` → `{{args}}`
- TOML has different escaping rules (triple backticks conflict)
- Frontmatter structure differs from Markdown

**Conversion steps:**

1. **Extract YAML frontmatter description:**
```bash
description=$(sed -n '/^---$/,/^---$/p' "$md_file" | \
  grep "^description:" | \
  sed 's/^description: *//' | \
  sed 's/^["'\'']//' | \
  sed 's/["'\'']$//')
```

2. **Extract prompt content (everything after frontmatter):**
```bash
prompt_content=$(awk '/^---$/{flag=!flag; next} flag' "$md_file" | \
  awk '/^---$/{flag=1; next} flag')
```

3. **Convert variable syntax:**
```bash
# $ARGUMENTS → {{args}}
prompt_content=$(echo "$prompt_content" | sed 's/\$ARGUMENTS/{{args}}/g')
```

4. **Handle TOML conflicts:**
```bash
# Remove triple backticks (conflict with TOML multiline strings)
prompt_content=$(echo "$prompt_content" | sed 's/```//g')

# Escape backslashes for TOML
prompt_content=$(echo "$prompt_content" | sed 's/\\/\\\\/g')
```

5. **Generate TOML file:**
```bash
cat > "$toml_file" << EOF
description = "$description"
prompt = '''
$prompt_content
'''
EOF
```

**Example transformation:**

**Input** (`.agents/commands/security-review.md`):
```markdown
---
description: Review code for security vulnerabilities
---

# Security Review

Analyze the code in $ARGUMENTS for:
- SQL injection
- XSS attacks

```bash
npm run security-scan
```
```

**Output** (`.gemini/commands/security-review.toml`):
```toml
description = "Review code for security vulnerabilities"
prompt = '''

# Security Review

Analyze the code in {{args}} for:
- SQL injection
- XSS attacks

bash
npm run security-scan

'''
```

**File structure:**
```
.gemini/commands/
  ├── sync-setup.toml
  ├── security-review.toml
  └── ... (generated .toml files)
```

**Invocation:**
```bash
# In Gemini CLI
gemini /sync-setup
gemini /security-review file.js
```

### Antigravity

**Mechanism:** Selective file symlinks to `.agent/workflows/`

**Implementation:**
```bash
# sync-commands.sh lines 148-164
mkdir -p "$PROJECT_ROOT/.agent/workflows"

for command_file in "$PROJECT_ROOT/.agents/commands"/*.md; do
  command_name=$(basename "$command_file" .md)
  target_link="$PROJECT_ROOT/.agent/workflows/$command_name"

  # Remove existing
  if [ -L "$target_link" ] || [ -e "$target_link" ]; then
    rm -rf "$target_link"
  fi

  # Create selective symlink
  ln -s "../../.agents/commands/$command_name.md" "$target_link"
done
```

**Why `.agent/workflows/` not `.agent/commands/`:**
- Antigravity platform uses "workflows" terminology
- Commands are invoked as workflows in Antigravity
- Technical limitation: Must use this specific directory structure

**How it works:**
- Creates individual symlink per command file
- `.agent/workflows/sync-setup` → `../../.agents/commands/sync-setup.md`
- `.agent/workflows/security-review` → `../../.agents/commands/security-review.md`
- Each command is a separate symlink (not full directory)

**File structure:**
```
.agent/workflows/
  ├── sync-setup → ../../.agents/commands/sync-setup.md
  ├── security-review → ../../.agents/commands/security-review.md
  └── ... (individual symlinks)
```

**Invocation:**
```bash
# In Antigravity
/sync-setup
/security-review
```

**Format:** Standard Markdown (same as source)
```markdown
---
description: Brief description
---

# Command content
```

## Platform Comparison Table

| Aspect | Cursor | Claude Code | Gemini CLI | Antigravity |
|--------|--------|-------------|------------|-------------|
| **Format** | Markdown (.md) | Markdown (.md) | TOML (.toml) | Markdown (.md) |
| **Sync Method** | Full dir symlink | Full dir symlink | Convert + generate | Selective symlinks |
| **Location** | `.cursor/commands/` | `.claude/commands/` | `.gemini/commands/` | `.agent/workflows/` |
| **Variable Syntax** | `$ARGUMENTS` | `$ARGUMENTS` | `{{args}}` | `$ARGUMENTS` |
| **Frontmatter** | YAML | YAML | Extracted to TOML | YAML |
| **Changes Propagate** | Instant | Instant | Re-sync required | Instant |
| **Triple Backticks** | Allowed | Allowed | Removed | Allowed |
| **Backslash Escaping** | None | None | Doubled | None |

## Technical Challenges

### Challenge 1: Format Incompatibility

**Problem:** Gemini CLI expects TOML, but source is Markdown

**Solution:** Automated conversion in sync script
- Extract frontmatter description
- Convert prompt to TOML multiline string
- Transform variable syntax
- Handle escaping differences

### Challenge 2: Variable Syntax Differences

**Problem:** Different placeholder syntax across platforms
- Cursor/Claude/Antigravity: `$ARGUMENTS`
- Gemini CLI: `{{args}}`

**Solution:** Regex replacement during conversion
```bash
sed 's/\$ARGUMENTS/{{args}}/g'
```

### Challenge 3: TOML Triple-Backtick Conflict

**Problem:** Triple backticks in Markdown conflict with TOML multiline strings

**Markdown:**
````markdown
```bash
echo "example"
```
````

**TOML uses triple quotes for multiline:**
```toml
prompt = '''
content here
'''
```

**Solution:** Strip triple backticks during conversion
```bash
sed 's/```//g'
```

**Impact:** Code blocks lose syntax highlighting markers in Gemini, but remain readable

### Challenge 4: Directory Naming Convention

**Problem:** Antigravity uses "workflows" not "commands"

**Solution:** Symlink to `.agent/workflows/` instead of `.agent/commands/`
```bash
ln -s "../../.agents/commands/$command_name.md" ".agent/workflows/$command_name"
```

## Synchronization Workflow

### Initial Setup (First Time)

```bash
# Run sync script
./.agents/commands/sync-commands.sh

# What happens:
# 1. Cursor: .cursor/commands → ../.agents/commands (symlink)
# 2. Claude: .claude/commands → ../.agents/commands (symlink)
# 3. Gemini: Converts all .md → .toml in .gemini/commands/
# 4. Antigravity: Creates selective symlinks in .agent/workflows/
```

### After Adding New Command

**Steps:**
1. Create `.agents/commands/new-command.md`
2. Run `./.agents/commands/sync-commands.sh`
3. Verify:
   ```bash
   # Cursor/Claude (instant via symlink)
   ls -la .cursor/commands/new-command.md

   # Gemini (generated)
   cat .gemini/commands/new-command.toml

   # Antigravity (selective symlink)
   ls -la .agent/workflows/new-command
   ```

### After Editing Existing Command

**Cursor/Claude/Antigravity:**
- Changes propagate instantly (symlinks)
- No sync needed

**Gemini:**
- Re-run sync to regenerate TOML:
  ```bash
  ./.agents/commands/sync-commands.sh
  ```

## Code Examples from sync-commands.sh

### Full Directory Symlink (Cursor/Claude)

```bash
# Lines 49-54
create_directory_symlink() {
  local target=$1
  local link=$2

  # Remove existing
  if [ -L "$link" ] || [ -e "$link" ]; then
    rm -rf "$link"
  fi

  # Create symlink
  ln -s "$target" "$link"
  echo "  ✅ Created symlink: $link → $target"
}

create_directory_symlink "../.agents/commands" "$PROJECT_ROOT/.cursor/commands"
create_directory_symlink "../.agents/commands" "$PROJECT_ROOT/.claude/commands"
```

### Markdown-to-TOML Conversion (Gemini)

```bash
# Lines 78-124
convert_md_to_toml() {
  local md_file=$1
  local command_name=$(basename "$md_file" .md)
  local toml_file="$PROJECT_ROOT/.gemini/commands/${command_name}.toml"

  # Extract description from YAML frontmatter
  local description=$(sed -n '/^---$/,/^---$/p' "$md_file" | \
    grep "^description:" | \
    sed 's/^description: *//' | \
    sed 's/^["'\'']//' | \
    sed 's/["'\'']$//')

  # Extract prompt content (everything after frontmatter)
  local prompt_content=$(awk '/^---$/{flag=!flag; next} flag' "$md_file" | \
    awk '/^---$/{flag=1; next} flag')

  # Convert $ARGUMENTS to {{args}} for Gemini syntax
  prompt_content=$(echo "$prompt_content" | sed 's/\$ARGUMENTS/{{args}}/g')

  # Remove triple backticks (conflict with TOML multiline strings)
  prompt_content=$(echo "$prompt_content" | sed 's/```//g')

  # Escape backslashes for TOML
  prompt_content=$(echo "$prompt_content" | sed 's/\\/\\\\/g')

  # Generate TOML file
  cat > "$toml_file" << EOF
description = "$description"
prompt = '''
$prompt_content
'''
EOF

  echo "  ✅ Converted: $command_name.md → $command_name.toml"
}

# Process all commands
for command_file in "$PROJECT_ROOT/.agents/commands"/*.md; do
  convert_md_to_toml "$command_file"
done
```

### Selective Symlinks (Antigravity)

```bash
# Lines 148-164
echo "Syncing commands for Antigravity..."
mkdir -p "$PROJECT_ROOT/.agent/workflows"

for command_file in "$PROJECT_ROOT/.agents/commands"/*.md; do
  if [ ! -f "$command_file" ]; then
    continue
  fi

  command_name=$(basename "$command_file" .md)
  target_link="$PROJECT_ROOT/.agent/workflows/$command_name"

  # Remove existing
  if [ -L "$target_link" ] || [ -e "$target_link" ]; then
    rm -rf "$target_link"
  fi

  # Create selective symlink
  ln -s "../../.agents/commands/$command_name.md" "$target_link"
  echo "  ✅ Linked: .agent/workflows/$command_name"
done
```

## Best Practices

### Writing Cross-Platform Commands

**Use compatible syntax:**
```markdown
---
description: Single-line description without special characters
---

# Command Title

Instructions here.

Use $ARGUMENTS for parameters (auto-converts to {{args}} in Gemini).

Avoid excessive triple backticks (stripped in Gemini conversion).
```

**Avoid:**
- Multi-line descriptions in frontmatter
- Complex escaping (backslashes, quotes)
- Relying on triple-backtick syntax highlighting

**Test across platforms:**
```bash
# After creating/editing command
./.agents/commands/sync-commands.sh

# Test in each platform
/your-command arg1 arg2
```

### Debugging Command Issues

**Cursor/Claude command not found:**
```bash
# Check symlink exists
ls -la .cursor/commands

# Should show: .cursor/commands → ../.agents/commands

# Re-sync if needed
./.agents/commands/sync-commands.sh
```

**Gemini command not working:**
```bash
# Check TOML generated
cat .gemini/commands/your-command.toml

# Look for conversion issues:
# - Missing description
# - Malformed prompt
# - Escaping problems

# Regenerate
./.agents/commands/sync-commands.sh
```

**Antigravity command not found:**
```bash
# Check symlink in workflows
ls -la .agent/workflows/your-command

# Should show: .agent/workflows/your-command → ../../.agents/commands/your-command.md

# Re-sync if needed
./.agents/commands/sync-commands.sh
```

## Verification Commands

```bash
# Verify Cursor/Claude symlinks
ls -la .cursor/commands
ls -la .claude/commands

# Check symlink targets
readlink .cursor/commands  # Should: ../.agents/commands
readlink .claude/commands  # Should: ../.agents/commands

# Verify Gemini TOML files
ls -la .gemini/commands/
cat .gemini/commands/sync-setup.toml

# Verify Antigravity workflows
ls -la .agent/workflows/
readlink .agent/workflows/sync-setup  # Should: ../../.agents/commands/sync-setup.md

# Test file accessibility
cat .cursor/commands/sync-setup.md
cat .gemini/commands/sync-setup.toml
cat .agent/workflows/sync-setup
```

## Related Documentation

- **Sync Script:** `.agents/commands/sync-commands.sh` (implementation)
- **Command Templates:** `.agents/skills/team-skill-creator/examples/command-template.md`
- **Command Creation Guide:** `.agents/skills/team-skill-creator/references/command-creation-guide.md`
- **Architecture Overview:** `.agents/skills/team-skill-creator/references/architecture-overview.md`

## Summary

Commands in the `.agents/` system demonstrate platform-specific handling while maintaining a single source of truth:

- **Source:** All commands are Markdown in `.agents/commands/`
- **Cursor/Claude:** Direct symlink access to Markdown files
- **Gemini:** Automated Markdown-to-TOML conversion with syntax transformations
- **Antigravity:** Selective symlinks to `.agent/workflows/` directory
- **Maintenance:** Run sync script after creating/editing commands (except for Cursor/Claude/Antigravity which use symlinks)

This architecture allows cross-platform compatibility while respecting each platform's technical requirements and limitations.
