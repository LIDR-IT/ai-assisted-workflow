#!/bin/bash
# Platform adapter: Gemini CLI
# Rules: generate GEMINI.md index | Skills/Agents: native (reads .agents/ directly)
# Commands: convert .md → .toml | MCP: merge settings.json | Hooks: merge settings.json
# NOTE: Gemini CLI discovers skills/agents from .agents/ natively.
#       Symlinks to .gemini/skills/ cause "Skill conflict detected" warnings.

GEMINI_DIR="$PROJECT_ROOT/.gemini"

gemini_rules() {
  log_verbose "Gemini rules: generate GEMINI.md index"

  if run_or_dry "generate GEMINI.md index file"; then
    return 0
  fi

  # Remove existing symlink/directory if present
  [ -e "$GEMINI_DIR/rules" ] || [ -L "$GEMINI_DIR/rules" ] && rm -rf "$GEMINI_DIR/rules"
  mkdir -p "$GEMINI_DIR"

  # Generate GEMINI.md index file
  cat > "$GEMINI_DIR/GEMINI.md" << 'EOF'
# Rules Reference for Gemini CLI

> **Note:** Gemini CLI does not support rules like other agents. This document serves as an index to the project's rules located in `.agents/rules/`.

## Project Rules Location

All rules are centralized in: `.agents/rules/`

## Rules by Category

### Code Standards

#### **[Principles](../.agents/rules/code/principles.md)**
Core principles and architectural decisions for the project.

#### **[Style](../.agents/rules/code/style.md)**
Code style guidelines and formatting standards.

---

### Content Guidelines

#### **[Copywriting](../.agents/rules/content/copywriting.md)**
Copywriting and content standards for user-facing text.

---

### Design Standards

#### **[Web Design](../.agents/rules/design/web-design.md)**
Web interface guidelines and accessibility standards.

---

### Framework-Specific

#### **[React Native](../.agents/rules/frameworks/react-native.md)**
React Native best practices and performance optimization.

---

### Process & Workflow

#### **[Git Workflow](../.agents/rules/process/git-workflow.md)**
Git branching strategy, commit conventions, and PR guidelines.

#### **[Documentation](../.agents/rules/process/documentation.md)**
Documentation standards and writing guidelines.

---

### Quality Assurance

#### **[Testing](../.agents/rules/quality/testing.md)**
Testing philosophy, manual testing checklists, and verification.

#### **[Testing Scripts](../.agents/rules/quality/testing-scripts.md)**
Bash script testing patterns and best practices.

---

### Team Conventions

#### **[Skills Management](../.agents/rules/team/skills-management.md)**
Guidelines for managing AI agent skills at project level.

#### **[Third-Party Security](../.agents/rules/team/third-party-security.md)**
Security guidelines for third-party MCP servers and Skills.

---

### Tools & Extensions

#### **[Claude Code Extensions](../.agents/rules/tools/claude-code-extensions.md)**
Reference for extending Claude Code with skills, commands, and agents.

#### **[Use Context7](../.agents/rules/tools/use-context7.md)**
Guidelines for using Context7 MCP for library/API documentation.

---

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

---

## Additional Resources

- **[README](../.agents/rules/README.md)** - Rules best practices and YAML frontmatter guide

---

*Last synchronized: [Auto-generated]*
EOF

  # Update timestamp
  local timestamp
  timestamp=$(date "+%Y-%m-%d %H:%M:%S")
  sed -i '' "s/\[Auto-generated\]/$timestamp/" "$GEMINI_DIR/GEMINI.md"

  log_info "Generated GEMINI.md index file"
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

  if [ -f "$settings_file" ]; then
    # Merge preserving experimental, context, and hooks settings
    jq --argjson mcp "$MCP_SERVERS" '. + $mcp' "$settings_file" > "$settings_file.tmp"
    mv "$settings_file.tmp" "$settings_file"
  else
    # Create with full configuration
    jq --argjson mcp "$MCP_SERVERS" '{
      experimental: { enableAgents: true },
      context: {
        fileName: ["AGENTS.md", "CONTEXT.md", "GEMINI.md", "CLAUDE.md"]
      }
    } + $mcp' <<< '{}' > "$settings_file"
  fi

  # Also generate antigravity reference config
  _gemini_generate_antigravity_config

  log_info "Updated .gemini/settings.json (MCP servers)"
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
  }' "$AGENTS_DIR/mcp/mcp-servers.json" > "$GEMINI_DIR/mcp_config.json"

  log_info "Generated .gemini/mcp_config.json (Antigravity reference)"
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
                command: (.value.command | gsub("\\$\\{PLUGIN_ROOT\\}"; "${GEMINI_PROJECT_DIR}/.agents")),
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
                command: (.value.command | gsub("\\$\\{PLUGIN_ROOT\\}"; "${GEMINI_PROJECT_DIR}/.agents")),
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
                command: (.value.command | gsub("\\$\\{PLUGIN_ROOT\\}"; "${GEMINI_PROJECT_DIR}/.agents")),
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
  if [ -f "$settings_file" ]; then
    jq --argjson hooks "$gemini_hooks_json" '.hooks = $hooks' "$settings_file" > "$settings_file.tmp"
    mv "$settings_file.tmp" "$settings_file"
  else
    echo "{\"hooks\": $gemini_hooks_json}" | jq '.' > "$settings_file"
  fi

  log_info "Updated .gemini/settings.json ($hooks_count hook types)"
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

  # Hooks symlink
  if [ -L "$GEMINI_DIR/hooks" ]; then
    log_info "gemini hooks: symlink OK"
  else
    log_error "gemini hooks: Missing symlink"
    ((errors++))
  fi

  return $errors
}
