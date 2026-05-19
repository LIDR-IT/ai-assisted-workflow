#!/bin/bash
# Platform adapter: Cursor
# Rules: copy-flatten to .mdc | Skills/Commands/Agents: symlink | MCP/Hooks: generate

CURSOR_DIR="$PROJECT_ROOT/.cursor"

cursor_rules() {
  log_verbose "Cursor rules: copy-flatten .md → .mdc"

  if run_or_dry "copy all .md files to .cursor/rules/ (flattened .mdc)"; then
    return 0
  fi

  # Remove existing directory/symlink
  [ -e "$CURSOR_DIR/rules" ] || [ -L "$CURSOR_DIR/rules" ] && rm -rf "$CURSOR_DIR/rules"
  mkdir -p "$CURSOR_DIR/rules"

  local count=0
  while IFS= read -r -d '' rule_file; do
    local rule_name
    rule_name=$(basename "$rule_file")
    local rule_base
    rule_base=$(flat_rule_basename "$rule_file" "$AGENTS_DIR/rules")
    local dest_file="$CURSOR_DIR/rules/${rule_base}.mdc"
    local subdir
    subdir=$(dirname "$rule_file" | sed "s|$AGENTS_DIR/rules||" | sed 's|^/||')

    cp "$rule_file" "$dest_file"
    touch "$dest_file"

    if [ -n "$subdir" ]; then
      log_detail "${rule_base}.mdc (from $subdir/${rule_name})"
    else
      log_detail "${rule_base}.mdc (from ${rule_name})"
    fi
    ((count++))
  done < <(find "$AGENTS_DIR/rules" -type f -name "*.md" ! -name "sync-*.sh" -print0)

  if [ $count -gt 0 ]; then
    log_info "Copied $count rules to flat .mdc structure"
  else
    log_warn "No rules found to copy"
  fi
}

cursor_skills() {
  create_symlink "../.agents/skills" "$CURSOR_DIR/skills" "skills"
}

cursor_commands() {
  create_symlink "../.agents/commands" "$CURSOR_DIR/commands" "commands"
}

cursor_agents() {
  create_symlink "../.agents/subagents" "$CURSOR_DIR/agents" "agents"
}

cursor_mcp() {
  log_verbose "Cursor MCP: generate .cursor/mcp.json"
  mkdir -p "$CURSOR_DIR"

  jq --arg platform "cursor" '{
    mcpServers: (
      .servers |
      to_entries |
      map(
        select(.value.platforms | index($platform)) |
        {
          key: .key,
          value: (
            .value |
            del(.platforms, .description) |
            if .type == "http" then
              { url: .url, headers: (.headers // {}) }
            else
              { command: .command, args: (.args // []), env: (.env // {}) }
            end
          )
        }
      ) |
      from_entries
    )
  }' "$AGENTS_DIR/mcp/mcp-servers.json" | write_if_changed "$CURSOR_DIR/mcp.json" ".cursor/mcp.json"
}

cursor_hooks() {
  log_verbose "Cursor hooks: generate hooks.json + scripts symlink"

  mkdir -p "$CURSOR_DIR/hooks"

  # Scripts symlink (needed for manual testing)
  create_symlink "../../.agents/hooks/scripts" "$CURSOR_DIR/hooks/scripts" "hooks scripts"

  local source_file="$AGENTS_DIR/hooks/hooks.json"

  # Check if any hooks target cursor
  local cursor_hooks_count
  cursor_hooks_count=$(jq '[.hooks | to_entries[] | select(.value.platforms | index("cursor"))] | length' "$source_file")

  local cursor_hooks_json
  if [ "$cursor_hooks_count" -eq 0 ]; then
    cursor_hooks_json='{
  "version": 1,
  "_note": "Cursor hooks disabled - use Husky pre-commit instead (more reliable)",
  "hooks": {}
}'
  else
    cursor_hooks_json=$(jq '{
      version: 1,
      hooks: {
        afterFileEdit: [
          (
            .hooks | to_entries | map(
              select(.value.platforms | index("cursor")) |
              select(.value.event == "PostToolUse") |
              {
                command: ("bash .cursor/hooks/scripts/" + .key + ".sh"),
                timeout: .value.timeout
              }
            )
          )[]
        ],
        afterTabFileEdit: [
          (
            .hooks | to_entries | map(
              select(.value.platforms | index("cursor")) |
              select(.value.event == "PostToolUse") |
              {
                command: ("bash .cursor/hooks/scripts/" + .key + ".sh"),
                timeout: .value.timeout
              }
            )
          )[]
        ]
      }
    } | .hooks |= with_entries(select(.value | length > 0))' "$source_file")
  fi

  local hook_count
  hook_count=$(echo "$cursor_hooks_json" | jq '.hooks | to_entries | length' 2>/dev/null || echo "0")
  echo "$cursor_hooks_json" | write_if_changed "$CURSOR_DIR/hooks.json" ".cursor/hooks.json ($hook_count hook types)"
}

cursor_verify() {
  local errors=0

  # Rules (copied files)
  if [ -d "$CURSOR_DIR/rules" ]; then
    local count
    count=$(find "$CURSOR_DIR/rules" -type f -name "*.mdc" 2>/dev/null | wc -l | tr -d ' ')
    log_info "cursor rules: $count .mdc files (flattened)"
  else
    log_error "cursor rules: Directory not found"
    ((errors++))
  fi

  verify_link_or_copy "$CURSOR_DIR/skills"   "cursor skills"   || ((errors++))
  verify_link_or_copy "$CURSOR_DIR/commands" "cursor commands" || ((errors++))
  verify_link_or_copy "$CURSOR_DIR/agents"   "cursor agents"   || ((errors++))

  # MCP config
  if [ -f "$CURSOR_DIR/mcp.json" ]; then
    log_info "cursor MCP: .cursor/mcp.json"
  else
    log_error "cursor MCP: .cursor/mcp.json not found"
    ((errors++))
  fi

  # Hooks
  if [ -f "$CURSOR_DIR/hooks.json" ]; then
    local hook_count
    hook_count=$(jq '.hooks | to_entries | length' "$CURSOR_DIR/hooks.json" 2>/dev/null || echo "0")
    if [ "$hook_count" -eq 0 ]; then
      log_info "cursor hooks: empty (using Husky)"
    else
      log_info "cursor hooks: $hook_count hook types"
    fi
  else
    log_warn "cursor hooks: No .cursor/hooks.json"
  fi

  return $errors
}
