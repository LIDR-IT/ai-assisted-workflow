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
  log_verbose "Claude MCP: generate .mcp.json (project root)"
  mkdir -p "$CLAUDE_DIR"

  # Claude Code uses ${VAR} not ${env:VAR} (the env: prefix is VSCode/Copilot syntax)
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
              {
                command: .command,
                args: (.args // []),
                env: (
                  .env // {} |
                  to_entries |
                  map({key: .key, value: (.value | gsub("\\$\\{env:"; "${"))}) |
                  from_entries
                )
              }
            end
          )
        }
      ) |
      from_entries
    )
  }' "$AGENTS_DIR/mcp/mcp-servers.json" | write_json_if_changed "$PROJECT_ROOT/.mcp.json" ".mcp.json (project root)"

  # Remove legacy .claude/mcp.json if it exists
  [ -f "$CLAUDE_DIR/mcp.json" ] && rm "$CLAUDE_DIR/mcp.json"
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
                command: (.value.command | gsub("\\$\\{PLUGIN_ROOT\\}"; "${CLAUDE_PROJECT_DIR}/.claude")),
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
                command: (.value.command | gsub("\\$\\{PLUGIN_ROOT\\}"; "${CLAUDE_PROJECT_DIR}/.claude")),
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
                command: (.value.command | gsub("\\$\\{PLUGIN_ROOT\\}"; "${CLAUDE_PROJECT_DIR}/.claude")),
                timeout: .value.timeout
              }]
            }
          )
        )[]
      ],
      SessionStart: [
        (
          .hooks | to_entries | map(
            select(.value.platforms | index("claude")) |
            select(.value.event == "SessionStart") |
            {
              matcher: .value.matcher,
              hooks: [{
                type: "command",
                command: (.value.command | gsub("\\$\\{PLUGIN_ROOT\\}"; "${CLAUDE_PROJECT_DIR}/.claude")),
                timeout: .value.timeout
              }]
            }
          )
        )[]
      ],
      Stop: [
        (
          .hooks | to_entries | map(
            select(.value.platforms | index("claude")) |
            select(.value.event == "Stop") |
            {
              matcher: .value.matcher,
              hooks: [{
                type: "command",
                command: (.value.command | gsub("\\$\\{PLUGIN_ROOT\\}"; "${CLAUDE_PROJECT_DIR}/.claude")),
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
  local merged
  if [ -f "$settings_file" ]; then
    merged=$(jq --argjson hooks "$claude_hooks_json" '.hooks = $hooks' "$settings_file")
  else
    merged=$(echo "{\"hooks\": $claude_hooks_json}" | jq '.')
  fi
  echo "$merged" | write_if_changed "$settings_file" ".claude/settings.json ($hooks_count hook types)"
}

claude_verify() {
  local errors=0

  verify_link_or_copy "$CLAUDE_DIR/rules"    "claude rules"    || ((errors++))
  verify_link_or_copy "$CLAUDE_DIR/skills"   "claude skills"   || ((errors++))
  verify_link_or_copy "$CLAUDE_DIR/commands" "claude commands" || ((errors++))
  verify_link_or_copy "$CLAUDE_DIR/agents"   "claude agents"   || ((errors++))
  verify_link_or_copy "$CLAUDE_DIR/hooks"    "claude hooks"    || ((errors++))

  # Settings.json hooks
  if jq -e '.hooks' "$CLAUDE_DIR/settings.json" > /dev/null 2>&1; then
    local count
    count=$(jq '.hooks | to_entries | length' "$CLAUDE_DIR/settings.json")
    log_info "claude settings.json: $count hook types"
  else
    log_error "claude settings.json: Missing hooks"
    ((errors++))
  fi

  # MCP config (new location: project root .mcp.json)
  if [ -f "$PROJECT_ROOT/.mcp.json" ]; then
    log_info "claude MCP: .mcp.json (project root)"
  elif [ -f "$CLAUDE_DIR/mcp.json" ]; then
    log_warn "claude MCP: .claude/mcp.json (legacy location, run sync to migrate)"
  else
    log_error "claude MCP: .mcp.json not found"
    ((errors++))
  fi

  return $errors
}
