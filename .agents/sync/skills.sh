#!/bin/bash
# Component orchestrator: Skills

sync_skills() {
  local platforms=("$@")

  log_section "SKILLS"

  require_dir "$AGENTS_DIR/skills" "Skills source"

  for platform in "${platforms[@]}"; do
    if ! platform_supports "$platform" "skills"; then
      log_verbose "Skipping $(platform_name "$platform") (skills not supported)"
      continue
    fi

    echo "$(platform_emoji "$platform") Syncing $(platform_name "$platform") skills..."

    local fn="${platform}_skills"
    if type -t "$fn" &>/dev/null; then
      "$fn"
    else
      log_warn "No skills adapter for $platform"
    fi
    echo ""
  done

  # Verification
  if [ "$DRY_RUN" = false ]; then
    echo "Verifying skills synchronization..."
    for platform in "${platforms[@]}"; do
      platform_supports "$platform" "skills" || continue
      local fn="${platform}_verify"
      type -t "$fn" &>/dev/null && "$fn" 2>/dev/null || true
    done
  fi
}
