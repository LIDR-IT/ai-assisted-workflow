#!/bin/bash
#
# sync-rules.sh - Synchronize rules across all AI agent platforms
#
# Usage:
#   ./sync-rules.sh [OPTIONS]
#
# Options:
#   --dry-run           Preview changes without applying them
#   --skip-yaml-check   Skip YAML frontmatter validation
#   --help              Show this help message
#
# Examples:
#   ./sync-rules.sh                    # Normal sync with YAML validation
#   ./sync-rules.sh --dry-run          # Preview changes only
#   ./sync-rules.sh --skip-yaml-check  # Sync without YAML validation
#

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
RULES_SOURCE="$SCRIPT_DIR"

# Show help
show_help() {
  head -15 "$0" | grep "^#" | sed 's/^# //' | sed 's/^#//'
  exit 0
}

# Parse command line arguments
DRY_RUN=false
SKIP_YAML_CHECK=false

for arg in "$@"; do
  case $arg in
    --dry-run)
      DRY_RUN=true
      ;;
    --skip-yaml-check)
      SKIP_YAML_CHECK=true
      ;;
    --help|-h)
      show_help
      ;;
    *)
      echo "Unknown option: $arg"
      echo "Use --help for usage information"
      exit 1
      ;;
  esac
done

if [ "$DRY_RUN" = true ]; then
  echo "🧪 DRY RUN MODE - No changes will be made"
  echo ""
fi

echo "🔄 Synchronizing rules from .agents/rules/ to all agent directories..."
echo ""

# Validate source directory exists
validate_source() {
  echo "📋 Validating source directory..."

  if [ ! -d "$RULES_SOURCE" ]; then
    echo "❌ Rules source directory not found: $RULES_SOURCE"
    exit 1
  fi

  echo "  ✅ Rules source: $RULES_SOURCE"
  echo ""
}

# Validate YAML frontmatter in rules
validate_yaml_frontmatter() {
  if [ "$SKIP_YAML_CHECK" = true ]; then
    return 0
  fi

  echo "🔍 Checking YAML frontmatter compatibility..."

  local total=0
  local missing_yaml=0
  local incomplete_yaml=0
  local warnings=()

  # Check all .md files (excluding special files)
  while IFS= read -r -d '' rule_file; do
    ((total++))
    local filename=$(basename "$rule_file")
    local relative_path=$(echo "$rule_file" | sed "s|$RULES_SOURCE/||")

    # Check if has YAML frontmatter
    if ! head -1 "$rule_file" | grep -q "^---$"; then
      ((missing_yaml++))
      warnings+=("  ⚠️  $relative_path - No YAML frontmatter")
      continue
    fi

    # Extract YAML and check for recommended fields
    local yaml=$(awk '/^---$/{if(++n==2) exit} n==1{print}' "$rule_file" | grep -v "^---$")
    local missing_fields=()

    # Check for platform-specific fields
    echo "$yaml" | grep -q "^name:" || missing_fields+=("name")
    echo "$yaml" | grep -q "^description:" || missing_fields+=("description")

    if [ ${#missing_fields[@]} -gt 0 ]; then
      ((incomplete_yaml++))
      warnings+=("  ⚠️  $relative_path - Missing: ${missing_fields[*]}")
    fi
  done < <(find "$RULES_SOURCE" -type f -name "*.md" ! -name "README.md" ! -name "*.sh" -print0)

  # Show summary
  if [ $missing_yaml -gt 0 ] || [ $incomplete_yaml -gt 0 ]; then
    echo "  📊 YAML Status: $total rules checked"
    echo "    ⚠️  $missing_yaml without YAML frontmatter"
    echo "    ⚠️  $incomplete_yaml with incomplete YAML"
    echo ""
    echo "  💡 For better cross-platform compatibility, add YAML frontmatter:"
    echo "     See README.md (YAML Frontmatter section) for field reference"
    echo "     Or run: ./migrate-yaml.sh for detailed analysis"
    echo ""

    # Show first few warnings
    local show_count=3
    if [ ${#warnings[@]} -gt 0 ]; then
      echo "  📋 Sample warnings (showing $show_count of ${#warnings[@]}):"
      for i in "${!warnings[@]}"; do
        if [ $i -lt $show_count ]; then
          echo "${warnings[$i]}"
        fi
      done
      if [ ${#warnings[@]} -gt $show_count ]; then
        echo "     ... and $((${#warnings[@]} - show_count)) more"
      fi
      echo ""
    fi
  else
    echo "  ✅ All rules have proper YAML frontmatter"
    echo ""
  fi
}

# Create directory symlink safely
create_directory_symlink() {
  local target=$1
  local link_path=$2
  local description=$3

  if [ "$DRY_RUN" = true ]; then
    echo "  [DRY RUN] Would create symlink: $link_path → $target"
    return 0
  fi

  # Remove existing file/directory/symlink
  if [ -e "$link_path" ] || [ -L "$link_path" ]; then
    rm -rf "$link_path"
  fi

  # Create parent directory if needed
  mkdir -p "$(dirname "$link_path")"

  # Create symlink
  ln -s "$target" "$link_path"

  if [ -L "$link_path" ]; then
    echo "  ✅ Created $description symlink: $link_path → $target"
  else
    echo "  ❌ Failed to create symlink: $link_path"
    return 1
  fi
}

# Sync Cursor (flattened - no subdirectory support)
sync_cursor() {
  echo "🎯 Syncing Cursor rules (flattened structure)..."

  if [ "$DRY_RUN" = true ]; then
    echo "  [DRY RUN] Would copy all .md files to .cursor/rules/ (flattened)"
    echo ""
    return 0
  fi

  # Remove existing directory/symlink
  if [ -e "$PROJECT_ROOT/.cursor/rules" ] || [ -L "$PROJECT_ROOT/.cursor/rules" ]; then
    rm -rf "$PROJECT_ROOT/.cursor/rules"
  fi

  # Create flat rules directory
  mkdir -p "$PROJECT_ROOT/.cursor/rules"

  echo "  📝 Copying all rules (converting .md → .mdc for Cursor)..."

  local count=0
  # Find all .md files recursively and copy them flat as .mdc
  while IFS= read -r -d '' rule_file; do
    local rule_name=$(basename "$rule_file")
    local rule_base="${rule_name%.md}"
    local dest_file="$PROJECT_ROOT/.cursor/rules/${rule_base}.mdc"
    local subdir=$(dirname "$rule_file" | sed "s|$RULES_SOURCE||" | sed 's|^/||')

    # Copy and rename to .mdc
    cp "$rule_file" "$dest_file"
    # Force timestamp update for file watchers
    touch "$dest_file"

    if [ -n "$subdir" ]; then
      echo "    ✅ ${rule_base}.mdc (from $subdir/${rule_name})"
    else
      echo "    ✅ ${rule_base}.mdc (from ${rule_name})"
    fi
    ((count++))
  done < <(find "$RULES_SOURCE" -type f -name "*.md" ! -name "sync-*.sh" -print0)

  if [ $count -gt 0 ]; then
    echo "  ✅ Copied $count rules to flat structure"
  else
    echo "  ⚠️  No rules found to copy"
  fi

  echo ""
}

# Sync Claude Code
sync_claude() {
  echo "🤖 Syncing Claude Code rules..."
  create_directory_symlink "../.agents/rules" "$PROJECT_ROOT/.claude/rules" "rules"
  echo ""
}

# Sync Gemini CLI (generates index file - Gemini doesn't support rules)
sync_gemini() {
  echo "💎 Syncing Gemini CLI (generating index)..."

  if [ "$DRY_RUN" = true ]; then
    echo "  [DRY RUN] Would generate GEMINI.md index file"
    echo ""
    return 0
  fi

  # Remove existing symlink/directory if present
  if [ -e "$PROJECT_ROOT/.gemini/rules" ] || [ -L "$PROJECT_ROOT/.gemini/rules" ]; then
    rm -rf "$PROJECT_ROOT/.gemini/rules"
  fi

  # Create .gemini directory if needed
  mkdir -p "$PROJECT_ROOT/.gemini"

  # Generate GEMINI.md index file
  cat > "$PROJECT_ROOT/.gemini/GEMINI.md" << 'EOF'
# Rules Reference for Gemini CLI

> **Note:** Gemini CLI does not support rules like other agents. This document serves as an index to the project's rules located in `.agents/rules/`.

## Project Rules Location

All rules are centralized in: `.agents/rules/`

## Rules by Category

### Code Standards

#### **[Principles](../.agents/rules/code/principles.md)**
Core principles and architectural decisions for the project.

#### **[Style](../.agents/rules/code/style.md)**
Code style guidelines and formatting standards.

---

### Content Guidelines

#### **[Copywriting](../.agents/rules/content/copywriting.md)**
Copywriting and content standards for user-facing text.

---

### Design Standards

#### **[Web Design](../.agents/rules/design/web-design.md)**
Web interface guidelines and accessibility standards.

---

### Framework-Specific

#### **[React Native](../.agents/rules/frameworks/react-native.md)**
React Native best practices and performance optimization.

---

### Process & Workflow

#### **[Git Workflow](../.agents/rules/process/git-workflow.md)**
Git branching strategy, commit conventions, and PR guidelines.

#### **[Documentation](../.agents/rules/process/documentation.md)**
Documentation standards and writing guidelines.

---

### Quality Assurance

#### **[Testing](../.agents/rules/quality/testing.md)**
Testing philosophy, manual testing checklists, and verification.

#### **[Testing Scripts](../.agents/rules/quality/testing-scripts.md)**
Bash script testing patterns and best practices.

---

### Team Conventions

#### **[Skills Management](../.agents/rules/team/skills-management.md)**
Guidelines for managing AI agent skills at project level.

#### **[Third-Party Security](../.agents/rules/team/third-party-security.md)**
Security guidelines for third-party MCP servers and Skills.

---

### Tools & Extensions

#### **[Claude Code Extensions](../.agents/rules/tools/claude-code-extensions.md)**
Reference for extending Claude Code with skills, commands, and agents.

#### **[Use Context7](../.agents/rules/tools/use-context7.md)**
Guidelines for using Context7 MCP for library/API documentation.

---

## Synchronization

Rules are synchronized across agents using:

```bash
./.agents/rules/sync-rules.sh
```

**Platform Support:**
- **Cursor:** Rules copied as .mdc files (flattened)
- **Claude Code:** Rules symlinked with subdirectories
- **Gemini CLI:** Index file (this document) - no native rules support
- **Antigravity:** Rules symlinked with subdirectories

---

## Additional Resources

- **[README](../.agents/rules/README.md)** - Rules best practices and YAML frontmatter guide

---

*Last synchronized: [Auto-generated]*
EOF

  # Update timestamp in generated file
  local timestamp=$(date "+%Y-%m-%d %H:%M:%S")
  sed -i '' "s/\[Auto-generated\]/$timestamp/" "$PROJECT_ROOT/.gemini/GEMINI.md"

  echo "  ✅ Generated GEMINI.md index file"
  echo ""
}

# Sync Copilot (VSCode) - flattened .instructions.md with frontmatter transform
sync_copilot() {
  echo "🐙 Syncing Copilot (VSCode) rules (flattened .instructions.md)..."

  if [ "$DRY_RUN" = true ]; then
    echo "  [DRY RUN] Would copy all .md files to .github/rules/ (.instructions.md)"
    echo "  [DRY RUN] Would generate .github/copilot-instructions.md index"
    echo ""
    return 0
  fi

  # Preserve .github/ but recreate rules/ subdirectory
  if [ -e "$PROJECT_ROOT/.github/rules" ] || [ -L "$PROJECT_ROOT/.github/rules" ]; then
    rm -rf "$PROJECT_ROOT/.github/rules"
  fi
  mkdir -p "$PROJECT_ROOT/.github/rules"

  echo "  📝 Copying rules (converting frontmatter + .md → .instructions.md)..."

  local count=0
  while IFS= read -r -d '' rule_file; do
    local rule_name=$(basename "$rule_file")
    local rule_base="${rule_name%.md}"
    local dest_file="$PROJECT_ROOT/.github/rules/${rule_base}.instructions.md"
    local subdir=$(dirname "$rule_file" | sed "s|$RULES_SOURCE||" | sed 's|^/||')

    # Transform frontmatter for Copilot compatibility
    if head -1 "$rule_file" | grep -q "^---$"; then
      # Extract body (after frontmatter)
      local body
      body=$(awk 'BEGIN{skip=1} /^---$/{if(NR==1)next; skip=0; next} !skip{print}' "$rule_file")

      # Extract supported fields and transform
      local description
      description=$(sed -n '/^---$/,/^---$/p' "$rule_file" | grep "^description:" | sed 's/description: *//')
      local globs
      globs=$(sed -n '/^---$/,/^---$/p' "$rule_file" | grep "^globs:" | sed 's/globs: *//')

      # Build Copilot frontmatter
      {
        echo "---"
        if [ -n "$description" ]; then
          echo "description: $description"
        fi
        if [ -n "$globs" ]; then
          # Convert globs array to applyTo string: ["a","b"] → "a, b"
          local apply_to
          apply_to=$(echo "$globs" | sed 's/\[//g' | sed 's/\]//g' | sed 's/"//g' | sed 's/,\s*/, /g')
          echo "applyTo: \"$apply_to\""
        fi
        echo "---"
        echo "$body"
      } > "$dest_file"
    else
      # No frontmatter — copy as-is
      cp "$rule_file" "$dest_file"
    fi

    touch "$dest_file"

    if [ -n "$subdir" ]; then
      echo "    ✅ ${rule_base}.instructions.md (from $subdir/${rule_name})"
    else
      echo "    ✅ ${rule_base}.instructions.md (from ${rule_name})"
    fi
    ((count++))
  done < <(find "$RULES_SOURCE" -type f -name "*.md" ! -name "sync-*.sh" ! -name "README.md" -print0)

  if [ $count -gt 0 ]; then
    echo "  ✅ Copied $count rules to .instructions.md format"
  else
    echo "  ⚠️  No rules found to copy"
  fi

  # Generate copilot-instructions.md index
  generate_copilot_instructions_index

  echo ""
}

# Generate .github/copilot-instructions.md index file
generate_copilot_instructions_index() {
  echo "  📝 Generating .github/copilot-instructions.md index..."

  local timestamp
  timestamp=$(date "+%Y-%m-%d %H:%M:%S")

  cat > "$PROJECT_ROOT/.github/copilot-instructions.md" << COPILOT_INDEX
# Copilot Instructions

> **Auto-generated by sync-rules.sh** — Do not edit manually.
> Last synchronized: $timestamp

This project uses a centralized source-of-truth pattern. All rules are in \`.agents/rules/\`.

## Project Rules

Individual rules are in \`.github/rules/*.instructions.md\`. Below is a summary by category.

### Code Standards

- **[Principles](rules/principles.instructions.md)** — Core principles and architectural decisions
- **[Style](rules/style.instructions.md)** — Code style guidelines and formatting standards

### Content Guidelines

- **[Copywriting](rules/copywriting.instructions.md)** — Copywriting and content standards

### Design Standards

- **[Web Design](rules/web-design.instructions.md)** — Web interface guidelines and accessibility

### Framework-Specific

- **[React Native](rules/react-native.instructions.md)** — React Native best practices

### Process & Workflow

- **[Git Workflow](rules/git-workflow.instructions.md)** — Git branching, commits, and PRs
- **[Documentation](rules/documentation.instructions.md)** — Documentation standards

### Quality Assurance

- **[Testing](rules/testing.instructions.md)** — Testing philosophy and checklists
- **[Testing Scripts](rules/testing-scripts.instructions.md)** — Bash script testing patterns

### Team Conventions

- **[Skills Management](rules/skills-management.instructions.md)** — AI agent skills guidelines
- **[Third-Party Security](rules/third-party-security.instructions.md)** — Security for dependencies

### Tools & Extensions

- **[Claude Code Extensions](rules/claude-code-extensions.instructions.md)** — Claude Code extension reference
- **[Use Context7](rules/use-context7.instructions.md)** — Context7 MCP usage guidelines

## Useful Commands

\`\`\`bash
# Sync all configurations
./.agents/sync-all.sh

# Format code
npm run format

# Build docs
npm run docs:build
\`\`\`

## Cross-Compatibility

Copilot also reads from \`CLAUDE.md\` and \`AGENTS.md\` in the project root.
Rules are also available via \`.claude/rules/\` (symlink to \`.agents/rules/\`).
COPILOT_INDEX

  echo "  ✅ Generated .github/copilot-instructions.md"
}

# Sync Antigravity (native .agents/ detection)
sync_antigravity() {
  echo "🌌 Syncing Antigravity rules (native .agents/ detection)..."
  echo "  ✅ Antigravity reads rules natively from .agents/rules/"

  # Clean up legacy .agent/rules symlink if present
  if [ -e "$PROJECT_ROOT/.agent/rules" ] || [ -L "$PROJECT_ROOT/.agent/rules" ]; then
    if [ "$DRY_RUN" = true ]; then
      echo "  [DRY RUN] Would remove legacy .agent/rules symlink"
    else
      rm -rf "$PROJECT_ROOT/.agent/rules"
      echo "  🧹 Removed legacy .agent/rules symlink"
    fi
  fi

  echo ""
}

# Verify synchronization
verify_sync() {
  echo "🔍 Verifying synchronization..."

  if [ "$DRY_RUN" = false ]; then
    local errors=0

    # Verify Cursor (flattened files)
    if [ -d "$PROJECT_ROOT/.cursor/rules" ]; then
      local cursor_count=$(find "$PROJECT_ROOT/.cursor/rules" -type f -name "*.md" | wc -l)
      echo "  ✅ cursor rules: $cursor_count files (flattened)"
    else
      echo "  ❌ cursor rules: Directory not found"
      ((errors++))
    fi

    # Verify Claude Code (symlink with subdirs)
    local link="$PROJECT_ROOT/.claude/rules"
    if [ -L "$link" ]; then
      local target=$(readlink "$link")
      echo "  ✅ claude rules: $link → $target (with subdirs)"
    else
      echo "  ❌ claude rules: Not a symlink"
      ((errors++))
    fi

    # Verify Gemini CLI (index file - no native rules support)
    if [ -f "$PROJECT_ROOT/.gemini/GEMINI.md" ]; then
      echo "  ✅ gemini: GEMINI.md index file (no native rules support)"
    else
      echo "  ❌ gemini: GEMINI.md index file not found"
      ((errors++))
    fi

    # Verify Copilot (.github/rules)
    if [ -d "$PROJECT_ROOT/.github/rules" ]; then
      local copilot_count=$(find "$PROJECT_ROOT/.github/rules" -type f -name "*.instructions.md" 2>/dev/null | wc -l | tr -d ' ')
      echo "  ✅ copilot rules: $copilot_count .instructions.md files"
    else
      echo "  ❌ copilot rules: Directory not found"
      ((errors++))
    fi

    # Verify Copilot instructions index
    if [ -f "$PROJECT_ROOT/.github/copilot-instructions.md" ]; then
      echo "  ✅ copilot: copilot-instructions.md index"
    else
      echo "  ❌ copilot: copilot-instructions.md not found"
      ((errors++))
    fi

    # Verify Antigravity (native .agents/ detection)
    echo "  ✅ antigravity rules: native .agents/ detection (no symlink needed)"

    echo ""

    if [ $errors -gt 0 ]; then
      echo "❌ Verification failed with $errors error(s)"
      return 1
    fi
  else
    echo "  [DRY RUN] Skipping verification"
    echo ""
  fi
}

# Main execution
main() {
  validate_source
  validate_yaml_frontmatter

  sync_cursor
  sync_claude
  sync_gemini
  sync_copilot
  sync_antigravity

  verify_sync

  if [ "$DRY_RUN" = false ]; then
    echo "✅ Rules synchronization completed successfully"
    echo ""
    echo "Summary:"
    echo "  - Cursor: rules ✅ (flattened .mdc files - no subdirs)"
    echo "  - Claude Code: rules ✅ (symlink with subdirs)"
    echo "  - Gemini CLI: index file ✅ (GEMINI.md - no native rules support)"
    echo "  - Copilot (VSCode): rules ✅ (flattened .instructions.md + index)"
    echo "  - Antigravity: rules ✅ (native .agents/ detection)"
    echo ""
    echo "📁 All rules now synchronized from .agents/rules/"
    echo ""
    echo "📂 Subdirectory structure:"
    echo "  code/      - Code style and principles"
    echo "  process/   - Git workflow and documentation"
    echo "  quality/   - Testing standards"
    echo "  tools/     - Tool configurations"
  else
    echo "✅ Dry run completed - no changes made"
    echo ""
    echo "Run without --dry-run to apply changes:"
    echo "  ./.agents/rules/sync-rules.sh"
  fi

  echo ""
}

# Run main function
main
