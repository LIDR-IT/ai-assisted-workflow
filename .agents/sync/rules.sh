#!/bin/bash
# Component orchestrator: Rules
# Validates source, optionally checks YAML, dispatches to platform adapters

sync_rules() {
  local platforms=("$@")

  log_section "RULES"

  require_dir "$AGENTS_DIR/rules" "Rules source"

  # Optional YAML frontmatter validation
  if [ "${SKIP_YAML_CHECK:-false}" != true ]; then
    _validate_yaml_frontmatter
  fi

  for platform in "${platforms[@]}"; do
    if ! platform_supports "$platform" "rules"; then
      log_verbose "Skipping $(platform_name "$platform") (rules not supported)"
      continue
    fi

    echo "$(platform_emoji "$platform") Syncing $(platform_name "$platform") rules..."

    local fn="${platform}_rules"
    if type -t "$fn" &>/dev/null; then
      "$fn"
    else
      log_warn "No rules adapter for $platform"
    fi
    echo ""
  done

  # Verification
  if [ "$DRY_RUN" = false ]; then
    echo "Verifying rules synchronization..."
    for platform in "${platforms[@]}"; do
      platform_supports "$platform" "rules" || continue
      local fn="${platform}_verify"
      type -t "$fn" &>/dev/null && "$fn" 2>/dev/null || true
    done
  fi
}

_validate_yaml_frontmatter() {
  echo "Checking YAML frontmatter compatibility..."

  local total=0 missing_yaml=0 incomplete_yaml=0
  local warnings=()

  while IFS= read -r -d '' rule_file; do
    ((total++))
    local relative_path
    relative_path=$(echo "$rule_file" | sed "s|$AGENTS_DIR/rules/||")

    if ! has_frontmatter "$rule_file"; then
      ((missing_yaml++))
      warnings+=("  $relative_path - No YAML frontmatter")
      continue
    fi

    local missing_fields=()
    local yaml
    yaml=$(extract_yaml_block "$rule_file")
    echo "$yaml" | grep -q "^name:" || missing_fields+=("name")
    echo "$yaml" | grep -q "^description:" || missing_fields+=("description")

    if [ ${#missing_fields[@]} -gt 0 ]; then
      ((incomplete_yaml++))
      warnings+=("  $relative_path - Missing: ${missing_fields[*]}")
    fi
  done < <(find "$AGENTS_DIR/rules" -type f -name "*.md" ! -name "README.md" ! -name "*.sh" -print0)

  if [ $missing_yaml -gt 0 ] || [ $incomplete_yaml -gt 0 ]; then
    log_warn "YAML Status: $total rules checked, $missing_yaml without frontmatter, $incomplete_yaml incomplete"
    local show_count=3
    if [ ${#warnings[@]} -gt 0 ]; then
      for i in "${!warnings[@]}"; do
        [ $i -lt $show_count ] && echo "  ${warnings[$i]}"
      done
      [ ${#warnings[@]} -gt $show_count ] && echo "     ... and $((${#warnings[@]} - show_count)) more"
    fi
  else
    log_info "All rules have proper YAML frontmatter"
  fi
  echo ""
}
