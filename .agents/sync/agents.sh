#!/bin/bash
# Component orchestrator: Agents (subagents)

sync_agents() {
  local platforms=("$@")

  log_section "SUBAGENTS"

  require_dir "$AGENTS_DIR/subagents" "Subagents source"

  for platform in "${platforms[@]}"; do
    if ! platform_supports "$platform" "agents"; then
      log_verbose "Skipping $(platform_name "$platform") (agents not supported)"
      continue
    fi

    echo "$(platform_emoji "$platform") Syncing $(platform_name "$platform") agents..."

    local fn="${platform}_agents"
    if type -t "$fn" &>/dev/null; then
      "$fn"
    else
      log_warn "No agents adapter for $platform"
    fi
    echo ""
  done

  # Verification
  if [ "$DRY_RUN" = false ]; then
    echo "Verifying agents synchronization..."
    for platform in "${platforms[@]}"; do
      platform_supports "$platform" "agents" || continue
      local fn="${platform}_verify"
      type -t "$fn" &>/dev/null && "$fn" 2>/dev/null || true
    done
  fi
}
