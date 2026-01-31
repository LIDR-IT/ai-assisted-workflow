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

# Sync Gemini CLI
sync_gemini() {
  echo "💎 Syncing Gemini CLI commands..."
  create_directory_symlink "../.agents/commands" "$PROJECT_ROOT/.gemini/commands" "commands"
  echo ""
}

# Sync Antigravity (selective symlinks to workflows)
sync_antigravity() {
  echo "🌌 Syncing Antigravity commands (selective symlinks to workflows)..."

  if [ "$DRY_RUN" = true ]; then
    echo "  [DRY RUN] Would create selective symlinks in .agent/workflows/"
    echo ""
    return 0
  fi

  mkdir -p "$PROJECT_ROOT/.agent/workflows"

  echo "  📝 Creating selective symlinks for each command..."

  local count=0
  for command_file in "$COMMANDS_SOURCE"/*.md; do
    if [ -f "$command_file" ]; then
      local command_name=$(basename "$command_file")
      local target="../../.agents/commands/$command_name"
      local link_path="$PROJECT_ROOT/.agent/workflows/$command_name"

      # Remove existing file/symlink if present
      if [ -e "$link_path" ] || [ -L "$link_path" ]; then
        rm "$link_path"
      fi

      ln -s "$target" "$link_path"
      echo "    ✅ $command_name"
      ((count++))
    fi
  done

  if [ $count -gt 0 ]; then
    echo "  ✅ Created $count selective symlinks in .agent/workflows/"
  else
    echo "  ⚠️  No commands found to symlink"
  fi

  echo ""
}

# Verify symlinks
verify_symlinks() {
  echo "🔍 Verifying symlinks..."

  if [ "$DRY_RUN" = false ]; then
    local errors=0

    for agent in cursor claude gemini; do
      local link="$PROJECT_ROOT/.$agent/commands"
      if [ -L "$link" ]; then
        local target=$(readlink "$link")
        echo "  ✅ $agent commands: $link → $target"
      else
        echo "  ❌ $agent commands: Not a symlink"
        ((errors++))
      fi
    done

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
  sync_antigravity

  verify_symlinks

  if [ "$DRY_RUN" = false ]; then
    echo "✅ Commands synchronization completed successfully"
    echo ""
    echo "Summary:"
    echo "  - Cursor: commands ✅ (full symlink)"
    echo "  - Claude Code: commands ✅ (full symlink)"
    echo "  - Gemini CLI: commands ✅ (full symlink)"
    echo "  - Antigravity: workflows ✅ (selective symlinks)"
    echo ""
    echo "📁 All commands now synchronized from .agents/commands/"
    echo ""
    echo "⚠️  Note: Antigravity uses .agent/workflows/ for commands"
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
