#!/bin/bash
# Component orchestrator: Commands

sync_commands() {
  local platforms=("$@")

  log_section "COMMANDS"

  require_dir "$AGENTS_DIR/commands" "Commands source"

  for platform in "${platforms[@]}"; do
    if ! platform_supports "$platform" "commands"; then
      log_verbose "Skipping $(platform_name "$platform") (commands not supported)"
      continue
    fi

    echo "$(platform_emoji "$platform") Syncing $(platform_name "$platform") commands..."

    local fn="${platform}_commands"
    if type -t "$fn" &>/dev/null; then
      "$fn"
    else
      log_warn "No commands adapter for $platform"
    fi
    echo ""
  done

  # Verification
  if [ "$DRY_RUN" = false ]; then
    echo "Verifying commands synchronization..."
    for platform in "${platforms[@]}"; do
      platform_supports "$platform" "commands" || continue
      local fn="${platform}_verify"
      type -t "$fn" &>/dev/null && "$fn" 2>/dev/null || true
    done
  fi
}
