#!/bin/bash
# Platform adapter: Gemini CLI
# Rules: generate GEMINI.md index | Skills/Agents: native (reads .agents/ directly)
# Commands: convert .md → .toml | MCP: merge settings.json | Hooks: merge settings.json
# NOTE: Gemini CLI discovers skills/agents from .agents/ natively.
#       Symlinks to .gemini/skills/ cause "Skill conflict detected" warnings.

GEMINI_DIR="$PROJECT_ROOT/.gemini"

gemini_rules() {
  log_verbose "Gemini rules: generate GEMINI.md index (filesystem-driven)"

  if run_or_dry "generate GEMINI.md index file"; then
    return 0
  fi

  # Remove existing symlink/directory if present
  [ -e "$GEMINI_DIR/rules" ] || [ -L "$GEMINI_DIR/rules" ] && rm -rf "$GEMINI_DIR/rules"
  mkdir -p "$GEMINI_DIR"

  local out="$GEMINI_DIR/GEMINI.md"
  local tmp="${out}.tmp"

  {
    cat <<'EOF'
# Rules Reference for Gemini CLI

> **Note:** Gemini CLI does not support rules like other agents. This document serves as an index to the project's rules located in `.agents/rules/`.

## Project Rules Location

All rules are centralized in: `.agents/rules/`

## Rules by Category

EOF

    _emit_rules_index "../.agents/rules"

    cat <<'EOF'

## Synchronization

Rules are synchronized across agents using:

```bash
./.agents/sync.sh
```

**Platform Support:**
- **Cursor:** Rules copied as .mdc files (flattened)
- **Claude Code:** Rules symlinked with subdirectories
- **Gemini CLI:** Index file (this document) - no native rules support
- **Copilot (VSCode):** Rules copied as .instructions.md (flattened)
- **Antigravity:** Rules read natively from .agents/rules/
EOF
  } > "$tmp"

  _write_if_changed "$tmp" "$out" "GEMINI.md index"
}

# Emit a markdown index of all rules under .agents/rules, grouped by subdir.
# Reads frontmatter `description` (if present) to provide a human label.
# Argument: relative_prefix (path used in the generated links, e.g. "../.agents/rules")
_emit_rules_index() {
  local rel_prefix=$1
  local rules_root="$AGENTS_DIR/rules"
  local prev_subdir=""

  while IFS= read -r rule_file; do
    local rel
    rel=$(echo "$rule_file" | sed "s|$rules_root/||")
    local subdir="${rel%/*}"
    [ "$subdir" = "$rel" ] && subdir="(root)"

    if [ "$subdir" != "$prev_subdir" ]; then
      [ -n "$prev_subdir" ] && echo "" && echo "---" && echo ""
      printf "### %s\n\n" "$(_human_subdir "$subdir")"
      prev_subdir="$subdir"
    fi

    local base
    base=$(basename "$rule_file" .md)
    local desc
    desc=$(has_frontmatter "$rule_file" && extract_field "$rule_file" "description" || true)
    desc=${desc:-"Project rule"}

    printf "#### **[%s](%s/%s)**\n%s\n\n" \
      "$(_title_case "$base")" "$rel_prefix" "$rel" "$desc"
  done < <(find "$rules_root" -type f -name "*.md" ! -name "README.md" | sort)
}

# Pretty-print a subdir name like "lidr-sdlc" → "LIDR SDLC"; "code" → "Code"
_human_subdir() {
  local s=$1
  case "$s" in
    "(root)")     echo "General" ;;
    "lidr-sdlc")  echo "LIDR SDLC" ;;
    *)            echo "$s" | sed 's/^./\U&/' | sed 's/-/ /g' ;;
  esac
}

# Title-case a kebab-case filename: "ai-workflow-system" → "Ai Workflow System"
_title_case() {
  echo "$1" | sed 's/-/ /g' | awk '{for(i=1;i<=NF;i++){$i=toupper(substr($i,1,1)) tolower(substr($i,2))}1}'
}

# Write $tmp to $out only if content differs, to avoid touching git timestamps.
# Usage: _write_if_changed tmp_file final_file "human description"
_write_if_changed() {
  local tmp=$1 out=$2 label=$3
  if [ -f "$out" ] && cmp -s "$tmp" "$out"; then
    rm -f "$tmp"
    log_info "$label unchanged"
    return 0
  fi
  mv "$tmp" "$out"
  log_info "Updated $label"
}

gemini_skills() {
  # Gemini CLI reads .agents/skills/ natively — no symlink needed.
  # Creating .gemini/skills → .agents/skills causes "Skill conflict detected" warnings.
  # Remove stale symlink if present from previous sync versions.
  if [ -L "$GEMINI_DIR/skills" ]; then
    if run_or_dry "remove stale .gemini/skills symlink"; then return 0; fi
    rm "$GEMINI_DIR/skills"
    log_info "Removed stale .gemini/skills symlink (Gemini reads .agents/skills/ natively)"
  else
    log_info "Skills: native (.agents/skills/ — no symlink needed)"
  fi
}

gemini_commands() {
  log_verbose "Gemini commands: convert .md → .toml"

  if run_or_dry "convert and copy commands to .gemini/commands/"; then
    return 0
  fi

  # Remove existing directory/symlink
  [ -e "$GEMINI_DIR/commands" ] || [ -L "$GEMINI_DIR/commands" ] && rm -rf "$GEMINI_DIR/commands"
  mkdir -p "$GEMINI_DIR/commands"

  local count=0
  for md_file in "$AGENTS_DIR/commands"/*.md; do
    [ -f "$md_file" ] || continue
    local base_name
    base_name=$(basename "$md_file" .md)
    local toml_file="$GEMINI_DIR/commands/${base_name}.toml"

    _gemini_convert_to_toml "$md_file" "$toml_file"
    log_detail "${base_name}.md → ${base_name}.toml"
    ((count++))
  done

  if [ $count -gt 0 ]; then
    log_info "Converted $count commands to TOML format"
  else
    log_warn "No commands found to convert"
  fi
}

_gemini_convert_to_toml() {
  local md_file=$1 toml_file=$2

  local description=""
  if has_frontmatter "$md_file"; then
    description=$(extract_field "$md_file" "description")
  fi

  local prompt
  prompt=$(extract_body "$md_file")
  # Convert $ARGUMENTS to {{args}}
  prompt=$(echo "$prompt" | sed 's/\$ARGUMENTS/{{args}}/g')
  # Remove triple backticks (conflict with TOML triple quotes)
  prompt=$(echo "$prompt" | sed 's/```bash/[Code block:]/g' | sed 's/```//g')
  # Escape backslashes for TOML
  prompt=$(echo "$prompt" | sed 's/\\/\\\\/g')

  {
    [ -n "$description" ] && echo "description = \"$description\"" && echo ""
    echo 'prompt = """'
    echo "$prompt"
    echo '"""'
  } > "$toml_file"
}

gemini_agents() {
  # Gemini CLI reads .agents/subagents/ natively — no symlink needed.
  # Creating .gemini/agents → .agents/subagents causes duplicate detection.
  # Remove stale symlink if present from previous sync versions.
  if [ -L "$GEMINI_DIR/agents" ]; then
    if run_or_dry "remove stale .gemini/agents symlink"; then return 0; fi
    rm "$GEMINI_DIR/agents"
    log_info "Removed stale .gemini/agents symlink (Gemini reads .agents/subagents/ natively)"
  else
    log_info "Agents: native (.agents/subagents/ — no symlink needed)"
  fi
}

gemini_mcp() {
  log_verbose "Gemini MCP: merge into .gemini/settings.json"
  mkdir -p "$GEMINI_DIR"

  local MCP_SERVERS
  MCP_SERVERS=$(jq '{
    mcpServers: (
      .servers |
      to_entries |
      map(
        select(.value.platforms | index("gemini")) |
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
  }' "$AGENTS_DIR/mcp/mcp-servers.json")

  local settings_file="$GEMINI_DIR/settings.json"

  local merged
  if [ -f "$settings_file" ]; then
    merged=$(jq --argjson mcp "$MCP_SERVERS" '. + $mcp' "$settings_file")
  else
    merged=$(jq --argjson mcp "$MCP_SERVERS" '{
      experimental: { enableAgents: true },
      context: {
        fileName: ["AGENTS.md", "CONTEXT.md", "GEMINI.md", "CLAUDE.md"]
      }
    } + $mcp' <<< '{}')
  fi
  echo "$merged" | write_if_changed "$settings_file" ".gemini/settings.json (MCP)"

  _gemini_generate_antigravity_config
}

_gemini_generate_antigravity_config() {
  jq '{
    mcpServers: (
      .servers |
      to_entries |
      map(
        select(.value.platforms | index("antigravity")) |
        {
          key: .key,
          value: (
            .value |
            del(.platforms, .description) |
            if .type == "http" then
              { serverUrl: .url, headers: (.headers // {}) }
            else
              { command: .command, args: (.args // []), env: (.env // {}) }
            end
          )
        }
      ) |
      from_entries
    )
  }' "$AGENTS_DIR/mcp/mcp-servers.json" | write_if_changed "$GEMINI_DIR/mcp_config.json" ".gemini/mcp_config.json"
}

gemini_hooks() {
  log_verbose "Gemini hooks: symlink + merge into settings.json"
  mkdir -p "$GEMINI_DIR"

  # Hooks directory symlink
  create_symlink "../.agents/hooks" "$GEMINI_DIR/hooks" "hooks"

  local source_file="$AGENTS_DIR/hooks/hooks.json"

  # Generate Gemini hooks (BeforeTool/AfterTool events, timeout in ms)
  local gemini_hooks_json
  gemini_hooks_json=$(jq '{
    hooks: {
      Notification: [
        (
          .hooks | to_entries | map(
            select(.value.platforms | index("gemini")) |
            select(.value.event == "Notification") |
            {
              matcher: .value.matcher,
              hooks: [{
                name: .key,
                type: "command",
                command: (.value.command | gsub("\\$\\{PLUGIN_ROOT\\}"; "${GEMINI_PROJECT_DIR}/.gemini")),
                timeout: (.value.timeout * 1000)
              }]
            }
          )
        )[]
      ],
      BeforeTool: [
        (
          .hooks | to_entries | map(
            select(.value.platforms | index("gemini")) |
            select(.value.event == "PreToolUse") |
            {
              matcher: .value.matcher,
              hooks: [{
                name: .key,
                type: "command",
                command: (.value.command | gsub("\\$\\{PLUGIN_ROOT\\}"; "${GEMINI_PROJECT_DIR}/.gemini")),
                timeout: (.value.timeout * 1000)
              }]
            }
          )
        )[]
      ],
      AfterTool: [
        (
          .hooks | to_entries | map(
            select(.value.platforms | index("gemini")) |
            select(.value.event == "PostToolUse") |
            {
              matcher: .value.matcher,
              hooks: [{
                name: .key,
                type: "command",
                command: (.value.command | gsub("\\$\\{PLUGIN_ROOT\\}"; "${GEMINI_PROJECT_DIR}/.gemini")),
                timeout: (.value.timeout * 1000)
              }]
            }
          )
        )[]
      ]
    }
  } | .hooks | with_entries(select(.value | length > 0))' "$source_file")

  local hooks_count
  hooks_count=$(echo "$gemini_hooks_json" | jq 'to_entries | length')

  # Merge hooks into settings.json
  local settings_file="$GEMINI_DIR/settings.json"
  local merged
  if [ -f "$settings_file" ]; then
    merged=$(jq --argjson hooks "$gemini_hooks_json" '.hooks = $hooks' "$settings_file")
  else
    merged=$(echo "{\"hooks\": $gemini_hooks_json}" | jq '.')
  fi
  echo "$merged" | write_if_changed "$settings_file" ".gemini/settings.json ($hooks_count hook types)"
}

gemini_verify() {
  local errors=0

  # GEMINI.md index
  if [ -f "$GEMINI_DIR/GEMINI.md" ]; then
    log_info "gemini: GEMINI.md index file"
  else
    log_error "gemini: GEMINI.md not found"
    ((errors++))
  fi

  # Skills (native — no symlink expected)
  if [ -d "$AGENTS_DIR/skills" ]; then
    local skill_count
    skill_count=$(find "$AGENTS_DIR/skills" -maxdepth 1 -mindepth 1 -type d 2>/dev/null | wc -l | tr -d ' ')
    log_info "gemini skills: native from .agents/skills/ ($skill_count skills)"
    # Warn if stale symlink still exists
    if [ -L "$GEMINI_DIR/skills" ]; then
      log_warn "gemini skills: stale .gemini/skills symlink exists (causes conflicts)"
    fi
  else
    log_error "gemini skills: .agents/skills/ not found"
    ((errors++))
  fi

  # Commands (TOML files)
  if [ -d "$GEMINI_DIR/commands" ]; then
    local toml_count
    toml_count=$(find "$GEMINI_DIR/commands" -name "*.toml" 2>/dev/null | wc -l | tr -d ' ')
    log_info "gemini commands: $toml_count TOML files"
  else
    log_error "gemini commands: Directory not found"
    ((errors++))
  fi

  # Agents (native — no symlink expected)
  if [ -d "$AGENTS_DIR/subagents" ]; then
    local agent_count
    agent_count=$(find "$AGENTS_DIR/subagents" -name "*.md" 2>/dev/null | wc -l | tr -d ' ')
    log_info "gemini agents: native from .agents/subagents/ ($agent_count agents)"
    # Warn if stale symlink still exists
    if [ -L "$GEMINI_DIR/agents" ]; then
      log_warn "gemini agents: stale .gemini/agents symlink exists (causes conflicts)"
    fi
  else
    log_error "gemini agents: .agents/subagents/ not found"
    ((errors++))
  fi

  # Settings.json (MCP + hooks)
  if [ -f "$GEMINI_DIR/settings.json" ]; then
    if jq -e '.mcpServers' "$GEMINI_DIR/settings.json" > /dev/null 2>&1; then
      log_info "gemini MCP: settings.json mcpServers OK"
    else
      log_error "gemini MCP: Missing mcpServers in settings.json"
      ((errors++))
    fi
    if jq -e '.hooks' "$GEMINI_DIR/settings.json" > /dev/null 2>&1; then
      local count
      count=$(jq '.hooks | to_entries | length' "$GEMINI_DIR/settings.json")
      log_info "gemini hooks: settings.json has $count hook types"
    else
      log_error "gemini hooks: Missing hooks in settings.json"
      ((errors++))
    fi
  else
    log_error "gemini: settings.json not found"
    ((errors++))
  fi

  verify_link_or_copy "$GEMINI_DIR/hooks" "gemini hooks" || ((errors++))

  return $errors
}
