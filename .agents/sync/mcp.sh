#!/bin/bash
# Component orchestrator: MCP server configurations

sync_mcp() {
  local platforms=("$@")

  log_section "MCP SERVERS"

  require_file "$AGENTS_DIR/mcp/mcp-servers.json" "MCP source"

  # Validate JSON
  if ! jq empty "$AGENTS_DIR/mcp/mcp-servers.json" 2>/dev/null; then
    log_error "Invalid JSON: .agents/mcp/mcp-servers.json"
    exit 1
  fi

  for platform in "${platforms[@]}"; do
    if ! platform_supports "$platform" "mcp"; then
      log_verbose "Skipping $(platform_name "$platform") (MCP not supported)"
      continue
    fi

    echo "$(platform_emoji "$platform") Syncing $(platform_name "$platform") MCP..."

    local fn="${platform}_mcp"
    if type -t "$fn" &>/dev/null; then
      "$fn"
    else
      log_warn "No MCP adapter for $platform"
    fi
    echo ""
  done

  # Verification
  if [ "$DRY_RUN" = false ]; then
    echo "Verifying MCP synchronization..."
    for platform in "${platforms[@]}"; do
      platform_supports "$platform" "mcp" || continue
      local fn="${platform}_verify"
      type -t "$fn" &>/dev/null && "$fn" 2>/dev/null || true
    done
  fi
}
