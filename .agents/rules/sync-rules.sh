#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
RULES_SOURCE="$SCRIPT_DIR"

# Parse command line arguments
DRY_RUN=false
if [[ "$1" == "--dry-run" ]]; then
  DRY_RUN=true
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

  echo "  📝 Copying all rules (flattened for Cursor compatibility)..."

  local count=0
  # Find all .md files recursively and copy them flat
  while IFS= read -r -d '' rule_file; do
    local rule_name=$(basename "$rule_file")
    local dest_file="$PROJECT_ROOT/.cursor/rules/$rule_name"
    local subdir=$(dirname "$rule_file" | sed "s|$RULES_SOURCE||" | sed 's|^/||')

    cp "$rule_file" "$dest_file"
    if [ -n "$subdir" ]; then
      echo "    ✅ $rule_name (from $subdir/)"
    else
      echo "    ✅ $rule_name"
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

# Sync Gemini CLI
sync_gemini() {
  echo "💎 Syncing Gemini CLI rules..."
  create_directory_symlink "../.agents/rules" "$PROJECT_ROOT/.gemini/rules" "rules"
  echo ""
}

# Sync Antigravity (selective symlinks with subdirectories)
sync_antigravity() {
  echo "🌌 Syncing Antigravity rules (selective symlinks with subdirs)..."

  if [ "$DRY_RUN" = true ]; then
    echo "  [DRY RUN] Would create selective symlinks in .agent/rules/"
    echo ""
    return 0
  fi

  # Remove existing directory and recreate
  if [ -e "$PROJECT_ROOT/.agent/rules" ] || [ -L "$PROJECT_ROOT/.agent/rules" ]; then
    rm -rf "$PROJECT_ROOT/.agent/rules"
  fi
  mkdir -p "$PROJECT_ROOT/.agent/rules"

  echo "  📝 Creating selective symlinks (preserving subdirectory structure)..."

  local count=0
  # Find all .md files recursively
  while IFS= read -r -d '' rule_file; do
    # Get relative path from RULES_SOURCE
    local rel_path="${rule_file#$RULES_SOURCE/}"
    local link_path="$PROJECT_ROOT/.agent/rules/$rel_path"

    # Calculate relative target path from link location
    local subdir_depth=$(echo "$rel_path" | tr -cd '/' | wc -c)
    local rel_prefix="../"
    for ((i=0; i<subdir_depth; i++)); do
      rel_prefix="../$rel_prefix"
    done
    local target="${rel_prefix}.agents/rules/$rel_path"

    # Create parent directory if needed
    mkdir -p "$(dirname "$link_path")"

    # Create symlink
    ln -s "$target" "$link_path"
    echo "    ✅ $rel_path"
    ((count++))
  done < <(find "$RULES_SOURCE" -type f -name "*.md" ! -name "sync-*.sh" -print0)

  if [ $count -gt 0 ]; then
    echo "  ✅ Created $count selective symlinks in .agent/rules/"
  else
    echo "  ⚠️  No rules found to symlink"
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

    # Verify Gemini CLI (symlink with subdirs)
    local link="$PROJECT_ROOT/.gemini/rules"
    if [ -L "$link" ]; then
      local target=$(readlink "$link")
      echo "  ✅ gemini rules: $link → $target (with subdirs)"
    else
      echo "  ❌ gemini rules: Not a symlink"
      ((errors++))
    fi

    # Verify Antigravity (selective symlinks with subdirs)
    if [ -d "$PROJECT_ROOT/.agent/rules" ]; then
      local antigrav_count=$(find "$PROJECT_ROOT/.agent/rules" -type l -name "*.md" | wc -l)
      echo "  ✅ antigravity rules: $antigrav_count selective symlinks (with subdirs)"
    else
      echo "  ❌ antigravity rules: Directory not found"
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
  sync_antigravity

  verify_sync

  if [ "$DRY_RUN" = false ]; then
    echo "✅ Rules synchronization completed successfully"
    echo ""
    echo "Summary:"
    echo "  - Cursor: rules ✅ (flattened .md files - no subdirs)"
    echo "  - Claude Code: rules ✅ (symlink with subdirs)"
    echo "  - Gemini CLI: rules ✅ (symlink with subdirs)"
    echo "  - Antigravity: rules ✅ (selective symlinks with subdirs)"
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
