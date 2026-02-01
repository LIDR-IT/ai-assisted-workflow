#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Parse command line arguments
DRY_RUN_FLAG=""
if [[ "$1" == "--dry-run" ]]; then
  DRY_RUN_FLAG="--dry-run"
  echo "🧪 DRY RUN MODE - No changes will be made"
  echo ""
fi

echo "╔═══════════════════════════════════════════════════════════════════╗"
echo "║  🔄 SYNCHRONIZING ALL COMPONENTS                                  ║"
echo "╚═══════════════════════════════════════════════════════════════════╝"
echo ""

# Function to run sync script
run_sync() {
  local script=$1
  local name=$2

  echo "┌───────────────────────────────────────────────────────────────────┐"
  echo "│  $name"
  echo "└───────────────────────────────────────────────────────────────────┘"
  echo ""

  if [ -f "$script" ]; then
    "$script" $DRY_RUN_FLAG
  else
    echo "  ⚠️  Script not found: $script"
    echo ""
  fi
}

# Run all sync scripts in order
run_sync "$SCRIPT_DIR/rules/sync-rules.sh" "1. RULES"
run_sync "$SCRIPT_DIR/skills/sync-skills.sh" "2. SKILLS"
run_sync "$SCRIPT_DIR/commands/sync-commands.sh" "3. COMMANDS"
run_sync "$SCRIPT_DIR/agents/sync-agents.sh" "4. AGENTS"
run_sync "$SCRIPT_DIR/mcp/sync-mcp.sh" "5. MCP SERVERS"

# Final summary
echo "╔═══════════════════════════════════════════════════════════════════╗"
echo "║  ✅ ALL SYNCHRONIZATIONS COMPLETED                                ║"
echo "╚═══════════════════════════════════════════════════════════════════╝"
echo ""

if [ -z "$DRY_RUN_FLAG" ]; then
  echo "Summary of synchronized components:"
  echo "  ✅ Rules - Synced to all agents"
  echo "  ✅ Skills - Synced to all agents"
  echo "  ✅ Commands - Synced to all agents"
  echo "  ✅ Agents - Synced to Cursor, Claude, Gemini (not Antigravity)"
  echo "  ✅ MCP Servers - Configs generated"
  echo ""
  echo "All agent directories now have latest configurations from .agents/"
  echo ""
  echo "Verify with:"
  echo "  ls -la .cursor/{rules,skills,commands,agents}"
  echo "  ls -la .claude/{rules,skills,commands,agents}"
  echo "  ls -la .gemini/{rules,skills,commands,agents}"
  echo "  ls -la .agent/{rules,skills,commands}"
else
  echo "Dry run completed. To apply changes, run:"
  echo "  ./.agents/sync-all.sh"
fi

echo ""
