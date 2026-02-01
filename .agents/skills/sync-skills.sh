#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
SKILLS_SOURCE="$SCRIPT_DIR"

# Parse command line arguments
DRY_RUN=false
if [[ "$1" == "--dry-run" ]]; then
  DRY_RUN=true
  echo "🧪 DRY RUN MODE - No changes will be made"
  echo ""
fi

echo "🔄 Synchronizing skills from .agents/skills/ to all agent directories..."
echo ""

# Validate source directory exists
validate_source() {
  echo "📋 Validating source directory..."

  if [ ! -d "$SKILLS_SOURCE" ]; then
    echo "❌ Skills source directory not found: $SKILLS_SOURCE"
    exit 1
  fi

  echo "  ✅ Skills source: $SKILLS_SOURCE"
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
  echo "🎯 Syncing Cursor skills..."
  create_directory_symlink "../.agents/skills" "$PROJECT_ROOT/.cursor/skills" "skills"
  echo ""
}

# Sync Claude Code
sync_claude() {
  echo "🤖 Syncing Claude Code skills..."
  create_directory_symlink "../.agents/skills" "$PROJECT_ROOT/.claude/skills" "skills"
  echo ""
}

# Sync Gemini CLI
sync_gemini() {
  echo "💎 Syncing Gemini CLI skills..."
  create_directory_symlink "../.agents/skills" "$PROJECT_ROOT/.gemini/skills" "skills"
  echo ""
}

# Sync Antigravity
sync_antigravity() {
  echo "🌌 Syncing Antigravity skills..."
  create_directory_symlink "../.agents/skills" "$PROJECT_ROOT/.agent/skills" "skills"
  echo ""
}

# Verify symlinks
verify_symlinks() {
  echo "🔍 Verifying symlinks..."

  if [ "$DRY_RUN" = false ]; then
    local errors=0

    for agent in cursor claude gemini agent; do
      local link="$PROJECT_ROOT/.$agent/skills"
      if [ -L "$link" ]; then
        local target=$(readlink "$link")
        echo "  ✅ $agent skills: $link → $target"
      else
        echo "  ❌ $agent skills: Not a symlink"
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
    echo "✅ Skills synchronization completed successfully"
    echo ""
    echo "Summary:"
    echo "  - Cursor: skills ✅ (full symlink)"
    echo "  - Claude Code: skills ✅ (full symlink)"
    echo "  - Gemini CLI: skills ✅ (full symlink)"
    echo "  - Antigravity: skills ✅ (full symlink)"
    echo ""
    echo "📁 All skills now synchronized from .agents/skills/"
  else
    echo "✅ Dry run completed - no changes made"
    echo ""
    echo "Run without --dry-run to apply changes:"
    echo "  ./.agents/skills/sync-skills.sh"
  fi

  echo ""
}

# Run main function
main
