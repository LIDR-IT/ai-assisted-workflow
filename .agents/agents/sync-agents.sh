#!/bin/bash

set -e

# Get script directory and project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

# Source directory
AGENTS_SOURCE="$PROJECT_ROOT/.agents/agents"

# Target directories
CURSOR_AGENTS="$PROJECT_ROOT/.cursor/agents"
CLAUDE_AGENTS="$PROJECT_ROOT/.claude/agents"
GEMINI_AGENTS="$PROJECT_ROOT/.gemini/agents"
# Note: Antigravity does NOT support project-level agents directory
# Agents are only available in Cursor, Claude Code, and Gemini CLI

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

echo "🔄 Synchronizing agents from .agents/agents/ to platform directories..."
echo ""

# Function to create directory symlink
create_directory_symlink() {
  local target=$1
  local link=$2
  local platform=$3

  if [ "$DRY_RUN" = true ]; then
    echo "  ${YELLOW}[DRY RUN]${NC} Would create agents symlink for $platform"
    return 0
  fi

  # Remove existing file/directory/symlink
  if [ -e "$link" ] || [ -L "$link" ]; then
    rm -rf "$link"
  fi

  # Create parent directory if needed
  mkdir -p "$(dirname "$link")"

  # Create symlink
  ln -s "$target" "$link"

  echo -e "  ${GREEN}✅${NC} Created agents symlink: $link → $target"
}

# Function to validate source directory
validate_sources() {
  echo "📋 Validating source directory..."

  if [ ! -d "$AGENTS_SOURCE" ]; then
    echo -e "  ${RED}❌ Error: Agents source directory not found: $AGENTS_SOURCE${NC}"
    exit 1
  fi

  echo -e "  ${GREEN}✅${NC} Agents source: $AGENTS_SOURCE"
  echo ""
}

# Function to sync Cursor agents
sync_cursor() {
  echo "🎯 Syncing Cursor agents..."
  create_directory_symlink "../.agents/agents" "$CURSOR_AGENTS" "Cursor"
  echo ""
}

# Function to sync Claude Code agents
sync_claude() {
  echo "🤖 Syncing Claude Code agents..."
  create_directory_symlink "../.agents/agents" "$CLAUDE_AGENTS" "Claude Code"
  echo ""
}

# Function to sync Gemini CLI agents
sync_gemini() {
  echo "💎 Syncing Gemini CLI agents..."
  create_directory_symlink "../.agents/agents" "$GEMINI_AGENTS" "Gemini CLI"
  echo ""
}

# Function to verify synchronization
verify_sync() {
  echo "🔍 Verifying synchronization..."

  local all_ok=true

  # Check Cursor
  if [ -L "$CURSOR_AGENTS" ]; then
    local cursor_target=$(readlink "$CURSOR_AGENTS")
    echo -e "  ${GREEN}✅${NC} cursor agents: $CURSOR_AGENTS → $cursor_target"
  else
    echo -e "  ${RED}❌${NC} cursor agents: NOT a symlink"
    all_ok=false
  fi

  # Check Claude Code
  if [ -L "$CLAUDE_AGENTS" ]; then
    local claude_target=$(readlink "$CLAUDE_AGENTS")
    echo -e "  ${GREEN}✅${NC} claude agents: $CLAUDE_AGENTS → $claude_target"
  else
    echo -e "  ${RED}❌${NC} claude agents: NOT a symlink"
    all_ok=false
  fi

  # Check Gemini CLI
  if [ -L "$GEMINI_AGENTS" ]; then
    local gemini_target=$(readlink "$GEMINI_AGENTS")
    echo -e "  ${GREEN}✅${NC} gemini agents: $GEMINI_AGENTS → $gemini_target"
  else
    echo -e "  ${RED}❌${NC} gemini agents: NOT a symlink"
    all_ok=false
  fi

  echo ""

  if [ "$all_ok" = true ]; then
    echo -e "${GREEN}✅ Agents synchronization completed successfully${NC}"
  else
    echo -e "${RED}❌ Some agent synchronizations failed${NC}"
    exit 1
  fi

  echo ""
  echo "Summary:"
  echo "  - Cursor: agents ✅ (symlink)"
  echo "  - Claude Code: agents ✅ (symlink)"
  echo "  - Gemini CLI: agents ✅ (symlink)"
  echo "  - Antigravity: agents ⊘ (not supported)"
  echo ""
  echo "📁 All agents now synchronized from .agents/agents/"
  echo ""
  echo "ℹ️  Notes:"
  echo "   - All platforms use symlinks (minimal format requires no transformation)"
  echo "   - Antigravity does NOT support project-level agents"
  echo "   - Agents are available in Cursor, Claude Code, and Gemini CLI"
}

# Main execution
main() {
  validate_sources
  sync_cursor
  sync_claude
  sync_gemini
  verify_sync
}

# Run main
main
