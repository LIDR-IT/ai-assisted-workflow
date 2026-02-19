#!/bin/bash
# Platform adapter: Claude Code
# Claude uses symlinks for everything + generated MCP/hooks configs

CLAUDE_DIR="$PROJECT_ROOT/.claude"

claude_rules() {
  create_symlink "../.agents/rules" "$CLAUDE_DIR/rules" "rules"
}

claude_skills() {
  create_symlink "../.agents/skills" "$CLAUDE_DIR/skills" "skills"
}

claude_commands() {
  create_symlink "../.agents/commands" "$CLAUDE_DIR/commands" "commands"
}

claude_agents() {
  create_symlink "../.agents/subagents" "$CLAUDE_DIR/agents" "agents"
}

claude_mcp() {
  log_verbose "Claude MCP: generate .claude/mcp.json"
  mkdir -p "$CLAUDE_DIR"

  jq --arg platform "claude" '{
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
  }' "$AGENTS_DIR/mcp/mcp-servers.json" > "$CLAUDE_DIR/mcp.json"

  log_info "Generated .claude/mcp.json"
}

claude_hooks() {
  log_verbose "Claude hooks: symlink + merge into settings.json"
  mkdir -p "$CLAUDE_DIR"

  # Symlink hooks directory
  create_symlink "../.agents/hooks" "$CLAUDE_DIR/hooks" "hooks"

  local source_file="$AGENTS_DIR/hooks/hooks.json"

  # Generate Claude hooks (PascalCase events, timeout in seconds)
  local claude_hooks_json
  claude_hooks_json=$(jq '{
    hooks: {
      Notification: [
        (
          .hooks | to_entries | map(
            select(.value.platforms | index("claude")) |
            select(.value.event == "Notification") |
            {
              matcher: .value.matcher,
              hooks: [{
                type: "command",
                command: (.value.command | gsub("\\$\\{PLUGIN_ROOT\\}"; "${CLAUDE_PROJECT_DIR}/.agents")),
                timeout: .value.timeout
              }]
            }
          )
        )[]
      ],
      PreToolUse: [
        (
          .hooks | to_entries | map(
            select(.value.platforms | index("claude")) |
            select(.value.event == "PreToolUse") |
            {
              matcher: .value.matcher,
              hooks: [{
                type: "command",
                command: (.value.command | gsub("\\$\\{PLUGIN_ROOT\\}"; "${CLAUDE_PROJECT_DIR}/.agents")),
                timeout: .value.timeout
              }]
            }
          )
        )[]
      ],
      PostToolUse: [
        (
          .hooks | to_entries | map(
            select(.value.platforms | index("claude")) |
            select(.value.event == "PostToolUse") |
            {
              matcher: .value.matcher,
              hooks: [{
                type: "command",
                command: (.value.command | gsub("\\$\\{PLUGIN_ROOT\\}"; "${CLAUDE_PROJECT_DIR}/.agents")),
                timeout: .value.timeout
              }]
            }
          )
        )[]
      ]
    }
  } | .hooks | with_entries(select(.value | length > 0))' "$source_file")

  local hooks_count
  hooks_count=$(echo "$claude_hooks_json" | jq 'to_entries | length')

  # Merge hooks into settings.json
  local settings_file="$CLAUDE_DIR/settings.json"
  if [ -f "$settings_file" ]; then
    jq --argjson hooks "$claude_hooks_json" '.hooks = $hooks' "$settings_file" > "$settings_file.tmp"
    mv "$settings_file.tmp" "$settings_file"
  else
    echo "{\"hooks\": $claude_hooks_json}" | jq '.' > "$settings_file"
  fi

  log_info "Updated .claude/settings.json ($hooks_count hook types)"
}

claude_verify() {
  local errors=0

  # Rules symlink
  if [ -L "$CLAUDE_DIR/rules" ]; then
    log_info "claude rules: $CLAUDE_DIR/rules → $(readlink "$CLAUDE_DIR/rules")"
  else
    log_error "claude rules: Not a symlink"
    ((errors++))
  fi

  # Skills symlink
  if [ -L "$CLAUDE_DIR/skills" ]; then
    log_info "claude skills: $CLAUDE_DIR/skills → $(readlink "$CLAUDE_DIR/skills")"
  else
    log_error "claude skills: Not a symlink"
    ((errors++))
  fi

  # Commands symlink
  if [ -L "$CLAUDE_DIR/commands" ]; then
    log_info "claude commands: $CLAUDE_DIR/commands → $(readlink "$CLAUDE_DIR/commands")"
  else
    log_error "claude commands: Not a symlink"
    ((errors++))
  fi

  # Agents symlink
  if [ -L "$CLAUDE_DIR/agents" ]; then
    log_info "claude agents: $CLAUDE_DIR/agents → $(readlink "$CLAUDE_DIR/agents")"
  else
    log_error "claude agents: Not a symlink"
    ((errors++))
  fi

  # Hooks symlink
  if [ -L "$CLAUDE_DIR/hooks" ]; then
    log_info "claude hooks: symlink OK"
  else
    log_error "claude hooks: Missing symlink"
    ((errors++))
  fi

  # Settings.json hooks
  if jq -e '.hooks' "$CLAUDE_DIR/settings.json" > /dev/null 2>&1; then
    local count
    count=$(jq '.hooks | to_entries | length' "$CLAUDE_DIR/settings.json")
    log_info "claude settings.json: $count hook types"
  else
    log_error "claude settings.json: Missing hooks"
    ((errors++))
  fi

  # MCP config
  if [ -f "$CLAUDE_DIR/mcp.json" ]; then
    log_info "claude MCP: .claude/mcp.json"
  else
    log_error "claude MCP: .claude/mcp.json not found"
    ((errors++))
  fi

  return $errors
}
