#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
RULES_SOURCE="$SCRIPT_DIR"
SKILLS_SOURCE="$SCRIPT_DIR/../skills"

# Parse command line arguments
DRY_RUN=false
if [[ "$1" == "--dry-run" ]]; then
  DRY_RUN=true
  echo "🧪 DRY RUN MODE - No changes will be made"
  echo ""
fi

echo "🔄 Synchronizing rules and skills from .agents/ to all agent directories..."
echo ""

# Validate source directories exist
validate_sources() {
  echo "📋 Validating source directories..."

  if [ ! -d "$RULES_SOURCE" ]; then
    echo "❌ Rules source directory not found: $RULES_SOURCE"
    exit 1
  fi

  if [ ! -d "$SKILLS_SOURCE" ]; then
    echo "❌ Skills source directory not found: $SKILLS_SOURCE"
    exit 1
  fi

  echo "  ✅ Rules source: $RULES_SOURCE"
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
    echo "  ⚠️  Removing existing: $link_path"
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

# Sync Cursor (full symlinks for rules and skills)
sync_cursor() {
  echo "🎯 Syncing Cursor..."

  create_directory_symlink "../.agents/rules" "$PROJECT_ROOT/.cursor/rules" "rules"
  create_directory_symlink "../.agents/skills" "$PROJECT_ROOT/.cursor/skills" "skills"

  echo ""
}

# Sync Claude Code (full symlinks for rules and skills)
sync_claude() {
  echo "🤖 Syncing Claude Code..."

  create_directory_symlink "../.agents/rules" "$PROJECT_ROOT/.claude/rules" "rules"
  create_directory_symlink "../.agents/skills" "$PROJECT_ROOT/.claude/skills" "skills"

  echo ""
}

# Sync Gemini CLI (full symlink for rules, skills already done)
sync_gemini() {
  echo "💎 Syncing Gemini CLI..."

  create_directory_symlink "../.agents/rules" "$PROJECT_ROOT/.gemini/rules" "rules"

  # Check if skills is already a symlink
  if [ -L "$PROJECT_ROOT/.gemini/skills" ]; then
    echo "  ✅ Skills already synced (existing symlink)"
  else
    create_directory_symlink "../.agents/skills" "$PROJECT_ROOT/.gemini/skills" "skills"
  fi

  echo ""
}

# Sync Antigravity (special case - copy rules, selective skills)
sync_antigravity() {
  echo "🌌 Syncing Antigravity (special case)..."

  if [ "$DRY_RUN" = true ]; then
    echo "  [DRY RUN] Would copy rules to .agent/rules/"
    echo "  [DRY RUN] Would keep selective skills approach in .agent/skills/"
    echo ""
    return 0
  fi

  # Create .agent/rules directory
  mkdir -p "$PROJECT_ROOT/.agent/rules"

  # Copy rules files (Antigravity doesn't support project-level symlinks reliably)
  echo "  📝 Copying rules to .agent/rules/..."
  cp -r "$RULES_SOURCE/"*.md "$PROJECT_ROOT/.agent/rules/" 2>/dev/null || true

  if [ $? -eq 0 ]; then
    echo "  ✅ Rules copied to .agent/rules/"
  else
    echo "  ⚠️  No .md files found in rules source"
  fi

  # Skills - keep existing selective symlink approach
  if [ -d "$PROJECT_ROOT/.agent/skills" ]; then
    echo "  ✅ Skills directory exists (selective approach maintained)"
  else
    echo "  ⚠️  .agent/skills/ not found - manual setup may be needed"
  fi

  echo ""
}

# Verify symlinks point to correct targets
verify_symlinks() {
  echo "🔍 Verifying symlinks..."

  local errors=0

  # Function to check symlink
  check_symlink() {
    local link=$1
    local expected_target=$2
    local description=$3

    if [ ! -L "$link" ]; then
      echo "  ❌ $description: Not a symlink: $link"
      ((errors++))
      return 1
    fi

    local actual_target=$(readlink "$link")
    if [ "$actual_target" != "$expected_target" ]; then
      echo "  ❌ $description: Wrong target"
      echo "     Expected: $expected_target"
      echo "     Actual: $actual_target"
      ((errors++))
      return 1
    fi

    echo "  ✅ $description: $link → $actual_target"
  }

  if [ "$DRY_RUN" = false ]; then
    # Cursor
    check_symlink "$PROJECT_ROOT/.cursor/rules" "../.agents/rules" "Cursor rules"
    check_symlink "$PROJECT_ROOT/.cursor/skills" "../.agents/skills" "Cursor skills"

    # Claude Code
    check_symlink "$PROJECT_ROOT/.claude/rules" "../.agents/rules" "Claude rules"
    check_symlink "$PROJECT_ROOT/.claude/skills" "../.agents/skills" "Claude skills"

    # Gemini CLI
    check_symlink "$PROJECT_ROOT/.gemini/rules" "../.agents/rules" "Gemini rules"
    check_symlink "$PROJECT_ROOT/.gemini/skills" "../.agents/skills" "Gemini skills"

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
  validate_sources

  sync_cursor
  sync_claude
  sync_gemini
  sync_antigravity

  verify_symlinks

  if [ "$DRY_RUN" = false ]; then
    echo "✅ Synchronization completed successfully"
    echo ""
    echo "Summary:"
    echo "  - Cursor: rules ✅, skills ✅ (full symlinks)"
    echo "  - Claude Code: rules ✅, skills ✅ (full symlinks)"
    echo "  - Gemini CLI: rules ✅, skills ✅ (full symlinks)"
    echo "  - Antigravity: rules ✅ (copied), skills ✅ (selective)"
    echo ""
    echo "📁 All rules and skills now synchronized from .agents/"
    echo ""
    echo "ℹ️  To verify:"
    echo "  ls -la .cursor/rules .cursor/skills"
    echo "  ls -la .claude/rules .claude/skills"
    echo "  ls -la .gemini/rules .gemini/skills"
    echo "  ls -la .agent/rules .agent/skills"
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
