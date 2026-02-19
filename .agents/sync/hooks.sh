#!/bin/bash
# Component orchestrator: Hooks (git workflow automation)

sync_hooks() {
  local platforms=("$@")

  log_section "HOOKS"

  require_file "$AGENTS_DIR/hooks/hooks.json" "Hooks source"
  require_dir "$AGENTS_DIR/hooks/scripts" "Hooks scripts"

  # Validate JSON
  if ! jq empty "$AGENTS_DIR/hooks/hooks.json" 2>/dev/null; then
    log_error "Invalid JSON: .agents/hooks/hooks.json"
    exit 1
  fi

  for platform in "${platforms[@]}"; do
    if ! platform_supports "$platform" "hooks"; then
      log_verbose "Skipping $(platform_name "$platform") (hooks not supported)"
      continue
    fi

    echo "$(platform_emoji "$platform") Syncing $(platform_name "$platform") hooks..."

    local fn="${platform}_hooks"
    if type -t "$fn" &>/dev/null; then
      "$fn"
    else
      log_warn "No hooks adapter for $platform"
    fi
    echo ""
  done

  # Verification
  if [ "$DRY_RUN" = false ]; then
    echo "Verifying hooks synchronization..."
    for platform in "${platforms[@]}"; do
      platform_supports "$platform" "hooks" || continue
      local fn="${platform}_verify"
      type -t "$fn" &>/dev/null && "$fn" 2>/dev/null || true
    done
  fi
}
