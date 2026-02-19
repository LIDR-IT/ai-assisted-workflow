#!/bin/bash
#
# sync.sh - Unified synchronization CLI for multi-agent AI configurations
#
# Usage:
#   ./sync.sh [OPTIONS]
#
# Options:
#   --platform=<list>       Sync only these platforms (comma-separated)
#   --only=<list>           Sync only these components (comma-separated)
#   --dry-run               Preview changes without applying them
#   --verbose               Show debug output
#   --skip-yaml-check       Skip YAML frontmatter validation for rules
#   --help                  Show this help message
#
# Examples:
#   ./sync.sh                              # Full sync (all platforms, all components)
#   ./sync.sh --platform=copilot           # Sync only Copilot
#   ./sync.sh --platform=cursor,claude     # Sync Cursor and Claude
#   ./sync.sh --only=rules,mcp            # Sync only rules and MCP
#   ./sync.sh --platform=copilot --only=rules --dry-run
#
# Components: orchestrator, rules, skills, commands, agents, mcp, hooks
# Platforms:  cursor, claude, gemini, copilot, antigravity
#

set -e

AGENTS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$AGENTS_DIR/.." && pwd)"

# Load shared libraries
source "$AGENTS_DIR/lib/core.sh"
source "$AGENTS_DIR/lib/symlink.sh"
source "$AGENTS_DIR/lib/frontmatter.sh"
source "$AGENTS_DIR/lib/registry.sh"

# Dependencies
require_command "jq"

# ── Help ──────────────────────────────────────────────────────
show_help() {
  echo "Usage: sync.sh [OPTIONS]"
  echo ""
  echo "Unified synchronization for multi-agent AI configurations."
  echo "Syncs rules, skills, commands, agents, MCP, and hooks across platforms."
  echo ""
  echo "Options:"
  echo "  --platform=<list>     Platforms to sync (comma-separated)"
  echo "                        Available: $(list_platforms | tr '\n' ', ' | sed 's/,$//')"
  echo "  --only=<list>         Components to sync (comma-separated)"
  echo "                        Available: orchestrator, rules, skills, commands, agents, mcp, hooks"
  echo "  --dry-run             Preview changes without applying them"
  echo "  --verbose             Show debug output"
  echo "  --skip-yaml-check     Skip YAML frontmatter validation"
  echo "  --help                Show this help message"
  echo ""
  echo "Examples:"
  echo "  ./sync.sh                            # Full sync"
  echo "  ./sync.sh --platform=copilot         # Sync only Copilot"
  echo "  ./sync.sh --only=rules,mcp           # Sync only rules and MCP"
  echo "  ./sync.sh --dry-run                  # Preview all changes"
  exit 0
}

# ── Argument Parsing ──────────────────────────────────────────
ALL_COMPONENTS=(orchestrator rules skills commands agents mcp hooks)

SELECTED_PLATFORMS=()
SELECTED_COMPONENTS=()
SKIP_YAML_CHECK=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    --platform=*)  IFS=',' read -ra SELECTED_PLATFORMS <<< "${1#*=}" ;;
    --only=*)      IFS=',' read -ra SELECTED_COMPONENTS <<< "${1#*=}" ;;
    --dry-run)     DRY_RUN=true ;;
    --verbose)     VERBOSE=true ;;
    --skip-yaml-check) SKIP_YAML_CHECK=true ;;
    --help|-h)     show_help ;;
    *)             log_error "Unknown option: $1"; echo "Use --help for usage"; exit 1 ;;
  esac
  shift
done

# Defaults: all platforms, all components
if [ ${#SELECTED_PLATFORMS[@]} -eq 0 ]; then
  while IFS= read -r p; do
    SELECTED_PLATFORMS+=("$p")
  done < <(list_platforms)
fi
[ ${#SELECTED_COMPONENTS[@]} -eq 0 ] && SELECTED_COMPONENTS=("${ALL_COMPONENTS[@]}")

# Export for child scripts
export DRY_RUN VERBOSE SKIP_YAML_CHECK

# ── Validate selections ──────────────────────────────────────
for p in "${SELECTED_PLATFORMS[@]}"; do
  if ! jq -e ".platforms.\"$p\"" "$REGISTRY_FILE" &>/dev/null; then
    log_error "Unknown platform: $p"
    echo "Available: $(list_platforms | tr '\n' ', ' | sed 's/,$//')"
    exit 1
  fi
done

for c in "${SELECTED_COMPONENTS[@]}"; do
  local_valid=false
  for valid in "${ALL_COMPONENTS[@]}"; do
    [ "$c" = "$valid" ] && local_valid=true && break
  done
  if [ "$local_valid" = false ]; then
    log_error "Unknown component: $c"
    echo "Available: ${ALL_COMPONENTS[*]}"
    exit 1
  fi
done

# ── Banner ────────────────────────────────────────────────────
echo "╔═══════════════════════════════════════════════════════════════════╗"
echo "║  🔄 SYNCHRONIZING CONFIGURATIONS                                  ║"
echo "╚═══════════════════════════════════════════════════════════════════╝"
echo ""

if [ "$DRY_RUN" = true ]; then
  log_warn "DRY RUN MODE - No changes will be made"
  echo ""
fi

# Show what will be synced
echo "Platforms:  ${SELECTED_PLATFORMS[*]}"
echo "Components: ${SELECTED_COMPONENTS[*]}"
echo ""

# ── Load adapters for selected platforms ──────────────────────
for platform in "${SELECTED_PLATFORMS[@]}"; do
  adapter="$AGENTS_DIR/adapters/${platform}.sh"
  if [ -f "$adapter" ]; then
    source "$adapter"
    log_verbose "Loaded adapter: $platform"
  else
    log_error "Adapter not found: $adapter"
    exit 1
  fi
done

# ── Load and execute component orchestrators ──────────────────
for component in "${SELECTED_COMPONENTS[@]}"; do
  orchestrator="$AGENTS_DIR/sync/${component}.sh"
  if [ -f "$orchestrator" ]; then
    source "$orchestrator"
    "sync_${component}" "${SELECTED_PLATFORMS[@]}"
  else
    log_error "Orchestrator not found: $orchestrator"
    exit 1
  fi
done

# ── Summary ───────────────────────────────────────────────────
echo ""
echo "╔═══════════════════════════════════════════════════════════════════╗"
echo "║  ✅ SYNCHRONIZATION COMPLETED                                      ║"
echo "╚═══════════════════════════════════════════════════════════════════╝"
echo ""

if [ "$DRY_RUN" = false ]; then
  echo "Summary of synchronized components:"
  for component in "${SELECTED_COMPONENTS[@]}"; do
    case "$component" in
      orchestrator) echo "  ✅ Orchestrator - Root symlinks (AGENTS.md, CLAUDE.md, GEMINI.md)" ;;
      rules)        echo "  ✅ Rules - Synced to: ${SELECTED_PLATFORMS[*]}" ;;
      skills)       echo "  ✅ Skills - Synced to: ${SELECTED_PLATFORMS[*]}" ;;
      commands)     echo "  ✅ Commands - Synced to: ${SELECTED_PLATFORMS[*]}" ;;
      agents)       echo "  ✅ Subagents - Synced to supported platforms" ;;
      mcp)          echo "  ✅ MCP Servers - Configs generated" ;;
      hooks)        echo "  ✅ Hooks - Distributed to supported platforms" ;;
    esac
  done
  echo ""
  echo "All agent directories now have latest configurations from .agents/"
  echo ""
  echo "Verify with:"
  echo "  ls -la {AGENTS,CLAUDE,GEMINI}.md"
  echo "  ls -la .cursor/{rules,skills,commands,agents}"
  echo "  ls -la .claude/{rules,skills,commands,agents,hooks}"
  echo "  ls -la .gemini/{rules,skills,commands,agents,hooks}"
  echo "  ls -la .github/{rules,skills,prompts,agents,hooks}"
  echo "  ls -la .agents/workflows"
  echo "  jq .hooks .claude/settings.json"
  echo "  jq .hooks .gemini/settings.json"
  echo "  jq .servers .vscode/mcp.json"
else
  echo "Dry run completed. To apply changes, run:"
  echo "  ./.agents/sync.sh"
fi

echo ""
