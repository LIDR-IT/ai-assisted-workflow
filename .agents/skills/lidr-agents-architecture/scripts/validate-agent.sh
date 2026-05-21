#!/bin/bash

# validate-agent.sh
# Validates the structure and content of a subagent in .agents/subagents/
# (NOT .claude/agents/ — that's a symlink to the source of truth)

set -e

AGENT_NAME=$1
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../.." && pwd)"
AGENT_FILE="$PROJECT_ROOT/.agents/subagents/$AGENT_NAME.md"

if [ -z "$AGENT_NAME" ]; then
  echo "Usage: ./validate-agent.sh <agent-name>"
  echo ""
  echo "Example:"
  echo "  ./validate-agent.sh code-reviewer"
  echo "  ./validate-agent.sh lidr-qa-agent"
  exit 1
fi

echo "🔍 Validating subagent: $AGENT_NAME"
echo "   Source location: .agents/subagents/$AGENT_NAME.md"
echo ""

ERRORS=0

# Check 1: Agent file exists
if [ ! -f "$AGENT_FILE" ]; then
  echo "❌ Subagent file not found: $AGENT_FILE"
  echo ""
  echo "   Note: Source of truth is .agents/subagents/ (NOT .claude/agents/)."
  echo "   The .claude/agents/, .cursor/agents/, .gemini/agents/ paths are symlinks"
  echo "   to .agents/subagents/. Create the source file there and run:"
  echo "     ./.agents/sync.sh --only=agents"
  exit 1
else
  echo "✅ Subagent file exists at source"
fi

# Check 2: YAML frontmatter exists
if ! head -1 "$AGENT_FILE" | grep -q "^---$"; then
  echo "❌ Missing YAML frontmatter (should start with ---)"
  ((ERRORS++))
else
  echo "✅ YAML frontmatter present"
fi

# Check 3: Required field 'name' exists
if ! grep -q "^name:" "$AGENT_FILE"; then
  echo "❌ Missing required field: 'name' in frontmatter"
  ((ERRORS++))
else
  echo "✅ Field 'name' present"

  # Check 3b: name matches filename
  yaml_name=$(grep "^name:" "$AGENT_FILE" | head -1 | sed 's/^name:[[:space:]]*//' | tr -d '"' | tr -d "'" | xargs)
  if [ "$yaml_name" != "$AGENT_NAME" ]; then
    echo "❌ Field 'name: $yaml_name' does NOT match filename '$AGENT_NAME'"
    echo "   They MUST match. Fix either the YAML field or rename the file."
    ((ERRORS++))
  else
    echo "✅ Field 'name' matches filename"
  fi
fi

# Check 4: Required field 'description' exists
if ! grep -q "^description:" "$AGENT_FILE"; then
  echo "❌ Missing required field: 'description' in frontmatter"
  ((ERRORS++))
else
  echo "✅ Field 'description' present"
fi

# Check 5: Optional field 'tools' is valid (if present)
if grep -q "^tools:" "$AGENT_FILE"; then
  echo "ℹ️  Field 'tools' present"
  tools_line=$(grep "^tools:" "$AGENT_FILE" | head -1)
  # Valid formats:
  #   tools: Read, Edit, Grep, Bash         (inline comma-separated)
  #   tools: [Read, Edit, Grep, Bash]       (inline YAML list)
  #   tools:                                 (block YAML list — value empty, followed by - Item lines)
  #     - Read
  #     - Edit
  if echo "$tools_line" | grep -qE "(\[|,)"; then
    echo "✅ Tools field format: inline list/comma-separated"
  elif echo "$tools_line" | grep -qE "^tools:[[:space:]]*$"; then
    # Block list — check next line starts with whitespace + dash
    if grep -A1 "^tools:" "$AGENT_FILE" | tail -1 | grep -qE "^[[:space:]]+-"; then
      echo "✅ Tools field format: YAML block list"
    else
      echo "⚠️  Tools field is empty (use inline or block list)"
    fi
  else
    echo "⚠️  Tools field should be inline (comma/list) or YAML block list, e.g.:"
    echo "      tools: Read, Edit, Grep, Bash"
    echo "      tools: [Read, Edit, Grep, Bash]"
    echo "      tools:"
    echo "        - Read"
    echo "        - Edit"
  fi
fi

# Check 6: Optional field 'model' is valid (if present, Claude-specific)
if grep -q "^model:" "$AGENT_FILE"; then
  model=$(grep "^model:" "$AGENT_FILE" | awk '{print $2}')
  # Valid Claude Code values per official docs:
  #   sonnet, opus, haiku — specific model
  #   inherit — use parent session model (LIDR convention)
  if [[ "$model" == "sonnet" || "$model" == "opus" || "$model" == "haiku" || "$model" == "inherit" ]]; then
    echo "✅ Model field valid: $model (Claude-only; other platforms ignore)"
  else
    echo "⚠️  Model should be sonnet|opus|haiku|inherit (found: $model)"
  fi
fi

# Check 7: Optional field 'color' is valid (if present, Claude-specific)
if grep -q "^color:" "$AGENT_FILE"; then
  color=$(grep "^color:" "$AGENT_FILE" | awk '{print $2}')
  if [[ "$color" =~ ^(red|orange|yellow|green|blue|purple|pink)$ ]]; then
    echo "✅ Color field valid: $color (Claude-only; other platforms ignore)"
  else
    echo "⚠️  Color should be one of: red, orange, yellow, green, blue, purple, pink (found: $color)"
  fi
fi

# Check 8: File has content beyond frontmatter
line_count=$(wc -l < "$AGENT_FILE")
if [ "$line_count" -lt 10 ]; then
  echo "⚠️  Subagent file seems short (<10 lines). Consider adding system prompt content."
fi

# Check 9: Distribution status (informational)
echo ""
echo "── Distribution status ──"
for sym in ".claude/agents" ".cursor/agents" ".gemini/agents"; do
  full="$PROJECT_ROOT/$sym"
  if [ -L "$full" ]; then
    echo "✅ $sym is a symlink → $(readlink "$full")"
  else
    echo "⚠️  $sym is NOT a symlink (run: ./.agents/sync.sh --only=agents)"
  fi
done
copilot_copy="$PROJECT_ROOT/.github/agents/$AGENT_NAME.agent.md"
if [ -f "$copilot_copy" ]; then
  echo "✅ Copilot copy exists: .github/agents/$AGENT_NAME.agent.md"
else
  echo "⚠️  Copilot copy missing: .github/agents/$AGENT_NAME.agent.md (run: ./.agents/sync.sh --only=agents)"
fi

echo ""
echo "═══════════════════════════════"

if [ $ERRORS -eq 0 ]; then
  echo "✅ Subagent validation passed!"
  echo "═══════════════════════════════"
  echo ""
  echo "Note: This validates structure only."
  echo "Test agent behavior by triggering the matching task in a supported platform."
  echo "Supported: Claude Code, Cursor, Gemini CLI, Copilot (NOT Antigravity)."
  exit 0
else
  echo "❌ Found $ERRORS error(s)"
  echo "═══════════════════════════════"
  exit 1
fi
