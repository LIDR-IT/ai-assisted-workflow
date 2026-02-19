#!/bin/bash

set -e

# Get script directory and project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

# Source directory
AGENTS_SOURCE="$PROJECT_ROOT/.agents/subagents"

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

echo "🔄 Synchronizing subagents from .agents/subagents/ to platform directories..."
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
  create_directory_symlink "../.agents/subagents" "$CURSOR_AGENTS" "Cursor"
  echo ""
}

# Function to sync Claude Code agents
sync_claude() {
  echo "🤖 Syncing Claude Code agents..."
  create_directory_symlink "../.agents/subagents" "$CLAUDE_AGENTS" "Claude Code"
  echo ""
}

# Function to sync Gemini CLI agents
sync_gemini() {
  echo "💎 Syncing Gemini CLI agents..."
  create_directory_symlink "../.agents/subagents" "$GEMINI_AGENTS" "Gemini CLI"
  echo ""
}

# Convert subagent .md to Copilot .agent.md format
convert_to_agent_md() {
  local md_file=$1
  local agent_file=$2

  # Extract frontmatter fields
  local has_frontmatter=false
  if head -1 "$md_file" | grep -q "^---$"; then
    has_frontmatter=true
  fi

  local name=""
  local description=""
  if [ "$has_frontmatter" = true ]; then
    name=$(sed -n '/^---$/,/^---$/p' "$md_file" | grep "^name:" | sed 's/name: *//' | sed 's/^"//' | sed 's/"$//')
    description=$(sed -n '/^---$/,/^---$/p' "$md_file" | grep "^description:" | sed 's/description: *//' | sed 's/^"//' | sed 's/"$//')
  fi

  # Extract body content (everything after second ---)
  local body=""
  if [ "$has_frontmatter" = true ]; then
    body=$(awk 'BEGIN{skip=1} /^---$/{if(NR==1)next; skip=0; next} !skip{print}' "$md_file")
  else
    body=$(cat "$md_file")
  fi

  # Generate .agent.md with Copilot frontmatter
  {
    echo "---"
    if [ -n "$name" ]; then
      echo "name: $name"
    fi
    if [ -n "$description" ]; then
      echo "description: \"$description\""
    fi
    echo "tools:"
    echo "  - codebase"
    echo "  - editFiles"
    echo "  - terminalLastCommand"
    echo "---"
    echo "$body"
  } > "$agent_file"
}

# Function to sync Copilot agents (copy+rename to .agent.md)
sync_copilot() {
  echo "🐙 Syncing Copilot (VSCode) agents (converting .md → .agent.md)..."

  if [ "$DRY_RUN" = true ]; then
    echo "  ${YELLOW}[DRY RUN]${NC} Would convert and copy agents to .github/agents/"
    echo ""
    return 0
  fi

  # Preserve .github/ but recreate agents/ subdirectory
  if [ -e "$PROJECT_ROOT/.github/agents" ] || [ -L "$PROJECT_ROOT/.github/agents" ]; then
    rm -rf "$PROJECT_ROOT/.github/agents"
  fi
  mkdir -p "$PROJECT_ROOT/.github/agents"

  echo "  📝 Converting agents..."

  local count=0
  for md_file in "$AGENTS_SOURCE"/*.md; do
    if [ -f "$md_file" ]; then
      local base_name=$(basename "$md_file" .md)
      local agent_file="$PROJECT_ROOT/.github/agents/${base_name}.agent.md"

      convert_to_agent_md "$md_file" "$agent_file"
      echo -e "    ${GREEN}✅${NC} ${base_name}.md → ${base_name}.agent.md"
      ((count++))
    fi
  done

  if [ $count -gt 0 ]; then
    echo -e "  ${GREEN}✅${NC} Converted $count agents to .agent.md format"
  else
    echo -e "  ${YELLOW}⚠️${NC}  No agents found to convert"
  fi

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

  # Check Copilot (.github/agents)
  if [ -d "$PROJECT_ROOT/.github/agents" ]; then
    local agent_count=$(find "$PROJECT_ROOT/.github/agents" -name "*.agent.md" 2>/dev/null | wc -l | tr -d ' ')
    echo -e "  ${GREEN}✅${NC} copilot agents: $agent_count .agent.md files"
  else
    echo -e "  ${RED}❌${NC} copilot agents: Directory not found"
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
  echo "  - Copilot (VSCode): agents ✅ (converted to .agent.md)"
  echo "  - Antigravity: agents ⊘ (not supported)"
  echo ""
  echo "📁 All subagents now synchronized from .agents/subagents/"
  echo ""
  echo "ℹ️  Notes:"
  echo "   - Cursor, Claude, Gemini use symlinks"
  echo "   - Copilot uses .agent.md format (copy+rename)"
  echo "   - Antigravity does NOT support project-level agents"
}

# Main execution
main() {
  validate_sources
  sync_cursor
  sync_claude
  sync_gemini
  sync_copilot
  verify_sync
}

# Run main
main
