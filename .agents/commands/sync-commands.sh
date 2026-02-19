#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
COMMANDS_SOURCE="$SCRIPT_DIR"

# Parse command line arguments
DRY_RUN=false
if [[ "$1" == "--dry-run" ]]; then
  DRY_RUN=true
  echo "🧪 DRY RUN MODE - No changes will be made"
  echo ""
fi

echo "🔄 Synchronizing commands from .agents/commands/ to all agent directories..."
echo ""

# Validate source directory exists
validate_source() {
  echo "📋 Validating source directory..."

  if [ ! -d "$COMMANDS_SOURCE" ]; then
    echo "❌ Commands source directory not found: $COMMANDS_SOURCE"
    exit 1
  fi

  echo "  ✅ Commands source: $COMMANDS_SOURCE"
  echo ""
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

# Sync Cursor
sync_cursor() {
  echo "🎯 Syncing Cursor commands..."
  create_directory_symlink "../.agents/commands" "$PROJECT_ROOT/.cursor/commands" "commands"
  echo ""
}

# Sync Claude Code
sync_claude() {
  echo "🤖 Syncing Claude Code commands..."
  create_directory_symlink "../.agents/commands" "$PROJECT_ROOT/.claude/commands" "commands"
  echo ""
}

# Convert Markdown command to TOML format for Gemini CLI
convert_md_to_toml() {
  local md_file=$1
  local toml_file=$2

  # Check if file has frontmatter
  local has_frontmatter=false
  if head -1 "$md_file" | grep -q "^---$"; then
    has_frontmatter=true
  fi

  # Extract description from YAML frontmatter (if exists)
  local description=""
  if [ "$has_frontmatter" = true ]; then
    description=$(sed -n '/^---$/,/^---$/p' "$md_file" | grep "^description:" | sed 's/description: *//')
  fi

  # Extract prompt content (everything after second ---)
  local prompt=""
  if [ "$has_frontmatter" = true ]; then
    # Skip lines until we pass the closing --- of frontmatter
    prompt=$(awk 'BEGIN{skip=1} /^---$/{if(NR==1)next; skip=0; next} !skip{print}' "$md_file")
  else
    prompt=$(cat "$md_file")
  fi

  # Convert $ARGUMENTS to {{args}}
  prompt=$(echo "$prompt" | sed 's/\$ARGUMENTS/{{args}}/g')

  # Remove triple backticks (conflict with TOML triple quotes)
  # Convert ```bash to just a marker, and remove closing ```
  prompt=$(echo "$prompt" | sed 's/```bash/[Code block:]/g' | sed 's/```//g')

  # Escape backslashes for TOML (must be done AFTER other replacements)
  # In TOML strings, backslashes must be escaped: \ becomes \\
  prompt=$(echo "$prompt" | sed 's/\\/\\\\/g')

  # Generate TOML file
  {
    if [ -n "$description" ]; then
      echo "description = \"$description\""
      echo ""
    fi
    echo 'prompt = """'
    echo "$prompt"
    echo '"""'
  } > "$toml_file"
}

# Sync Gemini CLI
sync_gemini() {
  echo "💎 Syncing Gemini CLI commands (converting .md → .toml)..."

  if [ "$DRY_RUN" = true ]; then
    echo "  [DRY RUN] Would convert and copy commands to .gemini/commands/"
    echo ""
    return 0
  fi

  # Remove existing directory/symlink
  if [ -e "$PROJECT_ROOT/.gemini/commands" ] || [ -L "$PROJECT_ROOT/.gemini/commands" ]; then
    rm -rf "$PROJECT_ROOT/.gemini/commands"
  fi

  # Create commands directory
  mkdir -p "$PROJECT_ROOT/.gemini/commands"

  echo "  📝 Converting and copying commands..."

  local count=0
  for md_file in "$COMMANDS_SOURCE"/*.md; do
    if [ -f "$md_file" ]; then
      local base_name=$(basename "$md_file" .md)
      local toml_file="$PROJECT_ROOT/.gemini/commands/${base_name}.toml"

      convert_md_to_toml "$md_file" "$toml_file"
      echo "    ✅ ${base_name}.md → ${base_name}.toml"
      ((count++))
    fi
  done

  if [ $count -gt 0 ]; then
    echo "  ✅ Converted $count commands to TOML format"
  else
    echo "  ⚠️  No commands found to convert"
  fi

  echo ""
}

# Convert Markdown command to Copilot .prompt.md format
convert_md_to_prompt_md() {
  local md_file=$1
  local prompt_file=$2

  # Check if file has frontmatter
  local has_frontmatter=false
  if head -1 "$md_file" | grep -q "^---$"; then
    has_frontmatter=true
  fi

  # Extract description from YAML frontmatter (if exists)
  local description=""
  if [ "$has_frontmatter" = true ]; then
    description=$(sed -n '/^---$/,/^---$/p' "$md_file" | grep "^description:" | sed 's/description: *//')
  fi

  # Extract prompt content (everything after second ---)
  local prompt=""
  if [ "$has_frontmatter" = true ]; then
    prompt=$(awk 'BEGIN{skip=1} /^---$/{if(NR==1)next; skip=0; next} !skip{print}' "$md_file")
  else
    prompt=$(cat "$md_file")
  fi

  # Convert $ARGUMENTS to Copilot-compatible reference
  prompt=$(echo "$prompt" | sed 's/\$ARGUMENTS/{{{ input }}}/g')

  # Generate .prompt.md with Copilot frontmatter
  {
    echo "---"
    if [ -n "$description" ]; then
      echo "description: $description"
    fi
    echo "mode: agent"
    echo "---"
    echo "$prompt"
  } > "$prompt_file"
}

# Sync Copilot (VSCode) commands as prompts
sync_copilot() {
  echo "🐙 Syncing Copilot (VSCode) prompts (converting .md → .prompt.md)..."

  if [ "$DRY_RUN" = true ]; then
    echo "  [DRY RUN] Would convert and copy commands to .github/prompts/"
    echo ""
    return 0
  fi

  # Preserve .github/ but recreate prompts/ subdirectory
  if [ -e "$PROJECT_ROOT/.github/prompts" ] || [ -L "$PROJECT_ROOT/.github/prompts" ]; then
    rm -rf "$PROJECT_ROOT/.github/prompts"
  fi
  mkdir -p "$PROJECT_ROOT/.github/prompts"

  echo "  📝 Converting commands to prompts..."

  local count=0
  for md_file in "$COMMANDS_SOURCE"/*.md; do
    if [ -f "$md_file" ]; then
      local base_name=$(basename "$md_file" .md)

      # Skip sync scripts and READMEs
      case "$base_name" in
        sync-*|README|readme) continue ;;
      esac

      local prompt_file="$PROJECT_ROOT/.github/prompts/${base_name}.prompt.md"

      convert_md_to_prompt_md "$md_file" "$prompt_file"
      echo "    ✅ ${base_name}.md → ${base_name}.prompt.md"
      ((count++))
    fi
  done

  if [ $count -gt 0 ]; then
    echo "  ✅ Converted $count commands to .prompt.md format"
  else
    echo "  ⚠️  No commands found to convert"
  fi

  echo ""
}

# Sync Antigravity (native .agents/ detection via workflows symlink)
sync_antigravity() {
  echo "🌌 Syncing Antigravity commands (native .agents/ detection)..."

  # Create .agents/workflows → commands symlink if not present
  local workflows_link="$PROJECT_ROOT/.agents/workflows"
  if [ "$DRY_RUN" = true ]; then
    echo "  [DRY RUN] Would ensure .agents/workflows → commands symlink"
  else
    if [ ! -L "$workflows_link" ]; then
      # Remove if exists as file/directory
      if [ -e "$workflows_link" ]; then
        rm -rf "$workflows_link"
      fi
      # Create relative symlink inside .agents/
      (cd "$PROJECT_ROOT/.agents" && ln -s commands workflows)
      echo "  ✅ Created .agents/workflows → commands symlink"
    else
      echo "  ✅ .agents/workflows → commands symlink already exists"
    fi
  fi

  # Clean up legacy .agent/workflows symlink if present
  if [ -e "$PROJECT_ROOT/.agent/workflows" ] || [ -L "$PROJECT_ROOT/.agent/workflows" ]; then
    if [ "$DRY_RUN" = true ]; then
      echo "  [DRY RUN] Would remove legacy .agent/workflows symlink"
    else
      rm -rf "$PROJECT_ROOT/.agent/workflows"
      echo "  🧹 Removed legacy .agent/workflows symlink"
    fi
  fi

  echo ""
}

# Verify symlinks and generated files
verify_sync() {
  echo "🔍 Verifying synchronization..."

  if [ "$DRY_RUN" = false ]; then
    local errors=0

    # Verify Cursor and Claude symlinks
    for agent in cursor claude; do
      local link="$PROJECT_ROOT/.$agent/commands"
      if [ -L "$link" ]; then
        local target=$(readlink "$link")
        echo "  ✅ $agent commands: $link → $target"
      else
        echo "  ❌ $agent commands: Not a symlink"
        ((errors++))
      fi
    done

    # Verify Gemini converted files
    if [ -d "$PROJECT_ROOT/.gemini/commands" ]; then
      local toml_count=$(find "$PROJECT_ROOT/.gemini/commands" -name "*.toml" | wc -l)
      echo "  ✅ gemini commands: $toml_count TOML files generated"
    else
      echo "  ❌ gemini commands: Directory not found"
      ((errors++))
    fi

    # Verify Copilot prompts
    if [ -d "$PROJECT_ROOT/.github/prompts" ]; then
      local prompt_count=$(find "$PROJECT_ROOT/.github/prompts" -name "*.prompt.md" 2>/dev/null | wc -l | tr -d ' ')
      echo "  ✅ copilot prompts: $prompt_count .prompt.md files generated"
    else
      echo "  ❌ copilot prompts: Directory not found"
      ((errors++))
    fi

    # Verify Antigravity workflows symlink (inside .agents/)
    local workflows_link="$PROJECT_ROOT/.agents/workflows"
    if [ -L "$workflows_link" ]; then
      local target=$(readlink "$workflows_link")
      echo "  ✅ antigravity workflows: .agents/workflows → $target (native detection)"
    else
      echo "  ❌ antigravity workflows: .agents/workflows symlink not found"
      ((errors++))
    fi

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

  sync_cursor
  sync_claude
  sync_gemini
  sync_copilot
  sync_antigravity

  verify_sync

  if [ "$DRY_RUN" = false ]; then
    echo "✅ Commands synchronization completed successfully"
    echo ""
    echo "Summary:"
    echo "  - Cursor: commands ✅ (directory symlink)"
    echo "  - Claude Code: commands ✅ (directory symlink)"
    echo "  - Gemini CLI: commands ✅ (converted to .toml files)"
    echo "  - Copilot (VSCode): prompts ✅ (converted to .prompt.md files)"
    echo "  - Antigravity: workflows ✅ (native .agents/ detection via .agents/workflows)"
    echo ""
    echo "📁 All commands now synchronized from .agents/commands/"
    echo ""
    echo "⚠️  Notes:"
    echo "  - Antigravity reads commands natively via .agents/workflows/ → commands/"
    echo "  - Gemini CLI commands auto-converted from .md to .toml format"
  else
    echo "✅ Dry run completed - no changes made"
    echo ""
    echo "Run without --dry-run to apply changes:"
    echo "  ./.agents/commands/sync-commands.sh"
  fi

  echo ""
}

# Run main function
main
