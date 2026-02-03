#!/bin/bash

set -e

# Hooks Synchronization Script (v2.0 - Platform-aware)
# Reads 'platforms' field from hooks.json to determine which hooks go where
# Cursor excluded by default - use Husky pre-commit instead

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m'

echo "🔄 Synchronizing hooks across platforms..."

# Validation
validate_sources() {
  echo "📋 Validating source files..."

  if [ ! -f "$PROJECT_ROOT/.agents/hooks/hooks.json" ]; then
    echo -e "${RED}❌ Source file not found: .agents/hooks/hooks.json${NC}"
    exit 1
  fi

  if [ ! -d "$PROJECT_ROOT/.agents/hooks/scripts" ]; then
    echo -e "${RED}❌ Scripts directory not found: .agents/hooks/scripts${NC}"
    exit 1
  fi

  # Validate JSON
  if ! jq empty "$PROJECT_ROOT/.agents/hooks/hooks.json" 2>/dev/null; then
    echo -e "${RED}❌ Invalid JSON: .agents/hooks/hooks.json${NC}"
    exit 1
  fi

  echo -e "${GREEN}  ✅ Source files validated${NC}"
}

# Generate Claude Code settings.json hooks section
generate_claude_hooks() {
  local source_file="$1"
  
  # Read hooks and filter by platform
  jq '{
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
                command: (.value.command | gsub("\\$\\{PLUGIN_ROOT\\}"; "${CLAUDE_PLUGIN_ROOT}")),
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
                command: (.value.command | gsub("\\$\\{PLUGIN_ROOT\\}"; "${CLAUDE_PLUGIN_ROOT}")),
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
                command: (.value.command | gsub("\\$\\{PLUGIN_ROOT\\}"; "${CLAUDE_PLUGIN_ROOT}")),
                timeout: .value.timeout
              }]
            }
          )
        )[]
      ]
    }
  } | .hooks | with_entries(select(.value | length > 0))' "$source_file"
}

# Generate Gemini CLI settings.json hooks section
generate_gemini_hooks() {
  local source_file="$1"
  
  # Read hooks, filter by platform, and convert to Gemini format
  jq '{
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
  } | .hooks | with_entries(select(.value | length > 0))' "$source_file"
}

# Generate Cursor hooks.json (only if hooks have cursor in platforms)
generate_cursor_hooks() {
  local source_file="$1"
  
  # Check if any hooks have cursor in platforms
  local cursor_hooks_count
  cursor_hooks_count=$(jq '[.hooks | to_entries[] | select(.value.platforms | index("cursor"))] | length' "$source_file")
  
  if [ "$cursor_hooks_count" -eq 0 ]; then
    # No hooks for Cursor - generate empty config with note
    cat <<'CURSOR_HOOKS'
{
  "version": 1,
  "_note": "Cursor hooks disabled - use Husky pre-commit instead (more reliable)",
  "hooks": {}
}
CURSOR_HOOKS
    return
  fi
  
  # If there are cursor hooks, generate them
  # Note: This branch currently won't execute since we exclude cursor from all hooks
  jq '{
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
  } | .hooks |= with_entries(select(.value | length > 0))' "$source_file"
}

# Sync Claude Code
sync_claude() {
  echo ""
  echo -e "${BLUE}🔄 Syncing hooks for Claude Code...${NC}"

  mkdir -p "$PROJECT_ROOT/.claude"

  # Create hooks directory symlink
  if [ -L "$PROJECT_ROOT/.claude/hooks" ] || [ -d "$PROJECT_ROOT/.claude/hooks" ]; then
    rm -rf "$PROJECT_ROOT/.claude/hooks"
  fi
  ln -s "../.agents/hooks" "$PROJECT_ROOT/.claude/hooks"
  echo -e "${GREEN}  ✅ Created hooks directory symlink${NC}"

  # Generate Claude hooks
  local claude_hooks
  claude_hooks=$(generate_claude_hooks "$PROJECT_ROOT/.agents/hooks/hooks.json")
  local hooks_count
  hooks_count=$(echo "$claude_hooks" | jq 'to_entries | length')

  # Merge hooks into settings.json
  local settings_file="$PROJECT_ROOT/.claude/settings.json"

  if [ -f "$settings_file" ]; then
    jq --argjson hooks "$claude_hooks" '.hooks = $hooks' "$settings_file" > "$settings_file.tmp"
    mv "$settings_file.tmp" "$settings_file"
  else
    echo "{\"hooks\": $claude_hooks}" | jq '.' > "$settings_file"
  fi

  echo -e "${GREEN}  ✅ Updated .claude/settings.json ($hooks_count hook types)${NC}"
}

# Sync Gemini CLI
sync_gemini() {
  echo ""
  echo -e "${BLUE}🔄 Syncing hooks for Gemini CLI...${NC}"

  mkdir -p "$PROJECT_ROOT/.gemini"

  # Create hooks directory symlink
  if [ -L "$PROJECT_ROOT/.gemini/hooks" ] || [ -d "$PROJECT_ROOT/.gemini/hooks" ]; then
    rm -rf "$PROJECT_ROOT/.gemini/hooks"
  fi
  ln -s "../.agents/hooks" "$PROJECT_ROOT/.gemini/hooks"
  echo -e "${GREEN}  ✅ Created hooks directory symlink${NC}"

  # Generate Gemini hooks
  local gemini_hooks
  gemini_hooks=$(generate_gemini_hooks "$PROJECT_ROOT/.agents/hooks/hooks.json")
  local hooks_count
  hooks_count=$(echo "$gemini_hooks" | jq 'to_entries | length')

  # Merge hooks into settings.json
  local settings_file="$PROJECT_ROOT/.gemini/settings.json"

  if [ -f "$settings_file" ]; then
    # Preserve experimental and context settings
    jq --argjson hooks "$gemini_hooks" '.hooks = $hooks' "$settings_file" > "$settings_file.tmp"
    mv "$settings_file.tmp" "$settings_file"
  else
    echo "{\"hooks\": $gemini_hooks}" | jq '.' > "$settings_file"
  fi

  echo -e "${GREEN}  ✅ Updated .gemini/settings.json ($hooks_count hook types)${NC}"
}

# Sync Cursor
sync_cursor() {
  echo ""
  echo -e "${BLUE}🔄 Syncing hooks for Cursor...${NC}"

  # Check if any hooks target cursor
  local cursor_hooks_count
  cursor_hooks_count=$(jq '[.hooks | to_entries[] | select(.value.platforms | index("cursor"))] | length' "$PROJECT_ROOT/.agents/hooks/hooks.json")

  if [ "$cursor_hooks_count" -eq 0 ]; then
    echo -e "${YELLOW}  ℹ️  No hooks configured for Cursor (using Husky pre-commit instead)${NC}"
  fi

  mkdir -p "$PROJECT_ROOT/.cursor"
  mkdir -p "$PROJECT_ROOT/.cursor/hooks"

  # Create hooks scripts symlink (still needed for manual testing)
  if [ -L "$PROJECT_ROOT/.cursor/hooks/scripts" ] || [ -d "$PROJECT_ROOT/.cursor/hooks/scripts" ]; then
    rm -rf "$PROJECT_ROOT/.cursor/hooks/scripts"
  fi
  ln -s "../../.agents/hooks/scripts" "$PROJECT_ROOT/.cursor/hooks/scripts"
  echo -e "${GREEN}  ✅ Created hooks scripts symlink${NC}"

  # Generate Cursor hooks.json
  local cursor_hooks
  cursor_hooks=$(generate_cursor_hooks "$PROJECT_ROOT/.agents/hooks/hooks.json")
  echo "$cursor_hooks" > "$PROJECT_ROOT/.cursor/hooks.json"
  
  local cursor_hook_count
  cursor_hook_count=$(echo "$cursor_hooks" | jq '.hooks | to_entries | length' 2>/dev/null || echo "0")
  
  if [ "$cursor_hook_count" -gt 0 ]; then
    echo -e "${GREEN}  ✅ Updated .cursor/hooks.json (auto-format enabled, Husky as backup)${NC}"
  else
    echo -e "${GREEN}  ✅ Updated .cursor/hooks.json (empty - Husky handles formatting/secrets)${NC}"
  fi
}

# Verification
verify_sync() {
  echo ""
  echo "🔍 Verifying synchronization..."

  local errors=0

  # Check Claude symlink
  if [ ! -L "$PROJECT_ROOT/.claude/hooks" ]; then
    echo -e "${RED}  ❌ Missing Claude hooks symlink${NC}"
    ((errors++))
  else
    echo -e "${GREEN}  ✅ Claude hooks symlink${NC}"
  fi

  # Check Gemini symlink
  if [ ! -L "$PROJECT_ROOT/.gemini/hooks" ]; then
    echo -e "${RED}  ❌ Missing Gemini hooks symlink${NC}"
    ((errors++))
  else
    echo -e "${GREEN}  ✅ Gemini hooks symlink${NC}"
  fi

  # Check Claude settings.json
  if ! jq -e '.hooks' "$PROJECT_ROOT/.claude/settings.json" > /dev/null 2>&1; then
    echo -e "${RED}  ❌ Missing hooks in .claude/settings.json${NC}"
    ((errors++))
  else
    local claude_count
    claude_count=$(jq '.hooks | to_entries | length' "$PROJECT_ROOT/.claude/settings.json")
    echo -e "${GREEN}  ✅ Claude settings.json has $claude_count hook types${NC}"
  fi

  # Check Gemini settings.json
  if ! jq -e '.hooks' "$PROJECT_ROOT/.gemini/settings.json" > /dev/null 2>&1; then
    echo -e "${RED}  ❌ Missing hooks in .gemini/settings.json${NC}"
    ((errors++))
  else
    local gemini_count
    gemini_count=$(jq '.hooks | to_entries | length' "$PROJECT_ROOT/.gemini/settings.json")
    echo -e "${GREEN}  ✅ Gemini settings.json has $gemini_count hook types${NC}"
  fi

  # Check Cursor hooks.json
  if [ -f "$PROJECT_ROOT/.cursor/hooks.json" ]; then
    local cursor_count
    cursor_count=$(jq '.hooks | to_entries | length' "$PROJECT_ROOT/.cursor/hooks.json" 2>/dev/null || echo "0")
    if [ "$cursor_count" -eq 0 ]; then
      echo -e "${GREEN}  ✅ Cursor hooks.json (empty - using Husky)${NC}"
    else
      echo -e "${GREEN}  ✅ Cursor hooks.json has $cursor_count hook types${NC}"
    fi
  else
    echo -e "${YELLOW}  ⚠️  No .cursor/hooks.json (OK if using Husky)${NC}"
  fi

  if [ $errors -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Hooks synchronized successfully!${NC}"
    echo ""
    echo "Summary:"
    echo "  • Claude Code: All hooks (Notification, PreToolUse, PostToolUse)"
    echo "  • Gemini CLI:  All hooks (Notification, BeforeTool, AfterTool)"
    if [ "$cursor_count" -gt 0 ]; then
      echo "  • Cursor:      auto-format only (best-effort, Husky guarantees)"
    else
      echo "  • Cursor:      No hooks (use Husky pre-commit for formatting/secrets)"
    fi
  else
    echo ""
    echo -e "${RED}❌ Synchronization completed with $errors error(s)${NC}"
    exit 1
  fi
}

# Main execution
main() {
  validate_sources
  sync_claude
  sync_gemini
  sync_cursor
  verify_sync
}

main
