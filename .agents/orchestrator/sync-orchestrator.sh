#!/bin/bash

set -e

# Get script directory and project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

# Source file
ORCHESTRATOR_SOURCE="$PROJECT_ROOT/.agents/orchestrator/AGENTS.md"

# Target symlinks at project root
ROOT_AGENTS="$PROJECT_ROOT/AGENTS.md"
ROOT_CLAUDE="$PROJECT_ROOT/CLAUDE.md"
ROOT_GEMINI="$PROJECT_ROOT/GEMINI.md"

# Parse arguments
DRY_RUN=false
if [[ "$1" == "--dry-run" ]]; then
  DRY_RUN=true
fi

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "🎭 Synchronizing orchestrator documentation..."
echo ""

# Function to create symlink
create_symlink() {
  local target=$1
  local link=$2
  local name=$3

  if [ "$DRY_RUN" = true ]; then
    echo "  ${YELLOW}[DRY RUN]${NC} Would create symlink: $name"
    return 0
  fi

  # Remove existing file/symlink
  if [ -e "$link" ] || [ -L "$link" ]; then
    rm -f "$link"
  fi

  # Create symlink
  ln -s "$target" "$link"

  echo -e "  ${GREEN}✅${NC} Created symlink: $name → $target"
}

# Function to validate source
validate_source() {
  echo "📋 Validating orchestrator source..."

  if [ ! -f "$ORCHESTRATOR_SOURCE" ]; then
    echo -e "  ${RED}❌ Error: Orchestrator source not found: $ORCHESTRATOR_SOURCE${NC}"
    exit 1
  fi

  echo -e "  ${GREEN}✅${NC} Orchestrator source: $ORCHESTRATOR_SOURCE"
  echo ""
}

# Function to create root symlinks
sync_root_symlinks() {
  echo "🔗 Creating root-level symlinks..."

  create_symlink ".agents/orchestrator/AGENTS.md" "$ROOT_AGENTS" "AGENTS.md"
  create_symlink ".agents/orchestrator/AGENTS.md" "$ROOT_CLAUDE" "CLAUDE.md"
  create_symlink ".agents/orchestrator/AGENTS.md" "$ROOT_GEMINI" "GEMINI.md"

  echo ""
}

# Function to verify synchronization
verify_sync() {
  echo "🔍 Verifying synchronization..."

  local all_ok=true

  # Check AGENTS.md
  if [ -L "$ROOT_AGENTS" ]; then
    local target=$(readlink "$ROOT_AGENTS")
    echo -e "  ${GREEN}✅${NC} AGENTS.md → $target"
  else
    echo -e "  ${RED}❌${NC} AGENTS.md: NOT a symlink"
    all_ok=false
  fi

  # Check CLAUDE.md
  if [ -L "$ROOT_CLAUDE" ]; then
    local target=$(readlink "$ROOT_CLAUDE")
    echo -e "  ${GREEN}✅${NC} CLAUDE.md → $target"
  else
    echo -e "  ${RED}❌${NC} CLAUDE.md: NOT a symlink"
    all_ok=false
  fi

  # Check GEMINI.md
  if [ -L "$ROOT_GEMINI" ]; then
    local target=$(readlink "$ROOT_GEMINI")
    echo -e "  ${GREEN}✅${NC} GEMINI.md → $target"
  else
    echo -e "  ${RED}❌${NC} GEMINI.md: NOT a symlink"
    all_ok=false
  fi

  echo ""

  if [ "$all_ok" = true ]; then
    echo -e "${GREEN}✅ Orchestrator synchronization completed successfully${NC}"
  else
    echo -e "${RED}❌ Some orchestrator synchronizations failed${NC}"
    exit 1
  fi

  echo ""
  echo "Summary:"
  echo "  - AGENTS.md ✅ (symlink)"
  echo "  - CLAUDE.md ✅ (symlink)"
  echo "  - GEMINI.md ✅ (symlink)"
  echo ""
  echo "📁 All symlinks point to: .agents/orchestrator/AGENTS.md"
  echo ""
  echo "ℹ️  Note:"
  echo "   - Edit any of these files and changes reflect in all others"
  echo "   - One orchestrator, accessible by all platforms"
  echo "   - Bidirectional editing enabled via symlinks"
}

# Main execution
main() {
  validate_source
  sync_root_symlinks
  verify_sync
}

# Run main
main
